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
          <h1 className="mb-2 text-3xl font-semibold text-text md:text-4xl">{title}</h1>
          <p className="max-w-2xl text-lg text-muted">{description}</p>
        </header>
        {children}
        <Link
          href="/inicio"
          className="mt-8 inline-flex items-center gap-2 rounded-xl border border-border bg-surface px-4 py-2 text-sm text-text transition-colors hover:bg-surface-hover"
        >
          ← Volver a Inicio
        </Link>
      </div>
    </div>
  );
}
