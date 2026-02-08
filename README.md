# Countdowns y Pomodoro

Web personal con **countdowns** hacia fechas importantes (año 2027, mayoría de edad, 20/25/30 años, año 2045) y un **temporizador Pomodoro** (25 min trabajo, 5 min descanso corto, 15 min descanso largo).

Hecho con **Next.js 15**, **React 18** y **TypeScript**.

---

## Inicio rápido

**Requisitos:** Node.js 18+

```bash
# Clonar e instalar
git clone <repo>
cd WEB-Time
npm install

# Modo desarrollo
npm run dev
```

Abre **http://localhost:3000** en el navegador.

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

## Configuración

Todo se controla desde **`config/countdowns.ts`**:

- **Fecha de nacimiento:** variable `BIRTH_DATE` (por defecto 19 de mayo de 2008). A partir de ella se calculan los countdowns de 18, 20, 25 y 30 años.
- **Countdowns fijos:** año 2027, año 2045 (puedes añadir o quitar entradas en el array).
- Los countdowns de edad se generan automáticamente según `BIRTH_DATE`.

---

## Scripts

| Comando        | Descripción                    |
|----------------|--------------------------------|
| `npm run dev`  | Servidor de desarrollo         |
| `npm run build`| Build de producción            |
| `npm start`    | Servir build (tras `npm run build`) |
| `npm run lint` | Ejecutar el linter             |

---

## Producción

```bash
npm run build
npm start
```

Se sirve en el puerto 3000 por defecto.
