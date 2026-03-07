"use client";

import { useTimer } from "@/context/TimerContext";
import { useCallback, useRef, useState } from "react";

function pad(n: number): string {
  return String(Math.floor(n)).padStart(2, "0");
}

function formatTimer(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${pad(m)}:${pad(s)}`;
}

function formatCronometro(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${pad(h)}:${pad(m)}:${pad(s)}`;
  return `${pad(m)}:${pad(s)}`;
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function ClockIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
    <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
    <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
    </svg>
  );
}

export function TemporizadorSection() {
  const {
    mode,
    secondsLeft,
    secondsElapsed,
    isRunning,
    soundEnabled,
    alarmPlaying,
    setMode,
    setSecondsLeft,
    addTime,
    toggleSound,
    toggleTimer,
    stopAlarm,
    resetTimer,
    resetCronometro,
  } = useTimer();

  const [editing, setEditing] = useState(false);
  const [customValue, setCustomValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const displayValue =
    mode === "temporizador" ? formatTimer(secondsLeft) : formatCronometro(secondsElapsed);

  const handleDisplayClick = useCallback(() => {
    if (mode !== "temporizador" || isRunning) return;
    setEditing(true);
    setTimeout(() => inputRef.current?.select(), 0);
  }, [mode, isRunning]);

  const handleTimeInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const v = e.target.value.trim();
      if (!v) return;
      const parts = v.split(":").map((p) => parseInt(p, 10) || 0);
      if (parts.length >= 2) {
        const [m, s] = parts;
        setSecondsLeft(Math.max(0, m * 60 + Math.min(59, s)));
      } else if (parts.length === 1) {
        const m = parts[0];
        setSecondsLeft(Math.max(0, m * 60));
      }
    },
    [setSecondsLeft]
  );

  const handleTimeBlur = useCallback(() => {
    setEditing(false);
  }, []);

  const handleTimeKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        setEditing(false);
        inputRef.current?.blur();
      }
    },
    []
  );

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
  }, []);

  const canEdit = mode === "temporizador" && !isRunning;

  const parseCustomSeconds = useCallback((v: string): number => {
    const trimmed = v.trim();
    if (!trimmed) return 0;
    const parts = trimmed.split(":").map((p) => parseInt(p, 10) || 0);
    if (parts.length >= 2) {
      const [m, s] = parts;
      return Math.max(0, m * 60 + Math.min(59, s));
    }
    if (parts.length === 1) return Math.max(0, parts[0] * 60);
    return 0;
  }, []);

  const handleCustomAdd = useCallback(() => {
    const sec = parseCustomSeconds(customValue);
    if (sec > 0) addTime(sec);
  }, [customValue, parseCustomSeconds, addTime]);

  const handleCustomSubtract = useCallback(() => {
    const sec = parseCustomSeconds(customValue);
    if (sec > 0) addTime(-sec);
  }, [customValue, parseCustomSeconds, addTime]);

  return (
    <section
      id="temporizador"
      className="scroll-mt-20 py-12 md:py-16 border-t border-[var(--color-border)]"
      aria-labelledby="temporizador-heading"
    >
      <div className="mx-auto max-w-2xl px-4 md:px-6">
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 md:p-8">
          {/* Tabs */}
          <div className="flex gap-2 mb-6">
            <button
              type="button"
              onClick={() => setMode("temporizador")}
              className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors ${
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
              className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors ${
                mode === "cronometro"
                  ? "bg-[var(--color-accent)]/20 text-[var(--color-accent)]"
                  : "text-[var(--color-muted)] hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text)]"
              }`}
            >
              <ClockIcon />
              Cronómetro
            </button>
          </div>

          {/* Top controls: speaker, fullscreen */}
          <div className="flex justify-end gap-2 mb-4">
            <button
              type="button"
              onClick={toggleSound}
              className="rounded-lg p-2 text-[var(--color-muted)] hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text)] transition-colors"
              aria-label={soundEnabled ? "Desactivar alarma" : "Activar alarma"}
              title={soundEnabled ? "Alarma activada" : "Alarma desactivada"}
            >
              <SpeakerIcon muted={!soundEnabled} />
            </button>
            <button
              type="button"
              onClick={toggleFullscreen}
              className="rounded-lg p-2 text-[var(--color-muted)] hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text)] transition-colors"
              aria-label="Pantalla completa"
            >
              <FullscreenIcon />
            </button>
          </div>

          {/* Display */}
          <div
            className={`mb-6 ${canEdit ? "cursor-text" : ""}`}
            onClick={handleDisplayClick}
          >
            {editing && canEdit ? (
              <input
                ref={inputRef}
                type="text"
                defaultValue={displayValue}
                onChange={handleTimeInput}
                onBlur={handleTimeBlur}
                onKeyDown={handleTimeKeyDown}
                className="w-full bg-transparent text-5xl md:text-6xl font-mono font-light text-[var(--color-text)] border-b-2 border-[var(--color-border)] focus:outline-none focus:border-[var(--color-accent)]"
                placeholder="M:SS"
                autoFocus
              />
            ) : (
              <p className="text-5xl md:text-6xl font-mono font-light text-[var(--color-text)]">
                {displayValue}
              </p>
            )}
          </div>

          {/* Quick add / subtract (solo temporizador) */}
          {mode === "temporizador" && (
            <>
              <div className="flex flex-wrap gap-2 mb-3">
                <span className="text-xs font-medium text-[var(--color-muted)] w-full">Sumar:</span>
                <button
                  type="button"
                  onClick={() => addTime(30)}
                  className="rounded-full px-4 py-2 text-sm font-medium bg-[var(--color-surface-hover)] text-[var(--color-text)] hover:bg-[var(--color-border)] transition-colors"
                >
                  +0:30
                </button>
                <button
                  type="button"
                  onClick={() => addTime(60)}
                  className="rounded-full px-4 py-2 text-sm font-medium bg-[var(--color-surface-hover)] text-[var(--color-text)] hover:bg-[var(--color-border)] transition-colors"
                >
                  +1:00
                </button>
                <button
                  type="button"
                  onClick={() => addTime(5 * 60)}
                  className="rounded-full px-4 py-2 text-sm font-medium bg-[var(--color-surface-hover)] text-[var(--color-text)] hover:bg-[var(--color-border)] transition-colors"
                >
                  +5:00
                </button>
              </div>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="text-xs font-medium text-[var(--color-muted)] w-full">Restar:</span>
                <button
                  type="button"
                  onClick={() => addTime(-30)}
                  disabled={secondsLeft < 30}
                  className="rounded-full px-4 py-2 text-sm font-medium bg-[var(--color-surface-hover)] text-[var(--color-text)] hover:bg-[var(--color-border)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  −0:30
                </button>
                <button
                  type="button"
                  onClick={() => addTime(-60)}
                  disabled={secondsLeft < 60}
                  className="rounded-full px-4 py-2 text-sm font-medium bg-[var(--color-surface-hover)] text-[var(--color-text)] hover:bg-[var(--color-border)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  −1:00
                </button>
                <button
                  type="button"
                  onClick={() => addTime(-5 * 60)}
                  disabled={secondsLeft < 5 * 60}
                  className="rounded-full px-4 py-2 text-sm font-medium bg-[var(--color-surface-hover)] text-[var(--color-text)] hover:bg-[var(--color-border)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  −5:00
                </button>
              </div>
              {/* Números personalizados */}
              <div className="flex flex-wrap items-end gap-2 mb-6 p-3 rounded-xl bg-[var(--color-surface-hover)]/50 border border-[var(--color-border)]/50">
                <span className="text-xs font-medium text-[var(--color-muted)] w-full">Personalizado (M:SS o minutos):</span>
                <input
                  type="text"
                  value={customValue}
                  onChange={(e) => setCustomValue(e.target.value)}
                  placeholder="ej. 2:30 o 15"
                  className="flex-1 min-w-[6rem] rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2 font-mono text-sm text-[var(--color-text)] placeholder:text-[var(--color-muted)]/50 focus:outline-none focus:border-[var(--color-accent)]"
                />
                <button
                  type="button"
                  onClick={handleCustomAdd}
                  disabled={!parseCustomSeconds(customValue)}
                  className="rounded-lg px-3 py-2 text-sm font-medium bg-[var(--color-accent)]/20 text-[var(--color-accent)] hover:bg-[var(--color-accent)]/30 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  +
                </button>
                <button
                  type="button"
                  onClick={handleCustomSubtract}
                  disabled={!parseCustomSeconds(customValue) || secondsLeft < parseCustomSeconds(customValue)}
                  className="rounded-lg px-3 py-2 text-sm font-medium bg-[var(--color-accent)]/20 text-[var(--color-accent)] hover:bg-[var(--color-accent)]/30 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  −
                </button>
              </div>
            </>
          )}

          {/* Cronómetro: reset */}
          {mode === "cronometro" && (
            <div className="mb-6">
              <button
                type="button"
                onClick={resetCronometro}
                disabled={isRunning}
                className="rounded-full px-4 py-2 text-sm font-medium bg-[var(--color-surface-hover)] text-[var(--color-text)] hover:bg-[var(--color-border)] disabled:opacity-50 transition-colors"
              >
                Reiniciar
              </button>
            </div>
          )}

          {/* Play / Pause / Pausar alarma */}
          <button
            type="button"
            onClick={alarmPlaying ? stopAlarm : toggleTimer}
            disabled={mode === "temporizador" && secondsLeft <= 0 && !alarmPlaying}
            className="w-full rounded-2xl bg-[var(--color-accent)] py-4 flex items-center justify-center gap-2 text-white font-semibold hover:brightness-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
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

          {/* Temporizador: reset cuando está en 0 */}
          {mode === "temporizador" && secondsLeft <= 0 && !isRunning && (
            <button
              type="button"
              onClick={resetTimer}
              className="w-full mt-3 rounded-xl py-2 text-sm font-medium text-[var(--color-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface-hover)] transition-colors"
            >
              Reiniciar
            </button>
          )}
        </div>

        <p className="mt-4 text-sm text-[var(--color-muted)] text-center">
          El temporizador sigue en segundo plano al cambiar de página. Se detiene al cerrar la pestaña.
        </p>
      </div>
    </section>
  );
}
