/**
 * Cálculo de tiempo restante hasta una fecha objetivo.
 */

import { differenceInCalendarDays, differenceInMilliseconds, intervalToDuration } from "date-fns";

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

const emptyRemaining: Omit<TimeRemaining, "totalMs" | "passed"> = {
  years: 0,
  months: 0,
  days: 0,
  hours: 0,
  minutes: 0,
  seconds: 0,
  totalDays: 0,
};

export function getTimeRemaining(from: Date, to: Date): TimeRemaining {
  const totalMs = differenceInMilliseconds(to, from);
  const passed = totalMs <= 0;

  if (passed) {
    return { totalMs: 0, passed: true, ...emptyRemaining };
  }

  const duration = intervalToDuration({ start: from, end: to });

  return {
    totalMs,
    passed: false,
    years: duration.years ?? 0,
    months: duration.months ?? 0,
    days: duration.days ?? 0,
    hours: duration.hours ?? 0,
    minutes: duration.minutes ?? 0,
    seconds: duration.seconds ?? 0,
    totalDays: differenceInCalendarDays(to, from),
  };
}
