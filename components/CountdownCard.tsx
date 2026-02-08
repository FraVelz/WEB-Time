"use client";

import { getTimeRemaining, type TimeRemaining } from "@/lib/countdown";
import { pluralize, pad } from "@/lib/formatting";
import type { CountdownItem } from "@/config/countdowns";

type CountdownCardProps = {
  config: CountdownItem;
  data: TimeRemaining;
};

function TimeUnit({
  value,
  label,
  size = "large",
}: {
  value: string;
  label: string;
  size?: "large" | "medium";
}) {
  return (
    <div className={`countdown-unit countdown-unit--${size}`} role="group">
      <span className="countdown-value" aria-hidden="true">
        {value}
      </span>
      <span className="countdown-label">{label}</span>
    </div>
  );
}

export function CountdownCard({ config, data }: CountdownCardProps) {
  if (data.passed) {
    return (
      <article
        className="countdown-card countdown-card--finished"
        aria-labelledby={`title-${config.id}`}
      >
        <header className="card-header">
          <h2 id={`title-${config.id}`} className="card-title">
            {config.title}
          </h2>
          <p className="card-description">{config.description}</p>
        </header>
        <div className="card-body" role="timer" aria-live="polite">
          <p className="countdown-finished-msg">¡Ya llegó la fecha!</p>
        </div>
      </article>
    );
  }

  return (
    <article className="countdown-card" aria-labelledby={`title-${config.id}`}>
      <header className="card-header">
        <h2 id={`title-${config.id}`} className="card-title">
          {config.title}
        </h2>
        <p className="card-description">{config.description}</p>
      </header>
      <div className="card-body" role="timer" aria-live="polite" aria-atomic="true">
        {/* Bloque principal: años (solo si > 0), meses, días */}
        <div className="countdown-block countdown-block--primary">
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
        <div className="countdown-block countdown-block--secondary">
          <TimeUnit size="medium" value={pad(data.hours)} label="horas" />
          <TimeUnit size="medium" value={pad(data.minutes)} label="min" />
          <TimeUnit size="medium" value={pad(data.seconds)} label="seg" />
        </div>
        <p className="countdown-summary">
          {data.years > 0 && (
            <>
              {data.years} {pluralize(data.years, "año", "años")},{" "}
            </>
          )}
          {data.months} {pluralize(data.months, "mes", "meses")}, {data.days}{" "}
          {pluralize(data.days, "día", "días")} — {pad(data.hours)}:{pad(data.minutes)}:
          {pad(data.seconds)}
        </p>
      </div>
    </article>
  );
}
