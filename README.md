# Countdowns y Pomodoro

Proyecto Next.js con countdowns hacia fechas importantes y temporizador Pomodoro.

## Cómo ejecutar

```bash
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

## Estructura

- **`app/`** — Página principal y estilos globales
- **`components/`** — `CountdownCard`, `CountdownGrid`, `Pomodoro`
- **`config/countdowns.ts`** — Fechas objetivo y fecha de nacimiento (19 mayo 2009)
- **`lib/`** — Lógica de countdown y formateo

## Configuración de fechas

Edita `config/countdowns.ts` para cambiar la fecha de nacimiento o añadir/quitar countdowns (2027, 18/20/25/30 años, 2045).

## Build para producción

```bash
npm run build
npm start
```
