"use client";

import { useLocale, useTranslations } from "next-globe-gen";
import LawyerHeader from "./components/LawyerHeader";
import VisitsCalendar from "./components/VisitsCalendar";
import Link from "next/link";
import { useRouter } from "next/navigation";
import "@/app/css/lawyer.css";
import LawyerProtectedLayout from "../components/LawyerProtectedLayout";
import {
  IconHourglassLow,
  IconProgressBolt,
  IconProgressCheck,
  IconMessage,
  IconAlertCircle,
} from "@tabler/icons-react";
import { useState, useEffect } from "react";
import { getLawyerDashboard } from "@/_app/utils/apiWithAuth";
import { LawyerAuth } from "@/_app/utils/auth";

// TypeScript interfaces for dashboard data
interface CaseStatistics {
  total: number;
  pending: number;
  in_progress: number;
  completed: number;
  urgent: number;
}

interface VisitStatistics {
  total: number;
  upcoming: number;
  completed: number;
  pending: number;
}

interface UpcomingVisit {
  id: string;
  title: string;
  case_number: string;
  detainee_name: string;
  visit_date: string;
  visit_time: string | null;
  visit_type: string;
  status: string;
  is_urgent: boolean;
  prison_name: string;
}

interface LatestCase {
  id: string;
  case_number: string;
  detainee_name: string;
  client_name: string;
  client_phone: string;
  detainee_id: string;
  status: string;
  status_display: string;
  is_urgent: boolean;
  created: string;
  updated: string;
  detention_location: string;
}

interface DashboardData {
  case_statistics: CaseStatistics;
  visit_statistics: VisitStatistics;
  upcoming_visits: UpcomingVisit[];
  latest_cases: LatestCase[];
  last_updated: string;
}

