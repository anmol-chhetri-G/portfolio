# Portfolio — Anmol Singh Chhetri, Cybersecurity

React + Vite single-page portfolio, deployed on Cloudflare Workers. Light,
clean theme with an indigo accent (`src/styles/global.css`): greeting hero
with an arch visual, card sections, navy footer. The one ambient animation
is a faint fullscreen 13×13 dot grid running an animejs centre-ripple pulse
(`src/lib/gridPulse.js`); sections fade in on scroll via a one-shot
IntersectionObserver. No other motion on the page.

## Edit your content

Everything on the site lives in one file — no component changes needed:

- `src/data/portfolio.js` — name, role, bio, projects, skills, experience, links

## Local development

```bash
npm install
npm run dev        # http://localhost:5173
```

## Verify before deploying

`scripts/verify.mjs` runs 31 headless-browser checks: the 13×13 grid, the
live sonar pulse (centre-first ring, 0.7 → 1.6 flash with cyan color),
scroll reveal, experience + verified certifications + hobby repos,
reduced-motion support, SPA routing (including the new source-repo links),
the absence of `_redirects` (fatal to the Workers deploy), and the SEO files (`robots.txt`,
`sitemap.xml`). It needs two
servers plus Playwright with a full Chromium build (the headless *shell*
never fires `requestAnimationFrame`, which freezes every JS animation):

```bash
npm run build && npm run preview &   # production build -> :4173
npm run dev &                        # source + test harness -> :5174
npm i -D playwright && npx playwright install chromium
npm run verify
```

The animation harness at `tests/gridPulse.harness.html` is dev-only — it is
never included in the production build (`dist` contains only `index.html`).

## Deploy to Cloudflare (Workers Static Assets)

This repo deploys as a **Worker with Static Assets** via Workers Builds
(git-connected: `npm run build` → `npx wrangler deploy`, output `dist`).
Every push to `main` rebuilds and redeploys automatically:

```bash
git add -A && git commit -m "describe your change"
git push
```

Deep links like `/projects/network-ids` resolve to the SPA via
`not_found_handling: "single-page-application"` in `wrangler.jsonc` — do
**not** add a `public/_redirects` file: Workers rejects the Pages-style
`/* /index.html 200` splat as an infinite loop (it matches `/index.html`
itself) and the whole deploy fails with Cloudflare API error `100324`.
`npm run verify` guards against this by asserting `dist/` has no
`_redirects`.
