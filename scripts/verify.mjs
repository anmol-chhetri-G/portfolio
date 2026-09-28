/**
 * Verification for the portfolio.
 *
 * Two servers are needed (both already in package.json scripts):
 *   npm run build && npm run preview &   # production build  -> http://127.0.0.1:4173
 *   npm run dev &                         # source + harness  -> http://127.0.0.1:5174
 *   node scripts/verify.mjs
 *
 * Needs `npm i -D playwright` plus a full Chromium (`npx playwright install
 * chromium`; the headless *shell* build must not be used — it never fires
 * requestAnimationFrame, which silently freezes every JS animation).
 *
 * What it checks:
 *  A. Production page: grid renders 13x13, hero/projects copy, no console errors.
 *  B. The idle pulse is live (scale + opacity), and the cursor ripple flares
 *     dots near the pointer. Scroll reveal activates sections.
 *  C. Animation semantics (deterministic, via tests/gridPulse.harness.html —
 *     the timeline is seeked, so no rAF dependence): centre ripples first,
 *     outer ring ~1s later, scale spans the configured [1.3, 0.65] range.
 *  D. prefers-reduced-motion holds the grid still and disables the ripple.
 *  E. SPA routing: deep links render, unknown slugs/routes are friendly.
 *  F. dist/_redirects ships so Cloudflare Pages serves deep links.
 */
import { chromium } from 'playwright'
import { readFile } from 'node:fs/promises'

const PREVIEW = process.env.BASE_URL ?? 'http://127.0.0.1:4173'
const DEV = process.env.DEV_URL ?? 'http://127.0.0.1:5174'
const COLS = 13
const ROWS = 13
const COUNT = COLS * ROWS
const CENTRE = Math.floor(ROWS / 2) * COLS + Math.floor(COLS / 2) // index 84
const CORNER = 0
const MID_RING = 3 * COLS + Math.floor(COLS / 2) // row 3, col 6 — 3 units out
const MIN_SCALE = 0.65
const MAX_SCALE = 1.3
const STAGGER_MS = 130
// animejs grid stagger measures Euclidean distance from the centre, so the
// corner-to-centre delay is 130ms x sqrt(6^2 + 6^2) ~= 1103ms.
const EXPECTED_SPREAD_MS = STAGGER_MS * Math.hypot((COLS - 1) / 2, (ROWS - 1) / 2)

const results = []
function check(name, pass, detail = '') {
  results.push({ name, pass })
  console.log(`${pass ? 'PASS' : 'FAIL'}  ${name}${detail ? ` — ${detail}` : ''}`)
}

