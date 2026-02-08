import { Pomodoro } from "@/components/Pomodoro";
import { CountdownGrid } from "@/components/CountdownGrid";
import { COUNTDOWN_CONFIG } from "@/config/countdowns";

export default function Home() {
  return (
    <div className="page">
      <header className="page-header">
        <h1 className="page-title">Countdowns y Pomodoro</h1>
        <p className="page-subtitle">
          Tiempo restante hasta fechas importantes y temporizador de trabajo.
        </p>
      </header>
      <main className="page-main">
        <Pomodoro />
        <section className="countdown-section" aria-labelledby="countdown-heading">
          <h2 id="countdown-heading" className="section-heading">
            Countdowns
          </h2>
          <CountdownGrid countdowns={COUNTDOWN_CONFIG} />
        </section>
      </main>
      <footer className="page-footer">
        <p>
          Fechas en <code>config/countdowns.ts</code>. 18, 20, 25 y 30 años desde fecha de
          nacimiento (19 de mayo).
        </p>
      </footer>
    </div>
  );
}
