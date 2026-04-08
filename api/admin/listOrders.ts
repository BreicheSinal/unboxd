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

    let query = adminDb.collection("orders").orderBy("createdAt", "desc").limit(limit);
    if (status) {
      query = adminDb.collection("orders").where("status", "==", status).orderBy("createdAt", "desc").limit(limit);
    }

    if (cursor) {
      const cursorDoc = await adminDb.collection("orders").doc(cursor).get();
      if (cursorDoc.exists) {
        query = query.startAfter(cursorDoc);
      }
    }

    const snap = await query.get();
    const buyerNames = await getUserDisplayNameMap(
      snap.docs.map((docSnap) => String((docSnap.data() as Record<string, unknown>).buyerUid ?? "")),
    );
    const items = snap.docs.map((docSnap) => {
      const data = docSnap.data() as Record<string, unknown>;
      const buyerUid = String(data.buyerUid ?? "");
      return {
        id: docSnap.id,
        buyerUid,
        buyerName: buyerNames.get(buyerUid) ?? null,
        provider: String(data.provider ?? ""),
        status: String(data.status ?? ""),
        paymentState: String(data.paymentState ?? ""),
        reconciliationStatus: String(data.reconciliationStatus ?? ""),
        amount: Number(data.amount ?? 0),
        currency: String(data.currency ?? "USD"),
        size: String(data.size ?? ""),
        createdAt: toIso(data.createdAt),
        updatedAt: toIso(data.updatedAt),
      };
    });

    return json(res, 200, createPagedResponse(snap.docs, items));
  } catch (error) {
    return handleError(res, error);
  }
}
