---
version: 1
slug: "src-pages-landingpage-tsx"
primary_target: "src/pages/LandingPage.tsx"
related_targets: []
---

# Landing page

Scope: `/`. Mode: Persuade.

Who must act: two confirmed audiences. A first-time visitor with a long URL to share should come to believe that SnipShort makes a short link in one step and tells them how often it was clicked; their action is "Get started", which leads to registration. A recruiter or developer judging the work has no link to shorten; their action is "Explore the demo", which opens the seeded demo account. That second action is shown only while the app runs on the mock API, because the demo account exists nowhere else.

Proof on hand: the mechanism itself, shown on a real-looking URL. There are no customers, testimonials, usage figures or prices, and none may be invented. The specimen's click figures are sample data and are labelled as a sample.

Constraints: required by the owner's brief are a description of what SnipShort does, a "Get started" button and a demo of a short link. The demo previews a cut in the browser; it never claims the preview link is live.

## Direction contract

THESIS: The page is one line of proof being corrected. A long URL is set large, the editor's pencil cuts it down to a short link, and the product is explained by the margin notes around that one specimen. It refuses the centred headline over an input box and three feature cards.

OWN-WORLD: The same paste-up board as the app. Pale non-photo-blue ground, one white square-cornered sheet, 1px blue guidelines, blue-black ink, editor's pencil blue for marks and actions. Public Sans throughout; URLs and the short link in Courier Prime typescript. Pencil strokes are drawn SVG lines, slightly uneven, never icons.

STORY: The visitor watches a long URL become `snipsh.com/aB3x9`, reads three margin notes (it is cut to a few characters, the slug can be renamed, every click is counted), tries a URL of their own in the specimen, and presses Get started.

FIRST VIEWPORT: 1440 by 900. A top row on the ground: wordmark left, Log in and Get started right. One sheet fills the rest. Upper left, the headline "Long links, cut short." at about 72px, with one sentence under it, the Get started button and, beside it, the quieter "Explore the demo" link. Below, across the full sheet, the specimen: the long URL in typescript at about 26px, struck through by the pencil stroke, whose delete loop runs out to the short link set in bold typescript at about 56px. Three margin notes in pencil blue hang from short leader lines at the cut, the slug and the click count. Under the specimen, a single field: "Try a URL of your own". On a phone the specimen stacks, the short link drops beneath the struck URL, and the notes become a plain list. The signature interaction is the cut: the stroke draws across the URL, then the short link appears; typing a new URL replays it.

FORM: annotated specimen, margin notes around one link; structure 6 of 7 on the ranked list and the dealt lead. seed:1ef01d8be6c3c37e

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
