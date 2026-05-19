"use client";

import type { ReactNode } from "react";
import { TimerProvider } from "@/features/timer/context/TimerContext";
import { PomodoroProvider } from "@/features/pomodoro/context/PomodoroContext";

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <TimerProvider>
      <PomodoroProvider>{children}</PomodoroProvider>
    </TimerProvider>
  );
}
