import { FieldValue } from "firebase-admin/firestore";
import { adminDb } from "./_lib/firebaseAdmin.js";
import { deriveOrderTransactionStatus } from "./_lib/orderTransactions.js";
import {
  ApiError,
  createIdempotencyDocId,
  handleError,
  json,
  requireAuthUid,
  requirePost,
  requireString,
} from "./_lib/http.js";

function requireBilling(payload: Record<string, unknown>) {
  const billingInput = (payload.billing ?? {}) as Record<string, unknown>;
  return {
    fullName: requireString(billingInput.fullName, "billing.fullName"),
    email: requireString(billingInput.email, "billing.email"),
    phone: requireString(billingInput.phone, "billing.phone"),
    addressLine1: requireString(billingInput.addressLine1, "billing.addressLine1"),
    addressLine2: typeof billingInput.addressLine2 === "string" ? billingInput.addressLine2.trim() : "",
    city: requireString(billingInput.city, "billing.city"),
    state: typeof billingInput.state === "string" ? billingInput.state.trim() : "",
    postalCode: typeof billingInput.postalCode === "string" ? billingInput.postalCode.trim() : "",
    country: requireString(billingInput.country, "billing.country"),
  };
}

function asStringArray(value: unknown) {
  return Array.isArray(value)
    ? value
        .filter((item): item is string => typeof item === "string")
        .map((item) => item.trim())
        .filter(Boolean)
    : [];
}

export default async function handler(req: any, res: any) {
  try {
    requirePost(req);
    const uid = await requireAuthUid(req);
    const payload = (req.body ?? {}) as Record<string, unknown>;

    const size = requireString(payload.size, "size");
    const idempotencyKey = requireString(payload.idempotencyKey, "idempotencyKey");
    const billing = requireBilling(payload);
    const exclusionsInput = (payload.exclusions ?? {}) as Record<string, unknown>;
    const exclusions = {
      clubs: asStringArray(exclusionsInput.clubs),
      leagues: asStringArray(exclusionsInput.leagues),
      colors: asStringArray(exclusionsInput.colors),
    };

    const result = await adminDb.runTransaction(async (tx) => {
      const idemRef = adminDb.collection("_idempotency").doc(createIdempotencyDocId("createCodOrder", uid, idempotencyKey));
      const idemSnap = await tx.get(idemRef);
      if (idemSnap.exists) {
        const data = idemSnap.data() as { result?: { orderId: string; status: string } };
        if (data?.result) return data.result;
        throw new ApiError("aborted", "Duplicate request in progress", 409);
      }

      tx.create(idemRef, {
        scope: "createCodOrder",
        uid,
        key: idempotencyKey,
        status: "processing",
        createdAt: FieldValue.serverTimestamp(),
      });

      const orderRef = adminDb.collection("orders").doc();
      const orderStatus = "placed";
      const paymentState = "pending_collection";
      const reconciliationStatus = "n/a";
      tx.create(orderRef, {
        buyerUid: uid,
        provider: "cod",
        status: orderStatus,
        amount: 34.98,
        currency: "USD",
        size,
        exclusions,
        billing,
        paymentState,
        reconciliationStatus,
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      });

      const transactionRef = adminDb.collection("transactions").doc();
      tx.create(transactionRef, {
        type: "order",
        buyerUid: uid,
        amount: 34.98,
        currency: "USD",
        status: deriveOrderTransactionStatus({ status: orderStatus, paymentState, reconciliationStatus }),
        orderStatus,
        paymentState,
        reconciliationStatus,
        orderId: orderRef.id,
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      });

      const output = { orderId: orderRef.id, status: "placed" };
      tx.set(idemRef, { status: "done", result: output, finishedAt: FieldValue.serverTimestamp() }, { merge: true });
      return output;
    });

    await adminDb.collection("auditLogs").add({
      action: "createCodOrder",
      actorUid: uid,
      metadata: result,
      createdAt: FieldValue.serverTimestamp(),
    });

    return json(res, 200, result);
  } catch (error) {
    return handleError(res, error);
  }
}


