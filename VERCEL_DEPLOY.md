Stable Vercel deploy guidelines for this monorepo

Overview
- This repo contains two Vite apps: `apps/web` and `apps/admin`.
- Each app builds into its own `dist` folder: `apps/web/dist` and `apps/admin/dist`.
- Each app includes an `apps/*/vercel.json` with `"outputDirectory": "dist"`.

Required Vercel project settings (stable configuration)
For each Vercel project (create one for `apps/web` and one for `apps/admin`):
- Project Root: set to the app folder (e.g. `apps/web` or `apps/admin`).
- Install Command: `npm ci --include=dev`
  - This ensures devDependencies (like `vite`) are installed during build.
  - Alternative: set environment variable `NPM_CONFIG_PRODUCTION=false`.
- Build Command: `npm run build`
- Output Directory: `dist` (this is relative to the Project Root)

Notes
- Vite configs are implemented to write `dist` inside each app directory. No repo-root `dist` is used.
- If you prefer using a single Vercel project at the repo root, set `outputDirectory` to `apps/web/dist` or `apps/admin/dist` accordingly.

Local verification
```bash
# install with dev deps
npm ci --include=dev
# build both apps
npm run build
npm run build:admin
# check outputs
ls apps/web/dist
ls apps/admin/dist
```

If you want, I can open a PR that documents these settings and optionally set up Github repo secrets or CI steps to run builds before Vercel deploys.