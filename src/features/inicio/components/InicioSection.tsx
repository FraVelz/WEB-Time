"use client";

import Image from "next/image";
import { CountdownGrid } from "./CountdownGrid";
import { COUNTDOWN_CONFIG } from "@/features/inicio/config/countdowns";

export function InicioSection() {
  return (
    <section id="inicio" className="mx-auto max-w-5xl scroll-mt-20 px-4 md:px-6" aria-labelledby="inicio-heading">
      <h2 id="inicio-heading" className="sr-only">
        Inicio: contadores e imagen
      </h2>

      <div>
        <div className="relative w-full overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-lg">
          <div className="relative aspect-[4/3] w-full sm:aspect-video">
            <Image
              src="/Copia-de-Napoleón-Brienne.jpg"
              alt="Napoleón en Brienne, estudiando con un mapa de Europa al fondo"
              fill
              className="object-contain object-center"
              sizes="(max-width: 768px) 100vw, 900px"
              priority
            />
            <div
              className="absolute inset-0 bg-gradient-to-t from-[var(--color-bg)]/80 via-transparent to-transparent"
              aria-hidden
            />
            <div className="absolute right-4 bottom-4 left-4 text-[var(--color-text)]">
              <p className="max-w-xl text-sm text-[var(--color-text)]/90">🇨🇴</p>
            </div>
          </div>
        </div>

        <div className="mt-10 space-y-6">
          <h3 className="text-2xl font-semibold text-[var(--color-text)]">Countdowns</h3>
          <CountdownGrid countdowns={COUNTDOWN_CONFIG} />
        </div>
      </div>
    </section>
  );
}
