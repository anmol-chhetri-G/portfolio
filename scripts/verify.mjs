/**
 * Verification for the portfolio.
 *
 * One server is needed (already in package.json scripts):
 *   npm run build && npm run preview &   # production build -> http://127.0.0.1:4173
 *   node scripts/verify.mjs
 *
 * Needs `npm i -D playwright` (`npx playwright install chromium` for the
 * bundled build). No full Chromium required — the grid is static, so nothing
 * depends on requestAnimationFrame.
 *
 * What it checks:
 *  A. Production page: grid renders 13x13, hero/projects copy, no console errors.
 *  B. The dot grid is static (no animation, no toggle) and scroll reveal
 *     activates sections; experience, verified certifications, hobby repos.
 *  C. SPA routing: deep links render, unknown slugs/routes are friendly.
 *  D. dist/ has no _redirects file (Cloudflare Workers rejects the Pages-style
 *     `/* /index.html 200` splat as an infinite loop — SPA fallback comes from
 *     `not_found_handling: "single-page-application"` in wrangler.jsonc
 *     instead), and the SEO files (robots.txt, sitemap.xml, og-image.jpg) ship.
 */
import { chromium } from 'playwright'
import { readFile } from 'node:fs/promises'

const PREVIEW = process.env.BASE_URL ?? 'http://127.0.0.1:4173'
const COLS = 13
const ROWS = 13
const COUNT = COLS * ROWS

const results = []
function check(name, pass, detail = '') {
  results.push({ name, pass })
  console.log(`${pass ? 'PASS' : 'FAIL'}  ${name}${detail ? ` — ${detail}` : ''}`)
}

const readTransforms = (page) =>
  page.evaluate(() => [...document.querySelectorAll('.dot')].map((d) => d.style.transform))

const browser = await chromium.launch()

