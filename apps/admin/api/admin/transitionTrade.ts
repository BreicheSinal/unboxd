import { FieldValue } from "firebase-admin/firestore";
import { adminDb } from "../_lib/firebaseAdmin.js";
import {
  ApiError,
  handleError,
  json,
  requireAdminUid,
  requirePost,
  requireString,
} from "../_lib/http.js";
import { TRADE_TRANSITIONS, verifyTradeStatus } from "../_lib/domain.js";

export default async function handler(req: any, res: any) {
  try {
    requirePost(req);
    const adminUid = await requireAdminUid(req);
    const payload = (req.body ?? {}) as Record<string, unknown>;
    const offerId = requireString(payload.offerId, "offerId");
    const toStatus = verifyTradeStatus(payload.toStatus);

    const offerRef = adminDb.collection("tradeOffers").doc(offerId);
    const beforeSnap = await offerRef.get();
    if (!beforeSnap.exists) {
      throw new ApiError("not-found", "Trade offer not found.", 404);
    }

    const offer = beforeSnap.data() as Record<string, unknown>;
    const fromStatus = String(offer.status ?? "pending");
    const allowed = TRADE_TRANSITIONS[fromStatus as keyof typeof TRADE_TRANSITIONS] ?? [];
    if (!allowed.includes(toStatus)) {
      throw new ApiError("failed-precondition", `Invalid transition ${fromStatus} -> ${toStatus}.`, 409);
    }

    const timeline = Array.isArray(offer.timeline) ? offer.timeline : [];
    await offerRef.update({
      status: toStatus,
      timeline: [...timeline, { status: toStatus, byUid: adminUid, at: new Date() }],
      updatedAt: FieldValue.serverTimestamp(),
      moderatedBy: adminUid,
    });

    if (toStatus === "completed") {
      const txRef = adminDb.collection("transactions").doc(`trade_${offerId}`);
      const txSnap = await txRef.get();
      if (!txSnap.exists) {
        await txRef.set({
          type: "trade",
          buyerUid: String(offer.fromUid ?? ""),
          sellerUid: String(offer.toUid ?? ""),
          listingId: String(offer.listingId ?? ""),
          offerId,
          amount: Number(offer.cashAmount ?? 0),
          currency: "USD",
          status: "completed",
          createdAt: FieldValue.serverTimestamp(),
        });
      }
    }

    const afterSnap = await offerRef.get();
    await adminDb.collection("auditLogs").add({
      action: "admin.transitionTrade",
      actorUid: adminUid,
      target: { type: "tradeOffer", id: offerId },
      before: beforeSnap.data(),
      after: afterSnap.data(),
      createdAt: FieldValue.serverTimestamp(),
    });

    return json(res, 200, { ok: true, offerId, fromStatus, toStatus });
  } catch (error) {
    return handleError(res, error);
  }
}
