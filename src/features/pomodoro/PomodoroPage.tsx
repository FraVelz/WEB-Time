import { FeaturePageShell } from "@/components/layout/FeaturePageShell";
import { Pomodoro } from "@/features/pomodoro/components/Pomodoro";
import { PomodoroInfoCard } from "@/features/pomodoro/components/PomodoroInfoCard";
import { PomodoroStatsSection } from "@/features/pomodoro/components/PomodoroStatsSection";

export default function PomodoroPage() {
  return (
    <FeaturePageShell
      title="Pomodoro"
      description={
        "Técnica de gestión del tiempo: bloques de trabajo enfocado y descansos cortos " +
        "para mantener la concentración."
      }
    >
      <div className="mx-auto mb-12 max-w-md">
        <Pomodoro />
      </div>

      <section className="mb-10 grid gap-6 md:grid-cols-2">
        <PomodoroInfoCard title="Cómo usarlo">
          <ol className="text-muted list-inside list-decimal space-y-2 text-sm">
            <li>
              Pulsa <strong className="text-text">Iniciar</strong> para un bloque de 25 min de trabajo.
            </li>
            <li>Al terminar, suena la alarma y entra un descanso corto (5 min) o largo (15 min cada 4).</li>
            <li>
              Usa <strong className="text-text">Pausar</strong> si te interrumpen.
            </li>
            <li>
              Cuando suene la alarma, pulsa <strong className="text-text">Pausar alarma</strong> para silenciarla.
            </li>
            <li>El Pomodoro sigue en segundo plano al cambiar de página.</li>
            <li>
              <strong className="text-text">Reiniciar</strong> vuelve al bloque de trabajo inicial.
            </li>
          </ol>
        </PomodoroInfoCard>
        <PomodoroInfoCard title="Beneficios">
          <ul className="text-muted space-y-2 text-sm">
            <li>• Menos distracciones: un solo bloque a la vez.</li>
            <li>• Descansos regulares evitan el agotamiento.</li>
            <li>• Fácil medir cuántos “pomodoros” haces al día.</li>
            <li>• Útil para estudiar y para trabajo profundo.</li>
          </ul>
        </PomodoroInfoCard>
      </section>

      <PomodoroStatsSection />
    </FeaturePageShell>
  );
}
