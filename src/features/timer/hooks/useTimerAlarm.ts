"use client";

import { useCallback, useRef } from "react";
import { ALARM_PATH } from "@/features/timer/lib/createTimer";

export function useTimerAlarm(soundEnabled: boolean) {
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

  const stopAlarmAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
    alarmPlayedRef.current = false;
  }, []);

  const muteAlarmAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
    alarmPlayedRef.current = false;
  }, []);

  return {
    playAlarm,
    requestWakeLock,
    releaseWakeLock,
    stopAlarmAudio,
    muteAlarmAudio,
  };
}
