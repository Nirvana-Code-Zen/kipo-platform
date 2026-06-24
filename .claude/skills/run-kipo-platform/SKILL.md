---
name: run-kipo-platform
description: Build, run, and drive kipo-platform. Use when asked to start the landing, run the React app, start the FastAPI backend, take a screenshot of the UI, build packages, or interact with any running Kipo app.
---

pnpm monorepo with two web apps and a Python backend. Web apps are driven by `driver.mjs` (Playwright-based, workspace root must be cwd). FastAPI backend verified with `curl`.

All paths below are relative to the workspace root (`kipo-platform/`).

## Prerequisites

macOS with Node 20+, pnpm 9+, Python 3.11+ recommended (3.9.6 works with direct `pip install`).

```bash
node --version   # >= 20
pnpm --version   # >= 9
python3 --version
```

## Setup

```bash
# 1. Install JS deps (includes Playwright at workspace root)
pnpm install

# 2. Install Playwright browser (one-time, ~94 MB)
npx playwright install chromium

# 3. Build the component library (must precede app builds)
pnpm build:packages
# → packages/ui-react/dist/index.js

# 4. Backend Python deps (one-time)
cd apps/app-react-python/backend
python3 -m venv .venv
.venv/bin/pip install fastapi "uvicorn[standard]" pydantic python-dotenv
cd -
```

## Run (agent path)

### Landing (Astro — port 4321)

```bash
# Start server
pnpm --filter landing-astro dev > /tmp/landing.log 2>&1 &
echo $! > /tmp/landing.pid

# Wait until ready
for i in $(seq 1 30); do
  curl -sf http://localhost:4321 >/dev/null 2>&1 && echo "ready" && break
  sleep 1
done

# Screenshot via driver (run from workspace root)
node .claude/skills/run-kipo-platform/driver.mjs landing
# Screenshots → /tmp/kipo-screenshots/landing/01-initial.png, 02-scrolled.png

# Stop
kill $(cat /tmp/landing.pid)
```

### React App (Vite — port 5173)

```bash
# Start server
pnpm --filter app-react-python dev > /tmp/app.log 2>&1 &
echo $! > /tmp/app.pid

for i in $(seq 1 30); do
  curl -sf http://localhost:5173 >/dev/null 2>&1 && echo "ready" && break
  sleep 1
done

# Screenshot + button interaction
node .claude/skills/run-kipo-platform/driver.mjs app
# Screenshots → /tmp/kipo-screenshots/app/01-initial.png, 02-interacted.png

kill $(cat /tmp/app.pid)
```

### FastAPI backend (port 8000)

```bash
cd apps/app-react-python/backend
.venv/bin/uvicorn main:app --reload > /tmp/backend.log 2>&1 &
echo $! > /tmp/backend.pid
cd -

for i in $(seq 1 15); do
  curl -sf http://localhost:8000/api/health && echo "" && break
  sleep 1
done
# → {"status":"ok","version":"0.0.1"}

# OpenAPI docs
curl -sf http://localhost:8000/api/docs >/dev/null && echo "docs OK"

kill $(cat /tmp/backend.pid)
```

### Driver options

```
node .claude/skills/run-kipo-platform/driver.mjs <landing|app> [--url URL] [--out /path]
```

| option | default |
|---|---|
| `landing` | navigates http://localhost:4321, two screenshots |
| `app` | navigates http://localhost:5173, clicks "Pagar" button, two screenshots |
| `--url` | override target URL |
| `--out /path` | override screenshot output dir |

## Run (human path)

```bash
pnpm --filter landing-astro dev    # → http://localhost:4321
pnpm --filter app-react-python dev # → http://localhost:5173
# Ctrl-C to stop
```

## Build

```bash
# All packages then apps
pnpm build

# Packages only (no apps)
pnpm build:packages

# Single package
pnpm --filter @kipo/ui-react build
```

---

## Gotchas

- **`@import` must precede `@tailwind` in global.css** — PostCSS/vite-css warns and may mangle output if `@import '@kipo/theme/index.css'` comes after `@tailwind base`. Keep `@import` at the top. Both `apps/*/src/styles/global.css` files are already correct after this was fixed during initial run.

- **Vite React app needs `postcss.config.js`** — `@astrojs/tailwind` injects PostCSS automatically for Astro, but the Vite React app does NOT auto-detect Tailwind. A `postcss.config.js` exporting `{ plugins: { tailwindcss: {}, autoprefixer: {} } }` is required in `apps/app-react-python/`. Without it, Tailwind classes in `@kipo/ui-react` components render as unstyled browser defaults.

- **Font files need `server.fs.allow`** — fonts live at workspace root (`fonts-kipo/`) but both apps are two levels deep. Both `vite.config.ts` and `astro.config.mjs` include `server: { fs: { allow: ['../..'] } }`. Without this, Vite refuses to serve font TTF files in dev mode (404s silently; page renders but fonts fall back).

- **`pip install -e ".[dev]"` fails on Python 3.9 / pip 21.2** — hatchling editable installs require pip ≥ 22. Use direct `pip install fastapi "uvicorn[standard]" pydantic python-dotenv` instead.

- **`@kipo/ui-react` Tailwind classes get purged if content path missing** — the app's `tailwind.config.js` must include `'../../packages/ui-react/src/**/*.{ts,tsx}'` in `content`. Without it, all Tailwind classes used inside the library are purged and components render unstyled.

- **`playwright` is a root devDependency, not global** — run `node driver.mjs` from workspace root, or `node_modules/.bin/playwright` won't resolve. The driver uses bare `import { chromium } from 'playwright'` which resolves from the root `node_modules/`.

## Troubleshooting

- **`Cannot find package 'playwright'` from driver.mjs**: you're not running from workspace root, or `pnpm install` wasn't run. Fix: `cd kipo-platform && node .claude/skills/run-kipo-platform/driver.mjs landing`.

- **Buttons render as plain browser buttons (unstyled)**: `postcss.config.js` missing from `apps/app-react-python/`. Check it exists. Also verify `content` in `tailwind.config.js` includes the ui-react src path.

- **Fonts don't load (text falls back to system font)**: Vite is blocking access to workspace root. Check `server.fs.allow: ['../..']` is in `apps/app-react-python/vite.config.ts`.

- **FastAPI: `Address already in use` on port 8000**: `kill $(cat /tmp/backend.pid)` or `lsof -ti:8000 | xargs kill`.

- **Astro: `@import must precede all other statements` warning**: `global.css` has wrong import order. Move `@import '@kipo/theme/index.css'` to line 1 before any `@tailwind` directive.
