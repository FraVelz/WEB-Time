import {
  dateKeyDaysBefore,
  dayKeyInTimeZone,
  getBrowserTimeZone,
  isValidTimeZone,
  weekdayLabelForDateKey,
} from "@/features/pomodoro/lib/pomodoroTimezone";
import { resolveToCanonicalZone } from "@/features/pomodoro/lib/timezoneCatalog";

export type PomodoroPhase = "work" | "shortBreak" | "longBreak";

export type DayStats = {
  work: number;
  shortBreak: number;
  longBreak: number;
};

export type StatsStore = Record<string, DayStats>;

export type PomodoroChartDay = {
  date: string;
  label: string;
  pomodoros: number;
};

export type CookieConsent = "accepted" | "rejected";

const CONSENT_COOKIE = "pomodoro_cookie_consent";
const STATS_COOKIE = "pomodoro_stats";
const TIMEZONE_COOKIE = "pomodoro_timezone";
const MAX_STORED_DAYS = 30;
const CHART_DAYS = 7;

export const POMODORO_STATS_UPDATED_EVENT = "pomodoro-stats-updated";
export const POMODORO_TIMEZONE_UPDATED_EVENT = "pomodoro-timezone-updated";

const emptyDay = (): DayStats => ({ work: 0, shortBreak: 0, longBreak: 0 });

function isBrowser() {
  return typeof document !== "undefined";
}

function readCookie(name: string): string | null {
  if (!isBrowser()) return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

function writeCookie(name: string, value: string, maxAgeDays = 365) {
  if (!isBrowser()) return;
  const maxAge = maxAgeDays * 24 * 60 * 60;
  document.cookie = `${name}=${encodeURIComponent(value)};path=/;max-age=${maxAge};SameSite=Lax`;
}

function deleteCookie(name: string) {
  if (!isBrowser()) return;
  document.cookie = `${name}=;path=/;max-age=0`;
}

function notifyTimezoneUpdated() {
  if (!isBrowser()) return;
  window.dispatchEvent(new Event(POMODORO_TIMEZONE_UPDATED_EVENT));
}

function parseStats(raw: string | null): StatsStore {
  if (!raw) return {};
  try {
    const parsed = JSON.parse(raw) as StatsStore;
    if (!parsed || typeof parsed !== "object") return {};
    return parsed;
  } catch {
    return {};
  }
}

function pruneStore(store: StatsStore): StatsStore {
  const keys = Object.keys(store).sort();
  if (keys.length <= MAX_STORED_DAYS) return store;
  return Object.fromEntries(keys.slice(-MAX_STORED_DAYS).map((key) => [key, store[key]]));
}

function notifyStatsUpdated() {
  if (!isBrowser()) return;
  window.dispatchEvent(new Event(POMODORO_STATS_UPDATED_EVENT));
}

export function getCookieConsent(): CookieConsent | null {
  const value = readCookie(CONSENT_COOKIE);
  if (value === "accepted" || value === "rejected") return value;
  return null;
}

export function setCookieConsent(consent: CookieConsent) {
  writeCookie(CONSENT_COOKIE, consent);
  if (consent === "rejected") {
    deleteCookie(STATS_COOKIE);
  }
  notifyStatsUpdated();
}

export function hasStatsConsent() {
  return getCookieConsent() === "accepted";
}

export function getTimeZone(): string {
  const stored = readCookie(TIMEZONE_COOKIE);
  if (stored && isValidTimeZone(stored)) return resolveToCanonicalZone(stored);
  return resolveToCanonicalZone(getBrowserTimeZone());
}

/** Guarda la zona en cookie y notifica a la UI para refrescar la gráfica. */
export function setTimeZone(timeZone: string) {
  if (!isValidTimeZone(timeZone)) return;
  writeCookie(TIMEZONE_COOKIE, resolveToCanonicalZone(timeZone));
  notifyTimezoneUpdated();
  notifyStatsUpdated();
}

/** Persiste el GMT del navegador si aún no hay cookie. */
export function ensureTimeZoneCookie() {
  if (!readCookie(TIMEZONE_COOKIE)) {
    writeCookie(TIMEZONE_COOKIE, resolveToCanonicalZone(getBrowserTimeZone()));
  }
}

export function getStatsStore(): StatsStore {
  return parseStats(readCookie(STATS_COOKIE));
}

export function recordPhaseComplete(phase: PomodoroPhase) {
  if (!hasStatsConsent()) return;

  const store = pruneStore(getStatsStore());
  const key = dayKeyInTimeZone(new Date(), getTimeZone());
  const day = store[key] ?? emptyDay();
  day[phase] += 1;
  store[key] = day;

  writeCookie(STATS_COOKIE, JSON.stringify(store));
  notifyStatsUpdated();
}

export function getLast7DaysChartData(timeZone = getTimeZone()): PomodoroChartDay[] {
  const store = getStatsStore();
  const todayKey = dayKeyInTimeZone(new Date(), timeZone);

  return Array.from({ length: CHART_DAYS }, (_, index) => {
    const daysAgo = CHART_DAYS - 1 - index;
    const key = dateKeyDaysBefore(todayKey, daysAgo);
    const label = weekdayLabelForDateKey(key, timeZone);
    const pomodoros = store[key]?.work ?? 0;
    return { date: key, label, pomodoros };
  });
}

export function getWeekTotals() {
  const data = getLast7DaysChartData();
  const total = data.reduce((sum, day) => sum + day.pomodoros, 0);
  const peak = data.reduce(
    (best, day) => (day.pomodoros > best.pomodoros ? day : best),
    data[0] ?? { date: "", label: "—", pomodoros: 0 },
  );
  return { total, peak, data };
}
