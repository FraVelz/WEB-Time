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

const ALARM_PATH = "/alarma.mp3";

type TimerMode = "temporizador" | "cronometro";

type TimerState = {
  mode: TimerMode;
  // Temporizador (cuenta regresiva)
  secondsLeft: number;
  totalSeconds: number;
  endTime: number | null; // timestamp cuando termina (para precisión con throttling)
  // Cronómetro (cuenta ascendente)
  secondsElapsed: number;
  cronoStartTime: number | null;
  isRunning: boolean;
  soundEnabled: boolean;
  alarmPlaying: boolean;
};

type TimerContextValue = TimerState & {
  setMode: (mode: TimerMode) => void;
  setSecondsLeft: (seconds: number) => void;
  addTime: (seconds: number) => void;
  toggleSound: () => void;
  toggleTimer: () => void;
  stopAlarm: () => void;
  resetTimer: () => void;
  resetCronometro: () => void;
};

const initialState: TimerState = {
  mode: "temporizador",
  secondsLeft: 5 * 60,
  totalSeconds: 5 * 60,
  endTime: null,
  secondsElapsed: 0,
  cronoStartTime: null,
  isRunning: false,
  soundEnabled: true,
  alarmPlaying: false,
};

const TimerContext = createContext<TimerContextValue | null>(null);

