import type { ReactNode } from "react";

type PomodoroInfoCardProps = {
  title: string;
  children: ReactNode;
};

export function PomodoroInfoCard({ title, children }: PomodoroInfoCardProps) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-6">
      <h2 className="mb-3 text-lg font-semibold text-text">{title}</h2>
      {children}
    </div>
  );
}
