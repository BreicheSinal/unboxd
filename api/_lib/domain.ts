export type TradeType = "shirt-for-shirt" | "shirt-plus-money" | "sell-for-money";
export type TradeStatus = "pending" | "accepted" | "rejected" | "shipped" | "completed" | "cancelled";

export const TRADE_TRANSITIONS: Record<TradeStatus, TradeStatus[]> = {
  pending: ["accepted", "rejected", "cancelled"],
  accepted: ["shipped", "cancelled"],
  shipped: ["completed", "cancelled"],
  completed: [],
  rejected: [],
  cancelled: [],
};

export function verifyTradeType(value: unknown): TradeType {
  const allowed: TradeType[] = ["shirt-for-shirt", "shirt-plus-money", "sell-for-money"];
  if (!allowed.includes(value as TradeType)) {
    throw new Error("Invalid trade type");
  }
  return value as TradeType;
}

export function verifyTradeStatus(value: unknown): TradeStatus {
  const allowed: TradeStatus[] = ["pending", "accepted", "rejected", "shipped", "completed", "cancelled"];
  if (!allowed.includes(value as TradeStatus)) {
    throw new Error("Invalid trade status");
  }
  return value as TradeStatus;
}
