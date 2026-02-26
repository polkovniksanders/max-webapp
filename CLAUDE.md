# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start dev server (http://localhost:5173)
npm run build        # Type-check + build for production (outputs to dist/)
npm run preview      # Preview production build locally
npm run lint         # ESLint on src/
npm run lint:fix     # ESLint with auto-fix
npm run format       # Prettier format all files
npm run format:check # Check formatting without writing
```

No test suite is configured.

## Architecture

This is a **MAX messenger mini-app** (analogous to Telegram mini-apps) using **Feature-Sliced Design (FSD)**.

### FSD Layer Order (import direction: top → bottom only)

```
pages → widgets → features → entities → shared
```

Path aliases: `@app`, `@pages`, `@widgets`, `@features`, `@entities`, `@shared`

### Key Architectural Decisions

**HashRouter** — mandatory. The app is hosted on GitHub Pages at a subpath (`/max-webapp/`). Server-side redirects are unavailable, so `BrowserRouter` would break navigation on reload.

**MAX Bridge SDK** — loaded via `<script>` in `index.html` before the main bundle. Exposes `window.WebApp`. In dev mode, `src/shared/bridge/index.ts` auto-injects a mock (`src/shared/bridge/mock.ts`) when `window.WebApp` is absent. Always access via `getWebApp()` from `@shared/bridge` — never access `window.WebApp` directly.

**RTK Query** — all API calls use a single `baseApi` defined in `src/shared/api/index.ts` (base URL: `https://api.spodial.com/api/v3/`). Entity-specific endpoints are injected via `baseApi.injectEndpoints()` in each entity's model folder. The store in `src/app/store/index.ts` registers the combined reducer and middleware.

**Hardcoded IDs** — `SHOP_ID = 12` and `TELEGRAM_USER_ID = 5492444` are repeated in each API file (`categoriesApi.ts`, `productsApi.ts`, `shopApi.ts`). This is intentional for now.

### Adding a New Page

1. Create `src/pages/<name>/ui/<Name>Page.tsx` and `src/pages/<name>/index.tsx` (exports `{ route }` with `{ path, element }`)
2. Add the route constant to `src/shared/config/routes.ts`
3. Import and add the route to `src/app/router/index.tsx`

### Adding a New API Endpoint

Inject into `baseApi` from the relevant entity:
```ts
// src/entities/<entity>/model/<entity>Api.ts
import { baseApi } from '@shared/api'
export const { useGetXQuery } = baseApi.injectEndpoints({ endpoints: ... })
```

No registration in the store needed — injection is automatic.

### Infinite Scroll Pattern (MainPage)

`MainPage` maintains a `CategoryRow[]` state (categories + their products). A sentinel `<div>` at the bottom is observed via `useOnScreen` (IntersectionObserver). When visible, the next category without products is fetched. A `useRef` mirrors the state to avoid stale closures in the scroll effect.

### MAX Bridge BackButton

Use the `useBackButton()` hook (`src/shared/hooks/useBackButton.ts`) on pages that need the native back button. It shows the button on mount, registers a `navigate(-1)` handler, and cleans up on unmount. In dev, the mock renders a visible overlay button.

### Image URLs

Product images are constructed with `buildImageUrl(file)` from `@entities/product`:
```ts
`https://api.spodial.com/storage/${file}`
```

### Deploy

Push to `main` triggers GitHub Actions (`.github/workflows/deploy.yml`) which builds and deploys to GitHub Pages. Production base path is `/max-webapp/` (set conditionally in `vite.config.ts` based on `NODE_ENV`).
