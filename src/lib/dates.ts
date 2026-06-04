import { TZDate } from "@date-fns/tz";
import { format, parseISO, subDays } from "date-fns";
import { es } from "date-fns/locale";

export const COLOMBIA_TIME_ZONE = "America/Bogota";

export const dateFnsEs = es;

/** Medianoche en Colombia (America/Bogotá). */
export function midnightInTimeZone(
  year: number,
  month: number,
  day: number,
  timeZone = COLOMBIA_TIME_ZONE,
): Date {
  return new TZDate(year, month - 1, day, 0, 0, 0, 0, timeZone);
}

export function toDate(value: Date | string): Date {
  return typeof value === "string" ? parseISO(value) : value;
}

/** YYYY-MM-DD según el calendario de la zona horaria indicada. */
export function dayKeyInTimeZone(date: Date, timeZone: string): string {
  return format(new TZDate(date, timeZone), "yyyy-MM-dd");
}

/** Resta días al calendario representado por una clave YYYY-MM-DD. */
export function dateKeyDaysBefore(dateKey: string, days: number): string {
  return format(subDays(parseISO(dateKey), days), "yyyy-MM-dd");
}

/** Etiqueta corta del día de la semana para una clave de fecha en la zona dada. */
export function weekdayLabelForDateKey(dateKey: string, timeZone: string): string {
  const [y, m, d] = dateKey.split("-").map(Number);
  const instant = new TZDate(y, m - 1, d, 12, 0, 0, 0, timeZone);
  return format(instant, "EEE", { locale: es }).replace(".", "");
}

/** Ej: "Será en 2040, el 19 de mayo, a las 00:00" */
export function formatTargetDateTime(
  date: Date | string,
  past = false,
  timeZone = COLOMBIA_TIME_ZONE,
): string {
  const zoned = new TZDate(toDate(date), timeZone);
  const year = format(zoned, "yyyy", { locale: es });
  const dayMonth = format(zoned, "d 'de' MMMM", { locale: es });
  const time = format(zoned, "HH:mm", { locale: es });
  const prefix = past ? "Fue" : "Será";
  return `${prefix} en ${year}, el ${dayMonth}, a las ${time}`;
}

/** Hora en una zona IANA (HH:mm:ss, 24 h). */
export function formatTimeInZone(zone: string, date = new Date()): string {
  return format(new TZDate(date, zone), "HH:mm:ss", { locale: es });
}
