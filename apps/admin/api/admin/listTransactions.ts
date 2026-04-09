import { adminDb } from "../_lib/firebaseAdmin.js";
import { handleError, json, requireAdminUid, requirePost } from "../_lib/http.js";
import { createPagedResponse, getUserDisplayNameMap, requireLimit, requireOptionalString, toIso } from "./_lib/common.js";

export default async function handler(req: any, res: any) {
  try {
    requirePost(req);
    await requireAdminUid(req);
    const payload = (req.body ?? {}) as Record<string, unknown>;
    const status = requireOptionalString(payload.status, "status");
    const type = requireOptionalString(payload.type, "type");
    const cursor = requireOptionalString(payload.cursor, "cursor");
    const limit = requireLimit(payload.limit, 25, 100);

    let query: FirebaseFirestore.Query = adminDb.collection("transactions");
    if (status) query = query.where("status", "==", status);
    if (type) query = query.where("type", "==", type);
    query = query.orderBy("createdAt", "desc").limit(limit);

    if (cursor) {
      const cursorDoc = await adminDb.collection("transactions").doc(cursor).get();
      if (cursorDoc.exists) {
        query = query.startAfter(cursorDoc);
      }
    }

    const snap = await query.get();
    const nameMap = await getUserDisplayNameMap(
      snap.docs.flatMap((docSnap) => {
        const data = docSnap.data() as Record<string, unknown>;
        return [
          data.buyerUid ? String(data.buyerUid) : null,
          data.sellerUid ? String(data.sellerUid) : null,
        ];
      }),
    );
    const items = snap.docs.map((docSnap) => {
      const data = docSnap.data() as Record<string, unknown>;
      const buyerUid = data.buyerUid ? String(data.buyerUid) : null;
      const sellerUid = data.sellerUid ? String(data.sellerUid) : null;
      return {
        id: docSnap.id,
        type: String(data.type ?? ""),
        status: String(data.status ?? ""),
        amount: Number(data.amount ?? 0),
        currency: String(data.currency ?? "USD"),
        buyerUid,
        buyerName: buyerUid ? (nameMap.get(buyerUid) ?? null) : null,
        sellerUid,
        sellerName: sellerUid ? (nameMap.get(sellerUid) ?? null) : null,
        listingId: data.listingId ? String(data.listingId) : null,
        offerId: data.offerId ? String(data.offerId) : null,
        orderId: data.orderId ? String(data.orderId) : null,
        createdAt: toIso(data.createdAt),
      };
    });

    return json(res, 200, createPagedResponse(snap.docs, items));
  } catch (error) {
    return handleError(res, error);
  }
}
