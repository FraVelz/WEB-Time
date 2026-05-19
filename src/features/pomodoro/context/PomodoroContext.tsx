"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";

const ALARM_PATH = "/alarma.mp3";
const WORK_SEC = 25 * 60;
const SHORT_BREAK_SEC = 5 * 60;
const LONG_BREAK_SEC = 15 * 60;
const POMODOROS_FOR_LONG = 4;

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

const PomodoroContext = createContext<PomodoroContextValue | null>(null);

export function PomodoroProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<PomodoroState>({
    phase: "work",
    secondsLeft: WORK_SEC,
    totalSeconds: WORK_SEC,
    endTime: null,
    isRunning: false,
    pomodoroCount: 0,
    soundEnabled: true,
    alarmPlaying: false,
  });

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const wakeLockRef = useRef<{ release: () => Promise<void> } | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const requestWakeLock = useCallback(async () => {
    if (typeof navigator !== "undefined" && "wakeLock" in navigator) {
      try {
        const wakeLock = await navigator.wakeLock.request("screen");
        wakeLockRef.current = wakeLock;
      } catch {
        /* ignore */
      }
    }
  }, []);

  const releaseWakeLock = useCallback(async () => {
    if (wakeLockRef.current) {
      try {
        await wakeLockRef.current.release();
      } catch {
        /* ignore */
      }
      wakeLockRef.current = null;
    }
  }, []);

  const playAlarm = useCallback(() => {
    if (!state.soundEnabled) return;
    try {
      const audio = new Audio(ALARM_PATH);
      audio.volume = 1;
      audio.loop = true;
      audio.play().catch(() => {});
      audioRef.current = audio;
    } catch {
      /* ignore */
    }
  }, [state.soundEnabled]);

  const stopAlarm = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
    setState((s) => ({ ...s, alarmPlaying: false }));
  }, []);

  const tick = useCallback(() => {
    setState((s) => {
      if (!s.endTime) return s;
      const now = Date.now();
      const remaining = Math.max(0, Math.ceil((s.endTime - now) / 1000));
      if (remaining <= 0) {
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
          secondsLeft: PHASE_DURATIONS.work,
          totalSeconds: PHASE_DURATIONS.work,
          isRunning: false,
          endTime: null,
          alarmPlaying: s.soundEnabled,
        };
      }
      return { ...s, secondsLeft: remaining };
    });
  }, [playAlarm]);

  const { isRunning, endTime } = state;

  useEffect(() => {
    if (!isRunning || !endTime) {
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
  }, [isRunning, endTime, tick, requestWakeLock, releaseWakeLock]);

  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState === "visible" && isRunning) {
        requestWakeLock();
      } else if (document.visibilityState === "hidden") {
        releaseWakeLock();
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, [isRunning, requestWakeLock, releaseWakeLock]);

  useEffect(() => {
    const handleBeforeUnload = () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      releaseWakeLock();
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [releaseWakeLock]);

  const toggleTimer = useCallback(() => {
    setState((s) => {
      if (s.alarmPlaying) return s;
      if (s.isRunning) {
        return { ...s, isRunning: false, endTime: null };
      }
      if (s.secondsLeft <= 0) return s;
      return {
        ...s,
        isRunning: true,
        endTime: Date.now() + s.secondsLeft * 1000,
      };
    });
  }, []);

  const toggleSound = useCallback(() => {
    setState((s) => {
      const nextEnabled = !s.soundEnabled;
      if (!nextEnabled && audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        audioRef.current = null;
      }
      return {
        ...s,
        soundEnabled: nextEnabled,
        alarmPlaying: nextEnabled ? s.alarmPlaying : false,
      };
    });
  }, []);

  const resetPomodoro = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
    setState((s) => ({
      ...s,
      phase: "work",
      secondsLeft: WORK_SEC,
      totalSeconds: WORK_SEC,
      isRunning: false,
      endTime: null,
      pomodoroCount: 0,
      alarmPlaying: false,
    }));
  }, []);

  const value: PomodoroContextValue = {
    ...state,
    toggleTimer,
    toggleSound,
    stopAlarm,
    resetPomodoro,
  };

  return <PomodoroContext.Provider value={value}>{children}</PomodoroContext.Provider>;
}

export function usePomodoro() {
  const ctx = useContext(PomodoroContext);
  if (!ctx) throw new Error("usePomodoro must be used within PomodoroProvider");
  return ctx;
}

/** Versión segura que retorna null si no hay provider (para componentes compartidos) */
export function usePomodoroOptional() {
  return useContext(PomodoroContext);
}
