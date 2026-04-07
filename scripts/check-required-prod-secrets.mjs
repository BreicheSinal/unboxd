const requiredProd = [
  "VITE_FIREBASE_API_KEY",
  "VITE_FIREBASE_AUTH_DOMAIN",
  "VITE_FIREBASE_PROJECT_ID",
  "VITE_FIREBASE_STORAGE_BUCKET",
  "VITE_FIREBASE_MESSAGING_SENDER_ID",
  "VITE_FIREBASE_APP_ID",
  "VITE_FIREBASE_APP_CHECK_SITE_KEY",
  "VITE_PAYMENT_PROVIDER_DEFAULT",
  "WISH_API_BASE_URL",
  "WISH_API_KEY",
  "WISH_WEBHOOK_SECRET",
];

const missing = requiredProd.filter((key) => !process.env[key]);
if (missing.length) {
  console.error(`Missing required production secrets: ${missing.join(", ")}`);
  process.exit(1);
}

console.log("Production secret validation passed.");
