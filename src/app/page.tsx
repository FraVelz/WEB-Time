import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "WEB-Time",
  description: "Countdowns personales, Pomodoro, temporizador y hora mundial.",
};

export default function Home() {
  redirect("/inicio");
}
