import { auth } from "../../web/firebase/config";
import type {
  AdminListing,
  AdminOrderDetailsResponse,
  AdminOrder,
  AdminSummary,
  AdminTrade,
  AdminTransaction,
  AdminUser,
  PagedResult,
} from "../types";

type RequestPayload = Record<string, unknown>;

async function getToken() {
  const user = auth?.currentUser;
  if (!user) throw new Error("Admin authentication required.");
  // Use cached token when valid; Firebase refreshes automatically near expiry.
  return user.getIdToken();
}

async function callAdminApi<T>(path: string, payload: RequestPayload = {}): Promise<T> {
  const token = await getToken();
  const response = await fetch(path, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  const data = (await response.json().catch(() => ({}))) as Record<string, unknown>;
  if (!response.ok) {
    throw new Error(String(data.message ?? "Admin API request failed."));
  }
  return data as T;
}

export function fetchAdminSummary() {
  return callAdminApi<AdminSummary>("/api/admin/dashboardSummary");
}

export function fetchAdminOrders(payload: RequestPayload = {}) {
  return callAdminApi<PagedResult<AdminOrder>>("/api/admin/listOrders", payload);
}

export function updateAdminOrder(payload: {
  orderId: string;
  status?: string;
  paymentState?: string;
  reconciliationStatus?: string;
}) {
  return callAdminApi<{ ok: boolean; orderId: string }>("/api/admin/updateOrder", payload);
}

export function fetchAdminOrderDetails(payload: { orderId: string }) {
  return callAdminApi<AdminOrderDetailsResponse>("/api/admin/getOrder", payload);
}

export function fetchAdminTransactions(payload: RequestPayload = {}) {
  return callAdminApi<PagedResult<AdminTransaction>>("/api/admin/listTransactions", payload);
}

export function fetchAdminListings(payload: RequestPayload = {}) {
  return callAdminApi<PagedResult<AdminListing>>("/api/admin/listListings", payload);
}

export function moderateAdminListing(payload: { listingId: string; action: "approve" | "reject" }) {
  return callAdminApi<{ ok: boolean; listingId: string; status: string }>("/api/admin/moderateListing", payload);
}

export function fetchAdminTrades(payload: RequestPayload = {}) {
  return callAdminApi<PagedResult<AdminTrade>>("/api/admin/listTrades", payload);
}

export function transitionAdminTrade(payload: { offerId: string; toStatus: string }) {
  return callAdminApi<{ ok: boolean; offerId: string; fromStatus: string; toStatus: string }>(
    "/api/admin/transitionTrade",
    payload,
  );
}

export function fetchAdminUsers(payload: RequestPayload = {}) {
  return callAdminApi<PagedResult<AdminUser>>("/api/admin/listUsers", payload);
}

export function setAdminUserAccess(payload: { uid: string; disabled: boolean }) {
  return callAdminApi<{ ok: boolean; uid: string; disabled: boolean }>("/api/admin/setUserAccess", payload);
}

export function deleteAdminUser(payload: { uid: string }) {
  return callAdminApi<{ ok: boolean; uid: string }>("/api/admin/deleteUser", payload);
}
