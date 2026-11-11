import type { Link, LinkStats, User } from '@/api/types'
import { DEMO_CREDENTIALS } from './demo'

type StoredUser = { user: User; password: string }
type StoredLink = { userId: string; link: Link }

const MS_PER_DAY = 86_400_000
const STATS_WINDOW_DAYS = 30
const MAX_SEED_CLICKS_PER_DAY = 23
const REFERRER_SHARES = [
  { referrer: '', share: 0.38 },
  { referrer: 'twitter.com', share: 0.24 },
  { referrer: 'news.ycombinator.com', share: 0.17 },
  { referrer: 'google.com', share: 0.12 },
  { referrer: 'linkedin.com', share: 0.06 },
]

function daysAgo(days: number) {
  return new Date(Date.now() - days * MS_PER_DAY).toISOString()
}

export const EMPTY_STATS: LinkStats = { total: 0, perDay: [], topReferrers: [] }

// Deterministic, with some zero-click days left out like a real GROUP BY would.
function seedStats(seed: number): LinkStats {
  const perDay: LinkStats['perDay'] = []
  for (let day = STATS_WINDOW_DAYS - 1; day >= 0; day--) {
    const count = (seed * 7 + day * 13) % MAX_SEED_CLICKS_PER_DAY
    if (count > 0) perDay.push({ date: daysAgo(day).slice(0, 10), count })
  }
  const total = perDay.reduce((sum, { count }) => sum + count, 0)
  const topReferrers = REFERRER_SHARES.map(({ referrer, share }) => ({
    referrer,
    count: Math.round(total * share),
  }))
  return { total, perDay, topReferrers }
}

const DEMO_USER: StoredUser = {
  user: { id: 'user-demo', email: DEMO_CREDENTIALS.email, createdAt: daysAgo(120) },
  password: DEMO_CREDENTIALS.password,
}

// Newest first. More than one page, so pagination is visible in the demo.
const SEED_LINKS: { slug: string; url: string; extra?: Partial<Link> }[] = [
  { slug: 'fresh', url: 'https://example.com/a-link-nobody-has-clicked-yet' },
  { slug: 'launch', url: 'https://www.producthunt.com/posts/snipshort' },
  { slug: 'docs', url: 'https://docs.nestjs.com/first-steps' },
  { slug: 'rq-keys', url: 'https://tanstack.com/query/latest/docs/framework/react/guides/query-keys' },
  { slug: 'promo-q4', url: 'https://example.com/store/sale?utm_source=newsletter&utm_campaign=q4', extra: { expiresAt: daysAgo(-20) } },
  { slug: 'old-menu', url: 'https://example.com/menus/2025-autumn.pdf', extra: { isActive: false } },
  { slug: 'aB3x9', url: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status/302' },
  { slug: 'tw-v4', url: 'https://tailwindcss.com/blog/tailwindcss-v4' },
  { slug: 'msw', url: 'https://mswjs.io/docs/quick-start' },
  { slug: 'zod', url: 'https://zod.dev/api' },
  { slug: 'router', url: 'https://reactrouter.com/start/data/routing' },
  { slug: 'rhf', url: 'https://react-hook-form.com/get-started' },
  { slug: 'vitest', url: 'https://vitest.dev/guide/' },
  { slug: 'charts', url: 'https://recharts.github.io/en-US/examples' },
  { slug: 'a11y', url: 'https://www.w3.org/WAI/WCAG22/quickref/' },
  { slug: 'talk', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
  { slug: 'cv', url: 'https://example.com/files/resume-2026.pdf' },
  { slug: 'repo', url: 'https://github.com/nestjs/nest' },
  { slug: 'survey', url: 'https://forms.example.com/customer-feedback-2026' },
  { slug: 'maps', url: 'https://www.openstreetmap.org/#map=12/16.8409/96.1735' },
  { slug: 'pricing', url: 'https://example.com/pricing?plan=team' },
  { slug: 'blog-1', url: 'https://example.com/blog/how-url-shorteners-work' },
  { slug: 'invite', url: 'https://example.com/invite/7f3a9c' },
]

export const db = {
  users: [DEMO_USER],
  links: SEED_LINKS.map(
    ({ slug, url, extra }, index): StoredLink => ({
      userId: DEMO_USER.user.id,
      link: { id: `link-${index + 1}`, slug, url, createdAt: daysAgo(index * 3), ...extra },
    }),
  ),
  stats: new Map<string, LinkStats>(
    SEED_LINKS.map((_, index) => [`link-${index + 1}`, index === 0 ? EMPTY_STATS : seedStats(index)]),
  ),
}