try {
  // ---- A. Production page --------------------------------------------------
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } })
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
      photo: document.querySelector('.arch img')?.getAttribute('src'),
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
  check('hero renders the headline', shape.heading === 'Anmol Singh Chhetri', `h1 "${shape.heading}"`)
  check(
    'hero shows the profile photo',
    typeof shape.photo === 'string' && shape.photo.includes('profile'),
    shape.photo,
  )
  check(
    'four projects render',
    shape.projects.length === 4 &&
      shape.projects[0] === 'Network Intrusion Detection System',
    shape.projects.join(' | '),
  )

  // ---- B. Static grid, reveal, content --------------------------------------
  const first = await readTransforms(page)
  await page.waitForTimeout(1200)
  const second = await readTransforms(page)
  check(
    'dot grid is static (no animation)',
    first.length === COUNT && first.every((t, i) => t === second[i]),
    `${first.length} dots, none changed over 1200ms`,
  )

  const toggleCount = await page.evaluate(
    () => document.querySelectorAll('.motion-toggle').length,
  )
  check('no motion toggle rendered', toggleCount === 0)

  await page.evaluate(() => document.querySelector('#experience').scrollIntoView({ block: 'start' }))
  await page.waitForTimeout(1000)
  const revealed = await page.evaluate(() =>
    document.querySelector('#experience').classList.contains('in'),
  )
  check('scroll reveal activates sections', revealed, '#experience.in')

  const content = await page.evaluate(() => ({
    jobs: [...document.querySelectorAll('#experience .job h3')].map((h) => h.textContent),
    certLinks: [...document.querySelectorAll('.cert-list li a')].map((a) => a.href),
    tinkering: [...document.querySelectorAll('.tinker-list li a')].map((a) => a.href),
  }))
  check(
    'experience section lists both roles',
    content.jobs.length === 2 &&
      content.jobs[0] === 'Security Operations Center Analyst' &&
      content.jobs[1] === 'Security Researcher',
    content.jobs.join(' | '),
  )
  check(
    'certifications link to verifiable credentials',
    content.certLinks.some((h) => h.includes('hackviser.com/verify')) &&
      content.certLinks.some((h) => h.includes('labs.cyberwarfare.live/credential')),
    `${content.certLinks.length} verified of 5 listed`,
  )
  check(
    'tinkering row links both hobby repos',
    content.tinkering.some((h) => h.endsWith('/hourglass')) &&
      content.tinkering.some((h) => h.endsWith('/Sylph')),
    content.tinkering.join(' | '),
  )

  // ---- C. SPA routing ------------------------------------------------------
  const deep = await browser.newPage()
  const res = await deep.goto(`${PREVIEW}/projects/network-ids`, { waitUntil: 'networkidle' })
  const deepState = await deep.evaluate(() => ({
    h1: document.querySelector('h1')?.textContent,
    mounted: (document.getElementById('root')?.children.length ?? 0) > 0,
    repo: document.querySelector('.detail .cta-row a')?.href ?? '',
  }))
  check('deep link responds 200', res.status() === 200, `HTTP ${res.status()}`)
  check(
    'deep link renders the project page',
    deepState.mounted && deepState.h1 === 'Network Intrusion Detection System',
    `h1 "${deepState.h1}"`,
  )
  check(
    'project page links the source repo',
    deepState.repo ===
      'https://github.com/anmol-chhetri-G/python-intrusion-detection-system',
    deepState.repo,
  )

  await deep.goto(`${PREVIEW}/projects/nope`, { waitUntil: 'networkidle' })
  const nf = await deep.evaluate(() => document.querySelector('h1')?.textContent)
  check('unknown slug renders a friendly page', nf === 'Project not found', `h1 "${nf}"`)

  await deep.goto(`${PREVIEW}/totally/unknown/route`, { waitUntil: 'networkidle' })
  const nr = await deep.evaluate(() => document.querySelector('h1')?.textContent)
  check('unknown route renders a friendly page', nr === 'Page not found', `h1 "${nr}"`)

  // ---- D. Deploy artifacts ---------------------------------------------------
  // No _redirects may ship: Cloudflare Workers (Static Assets) rejects the
  // Pages-style `/* /index.html 200` splat as an infinite loop (it matches
  // /index.html itself). SPA fallback is provided by
  // `not_found_handling: "single-page-application"` in wrangler.jsonc instead.
  let redirects = null
  try {
    redirects = await readFile(new URL('../dist/_redirects', import.meta.url), 'utf8')
  } catch {
    redirects = null
  }
  check(
    'dist/ has no _redirects (would fail the Workers deploy)',
    redirects === null,
    redirects === null ? 'absent, SPA fallback via wrangler.jsonc' : JSON.stringify(redirects.trim()),
  )

  let robots = ''
  let sitemap = ''
  try {
    robots = await readFile(new URL('../dist/robots.txt', import.meta.url), 'utf8')
    sitemap = await readFile(new URL('../dist/sitemap.xml', import.meta.url), 'utf8')
  } catch {
    /* handled by the checks below */
  }
  check('dist/robots.txt present', /User-agent: \*/.test(robots), robots.split('\n')[0] ?? '')

  // OG social card: real file in dist + meta pointing at it, no placeholders.
  let ogImage = null
  try {
    ogImage = await readFile(new URL('../dist/og-image.jpg', import.meta.url))
  } catch {
    ogImage = null
  }
  const head = await page.evaluate(() => ({
    canonical: document.querySelector('link[rel="canonical"]')?.href ?? '',
    ogUrl: document.querySelector('meta[property="og:url"]')?.content ?? '',
    ogImage: document.querySelector('meta[property="og:image"]')?.content ?? '',
  }))
  check(
    'dist/og-image.jpg ships and is a real JPEG',
    ogImage !== null &&
      ogImage[0] === 0xff &&
      ogImage[1] === 0xd8 &&
      ogImage.length > 10000,
    ogImage ? `${(ogImage.length / 1024).toFixed(0)} KB JPEG` : 'missing',
  )
  check(
    'canonical + OG tags use the real domain',
    !/YOUR-DOMAIN/.test(head.canonical + head.ogUrl + head.ogImage) &&
      head.ogImage.endsWith('/og-image.jpg'),
    head.canonical,
  )
  check(
    'dist/sitemap.xml lists the project URLs',
    ['network-ids', 'steganography', 'keylogger', 'password-manager'].every((slug) =>
      sitemap.includes(`/projects/${slug}`),
    ),
    `${(sitemap.match(/<url>/g) ?? []).length} urls`,
  )

  check('production console is clean', errors.length === 0, errors.join(' | '))
} finally {
  await browser.close()
}

const failed = results.filter((r) => !r.pass)
console.log(`\n${results.length - failed.length}/${results.length} checks passed`)
process.exit(failed.length ? 1 : 0)
