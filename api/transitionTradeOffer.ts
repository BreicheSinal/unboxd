import { FieldValue } from "firebase-admin/firestore";
import { adminDb } from "./_lib/firebaseAdmin";
import {
  ApiError,
  createIdempotencyDocId,
  handleError,
  json,
  requireAuthUid,
  requirePost,
  requireString,
} from "./_lib/http";
import { TRADE_TRANSITIONS, verifyTradeStatus } from "./_lib/domain";

export default async function handler(req: any, res: any) {
  try {
    requirePost(req);
    const uid = await requireAuthUid(req);
    const payload = (req.body ?? {}) as Record<string, unknown>;

    const offerId = requireString(payload.offerId, "offerId");
    const toStatus = verifyTradeStatus(payload.toStatus);
    const idempotencyKey = requireString(payload.idempotencyKey, "idempotencyKey");

    const result = await adminDb.runTransaction(async (tx) => {
      const idemRef = adminDb.collection("_idempotency").doc(createIdempotencyDocId("transitionTradeOffer", uid, idempotencyKey));
      const idemSnap = await tx.get(idemRef);
      if (idemSnap.exists) {
        const data = idemSnap.data() as { result?: { offerId: string; fromStatus: string; toStatus: string } };
        if (data?.result) return data.result;
        throw new ApiError("aborted", "Duplicate request in progress", 409);
      }

      tx.create(idemRef, {
        scope: "transitionTradeOffer",
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
      const currentStatus = String(offer.status ?? "pending");

      if (uid !== fromUid && uid !== toUid) {
        throw new ApiError("permission-denied", "Only participants can transition this trade.", 403);
      }

      const allowed = TRADE_TRANSITIONS[currentStatus as keyof typeof TRADE_TRANSITIONS] ?? [];
      if (!allowed.includes(toStatus)) {
        throw new ApiError("failed-precondition", `Invalid transition ${currentStatus} -> ${toStatus}.`, 409);
      }

      if (["accepted", "rejected"].includes(toStatus) && uid !== toUid) {
        throw new ApiError("permission-denied", "Only listing owner can accept or reject offers.", 403);
      }

      const timeline = Array.isArray(offer.timeline) ? offer.timeline : [];
      tx.update(offerRef, {
        status: toStatus,
        timeline: [...timeline, { status: toStatus, byUid: uid, at: new Date() }],
        updatedAt: FieldValue.serverTimestamp(),
      });

      if (toStatus === "completed") {
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
      }

      const output = { offerId, fromStatus: currentStatus, toStatus };
      tx.set(idemRef, { status: "done", result: output, finishedAt: FieldValue.serverTimestamp() }, { merge: true });
      return output;
    });

    await adminDb.collection("auditLogs").add({
      action: "transitionTradeOffer",
      actorUid: uid,
      metadata: result,
      createdAt: FieldValue.serverTimestamp(),
    });

    return json(res, 200, result);
  } catch (error) {
    return handleError(res, error);
  }
}
