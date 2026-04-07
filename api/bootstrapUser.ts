import { FieldValue } from "firebase-admin/firestore";
import { adminDb } from "./_lib/firebaseAdmin";
import { handleError, json, requireAuthUid, requirePost } from "./_lib/http";

function asString(value: unknown, fallback = "") {
  return typeof value === "string" ? value : fallback;
}

export default async function handler(req: any, res: any) {
  try {
    requirePost(req);
    const uid = await requireAuthUid(req);
    const payload = (req.body ?? {}) as Record<string, unknown>;

    const userRef = adminDb.collection("users").doc(uid);
    const existingSnap = await userRef.get();
    const existing = existingSnap.data() as Record<string, unknown> | undefined;

    const email = asString(payload.email, asString(existing?.email));
    const displayName = asString(payload.displayName, email.split("@")[0] || "User");
    const photoURL = asString(payload.photoURL, asString(existing?.photoURL));
    const provider = asString(payload.provider, asString(existing?.provider, "email"));

    await userRef.set(
      {
        uid,
        uuid: uid,
        email,
        displayName,
        photoURL,
        provider,
        role: asString(existing?.role, "user"),
        favoriteLeagues: Array.isArray(existing?.favoriteLeagues) ? existing?.favoriteLeagues : [],
        sizePreferences: Array.isArray(existing?.sizePreferences) ? existing?.sizePreferences : [],
        theme: asString(existing?.theme, "system"),
        updatedAt: FieldValue.serverTimestamp(),
        createdAt: existing?.createdAt ?? FieldValue.serverTimestamp(),
      },
      { merge: true },
    );

    const finalSnap = await userRef.get();
    const data = (finalSnap.data() ?? {}) as Record<string, unknown>;

    return json(res, 200, {
      uid,
      uuid: uid,
      email: asString(data.email),
      displayName: asString(data.displayName, "User"),
      photoURL: asString(data.photoURL),
      provider: asString(data.provider, "email"),
      role: asString(data.role, "user"),
      favoriteLeagues: Array.isArray(data.favoriteLeagues) ? data.favoriteLeagues : [],
      sizePreferences: Array.isArray(data.sizePreferences) ? data.sizePreferences : [],
      theme: asString(data.theme, "system"),
    });
  } catch (error) {
    return handleError(res, error);
  }
}
