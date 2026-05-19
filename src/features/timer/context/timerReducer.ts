import { createTimer, DEFAULT_SECONDS } from "@/features/timer/lib/createTimer";
import type { CronoState, TimerItem, TimerMode } from "@/features/timer/types/timer";

export const initialCrono: CronoState = {
  secondsElapsed: 0,
  cronoStartTime: null,
  isRunning: false,
};

export type TimerState = {
  mode: TimerMode;
  timers: TimerItem[];
  crono: CronoState;
  soundEnabled: boolean;
  alarmPlaying: boolean;
  alarmTimerId: string | null;
};

export const initialTimerState: TimerState = {
  mode: "temporizador",
  timers: [createTimer({ name: "Temporizador 1" })],
  crono: initialCrono,
  soundEnabled: true,
  alarmPlaying: false,
  alarmTimerId: null,
};

type TimerUpdater = TimerItem[] | ((prev: TimerItem[]) => TimerItem[]);
type CronoUpdater = CronoState | ((prev: CronoState) => CronoState);

export type TimerAction =
  | { type: "SET_MODE"; mode: TimerMode }
  | { type: "SET_TIMERS"; timers: TimerUpdater }
  | { type: "SET_CRONO"; crono: CronoUpdater }
  | { type: "TOGGLE_SOUND" }
  | { type: "ALARM_STARTED"; timerId: string }
  | { type: "STOP_ALARM" };

export function timerReducer(state: TimerState, action: TimerAction): TimerState {
  switch (action.type) {
    case "SET_MODE":
      return { ...state, mode: action.mode, crono: initialCrono };
    case "SET_TIMERS": {
      const timers = typeof action.timers === "function" ? action.timers(state.timers) : action.timers;
      return { ...state, timers };
    }
    case "SET_CRONO": {
      const crono = typeof action.crono === "function" ? action.crono(state.crono) : action.crono;
      return { ...state, crono };
    }
    case "TOGGLE_SOUND":
      return { ...state, soundEnabled: !state.soundEnabled };
    case "ALARM_STARTED":
      return {
        ...state,
        alarmPlaying: true,
        alarmTimerId: action.timerId,
      };
    case "STOP_ALARM":
      return { ...state, alarmPlaying: false, alarmTimerId: null };
    default:
      return state;
  }
}

export { DEFAULT_SECONDS };
