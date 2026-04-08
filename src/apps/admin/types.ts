export interface AdminSummary {
  pendingListings: number;
  pendingTrades: number;
  pendingOrders: number;
  totalTransactions: number;
  completedTransactions: number;
  revenueToday: number;
  revenueMonthToDate: number;
  revenueLast30Days: number;
  averageCompletedTransactionValue: number;
  revenueCurrency: string;
}

export interface AdminOrder {
  id: string;
  buyerUid: string;
  buyerName: string | null;
  provider: string;
  status: string;
  paymentState: string;
  reconciliationStatus: string;
  amount: number;
  currency: string;
  size: string;
  createdAt: string | null;
  updatedAt: string | null;
}

export interface AdminOrderDetails extends AdminOrder {
  buyerEmail: string | null;
  raw: Record<string, unknown>;
}

export interface AdminOrderTransaction {
  id: string;
  type: string;
  status: string;
  amount: number;
  currency: string;
  createdAt: string | null;
  updatedAt: string | null;
}

export interface AdminOrderDetailsResponse {
  order: AdminOrderDetails;
  transactions: AdminOrderTransaction[];
}

export interface AdminTransaction {
  id: string;
  type: string;
  status: string;
  amount: number;
  currency: string;
  buyerUid: string | null;
  buyerName: string | null;
  sellerUid: string | null;
  sellerName: string | null;
  listingId: string | null;
  offerId: string | null;
  orderId: string | null;
  createdAt: string | null;
}

export interface AdminListing {
  id: string;
  ownerUid: string;
  ownerName: string;
  size: string;
  status: string;
  shirtSnapshot: Record<string, unknown>;
  createdAt: string | null;
  updatedAt: string | null;
}

export interface AdminTrade {
  id: string;
  listingId: string;
  fromUid: string;
  fromName: string | null;
  toUid: string;
  toName: string | null;
  tradeType: string;
  status: string;
  cashAmount: number | null;
  createdAt: string | null;
  updatedAt: string | null;
}

export interface AdminUser {
  uid: string;
  email: string;
  displayName: string;
  role: string;
  disabled: boolean;
  createdAt: string | null;
  updatedAt: string | null;
}

export interface PagedResult<T> {
  items: T[];
  nextCursor: string | null;
}
