import { FieldValue } from "firebase-admin/firestore";
import { adminDb } from "./_lib/firebaseAdmin.js";
import { handleError, json, requireAuthUid, requirePost } from "./_lib/http.js";

const DEFAULT_BADGES = [
  {
    id: "first-order",
    name: "First Order",
    icon: "🎉",
    description: "Complete your first mystery order",
  },
  {
    id: "collector",
    name: "Collector",
    icon: "🏆",
    description: "Own 10+ shirts",
  },
  {
    id: "trader",
    name: "Trader",
    icon: "🔄",
    description: "Complete 5 trades",
  },
  {
    id: "mystery-master",
    name: "Mystery Master",
    icon: "⭐",
    description: "Complete 15 orders",
  },
  {
    id: "global-fan",
    name: "Global Fan",
    icon: "🌍",
    description: "Collect shirts from 10 countries",
  },
  {
    id: "legend",
    name: "Legend",
    icon: "👑",
    description: "Complete 50 orders",
  },
] as const;

function asString(value: unknown, fallback = "") {
  return typeof value === "string" ? value : fallback;
}

function normalizePreferenceDocId(value: string): string {
  return value.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

async function readPreferenceCollection(
  uid: string,
  collectionName: "favoriteLeagues" | "sizePreferences",
): Promise<string[]> {
  const snap = await adminDb.collection("users").doc(uid).collection(collectionName).get();
  return snap.docs
    .map((docSnap) => docSnap.data()?.value)
    .filter((value): value is string => typeof value === "string" && value.length > 0);
}

async function ensurePreferenceCollection(
  uid: string,
  collectionName: "favoriteLeagues" | "sizePreferences",
  values: string[],
) {
  if (values.length === 0) return;

  await Promise.all(
    values.map((value, index) => {
      const baseId = normalizePreferenceDocId(value);
      const docId = baseId.length > 0 ? baseId : `item-${index + 1}`;
      return adminDb
        .collection("users")
        .doc(uid)
        .collection(collectionName)
        .doc(docId)
        .set(
          {
            value,
            updatedAt: FieldValue.serverTimestamp(),
            createdAt: FieldValue.serverTimestamp(),
          },
          { merge: true },
        );
    }),
  );
}

async function ensureBadgeCollection(uid: string) {
  const badgeCollectionRef = adminDb.collection("users").doc(uid).collection("badges");
  const existingSnap = await badgeCollectionRef.get();
  const existingIds = new Set(existingSnap.docs.map((docSnap) => docSnap.id));
  const missingBadges = DEFAULT_BADGES.filter((badge) => !existingIds.has(badge.id));
  if (missingBadges.length === 0) return;

  await Promise.all(
    missingBadges.map((badge, index) =>
      badgeCollectionRef.doc(badge.id).set(
        {
          ...badge,
          order: index + 1,
          earned: false,
          createdAt: FieldValue.serverTimestamp(),
          updatedAt: FieldValue.serverTimestamp(),
        },
        { merge: true },
      ),
    ),
  );
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
        theme: asString(existing?.theme, "system"),
        updatedAt: FieldValue.serverTimestamp(),
        createdAt: existing?.createdAt ?? FieldValue.serverTimestamp(),
      },
      { merge: true },
    );
    await ensureBadgeCollection(uid);

    const legacyFavoriteLeagues = Array.isArray(existing?.favoriteLeagues)
      ? (existing.favoriteLeagues as string[])
      : [];
    const legacySizePreferences = Array.isArray(existing?.sizePreferences)
      ? (existing.sizePreferences as string[])
      : [];

    const [favoriteLeagues, sizePreferences] = await Promise.all([
      readPreferenceCollection(uid, "favoriteLeagues"),
      readPreferenceCollection(uid, "sizePreferences"),
    ]);

    if (favoriteLeagues.length === 0 && legacyFavoriteLeagues.length > 0) {
      await ensurePreferenceCollection(uid, "favoriteLeagues", legacyFavoriteLeagues);
    }

    if (sizePreferences.length === 0 && legacySizePreferences.length > 0) {
      await ensurePreferenceCollection(uid, "sizePreferences", legacySizePreferences);
    }

    const finalSnap = await userRef.get();
    const data = (finalSnap.data() ?? {}) as Record<string, unknown>;
    const finalFavoriteLeagues =
      favoriteLeagues.length > 0 ? favoriteLeagues : await readPreferenceCollection(uid, "favoriteLeagues");
    const finalSizePreferences =
      sizePreferences.length > 0 ? sizePreferences : await readPreferenceCollection(uid, "sizePreferences");

    return json(res, 200, {
      uid,
      uuid: uid,
      email: asString(data.email),
      displayName: asString(data.displayName, "User"),
      photoURL: asString(data.photoURL),
      provider: asString(data.provider, "email"),
      role: asString(data.role, "user"),
      favoriteLeagues: finalFavoriteLeagues,
      sizePreferences: finalSizePreferences,
      theme: asString(data.theme, "system"),
    });
  } catch (error) {
    return handleError(res, error);
  }
}

