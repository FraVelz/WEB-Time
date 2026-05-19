import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { AppProviders } from "@/providers/AppProviders";
import { dmSans, jetbrainsMono } from "@/lib/fonts";

const SITE_URL = "https://fravelz.github.io/WEB-Time";

export const metadata: Metadata = {
  title: "Countdowns y Pomodoro: 2027, 18 años, 20, 25, 30, 2045",
  description: "Web personal con countdowns hacia fechas importantes personales y un temporizador Pomodoro.",
  openGraph: {
    title: "Countdowns y Pomodoro: 2027, 18 años, 20, 25, 30, 2045",
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
    title: "Countdowns y Pomodoro: 2027, 18 años, 20, 25, 30, 2045",
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
    <html lang="es" data-theme="dark" suppressHydrationWarning>
      <Script id="theme-init" src="/theme-init.js" strategy="beforeInteractive" />
      <body className={`${dmSans.variable} ${jetbrainsMono.variable} flex min-h-screen flex-col`}>
        <AppProviders>
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <SiteFooter />
        </AppProviders>
      </body>
    </html>
  );
}
