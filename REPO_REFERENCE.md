# Unboxd Repo Reference

This document is the implementation-level reference for this repository.
Use it before adding or changing features.

## 1) What This Repo Is

- Frontend-only React app (no backend integration yet).
- Built with Vite + TypeScript-flavored React (`.tsx` files).
- Uses `react-router` for routing.
- Uses `next-themes` for dark/light themes.
- Uses Tailwind CSS v4 with CSS variables for tokens.
- Auth is mocked in-memory + `localStorage`.
- Most product data is currently hardcoded mock arrays inside page components.

## 2) Quick Start

- Install: `npm i`
- Run dev server: `npm run dev`
- Build: `npm run build`

## 3) Project Structure

```text
.
|- src/
|  |- main.tsx                  # Entry point
|  |- styles/
|  |  |- index.css              # imports fonts/tailwind/theme
|  |  |- tailwind.css           # Tailwind v4 source config
|  |  |- theme.css              # design tokens + base styles
|  |  |- fonts.css              # currently empty
|  |- app/
|     |- App.tsx                # ThemeProvider + AuthProvider + RouterProvider
|     |- routes.tsx             # full route map
|     |- contexts/
|     |  |- AuthContext.tsx     # mocked auth/session
|     |- components/
|     |  |- Layout.tsx          # global header/nav/footer
|     |  |- ProtectedRoute.tsx  # auth guard
|     |  |- ui/                 # 48 shadcn-style primitives (mostly unused)
|     |- pages/
|        |- HomePage.tsx
|        |- OrderFlowPage.tsx
|        |- DashboardPage.tsx
|        |- ClosetPage.tsx
|        |- MarketplacePage.tsx
|        |- TradeFlowPage.tsx
|        |- TransactionHistoryPage.tsx
|        |- SignInPage.tsx
|        |- SignUpPage.tsx
|- README.md                    # minimal generated readme
|- REPO_REFERENCE.md            # this file
|- vite.config.ts
|- postcss.config.mjs
|- package.json
```

## 4) Runtime Architecture

### Boot sequence

1. `src/main.tsx` mounts `App`.
2. `App.tsx` wraps app in:
- `ThemeProvider` (`next-themes`)
- `AuthProvider` (local auth context)
- `RouterProvider` (from `routes.tsx`)

### Route model

- Public routes:
- `/` (Home)
- `/signin`
- `/signup`
- Protected routes (wrapped in `ProtectedRoute`):
- `/order`
- `/dashboard`
- `/closet`
- `/marketplace`
- `/trade/:id`
- `/transactions`

### Layout model

- `Layout.tsx` is the root route shell:
- sticky header + desktop/mobile nav
- auth-aware nav links
- user menu + sign out
- theme toggle
- footer
- Child pages render via `<Outlet />`.

### Auth model

- Source: `src/app/contexts/AuthContext.tsx`
- Session key in `localStorage`: `unboxd_user` (with legacy fallback from `mysterykit_user`)
- Exposed API:
- `user`, `isLoading`
- `signIn(email, password)` (mock delay)
- `signInWithGoogle()` (mock delay)
- `signUp(email, password, name)` (mock delay)
- `signOut()`
- `ProtectedRoute` blocks when unauthenticated and redirects to `/signin`.

## 5) Styling & Design Tokens

- Tailwind v4 is configured through CSS:
- `src/styles/tailwind.css` uses `@source` scanning for `js/ts/jsx/tsx`.
- `src/styles/theme.css` defines semantic token vars:
- background/foreground/card/accent/border/etc.
- dark theme overrides under `.dark`.
- shared radius + chart/sidebar token set.
- Most UI uses utility classes + gradient styling.

Theme notes:
- `ThemeProvider` is configured with `defaultTheme="dark"` and `enableSystem`.
- Theme switching is done in `Layout.tsx`.

## 6) Product Feature Map (Current Implementation)

### Home

- Marketing hero, 3-step explanation, previews, testimonials, CTA.
- Motion animations via `motion/react`.

### Order Flow

- Local 3-step state machine:
- Step 1: size selection
- Step 2: exclusions (clubs/leagues/colors)
- Step 3: review + total + mock checkout alert
- No API call yet.

### Dashboard

- Stats cards, recent orders, badge list, quick links.
- All data is static mock data.

### Closet

