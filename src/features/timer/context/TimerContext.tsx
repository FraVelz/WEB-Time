"use client";

import { createContext, useCallback, useContext, useReducer, type ReactNode } from "react";
import { useTimerAlarm } from "@/features/timer/hooks/useTimerAlarm";
import { useTimerTick } from "@/features/timer/hooks/useTimerTick";
import { createTimer, DEFAULT_SECONDS } from "@/features/timer/lib/createTimer";
import { initialCrono, initialTimerState, timerReducer } from "@/features/timer/context/timerReducer";
import type { TimerMode } from "@/features/timer/types/timer";

type TimerContextValue = {
  mode: TimerMode;
  timers: typeof initialTimerState.timers;
  crono: typeof initialTimerState.crono;
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
  displayForHeader:
    | { type: "timer"; id: string; secondsLeft: number }
    | { type: "crono"; secondsElapsed: number }
    | null;
};

const TimerContext = createContext<TimerContextValue | null>(null);

export function TimerProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(timerReducer, initialTimerState);
  const { mode, timers, crono, soundEnabled, alarmPlaying, alarmTimerId } = state;

  const { playAlarm, requestWakeLock, releaseWakeLock, stopAlarmAudio, muteAlarmAudio } = useTimerAlarm(soundEnabled);

  const onTimerFinished = useCallback((id: string) => {
    dispatch({ type: "ALARM_STARTED", timerId: id });
  }, []);

  const { anyTimerRunning } = useTimerTick({
    timers,
    crono,
    dispatch,
    playAlarm,
    onTimerFinished,
    requestWakeLock,
    releaseWakeLock,
  });

  const cronoRunning = crono.isRunning;

  const stopAlarm = useCallback(() => {
    stopAlarmAudio();
    dispatch({ type: "STOP_ALARM" });
  }, [stopAlarmAudio]);

  const setMode = useCallback(
    (newMode: TimerMode) => {
      if (anyTimerRunning || cronoRunning) return;
      dispatch({ type: "SET_MODE", mode: newMode });
    },
    [anyTimerRunning, cronoRunning],
  );

  const addTimer = useCallback(
    (name?: string, initialSeconds?: number) => {
      const count = timers.length + 1;
      dispatch({
        type: "SET_TIMERS",
        timers: (prev) => [
          ...prev,
          createTimer({
            name: name?.trim() || `Temporizador ${count}`,
            secondsLeft: initialSeconds ?? DEFAULT_SECONDS,
            totalSeconds: initialSeconds ?? DEFAULT_SECONDS,
          }),
        ],
      });
    },
    [timers.length],
  );

  const removeTimer = useCallback(
    (id: string) => {
      dispatch({
        type: "SET_TIMERS",
        timers: (prev) => prev.filter((t) => t.id !== id),
      });
      if (alarmTimerId === id) stopAlarm();
    },
    [alarmTimerId, stopAlarm],
  );

  const updateTimerName = useCallback((id: string, newName: string) => {
    dispatch({
      type: "SET_TIMERS",
      timers: (prev) => prev.map((t) => (t.id === id ? { ...t, name: newName.trim() || t.name } : t)),
    });
  }, []);

  const setTimerSeconds = useCallback((id: string, seconds: number) => {
    const sec = Math.max(0, seconds);
    dispatch({
      type: "SET_TIMERS",
      timers: (prev) =>
        prev.map((t) => {
          if (t.id !== id) return t;
          const isRunning = t.isRunning && t.endTime != null;
          return {
            ...t,
            secondsLeft: sec,
            totalSeconds: sec,
            endTime: isRunning ? Date.now() + sec * 1000 : null,
          };
        }),
    });
  }, []);

  const addTimerTime = useCallback((id: string, delta: number) => {
    dispatch({
      type: "SET_TIMERS",
      timers: (prev) =>
        prev.map((t) => {
          if (t.id !== id) return t;
          const newTotal = Math.max(0, t.secondsLeft + delta);
          const isRunning = t.isRunning && t.endTime != null;
          return {
            ...t,
            secondsLeft: newTotal,
            totalSeconds: newTotal,
            endTime: isRunning ? Date.now() + newTotal * 1000 : null,
          };
        }),
    });
  }, []);

  const toggleTimer = useCallback(
    (id: string) => {
      if (alarmTimerId === id) {
        stopAlarm();
        return;
      }
      dispatch({
        type: "SET_TIMERS",
        timers: (prev) =>
          prev.map((t) => {
            if (t.id !== id) return t;
            if (t.isRunning) {
              return { ...t, isRunning: false, endTime: null };
            }
            if (t.secondsLeft <= 0) return t;
            return {
              ...t,
              isRunning: true,
              endTime: Date.now() + t.secondsLeft * 1000,
            };
          }),
      });
    },
    [alarmTimerId, stopAlarm],
  );

  const resetTimer = useCallback(
    (id: string) => {
      if (alarmTimerId === id) stopAlarm();
      dispatch({
        type: "SET_TIMERS",
        timers: (prev) =>
          prev.map((t) => {
            if (t.id !== id) return t;
            const total = t.totalSeconds || DEFAULT_SECONDS;
            return {
              ...t,
              secondsLeft: total,
              totalSeconds: total,
              isRunning: false,
              endTime: null,
            };
          }),
      });
    },
    [alarmTimerId, stopAlarm],
  );

  const toggleSound = useCallback(() => {
    if (soundEnabled) muteAlarmAudio();
    dispatch({ type: "TOGGLE_SOUND" });
  }, [muteAlarmAudio, soundEnabled]);

  const resetCronometro = useCallback(() => {
    dispatch({ type: "SET_CRONO", crono: initialCrono });
  }, []);

  const toggleCronometro = useCallback(() => {
    dispatch({
      type: "SET_CRONO",
      crono: (c) => {
        if (c.isRunning) {
          const elapsed = Math.floor((Date.now() - (c.cronoStartTime ?? Date.now())) / 1000);
          return {
            ...c,
            isRunning: false,
            cronoStartTime: null,
            secondsElapsed: elapsed,
          };
        }
        return {
          ...c,
          isRunning: true,
          cronoStartTime: Date.now() - c.secondsElapsed * 1000,
        };
      },
    });
  }, []);

  const firstRunningTimer = timers.find((t) => t.isRunning && t.endTime != null);
  const displayForHeader =
    firstRunningTimer != null
      ? {
          type: "timer" as const,
          id: firstRunningTimer.id,
          secondsLeft: firstRunningTimer.secondsLeft,
        }
      : crono.isRunning
        ? { type: "crono" as const, secondsElapsed: crono.secondsElapsed }
        : null;

  const value: TimerContextValue = {
    mode,
    timers,
    crono,
    soundEnabled,
    alarmPlaying,
    alarmTimerId,
    setMode,
    addTimer,
    removeTimer,
    updateTimerName,
    setTimerSeconds,
    addTimerTime,
    toggleTimer,
    resetTimer,
    toggleSound,
    stopAlarm,
    resetCronometro,
    toggleCronometro,
    isRunning: anyTimerRunning || cronoRunning,
    displayForHeader,
  };

  return <TimerContext.Provider value={value}>{children}</TimerContext.Provider>;
}

export function useTimer() {
  const ctx = useContext(TimerContext);
  if (!ctx) throw new Error("useTimer must be used within TimerProvider");
  return ctx;
}
