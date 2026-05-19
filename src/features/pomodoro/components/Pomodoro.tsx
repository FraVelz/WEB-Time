"use client";

import { usePomodoro } from "@/features/pomodoro/context/PomodoroContext";

function pad(n: number): string {
  return String(Math.floor(n)).padStart(2, "0");
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${pad(m)}:${pad(s)}`;
}

const PHASE_LABELS: Record<"work" | "shortBreak" | "longBreak", string> = {
  work: "Trabajo",
  shortBreak: "Descanso corto",
  longBreak: "Descanso largo",
};

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

function SpeakerIcon({ muted }: { muted?: boolean }) {
  return (
    <svg
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
        <>
          <line x1="23" y1="9" x2="17" y2="15" />
          <line x1="17" y1="9" x2="23" y2="15" />
        </>
      ) : (
        <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
      )}
    </svg>
  );
}

function FullscreenIcon() {
  return (
    <svg
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

export function Pomodoro() {
  const {
    phase,
    secondsLeft,
    totalSeconds,
    isRunning,
    pomodoroCount,
    soundEnabled,
    alarmPlaying,
    toggleTimer,
    toggleSound,
    stopAlarm,
    resetPomodoro,
  } = usePomodoro();

  const progressPct = totalSeconds ? ((totalSeconds - secondsLeft) / totalSeconds) * 100 : 0;

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
  };

  return (
    <div className="mx-auto max-w-md rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 md:p-8">
      <p className="mb-4 text-sm text-[var(--color-muted)]">
        25 min trabajo, 5 min descanso corto, 15 min descanso largo (cada 4 pomodoros).
      </p>

      {/* Controles: altavoz, pantalla completa */}
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

      <p className="mb-2 text-base font-semibold text-[var(--color-accent)]" aria-live="polite">
        {PHASE_LABELS[phase]}
        {pomodoroCount > 0 && phase === "work" && (
          <span className="ml-2 text-sm font-normal text-[var(--color-muted)]">
            ({pomodoroCount} pomodoro{pomodoroCount !== 1 ? "s" : ""})
          </span>
        )}
      </p>

      <div className="mb-4">
        <span
          className="font-mono text-4xl font-light tracking-wide text-[var(--color-text)] md:text-5xl"
          aria-live="polite"
        >
          {formatTime(secondsLeft)}
        </span>
      </div>

      <div className="mb-6 h-2 overflow-hidden rounded-full bg-[var(--color-border)]">
        <div
          className="h-full rounded-full bg-[var(--color-accent)] transition-[width] duration-300 ease-linear"
          role="progressbar"
          aria-valuenow={Math.round(progressPct)}
          aria-valuemin={0}
          aria-valuemax={100}
          style={{ width: `${progressPct}%` }}
        />
      </div>

      {/* Botón principal: Iniciar / Pausar / Pausar alarma */}
      <button
        type="button"
        onClick={alarmPlaying ? stopAlarm : toggleTimer}
        disabled={secondsLeft <= 0 && !alarmPlaying}
        className="mb-3 flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl bg-[var(--color-accent)] py-4 font-semibold text-white transition-all hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {alarmPlaying ? (
          <>
            <PauseIcon />
            Pausar alarma
          </>
        ) : isRunning ? (
          <>
            <PauseIcon />
            Pausar
          </>
        ) : (
          <>
            <PlayIcon />
            Iniciar
          </>
        )}
      </button>

      <button
        type="button"
        onClick={resetPomodoro}
        className="w-full cursor-pointer rounded-xl py-2 text-sm font-medium text-[var(--color-muted)] transition-colors hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text)]"
      >
        Reiniciar
      </button>

      <p className="mt-4 text-center text-sm text-[var(--color-muted)]">
        El Pomodoro sigue en segundo plano al cambiar de página. Se detiene al cerrar la pestaña.
      </p>
    </div>
  );
}
