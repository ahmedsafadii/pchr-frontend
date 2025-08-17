"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-globe-gen";
import LawyerHeader from "../../components/LawyerHeader";
import "@/app/css/lawyer.css";
import { usePathname, useParams } from "next/navigation";
import { IconFileText, IconCalendar, IconMessage, IconFiles } from "@tabler/icons-react";

interface LawyerCaseLayoutProps {
  children: React.ReactNode;
}

export default function LawyerCaseLayout({ children }: LawyerCaseLayoutProps) {
  const t = useTranslations();
  const locale = useLocale();
  const pathname = usePathname();
  const params = useParams();
  const caseId = params.id as string;

  const isActiveRoute = (route: string) => {
    if (route === 'details') {
      return pathname === `/${locale}/lawyer/cases/${caseId}`;
    }
    return pathname.includes(`/${route}`);
  };

  return (
    <div className="lawyer">
      <div className="lawyer__container">
        {/* Header */}
        <LawyerHeader activeTab="cases" />

        {/* Case Layout */}
        <main className="lawyer__case-layout">
          {/* Sidebar Navigation */}
          <aside className="lawyer__case-sidebar">
            <div className="lawyer__case-header">
              <h1 className="lawyer__case-title">
                {t("lawyer.caseDetails.title")} #{caseId}
              </h1>
              <Link href={`/${locale}/lawyer/cases`} className="lawyer__back-link">
                ← {t("lawyer.caseDetails.backToCases")}
              </Link>
            </div>
            
            <nav className="lawyer__case-nav">
              <Link 
                href={`/${locale}/lawyer/cases/${caseId}`}
                className={`lawyer__case-nav-item ${isActiveRoute('details') ? 'lawyer__case-nav-item--active' : ''}`}
              >
                <div className="lawyer__case-nav-icon">
                  <IconFileText size={20} />
                </div>
                <span>{t("lawyer.caseDetails.navigation.allDetails")}</span>
              </Link>
              
              <Link 
                href={`/${locale}/lawyer/cases/${caseId}/visits`}
                className={`lawyer__case-nav-item ${isActiveRoute('visits') ? 'lawyer__case-nav-item--active' : ''}`}
              >
                <div className="lawyer__case-nav-icon">
                  <IconCalendar size={20} />
                </div>
                <span>{t("lawyer.caseDetails.navigation.visits")}</span>
              </Link>
              
              <Link 
                href={`/${locale}/lawyer/cases/${caseId}/messages`}
                className={`lawyer__case-nav-item ${isActiveRoute('messages') ? 'lawyer__case-nav-item--active' : ''}`}
              >
                <div className="lawyer__case-nav-icon">
                  <IconMessage size={20} />
                </div>
                <span>{t("lawyer.caseDetails.navigation.messages")}</span>
              </Link>
              
              <Link 
                href={`/${locale}/lawyer/cases/${caseId}/files`}
                className={`lawyer__case-nav-item ${isActiveRoute('files') ? 'lawyer__case-nav-item--active' : ''}`}
              >
                <div className="lawyer__case-nav-icon">
                  <IconFiles size={20} />
                </div>
                <span>{t("lawyer.caseDetails.navigation.files")}</span>
              </Link>
            </nav>
          </aside>

          {/* Main Content */}
          <section className="lawyer__case-content">
            {children}
          </section>
        </main>
      </div>
    </div>
  );
}