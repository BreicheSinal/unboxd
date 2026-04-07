import { User } from "firebase/auth";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "../firebase/config";
import type { UserProfile } from "../types/domain";

function mapProvider(providerId?: string): UserProfile["provider"] {
  return providerId === "google.com" ? "google" : "email";
}

function parseDate(input: unknown): Date | undefined {
  if (!input || typeof input !== "object") return undefined;
  const value = input as { toDate?: () => Date };
  return typeof value.toDate === "function" ? value.toDate() : undefined;
}

async function bootstrapUserProfileViaApi(firebaseUser: User): Promise<UserProfile> {
  const token = await firebaseUser.getIdToken();
  const response = await fetch("/api/bootstrapUser", {
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
    throw new Error(body.message || "Server user bootstrap failed");
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
        favoriteLeagues: existingData?.favoriteLeagues ?? [],
        sizePreferences: existingData?.sizePreferences ?? [],
        theme: existingData?.theme ?? "system",
        updatedAt: serverTimestamp(),
        createdAt: existingData?.createdAt ?? serverTimestamp(),
      },
      { merge: true },
    );

    const snap = await getDoc(userRef);
    const data = snap.data();

    return {
      uid: firebaseUser.uid,
      email: data?.email ?? firebaseUser.email ?? "",
      displayName: data?.displayName ?? firebaseUser.displayName ?? "User",
      photoURL: data?.photoURL ?? firebaseUser.photoURL ?? undefined,
      provider: data?.provider ?? mapProvider(firebaseUser.providerData[0]?.providerId),
      role: data?.role ?? "user",
      favoriteLeagues: data?.favoriteLeagues ?? [],
      sizePreferences: data?.sizePreferences ?? [],
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
