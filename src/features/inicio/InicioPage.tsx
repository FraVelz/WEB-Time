import { InicioSection } from "@/features/inicio/components/InicioSection";
import { InicioQuickLink } from "@/ui/InicioQuickLink";

export default function InicioPage() {
  return (
    <div className="pt-8 pb-12 md:pt-10 md:pb-16">
      <InicioSection />

      <div className="mx-auto mt-16 max-w-5xl space-y-8 px-4 md:px-6">
        <section className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 md:p-8">
          <h2 className="mb-3 text-xl font-semibold text-[var(--color-text)]">Sobre los countdowns</h2>
          <p className="mb-4 leading-relaxed text-[var(--color-muted)]">
            Cada contador es un objetivo de vida aproximado: una fecha o edad hacia la que quiero llegar con algo
            concreto avanzado. El título nombra la etapa; la descripción de cada uno indica, de forma orientativa, de
            qué trata ese tramo y qué tendría que conseguir aproximadamente en ese plazo.
          </p>
          <p className="mb-4 leading-relaxed text-[var(--color-muted)]">
            Si todo sale bien, los primeros plazos pueden parecer demasiado amplios. La idea es que, al llegar a la
            mitad de cada contador, el progreso sea visible y surja la pregunta: ¿qué más se puede hacer?
          </p>
          <ul className="list-inside list-disc space-y-2 text-sm text-[var(--color-muted)]">
            <li>
              <span className="font-medium text-[var(--color-text)]">Misión:</span> construir un legado de avance tan
              sostenido que, en plazos relativamente cortos, parezca difícil de imaginar, y que inspire a otros a
              plantearse hasta dónde se puede llegar.
            </li>
            <li>No son predicciones ni garantías: son brújulas personales que iré afinando según avance la vida.</li>
            <li>En mi instagram personal, estaré subiendo pruebas según los objetivos que vaya alcanzando.</li>
          </ul>
        </section>

        <div className="flex flex-wrap gap-4">
          <InicioQuickLink href="/pomodoro">Ir a Pomodoro →</InicioQuickLink>
          <InicioQuickLink href="/temporizador">Ir a Temporizador →</InicioQuickLink>
          <InicioQuickLink href="/hora">Ver hora mundial →</InicioQuickLink>
        </div>
      </div>
    </div>
  );
}
