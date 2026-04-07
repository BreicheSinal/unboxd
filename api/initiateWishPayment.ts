import crypto from "node:crypto";
import { FieldValue } from "firebase-admin/firestore";
import { adminDb } from "./_lib/firebaseAdmin";
import { ApiError, handleError, json, requireAuthUid, requirePost, requireString } from "./_lib/http";

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

export default async function handler(req: any, res: any) {
  try {
    requirePost(req);
    const uid = await requireAuthUid(req);
    const payload = (req.body ?? {}) as Record<string, unknown>;

    const provider = requireString(payload.provider, "provider");
    if (provider !== "wish") {
      throw new ApiError("invalid-argument", "Provider must be 'wish'.");
    }

    const idempotencyKey = requireString(payload.idempotencyKey, "idempotencyKey");
    const billing = requireBilling(payload);
    const wishApiKey = process.env.WISH_API_KEY;
    if (!wishApiKey) {
      throw new ApiError("failed-precondition", "Wish payment is not configured yet.", 409);
    }

    const amount = typeof payload.amount === "number" && payload.amount > 0 ? payload.amount : 34.98;
    const sessionId = crypto.randomUUID();
    const response = {
      provider: "wish",
      sessionId,
      redirectUrl: `${process.env.WISH_API_BASE_URL ?? "https://wish-payments.example"}/checkout/${sessionId}`,
      amount,
      currency: "USD",
    };

    await adminDb.collection("auditLogs").add({
      action: "initiateWishPayment",
      actorUid: uid,
      metadata: { sessionId, amount, idempotencyKey, billing },
      createdAt: FieldValue.serverTimestamp(),
    });

    return json(res, 200, response);
  } catch (error) {
    return handleError(res, error);
  }
}
