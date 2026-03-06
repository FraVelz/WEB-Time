"use client";

import { useEffect, useState } from "react";
import { getTimeRemaining } from "@/lib/countdown";
import { CountdownCard } from "./CountdownCard";
import type { CountdownItem } from "@/config/countdowns";
import type { TimeRemaining } from "@/lib/countdown";

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

export function CountdownGrid({ countdowns }: CountdownGridProps) {
  const [now, setNow] = useState(() => new Date());
  const [openSet, setOpenSet] = useState<Set<number>>(() => new Set([0]));

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), TICK_MS);
    return () => clearInterval(id);
  }, []);

  const toggle = (index: number) => {
    setOpenSet((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  const dataMap = new Map<string, TimeRemaining>();
  countdowns.forEach((c) => {
    dataMap.set(c.id, getTimeRemaining(now, c.targetDate));
  });

  return (
    <div className="space-y-2" role="list">
      {countdowns.map((config, index) => {
        const data = dataMap.get(config.id)!;
        const isOpen = openSet.has(index);
        return (
          <div
            key={config.id}
            className="countdown-accordion-item"
            role="listitem"
          >
            <button
              type="button"
              className="countdown-accordion-trigger"
              aria-expanded={isOpen}
              aria-controls={`panel-${config.id}`}
              id={`trigger-${config.id}`}
              onClick={() => toggle(index)}
            >
              <span className="font-semibold text-text select-text truncate min-w-0">
                {config.title}
              </span>
              <span className="text-sm text-muted shrink-0">
                {shortSummary(data)}
              </span>
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
            <div
              id={`panel-${config.id}`}
              role="region"
              aria-labelledby={`trigger-${config.id}`}
              className="countdown-accordion-panel"
              hidden={!isOpen}
            >
              <CountdownCard config={config} data={data} hideHeader />
            </div>
          </div>
        );
      })}
    </div>
  );
}
