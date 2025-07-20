import type { Metadata } from "next";
import Logo from "./components/Logo";
import "@/app/css/landing.css";
import LanguageSwitcher from "./components/LanguageSwitcher";
import { getTranslations, useTranslations, useLocale } from "next-globe-gen";
import Link from "next/link";

export function generateMetadata(): Metadata {
  const t = getTranslations();
  return {
    description: t("landing.description")?.toString(),
    title: t("landing.title"),
  };
}

export default function Home() {
  const t = useTranslations();
  const currentLocale = useLocale();
  return (
    <div className="landing">
      {/* Header */}
      <header className="landing__header">
        <div className="landing__logo">
          <Logo />
        </div>
        <nav className="landing__actions" aria-label="Main actions">
          <button className="landing__action-btn">
            {t("landing.header.lawyerLogin")}
          </button>
          <LanguageSwitcher />
        </nav>
      </header>

      {/* Main Content */}
      <main className="landing__main">
        <section className="landing__intro">
          <h1
            className="landing__title"
            dangerouslySetInnerHTML={{ __html: t("landing.header.title") }}
          />
          <p className="landing__desc">{t("landing.header.description")}</p>
        </section>

        {/* Cards */}
        <section className="landing__cards">
          {/* Report Card */}
          <article className="landing__card">
            <h2 className="landing__card-title">
              {t("landing.newcase.title")}
            </h2>
            <p className="landing__card-desc">
              {t("landing.newcase.description")}
            </p>
            <Link
              href={`${currentLocale}/new`}
              className="landing__card-btn"
            >
              {t("landing.newcase.action")}
            </Link>
          </article>
          {/* Track Card */}
          <article className="landing__card">
            <h2 className="landing__card-title">{t("landing.status.title")}</h2>
            <p className="landing__card-desc">
              {t("landing.status.description")}
            </p>
            <button className="landing__card-btn">
              {t("landing.status.action")}
            </button>
          </article>
        </section>
      </main>
    </div>
  );
}
