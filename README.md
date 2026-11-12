# SnipShort web

The frontend for SnipShort, a URL shortener at snipsh.com. Sign up, turn a long URL into a short link such as `snipsh.com/aB3x9`, and see how often each link is clicked.

**Live demo:** https://snip-web-woad.vercel.app (runs on the mock API; log in with the demo account below).

The backend is a separate NestJS API (`snip-api`). Until it is ready, this app runs against a mock API in the browser, so everything works without a server.

## Setup

Requires Node 22 or later and Yarn 1.

```bash
yarn install
cp .env.example .env
yarn dev
```

Open http://localhost:5173. With the default `.env` the mock API is on, and you can log in with the demo account:

- Email: `demo@snipsh.com`
- Password: `password123`

The login page has a button that fills these in.

## Environment variables

| Variable | Example | Purpose |
|---|---|---|
| `VITE_API_URL` | `http://localhost:3000` | Base URL of the API. |
| `VITE_SHORT_DOMAIN` | `https://snipsh.com` | Base of every short link shown in the app. Set it to `http://localhost:3000` to test redirects against a local API. |
| `VITE_USE_MOCKS` | `true` | `true` answers API calls in the browser with MSW. `false` calls the real API. |

They are read and validated once, in `src/env.ts`. The app refuses to start if one is missing or malformed. `.env` is not committed; `.env.example` is.

## Scripts

| Command | What it does |
|---|---|
| `yarn dev` | Starts the dev server on port 5173. |
| `yarn build` | Type-checks, then builds to `dist/`. |
| `yarn preview` | Serves the built app locally. |
| `yarn lint` | Runs ESLint. |
| `yarn test` | Runs the test suite once with Vitest. |

## Mock API and real API

**Mocks (default).** With `VITE_USE_MOCKS=true`, Mock Service Worker intercepts every API call in the browser. The handlers in `src/mocks/handlers.ts` follow the API contract, including its error cases (400, 401, 404, 409).

The mock data lives in memory:

- It is seeded with the demo account and 23 links with click statistics.
- It resets when the page reloads. Links you create and accounts you register are gone after a refresh; only the demo account always exists.

**Real API.** When an endpoint is ready:

1. Run the API on port 3000.
2. Set `VITE_USE_MOCKS=false` in `.env` and restart `yarn dev`.

Nothing else changes. The API must allow CORS from `http://localhost:5173`.

If a real response differs from the contract, the fix belongs in `src/api/` (types and calls) and `src/mocks/` (so the mocks keep matching). Components should not need to change.

`BACKEND_REQUESTS.md` lists what the frontend needs from the API that the contract does not yet cover.

## Project layout

```
src/
  api/          fetch wrapper, one file per API area, contract types, Zod schemas
  components/   shared UI; shadcn/ui components are in components/ui
  features/
    auth/       login, register, auth context, route guard, token storage
    links/      list, create, edit, delete, link details
    stats/      clicks chart and referrers table
  lib/          formatting and short-link helpers
  mocks/        MSW handlers and the in-memory data
  pages/        landing page and 404
  test/         test setup and helpers
```

Components never call `fetch` directly; all HTTP goes through `src/api/client.ts`. A `401` on any authenticated request clears the stored token, and the route guard then sends the user to `/login` and returns them to the page they wanted after they log in.

## Design

`PRODUCT.md` records who the product is for and the design decisions the owner has made. The theme follows the system setting: dark is the designed look, and light is the same design inverted. Colours and other tokens are in `src/index.css`.

## Tests

`yarn test` covers:

- the fetch client's error normalization and its 401 handling;
- the mock API against the contract;
- the auth redirect, a wrong password, and logout;
- the links page: pagination, creating a link, a taken slug (409), client-side validation, and an expired session;
- filling in days with no clicks for the chart.
