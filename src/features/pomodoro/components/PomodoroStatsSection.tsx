"use client";

import { useEffect, useState } from "react";
import { PomodoroIsometricChart } from "@/features/pomodoro/components/grafica";
import { PomodoroCookieConsent } from "@/features/pomodoro/components/PomodoroCookieConsent";
import { PomodoroTimezoneSelector } from "@/features/pomodoro/components/PomodoroTimezoneSelector";
import {
  ensureTimeZoneCookie,
  getCookieConsent,
  getTimeZone,
  getWeekTotals,
  hasStatsConsent,
  POMODORO_STATS_UPDATED_EVENT,
  POMODORO_TIMEZONE_UPDATED_EVENT,
} from "@/features/pomodoro/lib/pomodoroCookies";
import { findGmtOffsetByZoneId, formatGmtOptionLabel } from "@/features/pomodoro/lib/timezoneCatalog";
import { formatGmtOffset } from "@/features/pomodoro/lib/pomodoroTimezone";

export function PomodoroStatsSection() {
  const [consent, setConsent] = useState<ReturnType<typeof getCookieConsent>>(null);
  const [stats, setStats] = useState(getWeekTotals);
  const [timeZone, setTimeZone] = useState("UTC");

  useEffect(() => {
    ensureTimeZoneCookie();
    const sync = () => {
      setConsent(getCookieConsent());
      setTimeZone(getTimeZone());
      setStats(getWeekTotals());
    };
    sync();
    window.addEventListener(POMODORO_STATS_UPDATED_EVENT, sync);
    window.addEventListener(POMODORO_TIMEZONE_UPDATED_EVENT, sync);
    return () => {
      window.removeEventListener(POMODORO_STATS_UPDATED_EVENT, sync);
      window.removeEventListener(POMODORO_TIMEZONE_UPDATED_EVENT, sync);
    };
  }, []);

  const { total, peak, data } = stats;
  const gmtOption = findGmtOffsetByZoneId(timeZone);
  const gmtLabel = gmtOption ? formatGmtOptionLabel(gmtOption) : formatGmtOffset(timeZone);

  const showChart = hasStatsConsent();
  const rejected = consent === "rejected";

  return (
    <section className="mt-4 space-y-6" aria-labelledby="pomodoro-stats-heading">
      <header>
        <h2 id="pomodoro-stats-heading" className="text-text mb-2 text-2xl font-semibold">
          Estadísticas
        </h2>
        <p className="text-muted max-w-2xl text-sm">
          Resumen de los últimos 7 días según tu zona horaria ({gmtLabel}). Cada barra cuenta
          pomodoros de trabajo completados ese día local.
        </p>
      </header>

      <PomodoroCookieConsent />

      {rejected && (
        <p className="text-muted border-border bg-surface rounded-xl border px-4 py-3 text-sm">
          Has rechazado las cookies. La gráfica no guardará nuevos datos. Puedes borrar la cookie{" "}
          <code className="text-text font-mono text-xs">pomodoro_cookie_consent</code> en tu
          navegador y recargar para volver a elegir.
        </p>
      )}

      {!showChart && !rejected && consent === null && (
        <p className="text-muted text-sm">
          Acepta las cookies arriba para empezar a registrar tus pomodoros al terminar cada bloque.
        </p>
      )}

      <div className="border-border bg-surface min-h-[320px] overflow-hidden rounded-2xl border">
        <PomodoroIsometricChart data={data} total={total} peakLabel={peak.label} peakCount={peak.pomodoros} />
      </div>

      <PomodoroTimezoneSelector />
    </section>
  );
}
