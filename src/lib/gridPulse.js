import { createTimeline, stagger } from 'animejs'

/**
 * Shared defaults for the dot-grid pulse.
 * These live at module scope so React `useEffect` dependency arrays stay stable.
 */
export const DEFAULT_GRID = [13, 13]
export const DEFAULT_SCALE_RANGE = [1.1, 0.75]
export const DEFAULT_ORIGIN = 'center'
export const DEFAULT_STAGGER_MS = 200
/** animejs' own default tween duration. */
export const DEFAULT_DURATION_MS = 1000

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
 * Creates a staggered, rippling grid animation.
 *
 * @param {string} target - CSS selector of the grid items (default: '.dot')
 * @param {Array<number>} gridDimensions - [columns, rows] (default: [13, 13])
 * @param {string} origin - Where the ripple starts: 'center' | 'first' | 'last' | 'edges' (default: 'center')
 * @param {Array<number>} scaleRange - [max scale, min scale] (default: [1.1, 0.75])
 * @param {boolean} loop - Whether the animation should loop continuously (default: true)
 * @param {number} durationMs - Tween duration per dot (default: 900)
 * @param {number} staggerMs - Delay between neighbouring dots (default: 200)
 * @returns {{ timeline: object, play: Function, pause: Function, restart: Function, destroy: Function }}
 *          Controller exposing playback control. Always call `destroy()` on cleanup.
 */
export function initGridPulse(
  target = '.dot',
  gridDimensions = DEFAULT_GRID,
  origin = DEFAULT_ORIGIN,
  scaleRange = DEFAULT_SCALE_RANGE,
  loop = true,
  durationMs = DEFAULT_DURATION_MS,
  staggerMs = DEFAULT_STAGGER_MS,
) {
  const staggerOptions = { grid: gridDimensions, from: origin }

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
