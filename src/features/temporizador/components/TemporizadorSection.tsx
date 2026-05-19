"use client";

import type { ReactNode } from "react";
import { CheckIcon, ClockIcon, PauseIcon, PlayIcon, PlusIcon } from "@/ui/icons";
import { TimerMediaControls } from "@/ui/TimerMediaControls";
import { useTimer } from "@/features/temporizador/context/TimerContext";
import { formatCronometro } from "@/lib/time";
import { cn } from "@/lib/cn";
import { TimerCard } from "./TimerCard";

function ModeTab({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: ReactNode;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex cursor-pointer items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors",
        active
          ? "bg-accent/20 text-accent"
          : "text-muted hover:bg-surface-hover hover:text-text",
      )}
    >
      {icon}
      {label}
    </button>
  );
}

export function TemporizadorSection() {
  const { mode, timers, crono, soundEnabled, setMode, addTimer, toggleSound, resetCronometro, toggleCronometro } =
    useTimer();

  return (
    <div className="rounded-2xl border border-border bg-surface p-6 md:p-8">
      <div className="mb-6 flex gap-2">
        <ModeTab
          active={mode === "temporizador"}
          onClick={() => setMode("temporizador")}
          icon={<CheckIcon />}
          label="Temporizador"
        />
        <ModeTab
          active={mode === "cronometro"}
          onClick={() => setMode("cronometro")}
          icon={<ClockIcon />}
          label="Cronómetro"
        />
      </div>

      <TimerMediaControls soundEnabled={soundEnabled} onToggleSound={toggleSound} />

      {mode === "temporizador" && (
        <>
          <ul className="mb-6 space-y-6" aria-label="Lista de temporizadores">
            {timers.map((t) => (
              <li key={t.id}>
                <TimerCard timerId={t.id} />
              </li>
            ))}
          </ul>
          <button
            type="button"
            onClick={() => addTimer()}
            className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border py-4 font-medium text-muted transition-colors hover:border-accent hover:text-accent"
          >
            <PlusIcon />
            Añadir temporizador
          </button>
        </>
      )}

      {mode === "cronometro" && (
        <div className="space-y-6">
          <p className="font-mono text-5xl font-light text-text md:text-6xl">
            {formatCronometro(crono.secondsElapsed)}
          </p>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={toggleCronometro}
              className="flex cursor-pointer items-center justify-center gap-2 rounded-2xl bg-accent px-8 py-4 font-semibold text-white transition-all hover:brightness-110"
            >
              {crono.isRunning ? <PauseIcon /> : <PlayIcon />}
              {crono.isRunning ? "Pausar" : "Iniciar"}
            </button>
            <button
              type="button"
              onClick={resetCronometro}
              disabled={crono.isRunning}
              className="cursor-pointer rounded-xl bg-surface-hover px-6 py-4 text-sm font-medium text-text transition-colors hover:bg-border disabled:cursor-not-allowed disabled:opacity-50"
            >
              Reiniciar
            </button>
          </div>
        </div>
      )}

      <p className="mt-4 text-center text-sm text-muted">
        Los temporizadores siguen en segundo plano al cambiar de página. Se detienen al cerrar la pestaña.
      </p>
    </div>
  );
}
