import type { Metadata } from "next";
import "./globals.css";
import { SiteHeader } from "@/features/shared/components/SiteHeader";
import { AppProviders } from "@/features/shared/providers/AppProviders";
import { dmSans, jetbrainsMono } from "@/features/shared/lib/fonts";

const SITE_URL = "https://fravelz.github.io/WEB-Time";

export const metadata: Metadata = {
  title: "Countdowns y Pomodoro — 2027, 18 años, 20, 25, 30, 2045",
  description: "Web personal con countdowns hacia fechas importantes personales y un temporizador Pomodoro.",
  openGraph: {
    title: "Countdowns y Pomodoro — 2027, 18 años, 20, 25, 30, 2045",
    description: "Web personal con countdowns hacia fechas importantes personales y un temporizador Pomodoro.",
    url: SITE_URL,
    siteName: "Countdowns y Pomodoro",
    locale: "es",
    type: "website",
    images: [
      {
        url: `${SITE_URL}/screenshot.png`,
        width: 1200,
        height: 630,
        alt: "Vista de la web Countdowns y Pomodoro",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Countdowns y Pomodoro — 2027, 18 años, 20, 25, 30, 2045",
    description: "Web personal con countdowns hacia fechas importantes personales y un temporizador Pomodoro.",
    images: [`${SITE_URL}/screenshot.png`],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${dmSans.variable} ${jetbrainsMono.variable} flex min-h-screen flex-col`}>
        <AppProviders>
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <footer className="border-t border-[var(--color-border)] py-6 text-center text-sm text-[var(--color-muted)]">
            <p>WEB-Time · Fravelz</p>
          </footer>
        </AppProviders>
      </body>
    </html>
  );
}
