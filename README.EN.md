# WEB-Time

[Version en Español](./README.md)

**Personal site hosted on [GitHub Pages](https://fravelz.github.io/WEB-Time/): countdowns to important dates, Pomodoro timer, custom timers with stopwatch, and world clock.**

[![Screenshot](./public/screenshot.png)](https://fravelz.github.io/WEB-Time/)

Built with **Next.js 15** (App Router), **React 18**, **TypeScript**, **Tailwind CSS v4**, and **pnpm**.

---

## What’s included

- **Home** (`/inicio`) — Hero image and countdown accordion. Target dates are at midnight Colombia time; configuration lives in `src/features/inicio/config/countdowns.ts` (ages from birth date plus 2045 milestone).
- **Pomodoro** (`/pomodoro`) — 25 min work, 5 min short break, 15 min long break (every 4 pomodoros). Start, pause, and reset. State keeps running when you navigate away.
- **Timer** (`/temporizador`) — Multiple timers with editable hours and minutes, plus **stopwatch** mode. Add, start, pause, reset, or remove each timer. Timers and stopwatch keep running in the background while you browse the site.
- **World clock** (`/hora`) — Live clocks for Colombia, USA, Russia, China, Japan, UK, France, Germany, and India.

**Cross-cutting:**

- **Light and dark** theme (`ThemeToggle` in the header, `web-time-theme` cookie, `public/theme-init.js` to avoid flash on load).
- Header badges when Pomodoro or timer/stopwatch is running (`SiteHeader`).
- Responsive layout, visible keyboard focus on nav and countdown accordion.
- Custom 404 page (`src/components/pages/not-found/`).

---

## Quick start

**Requirements:** Node.js 18+

**pnpm** is recommended:

```bash
git clone <repo>
cd WEB-Time
pnpm install
pnpm run dev
```

Open [http://localhost:3000](http://localhost:3000). The `/` route redirects to `/inicio`.

**Routes:**

| Route           | Content                              |
| --------------- | ------------------------------------ |
| `/`             | Redirects to Home                    |
| `/inicio`       | Countdowns + image                   |
| `/pomodoro`     | Pomodoro timer                       |
| `/temporizador` | Multiple timers and stopwatch        |
| `/hora`         | World clock by time zone             |

---

## Project structure

```
├── src/
│   ├── app/                    # App Router routes (thin wrappers)
│   │   ├── layout.tsx          # Global layout, metadata, SSR theme
│   │   ├── globals.css         # Tailwind v4 + theme variables
│   │   ├── page.tsx            # Redirect to /inicio
│   │   ├── not-found.tsx
│   │   └── {inicio,pomodoro,temporizador,hora}/page.tsx
│   ├── features/               # Per-section logic
│   │   ├── inicio/             # Countdowns, config, accordion
│   │   ├── pomodoro/           # Context and 25/5/15 phases
│   │   ├── temporizador/       # Context, reducer, hooks, TimerCard
│   │   └── hora/               # Clocks by IANA zone
│   ├── components/
│   │   ├── layout/             # SiteHeader, SiteFooter, FeaturePageShell
│   │   ├── ui/                 # ThemeToggle, icons, controls
│   │   └── pages/not-found/
│   ├── providers/              # AppProviders, ThemeProvider
│   ├── lib/                    # theme, theme.server, fonts, time, cn
│   └── types/                  # e.g. css.d.ts
├── public/
│   ├── theme-init.js           # Theme before hydrate (no flash)
│   ├── alarma.mp3
│   ├── screenshot.png
│   └── Copia-de-Napoleón-Brienne.jpg
├── postcss.config.mjs
├── next.config.ts
└── package.json
```

---

## Time zone (Colombia)

Target dates are set to **midnight in Colombia (America/Bogotá, UTC-5)** in `src/features/inicio/config/countdowns.ts` (`midnightColombia`). Remaining time uses the browser clock (`src/features/inicio/lib/countdown.ts`).

---

## Configuration

In **`src/features/inicio/config/countdowns.ts`**:

- **Birth date:** `BIRTH_YEAR`, `BIRTH_MONTH`, `BIRTH_DAY` (default May 19, 2008). Used to build countdowns at ages 18, 20, 25, 30, 35, 40, 45, 50, 55, and 60.
- **Fixed countdown:** year 2045 (`midnightColombia(2045, 1, 1)`). You can add, edit, or remove entries in `buildCountdowns()`.
- **Timezone:** `COLOMBIA_UTC_OFFSET_HOURS` (5) in case Colombia’s offset changes.

---

## Light/dark theme

- Preference stored in the **`web-time-theme`** cookie (`light` | `dark`), not `localStorage`.
- **`public/theme-init.js`** runs before hydration to apply the theme without flash; if no cookie exists, it uses `prefers-color-scheme`.
- The server reads the cookie in `src/lib/theme.server.ts` and sets `data-theme` on `<html>`; the toggle is in the header (`ThemeToggle` + `ThemeProvider`).

---

## Scripts

| Command                 | Description                    |
| ----------------------- | ------------------------------ |
| `pnpm run dev`          | Development server             |
| `pnpm run build`        | Production build               |
| `pnpm start`            | Serve build (after `build`)  |
| `pnpm run lint`         | ESLint                         |
| `pnpm run lint:fix`     | ESLint with auto-fix           |
| `pnpm run format`       | Prettier (format)              |
| `pnpm run format:check` | Prettier (check only)          |
| `pnpm run clean`        | Remove `.next` folder          |
| `pnpm run react:doctor` | React diagnostics (opt., dev) |

---

## Production

```bash
pnpm run build
pnpm start
```

The public site is on **GitHub Pages**. With `pnpm run dev` or `pnpm start`, Next.js can read the theme cookie on the server for the initial HTML. On static hosting, `theme-init.js` and the browser cookie still apply the theme without Node on every request.

---

> **Author:** Fravelz
