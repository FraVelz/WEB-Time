"use client";

import type { ReactNode } from "react";
import { TimerProvider } from "@/features/temporizador/context/TimerContext";
import { PomodoroProvider } from "@/features/pomodoro/context/PomodoroContext";
import { ThemeProvider } from "@/providers/ThemeProvider";

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <TimerProvider>
        <PomodoroProvider>{children}</PomodoroProvider>
      </TimerProvider>
    </ThemeProvider>
  );
}
