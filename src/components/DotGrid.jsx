import { useEffect, useRef } from 'react'
import {
  DEFAULT_GRID,
  DEFAULT_ORIGIN,
  DEFAULT_SCALE_RANGE,
  countDots,
  initGridPulse,
  prefersReducedMotion,
} from '../lib/gridPulse'

/**
 * Renders a [columns x rows] grid of dots and runs the staggered pulse on it.
 *
 * Dots are rendered declaratively (not built in an effect) so the markup is
 * always correct before the animation starts — no flash of an empty grid.
 * The inline `scale()` matches the animation's minimum scale, so the first
 * painted frame is already in the right place.
 */
export default function DotGrid({
  grid = DEFAULT_GRID,
  origin = DEFAULT_ORIGIN,
  scaleRange = DEFAULT_SCALE_RANGE,
  loop = true,
  label = 'Decorative dot grid',
}) {
  const containerRef = useRef(null)
  const [columns, rows] = grid
  const total = countDots(grid)
  const minScale = scaleRange[1]

  // Serialise the config so array props don't retrigger the effect every render.
  const configKey = JSON.stringify([grid, origin, scaleRange, loop])

  useEffect(() => {
    // Respect the OS "reduce motion" setting: hold the grid still.
    if (prefersReducedMotion()) return

    const controller = initGridPulse('.dot', grid, origin, scaleRange, loop)
    controller.play()

    return () => controller.destroy()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [configKey])

  return (
    <div
      className="dot-grid"
      ref={containerRef}
      style={{ '--dot-cols': columns, '--dot-rows': rows }}
      role="img"
      aria-label={label}
    >
      {Array.from({ length: total }, (_, i) => (
        <span
          className="dot"
          key={i}
          style={{ transform: `scale(${minScale})` }}
          aria-hidden="true"
        />
      ))}
    </div>
  )
}
