import { getDocs, collection } from "firebase/firestore";
import { db } from "../firebase/config";
import type { DashboardSummary } from "../types/domain";
import { getTransactionsForUser } from "./transactionService";

export async function getDashboardSummary(uid: string): Promise<DashboardSummary> {
  if (!db) {
    return { totalOrders: 0, shirtsOwned: 0, tradesMade: 0, badgesEarned: 0 };
  }

  const [closetSnap, transactions] = await Promise.all([
    getDocs(collection(db, "users", uid, "closet")),
    getTransactionsForUser(uid),
  ]);

  const shirtsOwned = closetSnap.docs.filter((docSnap) => docSnap.data().status === "owned").length;
  const totalOrders = transactions.filter((item) => item.type === "order" || item.type === "purchase").length;
  const tradesMade = transactions.filter((item) => item.type === "trade" || item.type === "sale").length;

  return {
    totalOrders,
    shirtsOwned,
    tradesMade,
    badgesEarned: 0,
  };
}
