import { auth } from "../firebase/config";
import { mapFirebaseError } from "./errorService";

export interface CreateTradeOfferInput {
  listingId: string;
  toUid: string;
  tradeType: "shirt-for-shirt" | "shirt-plus-money" | "sell-for-money";
  offeredShirtId?: string;
  cashAmount?: number;
  idempotencyKey: string;
}

export interface TransitionTradeOfferInput {
  offerId: string;
  toStatus: "pending" | "accepted" | "rejected" | "shipped" | "completed" | "cancelled";
  idempotencyKey: string;
}

export interface CreateCodOrderInput {
  orderType: "jersey" | "artwork";
  size: string;
  exclusions: {
    clubs: string[];
    leagues: string[];
    colors: string[];
  };
  billing: {
    fullName: string;
    email: string;
    phone: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state?: string;
    postalCode?: string;
    country: string;
  };
  idempotencyKey: string;
}

export interface InitiateWishPaymentInput {
  provider: "wish";
  orderType: "jersey" | "artwork";
  amount: number;
  billing: {
    fullName: string;
    email: string;
    phone: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state?: string;
    postalCode?: string;
    country: string;
  };
  idempotencyKey: string;
}

async function getAuthToken() {
  const user = auth?.currentUser;
  if (!user) {
    throw new Error("unauthenticated");
  }
  return user.getIdToken();
}

async function callApi<TReq, TRes>(path: string, payload: TReq): Promise<TRes> {
  try {
    const token = await getAuthToken();
    const response = await fetch(path, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const body = (await response.json().catch(() => ({}))) as { code?: string; message?: string } & TRes;

    if (!response.ok) {
      throw { code: body.code || "unknown", message: body.message || "Request failed" };
    }

    return body as TRes;
  } catch (error) {
    throw new Error(mapFirebaseError(error));
  }
}

export async function createTradeOfferCallable(input: CreateTradeOfferInput) {
  return callApi<CreateTradeOfferInput, { offerId: string; status: string }>("/api/createTradeOffer", input);
}

export async function transitionTradeOfferCallable(input: TransitionTradeOfferInput) {
  return callApi<TransitionTradeOfferInput, { offerId: string; fromStatus: string; toStatus: string }>(
    "/api/transitionTradeOffer",
    input,
  );
}

export async function createCodOrderCallable(input: CreateCodOrderInput) {
  return callApi<CreateCodOrderInput, { orderId: string; status: string }>("/api/createCodOrder", input);
}

export async function initiateWishPaymentCallable(input: InitiateWishPaymentInput) {
  return callApi<
    InitiateWishPaymentInput,
    {
      provider: "wish";
      sessionId: string;
      redirectUrl: string;
      amount: number;
      currency: string;
    }
  >("/api/initiateWishPayment", input);
}
