# Countdowns y Pomodoro

**Web personal con countdowns hacia fechas importantes personales y un temporizador Pomodoro.**

[![Screenshot](screenshot.png)](https://fravelz.github.io/WEB-Time/)

🔗 **Publicado en:** [https://fravelz.github.io/WEB-Time/](https://fravelz.github.io/WEB-Time/)

Countdowns hacia año 2027, mayoría de edad (18), 20, 25, 30 años, año 2045. Pomodoro: 25 min trabajo, 5 min descanso corto, 15 min descanso largo (cada 4 pomodoros). Hecho con **Next.js 15**, **React 18** y **TypeScript**.

---

## Qué incluye

- **Countdowns** que se actualizan cada segundo, con tiempo restante en años, meses, días, horas, minutos y segundos (los años se ocultan cuando quedan 0).

- **Pomodoro** con fases de trabajo, descanso corto y descanso largo (cada 4 pomodoros), con barra de progreso y botones Iniciar / Pausar / Reiniciar.
- Diseño responsive y tema oscuro.

---

## Estructura del proyecto

```
├── app/
│   ├── layout.tsx      # Layout y metadatos
│   ├── page.tsx        # Página principal
│   └── globals.css      # Variables y estilos globales
├── components/
│   ├── CountdownCard.tsx   # Tarjeta de un countdown
│   ├── CountdownGrid.tsx   # Grid que actualiza cada segundo
│   └── Pomodoro.tsx        # Temporizador Pomodoro
├── config/
│   └── countdowns.ts       # Fechas objetivo y fecha de nacimiento
└── lib/
    ├── countdown.ts        # Cálculo de tiempo restante
    └── formatting.ts       # Plurales y formateo
```

---

## Zona horaria (Colombia)

Las fechas objetivo están fijadas en **medianoche en Colombia (America/Bogotá, UTC-5)**. Así el “día siguiente” y el “año nuevo” coinciden con tu hora, sin depender de la zona del servidor.

- **Dónde se define:** `config/countdowns.ts` — la función `midnightColombia(year, month, day)` crea cada fecha a 00:00 en Colombia.
- **“Ahora”:** En el navegador se usa la hora local (`new Date()` en `CountdownGrid`), así que si estás en Colombia el countdown es correcto. Si cambias de zona, el tiempo restante sigue siendo “hasta esa medianoche en Colombia”.

---

## Configuración

Todo se controla desde **`config/countdowns.ts`**:

- **Fecha de nacimiento:** `BIRTH_YEAR`, `BIRTH_MONTH`, `BIRTH_DAY` (por defecto 19 de mayo de 2008). A partir de ellos se calculan los countdowns de 18, 20, 25 y 30 años.
- **Countdowns fijos:** año 2027, año 2045 (puedes añadir o quitar entradas en el array).
- **Zona horaria:** constante `COLOMBIA_UTC_OFFSET_HOURS` (5) por si en el futuro Colombia cambiara de UTC-5.

---

> **Autor:** Fravelz
