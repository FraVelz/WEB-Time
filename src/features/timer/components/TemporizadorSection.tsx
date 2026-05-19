"use client";

import { useTimer } from "@/features/timer/context/TimerContext";
import { TimerCard } from "./TimerCard";
import { formatCronometro } from "@/features/timer/lib/timerFormat";
import { useCallback } from "react";

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function ClockIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function PlayIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <polygon points="5 3 19 12 5 21 5 3" />
    </svg>
  );
}

function PauseIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <rect x="6" y="4" width="4" height="16" rx="1" />
      <rect x="14" y="4" width="4" height="16" rx="1" />
    </svg>
  );
}

function SpeakerIcon({ className, muted }: { className?: string; muted?: boolean }) {
  return (
    <svg
      className={className}
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      {muted ? (
        <line x1="23" y1="9" x2="17" y2="15" />
      ) : (
        <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
      )}
      {muted && <line x1="17" y1="9" x2="23" y2="15" />}
    </svg>
  );
}

function FullscreenIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
    </svg>
  );
}

function PlusIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

export function TemporizadorSection() {
  const { mode, timers, crono, soundEnabled, setMode, addTimer, toggleSound, resetCronometro, toggleCronometro } =
    useTimer();

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
  }, []);

  const cronoDisplay = formatCronometro(crono.secondsElapsed);

  return (
    <section
      id="temporizador"
      className="scroll-mt-20 border-t border-[var(--color-border)] py-12 md:py-16"
      aria-labelledby="temporizador-heading"
    >
      <div className="mx-auto max-w-4xl px-4 md:px-6">
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 md:p-8">
          {/* Tabs */}
          <div className="mb-6 flex gap-2">
            <button
              type="button"
              onClick={() => setMode("temporizador")}
              className={`flex cursor-pointer items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors ${
                mode === "temporizador"
                  ? "bg-[var(--color-accent)]/20 text-[var(--color-accent)]"
                  : "text-[var(--color-muted)] hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text)]"
              }`}
            >
              <CheckIcon />
              Temporizador
            </button>
            <button
              type="button"
              onClick={() => setMode("cronometro")}
              className={`flex cursor-pointer items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors ${
                mode === "cronometro"
                  ? "bg-[var(--color-accent)]/20 text-[var(--color-accent)]"
                  : "text-[var(--color-muted)] hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text)]"
              }`}
            >
              <ClockIcon />
              Cronómetro
            </button>
          </div>

          {/* Controles globales: sonido, pantalla completa */}
          <div className="mb-4 flex justify-end gap-2">
            <button
              type="button"
              onClick={toggleSound}
              className="cursor-pointer rounded-lg p-2 text-[var(--color-muted)] transition-colors hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text)]"
              aria-label={soundEnabled ? "Desactivar alarma" : "Activar alarma"}
              title={soundEnabled ? "Alarma activada" : "Alarma desactivada"}
            >
              <SpeakerIcon muted={!soundEnabled} />
            </button>
            <button
              type="button"
              onClick={toggleFullscreen}
              className="cursor-pointer rounded-lg p-2 text-[var(--color-muted)] transition-colors hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text)]"
              aria-label="Pantalla completa"
            >
              <FullscreenIcon />
            </button>
          </div>

          {mode === "temporizador" && (
            <>
              {/* Lista de temporizadores */}
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
                className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed border-[var(--color-border)] py-4 font-medium text-[var(--color-muted)] transition-colors hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
              >
                <PlusIcon />
                Añadir temporizador
              </button>
            </>
          )}

          {mode === "cronometro" && (
            <div className="space-y-6">
              <p className="font-mono text-5xl font-light text-[var(--color-text)] md:text-6xl">{cronoDisplay}</p>
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={toggleCronometro}
                  className="flex cursor-pointer items-center justify-center gap-2 rounded-2xl bg-[var(--color-accent)] px-8 py-4 font-semibold text-white transition-all hover:brightness-110"
                >
                  {crono.isRunning ? <PauseIcon /> : <PlayIcon />}
                  {crono.isRunning ? "Pausar" : "Iniciar"}
                </button>
                <button
                  type="button"
                  onClick={resetCronometro}
                  disabled={crono.isRunning}
                  className="cursor-pointer rounded-xl bg-[var(--color-surface-hover)] px-6 py-4 text-sm font-medium text-[var(--color-text)] transition-colors hover:bg-[var(--color-border)] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Reiniciar
                </button>
              </div>
            </div>
          )}
        </div>

        <p className="mt-4 text-center text-sm text-[var(--color-muted)]">
          Los temporizadores siguen en segundo plano al cambiar de página. Se detienen al cerrar la pestaña.
        </p>
      </div>
    </section>
  );
}
