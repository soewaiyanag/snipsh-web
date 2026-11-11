# Backend requests

Things the frontend needs from `snip-api` that the contract in `CLAUDE.md` does not cover. Nothing here is worked around in a way that hides the gap.

## 1. A way to learn the signed-in user's email

**Need:** the header shows the user's email. `POST /auth/login` returns only `{ accessToken }`, and no endpoint returns the current user.

**Today:** the frontend keeps the email the user typed at login in `localStorage`, next to the token (`src/features/auth/token.ts`). That is correct right after login, but it cannot be recovered if storage is cleared and it would be wrong if the API ever normalises emails.

**Ask (either one):**

- `GET /auth/me` returning `User`, or
- include `user: User` in the login response.

## 2. Reserved slugs

**Need:** the redirect lives at `GET /:slug`, at the same level as `/links` and `/auth`. A link whose slug is `links` or `auth` would collide with those routes.

**Ask:** reject reserved slugs on `POST /links` and `PATCH /links/:id`, with `400` or `409`, and never generate one. The frontend shows whatever message the server sends under the slug field, so no frontend change is needed.
