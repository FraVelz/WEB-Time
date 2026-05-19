"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { useTimerAlarm } from "@/features/temporizador/hooks/useTimerAlarm";
import {
  LONG_BREAK_SEC,
  POMODOROS_FOR_LONG,
  SHORT_BREAK_SEC,
  WORK_SEC,
} from "@/features/pomodoro/lib/constants";

type Phase = "work" | "shortBreak" | "longBreak";

type PomodoroState = {
  phase: Phase;
  secondsLeft: number;
  totalSeconds: number;
  endTime: number | null;
  isRunning: boolean;
  pomodoroCount: number;
  soundEnabled: boolean;
  alarmPlaying: boolean;
};

type PomodoroContextValue = PomodoroState & {
  toggleTimer: () => void;
  toggleSound: () => void;
  stopAlarm: () => void;
  resetPomodoro: () => void;
};

const PHASE_DURATIONS: Record<Phase, number> = {
  work: WORK_SEC,
  shortBreak: SHORT_BREAK_SEC,
  longBreak: LONG_BREAK_SEC,
};

const initialState: PomodoroState = {
  phase: "work",
  secondsLeft: WORK_SEC,
  totalSeconds: WORK_SEC,
  endTime: null,
  isRunning: false,
  pomodoroCount: 0,
  soundEnabled: true,
  alarmPlaying: false,
};

const PomodoroContext = createContext<PomodoroContextValue | null>(null);

export function PomodoroProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<PomodoroState>(initialState);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const { playAlarm, requestWakeLock, releaseWakeLock, stopAlarmAudio, muteAlarmAudio } = useTimerAlarm(
    state.soundEnabled,
  );

  const stopAlarm = useCallback(() => {
    stopAlarmAudio();
    setState((s) => ({ ...s, alarmPlaying: false }));
  }, [stopAlarmAudio]);

  const tick = useCallback(() => {
    setState((s) => {
      if (!s.endTime) return s;
      const remaining = Math.max(0, Math.ceil((s.endTime - Date.now()) / 1000));
      if (remaining > 0) return { ...s, secondsLeft: remaining };

      playAlarm();
      if (s.phase === "work") {
        const nextPhase: Phase = s.pomodoroCount + 1 >= POMODOROS_FOR_LONG ? "longBreak" : "shortBreak";
        const newCount = nextPhase === "longBreak" ? 0 : s.pomodoroCount + 1;
        const duration = PHASE_DURATIONS[nextPhase];
        return {
          ...s,
          phase: nextPhase,
          pomodoroCount: newCount,
          secondsLeft: duration,
          totalSeconds: duration,
          isRunning: false,
          endTime: null,
          alarmPlaying: s.soundEnabled,
        };
      }
      return {
        ...s,
        phase: "work",
        secondsLeft: WORK_SEC,
        totalSeconds: WORK_SEC,
        isRunning: false,
        endTime: null,
        alarmPlaying: s.soundEnabled,
      };
    });
  }, [playAlarm]);

  const { isRunning, endTime } = state;

  useEffect(() => {
    if (!isRunning || !endTime) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      intervalRef.current = null;
      releaseWakeLock();
      return;
    }
    requestWakeLock();
    tick();
    intervalRef.current = setInterval(tick, 200);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      intervalRef.current = null;
    };
  }, [isRunning, endTime, tick, requestWakeLock, releaseWakeLock]);

  useEffect(() => {
    const onVisibility = () => {
      if (document.visibilityState === "visible" && isRunning) requestWakeLock();
      else if (document.visibilityState === "hidden") releaseWakeLock();
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, [isRunning, requestWakeLock, releaseWakeLock]);

  useEffect(() => {
    const onUnload = () => {
      stopAlarmAudio();
      releaseWakeLock();
    };
    window.addEventListener("beforeunload", onUnload);
    return () => window.removeEventListener("beforeunload", onUnload);
  }, [stopAlarmAudio, releaseWakeLock]);

  const toggleTimer = useCallback(() => {
    setState((s) => {
      if (s.alarmPlaying) return s;
      if (s.isRunning) return { ...s, isRunning: false, endTime: null };
      if (s.secondsLeft <= 0) return s;
      return { ...s, isRunning: true, endTime: Date.now() + s.secondsLeft * 1000 };
    });
  }, []);

  const toggleSound = useCallback(() => {
    setState((s) => {
      const nextEnabled = !s.soundEnabled;
      if (!nextEnabled) muteAlarmAudio();
      return { ...s, soundEnabled: nextEnabled, alarmPlaying: nextEnabled ? s.alarmPlaying : false };
    });
  }, [muteAlarmAudio]);

  const resetPomodoro = useCallback(() => {
    stopAlarmAudio();
    setState({ ...initialState, soundEnabled: state.soundEnabled });
  }, [stopAlarmAudio, state.soundEnabled]);

  return (
    <PomodoroContext.Provider value={{ ...state, toggleTimer, toggleSound, stopAlarm, resetPomodoro }}>
      {children}
    </PomodoroContext.Provider>
  );
}

export function usePomodoro() {
  const ctx = useContext(PomodoroContext);
  if (!ctx) throw new Error("usePomodoro must be used within PomodoroProvider");
  return ctx;
}

export function usePomodoroOptional() {
  return useContext(PomodoroContext);
}
