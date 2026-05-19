import Link from "next/link";
import { HoraSection } from "@/features/hora/components/HoraSection";

export default function HoraPage() {
  return (
    <div className="py-12 md:py-16">
      <div className="mx-auto max-w-5xl px-4 md:px-6">
        <header className="mb-10">
          <h1 className="mb-2 text-3xl font-semibold text-[var(--color-text)] md:text-4xl">Hora mundial</h1>
          <p className="max-w-2xl text-lg text-[var(--color-muted)]">
            Hora actual en las capitales de las 8 principales potencias mundiales y Colombia.
          </p>
        </header>

        <HoraSection />

        <section className="mt-12 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
          <h2 className="mb-3 text-lg font-semibold text-[var(--color-text)]">Zonas incluidas</h2>
          <p className="mb-4 text-sm text-[var(--color-muted)]">
            Estados Unidos (Washington D.C.), China (Pekín), Rusia (Moscú), Reino Unido (Londres), Francia (París),
            Alemania (Berlín), Japón (Tokio), India (Nueva Delhi) y Colombia (Bogotá). La hora se actualiza cada
            segundo.
          </p>
          <p className="text-xs text-[var(--color-muted)]">
            Todas las horas se muestran en formato 24h. La zona se interpreta con la base de datos de zonas horarias del
            navegador.
          </p>
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
