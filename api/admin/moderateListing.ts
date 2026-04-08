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

export default async function handler(req: any, res: any) {
  try {
    requirePost(req);
    const adminUid = await requireAdminUid(req);
    const payload = (req.body ?? {}) as Record<string, unknown>;
    const listingId = requireString(payload.listingId, "listingId");
    const action = requireString(payload.action, "action");

    const toStatus = action === "approve" ? "active" : action === "reject" ? "rejected" : null;
    if (!toStatus) {
      throw new ApiError("invalid-argument", "action must be 'approve' or 'reject'.", 400);
    }

    const listingRef = adminDb.collection("marketplaceListings").doc(listingId);
    const beforeSnap = await listingRef.get();
    if (!beforeSnap.exists) {
      throw new ApiError("not-found", "Listing not found.", 404);
    }

    await listingRef.update({
      status: toStatus,
      updatedAt: FieldValue.serverTimestamp(),
      moderatedBy: adminUid,
      moderatedAt: FieldValue.serverTimestamp(),
    });

    const afterSnap = await listingRef.get();
    await adminDb.collection("auditLogs").add({
      action: "admin.moderateListing",
      actorUid: adminUid,
      target: { type: "marketplaceListing", id: listingId },
      before: beforeSnap.data(),
      after: afterSnap.data(),
      createdAt: FieldValue.serverTimestamp(),
    });

    return json(res, 200, { ok: true, listingId, status: toStatus });
  } catch (error) {
    return handleError(res, error);
  }
}
