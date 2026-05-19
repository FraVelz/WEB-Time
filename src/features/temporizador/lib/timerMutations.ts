import { DEFAULT_SECONDS } from "@/features/temporizador/lib/createTimer";
import type { TimerItem } from "@/features/temporizador/types/timer";

export function mapTimer(timers: TimerItem[], id: string, patch: (t: TimerItem) => TimerItem): TimerItem[] {
  return timers.map((t) => (t.id === id ? patch(t) : t));
}

export function withSeconds(t: TimerItem, seconds: number): TimerItem {
  const sec = Math.max(0, seconds);
  const running = t.isRunning && t.endTime != null;
  return {
    ...t,
    secondsLeft: sec,
    totalSeconds: sec,
    endTime: running ? Date.now() + sec * 1000 : null,
  };
}

export function resetTimerState(t: TimerItem): TimerItem {
  const total = t.totalSeconds || DEFAULT_SECONDS;
  return { ...t, secondsLeft: total, totalSeconds: total, isRunning: false, endTime: null };
}
