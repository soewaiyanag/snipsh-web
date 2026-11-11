# CLAUDE.md: SnipShort web app

You are building the frontend for **SnipShort**, a URL shortener at snipsh.com. Users sign up, turn long URLs into short links like `snipsh.com/aB3x9`, and see how often each link gets clicked.

The backend is a separate NestJS API (repo `snip-api`) that the owner is building by hand while learning NestJS. **You own this frontend completely.** Never edit the backend. If the frontend needs something from the API that isn't in the contract below, write it down in `BACKEND_REQUESTS.md` instead of working around it.

---

## Tech stack

| Area | Choice |
|---|---|
| Build | Vite, React, TypeScript (`strict: true`) |
| Package manager | Yarn |
| Routing | React Router (library mode, `createBrowserRouter`) |
| Server state | TanStack Query |
| Forms | React Hook Form + Zod (`@hookform/resolvers`) |
| Styling | Tailwind CSS v4 + shadcn/ui |
| Charts | Recharts (stats page only) |
| Mock API | MSW (Mock Service Worker) |
| Tests | Vitest + Testing Library |

Use the latest stable version of each package. Add no other dependencies without a clear reason, and say why in the commit message. Use `fetch`, not axios.

---

## Environment

`.env.example` (commit it; never commit `.env`):

```bash
VITE_API_URL=http://localhost:3000     # the NestJS API
VITE_SHORT_DOMAIN=http://localhost:3000 # base for short links; https://snipsh.com in production
VITE_USE_MOCKS=true                     # true = MSW fakes the API in the browser
```

- The dev server runs on Vite's default port **5173**. The API runs on **3000**.
- Read env through one small typed module (`src/env.ts`) validated with Zod, never `import.meta.env` scattered around.
- A short link is always shown as `${VITE_SHORT_DOMAIN}/${slug}`. The frontend never handles the redirect; the API does.

---

## Working before the backend exists

**The backend is unfinished.** Only the database exists today; the endpoints below are the agreed plan. So:

1. Build every feature against **MSW handlers** that follow the contract exactly, including the error cases (400, 401, 404, 409).
2. Keep all HTTP calls in `src/api/` (one file per area: `auth.ts`, `links.ts`, `stats.ts`) plus one `client.ts` fetch wrapper. Components never call `fetch` directly.
3. Keep the contract's TypeScript types in `src/api/types.ts`. When the real API differs, only `src/api/` and `src/mocks/` should need to change.
4. Setting `VITE_USE_MOCKS=false` must switch to the real API with no other change.

---

## API contract (planned)

Base URL: `VITE_API_URL`. JSON in and out. There is no `/api` prefix.

**Auth.** Send the token as `Authorization: Bearer <accessToken>` on every request except register and login. Any `401` means the token is missing or expired: clear it and send the user to `/login`, keeping the page they wanted so you can return them there afterwards.

| Method | Path | Body | Success | Errors |
|---|---|---|---|---|
| POST | `/auth/register` | `{ email, password }` | `201` `User` | `400` validation, `409` email taken |
| POST | `/auth/login` | `{ email, password }` | `200` `{ accessToken: string }` | `401` wrong email or password |
| GET | `/links?page=1&limit=20` | | `200` `Paginated<Link>` | `401` |
| POST | `/links` | `{ url, slug? }` | `201` `Link` | `400`, `401`, `409` slug taken |
| GET | `/links/:id` | | `200` `Link` | `401`, `404` |
| PATCH | `/links/:id` | `{ url?, slug? }` | `200` `Link` | `400`, `401`, `404`, `409` |
| DELETE | `/links/:id` | | `204` no body | `401`, `404` |
| GET | `/links/:id/stats` | | `200` `LinkStats` | `401`, `404` |
| GET | `/:slug` | | `302` redirect (not called by the app) | `404` |

Users only ever see and change **their own** links. Another user's link returns `404`.

```ts
type User = { id: string; email: string; createdAt: string };   // never includes a password hash

type Link = {
  id: string;
  slug: string;          // 3-32 chars, letters, digits, "-" and "_"
  url: string;           // http or https only
  createdAt: string;     // ISO 8601
  isActive?: boolean;    // planned, may be missing at first
  expiresAt?: string | null; // planned, may be missing at first
};

type Paginated<T> = { items: T[]; total: number; page: number; limit: number };

type LinkStats = {
  total: number;
  perDay: { date: string; count: number }[];        // date = "YYYY-MM-DD"
  topReferrers: { referrer: string; count: number }[]; // "" = direct
};

// NestJS's default error body
type ApiError = { statusCode: number; message: string | string[]; error?: string };
```

