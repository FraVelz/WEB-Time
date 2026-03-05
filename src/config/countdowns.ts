/**
 * Configuración de fechas objetivo para los countdowns.
 * Todas las fechas son medianoche en Colombia (America/Bogotá, UTC-5).
 * Modifica aquí tu fecha de nacimiento y las metas.
 */

/** Zona horaria: Colombia (UTC-5, sin horario de verano) */
const COLOMBIA_UTC_OFFSET_HOURS = 5;

/** 19 de mayo de 2008 — mayor de edad en 2026 */
const BIRTH_YEAR = 2008;
const BIRTH_MONTH = 5; // 1–12 (mayo)
const BIRTH_DAY = 19;

/**
 * Crea una fecha a medianoche en Colombia (America/Bogotá).
 * Evita que el servidor (p. ej. UTC) cambie "día siguiente" o "año nuevo".
 */
function midnightColombia(year: number, month: number, day: number): Date {
  // month 1–12 → Date.UTC usa mes 0–11
  return new Date(Date.UTC(year, month - 1, day, COLOMBIA_UTC_OFFSET_HOURS, 0, 0, 0));
}

export type CountdownItem = {
  id: string;
  title: string;
  description: string;
  targetDate: Date;
  detailLevel: "full";
};

function buildCountdowns(): CountdownItem[] {
  const countdowns: CountdownItem[] = [
    {
      id: "year-2027",
      title: "Año 2027",
      description: "Inicio del año 2027 (medianoche en Colombia)",
      targetDate: midnightColombia(2027, 1, 1),
      detailLevel: "full",
    },
    {
      id: "age-18",
      title: "Mayor de edad (18 años)",
      description: "Cumpleaños 18 — 19 de mayo",
      targetDate: midnightColombia(BIRTH_YEAR + 18, BIRTH_MONTH, BIRTH_DAY),
      detailLevel: "full",
    },
    {
      id: "age-20",
      title: "20 años",
      description: "Cumpleaños 20 — 19 de mayo",
      targetDate: midnightColombia(BIRTH_YEAR + 20, BIRTH_MONTH, BIRTH_DAY),
      detailLevel: "full",
    },
    {
      id: "age-25",
      title: "25 años",
      description: "Cumpleaños 25 — 19 de mayo",
      targetDate: midnightColombia(BIRTH_YEAR + 25, BIRTH_MONTH, BIRTH_DAY),
      detailLevel: "full",
    },
    {
      id: "age-30",
      title: "30 años",
      description: "Cumpleaños 30 — 19 de mayo",
      targetDate: midnightColombia(BIRTH_YEAR + 30, BIRTH_MONTH, BIRTH_DAY),
      detailLevel: "full",
    },
    {
      id: "year-2045",
      title: "Año 2045",
      description: "Inicio del año 2045 (medianoche en Colombia)",
      targetDate: midnightColombia(2045, 1, 1),
      detailLevel: "full",
    },
  ];
  return countdowns;
}

export const COUNTDOWN_CONFIG = buildCountdowns();
