import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

const [, , uidArg, grantArg] = process.argv;
if (!uidArg || !grantArg) {
  console.error("Usage: node --env-file=.env.local scripts/set-admin-claim.mjs <uid> <true|false>");
  process.exit(1);
}

const grant = grantArg === "true";
if (!["true", "false"].includes(grantArg)) {
  console.error("Second argument must be true or false.");
  process.exit(1);
}

const projectId = process.env.FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

if (!projectId || !clientEmail || !privateKey) {
  console.error("Missing Firebase admin credentials in env.");
  process.exit(1);
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

const auth = getAuth();
const user = await auth.getUser(uidArg);
const nextClaims = { ...(user.customClaims ?? {}), admin: grant };
await auth.setCustomUserClaims(uidArg, nextClaims);

console.log(`Updated ${uidArg}: admin=${grant}`);
