import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Countdowns y Pomodoro — 2027, 18 años, 20, 25, 30, 2045",
  description:
    "Countdowns hacia 2027, mayoría de edad, cumpleaños 20, 25, 30, año 2045 y temporizador Pomodoro.",
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
