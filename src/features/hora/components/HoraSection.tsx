"use client";

import { useEffect, useState } from "react";

const ZONES = [
  { zone: "Asia/Shanghai", label: "China", capital: "Pekín" },
  { zone: "America/New_York", label: "Estados Unidos", capital: "Washington D.C." },
  { zone: "Europe/Moscow", label: "Rusia", capital: "Moscú" },
  { zone: "Europe/London", label: "Reino Unido", capital: "Londres" },
  { zone: "Europe/Paris", label: "Francia", capital: "París" },
  { zone: "Europe/Berlin", label: "Alemania", capital: "Berlín" },
  { zone: "Asia/Tokyo", label: "Japón", capital: "Tokio" },
  { zone: "Asia/Kolkata", label: "India", capital: "Nueva Delhi" },
  { zone: "America/Bogota", label: "Colombia", capital: "Bogotá" },
] as const;

function formatZoneTime(zone: string): string {
  try {
    return new Date().toLocaleTimeString("es-ES", {
      timeZone: zone,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
  } catch {
    return "N/D";
  }
}

function useZoneTime(zone: string) {
  const [time, setTime] = useState(() => formatZoneTime(zone));

  useEffect(() => {
    const update = () => setTime(formatZoneTime(zone));
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [zone]);

  return time;
}

function ClockCard({ zone, label, capital }: (typeof ZONES)[number]) {
  const time = useZoneTime(zone);
  return (
    <div className="border-border bg-surface flex flex-col gap-1 rounded-xl border p-4">
      <span className="text-muted text-sm font-medium">
        {label}, {capital}
      </span>
      <span className="text-accent font-mono text-2xl">{time}</span>
    </div>
  );
}

export function HoraSection() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {ZONES.map((z) => (
        <ClockCard key={z.zone} {...z} />
      ))}
    </div>
  );
}
