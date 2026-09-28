# Portfolio — Anmol Singh Chhetri, Cybersecurity

React + Vite single-page portfolio, deployed on Cloudflare Pages. Terminal /
SOC aesthetic in `src/styles/global.css`. The hero background is a fullscreen
13×13 dot grid running an animejs centre-ripple pulse
(`src/lib/gridPulse.js`), with a cursor ripple that flares dots near the
pointer. Sections fade in on scroll via a one-shot IntersectionObserver.

## Edit your content

Everything on the site lives in one file — no component changes needed:

- `src/data/portfolio.js` — name, role, bio, projects, skills, experience, links

## Local development

```bash
npm install
npm run dev        # http://localhost:5173
```

## Verify before deploying

`scripts/verify.mjs` runs 23 headless-browser checks: the 13×13 grid, the
live pulse (centre-first ordering, 0.65 → 1.3 scale range, opacity breathing),
the cursor ripple, scroll reveal, reduced-motion support, SPA routing, and the
Cloudflare `_redirects` rule. It needs two
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

## Deploy to Cloudflare Pages

```bash
git init
git add .
git commit -m "Initial portfolio commit"
git branch -M main
git remote add origin https://github.com/YOUR-GITHUB-USERNAME/my-portfolio.git
git push -u origin main
```

Then in the [Cloudflare dashboard](https://dash.cloudflare.com/):
**Workers & Pages → Create application → Pages → Connect to Git**, select the
repo, and use these build settings:

| Field | Value |
| --- | --- |
| Framework preset | `React (Vite)` |
| Build command | `npm run build` |
| Build output directory | `dist` |

`public/_redirects` (`/* /index.html 200`) ships in `dist` so direct visits to
routes like `/projects/project-one` resolve to the SPA instead of 404ing.
Every push to `main` after that redeploys automatically.
