import { cn } from '@/lib/utils'

const WIDTH = 1440
const HEIGHT = 340
const LINE_COUNT = 14
const POINT_COUNT = 180
const LINE_GAP = 17
const FIRST_BASELINE = 100
const MAX_PEAK = 80
const STAGGER_MS = 60
const SEED = 20261111
const FULL_TURN = Math.PI * 2

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

// Each line is a slow swell under a bell-shaped envelope: calm at the edges, rising in the middle.
function buildPaths() {
  const random = createRandom(SEED)
  return Array.from({ length: LINE_COUNT }, (_, line) => {
    const baseline = FIRST_BASELINE + line * LINE_GAP
    const centre = WIDTH / 2 + (random() - 0.5) * 280
    const spread = 190 + random() * 150
    const peak = MAX_PEAK * (0.4 + random() * 0.6)
    const slow = { rate: (FULL_TURN * (2 + random() * 3)) / WIDTH, phase: random() * FULL_TURN }
    const fast = { rate: (FULL_TURN * (6 + random() * 5)) / WIDTH, phase: random() * FULL_TURN }
    const points = Array.from({ length: POINT_COUNT + 1 }, (_, index) => {
      const x = (index / POINT_COUNT) * WIDTH
      const envelope = Math.exp(-((x - centre) ** 2) / (2 * spread ** 2))
      const swell =
        0.6 + 0.28 * Math.sin(x * slow.rate + slow.phase) + 0.12 * Math.sin(x * fast.rate + fast.phase)
      return `${x.toFixed(1)},${(baseline - envelope * peak * swell).toFixed(1)}`
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
