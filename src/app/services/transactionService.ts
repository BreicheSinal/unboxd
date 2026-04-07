import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { db } from "../firebase/config";
import type { TransactionRecord } from "../types/domain";
import { parseTimestamp } from "./firestoreUtils";

function mapTransaction(id: string, data: Record<string, unknown>): TransactionRecord {
  return {
    id,
    type: String(data.type ?? "order") as TransactionRecord["type"],
    buyerUid: data.buyerUid ? String(data.buyerUid) : undefined,
    sellerUid: data.sellerUid ? String(data.sellerUid) : undefined,
    listingId: data.listingId ? String(data.listingId) : undefined,
    offerId: data.offerId ? String(data.offerId) : undefined,
    amount: typeof data.amount === "number" ? data.amount : 0,
    currency: String(data.currency ?? "USD"),
    status: String(data.status ?? "pending"),
    createdAt: parseTimestamp(data.createdAt),
  };
}

export async function getTransactionsForUser(uid: string) {
  if (!db) return [] as TransactionRecord[];

  const buyerQuery = query(
    collection(db, "transactions"),
    where("buyerUid", "==", uid),
    orderBy("createdAt", "desc"),
  );
  const sellerQuery = query(
    collection(db, "transactions"),
    where("sellerUid", "==", uid),
    orderBy("createdAt", "desc"),
  );

  const [buyerSnap, sellerSnap] = await Promise.all([getDocs(buyerQuery), getDocs(sellerQuery)]);
  const map = new Map<string, TransactionRecord>();
  [...buyerSnap.docs, ...sellerSnap.docs].forEach((item) => {
    map.set(item.id, mapTransaction(item.id, item.data()));
  });

  return [...map.values()].sort((a, b) => (b.createdAt?.getTime() ?? 0) - (a.createdAt?.getTime() ?? 0));
}