// Inline scale of every dot (what animejs writes to el.style.transform).
const readScales = (page) =>
  page.evaluate(() =>
    [...document.querySelectorAll('.dot')].map((d) => {
      const m = /scale\(\s*([-\d.e]+)/.exec(d.style.transform)
      return m ? parseFloat(m[1]) : 1
    }),
  )

const readTransforms = (page) =>
  page.evaluate(() => [...document.querySelectorAll('.dot')].map((d) => d.style.transform))

const browser = await chromium.launch({ channel: 'chromium' })

try {
  // ---- A. Production page --------------------------------------------------
  const page = await browser.newPage({
    viewport: { width: 1280, height: 900 },
    reducedMotion: 'no-preference',
  })
  const errors = []
  page.on('pageerror', (e) => errors.push(e.message))
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()))

  await page.goto(`${PREVIEW}/`, { waitUntil: 'networkidle' })

  const shape = await page.evaluate(() => {
    const dots = [...document.querySelectorAll('.dot')]
    const grid = document.querySelector('.dot-grid')
    return {
      count: dots.length,
      columns: getComputedStyle(grid).gridTemplateColumns.split(' ').length,
      rows: new Set(dots.map((d) => Math.round(d.getBoundingClientRect().top))).size,
      fixed: getComputedStyle(grid).position === 'fixed',
      heading: document.querySelector('h1')?.textContent,
      projects: [...document.querySelectorAll('.project h3')].map((h) => h.textContent),
    }
  })

  check('grid renders 13 x 13 = 169 dots', shape.count === COUNT, `${shape.count} dots`)
  check(
    'grid lays out as 13 columns x 13 rows',
    shape.columns === COLS && shape.rows === ROWS,
    `${shape.columns} cols x ${shape.rows} rows`,
  )
  check('grid is a fixed fullscreen backdrop', shape.fixed, 'position: fixed')
  check(
    'hero renders the headline',
    shape.heading === 'Breaking systems ethically to learn how to defend them.',
    `h1 "${shape.heading}"`,
  )
  check(
    'four projects render',
    shape.projects.length === 4 &&
      shape.projects[0] === 'Network Intrusion Detection System',
    shape.projects.join(' | '),
  )

  // ---- B1. The idle pulse is live ------------------------------------------
  const live = await page.evaluate(
    ({ sampleMs }) =>
      new Promise((resolve) => {
        const dots = [...document.querySelectorAll('.dot')]
        const scaleOf = (el) => {
          const m = /scale\(\s*([-\d.e]+)/.exec(el.style.transform)
          return m ? parseFloat(m[1]) : 1
        }
        let lo = Infinity
        let hi = -Infinity
        const opacities = new Set()
        let frames = 0
        const t0 = performance.now()
        const step = () => {
          for (const d of dots) {
            const s = scaleOf(d)
            if (s < lo) lo = s
            if (s > hi) hi = s
            opacities.add(d.style.opacity)
          }
          frames++
          if (performance.now() - t0 < sampleMs) requestAnimationFrame(step)
          else resolve({ lo, hi, frames, opDistinct: opacities.size })
        }
        requestAnimationFrame(step)
      }),
    { sampleMs: 1500 },
  )
  check(
    'production pulse is live',
    live.frames > 10 && live.hi > 1.0 && live.lo <= MIN_SCALE + 0.01,
    `${live.frames} frames, scale ${live.lo.toFixed(3)} … ${live.hi.toFixed(3)}`,
  )
  check(
    'production pulse also breathes opacity',
    live.opDistinct > 3,
    `${live.opDistinct} distinct opacity values`,
  )

  // ---- B2. Cursor ripple ----------------------------------------------------
  // (640, 450) sits almost exactly on the centre dot of the fullscreen grid.
  // The pulse peaks at 1.3, so anything far above that must be the ripple.
  await page.mouse.move(640, 450)
  await page.waitForTimeout(200)
  const rippleMax = Math.max(...(await readScales(page)))
  check(
    'cursor ripple flares dots near the pointer',
    rippleMax > 1.6,
    `max scale ${rippleMax.toFixed(2)} after hover (pulse peaks at ${MAX_SCALE})`,
  )

  // ---- B3. Scroll reveal ----------------------------------------------------
  await page.evaluate(() => document.querySelector('#about').scrollIntoView({ block: 'start' }))
  await page.waitForTimeout(1000)
  const revealed = await page.evaluate(() =>
    document.querySelector('#about').classList.contains('in'),
  )
  check('scroll reveal activates sections', revealed, '#about.in')

  // ---- C. Animation semantics (deterministic, via the harness) --------------
  const harness = await browser.newPage()
  const harnessErrors = []
  harness.on('pageerror', (e) => harnessErrors.push(e.message))
  await harness.goto(`${DEV}/tests/gridPulse.harness.html`, { waitUntil: 'networkidle' })
  await harness.waitForFunction(() => window.__ready === true)

  const setup = await harness.evaluate(() => window.__harness.setup({ loop: false }))
  check('harness builds a 169-dot timeline', setup.count === COUNT, `${setup.count} dots`)

  const prof = await harness.evaluate(() => window.__harness.profile({}))

  check(
    'scale spans the configured range',
    prof.lo >= MIN_SCALE - 0.001 && prof.peak[CENTRE] >= MAX_SCALE - 0.02,
    `min ${prof.lo.toFixed(3)} … centre peak ${prof.peak[CENTRE].toFixed(3)} (target ${MIN_SCALE} … ${MAX_SCALE})`,
  )

  // Peaks must fall off radially: centre highest, mid-ring in between, edge lowest.
  const radial =
    prof.peak[CENTRE] > prof.peak[MID_RING] && prof.peak[MID_RING] > prof.peak[CORNER]
  check(
    'peaks fall off radially from the centre',
    radial,
    `centre ${prof.peak[CENTRE].toFixed(3)}, mid-ring ${prof.peak[MID_RING].toFixed(3)}, corner ${prof.peak[CORNER].toFixed(3)}`,
  )

  // The [1.3, 0.65] range is mapped over the full centre-to-corner radius, so
  // the four corner dots target exactly their start scale and never move.
  const cornerStatic =
    prof.firstMove[CORNER] === -1 && Math.abs(prof.peak[CORNER] - MIN_SCALE) < 0.001
  check(
    'corners rest at the start scale by design',
    cornerStatic,
    `corner peak ${prof.peak[CORNER].toFixed(4)}, never departs`,
  )

  // The ripple is proven by ordering: centre moves first, the outer ring last.
  // Farthest *moving* dots sit at distance sqrt(61) ~= 7.81, i.e. ~1015ms in.
  const movedTimes = prof.firstMove.filter((t) => t >= 0)
  const centreT = prof.firstMove[CENTRE]
  const maxT = Math.max(...movedTimes)
  check('centre dot moves at the start', centreT >= 0 && centreT <= 50, `t=${centreT}ms`)
  check(
    'outer ring moves ~1s after the centre',
    maxT >= 850 && maxT <= 1200,
    `last movement t=${maxT}ms (expect ~1015ms of ~${EXPECTED_SPREAD_MS.toFixed(0)}ms span)`,
  )
  check(
    'ripple ordering: centre first, edge last',
    movedTimes.length > COUNT / 2 &&
      centreT === Math.min(...movedTimes) &&
      maxT === Math.max(...movedTimes),
    `${movedTimes.length}/${COUNT} dots visibly move; first t=${centreT}ms, last t=${maxT}ms`,
  )
  check('harness console is clean', harnessErrors.length === 0, harnessErrors.join(' | '))

  // ---- D. Reduced motion ---------------------------------------------------
  const still = await browser.newPage({ reducedMotion: 'reduce' })
  await still.goto(`${PREVIEW}/`, { waitUntil: 'networkidle' })
  const before = await readTransforms(still)
  await still.waitForTimeout(900)
  const after = await readTransforms(still)
  check(
    'prefers-reduced-motion holds the grid still',
    before.length === COUNT && before.every((t, i) => t === after[i]),
    `${before.length} dots, none changed`,
  )
  await still.mouse.move(640, 450)
  await still.waitForTimeout(400)
  const afterHover = await readTransforms(still)
  check(
    'reduced motion disables the cursor ripple too',
    after.every((t, i) => t === afterHover[i]),
    'no dot changed on hover',
  )

  // ---- E. SPA routing ------------------------------------------------------
  const deep = await browser.newPage()
  const res = await deep.goto(`${PREVIEW}/projects/network-ids`, { waitUntil: 'networkidle' })
  const deepState = await deep.evaluate(() => ({
    h1: document.querySelector('h1')?.textContent,
    mounted: (document.getElementById('root')?.children.length ?? 0) > 0,
  }))
  check('deep link responds 200', res.status() === 200, `HTTP ${res.status()}`)
  check(
    'deep link renders the project page',
    deepState.mounted && deepState.h1 === 'Network Intrusion Detection System',
    `h1 "${deepState.h1}"`,
  )

  await deep.goto(`${PREVIEW}/projects/nope`, { waitUntil: 'networkidle' })
  const nf = await deep.evaluate(() => document.querySelector('h1')?.textContent)
  check('unknown slug renders a friendly page', nf === 'Project not found', `h1 "${nf}"`)

  await deep.goto(`${PREVIEW}/totally/unknown/route`, { waitUntil: 'networkidle' })
  const nr = await deep.evaluate(() => document.querySelector('h1')?.textContent)
  check('unknown route renders a friendly page', nr === 'Page not found', `h1 "${nr}"`)

  // ---- F. Cloudflare redirect rule -----------------------------------------
  let redirects = ''
  try {
    redirects = await readFile(new URL('../dist/_redirects', import.meta.url), 'utf8')
  } catch {
    /* handled by the check below */
  }
  check(
    'dist/_redirects present for Cloudflare Pages',
    /\/\*\s+\/index\.html\s+200/.test(redirects),
    JSON.stringify(redirects.trim()),
  )

  check('production console is clean', errors.length === 0, errors.join(' | '))
} finally {
  await browser.close()
}

const failed = results.filter((r) => !r.pass)
console.log(`\n${results.length - failed.length}/${results.length} checks passed`)
process.exit(failed.length ? 1 : 0)
