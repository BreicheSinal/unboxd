import crypto from "node:crypto";
import { FieldValue } from "firebase-admin/firestore";
import { adminDb } from "./_lib/firebaseAdmin";
import { ApiError, handleError, json } from "./_lib/http";

function safeEqual(a: string, b: string) {
  const left = Buffer.from(a, "utf8");
  const right = Buffer.from(b, "utf8");
  if (left.length !== right.length) return false;
  return crypto.timingSafeEqual(left, right);
}

export default async function handler(req: any, res: any) {
  try {
    if (req.method !== "POST") {
      throw new ApiError("method-not-allowed", "Method not allowed", 405);
    }

    const secret = process.env.WISH_WEBHOOK_SECRET;
    if (!secret) {
      throw new ApiError("failed-precondition", "Webhook secret not configured", 503);
    }

    const signature = String(req.headers["x-wish-signature"] ?? "");
    const body = req.body ?? {};
    const serialized = typeof body === "string" ? body : JSON.stringify(body);
    const expected = crypto.createHmac("sha256", secret).update(serialized).digest("hex");

    if (!safeEqual(signature, expected)) {
      throw new ApiError("unauthenticated", "Invalid signature", 401);
    }

    const orderId = typeof body.orderId === "string" ? body.orderId : "";
    const paymentStatus = typeof body.status === "string" ? body.status : "unknown";

    if (!orderId) {
      throw new ApiError("invalid-argument", "Missing orderId");
    }

    await adminDb.collection("orders").doc(orderId).set(
      {
        provider: "wish",
        paymentState: paymentStatus,
        reconciliationStatus: paymentStatus === "paid" ? "reconciled" : "pending",
        updatedAt: FieldValue.serverTimestamp(),
      },
      { merge: true },
    );

    await adminDb.collection("auditLogs").add({
      action: "wishWebhook",
      actorUid: "system",
      metadata: { orderId, paymentStatus },
      createdAt: FieldValue.serverTimestamp(),
    });

    return json(res, 200, { ok: true });
  } catch (error) {
    return handleError(res, error);
  }
}
