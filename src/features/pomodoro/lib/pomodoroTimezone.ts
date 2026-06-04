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
