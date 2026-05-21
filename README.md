# WEB-Time

[English version](./README.EN.md)

**countdowns hacia fechas importantes, temporizador Pomodoro, temporizadores personalizados con cronómetro y hora mundial.**

![Screenshot](public/screenshot.png)

Hecho con **Next.js 15** (App Router), **React 18**, **TypeScript**, **Tailwind CSS v4** y **pnpm**.

---

## Qué incluye

- **Inicio** (`/inicio`) — Imagen destacada y countdowns en acordeón. Las fechas objetivo son a medianoche, hora de Colombia; la configuración está en `src/features/inicio/config/countdowns.ts` (edades desde la fecha de nacimiento y objetivo 2045).
- **Pomodoro** (`/pomodoro`) — 25 min trabajo, 5 min descanso corto, 15 min descanso largo (cada 4 pomodoros). Iniciar, pausar y reiniciar. El estado sigue activo al cambiar de página.
- **Temporizador** (`/temporizador`) — Varios temporizadores con horas y minutos editables, más modo **cronómetro**. Añadir, iniciar, pausar, reiniciar o quitar cada uno. Los temporizadores y el cronómetro siguen en segundo plano al navegar por la web.
- **Hora** (`/hora`) — Relojes en tiempo real para Colombia, EE. UU., Rusia, China, Japón, Reino Unido, Francia, Alemania e India.

**Transversal:**

- Tema **claro y oscuro** (`ThemeToggle` en el header, cookie `web-time-theme`, script `public/theme-init.js` para evitar flash al cargar).
- Header con indicadores si hay Pomodoro o temporizador/cronómetro en marcha (`SiteHeader`).
- Diseño responsive, foco visible en navegación y acordeón de countdowns.
- Página 404 personalizada (`src/app/not-found.tsx`).
- Navegación por teclado (Tab y Shift+Tab).

---

## Inicio rápido

**Requisitos:** Node.js 18+

Se recomienda **pnpm**:

```bash
git clone <repo>
cd WEB-Time
pnpm install
pnpm run dev
```

Abre [http://localhost:3000](http://localhost:3000). La ruta `/` redirige a `/inicio`.

**Rutas:**

| Ruta            | Contenido                             |
| --------------- | ------------------------------------- |
| `/`             | Redirige a Inicio                     |
| `/inicio`       | Countdowns + imagen                   |
| `/pomodoro`     | Reloj Pomodoro                        |
| `/temporizador` | Temporizadores múltiples y cronómetro |
| `/hora`         | Hora mundial por zona                 |

---

## Estructura del proyecto

```text
├── src/
│   ├── app/                    # Rutas App Router (wrappers finos)
│   │   ├── layout.tsx          # Layout global, metadata, tema SSR
│   │   ├── globals.css         # Tailwind v4 + variables de tema
│   │   ├── page.tsx            # Redirección a /inicio
│   │   ├── not-found.tsx
│   │   └── {inicio,pomodoro,temporizador,hora}/page.tsx
│   ├── features/               # Lógica por sección
│   │   ├── inicio/             # Countdowns, config, acordeón
│   │   ├── pomodoro/           # Contexto y fases 25/5/15
│   │   ├── temporizador/       # Context, reducer, hooks, TimerCard
│   │   └── hora/               # Relojes por zona IANA
│   ├── components/
│   │   ├── layout/             # SiteHeader, SiteFooter, FeaturePageShell
│   │   └── ui/                 # ThemeToggle, iconos, controles
│   ├── providers/              # AppProviders, ThemeProvider
│   ├── lib/                    # theme, theme.server, fonts, time, cn
│   └── types/                  # p. ej. css.d.ts
├── public/
│   ├── theme-init.js           # Tema antes de la hidratación (sin flash)
│   ├── alarma.mp3
│   ├── screenshot.png
│   └── Copia-de-Napoleón-Brienne.jpg
├── postcss.config.mjs
├── next.config.ts
└── package.json
```

---

## Scripts

| Comando                 | Descripción                       |
| ----------------------- | --------------------------------- |
| `pnpm run dev`          | Servidor de desarrollo            |
| `pnpm run build`        | Build de producción               |
| `pnpm start`            | Servir build (tras `build`)       |
| `pnpm run lint`         | ESLint                            |
| `pnpm run lint:fix`     | ESLint con corrección automática  |
| `pnpm run format`       | Prettier (formatear)              |
| `pnpm run format:check` | Prettier (solo comprobar)         |
| `pnpm run react:doctor` | Diagnóstico React (opcional, desarrollo) |

---

> **Autor:** Fravelz
>
> **Licencia:** Apache 2.0
