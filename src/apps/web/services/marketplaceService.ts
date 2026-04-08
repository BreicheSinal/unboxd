import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  where,
} from "firebase/firestore";
import { db } from "../firebase/config";
import type { MarketplaceListing } from "../types/domain";
import { parseTimestamp } from "./firestoreUtils";

function mapListing(id: string, data: Record<string, unknown>): MarketplaceListing {
  const shirtSnapshot = (data.shirtSnapshot ?? {}) as Record<string, unknown>;

  return {
    id,
    ownerUid: String(data.ownerUid ?? ""),
    ownerName: data.ownerName ? String(data.ownerName) : undefined,
    shirtRef: data.shirtRef ? String(data.shirtRef) : undefined,
    shirtSnapshot: {
      team: String(shirtSnapshot.team ?? ""),
      league: String(shirtSnapshot.league ?? ""),
      size: String(shirtSnapshot.size ?? "M"),
      imageUrl: String(shirtSnapshot.imageUrl ?? ""),
    },
    size: String(data.size ?? shirtSnapshot.size ?? "M"),
    tradeOptions: {
      shirtForShirt: Boolean((data.tradeOptions as any)?.shirtForShirt),
      acceptsMoney: Boolean((data.tradeOptions as any)?.acceptsMoney),
      platformExchange: Boolean((data.tradeOptions as any)?.platformExchange),
    },
    priceAsk: typeof data.priceAsk === "number" ? data.priceAsk : undefined,
    status: (data.status as MarketplaceListing["status"]) ?? "active",
    createdAt: parseTimestamp(data.createdAt),
    updatedAt: parseTimestamp(data.updatedAt),
  };
}

export async function getActiveListings() {
  if (!db) return [] as MarketplaceListing[];

  const listingQuery = query(
    collection(db, "marketplaceListings"),
    where("status", "==", "active"),
    orderBy("createdAt", "desc"),
  );
  const snapshot = await getDocs(listingQuery);
  return snapshot.docs.map((item) => mapListing(item.id, item.data()));
}

export async function getListingById(listingId: string) {
  if (!db) return null;

  const listingSnap = await getDoc(doc(db, "marketplaceListings", listingId));
  if (!listingSnap.exists()) return null;
  return mapListing(listingSnap.id, listingSnap.data());
}

export async function upsertMarketplaceListing(
  listing: Omit<MarketplaceListing, "id"> & { id?: string },
) {
  if (!db) throw new Error("Firestore is not configured");

  const listingRef = listing.id
    ? doc(db, "marketplaceListings", listing.id)
    : doc(collection(db, "marketplaceListings"));

  await setDoc(
    listingRef,
    {
      ...listing,
      status: listing.id ? listing.status : "pending_approval",
      createdAt: listing.createdAt ?? serverTimestamp(),
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );

  return listingRef.id;
}
