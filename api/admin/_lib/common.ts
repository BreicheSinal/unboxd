import type { QueryDocumentSnapshot } from "firebase-admin/firestore";
import { ApiError } from "../../_lib/http.js";
import { adminDb } from "../../_lib/firebaseAdmin.js";

export function requireOptionalString(value: unknown, field: string) {
  if (value === undefined || value === null || value === "") return undefined;
  if (typeof value !== "string") {
    throw new ApiError("invalid-argument", `Invalid '${field}'.`, 400);
  }
  return value.trim();
}

export function requireOptionalBoolean(value: unknown, field: string) {
  if (value === undefined || value === null) return undefined;
  if (typeof value !== "boolean") {
    throw new ApiError("invalid-argument", `Invalid '${field}'.`, 400);
  }
  return value;
}

export function requireLimit(value: unknown, fallback = 25, max = 100) {
  if (value === undefined || value === null) return fallback;
  if (typeof value !== "number" || Number.isNaN(value) || value < 1 || value > max) {
    throw new ApiError("invalid-argument", "Invalid 'limit'.", 400);
  }
  return Math.floor(value);
}

export function toIso(value: unknown) {
  const asDate = typeof (value as { toDate?: unknown })?.toDate === "function"
    ? (value as { toDate: () => Date }).toDate()
    : value instanceof Date
      ? value
      : null;
  return asDate ? asDate.toISOString() : null;
}

export function createPagedResponse<T>(
  docs: QueryDocumentSnapshot[],
  items: T[],
) {
  const nextCursor = docs.length > 0 ? docs[docs.length - 1]?.id ?? null : null;
  return { items, nextCursor };
}

export async function getUserDisplayNameMap(
  uids: Array<string | null | undefined>,
): Promise<Map<string, string>> {
  const uniqueUids = Array.from(new Set(uids.filter((uid): uid is string => typeof uid === "string" && uid.length > 0)));
  if (uniqueUids.length === 0) {
    return new Map();
  }

  const refs = uniqueUids.map((uid) => adminDb.collection("users").doc(uid));
  const snaps = await adminDb.getAll(...refs);
  const names = new Map<string, string>();

  for (const snap of snaps) {
    if (!snap.exists) continue;
    const data = (snap.data() ?? {}) as Record<string, unknown>;
    const displayName = String(data.displayName ?? "").trim();
    const emailFallback = String(data.email ?? "").trim();
    names.set(snap.id, displayName || emailFallback || snap.id);
  }

  return names;
}
