"use client";

import { useEffect, useState } from "react";
import {
  getCookieConsent,
  setCookieConsent,
  type CookieConsent,
} from "@/features/pomodoro/lib/pomodoroCookies";

export function PomodoroCookieConsent() {
  const [consent, setConsent] = useState<CookieConsent | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setConsent(getCookieConsent());
    setMounted(true);
  }, []);

  if (!mounted || consent !== null) {
    return null;
  }

  return (
    <div
      role="dialog"
      aria-labelledby="pomodoro-cookie-title"
      className="border-border bg-surface rounded-2xl border p-5 md:p-6"
    >
      <h2 id="pomodoro-cookie-title" className="text-text mb-2 text-lg font-semibold">
        ¿Guardar estadísticas con cookies?
      </h2>
      <p className="text-muted mb-4 text-sm leading-relaxed">
        Si aceptas, al terminar cada bloque (trabajo, descanso corto o descanso largo) se guardará
        un registro en una cookie de tu navegador. La gráfica de abajo mostrará cuántos pomodoros de
        trabajo completaste cada día. No enviamos datos a ningún servidor.
      </p>
      <div className="flex flex-col gap-2 sm:flex-row">
        <button
          type="button"
          onClick={() => {
            setCookieConsent("accepted");
            setConsent("accepted");
          }}
          className="bg-accent hover:brightness-110 flex-1 cursor-pointer rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition-all"
        >
          Aceptar cookies
        </button>
        <button
          type="button"
          onClick={() => {
            setCookieConsent("rejected");
            setConsent("rejected");
          }}
          className="border-border text-muted hover:bg-surface-hover hover:text-text flex-1 cursor-pointer rounded-xl border px-4 py-2.5 text-sm font-medium transition-colors"
        >
          Rechazar
        </button>
      </div>
    </div>
  );
}
