import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-16">
        <h1 className="text-4xl font-bold text-[var(--color-text)] mb-2">
          404
        </h1>
        <p className="text-[var(--color-muted)] text-lg mb-8 text-center">
          No encontramos esta página.
        </p>
        <Link
          href="/#inicio"
          className="rounded-lg bg-[var(--color-accent)] px-6 py-3 text-sm font-semibold text-white hover:brightness-110 transition"
        >
          Volver al inicio
        </Link>
      </main>
    </div>
  );
}
