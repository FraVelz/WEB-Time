"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTimer } from "@/features/timer/context/TimerContext";
import { usePomodoroOptional } from "@/features/pomodoro/context/PomodoroContext";

const SECTIONS = [
  { path: "/inicio", label: "Inicio" },
  { path: "/pomodoro", label: "Pomodoro" },
  { path: "/temporizador", label: "Temporizador" },
  { path: "/hora", label: "Hora" },
] as const;

function pad(n: number) {
  return String(Math.floor(n)).padStart(2, "0");
}

const PHASE_LABELS: Record<string, string> = {
  work: "Trabajo",
  shortBreak: "Descanso",
  longBreak: "Descanso largo",
};

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { isRunning, displayForHeader } = useTimer();
  const pomodoro = usePomodoroOptional();
  const timerDisplay = displayForHeader
    ? displayForHeader.type === "timer"
      ? `${pad(Math.floor(displayForHeader.secondsLeft / 60))}:${pad(displayForHeader.secondsLeft % 60)}`
      : `${pad(Math.floor(displayForHeader.secondsElapsed / 60))}:${pad(displayForHeader.secondsElapsed % 60)}`
    : "";
  const pomodoroDisplay = pomodoro
    ? `${pad(Math.floor(pomodoro.secondsLeft / 60))}:${pad(pomodoro.secondsLeft % 60)}`
    : "";

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--color-border)] bg-[var(--color-bg)]/95 backdrop-blur supports-[backdrop-filter]:bg-[var(--color-bg)]/80">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 md:px-6">
        <div className="flex items-center gap-3">
          <Link
            href="/inicio"
            className="text-lg font-semibold text-[var(--color-text)] transition-colors hover:text-[var(--color-accent)]"
          >
            WEB-Time
          </Link>
          {isRunning && (
            <Link
              href="/temporizador"
              className="flex items-center gap-1.5 rounded-lg bg-[var(--color-accent)]/20 px-2.5 py-1 font-mono text-xs font-medium text-[var(--color-accent)] transition-colors hover:bg-[var(--color-accent)]/30"
              title="Temporizador en marcha"
            >
              <span className="size-1.5 animate-pulse rounded-full bg-[var(--color-accent)]" />
              {timerDisplay}
            </Link>
          )}
          {pomodoro?.isRunning && (
            <Link
              href="/pomodoro"
              className="flex items-center gap-1.5 rounded-lg bg-[var(--color-success)]/20 px-2.5 py-1 font-mono text-xs font-medium text-[var(--color-success)] transition-colors hover:bg-[var(--color-success)]/30"
              title={pomodoro ? `Pomodoro: ${PHASE_LABELS[pomodoro.phase]}` : "Pomodoro"}
            >
              <span className="size-1.5 animate-pulse rounded-full bg-[var(--color-success)]" />
              {pomodoroDisplay}
            </Link>
          )}
        </div>

        <button
          type="button"
          className="flex size-10 cursor-pointer flex-col items-center justify-center gap-1.5 rounded-lg border border-[var(--color-border)] text-[var(--color-text)] hover:bg-[var(--color-surface)] md:hidden"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-controls="nav-menu"
        >
          <span className={`h-0.5 w-5 bg-current transition-transform ${open ? "translate-y-1 rotate-45" : ""}`} />
          <span className={`h-0.5 w-5 bg-current transition-opacity ${open ? "opacity-0" : ""}`} />
          <span className={`h-0.5 w-5 bg-current transition-transform ${open ? "-translate-y-1 -rotate-45" : ""}`} />
        </button>

        <nav
          id="nav-menu"
          className={`absolute top-full right-0 left-0 flex flex-col gap-1 border-b border-[var(--color-border)] bg-[var(--color-bg)] p-4 md:static md:flex-row md:border-0 md:bg-transparent md:p-0 ${open ? "flex" : "hidden md:flex"}`}
          aria-label="Secciones principales"
        >
          {SECTIONS.map(({ path, label }) => {
            const isActive = pathname === path || (path === "/inicio" && pathname === "/");
            return (
              <Link
                key={path}
                href={path}
                className={`rounded-lg px-4 py-2 transition-colors ${
                  isActive
                    ? "bg-[var(--color-surface)] text-[var(--color-accent)]"
                    : "text-[var(--color-text)] hover:bg-[var(--color-surface)] hover:text-[var(--color-accent)]"
                }`}
                onClick={() => setOpen(false)}
              >
                {label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
