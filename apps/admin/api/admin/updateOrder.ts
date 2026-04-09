import { FieldValue } from "firebase-admin/firestore";
import { adminDb } from "../_lib/firebaseAdmin.js";
import { syncOrderTransactions } from "../_lib/orderTransactions.js";
import {
  ApiError,
  handleError,
  json,
  requireAdminUid,
  requirePost,
  requireString,
} from "../_lib/http.js";
import { requireOptionalString } from "./_lib/common.js";

const ORDER_STATUSES = new Set(["placed", "pending", "completed", "cancelled"]);
const ORDER_PAYMENT_STATES = new Set(["pending_collection", "pending", "paid", "failed", "refunded"]);
const ORDER_RECONCILIATION_STATES = new Set(["n/a", "pending", "reconciled", "failed"]);

function assertAllowedValue(
  value: string | undefined,
  field: string,
  allowed: Set<string>,
): string | undefined {
  if (!value) return undefined;
  if (!allowed.has(value)) {
    throw new ApiError("invalid-argument", `Invalid '${field}'.`, 400);
  }
  return value;
}

export default async function handler(req: any, res: any) {
  try {
    requirePost(req);
    const adminUid = await requireAdminUid(req);
    const payload = (req.body ?? {}) as Record<string, unknown>;

    const orderId = requireString(payload.orderId, "orderId");
    const status = assertAllowedValue(
      requireOptionalString(payload.status, "status"),
      "status",
      ORDER_STATUSES,
    );
    const paymentState = assertAllowedValue(
      requireOptionalString(payload.paymentState, "paymentState"),
      "paymentState",
      ORDER_PAYMENT_STATES,
    );
    const reconciliationStatus = assertAllowedValue(
      requireOptionalString(payload.reconciliationStatus, "reconciliationStatus"),
      "reconciliationStatus",
      ORDER_RECONCILIATION_STATES,
    );

    if (!status && !paymentState && !reconciliationStatus) {
      throw new ApiError("invalid-argument", "At least one mutable field is required.", 400);
    }

    const orderRef = adminDb.collection("orders").doc(orderId);
    const beforeSnap = await orderRef.get();
    if (!beforeSnap.exists) {
      throw new ApiError("not-found", "Order not found.", 404);
    }

    const updates: Record<string, unknown> = {
      updatedAt: FieldValue.serverTimestamp(),
    };
    if (status) updates.status = status;
    if (paymentState) updates.paymentState = paymentState;
    if (reconciliationStatus) updates.reconciliationStatus = reconciliationStatus;
    await orderRef.update(updates);

    const afterSnap = await orderRef.get();
    const syncResult = await syncOrderTransactions(orderId, (afterSnap.data() ?? {}) as Record<string, unknown>);
    await adminDb.collection("auditLogs").add({
      action: "admin.updateOrder",
      actorUid: adminUid,
      target: { type: "order", id: orderId },
      before: beforeSnap.data(),
      after: afterSnap.data(),
      metadata: syncResult,
      createdAt: FieldValue.serverTimestamp(),
    });

    return json(res, 200, { ok: true, orderId });
  } catch (error) {
    return handleError(res, error);
  }
}
