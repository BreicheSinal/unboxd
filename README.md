
# Unboxd Frontend

Unboxd is a frontend-only React app for a mystery sports shirt experience.
It includes onboarding, ordering, collection management, marketplace trading flows, badges, and support/legal pages.

## Tech Stack

- React + Vite
- TypeScript-flavored React (`.tsx`)
- React Router (`react-router`)
- Tailwind CSS v4 + CSS variable tokens
- `next-themes` for dark/light theme support
- Mock auth/session using React context + `localStorage`

## Current Status

- Frontend prototype (no backend/API integration yet)
- Most product data is mocked in page-level arrays/state
- Auth is simulated and persisted under `unboxd_user` in `localStorage` (with legacy fallback from `mysterykit_user`)

## Route Map

Public routes:

- `/`
- `/signin`
- `/signup`
- `/terms`
- `/privacy`
- `/help-center`
- `/contact-us`
- `/returns`

Protected routes (wrapped in `ProtectedRoute`):

- `/order`
- `/dashboard`
- `/closet`
- `/marketplace`
- `/trade/:id`
- `/transactions`
- `/badges`

## Project Structure

```text
src/
|- main.tsx
|- styles/
|  |- index.css
|  |- tailwind.css
|  |- theme.css
|- app/
   |- App.tsx
   |- routes.tsx
   |- contexts/
   |  |- AuthContext.tsx
   |- components/
   |  |- Layout.tsx
   |  |- ProtectedRoute.tsx
   |  |- ui/
   |- pages/
      |- HomePage.tsx
      |- OrderFlowPage.tsx
      |- DashboardPage.tsx
      |- ClosetPage.tsx
      |- MarketplacePage.tsx
      |- TradeFlowPage.tsx
      |- TransactionHistoryPage.tsx
      |- BadgesPage.tsx
      |- SignInPage.tsx
      |- SignUpPage.tsx
      |- TermsOfServicePage.tsx
      |- PrivacyPolicyPage.tsx
      |- HelpCenterPage.tsx
      |- ContactUsPage.tsx
      |- ReturnsPage.tsx
```

## Getting Started

```bash
npm install
npm run dev
```

Build for production:

```bash
npm run build
```

## Scripts

- `npm run dev` - start development server
- `npm run build` - create production build

## Notes For Contributors

- Keep styles tokenized (`bg-card`, `text-muted-foreground`, `border-border`, etc.) instead of hardcoded colors.
- Preserve existing auth-guarded navigation behavior unless intentionally changing access rules.
- If adding backend integration, prefer introducing shared domain types and a service layer first.

## Reference

For implementation details and architecture notes, see [REPO_REFERENCE.md](./REPO_REFERENCE.md).
  
