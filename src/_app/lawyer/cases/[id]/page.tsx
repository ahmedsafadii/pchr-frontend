"use client";

import { useTranslations } from "next-globe-gen";
import { IconAlertTriangle } from "@tabler/icons-react";
import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { getLawyerCaseDetails } from "../../../utils/apiWithAuth";
import { useLawyerAuth } from "../../../hooks/useLawyerAuth";

interface CaseData {
  id: string;
  case_number: string;
  detainee_name: string;
  detainee_id: string;
  detainee_date_of_birth: string;
  client_name: string;
  client_id?: string;
  client_phone: string;
  client_relationship: string;
  status: string;
  status_display: string;
  is_urgent: boolean;
  detention_date: string;
  detention_circumstances: string;
  created: string;
  updated: string;
  detainee_job: string;
  detainee_health_status: string;
  detainee_street?: string;
  detainee_district?: { name?: string } | null;
  detainee_city?: string | { name?: string } | null;
  detainee_governorate?: string | { name?: string } | null;
  detainee_marital_status_display?: string;
  // Disappearance-specific fields (optional to be resilient to API variations)
  disappearance_status?: string;
  disappearance_status_display?: string;
  detention_street?: string;
  detention_district?: { name?: string } | null;
  detention_city?: { name?: string } | null;
  detention_governorate?: { name?: string } | null;
  detainee_marital_status: string | null;
  detention_full_address?: string;
  detainee_full_address?: string;
}

