"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { PauseIcon, PlayIcon, TrashIcon } from "@/ui/icons";
import { useTimer } from "@/features/temporizador/context/TimerContext";
import { cn } from "@/lib/cn";
import { formatMmSs as formatTimer, parseMmSs } from "@/lib/time";

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
      <span className="text-muted w-full text-xs font-medium">{label}</span>
      {PRESETS.map(({ sec, label: presetLabel }) => (
        <button
          key={`${sign}-${sec}`}
          type="button"
          onClick={() => onAdjust(timerId, sign * sec)}
          disabled={sign < 0 && secondsLeft < sec}
          className="bg-surface-hover text-text hover:bg-border cursor-pointer rounded-full px-3 py-1.5 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50"
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
      className="border-border bg-surface hover:border-accent/50 flex flex-col gap-4 rounded-xl border p-4 transition-colors md:p-5"
      aria-label={`Temporizador ${timer.name}`}
    >
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={timer.name}
          onChange={(e) => updateTimerName(timerId, e.target.value)}
          className="border-border bg-bg text-text placeholder:text-muted focus:border-accent min-w-0 flex-1 rounded-lg border px-3 py-2 text-base font-medium focus:outline-none"
          placeholder="Nombre del temporizador"
          aria-label="Nombre del temporizador"
        />
        {timers.length > 1 && (
          <button
            type="button"
            onClick={() => removeTimer(timerId)}
            className="text-muted cursor-pointer rounded-lg p-2 text-sm font-medium transition-colors hover:bg-red-500/10 hover:text-red-400"
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
            "border-border text-text w-full border-b-2 bg-transparent font-mono text-4xl font-light",
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
          <p className="text-text font-mono text-4xl font-light md:text-5xl">{displayTime}</p>
        </button>
      ) : (
        <p className="text-text font-mono text-4xl font-light md:text-5xl">{displayTime}</p>
      )}

      <PresetRow label="Sumar:" sign={1} timerId={timerId} secondsLeft={timer.secondsLeft} onAdjust={addTimerTime} />
      <PresetRow label="Restar:" sign={-1} timerId={timerId} secondsLeft={timer.secondsLeft} onAdjust={addTimerTime} />

      <div className="flex flex-wrap items-end gap-2">
        <input
          type="text"
          value={customValue}
          onChange={(e) => setCustomValue(e.target.value)}
          placeholder="M:SS o min"
          className="border-border bg-bg text-text placeholder:text-muted focus:border-accent min-w-20 flex-1 rounded-lg border px-3 py-2 font-mono text-sm focus:outline-none"
        />
        <button
          type="button"
          onClick={() => customSec > 0 && addTimerTime(timerId, customSec)}
          disabled={!customSec}
          className="bg-accent/20 text-accent hover:bg-accent/30 cursor-pointer rounded-lg px-3 py-2 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-50"
        >
          +
        </button>
        <button
          type="button"
          onClick={() => customSec > 0 && timer.secondsLeft >= customSec && addTimerTime(timerId, -customSec)}
          disabled={!customSec || timer.secondsLeft < customSec}
          className="bg-accent/20 text-accent hover:bg-accent/30 cursor-pointer rounded-lg px-3 py-2 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-50"
        >
          −
        </button>
      </div>

      <button
        type="button"
        onClick={isAlarmForThis ? stopAlarm : () => toggleTimer(timerId)}
        disabled={!isAlarmForThis && !timer.isRunning && timer.secondsLeft <= 0}
        className="bg-accent flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl py-3 font-semibold text-white transition-all hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {timer.isRunning || isAlarmForThis ? <PauseIcon /> : <PlayIcon />}
        {mainLabel}
      </button>

      {!timer.isRunning && timer.secondsLeft <= 0 && (
        <button
          type="button"
          onClick={() => resetTimer(timerId)}
          className="text-muted hover:bg-surface-hover hover:text-text w-full cursor-pointer rounded-lg py-2 text-sm font-medium transition-colors"
        >
          Reiniciar
        </button>
      )}
    </article>
  );
}
