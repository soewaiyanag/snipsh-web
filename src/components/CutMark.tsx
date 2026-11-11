import { cn } from '@/lib/utils'

const PENCIL_FILTER_ID = 'pencil-grain'

// Roughens a stroke so it reads as drawn by hand instead of ruled.
function PencilFilter() {
  return (
    <svg aria-hidden className="absolute size-0">
      <filter id={PENCIL_FILTER_ID} x="-5%" y="-40%" width="110%" height="180%">
        <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed="4" result="grain" />
        <feDisplacementMap in="SourceGraphic" in2="grain" scale="3" xChannelSelector="R" yChannelSelector="G" />
      </filter>
    </svg>
  )
}

// The proofreader's delete mark: the stroke runs on and curls back through itself.
export function DeleteLoop({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 44 24"
      fill="none"
      className={cn('inline-block h-[1.2em] w-[2.2em] overflow-visible align-middle', className)}
    >
      <path
        d="M0 14 C9 14 21 15 27 10 C32 6 30 1 25 2 C19 3 18 11 24 15 C29 18 38 17 43 9"
        pathLength={1}
        strokeDasharray={1}
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  )
}

// A long URL with the editor's pencil through it. The stroke follows the text across line breaks.
export function StruckUrl({ url, className }: { url: string; className?: string }) {
  return (
    <span className={cn('typescript relative grid', className)}>
      <span className="col-start-1 row-start-1 text-muted-foreground">{url}</span>
      <span
        aria-hidden
        className="pointer-events-none col-start-1 row-start-1 text-transparent select-none"
        style={{ filter: `url(#${PENCIL_FILTER_ID})` }}
      >
        <span className="pencil-strike">{url}</span>
        <DeleteLoop className="-ml-[0.15em] animate-loop text-primary" />
      </span>
      <PencilFilter />
    </span>
  )
}
