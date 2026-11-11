// The mark is a link's loop with a piece snipped out.
export function Wordmark() {
  return (
    <span className="inline-flex items-center gap-2.5 text-lg font-bold tracking-tight">
      <svg aria-hidden viewBox="0 0 24 24" className="size-[1.25em]">
        <circle
          cx="12"
          cy="12"
          r="9"
          fill="none"
          stroke="currentColor"
          strokeWidth={2.4}
          strokeDasharray="48 8.5"
          strokeLinecap="round"
          transform="rotate(-40 12 12)"
        />
      </svg>
      SnipShort
    </span>
  )
}
