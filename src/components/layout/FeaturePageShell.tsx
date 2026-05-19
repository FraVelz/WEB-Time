import Link from "next/link";
import type { ReactNode } from "react";

type FeaturePageShellProps = {
  title: string;
  description: string;
  children: ReactNode;
};

export function FeaturePageShell({ title, description, children }: FeaturePageShellProps) {
  return (
    <div className="py-12 md:py-16">
      <div className="mx-auto max-w-5xl px-4 md:px-6">
        <header className="mb-10">
          <h1 className="text-text mb-2 text-3xl font-semibold md:text-4xl">{title}</h1>
          <p className="text-muted max-w-2xl text-lg">{description}</p>
        </header>
        {children}
        <Link
          href="/inicio"
          className="border-border bg-surface text-text hover:bg-surface-hover mt-8 inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm transition-colors"
        >
          ← Volver a Inicio
        </Link>
      </div>
    </div>
  );
}
