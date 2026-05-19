"use client";

import { FullscreenIcon, SpeakerIcon } from "@/components/ui/icons";

type TimerMediaControlsProps = {
  soundEnabled: boolean;
  onToggleSound: () => void;
};

function toggleFullscreen() {
  if (!document.fullscreenElement) document.documentElement.requestFullscreen?.();
  else document.exitFullscreen?.();
}

export function TimerMediaControls({ soundEnabled, onToggleSound }: TimerMediaControlsProps) {
  return (
    <div className="mb-4 flex justify-end gap-2">
      <button
        type="button"
        onClick={onToggleSound}
        className="text-muted hover:bg-surface-hover hover:text-text cursor-pointer rounded-lg p-2 transition-colors"
        aria-label={soundEnabled ? "Desactivar alarma" : "Activar alarma"}
      >
        <SpeakerIcon muted={!soundEnabled} />
      </button>

      <button
        type="button"
        onClick={toggleFullscreen}
        className="text-muted hover:bg-surface-hover hover:text-text cursor-pointer rounded-lg p-2 transition-colors"
        aria-label="Pantalla completa"
      >
        <FullscreenIcon />
      </button>
    </div>
  );
}
