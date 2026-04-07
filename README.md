# Unboxd Frontend

Unboxd is a React + Firebase app for a mystery sports shirt experience.
It includes onboarding, ordering, collection management, marketplace trading, badges, and support/legal pages.

## Tech Stack

- React + Vite
- TypeScript (`.tsx`)
- React Router (`react-router`)
- Tailwind CSS v4 + CSS variable tokens
- `next-themes`
- Firebase Auth + Firestore + Storage
- Vercel Functions (`/api/*`) with Firebase Admin SDK
- Redux Toolkit + React Redux

## Current Production Baseline

- Redux-based auth/session with Firebase bootstrap
- Firestore reads for closet/marketplace/trades/transactions
- Sensitive writes moved to Vercel Functions (`/api/createTradeOffer`, `/api/transitionTradeOffer`, `/api/createCodOrder`, etc.)
- App Check bootstrap support (`VITE_FIREBASE_APP_CHECK_SITE_KEY`)
- Payments abstraction (`cod | wish`) with COD default and Wish toggle
- CI quality gates + secret scanning + production secret gate
- Runbooks under `docs/runbooks`

## Getting Started

```bash
npm install
npm run dev
```

Use the existing `.env` file and fill/update values there.

For local Vercel Function routes (`/api/*`), run a local API server and keep Vite running:

```bash
vercel dev --listen 3000
```

`vite.config.ts` proxies `/api/*` to `http://localhost:3000` by default.
You can override this using `VITE_API_PROXY_TARGET` in `.env`.

## Scripts

- `npm run dev` - start development server
- `npm run build` - production build
- `npm run preview` - preview built app
- `npm run typecheck` - TypeScript check
- `npm run lint` - ESLint
- `npm run test` - Vitest unit tests
- `npm run test:e2e` - Playwright smoke test
- `npm run audit` - production dependency audit

## Firebase + Security Artifacts

- `firestore.rules`
- `firestore.indexes.json`
- `storage.rules`
- `api/*.ts` server handlers

## CI/CD and Ops

- CI workflow: `.github/workflows/ci.yml`
- Release policy: `docs/release-policy.md`
- Incident runbooks: `docs/runbooks/*.md`

## Notes

- Trade offer and transaction writes are server-managed via Vercel Functions.
- COD is enabled by default for testing and production fallback.
- Wish integration is scaffolded and can be enabled when credentials are provided.

## Auth Compatibility

- Current auth flow uses email/password and Google popup sign-in.
- Firebase Dynamic Links shutdown does not impact this current web implementation.
- Avoid adding mobile email-link auth (`sendSignInLinkToEmail`) or Cordova OAuth flows without a migration plan, as those rely on deprecated Dynamic Links behavior.
