/**
 * Configuración de fechas objetivo para los countdowns.
 * Modifica aquí tu fecha de nacimiento y las metas.
 */

const BIRTH_DATE = new Date(2008, 4, 19); // 19 de mayo de 2008 — mayor de edad en 2026 (mes 0-indexed)

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
      description: "Inicio del año 2027",
      targetDate: new Date(2027, 0, 1, 0, 0, 0),
      detailLevel: "full",
    },
    {
      id: "age-18",
      title: "Mayor de edad (18 años)",
      description: "Cumpleaños 18 — 19 de mayo",
      targetDate: new Date(BIRTH_DATE.getFullYear() + 18, BIRTH_DATE.getMonth(), BIRTH_DATE.getDate(), 0, 0, 0),
      detailLevel: "full",
    },
    {
      id: "age-20",
      title: "20 años",
      description: "Cumpleaños 20 — 19 de mayo",
      targetDate: new Date(BIRTH_DATE.getFullYear() + 20, BIRTH_DATE.getMonth(), BIRTH_DATE.getDate(), 0, 0, 0),
      detailLevel: "full",
    },
    {
      id: "age-25",
      title: "25 años",
      description: "Cumpleaños 25 — 19 de mayo",
      targetDate: new Date(BIRTH_DATE.getFullYear() + 25, BIRTH_DATE.getMonth(), BIRTH_DATE.getDate(), 0, 0, 0),
      detailLevel: "full",
    },
    {
      id: "age-30",
      title: "30 años",
      description: "Cumpleaños 30 — 19 de mayo",
      targetDate: new Date(BIRTH_DATE.getFullYear() + 30, BIRTH_DATE.getMonth(), BIRTH_DATE.getDate(), 0, 0, 0),
      detailLevel: "full",
    },
    {
      id: "year-2045",
      title: "Año 2045",
      description: "Inicio del año 2045",
      targetDate: new Date(2045, 0, 1, 0, 0, 0),
      detailLevel: "full",
    },
  ];
  return countdowns;
}

export const COUNTDOWN_CONFIG = buildCountdowns();
