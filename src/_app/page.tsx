import type { Metadata } from "next";
import Logo from "./components/Logo";
import "@/app/css/landing.css";
import LanguageSwitcher from "./components/LanguageSwitcher";
import { getTranslations, useTranslations, useLocale } from "next-globe-gen";
import Link from "next/link";
import { generatePageMetadata } from "./utils/metadata";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations();
  return generatePageMetadata(t("landing.title"), t("landing.description"), {
    url: "/",
    keywords: [
      "PCHR",
      "Palestinian Centre for Human Rights",
      "missing persons",
      "disappearance report",
      "Gaza",
      "human rights",
      "legal assistance",
      "case tracking",
      "home",
      "landing page",
    ],
  });
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
          {/* Lawyer login hidden */}
          {/* <Link
            href={`${currentLocale}/lawyer-login`}
            className="landing__action-btn"
          >
            {t("landing.header.lawyerLogin")}
          </Link> */}
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
            <Link href={`${currentLocale}/new`} className="landing__card-btn">
              {t("landing.newcase.action")}
            </Link>
          </article>
          {/* Track Card */}
          <article className="landing__card">
            <h2 className="landing__card-title">{t("landing.status.title")}</h2>

            <Link href={`${currentLocale}/track`} className="landing__card-btn">
              {t("landing.status.action")}
            </Link>
          </article>
        </section>
      </main>
    </div>
  );
}
