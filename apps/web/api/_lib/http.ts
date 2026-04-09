import type { IncomingMessage } from "http";
import { adminAuth } from "./firebaseAdmin.js";
import type { DecodedIdToken } from "firebase-admin/auth";

export class ApiError extends Error {
  code: string;
  status: number;

  constructor(code: string, message: string, status = 400) {
    super(message);
    this.code = code;
    this.status = status;
  }
}

export function json(res: any, status: number, payload: Record<string, unknown>) {
  res.status(status).json(payload);
}

export function requirePost(req: any) {
  if (req.method !== "POST") {
    throw new ApiError("method-not-allowed", "Method not allowed", 405);
  }
}

export function requireString(value: unknown, field: string) {
  if (typeof value !== "string" || !value.trim()) {
    throw new ApiError("invalid-argument", `Missing or invalid '${field}'.`, 400);
  }
  return value.trim();
}

export function asOptionalNumber(value: unknown, field: string) {
  if (value === undefined || value === null) return undefined;
  if (typeof value !== "number" || Number.isNaN(value) || value < 0) {
    throw new ApiError("invalid-argument", `Invalid '${field}'.`, 400);
  }
  return value;
}

export async function requireAuthUid(req: IncomingMessage & { headers: Record<string, string | string[] | undefined> }) {
  const decoded = await requireAuthToken(req);
  return decoded.uid;
}

export async function requireAuthToken(
  req: IncomingMessage & { headers: Record<string, string | string[] | undefined> },
): Promise<DecodedIdToken> {
  const header = req.headers.authorization;
  const authHeader = Array.isArray(header) ? header[0] : header;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new ApiError("unauthenticated", "Authentication required.", 401);
  }

  const token = authHeader.slice("Bearer ".length).trim();
  try {
    return await adminAuth.verifyIdToken(token, true);
  } catch {
    throw new ApiError("unauthenticated", "Invalid or expired authentication token.", 401);
  }
}

export async function requireAdminUid(
  req: IncomingMessage & { headers: Record<string, string | string[] | undefined> },
) {
  const decoded = await requireAuthToken(req);
  if (decoded.admin !== true) {
    throw new ApiError("permission-denied", "Admin privileges required.", 403);
  }
  return decoded.uid;
}

export function handleError(res: any, error: unknown) {
  if (error instanceof ApiError) {
    return json(res, error.status, { code: error.code, message: error.message });
  }

  const message = error instanceof Error ? error.message : "Internal server error";
  return json(res, 500, { code: "internal", message });
}

export function createIdempotencyDocId(scope: string, uid: string, key: string) {
  return `${scope}:${uid}:${key}`;
}

