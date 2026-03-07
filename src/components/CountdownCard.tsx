"use client";

import { getTimeRemaining, type TimeRemaining } from "@/lib/countdown";
import { pluralize, pad } from "@/lib/formatting";
import type { CountdownItem } from "@/config/countdowns";

type CountdownCardProps = {
  config: CountdownItem;
  data: TimeRemaining;
  /** En acordeón el título va en el trigger; no repetir cabecera */
  hideHeader?: boolean;
};

const COLOMBIA = "America/Bogota";

function toDate(value: Date | string): Date {
  return typeof value === "string" ? new Date(value) : value;
}

/** Ej: "Será en 2040, el 19 de mayo, a las 00:00" */
function formatTargetDateTime(date: Date | string): string {
  const d = toDate(date);
  const year = d.toLocaleString("es-ES", { year: "numeric", timeZone: COLOMBIA });
  const dayMonth = d.toLocaleDateString("es-ES", {
    day: "numeric",
    month: "long",
    timeZone: COLOMBIA,
  });
  const time = d.toLocaleTimeString("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: COLOMBIA,
  });
  return `Será en ${year}, el ${dayMonth}, a las ${time}`;
}

function formatTargetDateTimePast(date: Date | string): string {
  const d = toDate(date);
  const year = d.toLocaleString("es-ES", { year: "numeric", timeZone: COLOMBIA });
  const dayMonth = d.toLocaleDateString("es-ES", {
    day: "numeric",
    month: "long",
    timeZone: COLOMBIA,
  });
  const time = d.toLocaleTimeString("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: COLOMBIA,
  });
  return `Fue en ${year}, el ${dayMonth}, a las ${time}`;
}

function TimeUnit({
  value,
  label,
  size = "large",
}: {
  value: string;
  label: string;
  size?: "large" | "medium";
}) {
  const containerClasses =
    size === "large"
      ? "flex flex-col items-center min-w-[5rem]"
      : "flex flex-col items-center min-w-[4rem]";

  const valueClasses =
    size === "large"
      ? "font-mono font-semibold leading-tight text-accent text-4xl md:text-5xl"
      : "font-mono font-semibold leading-tight text-accent text-2xl md:text-3xl";

  const labelClasses =
    size === "large"
      ? "mt-1 text-sm uppercase tracking-[0.06em] text-muted font-semibold"
      : "mt-1 text-xs uppercase tracking-[0.06em] text-muted font-semibold";

  return (
    <div className={containerClasses} role="group">
      <span className={valueClasses} aria-hidden="true">
        {value}
      </span>
      <span className={labelClasses}>{label}</span>
    </div>
  );
}

export function CountdownCard({ config, data, hideHeader }: CountdownCardProps) {
  if (data.passed) {
    return (
      <article
        className="bg-surface border border-success/40 bg-success/10 rounded-xl p-4 flex flex-col gap-4"
        aria-labelledby={hideHeader ? undefined : `title-${config.id}`}
      >
        {!hideHeader && (
          <header className="space-y-1">
            <h2 id={`title-${config.id}`} className="text-xl font-semibold text-text leading-tight">
              {config.title}
            </h2>
            <p className="text-base text-muted">{config.description}</p>
          </header>
        )}
        {hideHeader && <p className="text-sm text-muted">{config.description}</p>}
        <p className="text-sm text-muted">
          <strong className="text-text">{formatTargetDateTimePast(config.targetDate)}</strong>.
        </p>
        <div className="flex flex-col gap-5" role="timer" aria-live="polite">
          <p className="text-xl font-semibold text-success">¡Ya llegó la fecha!</p>
        </div>
      </article>
    );
  }

  return (
    <article
      className="bg-surface border border-border rounded-xl p-4 flex flex-col gap-4 transition-colors hover:bg-surface-hover hover:border-accent-soft"
      aria-labelledby={hideHeader ? undefined : `title-${config.id}`}
    >
      {!hideHeader && (
        <header className="space-y-1">
          <h2 id={`title-${config.id}`} className="text-xl font-semibold text-text leading-tight">
            {config.title}
          </h2>
          <p className="text-base text-muted">{config.description}</p>
        </header>
      )}
      {hideHeader && (
        <p className="text-sm text-muted">{config.description}</p>
      )}
      <p className="text-sm text-muted">
        <strong className="text-text">{formatTargetDateTime(config.targetDate)}</strong>.
      </p>
      <div
        className="flex flex-col gap-5"
        role="timer"
        aria-live="polite"
        aria-atomic="true"
      >
        {/* Bloque principal: años (solo si > 0), meses, días */}
        <div className="flex flex-wrap items-end gap-6 md:gap-8">
          {data.years > 0 && (
            <TimeUnit
              size="large"
              value={String(data.years)}
              label={pluralize(data.years, "año", "años")}
            />
          )}
          <TimeUnit
            size="large"
            value={String(data.months)}
            label={pluralize(data.months, "mes", "meses")}
          />
          <TimeUnit
            size="large"
            value={pad(data.days)}
            label={pluralize(data.days, "día", "días")}
          />
        </div>
        {/* Bloque secundario: horas, minutos, segundos */}
        <div className="flex flex-wrap items-end gap-5">
          <TimeUnit size="medium" value={pad(data.hours)} label="horas" />
          <TimeUnit size="medium" value={pad(data.minutes)} label="min" />
          <TimeUnit size="medium" value={pad(data.seconds)} label="seg" />
        </div>
      </div>
    </article>
  );
}
