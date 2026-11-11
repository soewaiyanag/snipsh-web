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
      <div aria-label="Loading clicks" className="mt-12 grid gap-4">
        <Skeleton className="h-6 w-64" />
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  if (stats.isError) {
    return (
      <div role="alert" className="mt-12 rounded-xl bg-card p-6">
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
      <div className="mt-12 rounded-xl bg-card p-6">
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

  const figures = [
    { value: formatNumber(total), label: total === 1 ? 'click in total' : 'clicks in total' },
    { value: formatNumber(busiest.count), label: `busiest day, ${formatDay(busiest.date)}` },
  ]

  return (
    <>
      <section aria-labelledby="clicks-heading" className="mt-12">
        <h2 id="clicks-heading" className="sr-only">
          Clicks
        </h2>
        <dl className="flex flex-wrap gap-x-12 gap-y-4">
          {figures.map(({ value, label }) => (
            <div key={label} className="flex flex-col-reverse">
              <dt className="text-sm text-muted-foreground">{label}</dt>
              <dd className="text-3xl font-bold tracking-tight tabular-nums">{value}</dd>
            </div>
          ))}
        </dl>
        <div className="mt-6">
          <ClicksChart days={days} />
        </div>
      </section>

      {topReferrers.length > 0 && (
        <section aria-labelledby="referrers-heading" className="mt-12">
          <h2 id="referrers-heading" className="mb-3 text-xl font-semibold tracking-tight">
            Where clicks came from
          </h2>
          <ReferrersTable referrers={topReferrers} />
        </section>
      )}
    </>
  )
}
