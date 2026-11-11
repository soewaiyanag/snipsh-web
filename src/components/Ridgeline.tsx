import { cn } from '@/lib/utils'

const WIDTH = 1440
const HEIGHT = 420
const LINE_COUNT = 24
const POINT_COUNT = 96
const LINE_GAP = 13
const FIRST_BASELINE = 104
const MAX_PEAK = 96
const STAGGER_MS = 45
const SEED = 20261111

// A small seeded generator, so the plot is identical on every render and every visit.
function createRandom(seed: number) {
  let state = seed
  return () => {
    state = (state + 0x6d2b79f5) | 0
    let mixed = Math.imul(state ^ (state >>> 15), 1 | state)
    mixed = (mixed + Math.imul(mixed ^ (mixed >>> 7), 61 | mixed)) ^ mixed
    return ((mixed ^ (mixed >>> 14)) >>> 0) / 4294967296
  }
}

function buildPaths() {
  const random = createRandom(SEED)
  return Array.from({ length: LINE_COUNT }, (_, line) => {
    const baseline = FIRST_BASELINE + line * LINE_GAP
    const centre = WIDTH / 2 + (random() - 0.5) * 220
    const spread = 150 + random() * 170
    const peak = MAX_PEAK * (0.35 + random() * 0.65)
    const points = Array.from({ length: POINT_COUNT + 1 }, (_, index) => {
      const x = (index / POINT_COUNT) * WIDTH
      const envelope = Math.exp(-((x - centre) ** 2) / (2 * spread ** 2))
      const y = baseline - envelope * peak * (0.3 + random() * 0.7) - random() * 1.5
      return `${x.toFixed(1)},${y.toFixed(1)}`
    })
    return `M${points.join('L')}`
  })
}

const LINES = buildPaths()

// The product's one image: clicks as a stack of thin lines. Decorative here; the data is invented.
export function Ridgeline({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      preserveAspectRatio="none"
      className={cn('text-foreground', className)}
    >
      {LINES.map((line, index) => (
        <g key={line}>
          {/* Closed along the bottom, so each line hides the ones behind it. */}
          <path d={`${line}V${HEIGHT}H0Z`} className="fill-background" />
          <path
            d={line}
            pathLength={1}
            strokeDasharray={1}
            fill="none"
            stroke="currentColor"
            strokeWidth={1}
            vectorEffect="non-scaling-stroke"
            className="animate-trace"
            style={{ animationDelay: `${index * STAGGER_MS}ms` }}
          />
        </g>
      ))}
    </svg>
  )
}
