"use client";

import { PauseIcon, PlayIcon } from "@/ui/icons";
import { TimerMediaControls } from "@/ui/TimerMediaControls";
import { usePomodoro } from "@/features/pomodoro/context/PomodoroContext";
import { POMODORO_PHASE_LABELS } from "@/features/pomodoro/lib/constants";
import { formatMmSs } from "@/lib/time";

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
  const mainLabel = alarmPlaying ? "Pausar alarma" : isRunning ? "Pausar" : "Iniciar";

  return (
    <div className="border-border bg-surface mx-auto max-w-md rounded-2xl border p-6 md:p-8">
      <p className="text-muted mb-4 text-sm">
        25 min trabajo, 5 min descanso corto, 15 min descanso largo (cada 4 pomodoros).
      </p>

      <TimerMediaControls soundEnabled={soundEnabled} onToggleSound={toggleSound} />

      <p className="text-accent mb-2 text-base font-semibold" aria-live="polite">
        {POMODORO_PHASE_LABELS[phase]}
        {pomodoroCount > 0 && phase === "work" && (
          <span className="text-muted ml-2 text-sm font-normal">
            ({pomodoroCount} pomodoro{pomodoroCount !== 1 ? "s" : ""})
          </span>
        )}
      </p>

      <p className="text-text mb-4 font-mono text-4xl font-light tracking-wide md:text-5xl" aria-live="polite">
        {formatMmSs(secondsLeft)}
      </p>

      <div className="bg-border mb-6 h-2 overflow-hidden rounded-full">
        <div
          className="bg-accent h-full rounded-full transition-[width] duration-300 ease-linear"
          role="progressbar"
          aria-valuenow={Math.round(progressPct)}
          aria-valuemin={0}
          aria-valuemax={100}
          style={{ width: `${progressPct}%` }}
        />
      </div>

      <button
        type="button"
        onClick={alarmPlaying ? stopAlarm : toggleTimer}
        disabled={secondsLeft <= 0 && !alarmPlaying}
        className="bg-accent mb-3 flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl py-4 font-semibold text-white transition-all hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {alarmPlaying || isRunning ? <PauseIcon /> : <PlayIcon />}
        {mainLabel}
      </button>

      <button
        type="button"
        onClick={resetPomodoro}
        className="text-muted hover:bg-surface-hover hover:text-text w-full cursor-pointer rounded-xl py-2 text-sm font-medium transition-colors"
      >
        Reiniciar
      </button>

      <p className="text-muted mt-4 text-center text-sm">
        El Pomodoro sigue en segundo plano al cambiar de página. Se detiene al cerrar la pestaña.
      </p>
    </div>
  );
}
