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

Constraints: mobile-first from 360px; dark mode follows the system; WCAG AA; one accent colour; standard controls only. Edit happens inline, in the row or on the details page, not in a modal. Delete keeps its confirmation dialog.

Unresolved: the list cannot show a click count per row, because the contract's `Link` has none.

## Direction contract

THESIS: Shortening a link is an editor's cut: the long URL is the copy, the short link is the correction. The screen is a plain, fast tool. It refuses the grey dashboard with one blue button and a row of stat cards.

OWN-WORLD: A paste-up board. Pale non-photo-blue ground; white, square-cornered sheets ruled with 1px blue guidelines; blue-black ink. Editor's pencil blue marks only what the user can act on or has just changed. Proofreader's red marks only errors and deletion. One grotesque, Public Sans, carries every heading, label and number. Link strings alone are set in typescript, Courier Prime, because they are case-sensitive codes.

STORY: The user sees where to paste, gets a short link they can copy at once, trusts the list as their own, and reads a link's clicks without interpretation.

FIRST VIEWPORT: `/links` at 1440 wide. A header row on the ground: wordmark left, account email and Log out right. Below it one sheet holding the create form on a single line: a wide URL field, a slug field prefixed with the short domain, a Shorten button. Under it the list sheet: each row has the short link in bold typescript with a copy button, the target URL muted and truncated, the created date, then edit and delete. On a phone the fields stack and each row becomes two lines. The signature move is the cut mark: after a link is created, a result strip shows the long URL struck through by a drawn pencil stroke that ends in a delete loop, with the new short link and a Copy button beside it; the new row stays tinted until the next action. The stroke draws in 450ms with an ease-out curve and is static under reduced motion. Nothing else on the screen animates beyond 150 to 200ms state transitions.

FORM: proofreader's marks on a galley, position 7 of 7 on the ranked list. seed:e00b512afba57f79

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
