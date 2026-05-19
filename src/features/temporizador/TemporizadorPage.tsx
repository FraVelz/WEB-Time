import { FeaturePageShell } from "@/components/layout/FeaturePageShell";
import { TemporizadorSection } from "@/features/temporizador/components/TemporizadorSection";

export default function TemporizadorPage() {
  return (
    <FeaturePageShell
      title="Temporizador"
      description={
        "Define horas y minutos, añade tantos temporizadores como necesites y " +
        "controla cada uno por separado (iniciar, pausar, reiniciar o quitar)."
      }
    >
      <TemporizadorSection />
    </FeaturePageShell>
  );
}
