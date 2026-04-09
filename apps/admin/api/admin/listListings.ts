import { adminDb } from "../_lib/firebaseAdmin.js";
import { handleError, json, requireAdminUid, requirePost } from "../_lib/http.js";
import { createPagedResponse, requireLimit, requireOptionalString, toIso } from "./_lib/common.js";

export default async function handler(req: any, res: any) {
  try {
    requirePost(req);
    await requireAdminUid(req);

    const payload = (req.body ?? {}) as Record<string, unknown>;
    const status = requireOptionalString(payload.status, "status");
    const cursor = requireOptionalString(payload.cursor, "cursor");
    const limit = requireLimit(payload.limit, 25, 100);

    let query: FirebaseFirestore.Query = adminDb.collection("marketplaceListings").orderBy("createdAt", "desc").limit(limit);
    if (status) {
      query = adminDb.collection("marketplaceListings").where("status", "==", status).orderBy("createdAt", "desc").limit(limit);
    }
    if (cursor) {
      const cursorDoc = await adminDb.collection("marketplaceListings").doc(cursor).get();
      if (cursorDoc.exists) {
        query = query.startAfter(cursorDoc);
      }
    }

    let snap = await query.get();
    if (snap.empty && !cursor) {
      let fallbackQuery: FirebaseFirestore.Query = adminDb.collection("marketplaceListings").limit(limit);
      if (status) {
        fallbackQuery = adminDb.collection("marketplaceListings").where("status", "==", status).limit(limit);
      }
      snap = await fallbackQuery.get();
    }
    const items = snap.docs.map((docSnap) => {
      const data = docSnap.data() as Record<string, unknown>;
      return {
        id: docSnap.id,
        ownerUid: String(data.ownerUid ?? ""),
        ownerName: String(data.ownerName ?? ""),
        size: String(data.size ?? ""),
        status: String(data.status ?? ""),
        shirtSnapshot: data.shirtSnapshot ?? {},
        createdAt: toIso(data.createdAt),
        updatedAt: toIso(data.updatedAt),
      };
    });

    return json(res, 200, createPagedResponse(snap.docs, items));
  } catch (error) {
    return handleError(res, error);
  }
}
