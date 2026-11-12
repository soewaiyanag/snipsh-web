import type { LinkStats } from '@/api/types'
import { formatNumber } from '@/lib/format'

const DIRECT_LABEL = 'Direct: typed, pasted or opened from an app'

type ReferrersTableProps = { referrers: LinkStats['topReferrers']; total: number }

const PERCENT = 100

export function ReferrersTable({ referrers, total }: ReferrersTableProps) {
  const highest = Math.max(...referrers.map(({ count }) => count))

  return (
    <table className="w-full tabular-nums">
      <thead>
        <tr className="border-b text-left text-sm text-muted-foreground">
          <th className="py-2 font-medium">Came from</th>
          <th className="py-2 text-right font-medium">Clicks</th>
          <th className="py-2 pl-6 text-right font-medium">Share</th>
        </tr>
      </thead>
      <tbody>
        {referrers.map(({ referrer, count }) => (
          <tr key={referrer} className="border-b">
            <td className="py-3">
              <span className={referrer ? 'link-text' : undefined}>{referrer || DIRECT_LABEL}</span>
              {/* Length carries the comparison, so no colour is needed. */}
              <span
                aria-hidden
                className="mt-2 block h-0.5 rounded-full bg-ring shadow-[0_0_8px_var(--primary)]"
                style={{ width: `${(count / highest) * PERCENT}%` }}
              />
            </td>
            <td className="py-3 pl-6 text-right align-top">{formatNumber(count)}</td>
            <td className="py-3 pl-6 text-right align-top text-muted-foreground">
              {Math.round((count / total) * PERCENT)}%
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
