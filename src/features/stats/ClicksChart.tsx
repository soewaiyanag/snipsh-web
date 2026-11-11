import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import type { LinkStats } from '@/api/types'
import { formatDay, formatNumber } from '@/lib/format'

const CHART_HEIGHT = 260
const MIN_TICK_GAP = 36

type Day = LinkStats['perDay'][number]

export function ClicksChart({ days }: { days: Day[] }) {
  return (
    <figure>
      <figcaption className="sr-only">
        Clicks per day from {formatDay(days[0].date)} to {formatDay(days[days.length - 1].date)}.
        The same numbers are in the table below the chart.
      </figcaption>
      <div style={{ height: CHART_HEIGHT }} className="text-foreground">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={days} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
            <CartesianGrid vertical={false} stroke="var(--border)" />
            <XAxis
              dataKey="date"
              tickFormatter={formatDay}
              minTickGap={MIN_TICK_GAP}
              tickLine={false}
              axisLine={{ stroke: 'var(--border)' }}
              tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }}
            />
            <YAxis
              allowDecimals={false}
              width={36}
              tickLine={false}
              axisLine={false}
              tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }}
            />
            <Tooltip
              cursor={{ stroke: 'var(--input)' }}
              labelFormatter={(date) => formatDay(String(date))}
              formatter={(count) => [formatNumber(Number(count)), 'Clicks']}
              contentStyle={{
                background: 'var(--popover)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--popover-foreground)',
              }}
              itemStyle={{ color: 'var(--popover-foreground)' }}
            />
            {/* Straight segments: a smooth curve would invent values between two days.
                The line is the landing arc's light: the ring colour with a soft glow. */}
            <Area
              type="linear"
              dataKey="count"
              stroke="var(--ring)"
              strokeWidth={1.5}
              fill="var(--primary)"
              fillOpacity={0.12}
              style={{ filter: 'drop-shadow(0 0 6px var(--primary))' }}
              activeDot={{ r: 4, fill: 'var(--primary)', stroke: 'var(--background)' }}
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <details className="mt-3 text-sm">
        <summary className="w-fit cursor-pointer rounded-sm text-muted-foreground hover:text-foreground">
          Show the daily numbers
        </summary>
        <table className="mt-3 w-full max-w-xs tabular-nums">
          <thead>
            <tr className="border-b text-left text-muted-foreground">
              <th className="py-2 font-medium">Day</th>
              <th className="py-2 text-right font-medium">Clicks</th>
            </tr>
          </thead>
          <tbody>
            {days.map(({ date, count }) => (
              <tr key={date} className="border-b">
                <td className="py-1.5">{formatDay(date)}</td>
                <td className="py-1.5 text-right">{formatNumber(count)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </details>
    </figure>
  )
}
