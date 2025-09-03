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
          <Link
            href={`${currentLocale}/lawyer-login`}
            className="landing__action-btn"
          >
            {t("landing.header.lawyerLogin")}
          </Link>
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
            <Link href={`${currentLocale}/new`} className="landing__card-btn">
              {t("landing.newcase.action")}
            </Link>
          </article>
          {/* Track Card */}
          <article className="landing__card">
            <h2 className="landing__card-title">{t("landing.status.title")}</h2>
            <p className="landing__card-desc">
              {t("landing.status.description")}
            </p>
            <Link href={`${currentLocale}/track`} className="landing__card-btn">
              {t("landing.status.action")}
            </Link>
          </article>
        </section>
      </main>
    </div>
  );
}
