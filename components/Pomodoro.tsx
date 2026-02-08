"use client";

import { useState, useEffect, useCallback } from "react";

const WORK_SEC = 25 * 60;
const SHORT_BREAK_SEC = 5 * 60;
const LONG_BREAK_SEC = 15 * 60;
const POMODOROS_FOR_LONG = 4;

type Phase = "work" | "shortBreak" | "longBreak";

function pad(n: number): string {
  return String(Math.floor(n)).padStart(2, "0");
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${pad(m)}:${pad(s)}`;
}

const PHASE_LABELS: Record<Phase, string> = {
  work: "Trabajo",
  shortBreak: "Descanso corto",
  longBreak: "Descanso largo",
};

export function Pomodoro() {
  const [phase, setPhase] = useState<Phase>("work");
  const [secondsLeft, setSecondsLeft] = useState(WORK_SEC);
  const [totalSeconds, setTotalSeconds] = useState(WORK_SEC);
  const [isRunning, setIsRunning] = useState(false);
  const [pomodoroCount, setPomodoroCount] = useState(0);

  const setPhaseState = useCallback((p: Phase) => {
    setPhase(p);
    if (p === "work") {
      setTotalSeconds(WORK_SEC);
      setSecondsLeft(WORK_SEC);
    } else if (p === "shortBreak") {
      setTotalSeconds(SHORT_BREAK_SEC);
      setSecondsLeft(SHORT_BREAK_SEC);
    } else {
      setTotalSeconds(LONG_BREAK_SEC);
      setSecondsLeft(LONG_BREAK_SEC);
    }
  }, []);

  const nextPhase = useCallback(() => {
    if (phase === "work") {
      const next = pomodoroCount + 1 >= POMODOROS_FOR_LONG ? "longBreak" : "shortBreak";
      setPomodoroCount((c) => (next === "longBreak" ? 0 : c + 1));
      setPhaseState(next);
    } else {
      setPhaseState("work");
    }
  }, [phase, pomodoroCount, setPhaseState]);

  useEffect(() => {
    if (!isRunning || secondsLeft <= 0) return;
    const id = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          setIsRunning(false);
          setTimeout(() => nextPhase(), 0);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [isRunning, secondsLeft, nextPhase]);

  const progressPct = totalSeconds ? ((totalSeconds - secondsLeft) / totalSeconds) * 100 : 0;

  const handleStart = () => setIsRunning(true);
  const handlePause = () => setIsRunning(false);
  const handleReset = () => {
    setIsRunning(false);
    setPhaseState(phase);
  };

  return (
    <section className="pomodoro-section" aria-labelledby="pomodoro-heading">
      <h2 id="pomodoro-heading" className="section-heading">
        Pomodoro
      </h2>
      <div className="pomodoro-card">
        <p className="pomodoro-desc">
          25 min trabajo, 5 min descanso corto, 15 min descanso largo (cada 4 pomodoros).
        </p>
        <p className="pomodoro-phase" aria-live="polite">
          {PHASE_LABELS[phase]}
        </p>
        <div className="pomodoro-display-wrap">
          <span className="pomodoro-display" aria-live="polite">
            {formatTime(secondsLeft)}
          </span>
        </div>
        <div className="pomodoro-progress-wrap">
          <div
            className="pomodoro-progress"
            role="progressbar"
            aria-valuenow={Math.round(progressPct)}
            aria-valuemin={0}
            aria-valuemax={100}
            style={{ width: `${progressPct}%` }}
          />
        </div>
        <div className="pomodoro-buttons">
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleStart}
            disabled={isRunning}
          >
            {isRunning ? "En marcha" : "Iniciar"}
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handlePause}
            disabled={!isRunning}
          >
            Pausar
          </button>
          <button type="button" className="btn btn-secondary" onClick={handleReset}>
            Reiniciar
          </button>
        </div>
      </div>
    </section>
  );
}
