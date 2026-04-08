import { FieldValue } from "firebase-admin/firestore";
import { adminDb } from "./_lib/firebaseAdmin.js";
import {
  ApiError,
  createIdempotencyDocId,
  handleError,
  json,
  requireAuthUid,
  requirePost,
  requireString,
} from "./_lib/http.js";

export default async function handler(req: any, res: any) {
  try {
    requirePost(req);
    const uid = await requireAuthUid(req);
    const payload = (req.body ?? {}) as Record<string, unknown>;

    const offerId = requireString(payload.offerId, "offerId");
    const idempotencyKey = requireString(payload.idempotencyKey, "idempotencyKey");

    const result = await adminDb.runTransaction(async (tx) => {
      const idemRef = adminDb.collection("_idempotency").doc(createIdempotencyDocId("createTransactionFromTrade", uid, idempotencyKey));
      const idemSnap = await tx.get(idemRef);
      if (idemSnap.exists) {
        const data = idemSnap.data() as { result?: { transactionId: string } };
        if (data?.result) return data.result;
        throw new ApiError("aborted", "Duplicate request in progress", 409);
      }

      tx.create(idemRef, {
        scope: "createTransactionFromTrade",
        uid,
        key: idempotencyKey,
        status: "processing",
        createdAt: FieldValue.serverTimestamp(),
      });

      const offerRef = adminDb.collection("tradeOffers").doc(offerId);
      const offerSnap = await tx.get(offerRef);
      if (!offerSnap.exists) {
        throw new ApiError("not-found", "Trade offer not found.", 404);
      }

      const offer = offerSnap.data() as Record<string, unknown>;
      const fromUid = String(offer.fromUid ?? "");
      const toUid = String(offer.toUid ?? "");

      if (uid !== fromUid && uid !== toUid) {
        throw new ApiError("permission-denied", "Only participants can create trade transactions.", 403);
      }
      if (offer.status !== "completed") {
        throw new ApiError("failed-precondition", "Trade must be completed first.", 409);
      }

      const txRef = adminDb.collection("transactions").doc(`trade_${offerId}`);
      const txSnap = await tx.get(txRef);
      if (!txSnap.exists) {
        tx.create(txRef, {
          type: "trade",
          buyerUid: fromUid,
          sellerUid: toUid,
          listingId: String(offer.listingId ?? ""),
          offerId,
          amount: Number(offer.cashAmount ?? 0),
          currency: "USD",
          status: "completed",
          createdAt: FieldValue.serverTimestamp(),
        });
      }

      const output = { transactionId: txRef.id };
      tx.set(idemRef, { status: "done", result: output, finishedAt: FieldValue.serverTimestamp() }, { merge: true });
      return output;
    });

    await adminDb.collection("auditLogs").add({
      action: "createTransactionFromTrade",
      actorUid: uid,
      metadata: result,
      createdAt: FieldValue.serverTimestamp(),
    });

    return json(res, 200, result);
  } catch (error) {
    return handleError(res, error);
  }
}

