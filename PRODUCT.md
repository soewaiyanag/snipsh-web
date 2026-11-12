# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Two audiences, both confirmed by the owner:

- **People sharing links.** Developers, makers and small-team marketers who post a link in a tweet, a newsletter, a slide or a README, then come back later to check its clicks. They use it in short bursts: on a laptop while writing something else, or on a phone while posting.
- **People evaluating the work.** SnipShort is also a portfolio piece. Recruiters and other developers open it to judge how it is designed and built, usually through the demo account, and often without a link of their own to shorten.

## Product Purpose

SnipShort turns a long URL into a short link such as `snipsh.com/aB3x9` and shows how often each link is clicked. Success is a user going from a pasted URL to a copied short link in a few seconds, and later reading a link's clicks without effort. For the second audience, success is that the product is understood and can be tried within a minute of arriving.

## Positioning

Nothing is claimed yet. The owner confirmed this is an open decision: the product explains what it does and makes no comparison with, or claim against, other link shorteners.

## Operating Context

- Paste a long URL, optionally choose a custom slug, copy the short link, share it somewhere else.
- Come back to a list of your own links; open one to see total clicks, clicks per day and top referrers.
- The short link's redirect is served by the API, never by this frontend.
- The backend (`snip-api`, NestJS) is being built separately by the owner; the frontend runs against MSW mocks until it exists.
- A seeded demo account (`test@gmail.com`) exists in the mock API, so the app can be explored without registering.

## Capabilities and Constraints

- Accounts: register and log in with email and password. Users see and change only their own links.
- Links: create (URL plus optional slug), list (paginated), edit, delete, copy.
- Slugs: 3 to 32 characters; letters, digits, `-` and `_`. Left empty, the server generates one.
- URLs: `http` or `https` only, up to 2048 characters, not a snipsh.com link.
- Stats per link: total clicks, clicks per day, top referrers (an empty referrer means direct).
- Planned, may be absent: a link's `isActive` flag and `expiresAt` date.
- Not part of the product: pricing or plans, teams, custom domains, QR codes, link-in-bio pages, an API for users.
- Terms: "short link", "slug", "clicks", "referrer".

## Brand Commitments

- Name: SnipShort. Domain: snipsh.com. These are the only fixed brand facts.
- No logo, brand colours or typeface exist; design work is free to create them.
- The owner's stated visual constraint (from `CLAUDE.md`): clean and distinctive, not a generic template; one accent colour, used consistently.
- The owner's later instruction, which is binding: the design must be simple, and must look different from most URL shorteners. A generic URL-shortener design is the thing to avoid.
- The owner prefers a dark theme, and does not want yellow anywhere in the design.
- The owner chose the direction: futuristic and dark. The landing hero is one still, glowing arc like a horizon (no other light, nothing moving), used on the landing hero only; the logo is a ring with a piece snipped out; buttons are flat pills, white for the main action, with a ring of light on hover. Signed-in pages use the same theme without the arc: a centred column, the landing page's pill bar to make a link, a roomy list instead of a table, and clicks drawn as a glowing line. Bevelled or shaded buttons read as dated to the owner. They do not want a slug set at giant size.
- The owner chose the final look from sketches: a logo that is a ring with a piece snipped out; a landing hero with one still, glowing arc like a horizon, with nothing moving and no other light, used on the landing hero only; and flat pill buttons, white for the main action, that gain a ring of blue light on hover. Bevelled or shaded buttons read as dated to the owner.

## Evidence on Hand

- No customers, testimonials, usage numbers, benchmarks or press. None may be fabricated.
- All links and click figures in the app today are synthetic seed data from the mock API (`src/mocks/db.ts`), and must be labelled as sample data wherever a visitor could take them for real.

## Product Principles

1. The shortest path wins: pasting a URL and copying the short link takes one form and one click.
2. The short link is the object. It is always shown in full, always copyable, and never truncated; the long URL may be.
3. Numbers are reported plainly. No vanity framing, no invented trends.
4. A user's links are theirs alone; nothing in the interface suggests otherwise.
5. It can be tried at once. Someone who arrives with no link to shorten can still see the product working.

## Accessibility & Inclusion

WCAG AA colour contrast, real labels on every field, visible focus rings, keyboard-usable dialogs. Mobile-first from 360px wide. Dark mode follows the system setting.
