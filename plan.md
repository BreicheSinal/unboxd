## Firebase + Redux Integration Plan (Vercel Hosting)

### Summary
1. Integrate Firebase Auth + Firestore + Storage into the current Vite React app, replacing mocked auth and hardcoded domain data incrementally.
2. Use **Vercel for hosting** and **Firebase as BaaS** (Auth, database, file storage, security rules), based on your selected strategy.
3. Add Redux Toolkit as the single app state layer for authenticated session and user-linked data loading.
4. Add a mobile-first responsive pass across key authenticated flows (`dashboard`, `closet`, `marketplace`, `trade`) based on current layout patterns in `REPO_REFERENCE.md`.

### Key Implementation Changes
1. **App Infrastructure**
- Add Firebase SDK config module and service singletons.
- Add environment variables for Firebase web app config in Vercel (`VITE_FIREBASE_*`).
- Add Redux store with `Provider` in [App.tsx](c:\Users\MSI\Desktop\INVIX\unboxd\src\app\App.tsx), replacing `AuthContext` usage over time.
- Introduce shared domain types under `src/app/types` and Firebase data access modules under `src/app/services`.

2. **Authentication and Redux**
- Keep route guarding behavior but source auth state from Redux (`auth` slice) instead of localStorage context.
- Auth flow:
1. On app boot, subscribe to Firebase auth state (`onAuthStateChanged`).
2. If user exists, upsert profile document in Firestore and hydrate Redux state.
3. On sign in/up/google sign in, dispatch async thunk, set session status, and fetch user-scoped data.
4. On sign out, clear Redux slices and detach active listeners.
- Keep `ProtectedRoute` semantics unchanged while swapping underlying state source.

3. **Data Access Migration (Mock to Firestore)**
- Phase 1: Auth + profile + closet read/write.
- Phase 2: Marketplace listings + trade requests + transaction history.
- Phase 3: Dashboard aggregates from Firestore queries.
- Use optimistic UI only for low-risk local interactions; keep server timestamps as source of truth.

4. **Responsive Implementation Plan**
- Define breakpoints as behavior contracts: `sm` single-column, `md` compact 2-col where applicable, `lg+` full desktop layout.
- Standardize page container widths and spacing tokens for consistent vertical rhythm.
- Replace fragile fixed/flex row layouts with stacked mobile-first sections in:
1. Closet list cards (image, meta, actions stack on narrow screens).
2. Trade flow status tracker (horizontal desktop, vertical timeline on mobile).
3. Dashboard quick stats and recent activity cards (avoid text clipping and overflow).
4. Header/mobile nav interactions (menu close on route change, touch targets >= 44px).
- Add a responsive QA checklist with exact viewport targets: `360x800`, `390x844`, `768x1024`, `1280x800`.

### Firestore + Storage Schema (v1)
1. **`users/{uid}`**
- Fields: `email`, `displayName`, `photoURL`, `provider`, `createdAt`, `updatedAt`, `role`.
- Private preference fields: `favoriteLeagues`, `sizePreferences`, `theme`.

2. **`users/{uid}/closet/{shirtId}`**
- Fields: `team`, `league`, `size`, `condition`, `status` (`owned|trading|sold`), `isDuplicate`, `imageUrl`, `acquiredAt`, `updatedAt`.
- Indexes: `(status, updatedAt desc)`, `(league, updatedAt desc)`.

3. **`marketplaceListings/{listingId}`**
- Fields: `ownerUid`, `shirtRef` (or embedded snapshot), `size`, `tradeOptions` (`shirtForShirt`, `acceptsMoney`, `platformExchange`), `priceAsk`, `status` (`active|reserved|closed`), `createdAt`, `updatedAt`.
- Indexes: `(status, createdAt desc)`, `(size, status, createdAt desc)`.

4. **`tradeOffers/{offerId}`**
- Fields: `listingId`, `fromUid`, `toUid`, `tradeType` (`shirt-for-shirt|shirt-plus-money|sell-for-money`), `offeredShirtId`, `cashAmount`, `status` (`pending|accepted|rejected|shipped|completed|cancelled`), `timeline`, `createdAt`, `updatedAt`.

5. **`transactions/{transactionId}`**
- Fields: `type` (`order|trade|sale|purchase`), `buyerUid`, `sellerUid`, `listingId`, `offerId`, `amount`, `currency`, `status`, `createdAt`.

6. **Storage Paths**
- `users/{uid}/avatars/{fileName}`
- `users/{uid}/shirts/{shirtId}/{fileName}`
- `marketplace/{listingId}/{fileName}`
- Store public download URL + storage path in Firestore docs for safe delete/update flows.

7. **Security Rules Direction**
- User can read/write only their `users/{uid}` and `users/{uid}/closet/*`.
- Listings readable by authenticated users; writable only by owner.
- Offers writable only by participants; status transitions constrained by role.
- Transactions append-only by trusted flow (client + future Cloud Function hardening).

### Test Plan
1. Auth tests: email sign-up/sign-in, Google sign-in, restore session on refresh, sign-out state reset.
2. Route protection tests: unauthenticated redirect, authenticated access retention.
3. Firestore integration tests: create/update closet item, listing creation, offer lifecycle transitions.
4. Storage tests: upload shirt image, URL persistence, delete cleanup.
5. Responsive tests on target viewports for `Layout`, `Dashboard`, `Closet`, `Marketplace`, `Trade`.
6. Failure-path tests: offline mode, permission-denied rule failures, invalid env config handling.

### Assumptions and Defaults
1. Hosting default is fixed to **Vercel + Firebase**.
2. Redux Toolkit is the canonical state layer; `AuthContext` is deprecated after migration.
3. Firestore is the primary datastore; no separate backend server in v1.
4. Firebase Storage is used for user-uploaded media only (not static app assets).
5. `plan.md` will be created with this exact content in implementation mode in the repo root.
