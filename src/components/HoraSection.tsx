"use client";

import { useState, useEffect } from "react";

const ZONES: { zone: string; label: string }[] = [
  { zone: "America/Bogota", label: "Colombia" },
  { zone: "America/New_York", label: "Estados Unidos (ET)" },
  { zone: "America/Los_Angeles", label: "Estados Unidos (PT)" },
  { zone: "Europe/Moscow", label: "Rusia (Moscú)" },
  { zone: "Asia/Shanghai", label: "China" },
  { zone: "Asia/Tokyo", label: "Japón" },
  { zone: "Europe/London", label: "Reino Unido" },
  { zone: "Europe/Paris", label: "Europa (París)" },
  { zone: "America/Sao_Paulo", label: "Brasil" },
];

function useTime(zone: string) {
  const [time, setTime] = useState("");
  useEffect(() => {
    const format = () => {
      try {
        const str = new Date().toLocaleTimeString("es-ES", {
          timeZone: zone,
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        });
        setTime(str);
      } catch {
        setTime("—");
      }
    };
    format();
    const id = setInterval(format, 1000);
    return () => clearInterval(id);
  }, [zone]);
  return time;
}

function ClockCard({ zone, label }: { zone: string; label: string }) {
  const time = useTime(zone);
  return (
    <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 flex flex-col gap-1">
      <span className="text-sm font-medium text-[var(--color-muted)]">{label}</span>
      <span className="font-mono text-2xl text-[var(--color-accent)]">{time}</span>
    </div>
  );
}

export function HoraSection() {
  return (
    <section
      id="hora"
      className="scroll-mt-20 py-12 md:py-16 border-t border-[var(--color-border)]"
      aria-labelledby="hora-heading"
    >
      <div className="mx-auto max-w-5xl px-4 md:px-6">
        <h2
          id="hora-heading"
          className="text-2xl font-semibold text-[var(--color-text)] mb-2"
        >
          Hora mundial
        </h2>
        <p className="text-[var(--color-muted)] text-sm mb-8">
          Horario actual en países estratégicos.
        </p>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {ZONES.map(({ zone, label }) => (
            <ClockCard key={zone} zone={zone} label={label} />
          ))}
        </div>
      </div>
    </section>
  );
}
