"use client";

import { useTimer } from "@/features/timer/context/TimerContext";
import { formatTimer } from "@/features/timer/lib/timerFormat";
import { useCallback, useEffect, useRef, useState } from "react";

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

function TrashIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      <line x1="10" y1="11" x2="10" y2="17" />
      <line x1="14" y1="11" x2="14" y2="17" />
    </svg>
  );
}

function parseCustomSeconds(v: string): number {
  const trimmed = v.trim();
  if (!trimmed) return 0;
  const parts = trimmed.split(":").map((p) => parseInt(p, 10) || 0);
  if (parts.length >= 2) {
    const [m, s] = parts;
    return Math.max(0, m * 60 + Math.min(59, s));
  }
  if (parts.length === 1) return Math.max(0, parts[0] * 60);
  return 0;
}

type TimerCardProps = { timerId: string };

export function TimerCard({ timerId }: TimerCardProps) {
  const {
    timers,
    updateTimerName,
    setTimerSeconds,
    addTimerTime,
    toggleTimer,
    resetTimer,
    removeTimer,
    alarmPlaying,
    alarmTimerId,
    stopAlarm,
  } = useTimer();

  const timer = timers.find((t) => t.id === timerId);
  const [editingTime, setEditingTime] = useState(false);
  const [customValue, setCustomValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const isAlarmForThis = Boolean(timer && alarmPlaying && alarmTimerId === timerId);
  const canEditTime = Boolean(timer && !timer.isRunning && !isAlarmForThis);

  const handleDisplayClick = useCallback(() => {
    if (!canEditTime) return;
    setEditingTime(true);
  }, [canEditTime]);

  const handleTimeInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const v = e.target.value.trim();
      if (!v) return;
      const parts = v.split(":").map((p) => parseInt(p, 10) || 0);
      if (parts.length >= 2) {
        const [m, s] = parts;
        setTimerSeconds(timerId, Math.max(0, m * 60 + Math.min(59, s)));
      } else if (parts.length === 1) {
        setTimerSeconds(timerId, Math.max(0, parts[0] * 60));
      }
    },
    [timerId, setTimerSeconds],
  );

  const handleRemove = useCallback(() => {
    if (timers.length <= 1) return;
    removeTimer(timerId);
  }, [timerId, removeTimer, timers.length]);

  useEffect(() => {
    if (!editingTime) return;
    const id = requestAnimationFrame(() => {
      inputRef.current?.focus();
      inputRef.current?.select();
    });
    return () => cancelAnimationFrame(id);
  }, [editingTime]);

  if (!timer) return null;

  const mainButtonLabel = isAlarmForThis ? "Pausar alarma" : timer.isRunning ? "Pausar" : "Iniciar";

  const displayTime = formatTimer(timer.secondsLeft);

  return (
    <article
      className="flex flex-col gap-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 transition-colors hover:border-[var(--color-accent)]/50 md:p-5"
      aria-label={`Temporizador ${timer.name}`}
    >
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={timer.name}
          onChange={(e) => updateTimerName(timerId, e.target.value)}
          className="min-w-0 flex-1 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2 text-base font-medium text-[var(--color-text)] placeholder:text-[var(--color-muted)] focus:border-[var(--color-accent)] focus:outline-none"
          placeholder="Nombre del temporizador"
          aria-label="Nombre del temporizador"
        />
        {timers.length > 1 && (
          <button
            type="button"
            onClick={handleRemove}
            className="cursor-pointer rounded-lg p-2 text-[var(--color-muted)] transition-colors hover:bg-red-500/10 hover:text-red-400"
            aria-label="Quitar temporizador"
            title="Quitar temporizador"
          >
            <TrashIcon />
          </button>
        )}
      </div>

      {editingTime && canEditTime ? (
        <input
          ref={inputRef}
          type="text"
          defaultValue={displayTime}
          onChange={handleTimeInput}
          onBlur={() => setEditingTime(false)}
          onKeyDown={(e) => e.key === "Enter" && (e.currentTarget.blur(), setEditingTime(false))}
          className="w-full border-b-2 border-[var(--color-border)] bg-transparent font-mono text-4xl font-light text-[var(--color-text)] focus:border-[var(--color-accent)] focus:outline-none md:text-5xl"
          placeholder="M:SS"
          aria-label="Editar tiempo del temporizador"
        />
      ) : canEditTime ? (
        <button
          type="button"
          onClick={handleDisplayClick}
          className="w-full cursor-pointer text-left"
          aria-label="Editar tiempo del temporizador"
        >
          <p className="font-mono text-4xl font-light text-[var(--color-text)] md:text-5xl">{displayTime}</p>
        </button>
      ) : (
        <p className="font-mono text-4xl font-light text-[var(--color-text)] md:text-5xl">{displayTime}</p>
      )}

      <div className="flex flex-wrap gap-2">
        <span className="w-full text-xs font-medium text-[var(--color-muted)]">Sumar:</span>
        {[30, 60, 5 * 60].map((sec) => (
          <button
            key={sec}
            type="button"
            onClick={() => addTimerTime(timerId, sec)}
            className="cursor-pointer rounded-full bg-[var(--color-surface-hover)] px-3 py-1.5 text-sm font-medium text-[var(--color-text)] transition-colors hover:bg-[var(--color-border)]"
          >
            +{sec === 30 ? "0:30" : sec === 60 ? "1:00" : "5:00"}
          </button>
        ))}
        <span className="mt-1 w-full text-xs font-medium text-[var(--color-muted)]">Restar:</span>
        {[30, 60, 5 * 60].map((sec) => (
          <button
            key={sec}
            type="button"
            onClick={() => addTimerTime(timerId, -sec)}
            disabled={timer.secondsLeft < sec}
            className="cursor-pointer rounded-full bg-[var(--color-surface-hover)] px-3 py-1.5 text-sm font-medium text-[var(--color-text)] transition-colors hover:bg-[var(--color-border)] disabled:cursor-not-allowed disabled:opacity-50"
          >
            −{sec === 30 ? "0:30" : sec === 60 ? "1:00" : "5:00"}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap items-end gap-2">
        <input
          type="text"
          value={customValue}
          onChange={(e) => setCustomValue(e.target.value)}
          placeholder="M:SS o min"
          className="min-w-[5rem] flex-1 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2 font-mono text-sm text-[var(--color-text)] placeholder:text-[var(--color-muted)]/50 focus:border-[var(--color-accent)] focus:outline-none"
        />
        <button
          type="button"
          onClick={() => parseCustomSeconds(customValue) > 0 && addTimerTime(timerId, parseCustomSeconds(customValue))}
          disabled={!parseCustomSeconds(customValue)}
          className="cursor-pointer rounded-lg bg-[var(--color-accent)]/20 px-3 py-2 text-sm font-medium text-[var(--color-accent)] hover:bg-[var(--color-accent)]/30 disabled:cursor-not-allowed disabled:opacity-50"
        >
          +
        </button>
        <button
          type="button"
          onClick={() => {
            const s = parseCustomSeconds(customValue);
            if (s > 0 && timer.secondsLeft >= s) addTimerTime(timerId, -s);
          }}
          disabled={!parseCustomSeconds(customValue) || timer.secondsLeft < parseCustomSeconds(customValue)}
          className="cursor-pointer rounded-lg bg-[var(--color-accent)]/20 px-3 py-2 text-sm font-medium text-[var(--color-accent)] hover:bg-[var(--color-accent)]/30 disabled:cursor-not-allowed disabled:opacity-50"
        >
          −
        </button>
      </div>

      <button
        type="button"
        onClick={isAlarmForThis ? stopAlarm : () => toggleTimer(timerId)}
        disabled={!isAlarmForThis && !timer.isRunning && timer.secondsLeft <= 0}
        className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[var(--color-accent)] py-3 font-semibold text-white transition-all hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {timer.isRunning || isAlarmForThis ? <PauseIcon /> : <PlayIcon />}
        {mainButtonLabel}
      </button>

      {!timer.isRunning && timer.secondsLeft <= 0 && (
        <button
          type="button"
          onClick={() => resetTimer(timerId)}
          className="w-full cursor-pointer rounded-lg py-2 text-sm font-medium text-[var(--color-muted)] transition-colors hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text)]"
        >
          Reiniciar
        </button>
      )}
    </article>
  );
}
