# Actualizar documentación (WEB-Time)

Usar cuando el usuario pida **actualizar la documentación**, **sincronizar README**, **revisar docs** o invoque este comando. El objetivo es que `README.md` y `README.EN.md` reflejen el **código real** del repositorio, en **español e inglés** con la misma estructura.

## Cuándo ejecutar

- El usuario invoca este comando o pide explícitamente actualizar documentación.
- Tras cambios grandes de arquitectura, rutas, features, tema, scripts o despliegue.
- **No** editar README ni otros docs si el usuario no lo pidió (salvo que este comando sea la petición).

## Fuentes de verdad (revisar siempre antes de escribir)

Explorar el repo; **no** confiar solo en el README existente (está desactualizado en varias rutas).

| Área | Dónde mirar |
|------|-------------|
| Rutas y páginas | `src/app/**/page.tsx`, `src/app/page.tsx`, `src/app/not-found.tsx` |
| Features | `src/features/{inicio,pomodoro,temporizador,hora}/` |
| Layout y shell | `src/app/layout.tsx`, `src/components/layout/` |
| UI compartida | `src/components/ui/` |
| Providers | `src/providers/` |
| Utilidades | `src/lib/` |
| Estilos y tema | `src/app/globals.css`, `src/lib/theme.ts`, `src/lib/theme.server.ts` |
| Init de tema | `public/theme-init.js`, cookie `web-time-theme` |
| Countdowns | `src/features/inicio/config/countdowns.ts` |
| Scripts npm | `package.json` |
| Tipos CSS | `src/types/css.d.ts` |
| Comandos Cursor | `.cursor/commands/`, `.cursor/update-docs.md` |

## Archivos de documentación a mantener

| Archivo | Idioma | Rol |
|---------|--------|-----|
| `README.md` | ES | Documentación principal |
| `README.EN.md` | EN | Misma estructura y secciones que el README en español |
| `.cursor/commands/auto-commit.md` | ES | Convenciones de commit (no duplicar en README salvo mención breve) |
| `.cursor/update-docs.md` | ES | Este comando |

No hay carpeta `docs/` hoy; no crear documentación nueva fuera de lo anterior **salvo** que el usuario lo pida.

## Descripción actual del producto (baseline)