function LawyerDashboardInner() {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Get lawyer user data
  const userData = LawyerAuth.getUserData();
  const lawyerName = userData ? `${userData.first_name} ${userData.last_name}` : "";

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getLawyerDashboard(locale);
        
        if (response.status === 'success') {
          console.log('Dashboard data received:', response.data);
          setDashboardData(response.data);
        } else {
          setError(response.message || t("lawyer.dashboard.error.general"));
        }
      } catch (err: any) {
        console.error('Dashboard fetch error:', err);
        setError(err.message || t("lawyer.dashboard.error.general"));
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [locale, t]);

  // Handle case click from calendar
  const handleCaseClick = (caseId: string) => {
    router.push(`/${locale}/lawyer/cases/${caseId}`);
  };

  // Format date helper
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString(locale === 'ar' ? 'ar-EG' : 'en-US');
    } catch {
      return dateString;
    }
  };



  if (loading) {
    return (
      <div className="lawyer">
        <div className="lawyer__container">
          <LawyerHeader activeTab="overview" />
          <main className="lawyer__dashboard">
            <div className="lawyer__loading">
              <div className="lawyer__loading-spinner"></div>
              <p>{t("lawyer.dashboard.loading")}</p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="lawyer">
        <div className="lawyer__container">
          <LawyerHeader activeTab="overview" />
          <main className="lawyer__dashboard">
            <div className="lawyer__error">
              <IconAlertCircle size={48} stroke={1.5} />
              <p>{error}</p>
              <button 
                onClick={() => window.location.reload()} 
                className="lawyer__error-retry"
              >
                {t("lawyer.dashboard.retry")}
              </button>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return null;
  }

  return (
    <div className="lawyer">
      <div className="lawyer__container">
        {/* Header */}
        <LawyerHeader activeTab="overview" />

        {/* Dashboard Content */}
        <main className="lawyer__dashboard">
          {/* Stats Cards with Welcome */}
          <section className="lawyer__stats">
            {/* Welcome Card */}
            <div className="lawyer__stat-card lawyer__stat-card--welcome">
              <div className="lawyer__welcome-content">
                <h1 className="lawyer__welcome-title">
                  {t("lawyer.dashboard.welcome")}
                </h1>
                <p className="lawyer__welcome-subtitle">{lawyerName}</p>
              </div>
            </div>

            <div className="lawyer__stat-card">
              <div className="lawyer__stat-header">
                <div className="lawyer__stat-icon">
                  <IconHourglassLow size={32} stroke={1.1} />
                </div>
                <div className="lawyer__stat-label">
                  {t("lawyer.dashboard.stats.pending")}
                </div>
              </div>
              <div className="lawyer__stat-number">{dashboardData.case_statistics.pending}</div>
              <Link
                href={`/${locale}/lawyer/cases?status=pending`}
                className="lawyer__stat-link"
              >
                {t("lawyer.dashboard.stats.showCases")}
              </Link>
            </div>

            <div className="lawyer__stat-card">
              <div className="lawyer__stat-header">
                <div className="lawyer__stat-icon lawyer__stat-icon--progress">
                  <IconProgressBolt size={32} stroke={1.1} />
                </div>
                <div className="lawyer__stat-label">
                  {t("lawyer.dashboard.stats.inProgress")}
                </div>
              </div>
              <div className="lawyer__stat-number">{dashboardData.case_statistics.in_progress}</div>
              <Link
                href={`/${locale}/lawyer/cases?status=in_progress`}
                className="lawyer__stat-link"
              >
                {t("lawyer.dashboard.stats.showCases")}
              </Link>
            </div>

            <div className="lawyer__stat-card">
              <div className="lawyer__stat-header">
                <div className="lawyer__stat-icon lawyer__stat-icon--completed">
                  <IconProgressCheck size={32} stroke={1.1} />
                </div>
                <div className="lawyer__stat-label">
                  {t("lawyer.dashboard.stats.completed")}
                </div>
              </div>
              <div className="lawyer__stat-number">{dashboardData.case_statistics.completed}</div>
              <Link
                href={`/${locale}/lawyer/cases?status=completed`}
                className="lawyer__stat-link"
              >
                {t("lawyer.dashboard.stats.showCases")}
              </Link>
            </div>


          </section>

          {/* Dashboard Grid */}
          <div className="lawyer__dashboard-grid">
            {/* Calendar Section */}
            <section className="lawyer__calendar-section">
              <div className="lawyer__section-header">
                <h2 className="lawyer__section-title">{t("lawyer.dashboard.upcomingVisits.title")}</h2>
                <Link
                  href={`/${locale}/lawyer/visits`}
                  className="lawyer__section-link"
                >
                  {t("lawyer.dashboard.upcomingVisits.viewAll")}
                </Link>
              </div>
              <VisitsCalendar 
                onCaseClick={handleCaseClick} 
                upcomingVisits={dashboardData?.upcoming_visits || []}
              />
            </section>

            {/* Recent Cases Section */}
            <section className="lawyer__recent-cases">
              <div className="lawyer__section-header">
                <div className="lawyer__section-title-with-icon">
                  <IconMessage size={24} stroke={1.5} />
                  <h2 className="lawyer__section-title">
                    {t("lawyer.dashboard.recentCases.title")}
                  </h2>
                </div>
                <Link
                  href={`/${locale}/lawyer/cases`}
                  className="lawyer__section-link"
                >
                  {t("lawyer.dashboard.recentCases.viewAll")}
                </Link>
              </div>
              <div className="lawyer__cases-list">
                {dashboardData.latest_cases.slice(0, 3).map((caseItem) => (
                  <div key={caseItem.id} className="lawyer__case-item">
                    {/* Avatar */}
                    <div className="lawyer__case-avatar">
                      {caseItem.detainee_name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .substring(0, 2)}
                    </div>

                    {/* Main Case Info */}
                    <div className="lawyer__case-main">
                      <div className="lawyer__case-title">
                        <Link 
                          href={`/${locale}/lawyer/cases/${caseItem.id}`}
                          className="lawyer__case-link"
                        >
                          {caseItem.case_number}: {caseItem.detainee_name}
                        </Link>
                        {caseItem.is_urgent && (
                          <span className="lawyer__case-urgent-badge">
                            <IconAlertCircle size={16} stroke={1.5} />
                            {t("lawyer.dashboard.stats.urgent")}
                          </span>
                        )}
                      </div>

                      {/* Case Details Grid */}
                      <div className="lawyer__case-details-grid">
                        <div className="lawyer__case-detail">
                          <span className="lawyer__case-detail-label">
                            {t("lawyer.cases.table.status")}
                          </span>
                          <span className={`lawyer__case-status-badge case-status--${caseItem.status_display.toLowerCase().replace(/\s+/g, '-')}`}>
                            {caseItem.status_display}
                          </span>
                        </div>
                        <div className="lawyer__case-detail">
                          <span className="lawyer__case-detail-label">
                            {t("lawyer.cases.columns.detaineeId")}
                          </span>
                          <span className="lawyer__case-detail-value">
                            {caseItem.detainee_id}
                          </span>
                        </div>
                        <div className="lawyer__case-detail">
                          <span className="lawyer__case-detail-label">
                            {t("lawyer.cases.table.clientPhone")}
                          </span>
                          <span className="lawyer__case-detail-value">
                            {caseItem.client_phone}
                          </span>
                        </div>
                        <div className="lawyer__case-detail">
                          <span className="lawyer__case-detail-label">
                            {t("lawyer.cases.table.clientName")}
                          </span>
                          <span className="lawyer__case-detail-value">
                            {caseItem.client_name}
                          </span>
                        </div>
                        <div className="lawyer__case-detail">
                          <span className="lawyer__case-detail-label">
                            {t("lawyer.cases.columns.creationDate")}
                          </span>
                          <span className="lawyer__case-detail-value">
                            {formatDate(caseItem.created)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}

export default function LawyerDashboardPage() {
  return (
    <LawyerProtectedLayout>
      <LawyerDashboardInner />
    </LawyerProtectedLayout>
  );
}
