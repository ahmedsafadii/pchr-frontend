"use client";

import { useTranslations } from "next-globe-gen";

// Mock visits data - replace with real API calls
const mockVisitsData = {
  toDo: [
    {
      id: 1,
      title: "Visit - 12 Feb 202",
      description: "Visiting Ahmed At Majdl Person At Sunday 12 Feb 2021",
      status: "Pending",
      actions: ["✓ Visit Approve", "✗ Visit Rejected"]
    },
    {
      id: 2,
      title: "Visit - 12 Feb 2021",
      description: "Visiting Ahmed At Majdl Person At Sunday 12 Feb 2021",
      status: "Pending",
      actions: []
    }
  ],
  onProgress: [
    {
      id: 3,
      title: "Visit - 11 Feb 20",
      description: "Visiting Ahmed At Majdl Person At Sunday 12 Feb 2021",
      status: "On Progress",
      actions: ["Visit Outcome"]
    }
  ],
  done: [
    {
      id: 4,
      title: "Visit - 11 Feb 2021",
      description: "Visiting Ahmed At Majdl Person At Sunday 12 Feb 2021",
      status: "Done",
      outcome: {
        title: "Outcome",
        text: "Lorem Ipsum Is Simply Dummy Text Of The Printing And Typesetting Industry. Lorem Ipsum Has Been The Industry's Standard Dummy Text Ever Since"
      }
    },
    {
      id: 5,
      title: "Visit - 11 Feb 2021",
      description: "Visiting Ahmed At Majdl Person At Sunday 12 Feb 2021",
      status: "Rejected",
      rejectionReason: {
        title: "Rejection reason",
        text: "Lorem Ipsum Is Simply Dummy Text Of The Printing And Typesetting Industry. Lorem Ipsum Has Been The Industry's Standard Dummy Text Ever Since"
      }
    }
  ]
};

export default function LawyerCaseVisitsPage() {
  const t = useTranslations();

  const renderVisitCard = (visit: any) => (
    <div key={visit.id} className="lawyer__visit-card">
      <div className={`lawyer__visit-status lawyer__visit-status--${visit.status.toLowerCase().replace(' ', '')}`}>
        {visit.status}
      </div>
      
      <h3 className="lawyer__visit-title">{visit.title}</h3>
      <p className="lawyer__visit-info">{visit.description}</p>
      
      {visit.actions && visit.actions.length > 0 && (
        <div className="lawyer__visit-actions">
          {visit.actions.map((action: string, index: number) => (
            <button key={index} className="lawyer__visit-action">
              {action}
            </button>
          ))}
        </div>
      )}

      {visit.outcome && (
        <div className="lawyer__visit-outcome">
          <h4 className="lawyer__visit-outcome-title">{visit.outcome.title}</h4>
          <p className="lawyer__visit-outcome-text">{visit.outcome.text}</p>
        </div>
      )}

      {visit.rejectionReason && (
        <div className="lawyer__visit-outcome">
          <h4 className="lawyer__visit-outcome-title">{visit.rejectionReason.title}</h4>
          <p className="lawyer__visit-outcome-text">{visit.rejectionReason.text}</p>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Header */}
      <div className="lawyer__visits-header">
        <h1 className="lawyer__visits-title">{t("lawyer.visits.title")}</h1>
        <button className="lawyer__start-visit-btn">
          {t("lawyer.visits.startVisit")}
        </button>
      </div>

      {/* To Do Section */}
      <section className="lawyer__visits-section">
        <div className="lawyer__visits-section-header">
          <div className="lawyer__visits-section-dot lawyer__visits-section-dot--todo"></div>
          <h2 className="lawyer__visits-section-title">{t("lawyer.visits.toDo")}</h2>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: '12px' }}>
            <span>‹</span>
            <span>›</span>
          </div>
        </div>
        <div className="lawyer__visits-grid">
          {mockVisitsData.toDo.map(renderVisitCard)}
        </div>
      </section>

      {/* On Progress Section */}
      <section className="lawyer__visits-section">
        <div className="lawyer__visits-section-header">
          <div className="lawyer__visits-section-dot lawyer__visits-section-dot--progress"></div>
          <h2 className="lawyer__visits-section-title">{t("lawyer.visits.onProgress")}</h2>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: '12px' }}>
            <span>‹</span>
            <span>›</span>
          </div>
        </div>
        <div className="lawyer__visits-grid">
          {mockVisitsData.onProgress.map(renderVisitCard)}
        </div>
      </section>

      {/* Done Section */}
      <section className="lawyer__visits-section">
        <div className="lawyer__visits-section-header">
          <div className="lawyer__visits-section-dot lawyer__visits-section-dot--done"></div>
          <h2 className="lawyer__visits-section-title">{t("lawyer.visits.done")}</h2>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: '12px' }}>
            <span>‹</span>
            <span>›</span>
          </div>
        </div>
        <div className="lawyer__visits-grid">
          {mockVisitsData.done.map(renderVisitCard)}
        </div>
      </section>
    </>
  );
}
