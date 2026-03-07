import type { Metadata } from "next";
import { HoraSection } from "@/components/HoraSection";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Hora mundial — WEB-Time",
  description: "Hora actual en las capitales de las 8 principales potencias mundiales y Colombia: Washington, Pekín, Moscú, Londres, París, Berlín, Tokio, Nueva Delhi y Bogotá.",
};

export default function HoraPage() {
  return (
    <div className="py-12 md:py-16">
      <div className="mx-auto max-w-5xl px-4 md:px-6">
        <header className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-[var(--color-text)] mb-2">
            Hora mundial
          </h1>
          <p className="text-[var(--color-muted)] text-lg max-w-2xl">
            Hora actual en las capitales de las 8 principales potencias mundiales y Colombia.
          </p>
        </header>

        <HoraSection />

        <section className="mt-12 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
          <h2 className="text-lg font-semibold text-[var(--color-text)] mb-3">
            Zonas incluidas
          </h2>
          <p className="text-[var(--color-muted)] text-sm mb-4">
            Estados Unidos (Washington D.C.), China (Pekín), Rusia (Moscú), Reino Unido (Londres),
            Francia (París), Alemania (Berlín), Japón (Tokio), India (Nueva Delhi) y Colombia (Bogotá).
            La hora se actualiza cada segundo.
          </p>
          <p className="text-[var(--color-muted)] text-xs">
            Todas las horas se muestran en formato 24h. La zona se interpreta con la
            base de datos de zonas horarias del navegador.
          </p>
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
