import { SiteHeader } from "@/components/SiteHeader";
import { InicioSection } from "@/components/InicioSection";
import { Pomodoro } from "@/components/Pomodoro";
import { TemporizadorSection } from "@/components/TemporizadorSection";
import { HoraSection } from "@/components/HoraSection";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />

      <main className="flex-1">
        <div className="pt-8 pb-12 md:pt-10 md:pb-16">
          <InicioSection />
        </div>

        <section
          id="pomodoro"
          className="scroll-mt-20 py-12 md:py-16 border-t border-[var(--color-border)]"
          aria-labelledby="pomodoro-heading"
        >
          <div className="mx-auto max-w-5xl px-4 md:px-6">
            <h2
              id="pomodoro-heading"
              className="text-2xl font-semibold text-[var(--color-text)] mb-2"
            >
              Pomodoro
            </h2>
            <p className="text-[var(--color-muted)] text-sm mb-8">
              Reloj Pomodoro para trabajar y estudiar: 25 min trabajo, 5 min descanso corto, 15 min descanso largo.
            </p>
            <Pomodoro />
          </div>
        </section>

        <TemporizadorSection />

        <HoraSection />
      </main>

      <footer className="border-t border-[var(--color-border)] py-6 text-center text-sm text-[var(--color-muted)]">
        <p>
          Fechas en <code className="rounded bg-[var(--color-surface)] px-1.5 py-0.5 font-mono text-xs">config/countdowns.ts</code>. 18, 20, 25 y 30 años desde fecha de nacimiento (19 de mayo).
        </p>
      </footer>
    </div>
  );
}
