"use client";

import { useTranslations, useLocale } from "next-globe-gen";
import { IconAlertTriangle, IconBrandWhatsapp } from "@tabler/icons-react";
import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { getLawyerCaseDetails } from "../../../utils/apiWithAuth";
import { useLawyerAuth } from "../../../hooks/useLawyerAuth";
import UpdateCaseModal from "../../../components/modals/UpdateCaseModal";
import { formatDateWithLocale } from "../../../utils/dateUtils";
import { CaseData } from "../../../../types/case";

export default function LawyerCaseDetailsPage() {
  const t = useTranslations();
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated, isLoading } = useLawyerAuth();
  const locale = useLocale();
  const [caseData, setCaseData] = useState<CaseData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

  const caseId = params.id as string;

  // Helper function to format WhatsApp number for wa.me URL
  const formatWhatsAppNumber = (whatsappNumber: string): string => {
    // Remove all non-digit characters except +
    const cleaned = whatsappNumber.replace(/[^\d+]/g, '');
    // Remove the + if present
    return cleaned.replace(/^\+/, '');
  };

  const fetchCaseDetails = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getLawyerCaseDetails(caseId, "en");

      console.log("API Response:", response); // Debug log

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
          console.log("Response data structure:", response.data);
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
  }, [caseId]);

  const handleUpdateCase = async () => {
    try {
      // Refresh case details to get the updated status
      await fetchCaseDetails();

      return { success: true };
    } catch (err: any) {
      throw new Error(err.message || "Failed to refresh case details");
    }
  };

  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      router.push("/lawyer-login");
      return;
    }

    if (isAuthenticated && caseId) {
      fetchCaseDetails();
    }
  }, [isAuthenticated, isLoading, caseId, router, fetchCaseDetails]);

  if (isLoading || loading) {
    return (
      <div className="lawyer__loading">
        <div className="lawyer__loading-spinner"></div>
        <p>{t("common.loading")}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="lawyer__error">
        <IconAlertTriangle size={48} className="lawyer__error-icon" />
        <h2>{t("common.error")}</h2>
        <p>{error}</p>
        <button
          onClick={fetchCaseDetails}
          className="lawyer__btn lawyer__btn--primary"
        >
          {t("common.retry")}
        </button>
      </div>
    );
  }

  if (!caseData) {
    return (
      <div className="lawyer__error">
        <h2>{t("common.notFound")}</h2>
        <p>{t("common.caseNotFound")}</p>
      </div>
    );
  }

  return (
    <>
      {/* Header */}
      <div className="lawyer__case-details-header">
        <h1 className="lawyer__case-details-title">
          {t("lawyer.caseDetails.navigation.allDetails")}
        </h1>
        <button
          className="lawyer__start-case-btn"
          onClick={() => setIsUpdateModalOpen(true)}
        >
          {t("lawyer.caseDetails.updateCase")}
        </button>
      </div>

      {/* Case Information */}
      <section className="lawyer__info-section">
        <h2 className="lawyer__info-title">
          {t("lawyer.caseDetails.caseInfo.title")}
        </h2>
        <div className="lawyer__info-grid">
          <div className="lawyer__info-item">
            <div className="lawyer__info-label">
              {t("lawyer.caseDetails.caseInfo.caseNumber")}
            </div>
            <div className="lawyer__info-value">{caseData.case_number}</div>
          </div>
          <div className="lawyer__info-item">
            <div className="lawyer__info-label">
              {t("lawyer.caseDetails.caseInfo.status")}
            </div>
            <div className="lawyer__info-value">
              <span
                className={`lawyer__status case__status--${caseData.status}`}
              >
                {caseData.status_display}
              </span>
            </div>
          </div>
          <div className="lawyer__info-item">
            <div className="lawyer__info-label">
              {t("lawyer.caseDetails.caseInfo.isUrgent")}
            </div>
            <div className="lawyer__info-value">
              {caseData.is_urgent ? (
                <span className="lawyer__urgent-badge">{t("common.yes")}</span>
              ) : (
                <span className="lawyer__not-urgent-badge">
                  {t("common.no")}
                </span>
              )}
            </div>
          </div>
          <div className="lawyer__info-item">
            <div className="lawyer__info-label">
              {t("lawyer.caseDetails.caseInfo.created")}
            </div>
            <div className="lawyer__info-value">
              {formatDateWithLocale(caseData.created, locale)}
            </div>
          </div>
          <div className="lawyer__info-item">
            <div className="lawyer__info-label">
              {t("lawyer.caseDetails.caseInfo.updated")}
            </div>
            <div className="lawyer__info-value">
              {formatDateWithLocale(caseData.updated, locale)}
            </div>
          </div>
        </div>
      </section>

      {/* Detainee Information */}
      <section className="lawyer__info-section">
        <h2 className="lawyer__info-title">
          {t("lawyer.caseDetails.detaineeInfo.title")}
        </h2>
        <div className="lawyer__info-grid">
          {/* Full Name */}
          <div className="lawyer__info-item">
            <div className="lawyer__info-label">
              {t("lawyer.caseDetails.detaineeInfo.fullName")}
            </div>
            <div className="lawyer__info-value">{caseData.detainee_name}</div>
          </div>
          {/* DOB */}
          <div className="lawyer__info-item">
            <div className="lawyer__info-label">
              {t("lawyer.caseDetails.detaineeInfo.dateOfBirth")}
            </div>
            <div className="lawyer__info-value">
              {formatDateWithLocale(caseData.detainee_date_of_birth, locale)}
            </div>
          </div>
          {/* ID Number */}
          <div className="lawyer__info-item">
            <div className="lawyer__info-label">
              {t("lawyer.caseDetails.detaineeInfo.idNumber")}
            </div>
            <div className="lawyer__info-value">{caseData.detainee_id}</div>
          </div>
          {/* Healthy Status */}
          <div className="lawyer__info-item">
            <div className="lawyer__info-label">
              {t("lawyer.caseDetails.detaineeInfo.healthyStatus")}
            </div>
            <div className="lawyer__info-value">
              {caseData.detainee_health_status || "-"}
            </div>
          </div>
          {/* Job */}
          <div className="lawyer__info-item">
            <div className="lawyer__info-label">
              {t("lawyer.caseDetails.detaineeInfo.job")}
            </div>
            <div className="lawyer__info-value">
              {caseData.detainee_job || "-"}
            </div>
          </div>
          {/* Marital Status */}
          <div className="lawyer__info-item">
            <div className="lawyer__info-label">
              {t("lawyer.caseDetails.detaineeInfo.maritalStatus")}
            </div>
            <div className="lawyer__info-value">
              {caseData.detainee_marital_status || "-"}
            </div>
          </div>
          {/* Gender */}
          <div className="lawyer__info-item">
            <div className="lawyer__info-label">
              {t("lawyer.caseDetails.detaineeInfo.gender")}
            </div>
            <div className="lawyer__info-value">
              {caseData.detainee_gender || "-"}
            </div>
          </div>
          {/* Location */}
          <div className="lawyer__info-item">
            <div className="lawyer__info-label">
              {t("lawyer.caseDetails.detaineeInfo.location")}
            </div>
            <div className="lawyer__info-value">
              {caseData.detainee_full_address || "-"}
            </div>
          </div>
        </div>
      </section>

      {/* Detention/Disappearance Info */}
      <section className="lawyer__info-section">
        <h2 className="lawyer__info-title">
          {t("lawyer.caseDetails.detentionInfo.title")}
        </h2>
        <div className="lawyer__info-grid">
          <div className="lawyer__info-item">
            <div className="lawyer__info-label">
              {t("lawyer.caseDetails.detentionInfo.detentionDate")}
            </div>
            <div className="lawyer__info-value">
              {formatDateWithLocale(caseData.detention_date, locale)}
            </div>
          </div>
          <div className="lawyer__info-item">
            <div className="lawyer__info-label">
              {t("lawyer.caseDetails.detentionInfo.status")}
            </div>
            <div className="lawyer__info-value">
              {caseData.disappearance_status_display ||
                caseData.disappearance_status ||
                "-"}
            </div>
          </div>
          <div className="lawyer__info-item">
            <div className="lawyer__info-label">
              {t("lawyer.caseDetails.detentionInfo.location")}
            </div>
            <div className="lawyer__info-value">
              {caseData.detention_full_address || "-"}
            </div>
          </div>
          <div className="lawyer__info-description">
            <div className="lawyer__info-label">
              {t("lawyer.caseDetails.detentionInfo.circumstances")}
            </div>
            <p className="lawyer__info-description-text">
              {caseData.detention_circumstances || t("common.noDescription")}
            </p>
          </div>
        </div>
      </section>

      {/* Client Info */}
      <section className="lawyer__info-section">
        <h2 className="lawyer__info-title">
          {t("lawyer.caseDetails.clientInfo.title")}
        </h2>
        <div className="lawyer__info-grid">
          <div className="lawyer__info-item">
            <div className="lawyer__info-label">
              {t("lawyer.caseDetails.clientInfo.fullName")}
            </div>
            <div className="lawyer__info-value">{caseData.client_name}</div>
          </div>
          <div className="lawyer__info-item">
            <div className="lawyer__info-label">
              {t("lawyer.caseDetails.clientInfo.idNumber")}
            </div>
            <div className="lawyer__info-value">
              {caseData.client_id || "-"}
            </div>
          </div>
          <div className="lawyer__info-item">
            <div className="lawyer__info-label">
              {t("lawyer.caseDetails.clientInfo.phoneNumber")}
            </div>
            <div className="lawyer__info-value isNumber">{caseData.client_phone}</div>
          </div>
          <div className="lawyer__info-item">
            <div className="lawyer__info-label">
              {t("lawyer.caseDetails.clientInfo.whatsappNumber")}
            </div>
            <div className="lawyer__info-value isNumber">
              {caseData.client_whatsapp ? (
                <a
                  href={`https://wa.me/${formatWhatsAppNumber(caseData.client_whatsapp)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="lawyer__whatsapp-link"
                  title={t("lawyer.caseDetails.clientInfo.whatsappNumber")}
                >
                  <IconBrandWhatsapp size={20} className="lawyer__whatsapp-icon" />
                  {caseData.client_whatsapp}
                </a>
              ) : (
                "-"
              )}
            </div>
          </div>
          <div className="lawyer__info-item">
            <div className="lawyer__info-label">
              {t("lawyer.caseDetails.clientInfo.relationship")}
            </div>
            <div className="lawyer__info-value">
              {caseData.client_relationship}
            </div>
          </div>
        </div>
      </section>

      {/* Documents upload section removed as it has its own page */}

      {/* Update Case Modal */}
      <UpdateCaseModal
        isOpen={isUpdateModalOpen}
        onClose={() => setIsUpdateModalOpen(false)}
        onSubmit={handleUpdateCase}
        currentStatus={caseData?.status}
        caseId={caseId}
      />
    </>
  );
}
