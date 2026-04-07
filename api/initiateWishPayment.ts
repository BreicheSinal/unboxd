import crypto from "node:crypto";
import { FieldValue } from "firebase-admin/firestore";
import { adminDb } from "./_lib/firebaseAdmin";
import { ApiError, handleError, json, requireAuthUid, requirePost, requireString } from "./_lib/http";

export default async function handler(req: any, res: any) {
  try {
    requirePost(req);
    const uid = await requireAuthUid(req);
    const payload = (req.body ?? {}) as Record<string, unknown>;

    const provider = requireString(payload.provider, "provider");
    if (provider !== "wish") {
      throw new ApiError("invalid-argument", "Provider must be 'wish'.");
    }

    const idempotencyKey = requireString(payload.idempotencyKey, "idempotencyKey");
    const wishApiKey = process.env.WISH_API_KEY;
    if (!wishApiKey) {
      throw new ApiError("failed-precondition", "Wish payment is not configured yet.", 409);
    }

    const amount = typeof payload.amount === "number" && payload.amount > 0 ? payload.amount : 34.98;
    const sessionId = crypto.randomUUID();
    const response = {
      provider: "wish",
      sessionId,
      redirectUrl: `${process.env.WISH_API_BASE_URL ?? "https://wish-payments.example"}/checkout/${sessionId}`,
      amount,
      currency: "USD",
    };

    await adminDb.collection("auditLogs").add({
      action: "initiateWishPayment",
      actorUid: uid,
      metadata: { sessionId, amount, idempotencyKey },
      createdAt: FieldValue.serverTimestamp(),
    });

    return json(res, 200, response);
  } catch (error) {
    return handleError(res, error);
  }
}
