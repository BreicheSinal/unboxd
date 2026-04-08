import { adminDb } from "../_lib/firebaseAdmin.js";
import { handleError, json, requireAdminUid, requirePost } from "../_lib/http.js";
import { createPagedResponse, requireLimit, requireOptionalString, toIso } from "./_lib/common.js";

export default async function handler(req: any, res: any) {
  try {
    requirePost(req);
    await requireAdminUid(req);

    const payload = (req.body ?? {}) as Record<string, unknown>;
    const cursor = requireOptionalString(payload.cursor, "cursor");
    const limit = requireLimit(payload.limit, 25, 100);
    const queryText = requireOptionalString(payload.query, "query")?.toLowerCase();

    let startAfterDoc: FirebaseFirestore.DocumentSnapshot | null = null;
    if (cursor) {
      const cursorDoc = await adminDb.collection("users").doc(cursor).get();
      if (cursorDoc.exists) {
        startAfterDoc = cursorDoc;
      }
    }

    if (!queryText) {
      let query = adminDb.collection("users").orderBy("updatedAt", "desc").limit(limit);
      if (startAfterDoc) {
        query = query.startAfter(startAfterDoc);
      }
      const snap = await query.get();
      const items = snap.docs.map((docSnap) => {
        const data = docSnap.data() as Record<string, unknown>;
        return {
          uid: docSnap.id,
          email: String(data.email ?? ""),
          displayName: String(data.displayName ?? ""),
          role: String(data.role ?? "user"),
          disabled: Boolean(data.disabled),
          createdAt: toIso(data.createdAt),
          updatedAt: toIso(data.updatedAt),
        };
      });
      return json(res, 200, createPagedResponse(snap.docs, items));
    }

    const items: Array<{
      uid: string;
      email: string;
      displayName: string;
      role: string;
      disabled: boolean;
      createdAt: string | null;
      updatedAt: string | null;
    }> = [];
    const batchSize = 100;
    let cursorForLoop = startAfterDoc;
    let hasMore = true;
    let nextCursor: string | null = null;

    while (items.length < limit && hasMore) {
      let query = adminDb.collection("users").orderBy("updatedAt", "desc").limit(batchSize);
      if (cursorForLoop) {
        query = query.startAfter(cursorForLoop);
      }

      const snap = await query.get();
      if (snap.empty) {
        hasMore = false;
        nextCursor = null;
        break;
      }

      cursorForLoop = snap.docs[snap.docs.length - 1] ?? null;
      hasMore = snap.size === batchSize;
      nextCursor = hasMore ? cursorForLoop?.id ?? null : null;

      for (const docSnap of snap.docs) {
        if (items.length >= limit) break;
        const data = docSnap.data() as Record<string, unknown>;
        const email = String(data.email ?? "").toLowerCase();
        const displayName = String(data.displayName ?? "").toLowerCase();
        if (!email.includes(queryText) && !displayName.includes(queryText)) continue;
        items.push({
          uid: docSnap.id,
          email: String(data.email ?? ""),
          displayName: String(data.displayName ?? ""),
          role: String(data.role ?? "user"),
          disabled: Boolean(data.disabled),
          createdAt: toIso(data.createdAt),
          updatedAt: toIso(data.updatedAt),
        });
      }
    }

    return json(res, 200, { items, nextCursor });
  } catch (error) {
    return handleError(res, error);
  }
}
