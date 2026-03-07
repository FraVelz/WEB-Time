"use client";

import { useTimer } from "@/context/TimerContext";
import { formatTimer } from "@/lib/timerFormat";
import { useCallback, useRef, useState } from "react";

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
    <svg className={className} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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

  if (!timer) return null;

  const isAlarmForThis = alarmPlaying && alarmTimerId === timerId;
  const canEditTime = !timer.isRunning && !isAlarmForThis;

  const handleDisplayClick = useCallback(() => {
    if (!canEditTime) return;
    setEditingTime(true);
    setTimeout(() => inputRef.current?.select(), 0);
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
    [timerId, setTimerSeconds]
  );

  const handleRemove = useCallback(() => {
    if (timers.length <= 1) return;
    removeTimer(timerId);
  }, [timerId, removeTimer, timers.length]);

  const mainButtonLabel = isAlarmForThis
    ? "Pausar alarma"
    : timer.isRunning
      ? "Pausar"
      : "Iniciar";

  const displayTime = formatTimer(timer.secondsLeft);

  return (
    <article
      className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 md:p-5 flex flex-col gap-4 transition-colors hover:border-[var(--color-accent)]/50"
      aria-label={`Temporizador ${timer.name}`}
    >
      {/* Nombre editable */}
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={timer.name}
          onChange={(e) => updateTimerName(timerId, e.target.value)}
          className="flex-1 min-w-0 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2 text-base font-medium text-[var(--color-text)] placeholder:text-[var(--color-muted)] focus:outline-none focus:border-[var(--color-accent)]"
          placeholder="Nombre del temporizador"
          aria-label="Nombre del temporizador"
        />
        {timers.length > 1 && (
          <button
            type="button"
            onClick={handleRemove}
            className="rounded-lg p-2 text-[var(--color-muted)] hover:bg-red-500/10 hover:text-red-400 transition-colors"
            aria-label="Quitar temporizador"
            title="Quitar temporizador"
          >
            <TrashIcon />
          </button>
        )}
      </div>

      {/* Tiempo */}
      <div
        className={canEditTime ? "cursor-text" : ""}
        onClick={handleDisplayClick}
      >
        {editingTime && canEditTime ? (
          <input
            ref={inputRef}
            type="text"
            defaultValue={displayTime}
            onChange={handleTimeInput}
            onBlur={() => setEditingTime(false)}
            onKeyDown={(e) => e.key === "Enter" && (e.currentTarget.blur(), setEditingTime(false))}
            className="w-full bg-transparent text-4xl md:text-5xl font-mono font-light text-[var(--color-text)] border-b-2 border-[var(--color-border)] focus:outline-none focus:border-[var(--color-accent)]"
            placeholder="M:SS"
            autoFocus
          />
        ) : (
          <p className="text-4xl md:text-5xl font-mono font-light text-[var(--color-text)]">
            {displayTime}
          </p>
        )}
      </div>

      {/* Sumar / Restar */}
      <div className="flex flex-wrap gap-2">
        <span className="text-xs font-medium text-[var(--color-muted)] w-full">Sumar:</span>
        {[30, 60, 5 * 60].map((sec) => (
          <button
            key={sec}
            type="button"
            onClick={() => addTimerTime(timerId, sec)}
            className="rounded-full px-3 py-1.5 text-sm font-medium bg-[var(--color-surface-hover)] text-[var(--color-text)] hover:bg-[var(--color-border)] transition-colors"
          >
            +{sec === 30 ? "0:30" : sec === 60 ? "1:00" : "5:00"}
          </button>
        ))}
        <span className="text-xs font-medium text-[var(--color-muted)] w-full mt-1">Restar:</span>
        {[30, 60, 5 * 60].map((sec) => (
          <button
            key={sec}
            type="button"
            onClick={() => addTimerTime(timerId, -sec)}
            disabled={timer.secondsLeft < sec}
            className="rounded-full px-3 py-1.5 text-sm font-medium bg-[var(--color-surface-hover)] text-[var(--color-text)] hover:bg-[var(--color-border)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            −{sec === 30 ? "0:30" : sec === 60 ? "1:00" : "5:00"}
          </button>
        ))}
      </div>

      {/* Personalizado */}
      <div className="flex flex-wrap items-end gap-2">
        <input
          type="text"
          value={customValue}
          onChange={(e) => setCustomValue(e.target.value)}
          placeholder="M:SS o min"
          className="flex-1 min-w-[5rem] rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2 font-mono text-sm text-[var(--color-text)] placeholder:text-[var(--color-muted)]/50 focus:outline-none focus:border-[var(--color-accent)]"
        />
        <button
          type="button"
          onClick={() => parseCustomSeconds(customValue) > 0 && addTimerTime(timerId, parseCustomSeconds(customValue))}
          disabled={!parseCustomSeconds(customValue)}
          className="rounded-lg px-3 py-2 text-sm font-medium bg-[var(--color-accent)]/20 text-[var(--color-accent)] hover:bg-[var(--color-accent)]/30 disabled:opacity-50 disabled:cursor-not-allowed"
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
          className="rounded-lg px-3 py-2 text-sm font-medium bg-[var(--color-accent)]/20 text-[var(--color-accent)] hover:bg-[var(--color-accent)]/30 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          −
        </button>
      </div>

      {/* Iniciar / Pausar / Pausar alarma */}
      <button
        type="button"
        onClick={isAlarmForThis ? stopAlarm : () => toggleTimer(timerId)}
        disabled={!isAlarmForThis && !timer.isRunning && timer.secondsLeft <= 0}
        className="w-full rounded-xl bg-[var(--color-accent)] py-3 flex items-center justify-center gap-2 text-white font-semibold hover:brightness-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {timer.isRunning || isAlarmForThis ? <PauseIcon /> : <PlayIcon />}
        {mainButtonLabel}
      </button>

      {/* Reiniciar */}
      {!timer.isRunning && timer.secondsLeft <= 0 && (
        <button
          type="button"
          onClick={() => resetTimer(timerId)}
          className="w-full rounded-lg py-2 text-sm font-medium text-[var(--color-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface-hover)] transition-colors"
        >
          Reiniciar
        </button>
      )}
    </article>
  );
}
