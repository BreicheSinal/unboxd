export type AuthProviderType = "google" | "email";

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  provider: AuthProviderType;
  role: "user" | "admin";
  favoriteLeagues: string[];
  sizePreferences: string[];
  theme: "light" | "dark" | "system";
  createdAt?: Date;
  updatedAt?: Date;
}

export type ClosetStatus = "owned" | "trading" | "sold";

export interface ClosetItem {
  id: string;
  ownerUid: string;
  team: string;
  league: string;
  size: string;
  condition: string;
  status: ClosetStatus;
  isDuplicate: boolean;
  imageUrl: string;
  storagePath?: string;
  acquiredAt?: Date;
  updatedAt?: Date;
}

export interface ListingTradeOptions {
  shirtForShirt: boolean;
  acceptsMoney: boolean;
  platformExchange: boolean;
}

export type ListingStatus =
  | "pending_approval"
  | "active"
  | "rejected"
  | "reserved"
  | "closed";

export interface MarketplaceListing {
  id: string;
  ownerUid: string;
  ownerName?: string;
  shirtRef?: string;
  shirtSnapshot: {
    team: string;
    league: string;
    size: string;
    imageUrl: string;
  };
  size: string;
  tradeOptions: ListingTradeOptions;
  priceAsk?: number;
  status: ListingStatus;
  createdAt?: Date;
  updatedAt?: Date;
}

export type TradeType = "shirt-for-shirt" | "shirt-plus-money" | "sell-for-money";
export type TradeStatus =
  | "pending"
  | "accepted"
  | "rejected"
  | "shipped"
  | "completed"
  | "cancelled";

export interface TradeOffer {
  id: string;
  listingId: string;
  fromUid: string;
  toUid: string;
  tradeType: TradeType;
  offeredShirtId?: string;
  cashAmount?: number;
  status: TradeStatus;
  timeline: Array<{ status: TradeStatus; at: Date; byUid: string }>;
  createdAt?: Date;
  updatedAt?: Date;
}

export type TransactionType = "order" | "trade" | "sale" | "purchase";

export interface TransactionRecord {
  id: string;
  type: TransactionType;
  buyerUid?: string;
  sellerUid?: string;
  listingId?: string;
  offerId?: string;
  amount: number;
  currency: string;
  status: string;
  createdAt?: Date;
}

export interface DashboardSummary {
  totalOrders: number;
  shirtsOwned: number;
  tradesMade: number;
  badgesEarned: number;
}
