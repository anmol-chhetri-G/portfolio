# Portfolio — Anmol Singh Chhetri, Cybersecurity

React + Vite single-page portfolio, deployed on Cloudflare Workers. Light,
clean theme with an indigo accent (`src/styles/global.css`): greeting hero
with an arch visual, card sections, navy footer. The dot grid is a static
CSS backdrop — no animation anywhere except subtle scroll reveals, so there
is nothing to pause and `prefers-reduced-motion` needs no special handling.

## Edit your content

Everything on the site lives in one file — no component changes needed:

- `src/data/portfolio.js` — name, role, bio, projects, skills, experience, links

## Local development

```bash
npm install
npm run dev        # http://localhost:5173
```

## Verify before deploying

`scripts/verify.mjs` runs 23 headless-browser checks: the static 13×13 grid,
scroll reveal, experience + verified certifications + hobby repos, SPA
routing (including source-repo links), the absence of `_redirects` (fatal
to the Workers deploy), and the SEO files (`robots.txt`, `sitemap.xml`,
`og-image.jpg`). It needs one server plus Playwright:

```bash
npm run build && npm run preview &   # production build -> :4173
npm i -D playwright && npx playwright install chromium
npm run verify
```

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
