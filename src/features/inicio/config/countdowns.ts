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
      id: "responsabilidad",
      title: "Responsabilidad y labrado de la tierra",
      description:
        "Cual es la etapa donde una persona obtiene total responsabilidad legal? hubiera deseado tener buena tierra para no tener que labrarla.",
      targetDate: midnightColombia(BIRTH_YEAR + 18, BIRTH_MONTH, BIRTH_DAY),
      detailLevel: "full",
    },
    {
      id: "invisibilidad",
      title: "Invisibilidad y Sembrado en la tierra",
      description:
        "que necesita un futbolista para ser de los mejores? deseo ya tener una red compleja de raíces debajo de la tierra como neuronas en el cerebro.",
      targetDate: midnightColombia(BIRTH_YEAR + 20, BIRTH_MONTH, BIRTH_DAY),
      detailLevel: "full",
    },
    {
      id: "brote",
      title: "El brote de la tierra",
      description:
        "Al final que necesita un cantante para lograr el éxito? comienza a surgir el brote de la tierra y a crecer rápidamente.",
      targetDate: midnightColombia(BIRTH_YEAR + 25, BIRTH_MONTH, BIRTH_DAY),
      detailLevel: "full",
    },
    {
      id: "amor-odio",
      title: "Amor y odio, la planta en su apogeo",
      description:
        "Es posible que todos te quieran? la planta comienza a dar sombra, pero comienza a molestar a otras plantas con sus raices.",
      targetDate: midnightColombia(BIRTH_YEAR + 30, BIRTH_MONTH, BIRTH_DAY),
      detailLevel: "full",
    },
    {
      id: "eminencia",
      title: "Eminencia y poder de la tierra",
      description:
        "Cual es el problema de que alguien disfrute del fruto de su trabajo? los frutos comienzan a surgir y todo parece felicidad.",
      targetDate: midnightColombia(BIRTH_YEAR + 35, BIRTH_MONTH, BIRTH_DAY),
      detailLevel: "full",
    },
    {
      id: "nueva-era",
      title: "Duda? - Nueva era de la tierra",
      description:
        "hay cosas realmente necesarias o solo son interés personal? Inicio del año 2045 (medianoche en Colombia) - El árbol crece tanto que necesita mas espacio para crecer.",
      targetDate: midnightColombia(2045, 1, 1),
      detailLevel: "full",
    },
    {
      id: "ignorancia",
      title: "Ignorancia - El árbol le esta llegando su hora",
      description:
        "Como caen las potencias históricamente? las ramas han crecido tanto que comienza a caer solas (la historia se repite, pero los tiempos cambian)",
      targetDate: midnightColombia(BIRTH_YEAR + 40, BIRTH_MONTH, BIRTH_DAY),
      detailLevel: "full",
    },
    {
      id: "ambicion",
      title: "Ambición - el árbol deja semillas para el futuro",
      description:
        "Acaso he disfrutado de la vida?, no lo se, pero si que he llegado lejos - el árbol deja semillas para el futuro en cualquier momento llagara su hora",
      targetDate: midnightColombia(BIRTH_YEAR + 45, BIRTH_MONTH, BIRTH_DAY),
      detailLevel: "full",
    },
    {
      id: "tiempo",
      title: "Tiempo - fin del arbol",
      description:
        "Acaso he disfrutado de la vida?, no lo se, pero si que he llegado lejos - el árbol deja semillas para el futuro en cualquier momento llagara su hora",
      targetDate: midnightColombia(BIRTH_YEAR + 50, BIRTH_MONTH, BIRTH_DAY),
      detailLevel: "full",
    },
    {
      id: "nuevos-arboles",
      title: "esto es todo? - Nuevos arboles",
      description: "apenas empieza!!!, hay 4 nuevos arboles, en el campo ocupando el lugar del anterior.",
      targetDate: midnightColombia(BIRTH_YEAR + 55, BIRTH_MONTH, BIRTH_DAY),
      detailLevel: "full",
    },
    {
      id: "nueva-mision",
      title: "Nueva mision",
      description:
        "La ambision es mental, espero que sepas y recuerdes cual es el siguiente paso, siempre sera ayudar a los demás granjeros, a lograr lo que tu has aprendido lograr, nunca pierdas la humildad y aunque fueras el ejemplo para muchos, hay cosas que se pueden aprender de los demás.",
      targetDate: midnightColombia(BIRTH_YEAR + 60, BIRTH_MONTH, BIRTH_DAY),
      detailLevel: "full",
    },
  ];
  return countdowns;
}

export const COUNTDOWN_CONFIG = buildCountdowns();
