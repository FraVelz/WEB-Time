"use client";

import { useEffect, useRef, useState } from "react";
import { getCookieConsent, setCookieConsent, type CookieConsent } from "@/features/pomodoro/lib/pomodoroCookies";

const FOCUSABLE_SELECTOR = [
  "a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]),",
  "select:not([disabled]), [tabindex]:not([tabindex='-1'])",
].join(" ");

export function PomodoroCookieConsent() {
  const [consent, setConsent] = useState<CookieConsent | null>(null);
  const [mounted, setMounted] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const acceptRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setConsent(getCookieConsent());
    setMounted(true);
  }, []);

  const visible = mounted && consent === null;

  useEffect(() => {
    if (!visible) return;
    const el = dialogRef.current;
    if (!el) return;

    const trigger = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    requestAnimationFrame(() => acceptRef.current?.focus());

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      const focusables = [...el.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)];
      if (focusables.length === 0) return;
      const first = focusables[0]!;
      const last = focusables[focusables.length - 1]!;
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else if (document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    el.addEventListener("keydown", handleKeyDown);
    return () => {
      el.removeEventListener("keydown", handleKeyDown);
      if (trigger?.isConnected) {
        requestAnimationFrame(() => trigger.focus());
      }
    };
  }, [visible]);

  if (!visible) {
    return null;
  }

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="pomodoro-cookie-title"
      className="border-border bg-surface rounded-2xl border p-5 md:p-6"
      onKeyDown={(e) => e.stopPropagation()}
    >
      <h2 id="pomodoro-cookie-title" className="text-text mb-2 text-lg font-semibold">
        ¿Guardar estadísticas con cookies?
      </h2>
      <p className="text-muted mb-4 text-sm leading-relaxed">
        Si aceptas, al terminar cada bloque (trabajo, descanso corto o descanso largo) se guardará un registro en una
        cookie de tu navegador. La gráfica de abajo mostrará cuántos pomodoros de trabajo completaste cada día. No
        enviamos datos a ningún servidor.
      </p>
      <div className="flex flex-col gap-2 sm:flex-row">
        <button
          ref={acceptRef}
          type="button"
          onClick={() => {
            setCookieConsent("accepted");
            setConsent("accepted");
          }}
          className="bg-accent flex-1 cursor-pointer rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition-all hover:brightness-110"
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
