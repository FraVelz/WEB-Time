/**
 * Cálculo de tiempo restante hasta una fecha objetivo.
 */

export type TimeRemaining = {
  totalMs: number;
  passed: boolean;
  years: number;
  months: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalDays: number;
};

export function getTimeRemaining(from: Date, to: Date): TimeRemaining {
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
  const days = Math.floor((to.getTime() - d.getTime()) / (1000 * 60 * 60 * 24));
  const totalDays = Math.floor(totalMs / (1000 * 60 * 60 * 24));

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
