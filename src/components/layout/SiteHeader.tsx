"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { usePomodoroOptional } from "@/features/pomodoro/context/PomodoroContext";
import { POMODORO_PHASE_LABELS } from "@/features/pomodoro/lib/constants";
import { useTimer } from "@/features/temporizador/context/TimerContext";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
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

function MobileMenuButton({ open, onToggle }: { open: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      className={cn(
        "border-border text-text hover:bg-surface relative flex size-11 shrink-0 items-center justify-center rounded-lg border",
        "md:hidden",
      )}
      onClick={onToggle}
      aria-expanded={open}
      aria-controls="nav-menu-mobile"
      aria-label={open ? "Cerrar menú de navegación" : "Abrir menú de navegación"}
    >
      <span
        className={cn(
          "absolute block h-0.5 w-5 rounded-full bg-current transition-all duration-200",
          open ? "top-1/2 -translate-y-1/2 rotate-45" : "top-3",
        )}
      />
      <span
        className={cn(
          "absolute top-1/2 block h-0.5 w-5 -translate-y-1/2 rounded-full bg-current transition-all duration-200",
          open ? "scale-0 opacity-0" : "opacity-100",
        )}
      />
      <span
        className={cn(
          "absolute block h-0.5 w-5 rounded-full bg-current transition-all duration-200",
          open ? "top-1/2 -translate-y-1/2 -rotate-45" : "bottom-3",
        )}
      />
    </button>
  );
}

function NavLink({
  path,
  label,
  pathname,
  onNavigate,
  variant,
}: {
  path: string;
  label: string;
  pathname: string;
  onNavigate?: () => void;
  variant: "mobile" | "desktop";
}) {
  const isActive = pathname === path || (path === "/inicio" && pathname === "/");

  if (variant === "mobile") {
    return (
      <Link
        href={path}
        className={cn(
          "text-text block w-full rounded-lg px-4 py-3 text-base font-medium transition-colors",
          isActive ? "bg-accent-soft text-accent" : "hover:bg-surface active:bg-surface",
        )}
        onClick={onNavigate}
        aria-current={isActive ? "page" : undefined}
      >
        {label}
      </Link>
    );
  }

  return (
    <Link
      href={path}
      className={cn(
        "group relative px-0 py-2 text-sm font-medium transition-colors",
        isActive ? "text-accent" : "text-text hover:text-accent",
      )}
      onClick={onNavigate}
      aria-current={isActive ? "page" : undefined}
    >
      {label}
      <span
        aria-hidden
        className={cn(
          "bg-accent absolute bottom-0 left-1/2 h-0.5 -translate-x-1/2 rounded-full",
          "transition-[width] duration-300 ease-out",
          isActive ? "w-[50%]" : "w-0 group-hover:w-[50%]",
        )}
      />
    </Link>
  );
}

function RunningBadges({
  timerDisplay,
  pomodoroDisplay,
  pomodoroPhase,
  showTimer,
  showPomodoro,
  className,
}: {
  timerDisplay: string;
  pomodoroDisplay: string;
  pomodoroPhase: keyof typeof HEADER_PHASE_LABELS | undefined;
  showTimer: boolean;
  showPomodoro: boolean;
  className?: string;
}) {
  if (!showTimer && !showPomodoro) return null;

  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      {showTimer && (
        <Link
          href="/temporizador"
          className={cn(
            "bg-accent/20 text-accent hover:bg-accent/30 flex items-center gap-1.5 rounded-lg px-2.5 py-1",
            "font-mono text-xs font-medium",
          )}
          title="Temporizador en marcha"
        >
          <span className="bg-accent size-1.5 animate-pulse rounded-full" />
          {timerDisplay}
        </Link>
      )}
      {showPomodoro && pomodoroPhase && (
        <Link
          href="/pomodoro"
          className={cn(
            "bg-success/20 text-success hover:bg-success/30 flex items-center gap-1.5 rounded-lg px-2.5 py-1",
            "font-mono text-xs font-medium",
          )}
          title={`Pomodoro: ${HEADER_PHASE_LABELS[pomodoroPhase]}`}
        >
          <span className="bg-success size-1.5 animate-pulse rounded-full" />
          {pomodoroDisplay}
        </Link>
      )}
    </div>
  );
}

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
  const showTimer = isRunning;
  const showPomodoro = Boolean(pomodoro?.isRunning);

  const closeMenu = () => setOpen(false);

  return (
    <header
      className={cn(
        "border-border bg-bg/95 sticky top-0 z-50 border-b backdrop-blur",
        "supports-[backdrop-filter]:bg-bg/80",
      )}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 md:gap-4 md:px-6">
        <Link href="/inicio" className="text-text hover:text-accent shrink-0 text-lg font-semibold transition-colors">
          WEB-Time
        </Link>

        <nav
          className="hidden flex-1 flex-row items-center justify-center gap-8 md:flex"
          aria-label="Secciones principales"
        >
          {NAV_LINKS.map(({ path, label }) => (
            <NavLink key={path} path={path} label={label} pathname={pathname} variant="desktop" />
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          <RunningBadges
            timerDisplay={timerDisplay}
            pomodoroDisplay={pomodoroDisplay}
            pomodoroPhase={pomodoro?.phase}
            showTimer={showTimer}
            showPomodoro={showPomodoro}
            className="hidden md:flex"
          />
          <ThemeToggle className="size-11 md:size-10" />
          <MobileMenuButton open={open} onToggle={() => setOpen((o) => !o)} />
        </div>
      </div>

      <nav
        id="nav-menu-mobile"
        className={cn("border-border bg-bg border-b md:hidden", open ? "flex flex-col gap-1 px-4 py-3" : "hidden")}
        aria-label="Secciones principales"
      >
        <RunningBadges
          timerDisplay={timerDisplay}
          pomodoroDisplay={pomodoroDisplay}
          pomodoroPhase={pomodoro?.phase}
          showTimer={showTimer}
          showPomodoro={showPomodoro}
          className="mb-2"
        />
        {NAV_LINKS.map(({ path, label }) => (
          <NavLink key={path} path={path} label={label} pathname={pathname} variant="mobile" onNavigate={closeMenu} />
        ))}
      </nav>
    </header>
  );
}
