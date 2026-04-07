import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  where,
} from "firebase/firestore";
import { db } from "../firebase/config";
import type { ClosetItem } from "../types/domain";
import { parseTimestamp } from "./firestoreUtils";

function mapClosetItem(uid: string, id: string, data: Record<string, unknown>): ClosetItem {
  return {
    id,
    ownerUid: uid,
    team: String(data.team ?? ""),
    league: String(data.league ?? ""),
    size: String(data.size ?? "M"),
    condition: String(data.condition ?? "Good"),
    status: (data.status as ClosetItem["status"]) ?? "owned",
    isDuplicate: Boolean(data.isDuplicate),
    imageUrl: String(data.imageUrl ?? ""),
    storagePath: data.storagePath ? String(data.storagePath) : undefined,
    acquiredAt: parseTimestamp(data.acquiredAt),
    updatedAt: parseTimestamp(data.updatedAt),
  };
}

export function subscribeCloset(
  uid: string,
  callback: (items: ClosetItem[]) => void,
  status?: ClosetItem["status"],
  onError?: (error: Error) => void,
) {
  if (!db) {
    callback([]);
    return () => {};
  }

  const baseRef = collection(db, "users", uid, "closet");
  const closetQuery = status
    ? query(baseRef, where("status", "==", status), orderBy("updatedAt", "desc"))
    : query(baseRef, orderBy("updatedAt", "desc"));

  return onSnapshot(
    closetQuery,
    (snapshot) => {
      callback(snapshot.docs.map((item) => mapClosetItem(uid, item.id, item.data())));
    },
    (error) => {
      if (onError) {
        onError(error);
      }
    },
  );
}

export async function upsertClosetItem(uid: string, item: Omit<ClosetItem, "id" | "ownerUid"> & { id?: string }) {
  if (!db) throw new Error("Firestore is not configured");

  const closetRef = item.id
    ? doc(db, "users", uid, "closet", item.id)
    : doc(collection(db, "users", uid, "closet"));

  await setDoc(
    closetRef,
    {
      ...item,
      acquiredAt: item.acquiredAt ?? serverTimestamp(),
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );

  return closetRef.id;
}
