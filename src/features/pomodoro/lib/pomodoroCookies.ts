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
const MAX_STORED_DAYS = 30;
const CHART_DAYS = 7;

export const POMODORO_STATS_UPDATED_EVENT = "pomodoro-stats-updated";

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

function todayKey(date = new Date()) {
  return date.toISOString().slice(0, 10);
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

export function getStatsStore(): StatsStore {
  return parseStats(readCookie(STATS_COOKIE));
}

export function recordPhaseComplete(phase: PomodoroPhase) {
  if (!hasStatsConsent()) return;

  const store = pruneStore(getStatsStore());
  const key = todayKey();
  const day = store[key] ?? emptyDay();
  day[phase] += 1;
  store[key] = day;

  writeCookie(STATS_COOKIE, JSON.stringify(store));
  notifyStatsUpdated();
}

export function getLast7DaysChartData(): PomodoroChartDay[] {
  const store = getStatsStore();
  const formatter = new Intl.DateTimeFormat("es", { weekday: "short" });

  return Array.from({ length: CHART_DAYS }, (_, index) => {
    const date = new Date();
    date.setDate(date.getDate() - (CHART_DAYS - 1 - index));
    const key = todayKey(date);
    const label = formatter.format(date).replace(".", "");
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
