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
      className="border-border bg-surface text-text hover:border-accent-soft hover:bg-surface-hover rounded-xl border px-5 py-3 text-sm font-medium transition-colors"
    >
      {children}
    </Link>
  );
}
