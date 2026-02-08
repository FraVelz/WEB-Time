import type { TimeRemaining } from "./countdown";

export function pluralize(count: number, singular: string, plural: string = singular + "s"): string {
  return count === 1 ? singular : plural;
}

export function pad(n: number, length: number = 2): string {
  return String(n).padStart(length, "0");
}

export function getAccessibleSummary(data: TimeRemaining, detailLevel: string = "full"): string {
  if (data.passed) return "Fecha ya alcanzada.";
  const parts: string[] = [];
  if (data.years) parts.push(`${data.years} ${pluralize(data.years, "año", "años")}`);
  if (data.months) parts.push(`${data.months} ${pluralize(data.months, "mes", "meses")}`);
  if (data.days) parts.push(`${data.days} ${pluralize(data.days, "día", "días")}`);
  if (detailLevel === "full") {
    if (data.hours) parts.push(`${data.hours} ${pluralize(data.hours, "hora", "horas")}`);
    if (data.minutes) parts.push(`${data.minutes} ${pluralize(data.minutes, "minuto", "minutos")}`);
    parts.push(`${data.seconds} ${pluralize(data.seconds, "segundo", "segundos")}`);
  }
  return parts.length ? parts.join(", ") : "Menos de un segundo";
}
