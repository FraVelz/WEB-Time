/**
 * Configuración central de fechas objetivo para los countdowns.
 * Modifica aquí tu fecha de nacimiento y las metas para mantener el proyecto.
 */
const CONFIG = {
  /** Fecha de nacimiento (año, mes 0-11, día) para calcular cumpleaños 18, 20, 25, 30 */
  birthDate: new Date(2009, 4, 19), // 19 de mayo de 2009

  /** Lista de countdowns: cada uno tiene id, título, fecha objetivo y tipo de detalle */
  countdowns: [
    {
      id: 'year-2027',
      title: 'Año 2027',
      description: 'Inicio del año 2027',
      targetDate: new Date(2027, 0, 1, 0, 0, 0), // 1 enero 2027
      detailLevel: 'full', // años, meses, días, horas, minutos, segundos
    },
    {
      id: 'age-18',
      title: 'Mayor de edad (18 años)',
      description: 'Cumpleaños 18 — 19 de mayo',
      targetDate: null, // se calcula en init desde birthDate
      detailLevel: 'full',
    },
    {
      id: 'age-20',
      title: '20 años',
      description: 'Cumpleaños 20 — 19 de mayo',
      targetDate: null,
      detailLevel: 'full',
    },
    {
      id: 'age-25',
      title: '25 años',
      description: 'Cumpleaños 25 — 19 de mayo',
      targetDate: null,
      detailLevel: 'full',
    },
    {
      id: 'age-30',
      title: '30 años',
      description: 'Cumpleaños 30 — 19 de mayo',
      targetDate: null,
      detailLevel: 'full',
    },
    {
      id: 'year-2045',
      title: 'Año 2045',
      description: 'Inicio del año 2045',
      targetDate: new Date(2045, 0, 1, 0, 0, 0),
      detailLevel: 'full',
    },
  ],
};

/**
 * Inicializa las fechas objetivo que dependen de la fecha de nacimiento.
 */
function initConfig() {
  const birth = CONFIG.birthDate;
  const ages = [18, 20, 25, 30];
  CONFIG.countdowns.forEach((c) => {
    if (c.id.startsWith('age-')) {
      const age = parseInt(c.id.replace('age-', ''), 10);
      c.targetDate = new Date(birth.getFullYear() + age, birth.getMonth(), birth.getDate(), 0, 0, 0);
    }
  });
}

initConfig();

export { CONFIG };
