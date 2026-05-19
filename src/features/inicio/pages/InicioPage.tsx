import Link from "next/link";
import { InicioSection } from "@/features/inicio/components/InicioSection";

export default function InicioPage() {
  return (
    <div className="pt-8 pb-12 md:pt-10 md:pb-16">
      <InicioSection />

      <div className="mx-auto mt-16 max-w-5xl space-y-8 px-4 md:px-6">
        <section className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 md:p-8">
          <h2 className="mb-3 text-xl font-semibold text-[var(--color-text)]">Sobre los countdowns</h2>
          <p className="mb-4 leading-relaxed text-[var(--color-muted)]">
            Si todo sale bien, los primeros periodos de tiempo en estas secciones, parecerá demasiado. Apenas llegue a
            la mitad de estos contadores, las personas llegaran a ver, pensaran que mas se puede llegar a hacer?
          </p>
          <ul className="list-inside list-disc space-y-1 text-sm text-[var(--color-muted)]">
            <li>Mission</li>
            <li>
              Dar la vida en un legado que ninguna persona llego jamas a imaginar semejante progreso en cortos periodos
              de tiempo.
            </li>
          </ul>
        </section>

        <div className="flex flex-wrap gap-4">
          <Link
            href="/pomodoro"
            className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-5 py-3 text-sm font-medium text-[var(--color-text)] transition-colors hover:border-[var(--color-accent-soft)] hover:bg-[var(--color-surface-hover)]"
          >
            Ir a Pomodoro →
          </Link>
          <Link
            href="/temporizador"
            className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-5 py-3 text-sm font-medium text-[var(--color-text)] transition-colors hover:border-[var(--color-accent-soft)] hover:bg-[var(--color-surface-hover)]"
          >
            Ir a Temporizador →
          </Link>
          <Link
            href="/hora"
            className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-5 py-3 text-sm font-medium text-[var(--color-text)] transition-colors hover:border-[var(--color-accent-soft)] hover:bg-[var(--color-surface-hover)]"
          >
            Ver hora mundial →
          </Link>
        </div>
      </div>
    </div>
  );
}
