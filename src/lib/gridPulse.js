import { createTimeline, stagger } from 'animejs'

/**
 * Shared defaults for the dot-grid pulse.
 * These live at module scope so React `useEffect` dependency arrays stay stable.
 */
export const DEFAULT_GRID = [13, 13]
export const DEFAULT_ORIGIN = 'center'
export const DEFAULT_SCALE_RANGE = [1.3, 0.65]
export const DEFAULT_OPACITY_RANGE = [1, 0.35]
export const DEFAULT_DURATION_MS = 800
export const DEFAULT_STAGGER_MS = 130

/** Number of dots in a [columns, rows] grid. */
export function countDots([columns, rows]) {
  return columns * rows
}

/** True when the visitor has asked the OS to reduce motion. */
export function prefersReducedMotion() {
  if (typeof window === 'undefined' || !window.matchMedia) return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/**
 * Creates the idle breathing pulse: a scale + opacity ripple that radiates
 * outward from `origin`, then breathes back (loop + alternate).
 *
 * @param {string} target - CSS selector of the grid items (default: '.dot')
 * @param {object} options - Overrides for grid, origin, scaleRange,
 *   opacityRange, loop, durationMs, staggerMs (all default to the constants above)
 * @returns {{ timeline: object, play: Function, pause: Function, restart: Function, destroy: Function }}
 *          Controller exposing playback control. Always call `destroy()` on cleanup.
 */
export function initGridPulse(target = '.dot', options = {}) {
  const {
    grid = DEFAULT_GRID,
    origin = DEFAULT_ORIGIN,
    scaleRange = DEFAULT_SCALE_RANGE,
    opacityRange = DEFAULT_OPACITY_RANGE,
    loop = true,
    durationMs = DEFAULT_DURATION_MS,
    staggerMs = DEFAULT_STAGGER_MS,
  } = options

  const staggerOptions = { grid, from: origin }

  const timeline = createTimeline({
    loop,
    // `alternate` makes the loop breathe back and forth instead of snapping.
    alternate: loop,
    autoplay: false,
  })

  timeline.add(
    target,
    {
      scale: stagger(scaleRange, staggerOptions),
      opacity: stagger(opacityRange, staggerOptions),
      duration: durationMs,
      ease: 'inOutQuad',
    },
    // Staggering the *timeline position* per target is what makes the ripple travel.
    stagger(staggerMs, staggerOptions),
  )

  return {
    timeline,
    play: () => timeline.play(),
    pause: () => timeline.pause(),
    restart: () => timeline.restart(),
    /** Revert inline styles and stop the engine. Use this on unmount. */
    destroy: () => timeline.revert(),
  }
}
