import { FeaturePageShell } from "@/components/layout/FeaturePageShell";
import { HoraSection } from "@/features/hora/components/HoraSection";

export default function HoraPage() {
  return (
    <FeaturePageShell
      title="Hora mundial"
      description="Hora actual en las capitales de las 8 principales potencias mundiales y Colombia."
    >
      <HoraSection />
    </FeaturePageShell>
  );
}
