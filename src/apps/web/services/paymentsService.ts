import { createCodOrderCallable, initiateWishPaymentCallable } from "./functionsService";

export type PaymentProvider = "cod" | "wish";
export type OrderType = "jersey" | "artwork";

export interface BillingDetails {
  fullName: string;
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state?: string;
  postalCode?: string;
  country: string;
}

export interface CheckoutRequest {
  orderType: OrderType;
  size: string;
  exclusions: {
    clubs: string[];
    leagues: string[];
    colors: string[];
  };
  paymentProvider: PaymentProvider;
  billing: BillingDetails;
}

function isWishEnabled() {
  return import.meta.env.VITE_WISH_ENABLED === "true";
}

function createIdempotencyKey(prefix: string) {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

export async function createOrder(request: CheckoutRequest) {
  const provider = request.paymentProvider === "wish" && isWishEnabled() ? "wish" : "cod";

  if (provider === "wish") {
    return initiateWishPaymentCallable({
      provider: "wish",
      orderType: request.orderType,
      amount: 34.98,
      billing: request.billing,
      idempotencyKey: createIdempotencyKey("wish"),
    });
  }

  return createCodOrderCallable({
    orderType: request.orderType,
    size: request.size,
    exclusions: request.exclusions,
    billing: request.billing,
    idempotencyKey: createIdempotencyKey("cod"),
  });
}
