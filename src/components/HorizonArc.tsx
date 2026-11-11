import { useEffect, useRef } from 'react'

// The arc is the top of a circle this wide: the logo's ring, seen from very close.
const ARC_DIAMETER_PX = 2400
const ARC_RADIUS_PX = ARC_DIAMETER_PX / 2

// A still horizon with one moving thing: a brighter light that follows the cursor along the arc.
export function HorizonArc() {
  const light = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Touch screens and reduced motion keep the light still, in the centre.
    if (!window.matchMedia('(hover: hover) and (prefers-reduced-motion: no-preference)').matches) return

    function follow(event: PointerEvent) {
      const fromCentre = Math.max(
        -ARC_RADIUS_PX,
        Math.min(ARC_RADIUS_PX, event.clientX - window.innerWidth / 2),
      )
      // How far the circle's edge has fallen away at this distance from its top.
      const drop = ARC_RADIUS_PX - Math.sqrt(ARC_RADIUS_PX ** 2 - fromCentre ** 2)
      light.current?.style.setProperty('translate', `${fromCentre}px ${drop}px`)
    }

    window.addEventListener('pointermove', follow)
    return () => window.removeEventListener('pointermove', follow)
  }, [])

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute -top-16 left-1/2 -z-10 h-208 w-screen -translate-x-1/2 overflow-hidden [mask-image:linear-gradient(#000_72%,transparent)]"
    >
      <div className="absolute top-148 left-1/2 -translate-x-1/2">
        {/* Behind the disc, so only the half above the horizon shows. */}
        <div
          ref={light}
          className="absolute -top-24 -left-72 h-48 w-144 rounded-full bg-primary opacity-80 blur-3xl transition-[translate] duration-700 ease-out-expo"
        />
        <div
          className="absolute left-1/2 -translate-x-1/2 rounded-full border-t-[1.5px] border-ring bg-background shadow-horizon"
          style={{ width: ARC_DIAMETER_PX, height: ARC_DIAMETER_PX }}
        />
      </div>
    </div>
  )
}
