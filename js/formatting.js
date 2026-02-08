/**
 * Formateo de números y textos para la interfaz (plurales, etiquetas, accesibilidad).
 */

function pluralize(count, singular, plural = singular + 's') {
  return count === 1 ? singular : plural;
}

/**
 * Devuelve el texto legible del tiempo restante según el nivel de detalle.
 * @param {ReturnType<getTimeRemaining>} data - Objeto devuelto por getTimeRemaining
 * @param {'full'} detailLevel - Nivel de detalle (por ahora solo 'full')
 * @returns {string} Texto para lectores de pantalla / resumen
 */
function getAccessibleSummary(data, detailLevel = 'full') {
  if (data.passed) return 'Fecha ya alcanzada.';
  const parts = [];
  if (data.years) parts.push(`${data.years} ${pluralize(data.years, 'año', 'años')}`);
  if (data.months) parts.push(`${data.months} ${pluralize(data.months, 'mes', 'meses')}`);
  if (data.days) parts.push(`${data.days} ${pluralize(data.days, 'día', 'días')}`);
  if (detailLevel === 'full') {
    if (data.hours) parts.push(`${data.hours} ${pluralize(data.hours, 'hora', 'horas')}`);
    if (data.minutes) parts.push(`${data.minutes} ${pluralize(data.minutes, 'minuto', 'minutos')}`);
    parts.push(`${data.seconds} ${pluralize(data.seconds, 'segundo', 'segundos')}`);
  }
  return parts.length ? parts.join(', ') : 'Menos de un segundo';
}

/**
 * Rellena con ceros a la izquierda (ej. 5 -> "05").
 * @param {number} n
 * @param {number} length
 * @returns {string}
 */
function pad(n, length = 2) {
  return String(n).padStart(length, '0');
}
