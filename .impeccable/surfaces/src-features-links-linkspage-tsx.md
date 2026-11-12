---
version: 1
slug: "src-features-links-linkspage-tsx"
primary_target: "src/features/links/LinksPage.tsx"
related_targets: ["src/features/links/LinkDetailsPage.tsx","src/features/auth/LoginPage.tsx","src/features/auth/RegisterPage.tsx","src/components/AppLayout.tsx"]
---

# App screens: sign in, links, link details

Scope: `/login`, `/register`, `/links`, `/links/:id` and the signed-in shell. Mode: Operate.

Audience and job: on the login screen, someone evaluating the work can fill in the demo account with one button (mock API only). Otherwise, a signed-in user who has a long URL on the clipboard and wants a short link to paste elsewhere, or who has come back to see whether a link was clicked.

Tasks: paste a URL, optionally name the slug, create, copy. Scan the list. Edit or delete a link. Read total clicks, clicks per day and top referrers.

States that matter: loading (skeleton rows), empty list (teaches the first action), request error with retry, slug taken (409, under the slug field), validation errors under each field, delete confirmation, a link that is paused or has an expiry date.

Constraints: mobile-first from 360px; dark is the designed look and the theme follows the system; WCAG AA; one accent colour; no yellow; standard controls only. Edit happens inline, in the row or on the details page, not in a modal. Delete keeps its confirmation dialog.

Unresolved: the list cannot show a click count per row, because the contract's `Link` has none.

## Direction contract

THESIS: The tool is the landing page's bar. Everything else is a quiet, roomy list. It refuses panels, table headers and stat tiles.

OWN-WORLD: Night signal. A blue-black ground, white type, one electric blue that appears as light, never as a fill. Controls are flat pills: the main action is white and gains a ring of blue light on hover; a press shrinks it slightly. Fields are dark with a hairline edge that glows blue on focus. Sora for everything, Red Hat Mono for link strings. Light theme is the same design inverted.

STORY: The user pastes a URL and presses Shorten, sees the new short link at once with a Copy button, and later finds and manages links in a plain list.

FIRST VIEWPORT: A centred column about 48rem wide. A "Shorten a link" heading, the pill bar, a small "Choose your own slug" link that opens the slug field. Below, "Your links" with the count, then rows: the dimmed domain and bold slug, the destination underneath, a relative date, Copy, and edit and delete icons. On phones the date and actions sit on a line under the link. The details page uses the same column, with two plain figures and a clicks line that glows like the landing arc.

FORM: chosen by the owner from a sketch. seed:e00b512afba57f79

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
