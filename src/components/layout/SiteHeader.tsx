"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { usePomodoroOptional } from "@/features/pomodoro/context/PomodoroContext";
import { POMODORO_PHASE_LABELS } from "@/features/pomodoro/lib/constants";
import { useTimer } from "@/features/temporizador/context/TimerContext";
import { cn } from "@/lib/cn";
import { formatMmSs } from "@/lib/time";

const NAV_LINKS = [
  { path: "/inicio", label: "Inicio" },
  { path: "/pomodoro", label: "Pomodoro" },
  { path: "/temporizador", label: "Temporizador" },
  { path: "/hora", label: "Hora" },
] as const;

const HEADER_PHASE_LABELS = {
  ...POMODORO_PHASE_LABELS,
  shortBreak: "Descanso",
} as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { isRunning, displayForHeader } = useTimer();
  const pomodoro = usePomodoroOptional();

  const timerDisplay = displayForHeader
    ? displayForHeader.type === "timer"
      ? formatMmSs(displayForHeader.secondsLeft)
      : formatMmSs(displayForHeader.secondsElapsed)
    : "";

  const pomodoroDisplay = pomodoro ? formatMmSs(pomodoro.secondsLeft) : "";

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b border-border bg-bg/95 backdrop-blur",
        "supports-[backdrop-filter]:bg-bg/80",
      )}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 md:px-6">
        <div className="flex items-center gap-3">
          <Link
            href="/inicio"
            className="text-lg font-semibold text-text transition-colors hover:text-accent"
          >
            WEB-Time
          </Link>
          {isRunning && (
            <Link
              href="/temporizador"
              className={cn(
                "flex items-center gap-1.5 rounded-lg bg-accent/20 px-2.5 py-1",
                "font-mono text-xs font-medium text-accent hover:bg-accent/30",
              )}
              title="Temporizador en marcha"
            >
              <span className="size-1.5 animate-pulse rounded-full bg-accent" />
              {timerDisplay}
            </Link>
          )}
          {pomodoro?.isRunning && (
            <Link
              href="/pomodoro"
              className={cn(
                "flex items-center gap-1.5 rounded-lg bg-success/20 px-2.5 py-1",
                "font-mono text-xs font-medium text-success hover:bg-success/30",
              )}
              title={`Pomodoro: ${HEADER_PHASE_LABELS[pomodoro.phase]}`}
            >
              <span className="size-1.5 animate-pulse rounded-full bg-success" />
              {pomodoroDisplay}
            </Link>
          )}
        </div>

        <button
          type="button"
          className={cn(
            "flex size-10 cursor-pointer flex-col items-center justify-center gap-1.5",
            "rounded-lg border border-border text-text hover:bg-surface md:hidden",
          )}
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-controls="nav-menu"
        >
          <span className={cn("h-0.5 w-5 bg-current transition-transform", open && "translate-y-1 rotate-45")} />
          <span className={cn("h-0.5 w-5 bg-current transition-opacity", open && "opacity-0")} />
          <span
            className={cn("h-0.5 w-5 bg-current transition-transform", open && "-translate-y-1 -rotate-45")}
          />
        </button>

        <nav
          id="nav-menu"
          className={cn(
            "absolute top-full right-0 left-0 flex flex-col gap-8 border-b border-border bg-bg p-4",
            "md:static md:flex-row md:border-0 md:bg-transparent md:p-0",
            open ? "flex" : "hidden md:flex",
          )}
          aria-label="Secciones principales"
        >
          {NAV_LINKS.map(({ path, label }) => {
            const isActive = pathname === path || (path === "/inicio" && pathname === "/");
            return (
              <Link
                key={path}
                href={path}
                className={cn(
                  "group relative px-0 py-2 transition-colors",
                  isActive ? "text-accent" : "text-text hover:text-accent",
                )}
                onClick={() => setOpen(false)}
              >
                {label}
                <span
                  aria-hidden
                  className={cn(
                    "absolute bottom-0 left-1/2 h-0.5 -translate-x-1/2 rounded-full bg-accent",
                    "transition-[width] duration-300 ease-out",
                    isActive ? "w-[50%]" : "w-0 group-hover:w-[50%]",
                  )}
                />
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
