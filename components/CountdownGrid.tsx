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

export function CountdownGrid({ countdowns }: CountdownGridProps) {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), TICK_MS);
    return () => clearInterval(id);
  }, []);

  const dataMap = new Map<string, TimeRemaining>();
  countdowns.forEach((c) => {
    dataMap.set(c.id, getTimeRemaining(now, c.targetDate));
  });

  return (
    <div className="countdown-grid" role="list">
      {countdowns.map((config) => (
        <div key={config.id} role="listitem">
          <CountdownCard config={config} data={dataMap.get(config.id)!} />
        </div>
      ))}
    </div>
  );
}
