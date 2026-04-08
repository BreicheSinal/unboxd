import { User } from "firebase/auth";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { db } from "../firebase/config";
import type { UserProfile } from "../types/domain";

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

function mapProvider(providerId?: string): UserProfile["provider"] {
  return providerId === "google.com" ? "google" : "email";
}

function parseDate(input: unknown): Date | undefined {
  if (!input || typeof input !== "object") return undefined;
  const value = input as { toDate?: () => Date };
  return typeof value.toDate === "function" ? value.toDate() : undefined;
}

function normalizePreferenceDocId(value: string): string {
  return value.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

async function readPreferenceCollection(uid: string, collectionName: "favoriteLeagues" | "sizePreferences") {
  if (!db) return [];
  const snap = await getDocs(query(collection(db, "users", uid, collectionName)));
  return snap.docs
    .map((item) => item.data()?.value)
    .filter((item): item is string => typeof item === "string" && item.length > 0);
}

async function ensurePreferenceCollection(
  uid: string,
  collectionName: "favoriteLeagues" | "sizePreferences",
  values: string[],
) {
  if (!db || values.length === 0) return;
  await Promise.all(
    values.map((value, index) => {
      const baseId = normalizePreferenceDocId(value);
      const docId = baseId.length > 0 ? baseId : `item-${index + 1}`;
      return setDoc(
        doc(db, "users", uid, collectionName, docId),
        {
          value,
          updatedAt: serverTimestamp(),
          createdAt: serverTimestamp(),
        },
        { merge: true },
      );
    }),
  );
}

async function ensureBadgeCollection(uid: string) {
  if (!db) return;

  const badgesRef = collection(db, "users", uid, "badges");
  const existingSnap = await getDocs(query(badgesRef));
  const existingIds = new Set(existingSnap.docs.map((docSnap) => docSnap.id));

  const missingBadges = DEFAULT_BADGES.filter((badge) => !existingIds.has(badge.id));
  if (missingBadges.length === 0) return;

  await Promise.all(
    missingBadges.map((badge, index) =>
      setDoc(
        doc(db, "users", uid, "badges", badge.id),
        {
          ...badge,
          order: index + 1,
          earned: false,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        },
        { merge: true },
      ),
    ),
  );
}

async function bootstrapUserProfileViaApi(firebaseUser: User): Promise<UserProfile> {
  const token = await firebaseUser.getIdToken();
  const endpoint = "/api/bootstrapUser";
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      email: firebaseUser.email ?? "",
      displayName: firebaseUser.displayName ?? (firebaseUser.email?.split("@")[0] ?? "User"),
      photoURL: firebaseUser.photoURL ?? "",
      provider: mapProvider(firebaseUser.providerData[0]?.providerId),
    }),
  });

  if (!response.ok) {
    const body = (await response.json().catch(() => ({}))) as { message?: string };
    if (response.status === 404) {
      throw new Error(
        `Server user bootstrap failed: ${endpoint} returned 404. Ensure your local API server is running (for example, Vercel dev on port 3000 with Vite proxying /api).`,
      );
    }

    throw new Error(body.message || `Server user bootstrap failed (${response.status})`);
  }

  const data = (await response.json()) as Record<string, unknown>;
  return {
    uid: firebaseUser.uid,
    email: String(data.email ?? firebaseUser.email ?? ""),
    displayName: String(data.displayName ?? firebaseUser.displayName ?? "User"),
    photoURL: data.photoURL ? String(data.photoURL) : undefined,
    provider: (data.provider as UserProfile["provider"]) ?? mapProvider(firebaseUser.providerData[0]?.providerId),
    role: (data.role as UserProfile["role"]) ?? "user",
    favoriteLeagues: Array.isArray(data.favoriteLeagues) ? (data.favoriteLeagues as string[]) : [],
    sizePreferences: Array.isArray(data.sizePreferences) ? (data.sizePreferences as string[]) : [],
    theme: (data.theme as UserProfile["theme"]) ?? "system",
  };
}

export async function upsertUserProfile(firebaseUser: User): Promise<UserProfile> {
  if (!db) throw new Error("Firestore is not configured");

  try {
    const userRef = doc(db, "users", firebaseUser.uid);
    const existingSnap = await getDoc(userRef);
    const existingData = existingSnap.data();

    await setDoc(
      userRef,
      {
        uid: firebaseUser.uid,
        uuid: firebaseUser.uid,
        email: firebaseUser.email ?? "",
        displayName: firebaseUser.displayName ?? (firebaseUser.email?.split("@")[0] ?? "User"),
        photoURL: firebaseUser.photoURL ?? "",
        provider: mapProvider(firebaseUser.providerData[0]?.providerId),
        role: "user",
        theme: existingData?.theme ?? "system",
        updatedAt: serverTimestamp(),
        createdAt: existingData?.createdAt ?? serverTimestamp(),
      },
      { merge: true },
    );
    await ensureBadgeCollection(firebaseUser.uid);

    const legacyFavoriteLeagues = Array.isArray(existingData?.favoriteLeagues)
      ? (existingData.favoriteLeagues as string[])
      : [];
    const legacySizePreferences = Array.isArray(existingData?.sizePreferences)
      ? (existingData.sizePreferences as string[])
      : [];

    const [favoriteLeagues, sizePreferences] = await Promise.all([
      readPreferenceCollection(firebaseUser.uid, "favoriteLeagues"),
      readPreferenceCollection(firebaseUser.uid, "sizePreferences"),
    ]);

    if (favoriteLeagues.length === 0 && legacyFavoriteLeagues.length > 0) {
      await ensurePreferenceCollection(firebaseUser.uid, "favoriteLeagues", legacyFavoriteLeagues);
    }

    if (sizePreferences.length === 0 && legacySizePreferences.length > 0) {
      await ensurePreferenceCollection(firebaseUser.uid, "sizePreferences", legacySizePreferences);
    }

    const snap = await getDoc(userRef);
    const data = snap.data();
    const finalFavoriteLeagues =
      favoriteLeagues.length > 0
        ? favoriteLeagues
        : await readPreferenceCollection(firebaseUser.uid, "favoriteLeagues");
    const finalSizePreferences =
      sizePreferences.length > 0
        ? sizePreferences
        : await readPreferenceCollection(firebaseUser.uid, "sizePreferences");

    return {
      uid: firebaseUser.uid,
      email: data?.email ?? firebaseUser.email ?? "",
      displayName: data?.displayName ?? firebaseUser.displayName ?? "User",
      photoURL: data?.photoURL ?? firebaseUser.photoURL ?? undefined,
      provider: data?.provider ?? mapProvider(firebaseUser.providerData[0]?.providerId),
      role: data?.role ?? "user",
      favoriteLeagues: finalFavoriteLeagues,
      sizePreferences: finalSizePreferences,
      theme: data?.theme ?? "system",
      createdAt: parseDate(data?.createdAt),
      updatedAt: parseDate(data?.updatedAt),
    };
  } catch (error: unknown) {
    const code = (error as { code?: string } | null)?.code;
    if (code === "permission-denied" || code === "failed-precondition") {
      return bootstrapUserProfileViaApi(firebaseUser);
    }
    throw error;
  }
}
