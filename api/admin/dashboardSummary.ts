import { adminDb } from "../_lib/firebaseAdmin.js";
import { handleError, json, requireAdminUid, requirePost } from "../_lib/http.js";

function sumAmounts(snapshot: FirebaseFirestore.QuerySnapshot<FirebaseFirestore.DocumentData>): number {
  return snapshot.docs.reduce((total, docSnap) => {
    if (String(docSnap.get("status") ?? "") !== "completed") {
      return total;
    }
    return total + Number(docSnap.get("amount") ?? 0);
  }, 0);
}

export default async function handler(req: any, res: any) {
  try {
    requirePost(req);
    await requireAdminUid(req);

    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfThirtyDays = new Date(now);
    startOfThirtyDays.setDate(startOfThirtyDays.getDate() - 30);

    const transactionsBase = adminDb.collection("transactions");

    const [
      pendingListingsAgg,
      pendingTradesAgg,
      pendingOrdersAgg,
      totalTransactionsAgg,
      completedTransactionsAgg,
      revenueTodaySnap,
      revenueMonthSnap,
      revenue30dSnap,
    ] = await Promise.all([
      adminDb.collection("marketplaceListings").where("status", "==", "pending_approval").count().get(),
      adminDb.collection("tradeOffers").where("status", "==", "pending").count().get(),
      adminDb.collection("orders").where("status", "in", ["placed", "pending"]).count().get(),
      adminDb.collection("transactions").count().get(),
      transactionsBase.where("status", "==", "completed").count().get(),
      transactionsBase.where("createdAt", ">=", startOfToday).get(),
      transactionsBase.where("createdAt", ">=", startOfMonth).get(),
      transactionsBase.where("createdAt", ">=", startOfThirtyDays).get(),
    ]);

    const completedTransactions = completedTransactionsAgg.data().count;
    const revenueToday = sumAmounts(revenueTodaySnap);
    const revenueMonthToDate = sumAmounts(revenueMonthSnap);
    const revenueLast30Days = sumAmounts(revenue30dSnap);
    const completedTransactionsLast30Days = revenue30dSnap.docs.filter(
      (docSnap) => String(docSnap.get("status") ?? "") === "completed",
    ).length;

    return json(res, 200, {
      pendingListings: pendingListingsAgg.data().count,
      pendingTrades: pendingTradesAgg.data().count,
      pendingOrders: pendingOrdersAgg.data().count,
      totalTransactions: totalTransactionsAgg.data().count,
      completedTransactions,
      revenueToday,
      revenueMonthToDate,
      revenueLast30Days,
      averageCompletedTransactionValue:
        completedTransactionsLast30Days > 0
          ? Number((revenueLast30Days / completedTransactionsLast30Days).toFixed(2))
          : 0,
      revenueCurrency: "USD",
    });
  } catch (error) {
    return handleError(res, error);
  }
}
