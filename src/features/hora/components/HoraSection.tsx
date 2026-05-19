"use client";

import { useState, useEffect } from "react";

const ZONES: { zone: string; label: string; capital: string }[] = [
  {
    zone: "America/New_York",
    label: "Estados Unidos",
    capital: "Washington D.C.",
  },
  { zone: "Asia/Shanghai", label: "China", capital: "Pekín" },
  { zone: "Europe/Moscow", label: "Rusia", capital: "Moscú" },
  { zone: "Europe/London", label: "Reino Unido", capital: "Londres" },
  { zone: "Europe/Paris", label: "Francia", capital: "París" },
  { zone: "Europe/Berlin", label: "Alemania", capital: "Berlín" },
  { zone: "Asia/Tokyo", label: "Japón", capital: "Tokio" },
  { zone: "Asia/Kolkata", label: "India", capital: "Nueva Delhi" },
  { zone: "America/Bogota", label: "Colombia", capital: "Bogotá" },
];

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

function useTime(zone: string) {
  const [time, setTime] = useState(() => formatZoneTime(zone));

  useEffect(() => {
    const update = () => setTime(formatZoneTime(zone));
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [zone]);

  return time;
}

function ClockCard({ zone, label, capital }: { zone: string; label: string; capital: string }) {
  const time = useTime(zone);
  return (
    <div className="flex flex-col gap-1 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
      <span className="text-sm font-medium text-[var(--color-muted)]">
        {label}, {capital}
      </span>
      <span className="font-mono text-2xl text-[var(--color-accent)]">{time}</span>
    </div>
  );
}

export function HoraSection() {
  return (
    <section
      id="hora"
      className="scroll-mt-20 border-t border-[var(--color-border)] py-12 md:py-16"
      aria-labelledby="hora-heading"
    >
      <div className="mx-auto max-w-5xl px-4 md:px-6">
        <h2 id="hora-heading" className="mb-2 text-2xl font-semibold text-[var(--color-text)]">
          Hora mundial
        </h2>
        <p className="mb-8 text-sm text-[var(--color-muted)]">
          Hora actual en las capitales de las 8 principales potencias mundiales y Colombia.
        </p>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {ZONES.map(({ zone, label, capital }) => (
            <ClockCard key={zone} zone={zone} label={label} capital={capital} />
          ))}
        </div>
      </div>
    </section>
  );
}
