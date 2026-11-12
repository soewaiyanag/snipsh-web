import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useLinkStats } from '@/features/links/queries'
import { formatDay, formatNumber } from '@/lib/format'
import { ClicksChart } from './ClicksChart'
import { fillDays } from './fill-days'
import { ReferrersTable } from './ReferrersTable'

const MS_PER_DAY = 86_400_000
const EMPTY_RANGE_DAYS = 30
const NO_VALUE = '–'

// A link with no clicks still gets a chart: a true flat line over the last 30 days.
function lastDaysAtZero() {
  return Array.from({ length: EMPTY_RANGE_DAYS }, (_, index) => ({
    date: new Date(Date.now() - (EMPTY_RANGE_DAYS - 1 - index) * MS_PER_DAY).toISOString().slice(0, 10),
    count: 0,
  }))
}

export function LinkStats({ id }: { id: string }) {
  const stats = useLinkStats(id)

  if (stats.isPending) {
    return (
      <div aria-label="Loading clicks" className="mt-10 grid gap-4">
        <Skeleton className="h-16 w-full max-w-md" />
        <Skeleton className="h-72 w-full" />
      </div>
    )
  }

  if (stats.isError) {
    return (
      <div role="alert" className="sheet mt-10 p-6">
        <p className="font-semibold">The clicks for this link could not be loaded.</p>
        <p className="mt-1 text-muted-foreground">{stats.error.message}</p>
        <Button variant="outline" className="mt-5" onClick={() => stats.refetch()}>
          Try again
        </Button>
      </div>
    )
  }

  const { total, topReferrers } = stats.data
  const hasClicks = total > 0
  const days = hasClicks ? fillDays(stats.data.perDay) : lastDaysAtZero()
  const busiest = days.reduce((best, day) => (day.count > best.count ? day : best), days[0])
  const figures = [
    { label: 'Total clicks', value: formatNumber(total), note: hasClicks ? 'all time' : 'none yet' },
    {
      label: 'Busiest day',
      value: hasClicks ? formatNumber(busiest.count) : NO_VALUE,
      note: hasClicks ? formatDay(busiest.date) : 'no clicks yet',
    },
    {
      label: 'Daily average',
      value: hasClicks ? formatNumber(Math.round((total / days.length) * 10) / 10) : NO_VALUE,
      note: `over ${days.length} days`,
    },
  ]

  return (
    <>
      <section aria-labelledby="clicks-heading" className="mt-10">
        <h2 id="clicks-heading" className="text-xl font-semibold tracking-tight">
          Clicks
        </h2>
        <dl className="sheet mt-4 grid grid-cols-3 grid-rows-[auto_auto_1fr] divide-x">
          {figures.map(({ label, value, note }) => (
            <div key={label} className="row-span-3 grid min-w-0 grid-rows-subgrid p-4 sm:p-5">
              <dt className="text-sm text-muted-foreground">{label}</dt>
              <dd className="mt-1 text-3xl font-bold tracking-tight tabular-nums">{value}</dd>
              <dd className="text-sm text-muted-foreground">{note}</dd>
            </div>
          ))}
        </dl>

        <div className="sheet mt-3 p-5 sm:p-6">
          <div className="mb-4 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
            <h3 className="font-semibold">Clicks per day</h3>
            <p className="text-sm text-muted-foreground tabular-nums">
              {formatDay(days[0].date)} to {formatDay(days[days.length - 1].date)}
            </p>
          </div>
          <ClicksChart days={days} />
          {!hasClicks && (
            <p className="mt-4 border-t pt-4 text-sm text-muted-foreground">
              No clicks yet. Copy the short link and share it; every visit will be counted here, by
              day and by where it came from.
            </p>
          )}
        </div>
      </section>

      <section aria-labelledby="referrers-heading" className="sheet mt-3 p-5 sm:p-6">
        <h2 id="referrers-heading" className="font-semibold">
          Where clicks came from
        </h2>
        {topReferrers.length > 0 ? (
          <div className="mt-3">
            <ReferrersTable referrers={topReferrers} total={total} />
          </div>
        ) : (
          <p className="mt-2 text-sm text-muted-foreground">
            Nothing to show yet. The sites that send visitors to this link will be listed here.
          </p>
        )}
      </section>
    </>
  )
}
