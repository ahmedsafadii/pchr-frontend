"use client";

import { useLocale, useTranslations } from "next-globe-gen";
import LawyerHeader from "./components/LawyerHeader";
import Link from "next/link";
import "@/app/css/lawyer.css";
import { IconHourglassLow, IconProgressBolt, IconProgressCheck } from "@tabler/icons-react";

// Mock data - replace with real API calls
const mockStats = {
  pending: 30,
  inProgress: 4,
  completed: 4
};

const mockRecentCases = [
  {
    id: "23444",
    name: "Ahmed Khaled",
    detaineeId: "600",
    clientName: "Cooper, Kristin",
    clientPhone: "(201) 555-0124",
    creationDate: "November 16, 2014",
    status: "Under Review"
  },
  {
    id: "23445", 
    name: "Ahmed Khaled",
    detaineeId: "600",
    clientName: "Cooper, Kristin", 
    clientPhone: "(201) 555-0124",
    creationDate: "November 16, 2014",
    status: "Under Review"
  },
  {
    id: "23446",
    name: "Ahmed Khaled", 
    detaineeId: "600",
    clientName: "Cooper, Kristin",
    clientPhone: "(201) 555-0124", 
    creationDate: "November 16, 2014",
    status: "Under Review"
  }
];

function LawyerDashboardInner() {
  const t = useTranslations();
  const locale = useLocale();

  // Generate calendar days
  const generateCalendarDays = () => {
    const days = [];
    const daysOfWeek = ['S', 'S', 'M', 'T', 'W', 'T', 'F'];
    
    // Add day headers
    daysOfWeek.forEach((day, index) => {
      days.push(
        <div key={`header-${index}`} className="lawyer__calendar-day lawyer__calendar-day--header">
          {day}
        </div>
      );
    });

    // Add calendar days (simplified)
    for (let i = 1; i <= 30; i++) {
      const isToday = i === 1;
      const hasEvent = i === 15 || i === 22;
      days.push(
        <div 
          key={i} 
          className={`lawyer__calendar-day ${isToday ? 'lawyer__calendar-day--today' : ''} ${hasEvent ? 'lawyer__calendar-day--event' : ''}`}
        >
          {i}
        </div>
      );
    }
    
    return days;
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
                <h1 className="lawyer__welcome-title">{t("lawyer.dashboard.welcome")}</h1>
                <p className="lawyer__welcome-subtitle">Sami Alkhaldi</p>
              </div>
            </div>

            <div className="lawyer__stat-card">
              <div className="lawyer__stat-header">
                <div className="lawyer__stat-icon lawyer__stat-icon--pending">
                  <IconHourglassLow size={32} stroke={1.1} />
                </div>
                <div className="lawyer__stat-label">{t("lawyer.dashboard.stats.pending")}</div>
              </div>
              <div className="lawyer__stat-number">{mockStats.pending}</div>
              <Link href={`/${locale}/lawyer/cases?status=pending`} className="lawyer__stat-link">
                {t("lawyer.dashboard.stats.showCases")}
              </Link>
            </div>

            <div className="lawyer__stat-card">
              <div className="lawyer__stat-header">
                <div className="lawyer__stat-icon lawyer__stat-icon--progress">
                  <IconProgressBolt size={32} stroke={1.1} />
                </div>
                <div className="lawyer__stat-label">{t("lawyer.dashboard.stats.inProgress")}</div>
              </div>
              <div className="lawyer__stat-number">{mockStats.inProgress}</div>
              <Link href={`/${locale}/lawyer/cases?status=progress`} className="lawyer__stat-link">
                {t("lawyer.dashboard.stats.showCases")}
              </Link>
            </div>

            <div className="lawyer__stat-card">
              <div className="lawyer__stat-header">
                <div className="lawyer__stat-icon lawyer__stat-icon--completed">
                  <IconProgressCheck size={32} stroke={1.1} />
                </div>
                <div className="lawyer__stat-label">{t("lawyer.dashboard.stats.completed")}</div>
              </div>
              <div className="lawyer__stat-number">{mockStats.completed}</div>
              <Link href={`/${locale}/lawyer/cases?status=completed`} className="lawyer__stat-link">
                {t("lawyer.dashboard.stats.showCases")}
              </Link>
            </div>
          </section>

          {/* Dashboard Grid */}
          <div className="lawyer__dashboard-grid">
            {/* Calendar Section */}
            <section className="lawyer__calendar-section">
              <div className="lawyer__section-header">
                <h2 className="lawyer__section-title">{t("lawyer.dashboard.calendar.title")}</h2>
                <span className="lawyer__section-subtitle">{t("lawyer.dashboard.calendar.month")}</span>
              </div>
              <div className="lawyer__calendar">
                {generateCalendarDays()}
              </div>
            </section>

            {/* Recent Cases Section */}
            <section className="lawyer__recent-cases">
              <div className="lawyer__section-header">
                <h2 className="lawyer__section-title">{t("lawyer.dashboard.recentCases.title")}</h2>
                <Link href={`/${locale}/lawyer/cases`} className="lawyer__section-link">
                  {t("lawyer.dashboard.recentCases.viewAll")}
                </Link>
              </div>
              <div className="lawyer__cases-list">
                {mockRecentCases.map((caseItem) => (
                  <div key={caseItem.id} className="lawyer__case-item">
                    <div className="lawyer__case-info">
                      <div className="lawyer__case-name">{caseItem.name}</div>
                      <div className="lawyer__case-details">
                        <span className="lawyer__case-id">#{caseItem.id}</span>
                        <span className="lawyer__case-date">{caseItem.creationDate}</span>
                      </div>
                    </div>
                    <div className="lawyer__case-status">
                      <span className="lawyer__case-status-badge lawyer__case-status-badge--review">
                        {caseItem.status}
                      </span>
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