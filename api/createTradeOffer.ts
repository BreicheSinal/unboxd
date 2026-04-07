import { FieldValue } from "firebase-admin/firestore";
import { adminDb } from "./_lib/firebaseAdmin";
import {
  ApiError,
  asOptionalNumber,
  createIdempotencyDocId,
  handleError,
  json,
  requireAuthUid,
  requirePost,
  requireString,
} from "./_lib/http";
import { verifyTradeType } from "./_lib/domain";

export default async function handler(req: any, res: any) {
  try {
    requirePost(req);
    const uid = await requireAuthUid(req);
    const payload = (req.body ?? {}) as Record<string, unknown>;

    const listingId = requireString(payload.listingId, "listingId");
    const toUid = requireString(payload.toUid, "toUid");
    const tradeType = verifyTradeType(payload.tradeType);
    const offeredShirtId = payload.offeredShirtId ? requireString(payload.offeredShirtId, "offeredShirtId") : undefined;
    const cashAmount = asOptionalNumber(payload.cashAmount, "cashAmount");
    const idempotencyKey = requireString(payload.idempotencyKey, "idempotencyKey");

    if (tradeType !== "sell-for-money" && !offeredShirtId) {
      throw new ApiError("invalid-argument", "offeredShirtId is required for non-cash trades.");
    }

    if (tradeType === "shirt-plus-money" && (cashAmount === undefined || cashAmount <= 0)) {
      throw new ApiError("invalid-argument", "cashAmount is required for shirt-plus-money trades.");
    }

    if (uid === toUid) {
      throw new ApiError("failed-precondition", "Cannot create trade offer to yourself.", 409);
    }

    const result = await adminDb.runTransaction(async (tx) => {
      const idemRef = adminDb.collection("_idempotency").doc(createIdempotencyDocId("createTradeOffer", uid, idempotencyKey));
      const idemSnap = await tx.get(idemRef);
      if (idemSnap.exists) {
        const data = idemSnap.data() as { result?: { offerId: string; status: string } };
        if (data?.result) return data.result;
        throw new ApiError("aborted", "Duplicate request in progress", 409);
      }

      tx.create(idemRef, {
        scope: "createTradeOffer",
        uid,
        key: idempotencyKey,
        status: "processing",
        createdAt: FieldValue.serverTimestamp(),
      });

      const listingRef = adminDb.collection("marketplaceListings").doc(listingId);
      const listingSnap = await tx.get(listingRef);
      if (!listingSnap.exists) {
        throw new ApiError("not-found", "Listing not found.", 404);
      }

      const listing = listingSnap.data() as Record<string, unknown>;
      if (listing.ownerUid !== toUid) {
        throw new ApiError("invalid-argument", "Listing owner mismatch.");
      }
      if (listing.status !== "active") {
        throw new ApiError("failed-precondition", "Listing is not active.", 409);
      }

      const offerRef = adminDb.collection("tradeOffers").doc();
      tx.create(offerRef, {
        listingId,
        fromUid: uid,
        toUid,
        tradeType,
        offeredShirtId: offeredShirtId ?? null,
        cashAmount: cashAmount ?? null,
        status: "pending",
        timeline: [{ status: "pending", byUid: uid, at: new Date() }],
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      });

      const output = { offerId: offerRef.id, status: "pending" };
      tx.set(idemRef, { status: "done", result: output, finishedAt: FieldValue.serverTimestamp() }, { merge: true });
      return output;
    });

    await adminDb.collection("auditLogs").add({
      action: "createTradeOffer",
      actorUid: uid,
      metadata: result,
      createdAt: FieldValue.serverTimestamp(),
    });

    return json(res, 200, result);
  } catch (error) {
    return handleError(res, error);
  }
}
