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

THESIS: A short link is a signal, and its clicks are the trace it leaves. The screen is a quiet dark tool with almost nothing on it. It refuses the dashboard of bordered cards, stat tiles and a table header.

OWN-WORLD: Night signal. A blue-black ground, white type, and thin white lines that plot clicks. One electric blue is the only colour: it fills the main button and glows behind the landing hero. Controls are pills; lists are hairline rows, never boxed cards. Sora carries every heading and label; link strings alone are set in Red Hat Mono because they are case-sensitive codes. A light theme exists for systems set to light and is the same design inverted.

STORY: The user sees where to paste, gets a short link they can copy at once, trusts the list as their own, and reads a link's clicks as one white line.

FIRST VIEWPORT: `/links` at 1440 wide. A header row: wordmark left, account email and Log out right. Below it one pill-shaped bar to make a link: a wide URL field, a slug field prefixed with the short domain, and a blue Shorten button. Under it the list as hairline rows: the short link in bold mono with Copy, the target URL muted and truncated, the created date, then Edit and Delete. No slug is ever set at display size. On a phone the bar's fields stack and each row becomes two lines. The signature move is the white trace: clicks are always drawn as a thin white line on the dark ground, on the details page and nowhere as decoration in the list. A newly made link's row holds a blue tint until the next action. Motion is 150 to 200ms state transitions only.

FORM: the catalogue sleeve challenger (brand-identity-canon-saville-catalog-sleeve), chosen by the owner after four hands and steered by them: dark, futuristic, no yellow, no giant slug, with the spaceship.com hero as a reference. seed:e00b512afba57f79

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
