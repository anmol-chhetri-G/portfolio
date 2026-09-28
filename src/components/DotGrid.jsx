const COLUMNS = 13
const ROWS = 13

/**
 * Static dot field: a faint fullscreen backdrop. No animation, no JS —
 * pure markup + CSS, so there is nothing to pause, persist, or reduce.
 */
export default function DotGrid() {
  return (
    <div
      className="dot-grid"
      style={{ '--dot-cols': COLUMNS, '--dot-rows': ROWS }}
      aria-hidden="true"
    >
      {Array.from({ length: COLUMNS * ROWS }, (_, i) => (
        <span className="dot" key={i} />
      ))}
    </div>
  )
}
