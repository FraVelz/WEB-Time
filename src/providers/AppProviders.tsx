"use client";

import type { ReactNode } from "react";
import type { Theme } from "@/lib/theme";

import { PomodoroProvider } from "@/features/pomodoro/context/PomodoroContext";
import { TimerProvider } from "@/features/temporizador/context/TimerContext";
import { ThemeProvider } from "@/providers/ThemeProvider";

type AppProvidersProps = {
  children: ReactNode;
  initialTheme: Theme;
};

export function AppProviders({ children, initialTheme }: AppProvidersProps) {
  return (
    <ThemeProvider initialTheme={initialTheme}>
      <TimerProvider>
        <PomodoroProvider>{children}</PomodoroProvider>
      </TimerProvider>
    </ThemeProvider>
  );
}
