import type { Metadata } from "next";
import "./globals.css";

const SITE_URL = "https://fravelz.github.io/WEB-Time";

export const metadata: Metadata = {
  title: "Countdowns y Pomodoro — 2027, 18 años, 20, 25, 30, 2045",
  description:
    "Web personal con countdowns hacia fechas importantes personales y un temporizador Pomodoro.",
  openGraph: {
    title: "Countdowns y Pomodoro — 2027, 18 años, 20, 25, 30, 2045",
    description:
      "Web personal con countdowns hacia fechas importantes personales y un temporizador Pomodoro.",
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
    description:
      "Web personal con countdowns hacia fechas importantes personales y un temporizador Pomodoro.",
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
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,600;0,9..40,700&family=JetBrains+Mono:wght@400;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
