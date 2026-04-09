import { FieldValue } from "firebase-admin/firestore";
import { adminDb } from "./firebaseAdmin.js";

type OrderSnapshot = {
  status?: unknown;
  paymentState?: unknown;
  reconciliationStatus?: unknown;
};

export function deriveOrderTransactionStatus(order: OrderSnapshot) {
  const status = String(order.status ?? "");
  const paymentState = String(order.paymentState ?? "");
  const reconciliationStatus = String(order.reconciliationStatus ?? "");

  if (paymentState === "refunded") return "refunded";
  if (paymentState === "failed" || reconciliationStatus === "failed") return "failed";
  if (status === "cancelled") return paymentState === "paid" ? "refunded" : "failed";
  if (paymentState === "paid" || reconciliationStatus === "reconciled") return "completed";
  return "pending";
}

export async function syncOrderTransactions(orderId: string, order: OrderSnapshot) {
  const status = deriveOrderTransactionStatus(order);
  const querySnap = await adminDb.collection("transactions").where("orderId", "==", orderId).get();

  await Promise.all(
    querySnap.docs.map((docSnap) =>
      docSnap.ref.set(
        {
          status,
          orderStatus: String(order.status ?? ""),
          paymentState: String(order.paymentState ?? ""),
          reconciliationStatus: String(order.reconciliationStatus ?? ""),
          updatedAt: FieldValue.serverTimestamp(),
        },
        { merge: true },
      ),
    ),
  );

  return { syncedCount: querySnap.size, status };
}
