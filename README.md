# WEB-Time

[English version](./README.EN.md)

**Web personal con countdowns hacia fechas importantes, temporizador Pomodoro, temporizadores personalizados y hora mundial.**

[![Screenshot](public/screenshot.png)](https://fravelz.github.io/WEB-Time/)

Hecho con **Next.js 15** (App Router), **React 18**, **TypeScript** y **Tailwind CSS v4**.

---

## Qué incluye

- **Inicio** — Imagen destacada, countdowns en acordeón (2027, mayoría de edad, 20/25/30 años, 2045). Fechas a medianoche en Colombia.
- **Pomodoro** — 25 min trabajo, 5 min descanso corto, 15 min descanso largo (cada 4 pomodoros). Iniciar, pausar, reiniciar.
- **Temporizador** — Varios temporizadores con horas y minutos editables. Añadir, iniciar, pausar, reiniciar o quitar cada uno.
- **Hora** — Relojes en tiempo real para Colombia, EE. UU., Rusia, China, Japón, Reino Unido, Europa y Brasil.

Diseño responsive, tema oscuro y página 404 personalizada.

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

| Ruta            | Contenido        |
|-----------------|------------------|
| `/`             | Redirige a Inicio |
| `/inicio`       | Countdowns + imagen |
| `/pomodoro`     | Reloj Pomodoro   |
| `/temporizador` | Temporizadores múltiples |
| `/hora`         | Hora mundial     |

---

## Estructura del proyecto

```
├── src/
│   ├── app/
│   │   ├── layout.tsx         # Layout global (header + footer)
│   │   ├── page.tsx           # Redirección a /inicio
│   │   ├── not-found.tsx      # Página 404
│   │   ├── globals.css        # Tailwind + variables del tema
│   │   ├── inicio/page.tsx    # Página Inicio
│   │   ├── pomodoro/page.tsx  # Página Pomodoro
│   │   ├── temporizador/page.tsx
│   │   └── hora/page.tsx
│   ├── components/
│   │   ├── SiteHeader.tsx     # Navegación (enlaces a rutas)
│   │   ├── InicioSection.tsx  # Imagen + countdowns
│   │   ├── CountdownGrid.tsx  # Acordeón de countdowns
│   │   ├── CountdownCard.tsx
│   │   ├── Pomodoro.tsx
│   │   ├── TemporizadorSection.tsx
│   │   └── HoraSection.tsx
│   ├── config/
│   │   └── countdowns.ts      # Fechas y fecha de nacimiento
│   └── lib/
│       ├── countdown.ts       # Cálculo tiempo restante
│       └── formatting.ts     # Plurales y formateo
├── public/
│   ├── screenshot.png
│   └── Copia-de-Napoleón-Brienne.jpg
├── postcss.config.mjs         # PostCSS para Tailwind v4
└── package.json
```

---

## Zona horaria (Colombia)

Las fechas objetivo se definen a **medianoche en Colombia (America/Bogotá, UTC-5)** en `src/config/countdowns.ts` (función `midnightColombia`). La hora “ahora” es la del navegador.

---

## Configuración

En **`src/config/countdowns.ts`**:

- **Fecha de nacimiento:** `BIRTH_YEAR`, `BIRTH_MONTH`, `BIRTH_DAY` (por defecto 19 de mayo de 2008). Con ellos se calculan 18, 20, 25 y 30 años.
- **Countdowns fijos:** año 2027, año 2045. Puedes añadir o quitar entradas.
- **Zona:** `COLOMBIA_UTC_OFFSET_HOURS` (5) por si Colombia cambiara de UTC-5.

---

## Scripts

| Comando           | Descripción              |
|-------------------|--------------------------|
| `pnpm run dev`    | Servidor de desarrollo   |
| `pnpm run build`  | Build de producción      |
| `pnpm start`      | Servir build (tras build) |
| `pnpm run lint`   | Linter                   |

---

## Producción

```bash
pnpm run build
pnpm start
```

---

> **Autor:** Fravelz