- Search + status filter + grid/list mode.
- Shirt cards with statuses (`Owned`, `Trading`, `Sold`) and duplicate label.
- Trade action buttons are UI-only.

### Marketplace

- Search + size filter + sort selector (sort state currently not applied).
- Listing cards with trade options.
- "Make Offer" links to `/trade/:id`.

### Trade Flow

- Select trade type + optional shirt selection + optional cash offer.
- Status tracker (`pending`, `accepted`, `shipped`, `completed`, `rejected`).
- Demo buttons mutate local status.

### Transaction History

- Filter by transaction type.
- Summary stats (spent, earned, trades).
- Transaction list + mock export button.

### Auth Screens

- Sign in / sign up forms + mocked Google flow.
- Redirects post-login to original target (`location.state.from`) or dashboard.

## 7) Important Current Limitations

- No backend/API layer.
- No persistent domain data except `unboxd_user`.
- No global state manager beyond auth context.
- No formal type-sharing for domain models (types are local to each page).
- No tests configured.
- No lint/type-check scripts in `package.json`.
- `src/app/components/ui/*` exists but is largely unused by pages.
- Some files contain garbled text characters (likely encoding artifacts) in UI strings.

## 8) How To Add A Feature (Recommended Pattern)

Use this checklist:

1. Define the route impact.
- If new page: add component under `src/app/pages`.
- Register route in `src/app/routes.tsx`.
- If protected, wrap in `<ProtectedRoute>`.

2. Decide data source.
- If still mock: keep mock state local in page.
- If moving toward real API: create a service layer (recommended `src/app/services`).

3. Reuse layout + auth assumptions.
- Keep auth-aware actions aligned with `useAuth()`.
- Keep nav/footer behavior coherent in `Layout.tsx`.

4. Follow tokenized styling.
- Prefer semantic classes (`bg-card`, `text-muted-foreground`, `border-border`) over hardcoded colors.
- Keep gradients/visual style consistent with existing pages.

5. Keep components modular.
- If UI block repeats in multiple pages, extract to `src/app/components`.
- Avoid duplicating complex card/filter/status markup.

6. Validate route + auth flow.
- Unauthenticated users must be redirected from protected pages.
- Post-auth redirect should still work (`from` state logic).

## 9) Recommended Near-Term Refactors Before Major Features

1. Introduce domain types in a shared folder (`src/app/types`).
2. Add API abstraction layer (`src/app/services`).
3. Add script set:
- `typecheck` (`tsc --noEmit`)
- `lint`
- `test`
4. Decide whether to:
- remove unused `components/ui` primitives, or
- migrate pages to use those shared primitives consistently.
5. Fix text encoding artifacts to UTF-8 clean strings.

## 10) File-Level Change Guide

- Add/edit routes: `src/app/routes.tsx`
- Global shell/nav/footer/theme toggle: `src/app/components/Layout.tsx`
- Auth/session behavior: `src/app/contexts/AuthContext.tsx`
- Protected gating: `src/app/components/ProtectedRoute.tsx`
- Theme tokens: `src/styles/theme.css`
- Tailwind source scanning: `src/styles/tailwind.css`
- App bootstrap/providers: `src/app/App.tsx`, `src/main.tsx`

## 11) Feature Scaffolding Templates

### Add a protected page

1. Create `src/app/pages/NewFeaturePage.tsx`
2. Register in `src/app/routes.tsx` with:

```tsx
{
  path: "new-feature",
  element: (
    <ProtectedRoute>
      <NewFeaturePage />
    </ProtectedRoute>
  )
}
```

3. Add nav entry in `Layout.tsx` if needed.

### Add shared state beyond auth

1. Create `src/app/contexts/<Feature>Context.tsx`.
2. Wrap provider in `App.tsx` (inside `ThemeProvider`, near `AuthProvider`).
3. Expose hook `use<Feature>()`.

### Add API-backed flow

1. Create service module (`src/app/services/<feature>.ts`).
2. Keep page UI state local; call service functions.
3. Handle loading/error states in component.
4. Keep auth token/session strategy consistent with future backend plan.

## 12) Single-Source Notes For Future AI/Contributors

- Treat this repo as a polished frontend prototype with mocked business logic.
- Preserve current route and auth-guard behavior unless intentionally redesigning flows.
- Prefer incremental feature additions over broad rewrites.
- If adding backend integration, first centralize domain models and API clients.