export default function LawyerCaseDetailsPage() {
  const t = useTranslations();
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated, isLoading } = useLawyerAuth();
  const [caseData, setCaseData] = useState<CaseData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const caseId = params.id as string;

  const fetchCaseDetails = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getLawyerCaseDetails(caseId, 'en');
      
      console.log('API Response:', response); // Debug log
      
      if (response.status === 'success') {
        // Check different possible data structures
        if (response.data?.cases && response.data.cases.length > 0) {
          // If it's an array of cases, find the one matching the caseId
          const caseItem = response.data.cases.find((caseItem: any) => caseItem.id === caseId);
          if (caseItem) {
            setCaseData(caseItem);
          } else {
            setError('Case not found in response');
          }
        } else if (response.data?.id === caseId) {
          // If it's a single case object
          setCaseData(response.data);
        } else if (response.data && typeof response.data === 'object') {
          // If data is directly the case object
          setCaseData(response.data);
        } else {
          console.log('Response data structure:', response.data);
          setError('Unexpected data structure');
        }
      } else {
        setError(response.message || 'Case not found');
      }
    } catch (err) {
      console.error('Error fetching case details:', err);
      setError('Failed to load case details');
    } finally {
      setLoading(false);
    }
  }, [caseId]);

  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      router.push('/lawyer-login');
      return;
    }

    if (isAuthenticated && caseId) {
      fetchCaseDetails();
    }
  }, [isAuthenticated, isLoading, caseId, router, fetchCaseDetails]);

  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    try {
      return new Date(dateString).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  const formatDateTime = (dateString: string) => {
    if (!dateString) return '-';
    try {
      return new Date(dateString).toLocaleString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateString;
    }
  };

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
        <button onClick={fetchCaseDetails} className="lawyer__btn lawyer__btn--primary">
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
        <h1 className="lawyer__case-details-title">{t("lawyer.caseDetails.navigation.allDetails")}</h1>
        <button className="lawyer__start-case-btn">
          {t("lawyer.caseDetails.startCase")}
        </button>
      </div>

      {/* Case Information */}
      <section className="lawyer__info-section">
        <h2 className="lawyer__info-title">{t("lawyer.caseDetails.caseInfo.title")}</h2>
        <div className="lawyer__info-grid">
          <div className="lawyer__info-item">
            <div className="lawyer__info-label">{t("lawyer.caseDetails.caseInfo.caseNumber")}</div>
            <div className="lawyer__info-value">{caseData.case_number}</div>
          </div>
          <div className="lawyer__info-item">
            <div className="lawyer__info-label">{t("lawyer.caseDetails.caseInfo.status")}</div>
            <div className="lawyer__info-value">
              <span className={`lawyer__status case__status--${caseData.status}`}>
                {caseData.status_display}
              </span>
            </div>
          </div>
          <div className="lawyer__info-item">
            <div className="lawyer__info-label">{t("lawyer.caseDetails.caseInfo.isUrgent")}</div>
            <div className="lawyer__info-value">
              {caseData.is_urgent ? (
                <span className="lawyer__urgent-badge">{t("common.yes")}</span>
              ) : (
                <span className="lawyer__not-urgent-badge">{t("common.no")}</span>
              )}
            </div>
          </div>
          <div className="lawyer__info-item">
            <div className="lawyer__info-label">{t("lawyer.caseDetails.caseInfo.created")}</div>
            <div className="lawyer__info-value">{formatDateTime(caseData.created)}</div>
          </div>
          <div className="lawyer__info-item">
            <div className="lawyer__info-label">{t("lawyer.caseDetails.caseInfo.updated")}</div>
            <div className="lawyer__info-value">{formatDateTime(caseData.updated)}</div>
          </div>
        </div>
      </section>

      {/* Detainee Information */}
      <section className="lawyer__info-section">
        <h2 className="lawyer__info-title">{t("lawyer.caseDetails.detaineeInfo.title")}</h2>
        <div className="lawyer__info-grid">
          {/* Full Name */}
          <div className="lawyer__info-item">
            <div className="lawyer__info-label">{t("lawyer.caseDetails.detaineeInfo.fullName")}</div>
            <div className="lawyer__info-value">{caseData.detainee_name}</div>
          </div>
          {/* DOB */}
          <div className="lawyer__info-item">
            <div className="lawyer__info-label">{t("lawyer.caseDetails.detaineeInfo.dateOfBirth")}</div>
            <div className="lawyer__info-value">{formatDate(caseData.detainee_date_of_birth)}</div>
          </div>
          {/* ID Number */}
          <div className="lawyer__info-item">
            <div className="lawyer__info-label">{t("lawyer.caseDetails.detaineeInfo.idNumber")}</div>
            <div className="lawyer__info-value">{caseData.detainee_id}</div>
          </div>
          {/* Healthy Status */}
          <div className="lawyer__info-item">
            <div className="lawyer__info-label">{t("lawyer.caseDetails.detaineeInfo.healthyStatus")}</div>
            <div className="lawyer__info-value">{caseData.detainee_health_status || '-'}</div>
          </div>
          {/* Job */}
          <div className="lawyer__info-item">
            <div className="lawyer__info-label">{t("lawyer.caseDetails.detaineeInfo.job")}</div>
            <div className="lawyer__info-value">{caseData.detainee_job || '-'}</div>
          </div>
          {/* Marital Status */}
          <div className="lawyer__info-item">
            <div className="lawyer__info-label">{t("lawyer.caseDetails.detaineeInfo.maritalStatus")}</div>
            <div className="lawyer__info-value">{caseData.detainee_marital_status || '-'}</div>
          </div>
          {/* Location */}
          <div className="lawyer__info-item">
            <div className="lawyer__info-label">{t("lawyer.caseDetails.detaineeInfo.location")}</div>
            <div className="lawyer__info-value">{caseData.detainee_full_address || '-' }</div>
          </div>
        </div>
      </section>

      {/* Detention/Disappearance Info */}
      <section className="lawyer__info-section">
        <h2 className="lawyer__info-title">{t("lawyer.caseDetails.detentionInfo.title")}</h2>
        <div className="lawyer__info-grid">
          <div className="lawyer__info-item">
            <div className="lawyer__info-label">{t("lawyer.caseDetails.detentionInfo.detentionDate")}</div>
            <div className="lawyer__info-value">{formatDate(caseData.detention_date)}</div>
          </div>
          <div className="lawyer__info-item">
            <div className="lawyer__info-label">{t("lawyer.caseDetails.detentionInfo.status")}</div>
            <div className="lawyer__info-value">{caseData.disappearance_status_display || caseData.disappearance_status || '-'}</div>
          </div>
          <div className="lawyer__info-item">
            <div className="lawyer__info-label">{t("lawyer.caseDetails.detentionInfo.location")}</div>
            <div className="lawyer__info-value">
              {caseData.detention_full_address || '-' }
            </div>
          </div>
          <div className="lawyer__info-description">
            <div className="lawyer__info-label">{t("lawyer.caseDetails.detentionInfo.circumstances")}</div>
            <p className="lawyer__info-description-text">
              {caseData.detention_circumstances || t("common.noDescription")}
            </p>
          </div>
        </div>
      </section>

      {/* Client Info */}
      <section className="lawyer__info-section">
        <h2 className="lawyer__info-title">{t("lawyer.caseDetails.clientInfo.title")}</h2>
        <div className="lawyer__info-grid">
          <div className="lawyer__info-item">
            <div className="lawyer__info-label">{t("lawyer.caseDetails.clientInfo.fullName")}</div>
            <div className="lawyer__info-value">{caseData.client_name}</div>
          </div>
          <div className="lawyer__info-item">
            <div className="lawyer__info-label">{t("lawyer.caseDetails.clientInfo.idNumber")}</div>
            <div className="lawyer__info-value">{caseData.client_id || '-'}</div>
          </div>
          <div className="lawyer__info-item">
            <div className="lawyer__info-label">{t("lawyer.caseDetails.clientInfo.phoneNumber")}</div>
            <div className="lawyer__info-value">{caseData.client_phone}</div>
          </div>
          <div className="lawyer__info-item">
            <div className="lawyer__info-label">{t("lawyer.caseDetails.clientInfo.relationship")}</div>
            <div className="lawyer__info-value">{caseData.client_relationship}</div>
          </div>
        </div>
      </section>

      {/* Documents upload section removed as it has its own page */}
    </>
  );
}
