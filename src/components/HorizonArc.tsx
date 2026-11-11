// The arc is the top of a circle this wide: the logo's ring, seen from very close.
const ARC_DIAMETER_PX = 2400

export function HorizonArc() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute -top-16 left-1/2 -z-10 h-208 w-screen -translate-x-1/2 overflow-hidden [mask-image:linear-gradient(#000_72%,transparent)]"
    >
      <div className="absolute top-148 left-1/2 -translate-x-1/2">
        {/* Behind the disc, so only the half above the horizon shows. */}
        <div className="absolute -top-24 -left-72 h-48 w-144 rounded-full bg-primary opacity-80 blur-3xl" />
        <div
          className="absolute left-1/2 -translate-x-1/2 rounded-full border-t-[1.5px] border-ring bg-background shadow-horizon"
          style={{ width: ARC_DIAMETER_PX, height: ARC_DIAMETER_PX }}
        />
      </div>
    </div>
  )
}
