import { TemporizadorSection } from "@/features/timer/components/TemporizadorSection";
import Link from "next/link";

export default function TemporizadorPage() {
  return (
    <div className="py-12 md:py-16">
      <div className="mx-auto max-w-5xl px-4 md:px-6">
        <header className="mb-10">
          <h1 className="mb-2 text-3xl font-semibold text-[var(--color-text)] md:text-4xl">Temporizador</h1>
          <p className="max-w-2xl text-lg text-[var(--color-muted)]">
            Define horas y minutos, añade tantos temporizadores como necesites y controla cada uno por separado
            (iniciar, pausar, reiniciar o quitar).
          </p>
        </header>

        <TemporizadorSection />

        <section className="mt-12 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
          <h2 className="mb-3 text-lg font-semibold text-[var(--color-text)]">Ideas de uso</h2>
          <ul className="space-y-2 text-sm text-[var(--color-muted)]">
            <li>• Cocina: varios tiempos a la vez (horno, infusiones, etc.).</li>
            <li>• Ejercicio: series de trabajo y descanso.</li>
            <li>• Reuniones o presentaciones con límite de tiempo.</li>
            <li>• Recordatorios: temporizador en segundo plano.</li>
          </ul>
        </section>

        <Link
          href="/inicio"
          className="mt-8 inline-flex items-center gap-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2 text-sm text-[var(--color-text)] transition-colors hover:bg-[var(--color-surface-hover)]"
        >
          ← Volver a Inicio
        </Link>
      </div>
    </div>
  );
}