**Validation rules** (mirror them in the Zod form schemas, but always show the server's message when it sends one):
- `email`: a valid email.
- `password`: 8 to 72 characters.
- `url`: a valid `http://` or `https://` URL, up to 2048 characters, and not a snipsh.com link.
- `slug` (optional): 3 to 32 characters, `^[A-Za-z0-9_-]+$`. If it's empty, the server generates one.

`message` can be a string or an array of strings (class-validator returns an array). Normalize it once in `client.ts`.

---

## Pages

| Route | Access | What it does |
|---|---|---|
| `/` | public | Landing page: what SnipShort does, a "Get started" button, a demo of a short link |
| `/register` | public | Email + password. On success, log in automatically and go to `/links` |
| `/login` | public | Email + password. Returns to the page the user was sent from |
| `/links` | auth | Create form at the top (URL + optional custom slug). Paginated list below: short link with a copy button, target URL (truncated), created date, and edit/delete actions |
| `/links/:id` | auth | Link details, edit, delete, and stats: total clicks, a clicks-per-day chart, a top referrers table |
| `*` | public | 404 page |

Logged-in users get a header with their email and a logout button. Logging out clears the token and the TanStack Query cache.

---

## UX requirements

- Every data view has **loading, empty and error** states. An empty list shows a call to action, not a blank area.
- Copy a short link in one click, with "Copied" feedback (a toast).
- Ask for confirmation before deleting a link.
- Use optimistic updates or invalidate the query after create, edit and delete, so the list is never stale.
- Field errors appear under the field. A `409` on slug appears under the slug field ("That slug is taken").
- Mobile-first and responsive from 360px up. Dark mode follows the system setting.
- Accessibility: real `<label>`s, visible focus rings, keyboard-usable dialogs (shadcn/Radix covers this), color contrast AA.
- Keep the visual style clean and distinctive, not a generic template. Pick one accent color and use it consistently.

---

## Code conventions

- Feature folders: `src/features/auth`, `src/features/links`, `src/features/stats`; shared UI in `src/components`; shadcn in `src/components/ui`.
- Store the token in `localStorage` behind a small `auth` module (`getToken`, `setToken`, `clearToken`) so the storage can be swapped later. Expose the auth state through React context.
- Don't use magic numbers or booleans: use named constants (`const LINKS_PAGE_SIZE = 20`) and options objects.
- Comments are rare and short, and explain *why* only.
- No `any`. Infer form types from Zod schemas with `z.infer`.
- Before calling something done, run `yarn build`, `yarn lint` and `yarn test`, and make sure they pass.
- **No AI attribution anywhere:** no `Co-Authored-By`, no "Generated with ...", no tool links in commits, PRs, code or README. Use conventional commit messages (`feat(links): ...`).

---

## Build order

Do these one at a time, and commit after each:

1. Tooling: Tailwind v4, shadcn/ui init, React Router, TanStack Query, `src/env.ts`, `.env.example`, path alias `@/`.
2. `src/api/client.ts` + types + MSW setup, with handlers for every endpoint above (an in-memory store, seeded with one user `demo@snipsh.com` / `password123` and a few links with stats).
3. Auth: register, login, logout, protected routes, 401 handling.
4. Links: list with pagination, create, copy, edit, delete.
5. Link details + stats chart.
6. Landing page, 404, polish (empty states, responsive, dark mode).
7. Tests: the `client.ts` error normalization, the auth redirect, and the create-link form (including a 409).
8. README: setup, env vars, scripts, and how to switch between mocks and the real API.

---

## Connecting to the real backend later

When the owner says an endpoint is ready:
1. Set `VITE_USE_MOCKS=false` and run the API on port 3000.
2. The API must allow CORS from `http://localhost:5173`. If requests fail with a CORS error, add it to `BACKEND_REQUESTS.md`; don't proxy around it.
3. Compare real responses to `src/api/types.ts`, fix any drift in `src/api/` only, and update the MSW handlers to match.
