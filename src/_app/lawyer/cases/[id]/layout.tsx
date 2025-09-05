"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-globe-gen";
import LawyerHeader from "../../components/LawyerHeader";
import "@/app/css/lawyer.css";
import LawyerProtectedLayout from "../../../components/LawyerProtectedLayout";
import { usePathname, useParams } from "next/navigation";
import {
  IconFileText,
  IconCalendar,
  IconMessage,
  IconFiles,
} from "@tabler/icons-react";
import { useEffect, useState, useCallback } from "react";
import { getLawyerCaseDetails } from "../../../utils/apiWithAuth";
import { useLawyerAuth } from "../../../hooks/useLawyerAuth";
import { formatDateWithLocale } from "../../../utils/dateUtils";
import { CaseData } from "../../../../types/case";

interface LawyerCaseLayoutProps {
  children: React.ReactNode;
}

export default function LawyerCaseLayout({ children }: LawyerCaseLayoutProps) {
  return (
    <LawyerProtectedLayout>
      <LawyerCaseLayoutInner>{children}</LawyerCaseLayoutInner>
    </LawyerProtectedLayout>
  );
}

function LawyerCaseLayoutInner({ children }: LawyerCaseLayoutProps) {
  const t = useTranslations();
  const locale = useLocale();
  const pathname = usePathname();
  const params = useParams();
  const caseId = params.id as string;
  const { isAuthenticated } = useLawyerAuth();

  const [caseData, setCaseData] = useState<CaseData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCaseDetails = useCallback(async () => {
    if (!caseId) return;

    try {
      setLoading(true);
      const response = await getLawyerCaseDetails(caseId, locale);

      if (response.status === "success") {
        // Check different possible data structures
        if (response.data?.cases && response.data.cases.length > 0) {
          // If it's an array of cases, find the one matching the caseId
          const caseItem = response.data.cases.find(
            (caseItem: any) => caseItem.id === caseId
          );
          if (caseItem) {
            setCaseData(caseItem);
          } else {
            setError("Case not found in response");
          }
        } else if (response.data?.id === caseId) {
          // If it's a single case object
          setCaseData(response.data);
        } else if (response.data && typeof response.data === "object") {
          // If data is directly the case object
          setCaseData(response.data);
        } else {
          setError("Unexpected data structure");
        }
      } else {
        setError(response.message || "Case not found");
      }
    } catch (err) {
      console.error("Error fetching case details:", err);
      setError("Failed to load case details");
    } finally {
      setLoading(false);
    }
  }, [caseId, locale]);

  useEffect(() => {
    if (isAuthenticated && caseId) {
      fetchCaseDetails();
    }
  }, [isAuthenticated, caseId, fetchCaseDetails]);

  const isActiveRoute = (route: string) => {
    if (route === "details") {
      return pathname === `/${locale}/lawyer/cases/${caseId}`;
    }
    return pathname.includes(`/${route}`);
  };

  // Show loading state while fetching case data
  if (loading) {
    return (
      <LawyerProtectedLayout>
        <div className="lawyer">
          <div className="lawyer__container">
            <LawyerHeader activeTab="cases" />
            <main className="lawyer__case-layout">
              <aside className="lawyer__case-sidebar">
                <div className="lawyer__case-header">
                  <div className="lawyer__loading-spinner"></div>
                  <p>{t("common.loading")}</p>
                </div>
              </aside>
              <section className="lawyer__case-content">{children}</section>
            </main>
          </div>
        </div>
      </LawyerProtectedLayout>
    );
  }

  // Show error state if case data couldn't be loaded
  if (error || !caseData) {
    return (
      <LawyerProtectedLayout>
        <div className="lawyer">
          <div className="lawyer__container">
            <LawyerHeader activeTab="cases" />
            <main className="lawyer__case-layout">
              <aside className="lawyer__case-sidebar">
                <div className="lawyer__case-header">
                  <h1 className="lawyer__case-title">{t("common.error")}</h1>
                  <p className="lawyer__case-last-update">
                    {error || t("common.caseNotFound")}
                  </p>
                </div>
              </aside>
              <section className="lawyer__case-content">{children}</section>
            </main>
          </div>
        </div>
      </LawyerProtectedLayout>
    );
  }

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
                {t("lawyer.caseDetails.casePrefix")}: {caseData.detainee_name}
              </h1>
              <p className="lawyer__case-last-update">
                {t("lawyer.caseDetails.lastUpdate")}:{" "}
                {formatDateWithLocale(caseData.updated, locale)}
              </p>
            </div>

            <nav className="lawyer__case-nav">
              <Link
                href={`/${locale}/lawyer/cases/${caseId}`}
                className={`lawyer__case-nav-item ${
                  isActiveRoute("details")
                    ? "lawyer__case-nav-item--active"
                    : ""
                }`}
              >
                <div className="lawyer__case-nav-icon">
                  <IconFileText size={20} />
                </div>
                <span>{t("lawyer.caseDetails.navigation.allDetails")}</span>
              </Link>

              <Link
                href={`/${locale}/lawyer/cases/${caseId}/visits`}
                className={`lawyer__case-nav-item ${
                  isActiveRoute("visits") ? "lawyer__case-nav-item--active" : ""
                }`}
              >
                <div className="lawyer__case-nav-icon">
                  <IconCalendar size={20} />
                </div>
                <span>{t("lawyer.caseDetails.navigation.visits")}</span>
              </Link>

              <Link
                href={`/${locale}/lawyer/cases/${caseId}/messages`}
                className={`lawyer__case-nav-item ${
                  isActiveRoute("messages")
                    ? "lawyer__case-nav-item--active"
                    : ""
                }`}
              >
                <div className="lawyer__case-nav-icon">
                  <IconMessage size={20} />
                </div>
                <span>{t("lawyer.caseDetails.navigation.messages")}</span>
              </Link>

              <Link
                href={`/${locale}/lawyer/cases/${caseId}/files`}
                className={`lawyer__case-nav-item ${
                  isActiveRoute("files") ? "lawyer__case-nav-item--active" : ""
                }`}
              >
                <div className="lawyer__case-nav-icon">
                  <IconFiles size={20} />
                </div>
                <span>{t("lawyer.caseDetails.navigation.files")}</span>
              </Link>
            </nav>
          </aside>

          {/* Main Content */}
          <section className="lawyer__case-content">{children}</section>
        </main>
      </div>
    </div>
  );
}
