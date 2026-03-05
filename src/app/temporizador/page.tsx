import type { Metadata } from "next";
import { TemporizadorSection } from "@/components/TemporizadorSection";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Temporizador — WEB-Time",
  description: "Crea uno o varios temporizadores personalizados por horas y minutos.",
};

export default function TemporizadorPage() {
  return (
    <div className="py-12 md:py-16">
      <div className="mx-auto max-w-5xl px-4 md:px-6">
        <header className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-[var(--color-text)] mb-2">
            Temporizador
          </h1>
          <p className="text-[var(--color-muted)] text-lg max-w-2xl">
            Define horas y minutos, añade tantos temporizadores como necesites y
            controla cada uno por separado (iniciar, pausar, reiniciar o quitar).
          </p>
        </header>

        <TemporizadorSection />

        <section className="mt-12 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
          <h2 className="text-lg font-semibold text-[var(--color-text)] mb-3">
            Ideas de uso
          </h2>
          <ul className="text-[var(--color-muted)] text-sm space-y-2">
            <li>• Cocina: varios tiempos a la vez (horno, infusiones, etc.).</li>
            <li>• Ejercicio: series de trabajo y descanso.</li>
            <li>• Reuniones o presentaciones con límite de tiempo.</li>
            <li>• Recordatorios: temporizador en segundo plano.</li>
          </ul>
        </section>

        <Link
          href="/inicio"
          className="inline-flex items-center gap-2 mt-8 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2 text-sm text-[var(--color-text)] hover:bg-[var(--color-surface-hover)] transition-colors"
        >
          ← Volver a Inicio
        </Link>
      </div>
    </div>
  );
}
