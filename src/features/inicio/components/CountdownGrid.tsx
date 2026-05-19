"use client";

import { useCallback, useEffect, useState } from "react";
import { getTimeRemaining } from "@/features/inicio/lib/countdown";
import { CountdownCard } from "./CountdownCard";
import type { CountdownItem } from "@/features/inicio/config/countdowns";
import type { TimeRemaining } from "@/features/inicio/lib/countdown";

const TICK_MS = 1000;

type CountdownGridProps = {
  countdowns: CountdownItem[];
};

function shortSummary(data: TimeRemaining): string {
  if (data.passed) return "¡Llegó!";
  const parts: string[] = [];
  if (data.years > 0) parts.push(`${data.years}a`);
  if (data.months > 0) parts.push(`${data.months}m`);
  parts.push(`${data.days}d`);
  return parts.join(", ");
}

/** Primer countdown que aún no ha llegado (el "siguiente" activo). */
function getNextActiveId(countdowns: CountdownItem[], now: Date): string | null {
  for (const config of countdowns) {
    if (!getTimeRemaining(now, config.targetDate).passed) {
      return config.id;
    }
  }
  return null;
}

function buildDefaultOpenIds(countdowns: CountdownItem[]): Set<string> {
  const nextId = getNextActiveId(countdowns, new Date());
  return nextId ? new Set([nextId]) : new Set();
}

export function CountdownGrid({ countdowns }: CountdownGridProps) {
  const [now, setNow] = useState(() => new Date());
  const [openIds, setOpenIds] = useState<Set<string>>(() => buildDefaultOpenIds(countdowns));

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), TICK_MS);
    return () => clearInterval(id);
  }, []);

  const toggle = useCallback((id: string) => {
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  return (
    <div className="space-y-2" role="list">
      {countdowns.map((config) => {
        const data = getTimeRemaining(now, config.targetDate);
        const isOpen = openIds.has(config.id);

        return (
          <div key={config.id} className="countdown-accordion-item" role="listitem">
            <button
              type="button"
              className="countdown-accordion-trigger cursor-pointer select-none"
              aria-expanded={isOpen}
              aria-controls={`panel-${config.id}`}
              id={`trigger-${config.id}`}
              onClick={() => toggle(config.id)}
            >
              <span className="text-text min-w-0 flex-1 truncate font-semibold">{config.title}</span>
              <span className="text-muted shrink-0 text-sm">{shortSummary(data)}</span>
              <svg
                className="chevron"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>
            {isOpen && (
              <div
                id={`panel-${config.id}`}
                role="region"
                aria-labelledby={`trigger-${config.id}`}
                className="countdown-accordion-panel"
              >
                <CountdownCard config={config} data={data} hideHeader />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
