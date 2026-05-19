import { Pomodoro } from "@/features/pomodoro/components/Pomodoro";
import Link from "next/link";

export default function PomodoroPage() {
  return (
    <div className="py-12 md:py-16">
      <div className="mx-auto max-w-5xl px-4 md:px-6">
        <header className="mb-10">
          <h1 className="mb-2 text-3xl font-semibold text-[var(--color-text)] md:text-4xl">Pomodoro</h1>
          <p className="max-w-2xl text-lg text-[var(--color-muted)]">
            Técnica de gestión del tiempo: bloques de trabajo enfocado y descansos cortos para mantener la
            concentración.
          </p>
        </header>

        <div className="mx-auto mb-12 max-w-md">
          <Pomodoro />
        </div>

        <section className="mb-10 grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
            <h2 className="mb-3 text-lg font-semibold text-[var(--color-text)]">Cómo usarlo</h2>
            <ol className="list-inside list-decimal space-y-2 text-sm text-[var(--color-muted)]">
              <li>
                Pulsa <strong className="text-[var(--color-text)]">Iniciar</strong> para un bloque de 25 min de trabajo.
              </li>
              <li>Al terminar, suena la alarma y entra un descanso corto (5 min) o largo (15 min cada 4 pomodoros).</li>
              <li>
                Usa <strong className="text-[var(--color-text)]">Pausar</strong> si te interrumpen.
              </li>
              <li>
                Cuando suene la alarma, pulsa <strong className="text-[var(--color-text)]">Pausar alarma</strong> para
                silenciarla.
              </li>
              <li>El Pomodoro sigue en segundo plano al cambiar de página.</li>
              <li>
                <strong className="text-[var(--color-text)]">Reiniciar</strong> vuelve al bloque de trabajo inicial.
              </li>
            </ol>
          </div>
          <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
            <h2 className="mb-3 text-lg font-semibold text-[var(--color-text)]">Beneficios</h2>
            <ul className="space-y-2 text-sm text-[var(--color-muted)]">
              <li>• Menos distracciones: un solo bloque a la vez.</li>
              <li>• Descansos regulares evitan el agotamiento.</li>
              <li>• Fácil medir cuántos “pomodoros” haces al día.</li>
              <li>• Útil para estudiar y para trabajo profundo.</li>
            </ul>
          </div>
        </section>

        <Link
          href="/inicio"
          className="inline-flex items-center gap-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2 text-sm text-[var(--color-text)] transition-colors hover:bg-[var(--color-surface-hover)]"
        >
          ← Volver a Inicio
        </Link>
      </div>
    </div>
  );
}
