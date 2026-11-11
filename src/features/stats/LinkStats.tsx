import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { CopyButton } from '@/features/links/CopyButton'
import { useLinkStats } from '@/features/links/queries'
import { formatDay, formatNumber } from '@/lib/format'
import { ClicksChart } from './ClicksChart'
import { fillDays } from './fill-days'
import { ReferrersTable } from './ReferrersTable'

export function LinkStats({ id, slug }: { id: string; slug: string }) {
  const stats = useLinkStats(id)

  if (stats.isPending) {
    return (
      <div aria-label="Loading clicks" className="mt-8 grid gap-4">
        <Skeleton className="h-6 w-64" />
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  if (stats.isError) {
    return (
      <div role="alert" className="mt-8 border-y py-8">
        <p className="font-semibold">The clicks for this link could not be loaded.</p>
        <p className="mt-1 text-muted-foreground">{stats.error.message}</p>
        <Button variant="outline" className="mt-5" onClick={() => stats.refetch()}>
          Try again
        </Button>
      </div>
    )
  }

  if (stats.data.total === 0) {
    return (
      <div className="mt-8 border-y py-10">
        <p className="text-xl font-semibold">No clicks yet.</p>
        <p className="mt-2 mb-6 max-w-prose text-muted-foreground">
          Share the short link. Every click will be counted here, by day and by where it came from.
        </p>
        <CopyButton slug={slug} />
      </div>
    )
  }

  const days = fillDays(stats.data.perDay)
  const busiest = days.reduce((best, day) => (day.count > best.count ? day : best), days[0])
  const { total, topReferrers } = stats.data

  return (
    <>
      <section aria-labelledby="clicks-heading" className="mt-8">
        <h2 id="clicks-heading" className="text-xl font-semibold tracking-tight">
          Clicks per day
        </h2>
        <p className="mt-2 mb-5 text-muted-foreground">
          <span className="font-semibold text-foreground tabular-nums">{formatNumber(total)}</span>{' '}
          {total === 1 ? 'click' : 'clicks'} in total
          {busiest && (
            <>
              . The busiest day was {formatDay(busiest.date)}, with{' '}
              <span className="tabular-nums">{formatNumber(busiest.count)}</span>
            </>
          )}
          .
        </p>
        {days.length > 0 && <ClicksChart days={days} />}
      </section>

      {topReferrers.length > 0 && (
        <section aria-labelledby="referrers-heading" className="mt-12 max-w-2xl">
          <h2 id="referrers-heading" className="mb-3 text-xl font-semibold tracking-tight">
            Top referrers
          </h2>
          <ReferrersTable referrers={topReferrers} />
        </section>
      )}
    </>
  )
}
