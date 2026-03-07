import type { Metadata } from "next";
import { Pomodoro } from "@/components/Pomodoro";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Pomodoro — WEB-Time",
  description: "Reloj Pomodoro para trabajar y estudiar: 25 min trabajo, 5 min descanso corto, 15 min descanso largo.",
};

export default function PomodoroPage() {
  return (
    <div className="py-12 md:py-16">
      <div className="mx-auto max-w-5xl px-4 md:px-6">
        <header className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-[var(--color-text)] mb-2">
            Pomodoro
          </h1>
          <p className="text-[var(--color-muted)] text-lg max-w-2xl">
            Técnica de gestión del tiempo: bloques de trabajo enfocado y descansos
            cortos para mantener la concentración.
          </p>
        </header>

        <div className="max-w-md mx-auto mb-12">
          <Pomodoro />
        </div>

        <section className="grid md:grid-cols-2 gap-6 mb-10">
          <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
            <h2 className="text-lg font-semibold text-[var(--color-text)] mb-3">
              Cómo usarlo
            </h2>
            <ol className="text-[var(--color-muted)] text-sm space-y-2 list-decimal list-inside">
              <li>Pulsa <strong className="text-[var(--color-text)]">Iniciar</strong> para un bloque de 25 min de trabajo.</li>
              <li>Al terminar, suena la alarma y entra un descanso corto (5 min) o largo (15 min cada 4 pomodoros).</li>
              <li>Usa <strong className="text-[var(--color-text)]">Pausar</strong> si te interrumpen.</li>
              <li>Cuando suene la alarma, pulsa <strong className="text-[var(--color-text)]">Pausar alarma</strong> para silenciarla.</li>
              <li>El Pomodoro sigue en segundo plano al cambiar de página.</li>
              <li><strong className="text-[var(--color-text)]">Reiniciar</strong> vuelve al bloque de trabajo inicial.</li>
            </ol>
          </div>
          <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
            <h2 className="text-lg font-semibold text-[var(--color-text)] mb-3">
              Beneficios
            </h2>
            <ul className="text-[var(--color-muted)] text-sm space-y-2">
              <li>• Menos distracciones: un solo bloque a la vez.</li>
              <li>• Descansos regulares evitan el agotamiento.</li>
              <li>• Fácil medir cuántos “pomodoros” haces al día.</li>
              <li>• Útil para estudiar y para trabajo profundo.</li>
            </ul>
          </div>
        </section>

        <Link
          href="/inicio"
          className="inline-flex items-center gap-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2 text-sm text-[var(--color-text)] hover:bg-[var(--color-surface-hover)] transition-colors"
        >
          ← Volver a Inicio
        </Link>
      </div>
    </div>
  );
}
