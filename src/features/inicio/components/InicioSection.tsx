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
        <div className="border-border bg-surface relative w-full overflow-hidden rounded-2xl border shadow-lg">
          <div className="relative aspect-[4/3] w-full sm:aspect-video">
            <Image
              src="/Copia-de-Napoleón-Brienne.jpg"
              alt="Napoleón en Brienne, estudiando con un mapa de Europa al fondo"
              fill
              className="object-contain object-center"
              sizes="(max-width: 768px) 100vw, 900px"
              priority
            />
            <div className="from-bg/80 absolute inset-0 bg-gradient-to-t via-transparent to-transparent" aria-hidden />
            <div className="absolute bottom-4 left-4">
              <span className="border-border/80 bg-bg/80 text-text inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold tracking-wide shadow-lg backdrop-blur-md">
                <span className="text-sm leading-none" aria-hidden>
                  🇨🇴
                </span>
                Colombia
              </span>
            </div>
          </div>
        </div>

        <div className="mt-10 space-y-6">
          <h3 className="text-text text-2xl font-semibold">Countdowns</h3>
          <CountdownGrid countdowns={COUNTDOWN_CONFIG} />
        </div>
      </div>
    </section>
  );
}
