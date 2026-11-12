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

THESIS: One dark page with one glowing arc, like a horizon, and a single bar to paste a URL into. It refuses a feature grid, a screenshot, and any decoration beyond the arc.

OWN-WORLD: Night signal. A blue-black ground, white type, one electric blue that appears as light, never as a fill. Controls are flat pills: the main action is white and gains a ring of blue light on hover; a press shrinks it slightly. Fields are dark with a hairline edge that glows blue on focus. Sora for everything, Red Hat Mono for link strings. Light theme is the same design inverted.

STORY: The visitor reads what SnipShort does in one line, pastes a URL into the bar and sees the short link it would become, then presses Get started. Someone evaluating the work takes the demo button.

FIRST VIEWPORT: Header with the snipped-ring logo, Log in and a white Get started. Centred: the headline "Long links, cut short.", one sentence, the pill bar, and the demo button on clear ground. The arc starts well below the demo button and fills the rest of the screen; it is still and is the only light.

FORM: chosen by the owner from sketches (direction 1, background B). seed:1ef01d8be6c3c37e

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
