"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-globe-gen";
import { useRouter } from "next/navigation";
import Logo from "@/_app/components/Logo";
import LanguageSwitcher from "@/_app/components/LanguageSwitcher";
import Overview from "./components/Overview";
import DisappearanceInfo from "./components/DisappearanceInfo";
import "@/app/css/track.css";

export default function CaseDetailsPage() {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [activeTab, setActiveTab] = useState<"overview" | "info">("overview");

  useEffect(() => {
    try {
      const ok = sessionStorage.getItem("track_access_granted") === "1";
      if (!ok) {
        router.replace(`/${locale}/track`);
        return;
      }
      setAuthorized(true);
    } catch {
      router.replace(`/${locale}/track`);
    }
  }, [router, locale]);

  if (!authorized) return null;

  return (
    <div className="track track--details">
      <div className="track__container">
        <header className="track__header">
          <div className="track__logo">
            <Logo />
          </div>
          <div className="track__header-controls">
            <Link href={`/${locale}/track`} className="track__back-button">
              <span>{t("track.backToSearch")}</span>
            </Link>
            <LanguageSwitcher />
          </div>
        </header>

        <main className="track__main">
          <section className="track__card" aria-labelledby="case-title">
            <div className="tabs">
              <div className="tabs__list" role="tablist">
                <button
                  role="tab"
                  className={`tabs__tab ${activeTab === "overview" ? "tabs__tab--active" : ""}`}
                  onClick={() => setActiveTab("overview")}
                >
                  {(t as any)("tabs.overview")}
                </button>
                <button
                  role="tab"
                  className={`tabs__tab ${activeTab === "info" ? "tabs__tab--active" : ""}`}
                  onClick={() => setActiveTab("info")}
                >
                  {(t as any)("tabs.info")}
                </button>
              </div>

              <div className="tabs__content">
                {activeTab === "overview" ? <Overview /> : <DisappearanceInfo />}
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}


