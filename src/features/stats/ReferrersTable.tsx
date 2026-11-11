import type { LinkStats } from '@/api/types'
import { formatNumber } from '@/lib/format'

const DIRECT_LABEL = 'Direct (typed, pasted or from an app)'

export function ReferrersTable({ referrers }: { referrers: LinkStats['topReferrers'] }) {
  const highest = Math.max(...referrers.map(({ count }) => count))

  return (
    <table className="w-full tabular-nums">
      <thead>
        <tr className="border-b text-left text-sm text-muted-foreground">
          <th className="py-2 font-medium">Came from</th>
          <th className="py-2 text-right font-medium">Clicks</th>
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
                className="mt-2 block h-px bg-foreground"
                style={{ width: `${(count / highest) * 100}%` }}
              />
            </td>
            <td className="py-3 pl-6 text-right align-top">{formatNumber(count)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
