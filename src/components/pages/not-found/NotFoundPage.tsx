import Link from "next/link";

export default function NotFoundPage() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4 py-16 md:py-24">
      <div className="mx-auto w-full max-w-lg text-center">
        <p className="mb-2 font-mono text-sm font-medium text-accent">Error 404</p>
        <h1 className="mb-3 text-4xl font-semibold text-text md:text-5xl">Página no encontrada</h1>
        <p className="mb-10 text-lg text-muted">
          La ruta que intentaste abrir no existe. Prueba una de estas secciones:
        </p>

        <nav className="mb-10 flex flex-wrap justify-center gap-3" aria-label="Secciones principales">
          {[
            { path: "/inicio", label: "Inicio" },
            { path: "/pomodoro", label: "Pomodoro" },
            { path: "/temporizador", label: "Temporizador" },
            { path: "/hora", label: "Hora mundial" },
          ].map(({ path, label }) => (
            <Link
              key={path}
              href={path}
              className="rounded-xl border border-border bg-surface px-4 py-2 text-sm font-medium text-text transition-colors hover:border-accent-soft hover:bg-surface-hover hover:text-accent"
            >
              {label}
            </Link>
          ))}
        </nav>

        <Link
          href="/inicio"
          className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-accent px-6 py-3 text-sm font-semibold text-white transition-all hover:brightness-110"
        >
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}