**WEB-Time** — web personal desplegada en [GitHub Pages](https://fravelz.github.io/WEB-Time/).

**Stack:** Next.js 15 (App Router), React 18, TypeScript, Tailwind CSS v4, pnpm.

**Secciones:**

- **Inicio** (`/inicio`) — Imagen destacada, countdowns en acordeón (fechas a medianoche Colombia). Config en `src/features/inicio/config/countdowns.ts`.
- **Pomodoro** (`/pomodoro`) — 25 / 5 / 15 min, cada 4 ciclos descanso largo. Contexto en `src/features/pomodoro/`.
- **Temporizador** (`/temporizador`) — Varios temporizadores + cronómetro; sigue en segundo plano al cambiar de página.
- **Hora** (`/hora`) — Relojes por zona (Colombia, EE. UU., Rusia, China, Japón, Reino Unido, Europa, Brasil).

**Transversal:**

- Tema claro/oscuro (`ThemeToggle`, `ThemeProvider`, cookie `web-time-theme` + `theme-init.js`).
- Header con badges si hay timer/pomodoro activos (`SiteHeader`).
- 404 personalizada (`src/components/pages/not-found/`).
- Accesibilidad: foco visible en navegación, acordeón de countdowns, etc.

## Estructura del proyecto (referencia actualizada)

Usar esta forma en README (adaptar árbol si cambia el código):

```
├── src/
│   ├── app/                    # Rutas App Router (wrappers finos)
│   │   ├── layout.tsx          # Layout global, metadata, tema SSR
│   │   ├── globals.css         # Tailwind v4 + variables de tema
│   │   ├── page.tsx            # Redirección a /inicio
│   │   ├── not-found.tsx
│   │   └── {inicio,pomodoro,temporizador,hora}/page.tsx
│   ├── features/               # Lógica por sección
│   │   ├── inicio/             # Countdowns, config, acordeón
│   │   ├── pomodoro/
│   │   ├── temporizador/       # Context, reducer, hooks, TimerCard
│   │   └── hora/
│   ├── components/
│   │   ├── layout/             # SiteHeader, SiteFooter, FeaturePageShell
│   │   ├── ui/                 # ThemeToggle, iconos, enlaces
│   │   └── pages/not-found/
│   ├── providers/              # AppProviders, ThemeProvider
│   ├── lib/                    # theme, fonts, time, cn
│   └── types/                  # p. ej. css.d.ts
├── public/
│   ├── theme-init.js           # Tema antes de hidratar (sin flash)
│   ├── screenshot.png
│   └── Copia-de-Napoleón-Brienne.jpg
├── postcss.config.mjs
├── next.config.ts
└── package.json
```

**Rutas obsoletas en README antiguo — corregir si aparecen:**

- `src/config/countdowns.ts` → `src/features/inicio/config/countdowns.ts`
- Componentes de feature bajo `src/components/` → `src/features/<nombre>/components/`
- Solo “tema oscuro” → **tema claro y oscuro**

## Secciones obligatorias en README (ES y EN)

Mantener el mismo orden en ambos idiomas:

1. Título + enlace al otro idioma (`README.EN.md` / `README.md`)
2. Descripción breve + screenshot + stack
3. **Qué incluye** (lista de secciones)
4. **Inicio rápido** (Node 18+, pnpm, `pnpm install`, `pnpm run dev`, URL local)
5. **Rutas** (tabla `/`, `/inicio`, …)
6. **Estructura del proyecto** (árbol actualizado)
7. **Zona horaria (Colombia)** — `midnightColombia`, `America/Bogotá`
8. **Configuración** — `countdowns.ts`, `BIRTH_*`, countdowns fijos
9. **Tema claro/oscuro** (opcional pero recomendado) — cookie `web-time-theme` (sin `localStorage`), toggle en header, `theme-init.js`
10. **Scripts** — tabla con todos los de `package.json` relevantes para usuarios
11. **Producción** — `build` + `start`; nota breve si el despliegue es GitHub Pages (HTML estático vs servidor Node para cookies SSR)
12. **Autor**

## Scripts a documentar en la tabla

| Comando | Descripción (ES / EN) |
|---------|------------------------|
| `pnpm run dev` | Servidor de desarrollo |
| `pnpm run build` | Build de producción |
| `pnpm start` | Servir build |
| `pnpm run lint` / `lint:fix` | ESLint |
| `pnpm run format` / `format:check` | Prettier |
| `pnpm run clean` | Borrar `.next` |
| `pnpm run react:doctor` | Diagnóstico React (opcional, dev) |

## Reglas de redacción

- **Español** en `README.md`; **inglés** en `README.EN.md`; mismas secciones y tabla de rutas.
- Prosa clara; listas y tablas para rutas/scripts.
- Enlaces relativos entre READMEs: `[English version](./README.EN.md)` / `[Version en Español](./README.md)`.
- No inventar features que no existan en el código.
- No documentar secretos (`.env`, tokens).
- Si algo es “solo desarrollo” (p. ej. `react:doctor`), marcarlo como opcional.
- Tras cambios de tema o accesibilidad, mencionar brevemente si afecta al usuario (toggle, foco teclado).

## Proceso para el agente

1. **Inspeccionar** rutas, `package.json`, features y `layout.tsx` (no solo README).
2. **Comparar** README ES y EN con la estructura real; anotar divergencias.
3. **Actualizar** `README.md` primero.
4. **Espejar** los mismos cambios en `README.EN.md` (traducción fiel, no resumen distinto).
5. **No** modificar `.cursor/commands/auto-commit.md` salvo que el diff lo requiera explícitamente.
6. Si el usuario solo pidió “revisar”, devolver lista de desfases sin editar; si pidió “actualizar”, aplicar ediciones.

## Commits de documentación

Si el usuario pide commit tras actualizar docs, usar `.cursor/commands/auto-commit.md`:

- Tipo `docs`, scope `readme` o `setup` según el bloque.
- Formato lista si se tocan README ES, README EN y `.cursor/` a la vez.

Ejemplo:

```text
docs(readme): sync project structure and theme docs with codebase

docs(readme): mirror structure and scripts table in English README
```

## Resumen para el agente

- README actual **no refleja** `src/features/`, providers, tema dual ni scripts completos.
- Actualizar **siempre en par** ES + EN.
- El código manda; el README se adapta.
- Este archivo es la guía del comando; no sustituye a los README públicos.
