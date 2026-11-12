# Backend requests

Things the frontend needs from `snipsh-api` (https://github.com/soewaiyanag/snipsh-api). The frontend adapts to the API as it is; nothing here is worked around in a way that hides the gap.

## 1. Allow the deployed frontend through CORS

`CORS_ORIGIN` on the Render service must include the deployed frontend, or a browser blocks every call from it. Today only `http://localhost:5173` is allowed.

```
CORS_ORIGIN=http://localhost:5173,https://snipsh-swya.vercel.app
```

## 2. The signed-in user's email

`GET /auth/me` returns only the token's contents (`sub`, `iat`, `exp`), so the header cannot show who is logged in. Today the frontend keeps the email typed at login in `localStorage`.

**Ask:** return `{ id, email, createdAt }` from `/auth/me`, ideally with `plan`.

## 3. Click statistics

There is no `GET /links/:id/stats`. The frontend has the page built (total, clicks per day, top referrers) and hides it on the real API, showing "Click statistics are coming" instead. The expected shape is `LinkStats` in `src/api/types.ts`.

## 4. Plan limits, before the user hits them

The API refuses custom slugs on the free plan and a sixth link, both with `403` and a clear message, which the frontend shows. If `/auth/me` returned the plan and its limits, the UI could explain them before the user submits.

## Noted, no action needed

- `PATCH /links/:id` was removed on purpose, so the frontend hides Edit on the real API.
- `GET /links` returns every link in one array, so the frontend pages it itself.
- Another user's link answers `403` ("belongs to another user"), which confirms the id exists. The frontend shows it as "does not exist"; a `404` would reveal less.
