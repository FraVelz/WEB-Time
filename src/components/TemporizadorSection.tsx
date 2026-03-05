"use client";

import { useState, useEffect, useCallback } from "react";

type Timer = {
  id: string;
  label: string;
  totalSeconds: number;
  secondsLeft: number;
  isRunning: boolean;
};

function pad(n: number): string {
  return String(Math.floor(n)).padStart(2, "0");
}

function formatTime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${pad(h)}:${pad(m)}:${pad(s)}`;
  return `${pad(m)}:${pad(s)}`;
}

let nextId = 1;
function generateId() {
  return `timer-${nextId++}`;
}

export function TemporizadorSection() {
  const [timers, setTimers] = useState<Timer[]>([]);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(5);

  const addTimer = useCallback(() => {
    const total = hours * 3600 + minutes * 60;
    if (total <= 0) return;
    setTimers((prev) => [
      ...prev,
      {
        id: generateId(),
        label: `${hours}h ${minutes}min`,
        totalSeconds: total,
        secondsLeft: total,
        isRunning: false,
      },
    ]);
  }, [hours, minutes]);

  const removeTimer = useCallback((id: string) => {
    setTimers((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toggleTimer = useCallback((id: string) => {
    setTimers((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, isRunning: !t.isRunning } : t
      )
    );
  }, []);

  const resetTimer = useCallback((id: string) => {
    setTimers((prev) =>
      prev.map((t) =>
        t.id === id
          ? { ...t, secondsLeft: t.totalSeconds, isRunning: false }
          : t
      )
    );
  }, []);

  useEffect(() => {
    const running = timers.filter((t) => t.isRunning);
    if (running.length === 0) return;
    const id = setInterval(() => {
      setTimers((prev) =>
        prev.map((t) => {
          if (!t.isRunning || t.secondsLeft <= 0) return t;
          const next = t.secondsLeft - 1;
          return { ...t, secondsLeft: next, isRunning: next > 0 };
        })
      );
    }, 1000);
    return () => clearInterval(id);
  }, [timers]);

  return (
    <section
      id="temporizador"
      className="scroll-mt-20 py-12 md:py-16 border-t border-[var(--color-border)]"
      aria-labelledby="temporizador-heading"
    >
      <div className="mx-auto max-w-5xl px-4 md:px-6">
        <h2
          id="temporizador-heading"
          className="text-2xl font-semibold text-[var(--color-text)] mb-2"
        >
          Temporizador
        </h2>
        <p className="text-[var(--color-muted)] text-sm mb-8">
          Añade uno o varios temporizadores indicando horas y minutos.
        </p>

        <div className="flex flex-wrap items-end gap-4 p-4 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] mb-8">
          <label className="flex flex-col gap-1">
            <span className="text-xs font-medium text-[var(--color-muted)]">Horas</span>
            <input
              type="number"
              min={0}
              max={99}
              value={hours}
              onChange={(e) => setHours(Math.max(0, parseInt(e.target.value, 10) || 0))}
              className="w-20 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2 font-mono text-[var(--color-text)]"
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-xs font-medium text-[var(--color-muted)]">Minutos</span>
            <input
              type="number"
              min={0}
              max={59}
              value={minutes}
              onChange={(e) => setMinutes(Math.max(0, Math.min(59, parseInt(e.target.value, 10) || 0)))}
              className="w-20 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2 font-mono text-[var(--color-text)]"
            />
          </label>
          <button
            type="button"
            onClick={addTimer}
            className="rounded-lg bg-[var(--color-accent)] px-4 py-2 text-sm font-semibold text-white hover:brightness-110 transition"
          >
            Añadir temporizador
          </button>
        </div>

        <div className="space-y-4">
          {timers.length === 0 ? (
            <p className="text-[var(--color-muted)] text-sm">
              No hay temporizadores. Usa el formulario de arriba para añadir uno.
            </p>
          ) : (
            timers.map((t) => (
              <div
                key={t.id}
                className="flex flex-wrap items-center gap-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4"
              >
                <span className="font-mono text-2xl text-[var(--color-accent)] min-w-[6rem]">
                  {formatTime(t.secondsLeft)}
                </span>
                <span className="text-sm text-[var(--color-muted)]">{t.label}</span>
                <div className="ml-auto flex gap-2">
                  <button
                    type="button"
                    onClick={() => toggleTimer(t.id)}
                    disabled={t.secondsLeft <= 0}
                    className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-hover)] px-3 py-1.5 text-sm font-medium text-[var(--color-text)] hover:bg-[var(--color-border)] disabled:opacity-50"
                  >
                    {t.isRunning ? "Pausar" : "Iniciar"}
                  </button>
                  <button
                    type="button"
                    onClick={() => resetTimer(t.id)}
                    className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-hover)] px-3 py-1.5 text-sm font-medium text-[var(--color-text)] hover:bg-[var(--color-border)]"
                  >
                    Reiniciar
                  </button>
                  <button
                    type="button"
                    onClick={() => removeTimer(t.id)}
                    className="rounded-lg border border-red-500/50 px-3 py-1.5 text-sm font-medium text-red-400 hover:bg-red-500/10"
                  >
                    Quitar
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
