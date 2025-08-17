"use client";

import { useLocale, useTranslations } from "next-globe-gen";
import LawyerHeader from "./components/LawyerHeader";
import VisitsCalendar from "./components/VisitsCalendar";
import Link from "next/link";
import { useRouter } from "next/navigation";
import "@/app/css/lawyer.css";
import {
  IconHourglassLow,
  IconProgressBolt,
  IconProgressCheck,
  IconMessage,
} from "@tabler/icons-react";

// Mock data - replace with real API calls
const mockStats = {
  pending: 30,
  inProgress: 4,
  completed: 4,
};

const mockRecentCases = [
  {
    id: "23444",
    name: "Ahmed Khaled",
    detaineeId: "600",
    clientName: "Cooper, Kristin",
    clientPhone: "(201) 555-0124",
    creationDate: "November 16, 2014",
    status: "Under Review",
  },
  {
    id: "23445",
    name: "Ahmed Khaled",
    detaineeId: "600",
    clientName: "Cooper, Kristin",
    clientPhone: "(201) 555-0124",
    creationDate: "November 16, 2014",
    status: "Under Review",
  },
  {
    id: "23446",
    name: "Ahmed Khaled",
    detaineeId: "600",
    clientName: "Cooper, Kristin",
    clientPhone: "(201) 555-0124",
    creationDate: "November 16, 2014",
    status: "Under Review",
  },
];

function LawyerDashboardInner() {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();

  // Handle case click from calendar
  const handleCaseClick = (caseNumber: string) => {
    router.push(`/${locale}/lawyer/cases/${caseNumber}`);
  };

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
                <p className="lawyer__welcome-subtitle">Sami Alkhaldi</p>
              </div>
            </div>

            <div className="lawyer__stat-card">
              <div className="lawyer__stat-header">
                <div className="lawyer__stat-icon lawyer__stat-icon--pending">
                  <IconHourglassLow size={32} stroke={1.1} />
                </div>
                <div className="lawyer__stat-label">
                  {t("lawyer.dashboard.stats.pending")}
                </div>
              </div>
              <div className="lawyer__stat-number">{mockStats.pending}</div>
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
              <div className="lawyer__stat-number">{mockStats.inProgress}</div>
              <Link
                href={`/${locale}/lawyer/cases?status=progress`}
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
              <div className="lawyer__stat-number">{mockStats.completed}</div>
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
                <h2 className="lawyer__section-title">Upcoming Visits</h2>
              </div>
              <VisitsCalendar onCaseClick={handleCaseClick} />
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
                {mockRecentCases.map((caseItem) => (
                  <div key={caseItem.id} className="lawyer__case-item">
                    {/* Avatar */}
                    <div className="lawyer__case-avatar">
                      {caseItem.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .substring(0, 2)}
                    </div>

                    {/* Main Case Info */}
                    <div className="lawyer__case-main">
                      <div className="lawyer__case-title">
                        Case: {caseItem.name}
                      </div>

                      {/* Case Details Grid */}
                      <div className="lawyer__case-details-grid">
                        <div className="lawyer__case-detail">
                          <span className="lawyer__case-detail-label">
                            Status
                          </span>
                          <span className="lawyer__case-status-badge lawyer__case-status-badge--review">
                            {caseItem.status}
                          </span>
                        </div>
                        <div className="lawyer__case-detail">
                          <span className="lawyer__case-detail-label">
                            Detainee ID
                          </span>
                          <span className="lawyer__case-detail-value">
                            {caseItem.detaineeId}
                          </span>
                        </div>
                        <div className="lawyer__case-detail">
                          <span className="lawyer__case-detail-label">
                            Client Phone
                          </span>
                          <span className="lawyer__case-detail-value">
                            {caseItem.clientPhone}
                          </span>
                        </div>
                        <div className="lawyer__case-detail">
                          <span className="lawyer__case-detail-label">
                            Client Name
                          </span>
                          <span className="lawyer__case-detail-value">
                            {caseItem.clientName}
                          </span>
                        </div>
                        <div className="lawyer__case-detail">
                          <span className="lawyer__case-detail-label">
                            Creation Date
                          </span>
                          <span className="lawyer__case-detail-value">
                            {caseItem.creationDate}
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
  return <LawyerDashboardInner />;
}
