import { createTimeline, stagger } from 'animejs'

/**
 * Shared defaults for the dot-grid sonar pulse.
 * These live at module scope so React `useEffect` dependency arrays stay stable.
 */
export const DEFAULT_GRID = [13, 13]
export const DEFAULT_ORIGIN = 'center'
export const DEFAULT_MIN_SCALE = 0.7
export const DEFAULT_PEAK_SCALE = 1.6
export const DEFAULT_MIN_OPACITY = 0.3
export const DEFAULT_PEAK_OPACITY = 1
/** Idle dot color: soft slate, matches the `.dot` CSS base. */
export const DEFAULT_IDLE_COLOR = 'rgba(148, 163, 184, 0.25)'
/** Active dot color: electric cyan at full excitement. */
export const DEFAULT_ACTIVE_COLOR = 'rgba(6, 182, 212, 0.95)'
/** Per-dot flash length in ms — the ring's thickness in time. */
export const DEFAULT_FLASH_MS = 600
/** Ring travel speed: delay between neighbouring dots. */
export const DEFAULT_STAGGER_MS = 130
/** Pause between sweeps. */
export const DEFAULT_LOOP_DELAY_MS = 500

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
 * Creates the sonar pulse: a ring that expands from `origin`, flashing each
 * dot (scale + opacity + cyan color) as it passes, then pauses and repeats.
 * No `alternate` — the loop restarts so every sweep travels outward.
 *
 * @param {string} target - CSS selector of the grid items (default: '.dot')
 * @param {object} options - Overrides for grid, origin, minScale, peakScale,
 *   minOpacity, peakOpacity, idleColor, activeColor, loop, flashMs,
 *   staggerMs, loopDelayMs (all default to the constants above)
 * @returns {{ timeline: object, play: Function, pause: Function, restart: Function, destroy: Function }}
 *          Controller exposing playback control. Always call `destroy()` on cleanup.
 */
export function initGridPulse(target = '.dot', options = {}) {
  const {
    grid = DEFAULT_GRID,
    origin = DEFAULT_ORIGIN,
    minScale = DEFAULT_MIN_SCALE,
    peakScale = DEFAULT_PEAK_SCALE,
    minOpacity = DEFAULT_MIN_OPACITY,
    peakOpacity = DEFAULT_PEAK_OPACITY,
    idleColor = DEFAULT_IDLE_COLOR,
    activeColor = DEFAULT_ACTIVE_COLOR,
    loop = true,
    flashMs = DEFAULT_FLASH_MS,
    staggerMs = DEFAULT_STAGGER_MS,
    loopDelayMs = DEFAULT_LOOP_DELAY_MS,
  } = options

  const staggerOptions = { grid, from: origin }
  const half = flashMs / 2

  const timeline = createTimeline({
    loop,
    loopDelay: loop ? loopDelayMs : 0,
    autoplay: false,
  })

  timeline.add(
    target,
    {
      // Fast attack, soft release — a ping, not a breath.
      scale: [
        { to: peakScale, duration: half, ease: 'outQuad' },
        { to: minScale, duration: half, ease: 'inQuad' },
      ],
      opacity: [
        { to: peakOpacity, duration: half, ease: 'outQuad' },
        { to: minOpacity, duration: half, ease: 'inQuad' },
      ],
      backgroundColor: [
        { to: activeColor, duration: half, ease: 'outQuad' },
        { to: idleColor, duration: half, ease: 'inQuad' },
      ],
    },
    // Staggering the *timeline position* per target is what makes the ring travel.
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
