import { adminDb } from "../_lib/firebaseAdmin.js";
import { handleError, json, requireAdminUid, requirePost } from "../_lib/http.js";
import { createPagedResponse, getUserDisplayNameMap, requireLimit, requireOptionalString, toIso } from "./_lib/common.js";

export default async function handler(req: any, res: any) {
  try {
    requirePost(req);
    await requireAdminUid(req);

    const payload = (req.body ?? {}) as Record<string, unknown>;
    const status = requireOptionalString(payload.status, "status");
    const cursor = requireOptionalString(payload.cursor, "cursor");
    const limit = requireLimit(payload.limit, 25, 100);

    let query = adminDb.collection("tradeOffers").orderBy("createdAt", "desc").limit(limit);
    if (status) {
      query = adminDb.collection("tradeOffers").where("status", "==", status).orderBy("createdAt", "desc").limit(limit);
    }

    if (cursor) {
      const cursorDoc = await adminDb.collection("tradeOffers").doc(cursor).get();
      if (cursorDoc.exists) {
        query = query.startAfter(cursorDoc);
      }
    }

    let snap = await query.get();
    if (snap.empty && !cursor) {
      let fallbackQuery: FirebaseFirestore.Query = adminDb.collection("tradeOffers").limit(limit);
      if (status) {
        fallbackQuery = adminDb.collection("tradeOffers").where("status", "==", status).limit(limit);
      }
      snap = await fallbackQuery.get();
    }
    const nameMap = await getUserDisplayNameMap(
      snap.docs.flatMap((docSnap) => {
        const data = docSnap.data() as Record<string, unknown>;
        return [String(data.fromUid ?? ""), String(data.toUid ?? "")];
      }),
    );
    const items = snap.docs.map((docSnap) => {
      const data = docSnap.data() as Record<string, unknown>;
      const fromUid = String(data.fromUid ?? "");
      const toUid = String(data.toUid ?? "");
      return {
        id: docSnap.id,
        listingId: String(data.listingId ?? ""),
        fromUid,
        fromName: nameMap.get(fromUid) ?? null,
        toUid,
        toName: nameMap.get(toUid) ?? null,
        tradeType: String(data.tradeType ?? ""),
        status: String(data.status ?? ""),
        cashAmount: typeof data.cashAmount === "number" ? data.cashAmount : null,
        createdAt: toIso(data.createdAt),
        updatedAt: toIso(data.updatedAt),
      };
    });

    return json(res, 200, createPagedResponse(snap.docs, items));
  } catch (error) {
    return handleError(res, error);
  }
}
