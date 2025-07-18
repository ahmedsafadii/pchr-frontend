import type { Metadata } from "next";
import Image from "next/image";
import "@/app/css/landing.css";

export const metadata: Metadata = {
  title: "Disappearance Report Platform | Palestinian Centre for Human Rights",
  description:
    "A digital platform dedicated to helping families in Gaza report missing or detained persons, check case status, and communicate securely with legal professionals.",
};

export default function Home() {
  return (
    <div className="landing">
      {/* Header */}
      <header className="landing__header">
        <div className="landing__logo">
          <Image
            src="/img/logo_en.svg"
            alt="PCHR Logo"
            width={218}
            height={93}
          />
        </div>
        <nav className="landing__actions" aria-label="Main actions">
          <button className="landing__action-btn">Lawyer Login</button>
          <button className="landing__action-btn">عربي</button>
        </nav>
      </header>

      {/* Main Content */}
      <main className="landing__main">
        <section className="landing__intro">
          <h1 className="landing__title">
            Disappearance Report
            <br />
            Platform
          </h1>
          <p className="landing__desc">
            A digital platform dedicated to helping families in Gaza report
            missing persons during crises, wars, or disasters. It allows people
            to submit details, photos, and contact information securely.
          </p>
        </section>

        {/* Cards */}
        <section className="landing__cards">
          {/* Report Card */}
          <article className="landing__card">
            <h2 className="landing__card-title">
              REPORT A MISSING OR DETAINED PERSON
            </h2>
            <p className="landing__card-desc">
              A digital platform dedicated to helping families in Gaza report
              missing persons during crises, wars, or disasters. It allows
              people to submit details, photos, and contact information
              securely.
            </p>
            <button className="landing__card-btn">
              REPORT NEW CASE
            </button>
          </article>
          {/* Track Card */}
          <article className="landing__card">
            <h2 className="landing__card-title">CHECK CASE STATUS</h2>
            <p className="landing__card-desc">
              A digital platform dedicated to helping families in Gaza report
              missing persons during crises, wars, or disasters. It allows
              people to submit details, photos, and contact information
              securely.
            </p>
            <button className="landing__card-btn">TRACK NOW</button>
          </article>
        </section>
      </main>
    </div>
  );
}
