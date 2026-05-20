/**
 * Tipos para el módulo de temporizadores.
 * Un temporizador es cuenta regresiva (nombre + tiempo). El cronómetro es único y cuenta ascendente.
 */

export type TimerItem = {
  id: string;
  name: string;
  secondsLeft: number;
  totalSeconds: number;
  endTime: number | null;
  isRunning: boolean;
};

export type CronoState = {
  secondsElapsed: number;
  cronoStartTime: number | null;
  isRunning: boolean;
};

export type TimerMode = "temporizador" | "cronometro";

export type TimerHeaderDisplay =
  | { type: "timer"; id: string; secondsLeft: number; alarm?: boolean }
  | { type: "crono"; secondsElapsed: number }
  | null;

export type TimerContextValue = {
  mode: TimerMode;
  timers: TimerItem[];
  crono: CronoState;
  soundEnabled: boolean;
  alarmPlaying: boolean;
  alarmTimerId: string | null;
  setMode: (mode: TimerMode) => void;
  addTimer: (name?: string, initialSeconds?: number) => void;
  removeTimer: (id: string) => void;
  updateTimerName: (id: string, name: string) => void;
  setTimerSeconds: (id: string, seconds: number) => void;
  addTimerTime: (id: string, seconds: number) => void;
  toggleTimer: (id: string) => void;
  resetTimer: (id: string) => void;
  toggleSound: () => void;
  stopAlarm: () => void;
  resetCronometro: () => void;
  toggleCronometro: () => void;
  isRunning: boolean;
  displayForHeader: TimerHeaderDisplay;
};
