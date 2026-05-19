import type { ReactNode } from "react";

type PomodoroInfoCardProps = {
  title: string;
  children: ReactNode;
};

export function PomodoroInfoCard({ title, children }: PomodoroInfoCardProps) {
  return (
    <div className="border-border bg-surface rounded-2xl border p-6">
      <h2 className="text-text mb-3 text-lg font-semibold">{title}</h2>
      {children}
    </div>
  );
}
