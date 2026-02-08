/**
 * Cálculo de tiempo restante hasta una fecha objetivo.
 * Devuelve años, meses, días, horas, minutos y segundos de forma coherente.
 */

/**
 * Calcula la diferencia entre dos fechas desglosada en años, meses, días, etc.
 * @param {Date} from - Fecha de referencia (normalmente "ahora")
 * @param {Date} to - Fecha objetivo
 * @returns {{ totalMs: number, passed: boolean, years: number, months: number, days: number, hours: number, minutes: number, seconds: number, totalDays: number }}
 */
function getTimeRemaining(from, to) {
  const totalMs = to.getTime() - from.getTime();
  const passed = totalMs <= 0;

  if (passed) {
    return {
      totalMs: 0,
      passed: true,
      years: 0,
      months: 0,
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      totalDays: 0,
    };
  }

  const seconds = Math.floor((totalMs / 1000) % 60);
  const minutes = Math.floor((totalMs / (1000 * 60)) % 60);
  const hours = Math.floor((totalMs / (1000 * 60 * 60)) % 24);
  const totalDays = Math.floor(totalMs / (1000 * 60 * 60 * 24));

  // Cálculo de años/meses/días "civil": desde from avanzando por meses/años
  let d = new Date(from.getTime());
  let years = 0;
  let months = 0;

  while (true) {
    const nextYear = new Date(d.getFullYear() + 1, d.getMonth(), d.getDate());
    if (nextYear > to) break;
    d = nextYear;
    years += 1;
  }
  while (true) {
    const nextMonth = new Date(d.getFullYear(), d.getMonth() + 1, d.getDate());
    if (nextMonth > to) break;
    d = nextMonth;
    months += 1;
  }
  let days = Math.floor((to.getTime() - d.getTime()) / (1000 * 60 * 60 * 24));

  return {
    totalMs,
    passed: false,
    years,
    months,
    days,
    hours,
    minutes,
    seconds,
    totalDays,
  };
}
