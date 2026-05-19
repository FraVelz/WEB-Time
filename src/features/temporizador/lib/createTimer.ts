import type { TimerItem } from "@/features/temporizador/types/timer";

export const ALARM_PATH = "/alarma.mp3";
export const DEFAULT_SECONDS = 5 * 60;

export function generateId(): string {
  return crypto.randomUUID?.() ?? `t-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function createTimer(overrides?: Partial<TimerItem> & { name?: string }): TimerItem {
  return {
    id: generateId(),
    name: overrides?.name ?? "Temporizador",
    secondsLeft: overrides?.secondsLeft ?? DEFAULT_SECONDS,
    totalSeconds: overrides?.totalSeconds ?? DEFAULT_SECONDS,
    endTime: null,
    isRunning: false,
    ...overrides,
  };
}
