"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { TimerItem, CronoState, TimerMode } from "@/types/timer";

const ALARM_PATH = "/alarma.mp3";
const DEFAULT_SECONDS = 5 * 60;

function generateId(): string {
  return crypto.randomUUID?.() ?? `t-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function createTimer(overrides?: Partial<TimerItem> & { name?: string }): TimerItem {
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

const initialCrono: CronoState = {
  secondsElapsed: 0,
  cronoStartTime: null,
  isRunning: false,
};

type TimerContextValue = {
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
  /** Algún temporizador o el cronómetro está en marcha (para el header) */
  isRunning: boolean;
  /** Tiempo a mostrar en header: primer temporizador activo o cronómetro */
  displayForHeader: { type: "timer"; id: string; secondsLeft: number } | { type: "crono"; secondsElapsed: number } | null;
};

const TimerContext = createContext<TimerContextValue | null>(null);

export function TimerProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<TimerMode>("temporizador");
  const [timers, setTimers] = useState<TimerItem[]>(() => [
    createTimer({ name: "Temporizador 1" }),
  ]);
  const [crono, setCrono] = useState<CronoState>(initialCrono);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [alarmPlaying, setAlarmPlaying] = useState(false);
  const [alarmTimerId, setAlarmTimerId] = useState<string | null>(null);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const wakeLockRef = useRef<{ release: () => Promise<void> } | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const alarmPlayedRef = useRef(false);

  const playAlarm = useCallback(() => {
    if (alarmPlayedRef.current) return;
    alarmPlayedRef.current = true;
    if (!soundEnabled) return;
    try {
      const audio = new Audio(ALARM_PATH);
      audio.volume = 1;
      audio.loop = true;
      audio.play().catch(() => {});
      audioRef.current = audio;
    } catch {
      // ignore
    }
  }, [soundEnabled]);

  const requestWakeLock = useCallback(async () => {
    if (typeof navigator !== "undefined" && "wakeLock" in navigator) {
      try {
        const w = await navigator.wakeLock.request("screen");
        wakeLockRef.current = w;
      } catch {
        // ignore
      }
    }
  }, []);

  const releaseWakeLock = useCallback(async () => {
    if (wakeLockRef.current) {
      try {
        await wakeLockRef.current.release();
      } catch {
        // ignore
      }
      wakeLockRef.current = null;
    }
  }, []);

  const stopAlarm = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
    alarmPlayedRef.current = false;
    setAlarmPlaying(false);
    setAlarmTimerId(null);
  }, []);

  const tick = useCallback(() => {
    setTimers((prev) => {
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
        setAlarmTimerId(anyFinished);
        setAlarmPlaying(true);
        return next.map((t) =>
          t.id === anyFinished ? { ...t, isRunning: false, endTime: null } : t
        );
      }
      return next;
    });

    setCrono((c) => {
      if (!c.isRunning || c.cronoStartTime == null) return c;
      const elapsed = Math.floor((Date.now() - c.cronoStartTime) / 1000);
      return { ...c, secondsElapsed: elapsed };
    });
  }, [playAlarm]);

  const anyTimerRunning = timers.some((t) => t.isRunning);
  const cronoRunning = crono.isRunning;
  const shouldTick = anyTimerRunning || cronoRunning;

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
      if (document.visibilityState === "visible" && shouldTick) requestWakeLock();
      else if (document.visibilityState === "hidden") releaseWakeLock();
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, [shouldTick, requestWakeLock, releaseWakeLock]);

  const setMode = useCallback((newMode: TimerMode) => {
    if (anyTimerRunning || cronoRunning) return;
    setModeState(newMode);
    if (newMode === "cronometro") setCrono(initialCrono);
  }, [anyTimerRunning, cronoRunning]);

  const addTimer = useCallback((name?: string, initialSeconds?: number) => {
    const count = timers.length + 1;
    setTimers((prev) => [
      ...prev,
      createTimer({
        name: name?.trim() || `Temporizador ${count}`,
        secondsLeft: initialSeconds ?? DEFAULT_SECONDS,
        totalSeconds: initialSeconds ?? DEFAULT_SECONDS,
      }),
    ]);
  }, [timers.length]);

  const removeTimer = useCallback((id: string) => {
    setTimers((prev) => prev.filter((t) => t.id !== id));
    if (alarmTimerId === id) stopAlarm();
  }, [alarmTimerId, stopAlarm]);

  const updateTimerName = useCallback((id: string, newName: string) => {
    setTimers((prev) =>
      prev.map((t) => (t.id === id ? { ...t, name: newName.trim() || t.name } : t))
    );
  }, []);

  const setTimerSeconds = useCallback((id: string, seconds: number) => {
    const sec = Math.max(0, seconds);
    setTimers((prev) =>
      prev.map((t) => {
        if (t.id !== id) return t;
        const isRunning = t.isRunning && t.endTime != null;
        return {
          ...t,
          secondsLeft: sec,
          totalSeconds: sec,
          endTime: isRunning ? Date.now() + sec * 1000 : null,
        };
      })
    );
  }, []);

  const addTimerTime = useCallback((id: string, delta: number) => {
    setTimers((prev) =>
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
      })
    );
  }, []);

  const toggleTimer = useCallback((id: string) => {
    if (alarmTimerId === id) {
      stopAlarm();
      return;
    }
    setTimers((prev) =>
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
      })
    );
  }, [alarmTimerId, stopAlarm]);

  const resetTimer = useCallback((id: string) => {
    if (alarmTimerId === id) stopAlarm();
    setTimers((prev) =>
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
      })
    );
  }, [alarmTimerId, stopAlarm]);

  const toggleSound = useCallback(() => {
    setSoundEnabled((v) => {
      if (!v) return true;
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        audioRef.current = null;
      }
      alarmPlayedRef.current = false;
      return false;
    });
  }, []);

  const resetCronometro = useCallback(() => {
    setCrono(initialCrono);
  }, []);

  // Cronómetro play/pause
  const toggleCronometro = useCallback(() => {
    setCrono((c) => {
      if (c.isRunning) {
        const elapsed = Math.floor(
          (Date.now() - (c.cronoStartTime ?? Date.now())) / 1000
        );
        return { ...c, isRunning: false, cronoStartTime: null, secondsElapsed: elapsed };
      }
      return {
        ...c,
        isRunning: true,
        cronoStartTime: Date.now() - c.secondsElapsed * 1000,
      };
    });
  }, []);

  const firstRunningTimer = timers.find((t) => t.isRunning && t.endTime != null);
  const displayForHeader =
    firstRunningTimer != null
      ? { type: "timer" as const, id: firstRunningTimer.id, secondsLeft: firstRunningTimer.secondsLeft }
      : crono.isRunning
        ? { type: "crono" as const, secondsElapsed: crono.secondsElapsed }
        : null;

  const isRunning = anyTimerRunning || cronoRunning;

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
    isRunning,
    displayForHeader,
  };

  return (
    <TimerContext.Provider value={value}>{children}</TimerContext.Provider>
  );
}

export function useTimer() {
  const ctx = useContext(TimerContext);
  if (!ctx) throw new Error("useTimer must be used within TimerProvider");
  return ctx;
}
