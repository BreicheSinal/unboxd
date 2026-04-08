import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase/config";
import type { TradeOffer } from "../types/domain";
import { parseTimestamp } from "./firestoreUtils";
import { createTradeOfferCallable, transitionTradeOfferCallable } from "./functionsService";

function mapTradeOffer(id: string, data: Record<string, unknown>): TradeOffer {
  const timeline = Array.isArray(data.timeline)
    ? data.timeline.map((entry) => ({
        status: String((entry as any).status) as TradeOffer["status"],
        at: parseTimestamp((entry as any).at) ?? new Date(),
        byUid: String((entry as any).byUid ?? ""),
      }))
    : [];

  return {
    id,
    listingId: String(data.listingId ?? ""),
    fromUid: String(data.fromUid ?? ""),
    toUid: String(data.toUid ?? ""),
    tradeType: String(data.tradeType ?? "shirt-for-shirt") as TradeOffer["tradeType"],
    offeredShirtId: data.offeredShirtId ? String(data.offeredShirtId) : undefined,
    cashAmount: typeof data.cashAmount === "number" ? data.cashAmount : undefined,
    status: String(data.status ?? "pending") as TradeOffer["status"],
    timeline,
    createdAt: parseTimestamp(data.createdAt),
    updatedAt: parseTimestamp(data.updatedAt),
  };
}

function createIdempotencyKey(prefix: string) {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

export async function createTradeOffer(offer: Omit<TradeOffer, "id" | "timeline" | "status">) {
  const response = await createTradeOfferCallable({
    listingId: offer.listingId,
    toUid: offer.toUid,
    tradeType: offer.tradeType,
    offeredShirtId: offer.offeredShirtId,
    cashAmount: offer.cashAmount,
    idempotencyKey: createIdempotencyKey("trade-create"),
  });

  return response.offerId;
}

export async function transitionTradeOffer(offerId: string, toStatus: TradeOffer["status"]) {
  return transitionTradeOfferCallable({
    offerId,
    toStatus,
    idempotencyKey: createIdempotencyKey("trade-transition"),
  });
}

export async function getTradeOffersForUser(uid: string) {
  if (!db) return [] as TradeOffer[];

  const outboundQuery = query(collection(db, "tradeOffers"), where("fromUid", "==", uid));
  const inboundQuery = query(collection(db, "tradeOffers"), where("toUid", "==", uid));

  const [outboundSnap, inboundSnap] = await Promise.all([getDocs(outboundQuery), getDocs(inboundQuery)]);
  const mergedMap = new Map<string, TradeOffer>();

  [...outboundSnap.docs, ...inboundSnap.docs].forEach((item) => {
    mergedMap.set(item.id, mapTradeOffer(item.id, item.data()));
  });

  return [...mergedMap.values()].sort(
    (a, b) => (b.createdAt?.getTime() ?? 0) - (a.createdAt?.getTime() ?? 0),
  );
}
