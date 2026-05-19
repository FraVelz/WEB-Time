import Link from "next/link";
import type { ReactNode } from "react";

type InicioQuickLinkProps = {
  href: string;
  children: ReactNode;
};

export function InicioQuickLink({ href, children }: InicioQuickLinkProps) {
  return (
    <Link
      href={href}
      className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-5 py-3 text-sm font-medium text-[var(--color-text)] transition-colors hover:border-[var(--color-accent-soft)] hover:bg-[var(--color-surface-hover)]"
    >
      {children}
    </Link>
  );
}
