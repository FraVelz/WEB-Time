import Link from "next/link";

const SECTION_LINKS = [
  { href: "/inicio", label: "Inicio" },
  { href: "/pomodoro", label: "Pomodoro" },
  { href: "/temporizador", label: "Temporizador" },
  { href: "/hora", label: "Hora mundial" },
] as const;

export default function NotFoundPage() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4 py-16 md:py-24">
      <div className="mx-auto w-full max-w-lg text-center">
        <p className="mb-2 font-mono text-sm font-medium text-[var(--color-accent)]">Error 404</p>
        <h1 className="mb-3 text-4xl font-semibold text-[var(--color-text)] md:text-5xl">Página no encontrada</h1>
        <p className="mb-10 text-lg text-[var(--color-muted)]">
          La ruta que intentaste abrir no existe. Prueba una de estas secciones:
        </p>

        <nav className="mb-10 flex flex-wrap justify-center gap-3" aria-label="Secciones principales">
          {SECTION_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2 text-sm font-medium text-[var(--color-text)] transition-colors hover:border-[var(--color-accent-soft)] hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-accent)]"
            >
              {label}
            </Link>
          ))}
        </nav>

        <Link
          href="/inicio"
          className="inline-flex cursor-pointer items-center justify-center rounded-lg bg-[var(--color-accent)] px-6 py-3 text-sm font-semibold text-white transition hover:brightness-110"
        >
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}
