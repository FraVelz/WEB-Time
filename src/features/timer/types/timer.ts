/**
 * Tipos para el módulo de temporizadores.
 * Un temporizador es cuenta regresiva (nombre + tiempo). El cronómetro es único y cuenta ascendente.
 */

export type TimerItem = {
  id: string;
  name: string;
  secondsLeft: number;
  totalSeconds: number;
  endTime: number | null;
  isRunning: boolean;
};

export type CronoState = {
  secondsElapsed: number;
  cronoStartTime: number | null;
  isRunning: boolean;
};

export type TimerMode = "temporizador" | "cronometro";
