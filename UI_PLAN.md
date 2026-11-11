# UI plan: review before creating a link

Decided with the owner while building `snip-api`. Not built yet.

## Why

A link's destination **cannot be changed after it is created**. The API has no `PATCH /links/:id`. If the target could change, someone could create a harmless link, share it, then swap the destination for a phishing page after every check has passed. A mistake is fixed by deleting the link and creating a new one.

So the create flow must make it hard to create a link with a wrong destination.

## The flow (option 1: a review step)

1. **Form** (URL, plus the custom slug field for PRO users).
   - Hint under the URL field: "The destination can't be edited after creating. To change it, delete the link and create a new one."
2. **Review screen**, shown after the form validates and before anything is sent:
   - the destination in large type, with the domain highlighted (`example.com`)
   - the short link that will be created (a generated slug is only known after creating, so show "a random short link" for free users)
   - two buttons: **Back** (returns to the form with the values kept) and **Create short link**
3. **Success screen**: the short link and its destination side by side, with **Copy** and **Delete** buttons, so a mistake is fixed right there.

Wording rule: do not say "cannot be undone", because delete exists. Say "The destination can't be edited after creating."

Optional, later: the API could normalize the URL (for example lowercase the host) so the review screen shows exactly what is stored.

## What this changes in the existing frontend plan

- Remove the edit action and any edit form or edit route from `/links` and `/links/:id`.
- `PATCH /links/:id` does not exist. Remove its MSW handler and its function in `src/api/links.ts`.

## API facts that differ from the contract in `CLAUDE.md`

The backend now behaves like this (`CLAUDE.md` and `PRODUCT.md` have not been updated yet):

| Topic | Contract in `CLAUDE.md` | Real API |
|---|---|---|
| Someone else's link | `404` | `403` with `This link belongs to another user` |
| `PATCH /links/:id` | exists | removed |
| Custom `slug` on create | any user | **PRO users only**. A free user sending `slug` gets `403` (`Custom slugs are a Pro feature`). Free users always get a generated slug |
| Number of links | unlimited | free accounts: at most **5** links, then `403` (`Free plan is limited to 5 links`) |
| `User` | `{ id, email, createdAt }` | also has `plan: "FREE" \| "PRO"` |
| `Link` | no owner | also has `userId` |
| `GET /links` | `?page&limit`, `Paginated<Link>` | plain array of your links, newest first (pagination comes in a later backend step) |

Consequences for the UI: hide or disable the slug field for FREE users (with a short "Pro feature" note), show "n of 5 links used" for FREE users, and show the server's `403` message when a limit is hit.

## Admin dashboard (future)

An `/admin` area for the owner to manage users and take down abusive links. The API is planned (see `AD1` to `AD6` in `snip-api/PROGRESS.md`) and is **not built yet**, so build it against MSW handlers first, like the rest of the app.

### Access

- Only users with `role: "ADMIN"` see an "Admin" link in the header and can open `/admin`. Hiding the link is only convenience: the **server** answers `403` to everyone else, and the app must show a clear "not allowed" page on a `403`.
- Needs the user's role on the client. `User` gets `role: "USER" | "ADMIN"`, and the app needs `GET /auth/me` (already item 1 in `BACKEND_REQUESTS.md`).
- Never put admin data in the public bundle: load it only after the role is known.

### Pages

| Route | What it does |
|---|---|
| `/admin` | Overview: total users, links, clicks, and new signups per day (a small chart) |
| `/admin/users` | Paginated table with email search. Each row: email, plan, role, link count, created date. A control to switch a user between FREE and PRO |
| `/admin/links` | Paginated table of **all** links with search by slug, URL or owner. Each row has Delete and Deactivate, with a confirmation dialog that shows the destination URL |

### API it will call (planned)

| Method | Path | Notes |
|---|---|---|
| GET | `/admin/stats` | Totals and signups per day |
| GET | `/admin/users?page&limit&search` | `Paginated<AdminUser>` |
| PATCH | `/admin/users/:id/plan` | Body `{ plan }`. Refuses to change the last admin |
| GET | `/admin/links?page&limit&search` | `Paginated<AdminLink>` with owner email |
| DELETE | `/admin/links/:id` | `204`, no ownership check |

### UX rules

- Reuse the loading, empty and error states and the table components from `/links`.
- Every destructive action asks for confirmation and names what will be removed.
- Reserved slug: `admin` can never be a short link, so `/admin` never clashes with a redirect.
