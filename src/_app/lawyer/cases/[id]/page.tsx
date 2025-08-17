"use client";

import { useTranslations } from "next-globe-gen";

// Mock case data - replace with real API calls
const mockCaseData = {
  detaineeInfo: {
    fullName: "Khaled Ahmed Shaban",
    job: "Worker",
    dateOfBirth: "24 FEB 2022",
    idNumber: "123421222222",
    healthyStatus: "Bad",
    maritalStatus: "Single",
    location: "Jabalia Camp, Jabalia, Gaza Strip"
  },
  detentionInfo: {
    disappearanceDate: "24 FEB 2022",
    disappearanceStatus: "Done",
    location: "Jabalia Camp, Jabalia, Gaza Strip",
    description: "Lorem Ipsum Is Simply Dummy Text Of The Printing And Typesetting Industry. Lorem Ipsum Has Been The Industry's Standard Dummy Text Ever Since The 1500s, When An Unknown Printer Took A Galley Of Type And Scrambled It To Make A Type Specimen Book. It Has Survived Not Only Five Centuries, But Also The Leap Into"
  },
  clientInfo: {
    fullName: "Mohammed Ali",
    idNumber: "0000000000",
    phoneNumber: "059 0000000",
    relationship: "Friend"
  },
  documents: [
    { name: "ID.PDF", url: "#" },
    { name: "Proposal.PDF", url: "#" },
    { name: "Case.PDF", url: "#" },
    { name: "Terms and conditions .PD", url: "#" }
  ]
};

export default function LawyerCaseDetailsPage() {
  const t = useTranslations();

  return (
    <>
      {/* Header */}
      <div className="lawyer__case-details-header">
        <h1 className="lawyer__case-details-title">{t("lawyer.caseDetails.navigation.allDetails")}</h1>
        <button className="lawyer__start-case-btn">
          {t("lawyer.caseDetails.startCase")}
        </button>
      </div>

      {/* Detainee Information */}
      <section className="lawyer__info-section">
        <h2 className="lawyer__info-title">{t("lawyer.caseDetails.detaineeInfo.title")}</h2>
        <div className="lawyer__info-grid">
          <div className="lawyer__info-item">
            <div className="lawyer__info-label">{t("lawyer.caseDetails.detaineeInfo.fullName")}</div>
            <div className="lawyer__info-value">{mockCaseData.detaineeInfo.fullName}</div>
          </div>
          <div className="lawyer__info-item">
            <div className="lawyer__info-label">{t("lawyer.caseDetails.detaineeInfo.job")}</div>
            <div className="lawyer__info-value">{mockCaseData.detaineeInfo.job}</div>
          </div>
          <div className="lawyer__info-item">
            <div className="lawyer__info-label">{t("lawyer.caseDetails.detaineeInfo.dateOfBirth")}</div>
            <div className="lawyer__info-value">{mockCaseData.detaineeInfo.dateOfBirth}</div>
          </div>
          <div className="lawyer__info-item">
            <div className="lawyer__info-label">{t("lawyer.caseDetails.detaineeInfo.idNumber")}</div>
            <div className="lawyer__info-value">{mockCaseData.detaineeInfo.idNumber}</div>
          </div>
          <div className="lawyer__info-item">
            <div className="lawyer__info-label">{t("lawyer.caseDetails.detaineeInfo.healthyStatus")}</div>
            <div className="lawyer__info-value">{mockCaseData.detaineeInfo.healthyStatus}</div>
          </div>
          <div className="lawyer__info-item">
            <div className="lawyer__info-label">{t("lawyer.caseDetails.detaineeInfo.maritalStatus")}</div>
            <div className="lawyer__info-value">{mockCaseData.detaineeInfo.maritalStatus}</div>
          </div>
          <div className="lawyer__info-item">
            <div className="lawyer__info-label">{t("lawyer.caseDetails.detaineeInfo.location")}</div>
            <div className="lawyer__info-value">{mockCaseData.detaineeInfo.location}</div>
          </div>
        </div>
      </section>

      {/* Detention/Disappearance Info */}
      <section className="lawyer__info-section">
        <h2 className="lawyer__info-title">{t("lawyer.caseDetails.detentionInfo.title")}</h2>
        <div className="lawyer__info-grid">
          <div className="lawyer__info-item">
            <div className="lawyer__info-label">{t("lawyer.caseDetails.detentionInfo.disappearanceDate")}</div>
            <div className="lawyer__info-value">{mockCaseData.detentionInfo.disappearanceDate}</div>
          </div>
          <div className="lawyer__info-item">
            <div className="lawyer__info-label">{t("lawyer.caseDetails.detentionInfo.disappearanceStatus")}</div>
            <div className="lawyer__info-value">{mockCaseData.detentionInfo.disappearanceStatus}</div>
          </div>
          <div className="lawyer__info-item">
            <div className="lawyer__info-label">{t("lawyer.caseDetails.detentionInfo.location")}</div>
            <div className="lawyer__info-value">{mockCaseData.detentionInfo.location}</div>
          </div>
          <div className="lawyer__info-description">
            <div className="lawyer__info-label">{t("lawyer.caseDetails.detentionInfo.describeDisappearance")}</div>
            <p className="lawyer__info-description-text">{mockCaseData.detentionInfo.description}</p>
          </div>
        </div>
      </section>

      {/* Client Info */}
      <section className="lawyer__info-section">
        <h2 className="lawyer__info-title">{t("lawyer.caseDetails.clientInfo.title")}</h2>
        <div className="lawyer__info-grid">
          <div className="lawyer__info-item">
            <div className="lawyer__info-label">{t("lawyer.caseDetails.clientInfo.fullName")}</div>
            <div className="lawyer__info-value">{mockCaseData.clientInfo.fullName}</div>
          </div>
          <div className="lawyer__info-item">
            <div className="lawyer__info-label">{t("lawyer.caseDetails.clientInfo.idNumber")}</div>
            <div className="lawyer__info-value">{mockCaseData.clientInfo.idNumber}</div>
          </div>
          <div className="lawyer__info-item">
            <div className="lawyer__info-label">{t("lawyer.caseDetails.clientInfo.phoneNumber")}</div>
            <div className="lawyer__info-value">{mockCaseData.clientInfo.phoneNumber}</div>
          </div>
          <div className="lawyer__info-item">
            <div className="lawyer__info-label">{t("lawyer.caseDetails.clientInfo.relationship")}</div>
            <div className="lawyer__info-value">{mockCaseData.clientInfo.relationship}</div>
          </div>
        </div>
      </section>

      {/* Documents Upload */}
      <section className="lawyer__info-section">
        <h2 className="lawyer__info-title">{t("lawyer.caseDetails.documentsUpload.title")}</h2>
        <div className="lawyer__documents">
          {mockCaseData.documents.map((doc, index) => (
            <a key={index} href={doc.url} className="lawyer__document-link">
              <span>📄</span>
              <span>{doc.name}</span>
            </a>
          ))}
        </div>
      </section>
    </>
  );
}
