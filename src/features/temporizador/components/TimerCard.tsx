"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { PauseIcon, PlayIcon, TrashIcon } from "@/ui/icons";
import { useTimer } from "@/features/temporizador/context/TimerContext";
import { formatTimer } from "@/features/temporizador/lib/timerFormat";
import { cn } from "@/lib/cn";
import { parseMmSs } from "@/lib/time";

const PRESETS = [
  { sec: 30, label: "0:30" },
  { sec: 60, label: "1:00" },
  { sec: 300, label: "5:00" },
] as const;

function PresetRow({
  label,
  sign,
  timerId,
  secondsLeft,
  onAdjust,
}: {
  label: string;
  sign: 1 | -1;
  timerId: string;
  secondsLeft: number;
  onAdjust: (id: string, delta: number) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      <span className="w-full text-xs font-medium text-muted">{label}</span>
      {PRESETS.map(({ sec, label: presetLabel }) => (
        <button
          key={`${sign}-${sec}`}
          type="button"
          onClick={() => onAdjust(timerId, sign * sec)}
          disabled={sign < 0 && secondsLeft < sec}
          className="cursor-pointer rounded-full bg-surface-hover px-3 py-1.5 text-sm font-medium text-text transition-colors hover:bg-border disabled:cursor-not-allowed disabled:opacity-50"
        >
          {sign > 0 ? "+" : "−"}
          {presetLabel}
        </button>
      ))}
    </div>
  );
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

  const handleTimeInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const sec = parseMmSs(e.target.value);
      if (sec > 0 || e.target.value.includes(":")) setTimerSeconds(timerId, sec);
    },
    [timerId, setTimerSeconds],
  );

  useEffect(() => {
    if (!editingTime) return;
    const id = requestAnimationFrame(() => {
      inputRef.current?.focus();
      inputRef.current?.select();
    });
    return () => cancelAnimationFrame(id);
  }, [editingTime]);

  if (!timer) return null;

  const displayTime = formatTimer(timer.secondsLeft);
  const customSec = parseMmSs(customValue);
  const mainLabel = isAlarmForThis ? "Pausar alarma" : timer.isRunning ? "Pausar" : "Iniciar";

  return (
    <article
      className="flex flex-col gap-4 rounded-xl border border-border bg-surface p-4 transition-colors hover:border-accent/50 md:p-5"
      aria-label={`Temporizador ${timer.name}`}
    >
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={timer.name}
          onChange={(e) => updateTimerName(timerId, e.target.value)}
          className="min-w-0 flex-1 rounded-lg border border-border bg-bg px-3 py-2 text-base font-medium text-text placeholder:text-muted focus:border-accent focus:outline-none"
          placeholder="Nombre del temporizador"
          aria-label="Nombre del temporizador"
        />
        {timers.length > 1 && (
          <button
            type="button"
            onClick={() => removeTimer(timerId)}
            className="cursor-pointer rounded-lg p-2 text-sm font-medium text-muted transition-colors hover:bg-red-500/10 hover:text-red-400"
            aria-label="Quitar temporizador"
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
          className={cn(
            "w-full border-b-2 border-border bg-transparent font-mono text-4xl font-light text-text",
            "focus:border-accent focus:outline-none md:text-5xl",
          )}
          placeholder="M:SS"
          aria-label="Editar tiempo del temporizador"
        />
      ) : canEditTime ? (
        <button
          type="button"
          onClick={() => setEditingTime(true)}
          className="w-full cursor-pointer text-left"
          aria-label="Editar tiempo del temporizador"
        >
          <p className="font-mono text-4xl font-light text-text md:text-5xl">{displayTime}</p>
        </button>
      ) : (
        <p className="font-mono text-4xl font-light text-text md:text-5xl">{displayTime}</p>
      )}

      <PresetRow label="Sumar:" sign={1} timerId={timerId} secondsLeft={timer.secondsLeft} onAdjust={addTimerTime} />
      <PresetRow label="Restar:" sign={-1} timerId={timerId} secondsLeft={timer.secondsLeft} onAdjust={addTimerTime} />

      <div className="flex flex-wrap items-end gap-2">
        <input
          type="text"
          value={customValue}
          onChange={(e) => setCustomValue(e.target.value)}
          placeholder="M:SS o min"
          className="min-w-20 flex-1 rounded-lg border border-border bg-bg px-3 py-2 font-mono text-sm text-text placeholder:text-muted focus:border-accent focus:outline-none"
        />
        <button
          type="button"
          onClick={() => customSec > 0 && addTimerTime(timerId, customSec)}
          disabled={!customSec}
          className="cursor-pointer rounded-lg bg-accent/20 px-3 py-2 text-sm font-medium text-accent hover:bg-accent/30 disabled:cursor-not-allowed disabled:opacity-50"
        >
          +
        </button>
        <button
          type="button"
          onClick={() => customSec > 0 && timer.secondsLeft >= customSec && addTimerTime(timerId, -customSec)}
          disabled={!customSec || timer.secondsLeft < customSec}
          className="cursor-pointer rounded-lg bg-accent/20 px-3 py-2 text-sm font-medium text-accent hover:bg-accent/30 disabled:cursor-not-allowed disabled:opacity-50"
        >
          −
        </button>
      </div>

      <button
        type="button"
        onClick={isAlarmForThis ? stopAlarm : () => toggleTimer(timerId)}
        disabled={!isAlarmForThis && !timer.isRunning && timer.secondsLeft <= 0}
        className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-accent py-3 font-semibold text-white transition-all hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {timer.isRunning || isAlarmForThis ? <PauseIcon /> : <PlayIcon />}
        {mainLabel}
      </button>

      {!timer.isRunning && timer.secondsLeft <= 0 && (
        <button
          type="button"
          onClick={() => resetTimer(timerId)}
          className="w-full cursor-pointer rounded-lg py-2 text-sm font-medium text-muted transition-colors hover:bg-surface-hover hover:text-text"
        >
          Reiniciar
        </button>
      )}
    </article>
  );
}