export function TimerProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<TimerState>(initialState);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const wakeLockRef = useRef<{ release: () => Promise<void> } | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const alarmPlayedRef = useRef(false);

  const playAlarm = useCallback(() => {
    if (alarmPlayedRef.current) return;
    alarmPlayedRef.current = true;
    if (!state.soundEnabled) return;
    try {
      const audio = new Audio(ALARM_PATH);
      audio.volume = 1;
      audio.loop = true;
      audio.play().catch(() => {});
      audioRef.current = audio;
    } catch {
      // Ignorar errores de reproducción
    }
  }, [state.soundEnabled]);

  const requestWakeLock = useCallback(async () => {
    if (typeof navigator !== "undefined" && "wakeLock" in navigator) {
      try {
        const wakeLock = await navigator.wakeLock.request("screen");
        wakeLockRef.current = wakeLock;
      } catch {
        // Wake Lock no disponible o rechazado
      }
    }
  }, []);

  const releaseWakeLock = useCallback(async () => {
    if (wakeLockRef.current) {
      try {
        await wakeLockRef.current.release();
      } catch {
        // Ignorar
      }
      wakeLockRef.current = null;
    }
  }, []);

  const stopTimer = useCallback(() => {
    alarmPlayedRef.current = false;
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    releaseWakeLock();
    setState((s) => ({
      ...s,
      isRunning: false,
      endTime: null,
      cronoStartTime: null,
    }));
  }, [releaseWakeLock]);

  const tick = useCallback(() => {
    setState((s) => {
      if (s.mode === "temporizador") {
        if (!s.endTime) return s;
        const now = Date.now();
        const remaining = Math.max(0, Math.ceil((s.endTime - now) / 1000));
        if (remaining <= 0) {
          playAlarm();
          return {
            ...s,
            secondsLeft: 0,
            isRunning: false,
            endTime: null,
            alarmPlaying: s.soundEnabled,
          };
        }
        return { ...s, secondsLeft: remaining };
      } else {
        // Cronómetro
        if (!s.cronoStartTime) return s;
        const elapsed = Math.floor((Date.now() - s.cronoStartTime) / 1000);
        return { ...s, secondsElapsed: elapsed };
      }
    });
  }, [playAlarm]);

  useEffect(() => {
    const s = state;
    if (!s.isRunning) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      releaseWakeLock();
      return;
    }

    requestWakeLock();
    tick(); // Actualizar inmediatamente
    intervalRef.current = setInterval(tick, 200); // Actualizar cada 200ms para suavidad (Date.now() mantiene precisión)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [state.isRunning, state.mode, state.endTime, state.cronoStartTime, tick, requestWakeLock, releaseWakeLock]);

  // Detectar cuando el timer llega a 0 para parar el intervalo
  useEffect(() => {
    if (!state.isRunning && intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, [state.isRunning]);

  // Re-adquirir Wake Lock cuando la pestaña vuelve a ser visible
  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState === "visible" && state.isRunning) {
        requestWakeLock();
      } else if (document.visibilityState === "hidden") {
        releaseWakeLock();
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, [state.isRunning, requestWakeLock, releaseWakeLock]);

  // Limpiar al cerrar la página
  useEffect(() => {
    const handleBeforeUnload = () => {
      stopTimer();
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [stopTimer]);

  const setMode = useCallback((mode: TimerMode) => {
    setState((s) => {
      if (s.isRunning) return s;
      return {
        ...s,
        mode,
        ...(mode === "temporizador"
          ? { secondsLeft: s.totalSeconds || 5 * 60, totalSeconds: s.totalSeconds || 5 * 60 }
          : { secondsElapsed: 0, cronoStartTime: null }),
      };
    });
  }, []);

  const setSecondsLeft = useCallback((seconds: number) => {
    setState((s) => ({
      ...s,
      secondsLeft: Math.max(0, seconds),
      totalSeconds: Math.max(0, seconds),
      endTime: s.isRunning && s.mode === "temporizador"
        ? Date.now() + Math.max(0, seconds) * 1000
        : s.endTime,
    }));
  }, []);

  const addTime = useCallback((seconds: number) => {
    setState((s) => {
      if (s.mode !== "temporizador") return s;
      const newTotal = Math.max(0, s.secondsLeft + seconds);
      const newEndTime = s.isRunning ? Date.now() + newTotal * 1000 : null;
      return {
        ...s,
        secondsLeft: newTotal,
        totalSeconds: newTotal,
        endTime: newEndTime,
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
        alarmPlayedRef.current = false;
      }
      return { ...s, soundEnabled: nextEnabled, alarmPlaying: nextEnabled ? s.alarmPlaying : false };
    });
  }, []);

  const stopAlarm = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
    alarmPlayedRef.current = false;
    setState((s) => ({ ...s, alarmPlaying: false }));
  }, []);

  const toggleTimer = useCallback(() => {
    alarmPlayedRef.current = false;
    setState((s) => {
      if (s.mode === "temporizador") {
        if (s.isRunning) {
          return {
            ...s,
            isRunning: false,
            endTime: null,
          };
        }
        if (s.secondsLeft <= 0) return s;
        return {
          ...s,
          isRunning: true,
          endTime: Date.now() + s.secondsLeft * 1000,
        };
      } else {
        // Cronómetro
        if (s.isRunning) {
          return {
            ...s,
            isRunning: false,
            cronoStartTime: null,
            secondsElapsed: Math.floor(
              (Date.now() - (s.cronoStartTime ?? Date.now())) / 1000
            ),
          };
        }
        return {
          ...s,
          isRunning: true,
          cronoStartTime: Date.now() - s.secondsElapsed * 1000,
        };
      }
    });
  }, []);

  const resetTimer = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
    alarmPlayedRef.current = false;
    setState((s) => ({
      ...s,
      secondsLeft: s.totalSeconds || 5 * 60,
      totalSeconds: s.totalSeconds || 5 * 60,
      isRunning: false,
      endTime: null,
      alarmPlaying: false,
    }));
  }, []);

  const resetCronometro = useCallback(() => {
    setState((s) => ({
      ...s,
      secondsElapsed: 0,
      cronoStartTime: null,
      isRunning: false,
    }));
  }, []);

  const value: TimerContextValue = {
    ...state,
    setMode,
    setSecondsLeft,
    addTime,
    toggleSound,
    toggleTimer,
    stopAlarm,
    resetTimer,
    resetCronometro,
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
