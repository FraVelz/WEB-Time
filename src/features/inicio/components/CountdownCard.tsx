"use client";

import { CheckIcon } from "@/components/ui/icons";
import type { CountdownItem } from "@/features/inicio/config/countdowns";
import type { TimeRemaining } from "@/features/inicio/lib/countdown";
import { pluralize, pad } from "@/features/inicio/lib/formatting";
import { cn } from "@/lib/cn";

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
function formatTargetDateTime(date: Date | string, past = false): string {
  const d = toDate(date);
  const year = d.toLocaleString("es-ES", {
    year: "numeric",
    timeZone: COLOMBIA,
  });
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
  const prefix = past ? "Fue" : "Será";
  return `${prefix} en ${year}, el ${dayMonth}, a las ${time}`;
}

function PassedCelebration({ targetDate }: { targetDate: Date | string }) {
  return (
    <div
      className="border-success/25 bg-success/5 flex flex-col gap-4 rounded-lg border p-4 sm:flex-row sm:items-center sm:gap-5"
      role="status"
      aria-live="polite"
    >
      <div
        className="bg-success/15 text-success mx-auto flex size-14 shrink-0 items-center justify-center rounded-full sm:mx-0"
        aria-hidden
      >
        <CheckIcon className="size-7 stroke-[2.5]" />
      </div>
      <div className="min-w-0 flex-1 space-y-2 text-center sm:text-left">
        <p className="text-success text-xs font-semibold tracking-widest uppercase">Completado</p>
        <p className="text-text text-xl leading-tight font-semibold">¡Ya llegó la fecha!</p>
        <p className="text-muted text-sm leading-relaxed">
          <span className="text-text font-medium">{formatTargetDateTime(targetDate, true)}</span>
        </p>
      </div>
    </div>
  );
}

function TimeUnit({ value, label, size = "large" }: { value: string; label: string; size?: "large" | "medium" }) {
  const large = size === "large";
  return (
    <div className={cn("flex flex-col items-center", large ? "min-w-20" : "min-w-16")} role="group">
      <span
        className={cn(
          "text-accent font-mono leading-tight font-semibold",
          large ? "text-4xl md:text-5xl" : "text-2xl md:text-3xl",
        )}
        aria-hidden
      >
        {value}
      </span>
      <span className={cn("text-muted mt-1 font-semibold tracking-wide uppercase", large ? "text-sm" : "text-xs")}>
        {label}
      </span>
    </div>
  );
}

export function CountdownCard({ config, data, hideHeader }: CountdownCardProps) {
  if (data.passed) {
    return (
      <article
        className="bg-surface border-success/35 flex flex-col gap-4 rounded-xl border p-4"
        aria-labelledby={hideHeader ? undefined : `title-${config.id}`}
      >
        {!hideHeader && (
          <header className="space-y-1">
            <h2 id={`title-${config.id}`} className="text-text text-xl leading-tight font-semibold">
              {config.title}
            </h2>
            <p className="text-muted text-base">{config.description}</p>
          </header>
        )}
        {hideHeader && <p className="text-muted text-sm leading-relaxed">{config.description}</p>}
        <PassedCelebration targetDate={config.targetDate} />
      </article>
    );
  }

  return (
    <article
      className="bg-surface border-border hover:bg-surface-hover hover:border-accent-soft flex flex-col gap-4 rounded-xl border p-4 transition-colors"
      aria-labelledby={hideHeader ? undefined : `title-${config.id}`}
    >
      {!hideHeader && (
        <header className="space-y-1">
          <h2 id={`title-${config.id}`} className="text-text text-xl leading-tight font-semibold">
            {config.title}
          </h2>
          <p className="text-muted text-base">{config.description}</p>
        </header>
      )}
      {hideHeader && <p className="text-muted text-sm">{config.description}</p>}
      <p className="text-muted text-sm">
        <strong className="text-text">{formatTargetDateTime(config.targetDate)}</strong>.
      </p>
      <div className="flex flex-col gap-5" role="timer" aria-live="polite" aria-atomic="true">
        {/* Bloque principal: años (solo si > 0), meses, días */}
        <div className="flex flex-wrap items-end gap-6 md:gap-8">
          {data.years > 0 && (
            <TimeUnit size="large" value={String(data.years)} label={pluralize(data.years, "año", "años")} />
          )}
          <TimeUnit size="large" value={String(data.months)} label={pluralize(data.months, "mes", "meses")} />
          <TimeUnit size="large" value={pad(data.days)} label={pluralize(data.days, "día", "días")} />
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
