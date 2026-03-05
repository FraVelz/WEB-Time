"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const SECTIONS = [
  { path: "/inicio", label: "Inicio" },
  { path: "/pomodoro", label: "Pomodoro" },
  { path: "/temporizador", label: "Temporizador" },
  { path: "/hora", label: "Hora" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header
      className="sticky top-0 z-50 border-b border-[var(--color-border)] bg-[var(--color-bg)]/95 backdrop-blur supports-[backdrop-filter]:bg-[var(--color-bg)]/80"
      role="banner"
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 md:px-6">
        <Link
          href="/inicio"
          className="text-lg font-semibold text-[var(--color-text)] hover:text-[var(--color-accent)] transition-colors"
        >
          WEB-Time
        </Link>

        <button
          type="button"
          className="md:hidden flex flex-col gap-1.5 w-10 h-10 justify-center items-center rounded-lg border border-[var(--color-border)] text-[var(--color-text)] hover:bg-[var(--color-surface)]"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-controls="nav-menu"
        >
          <span className={`w-5 h-0.5 bg-current transition-transform ${open ? "rotate-45 translate-y-1" : ""}`} />
          <span className={`w-5 h-0.5 bg-current transition-opacity ${open ? "opacity-0" : ""}`} />
          <span className={`w-5 h-0.5 bg-current transition-transform ${open ? "-rotate-45 -translate-y-1" : ""}`} />
        </button>

        <nav
          id="nav-menu"
          className={`absolute top-full left-0 right-0 flex flex-col gap-1 border-b border-[var(--color-border)] bg-[var(--color-bg)] p-4 md:static md:flex-row md:border-0 md:bg-transparent md:p-0 ${open ? "flex" : "hidden md:flex"}`}
          aria-label="Secciones principales"
        >
          {SECTIONS.map(({ path, label }) => {
            const isActive = pathname === path || (path === "/inicio" && pathname === "/");
            return (
              <Link
                key={path}
                href={path}
                className={`rounded-lg px-4 py-2 transition-colors ${
                  isActive
                    ? "text-[var(--color-accent)] bg-[var(--color-surface)]"
                    : "text-[var(--color-text)] hover:bg-[var(--color-surface)] hover:text-[var(--color-accent)]"
                }`}
                onClick={() => setOpen(false)}
              >
                {label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
