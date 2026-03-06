import type { Metadata } from "next";
import { InicioSection } from "@/components/InicioSection";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Inicio — WEB-Time",
  description: "Countdowns hacia fechas importantes personales y imagen.",
};

export default function InicioPage() {
  return (
    <div className="pt-8 pb-12 md:pt-10 md:pb-16">
      <InicioSection />

      <div className="mx-auto max-w-5xl px-4 md:px-6 mt-16 space-y-8">
        <section className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 md:p-8">
          <h2 className="text-xl font-semibold text-[var(--color-text)] mb-3">
            Sobre los countdowns
          </h2>
          <p className="text-[var(--color-muted)] leading-relaxed mb-4">
            Si todo sale bien, los primeros periodos de tiempo en estas secciones, parecerá demasiado. Apenas llegue a la mitad 
            de estos contadores, las personas llegaran a ver, pensaran que mas se puede llegar a hacer?
          </p>
          <ul className="text-[var(--color-muted)] text-sm space-y-1 list-disc list-inside">
            <li>Mission</li>
            <li>Dar la vida en un legado que ninguna persona llego jamas a imaginar semejante progreso en cortos periodos de tiempo.</li>
          </ul>
        </section>

        <div className="flex flex-wrap gap-4">
          <Link
            href="/pomodoro"
            className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-5 py-3 text-sm font-medium text-[var(--color-text)] hover:bg-[var(--color-surface-hover)] hover:border-[var(--color-accent-soft)] transition-colors"
          >
            Ir a Pomodoro →
          </Link>
          <Link
            href="/temporizador"
            className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-5 py-3 text-sm font-medium text-[var(--color-text)] hover:bg-[var(--color-surface-hover)] hover:border-[var(--color-accent-soft)] transition-colors"
          >
            Ir a Temporizador →
          </Link>
          <Link
            href="/hora"
            className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-5 py-3 text-sm font-medium text-[var(--color-text)] hover:bg-[var(--color-surface-hover)] hover:border-[var(--color-accent-soft)] transition-colors"
          >
            Ver hora mundial →
          </Link>
        </div>
      </div>
    </div>
  );
}
