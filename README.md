# Unboxd

Unboxd is a React + Firebase application with two deployable frontends:
- `apps/web`: customer-facing mystery jersey experience
- `apps/admin`: admin operations dashboard

Both apps use Vite + TypeScript and rely on Vercel Serverless Functions for protected writes and admin operations.

## Tech Stack

- React 18 + React Router 7
- TypeScript
- Vite 6
- Tailwind CSS v4 + tokenized theme CSS
- Redux Toolkit + React Redux
- Firebase Auth + Firestore + Realtime Database + Storage
- Vercel Functions (Node/TS)
- Vitest + Testing Library
- Playwright (smoke E2E)

## Repository Layout

```text
.
|- apps/
|  |- web/                     # Web app entry + web API functions
|  |  |- main.tsx
|  |  |- index.html
|  |  |- api/
|  |- admin/                   # Admin app entry + admin API functions
|     |- main.tsx
|     |- index.html
|     |- api/
|- src/
|  |- apps/web/                # Web app source (routes, pages, store, services)
|  |- apps/admin/              # Admin app source (routes, pages, store, services)
|  |- styles/
|  |- main.tsx                 # Web app runtime bootstrap
|- scripts/
|  |- check-required-env.mjs
|  |- check-required-prod-secrets.mjs
|  |- set-admin-claim.mjs
|- docs/
|  |- release-policy.md
|  |- runbooks/
|- .github/workflows/ci.yml
```

## Prerequisites

- Node.js 20.x (matches CI)
- npm 10+
- Vercel CLI (`npm i -g vercel`) for local `/api/*` emulation
- Firebase project credentials for client + Admin SDK

## Install

```bash
npm ci
```

## Environment Variables

### Required for local frontend flows

Set in `.env` or `.env.local`:

- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`
- `VITE_PAYMENT_PROVIDER_DEFAULT` (`cod` or `wish`)

### Optional frontend variables

- `VITE_FIREBASE_APP_CHECK_SITE_KEY`
- `VITE_WISH_ENABLED` (`true`/`false`)
- `VITE_SENTRY_DSN`
- `VITE_GA4_MEASUREMENT_ID`
- `VITE_API_PROXY_TARGET` (defaults to `http://localhost:3000`)

### Required for API handlers / admin SDK

- `FIREBASE_PROJECT_ID`
- `FIREBASE_CLIENT_EMAIL`
- `FIREBASE_PRIVATE_KEY`

### Required when Wish payment is enabled

- `WISH_API_BASE_URL`
- `WISH_API_KEY`
- `WISH_WEBHOOK_SECRET`

Validation scripts:

```bash
node scripts/check-required-env.mjs
node scripts/check-required-prod-secrets.mjs
```

## Local Development

### 1) Run web frontend

```bash
npm run dev
```

This starts Vite for `apps/web`.

### 2) Run web API functions (separate terminal)

```bash
cd apps/web
vercel dev --listen 3000
```

The Vite dev server proxies `/api/*` to `http://localhost:3000` by default.

### 3) Run admin frontend

```bash
npm run dev:admin
```

### 4) Run admin API functions (separate terminal)

```bash
cd apps/admin
vercel dev --listen 3001
```

Then run admin Vite with proxy override:

```bash
set VITE_API_PROXY_TARGET=http://localhost:3001 && npm run dev:admin
```

PowerShell alternative:

```powershell
$env:VITE_API_PROXY_TARGET="http://localhost:3001"; npm run dev:admin
```

## NPM Scripts

- `npm run dev` - web app dev server
- `npm run dev:admin` - admin app dev server
- `npm run build` - build web app (`apps/web/dist`)
- `npm run build:admin` - build admin app (`apps/admin/dist`)
- `npm run preview` - preview web build on `127.0.0.1:4173`
- `npm run preview:admin` - preview admin build on `127.0.0.1:4174`
- `npm run typecheck` - TypeScript checks
- `npm run lint` - ESLint on `src`
- `npm run test` - Vitest test run
- `npm run test:watch` - Vitest watch mode
- `npm run test:e2e` - Playwright smoke test
- `npm run audit` - production dependency audit
- `npm run admin:claim -- <uid-or-email> <true|false>` - set Firebase custom `admin` claim

## Runtime Overview

### Web app (`src/apps/web`)

- Public routes: home, auth, legal/help pages
- Protected routes: order flow, dashboard, closet, marketplace, trade flow, transactions, badges
- Auth bootstrap uses Firebase Auth state + user profile upsert
- Order and trade writes are server-mediated through `/api/*`

Web API handlers:

- `/api/bootstrapUser`
- `/api/createCodOrder`
- `/api/createTradeOffer`
- `/api/transitionTradeOffer`
- `/api/createTransactionFromTrade`
- `/api/initiateWishPayment`
- `/api/wishWebhook`

### Admin app (`src/apps/admin`)

- Admin-only routes behind Firebase custom claim `admin: true`
- Dashboard, orders, order details, transactions, listings, trades, users
- Uses `/api/admin/*` endpoints

Admin API handlers:

- `/api/admin/dashboardSummary`
- `/api/admin/listOrders`
- `/api/admin/getOrder`
- `/api/admin/updateOrder`
- `/api/admin/listTransactions`
- `/api/admin/listListings`
- `/api/admin/moderateListing`
- `/api/admin/listTrades`
- `/api/admin/transitionTrade`
- `/api/admin/listUsers`
- `/api/admin/setUserAccess`
- `/api/admin/deleteUser`

## Deployments

Recommended model: two Vercel projects.

- Web project root: `apps/web`
- Admin project root: `apps/admin`
- Install command: `npm ci --include=dev`
- Build command: `npm run build`
- Output directory: `dist`

See `VERCEL_DEPLOY.md` for the stable configuration details.

## Quality and Security Gates

CI workflow: `.github/workflows/ci.yml`

Checks include:
- lint
- typecheck
- unit tests
- build
- dependency audit
- Playwright smoke test
- gitleaks secret scan
- production secret gate on `main`

## Operational Docs

- Release policy: `docs/release-policy.md`
- Runbooks: `docs/runbooks/`
  - auth outage fallback
  - incident triage
  - payment reconciliation
  - rollback

## Notes

- Web users are blocked from admin-only accounts; admin access is isolated to the admin app.
- Payment provider defaults are controlled by env (`cod` fallback, Wish optional).
- API handlers enforce authentication and role checks via Firebase ID tokens.
