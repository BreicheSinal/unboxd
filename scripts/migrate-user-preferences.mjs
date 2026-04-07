import { cert, getApps, initializeApp } from "firebase-admin/app";
import { FieldValue, getFirestore } from "firebase-admin/firestore";

const projectId = process.env.FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

if (!projectId || !clientEmail || !privateKey) {
  throw new Error(
    "Missing Firebase Admin credentials. Set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY.",
  );
}

if (getApps().length === 0) {
  initializeApp({
    credential: cert({
      projectId,
      clientEmail,
      privateKey,
    }),
  });
}

const db = getFirestore();
const dryRun = process.argv.includes("--dry-run");
const keepLegacy = process.argv.includes("--keep-legacy");
const DEFAULT_BADGES = [
  {
    id: "first-order",
    name: "First Order",
    icon: "🎉",
    description: "Complete your first mystery order",
  },
  {
    id: "collector",
    name: "Collector",
    icon: "🏆",
    description: "Own 10+ shirts",
  },
  {
    id: "trader",
    name: "Trader",
    icon: "🔄",
    description: "Complete 5 trades",
  },
  {
    id: "mystery-master",
    name: "Mystery Master",
    icon: "⭐",
    description: "Complete 15 orders",
  },
  {
    id: "global-fan",
    name: "Global Fan",
    icon: "🌍",
    description: "Collect shirts from 10 countries",
  },
  {
    id: "legend",
    name: "Legend",
    icon: "👑",
    description: "Complete 50 orders",
  },
];

function normalizePreferenceDocId(value) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function migrateCollection(userRef, collectionName, values) {
  if (!Array.isArray(values) || values.length === 0) return 0;

  if (dryRun) return values.length;

  await Promise.all(
    values.map((value, index) => {
      if (typeof value !== "string" || value.length === 0) return Promise.resolve();

      const baseId = normalizePreferenceDocId(value);
      const docId = baseId.length > 0 ? baseId : `item-${index + 1}`;

      return userRef.collection(collectionName).doc(docId).set(
        {
          value,
          updatedAt: FieldValue.serverTimestamp(),
          createdAt: FieldValue.serverTimestamp(),
        },
        { merge: true },
      );
    }),
  );

  return values.length;
}

async function ensureBadgesCollection(userRef) {
  const badgesRef = userRef.collection("badges");
  const existing = await badgesRef.get();
  const existingIds = new Set(existing.docs.map((docSnap) => docSnap.id));
  const missingBadges = DEFAULT_BADGES.filter((badge) => !existingIds.has(badge.id));

  if (missingBadges.length === 0) return 0;
  if (dryRun) return missingBadges.length;

  await Promise.all(
    missingBadges.map((badge, index) =>
      badgesRef.doc(badge.id).set(
        {
          ...badge,
          order: index + 1,
          earned: false,
          updatedAt: FieldValue.serverTimestamp(),
          createdAt: FieldValue.serverTimestamp(),
        },
        { merge: true },
      ),
    ),
  );

  return missingBadges.length;
}

async function main() {
  const usersSnap = await db.collection("users").get();

  let migratedUsers = 0;
  let favoritesWritten = 0;
  let sizesWritten = 0;
  let badgesCreated = 0;
  let legacyFieldsRemoved = 0;

  for (const userDoc of usersSnap.docs) {
    const data = userDoc.data() ?? {};
    const userRef = db.collection("users").doc(userDoc.id);

    const favorites = await migrateCollection(userRef, "favoriteLeagues", data.favoriteLeagues);
    const sizes = await migrateCollection(userRef, "sizePreferences", data.sizePreferences);
    const badges = await ensureBadgesCollection(userRef);

    if (favorites > 0 || sizes > 0 || badges > 0) {
      migratedUsers += 1;
      favoritesWritten += favorites;
      sizesWritten += sizes;
      badgesCreated += badges;
    }

    const hasLegacyFavorites = Array.isArray(data.favoriteLeagues);
    const hasLegacySizes = Array.isArray(data.sizePreferences);
    const shouldRemoveLegacy = !keepLegacy && (hasLegacyFavorites || hasLegacySizes);

    if (!dryRun && shouldRemoveLegacy) {
      await userRef.set(
        {
          favoriteLeagues: FieldValue.delete(),
          sizePreferences: FieldValue.delete(),
        },
        { merge: true },
      );
      legacyFieldsRemoved += 1;
    } else if (dryRun && shouldRemoveLegacy) {
      legacyFieldsRemoved += 1;
    }
  }

  console.log(
    JSON.stringify(
      {
        mode: dryRun ? "dry-run" : "write",
        usersScanned: usersSnap.size,
        usersMigrated: migratedUsers,
        favoriteLeagueDocsWritten: favoritesWritten,
        sizePreferenceDocsWritten: sizesWritten,
        badgeDocsCreated: badgesCreated,
        legacyUserDocsUpdated: legacyFieldsRemoved,
        keepLegacy,
      },
      null,
      2,
    ),
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
