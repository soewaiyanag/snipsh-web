import type { Link } from '@/api/types'
import { formatDate } from '@/lib/format'

// Both fields are planned in the API and may be missing; show them only when they say something.
export function LinkStatus({ link }: { link: Link }) {
  const isPaused = link.isActive === false
  const isExpired = link.expiresAt ? new Date(link.expiresAt) < new Date() : false

  if (!isPaused && !link.expiresAt) return null

  return (
    <span className="flex flex-wrap gap-1.5">
      {isPaused && <span className="rounded-full border px-2.5 py-0.5 text-xs font-medium">Paused</span>}
      {link.expiresAt && (
        <span className="rounded-full border px-2.5 py-0.5 text-xs font-medium">
          {isExpired ? 'Expired' : 'Expires'} {formatDate(link.expiresAt)}
        </span>
      )}
    </span>
  )
}
