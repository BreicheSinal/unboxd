import { FieldValue } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";
import { adminAuth, adminDb } from "../_lib/firebaseAdmin.js";
import {
  ApiError,
  handleError,
  json,
  requireAdminUid,
  requirePost,
  requireString,
} from "../_lib/http.js";

async function hasAnotherEnabledAdmin(excludedUid: string) {
  let pageToken: string | undefined;
  do {
    const result = await adminAuth.listUsers(1000, pageToken);
    for (const user of result.users) {
      if (user.uid === excludedUid) continue;
      if (user.customClaims?.admin === true && !user.disabled) {
        return true;
      }
    }
    pageToken = result.pageToken;
  } while (pageToken);

  return false;
}

async function deleteDocsByField(collectionName: string, field: string, value: string) {
  let deleted = 0;
  while (true) {
    const snap = await adminDb.collection(collectionName).where(field, "==", value).limit(200).get();
    if (snap.empty) break;
    const batch = adminDb.batch();
    snap.docs.forEach((docSnap) => batch.delete(docSnap.ref));
    await batch.commit();
    deleted += snap.size;
  }
  return deleted;
}

async function deleteMarketplaceListingsByOwner(uid: string) {
  const listingIds: string[] = [];
  let deleted = 0;
  while (true) {
    const snap = await adminDb.collection("marketplaceListings").where("ownerUid", "==", uid).limit(200).get();
    if (snap.empty) break;
    const batch = adminDb.batch();
    snap.docs.forEach((docSnap) => {
      listingIds.push(docSnap.id);
      batch.delete(docSnap.ref);
    });
    await batch.commit();
    deleted += snap.size;
  }
  return { deleted, listingIds };
}

async function deleteTradeOffersByListingIds(listingIds: string[]) {
  let deleted = 0;
  for (const listingId of listingIds) {
    deleted += await deleteDocsByField("tradeOffers", "listingId", listingId);
  }
  return deleted;
}

function isUserNotFoundError(error: unknown) {
  const code = typeof error === "object" && error && "code" in error ? String((error as { code?: unknown }).code ?? "") : "";
  return code.includes("user-not-found");
}

export default async function handler(req: any, res: any) {
  try {
    requirePost(req);
    const adminUid = await requireAdminUid(req);
    const payload = (req.body ?? {}) as Record<string, unknown>;
    const uid = requireString(payload.uid, "uid");

    if (uid === adminUid) {
      throw new ApiError("failed-precondition", "You cannot delete your own admin account.", 409);
    }

    let targetIsAdmin = false;
    try {
      const targetUser = await adminAuth.getUser(uid);
      targetIsAdmin = targetUser.customClaims?.admin === true;
    } catch (error) {
      if (!isUserNotFoundError(error)) throw error;
    }

    if (targetIsAdmin) {
      const anotherAdminExists = await hasAnotherEnabledAdmin(uid);
      if (!anotherAdminExists) {
        throw new ApiError("failed-precondition", "Cannot delete the last enabled admin account.", 409);
      }
    }

    await adminDb.recursiveDelete(adminDb.collection("users").doc(uid));

    const deletedOrders = await deleteDocsByField("orders", "buyerUid", uid);
    const { deleted: deletedListings, listingIds } = await deleteMarketplaceListingsByOwner(uid);
    const deletedOffersFrom = await deleteDocsByField("tradeOffers", "fromUid", uid);
    const deletedOffersTo = await deleteDocsByField("tradeOffers", "toUid", uid);
    const deletedOffersForListings = await deleteTradeOffersByListingIds(listingIds);
    const deletedTransactionsBuyer = await deleteDocsByField("transactions", "buyerUid", uid);
    const deletedTransactionsSeller = await deleteDocsByField("transactions", "sellerUid", uid);
    const deletedIdempotency = await deleteDocsByField("_idempotency", "uid", uid);
    const deletedAuditByActor = await deleteDocsByField("auditLogs", "actorUid", uid);
    const deletedAuditByTarget = await deleteDocsByField("auditLogs", "target.id", uid);

    const bucketName =
      process.env.FIREBASE_STORAGE_BUCKET ??
      process.env.VITE_FIREBASE_STORAGE_BUCKET ??
      `${process.env.FIREBASE_PROJECT_ID}.appspot.com`;
    const bucket = getStorage().bucket(bucketName);
    await bucket.deleteFiles({ prefix: `users/${uid}/`, force: true });
    await Promise.all(
      listingIds.map((listingId) => bucket.deleteFiles({ prefix: `marketplace/${listingId}/`, force: true })),
    );

    let authDeleted = false;
    try {
      await adminAuth.deleteUser(uid);
      authDeleted = true;
    } catch (error) {
      if (!isUserNotFoundError(error)) throw error;
    }

    const summary = {
      uid,
      authDeleted,
      deletedOrders,
      deletedListings,
      deletedOffersFrom,
      deletedOffersTo,
      deletedOffersForListings,
      deletedTransactionsBuyer,
      deletedTransactionsSeller,
      deletedIdempotency,
      deletedAuditByActor,
      deletedAuditByTarget,
    };

    await adminDb.collection("auditLogs").add({
      action: "admin.deleteUser",
      actorUid: adminUid,
      target: { type: "user", id: uid },
      metadata: summary,
      createdAt: FieldValue.serverTimestamp(),
    });

    return json(res, 200, { ok: true, ...summary });
  } catch (error) {
    return handleError(res, error);
  }
}
