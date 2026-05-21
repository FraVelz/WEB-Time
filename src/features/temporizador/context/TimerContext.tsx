"use client";

import { createContext, useCallback, useContext, useReducer, type ReactNode } from "react";
import { useTimerAlarm } from "@/features/temporizador/hooks/useTimerAlarm";
import { useTimerTick } from "@/features/temporizador/hooks/useTimerTick";
import { createTimer, DEFAULT_SECONDS } from "@/features/temporizador/lib/createTimer";
import { mapTimer, resetTimerState, withSeconds } from "@/features/temporizador/lib/timerMutations";
import { initialCrono, initialTimerState, timerReducer } from "@/features/temporizador/context/timerReducer";
import type { TimerContextValue, TimerItem, TimerMode } from "@/features/temporizador/types/timer";

const TimerContext = createContext<TimerContextValue | null>(null);

export function TimerProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(timerReducer, initialTimerState);
  const { mode, timers, crono, soundEnabled, alarmPlaying, alarmTimerId } = state;

  const { playAlarm, requestWakeLock, releaseWakeLock, stopAlarmAudio } = useTimerAlarm(soundEnabled);

  const setTimers = useCallback(
    (fn: (prev: TimerItem[]) => TimerItem[]) => dispatch({ type: "SET_TIMERS", timers: fn }),
    [],
  );

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

  const stopAlarm = useCallback(() => {
    stopAlarmAudio();
    dispatch({ type: "STOP_ALARM" });
  }, [stopAlarmAudio]);

  const setMode = useCallback(
    (newMode: TimerMode) => {
      if (anyTimerRunning || crono.isRunning) return;
      dispatch({ type: "SET_MODE", mode: newMode });
    },
    [anyTimerRunning, crono.isRunning],
  );

  const addTimer = useCallback(
    (name?: string, initialSeconds?: number) => {
      const count = timers.length + 1;
      const sec = initialSeconds ?? DEFAULT_SECONDS;
      setTimers((prev) => [
        ...prev,
        createTimer({ name: name?.trim() || `Temporizador ${count}`, secondsLeft: sec, totalSeconds: sec }),
      ]);
    },
    [timers.length, setTimers],
  );

  const removeTimer = useCallback(
    (id: string) => {
      setTimers((prev) => prev.filter((t) => t.id !== id));
      if (alarmTimerId === id) stopAlarm();
    },
    [alarmTimerId, stopAlarm, setTimers],
  );

  const updateTimerName = useCallback(
    (id: string, newName: string) => {
      setTimers((prev) => mapTimer(prev, id, (t) => ({ ...t, name: newName.trim() || t.name })));
    },
    [setTimers],
  );

  const setTimerSeconds = useCallback(
    (id: string, seconds: number) => {
      setTimers((prev) => mapTimer(prev, id, (t) => withSeconds(t, seconds)));
    },
    [setTimers],
  );

  const addTimerTime = useCallback(
    (id: string, delta: number) => {
      setTimers((prev) => mapTimer(prev, id, (t) => withSeconds(t, t.secondsLeft + delta)));
    },
    [setTimers],
  );

  const toggleTimer = useCallback(
    (id: string) => {
      if (alarmTimerId === id) {
        stopAlarm();
        return;
      }
      setTimers((prev) =>
        mapTimer(prev, id, (t) => {
          if (t.isRunning) return { ...t, isRunning: false, endTime: null };
          if (t.secondsLeft <= 0) return t;
          return { ...t, isRunning: true, endTime: Date.now() + t.secondsLeft * 1000 };
        }),
      );
    },
    [alarmTimerId, stopAlarm, setTimers],
  );

  const resetTimer = useCallback(
    (id: string) => {
      if (alarmTimerId === id) stopAlarm();
      setTimers((prev) => mapTimer(prev, id, resetTimerState));
    },
    [alarmTimerId, stopAlarm, setTimers],
  );

  const toggleSound = useCallback(() => {
    if (soundEnabled) stopAlarmAudio();
    dispatch({ type: "TOGGLE_SOUND" });
  }, [stopAlarmAudio, soundEnabled]);

  const resetCronometro = useCallback(() => {
    dispatch({ type: "SET_CRONO", crono: initialCrono });
  }, []);

  const toggleCronometro = useCallback(() => {
    dispatch({
      type: "SET_CRONO",
      crono: (c) => {
        if (c.isRunning) {
          const elapsed = Math.floor((Date.now() - (c.cronoStartTime ?? Date.now())) / 1000);
          return { ...c, isRunning: false, cronoStartTime: null, secondsElapsed: elapsed };
        }
        return { ...c, isRunning: true, cronoStartTime: Date.now() - c.secondsElapsed * 1000 };
      },
    });
  }, []);

  const running = timers.find((t) => t.isRunning && t.endTime != null);
  const alarmTimer = alarmPlaying && alarmTimerId ? timers.find((t) => t.id === alarmTimerId) : undefined;

  const displayForHeader = running
    ? { type: "timer" as const, id: running.id, secondsLeft: running.secondsLeft }
    : alarmTimer
      ? { type: "timer" as const, id: alarmTimer.id, secondsLeft: 0, alarm: true }
      : crono.isRunning
        ? { type: "crono" as const, secondsElapsed: crono.secondsElapsed }
        : null;

  return (
    <TimerContext.Provider
      value={{
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
        isRunning: anyTimerRunning || crono.isRunning,
        displayForHeader,
      }}
    >
      {children}
    </TimerContext.Provider>
  );
}

export function useTimer() {
  const ctx = useContext(TimerContext);
  if (!ctx) throw new Error("useTimer must be used within TimerProvider");
  return ctx;
}
