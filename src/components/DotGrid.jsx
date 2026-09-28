import { useEffect, useRef } from 'react'
import {
  DEFAULT_GRID,
  DEFAULT_SCALE_RANGE,
  countDots,
  initCursorRipple,
  initGridPulse,
  prefersReducedMotion,
} from '../lib/gridPulse'

/**
 * Full-viewport ambient background: a 13x13 grid of dots running the idle
 * centre-ripple pulse, plus a cursor ripple that flares dots near the pointer.
 *
 * Dots render declaratively (not built in an effect) so the markup is correct
 * before the animation starts. The inline `scale()` matches the animation's
 * minimum scale, so the first painted frame is already in the right place.
 * Both effects are skipped entirely under prefers-reduced-motion.
 */
export default function DotGrid() {
  const containerRef = useRef(null)
  const [columns, rows] = DEFAULT_GRID
  const total = countDots(DEFAULT_GRID)
  const minScale = DEFAULT_SCALE_RANGE[1]

  useEffect(() => {
    // Respect the OS "reduce motion" setting: hold the grid still, no ripple.
    if (prefersReducedMotion()) return

    const pulse = initGridPulse('.dot')
    pulse.play()
    const stopRipple = initCursorRipple(containerRef.current)

    return () => {
      stopRipple()
      pulse.destroy()
    }
  }, [])

  return (
    <div
      className="dot-grid"
      ref={containerRef}
      style={{ '--dot-cols': columns, '--dot-rows': rows }}
      aria-hidden="true"
    >
      {Array.from({ length: total }, (_, i) => (
        <span
          className="dot"
          key={i}
          style={{ transform: `scale(${minScale})` }}
        />
      ))}
    </div>
  )
}
