import { createCodOrderCallable, initiateWishPaymentCallable } from "./functionsService";

export type PaymentProvider = "cod" | "wish";

export interface CheckoutRequest {
  size: string;
  exclusions: {
    clubs: string[];
    leagues: string[];
    colors: string[];
  };
}

function getPaymentProvider(): PaymentProvider {
  const provider = (import.meta.env.VITE_PAYMENT_PROVIDER_DEFAULT || "cod") as PaymentProvider;
  const wishEnabled = import.meta.env.VITE_WISH_ENABLED === "true";

  if (provider === "wish" && wishEnabled) {
    return "wish";
  }

  return "cod";
}

function createIdempotencyKey(prefix: string) {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

export async function createOrder(request: CheckoutRequest) {
  const provider = getPaymentProvider();

  if (provider === "wish") {
    return initiateWishPaymentCallable({
      provider: "wish",
      amount: 34.98,
      idempotencyKey: createIdempotencyKey("wish"),
    });
  }

  return createCodOrderCallable({
    size: request.size,
    exclusions: request.exclusions,
    idempotencyKey: createIdempotencyKey("cod"),
  });
}
