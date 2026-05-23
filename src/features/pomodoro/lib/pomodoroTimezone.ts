import ianaTimeZones from "@/features/pomodoro/lib/ianaTimeZones.json";

export function isValidTimeZone(timeZone: string): boolean {
  try {
    Intl.DateTimeFormat(undefined, { timeZone });
    return true;
  } catch {
    return false;
  }
}

export function getBrowserTimeZone(): string {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    return isValidTimeZone(tz) ? tz : "UTC";
  } catch {
    return "UTC";
  }
}

export function getSupportedTimeZones(): string[] {
  if (typeof Intl !== "undefined" && "supportedValuesOf" in Intl) {
    try {
      const live = Intl.supportedValuesOf("timeZone");
      if (live.length >= ianaTimeZones.length) return [...live].sort();
    } catch {
      /* lista estática */
    }
  }
  return [...ianaTimeZones].sort();
}

/** YYYY-MM-DD según el calendario de la zona horaria indicada. */
export function dayKeyInTimeZone(date: Date, timeZone: string): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

/** Resta días al calendario representado por una clave YYYY-MM-DD. */
export function dateKeyDaysBefore(dateKey: string, days: number): string {
  const [y, m, d] = dateKey.split("-").map(Number);
  const shifted = new Date(Date.UTC(y, m - 1, d - days));
  const yy = shifted.getUTCFullYear();
  const mm = String(shifted.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(shifted.getUTCDate()).padStart(2, "0");
  return `${yy}-${mm}-${dd}`;
}

/** Etiqueta corta del día de la semana para una clave de fecha en la zona dada. */
export function weekdayLabelForDateKey(dateKey: string, timeZone: string): string {
  const [y, m, d] = dateKey.split("-").map(Number);
  const instant = new Date(Date.UTC(y, m - 1, d, 12, 0, 0));
  return new Intl.DateTimeFormat("es", { weekday: "short", timeZone }).format(instant).replace(".", "");
}

export function formatGmtOffset(timeZone: string, date = new Date()): string {
  try {
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone,
      timeZoneName: "shortOffset",
    }).formatToParts(date);
    return parts.find((p) => p.type === "timeZoneName")?.value ?? "GMT";
  } catch {
    return "GMT";
  }
}
