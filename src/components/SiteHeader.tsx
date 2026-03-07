"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTimer } from "@/context/TimerContext";

const SECTIONS = [
  { path: "/inicio", label: "Inicio" },
  { path: "/pomodoro", label: "Pomodoro" },
  { path: "/temporizador", label: "Temporizador" },
  { path: "/hora", label: "Hora" },
] as const;

function pad(n: number) {
  return String(Math.floor(n)).padStart(2, "0");
}

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { isRunning, mode, secondsLeft, secondsElapsed } = useTimer();
  const timerDisplay =
    mode === "temporizador"
      ? `${pad(Math.floor(secondsLeft / 60))}:${pad(secondsLeft % 60)}`
      : `${pad(Math.floor(secondsElapsed / 60))}:${pad(secondsElapsed % 60)}`;

  return (
    <header
      className="sticky top-0 z-50 border-b border-[var(--color-border)] bg-[var(--color-bg)]/95 backdrop-blur supports-[backdrop-filter]:bg-[var(--color-bg)]/80"
      role="banner"
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 md:px-6">
        <div className="flex items-center gap-3">
          <Link
            href="/inicio"
            className="text-lg font-semibold text-[var(--color-text)] hover:text-[var(--color-accent)] transition-colors"
          >
            WEB-Time
          </Link>
          {isRunning && (
            <Link
              href="/temporizador"
              className="flex items-center gap-1.5 rounded-lg bg-[var(--color-accent)]/20 px-2.5 py-1 text-xs font-mono font-medium text-[var(--color-accent)] hover:bg-[var(--color-accent)]/30 transition-colors"
              title="Temporizador en marcha"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-accent)] animate-pulse" />
              {timerDisplay}
            </Link>
          )}
        </div>

        <button
          type="button"
          className="md:hidden flex flex-col gap-1.5 w-10 h-10 justify-center items-center rounded-lg border border-[var(--color-border)] text-[var(--color-text)] hover:bg-[var(--color-surface)]"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-controls="nav-menu"
        >
          <span className={`w-5 h-0.5 bg-current transition-transform ${open ? "rotate-45 translate-y-1" : ""}`} />
          <span className={`w-5 h-0.5 bg-current transition-opacity ${open ? "opacity-0" : ""}`} />
          <span className={`w-5 h-0.5 bg-current transition-transform ${open ? "-rotate-45 -translate-y-1" : ""}`} />
        </button>

        <nav
          id="nav-menu"
          className={`absolute top-full left-0 right-0 flex flex-col gap-1 border-b border-[var(--color-border)] bg-[var(--color-bg)] p-4 md:static md:flex-row md:border-0 md:bg-transparent md:p-0 ${open ? "flex" : "hidden md:flex"}`}
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
                    ? "text-[var(--color-accent)] bg-[var(--color-surface)]"
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
