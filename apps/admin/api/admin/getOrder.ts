import { ApiError, handleError, json, requireAdminUid, requirePost, requireString } from "../_lib/http.js";
import { adminDb } from "../_lib/firebaseAdmin.js";
import { toIso } from "./_lib/common.js";

function serializeValue(value: unknown): unknown {
  if (value === null || value === undefined) return value;
  if (Array.isArray(value)) return value.map((item) => serializeValue(item));

  if (typeof (value as { toDate?: unknown })?.toDate === "function") {
    return toIso(value);
  }

  if (value instanceof Date) {
    return value.toISOString();
  }

  if (typeof value === "object") {
    const entries = Object.entries(value as Record<string, unknown>).map(([key, nested]) => [key, serializeValue(nested)]);
    return Object.fromEntries(entries);
  }

  return value;
}

export default async function handler(req: any, res: any) {
  try {
    requirePost(req);
    await requireAdminUid(req);

    const payload = (req.body ?? {}) as Record<string, unknown>;
    const orderId = requireString(payload.orderId, "orderId");

    const orderSnap = await adminDb.collection("orders").doc(orderId).get();
    if (!orderSnap.exists) {
      throw new ApiError("not-found", "Order not found.", 404);
    }

    const orderData = (orderSnap.data() ?? {}) as Record<string, unknown>;
    const buyerUid = String(orderData.buyerUid ?? "");

    let buyerName: string | null = null;
    let buyerEmail: string | null = null;
    if (buyerUid) {
      const buyerSnap = await adminDb.collection("users").doc(buyerUid).get();
      if (buyerSnap.exists) {
        const buyerData = (buyerSnap.data() ?? {}) as Record<string, unknown>;
        const displayName = String(buyerData.displayName ?? "").trim();
        const email = String(buyerData.email ?? "").trim();
        buyerName = displayName || email || buyerUid;
        buyerEmail = email || null;
      }
    }

    const txSnap = await adminDb.collection("transactions").where("orderId", "==", orderId).limit(50).get();
    const transactions = txSnap.docs
      .map((docSnap) => {
        const txData = docSnap.data() as Record<string, unknown>;
        return {
          id: docSnap.id,
          type: String(txData.type ?? ""),
          status: String(txData.status ?? ""),
          amount: Number(txData.amount ?? 0),
          currency: String(txData.currency ?? "USD"),
          createdAt: toIso(txData.createdAt),
          updatedAt: toIso(txData.updatedAt),
        };
      })
      .sort((left, right) => {
        const leftTime = left.createdAt ? Date.parse(left.createdAt) : 0;
        const rightTime = right.createdAt ? Date.parse(right.createdAt) : 0;
        return rightTime - leftTime;
      });

    const order = {
      id: orderSnap.id,
      buyerUid,
      buyerName,
      buyerEmail,
      provider: String(orderData.provider ?? ""),
      status: String(orderData.status ?? ""),
      paymentState: String(orderData.paymentState ?? ""),
      reconciliationStatus: String(orderData.reconciliationStatus ?? ""),
      orderType: String(orderData.orderType ?? "jersey"),
      amount: Number(orderData.amount ?? 0),
      currency: String(orderData.currency ?? "USD"),
      size: String(orderData.size ?? ""),
      createdAt: toIso(orderData.createdAt),
      updatedAt: toIso(orderData.updatedAt),
      raw: (serializeValue(orderData) ?? {}) as Record<string, unknown>,
    };

    return json(res, 200, { order, transactions });
  } catch (error) {
    return handleError(res, error);
  }
}
