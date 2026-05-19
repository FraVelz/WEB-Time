"use client";

import { useCallback, useEffect, useRef } from "react";
import type { TimerAction } from "@/features/temporizador/context/timerReducer";
import type { CronoState, TimerItem } from "@/features/temporizador/types/timer";

type UseTimerTickOptions = {
  timers: TimerItem[];
  crono: CronoState;
  dispatch: React.Dispatch<TimerAction>;
  playAlarm: () => void;
  onTimerFinished: (id: string) => void;
  requestWakeLock: () => Promise<void>;
  releaseWakeLock: () => Promise<void>;
};

export function useTimerTick({
  timers,
  crono,
  dispatch,
  playAlarm,
  onTimerFinished,
  requestWakeLock,
  releaseWakeLock,
}: UseTimerTickOptions) {
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const tick = useCallback(() => {
    dispatch({
      type: "SET_TIMERS",
      timers: (prev) => {
        let anyFinished: string | null = null;
        const next = prev.map((t) => {
          if (!t.isRunning || t.endTime == null) return t;
          const now = Date.now();
          const remaining = Math.max(0, Math.ceil((t.endTime - now) / 1000));
          if (remaining <= 0) anyFinished = t.id;
          return { ...t, secondsLeft: remaining, isRunning: remaining > 0 };
        });
        if (anyFinished) {
          playAlarm();
          onTimerFinished(anyFinished);
          return next.map((t) => (t.id === anyFinished ? { ...t, isRunning: false, endTime: null } : t));
        }
        return next;
      },
    });

    dispatch({
      type: "SET_CRONO",
      crono: (c) => {
        if (!c.isRunning || c.cronoStartTime == null) return c;
        const elapsed = Math.floor((Date.now() - c.cronoStartTime) / 1000);
        return { ...c, secondsElapsed: elapsed };
      },
    });
  }, [dispatch, onTimerFinished, playAlarm]);

  const anyTimerRunning = timers.some((t) => t.isRunning);
  const shouldTick = anyTimerRunning || crono.isRunning;

  useEffect(() => {
    if (!shouldTick) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      releaseWakeLock();
      return;
    }
    requestWakeLock();
    tick();
    intervalRef.current = setInterval(tick, 200);
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [shouldTick, tick, requestWakeLock, releaseWakeLock]);

  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState === "visible" && shouldTick) {
        requestWakeLock();
      } else if (document.visibilityState === "hidden") {
        releaseWakeLock();
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, [shouldTick, requestWakeLock, releaseWakeLock]);

  return { anyTimerRunning, shouldTick };
}
