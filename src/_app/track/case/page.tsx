"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-globe-gen";
import { useRouter } from "next/navigation";
import Logo from "@/_app/components/Logo";
import LanguageSwitcher from "@/_app/components/LanguageSwitcher";
import Overview from "./components/Overview";
import DisappearanceInfo from "./components/DisappearanceInfo";
import { getCaseDetails, getCaseDocuments } from "@/_app/services/api";
import "@/app/css/track.css";

// TypeScript interfaces for case data
interface LocationData {
  id: string;
  name: string;
  governorate?: {
    id: string;
    name: string;
    is_active: boolean;
    order: number;
  };
  is_active: boolean;
  order: number;
}

interface DistrictData extends LocationData {
  value: string;
  locality: LocationData;
}

export interface CaseDetailsData {
  id: string; // Internal GUID case ID
  case_number: string;
  detainee_name: string;
  detainee_id: string;
  detainee_date_of_birth: string;
  detainee_health_status_display: string;
  detainee_job_display: string;
  detainee_marital_status_display: string;
  detainee_gender_display: string;
  detainee_locality: LocationData;
  detainee_governorate: LocationData;
  detainee_district: DistrictData;
  detainee_street: string;
  detention_date: string;
  detention_circumstances: string;
  disappearance_status_display: string;
  detention_locality: LocationData;
  detention_governorate: LocationData;
  detention_district: DistrictData;
  detention_street: string;
  client_name: string;
  client_phone: string;
  client_whatsapp: string;
  client_id: string;
  client_relationship_display: string;
  status_display: string;
  status: string;
  is_urgent: boolean;
  authorized_another_party: boolean;
  previous_delegation: boolean;
  organisation_name: string;
  delegation_date: string | null;
  delegation_notes: string;
  consent_agreed: boolean;
  consent_date: string;
  created: string;
  updated: string;
}

export interface DocumentData {
  id: string;
  file_name: string;
  document_type: string;
  document_type_display: string;
  file_size: number;
  file_size_mb: number;
  file_extension: string;
  mime_type: string;
  description: string;
  is_verified: boolean;
  verified_at: string;
  download_url: string | null;
  preview_url: string | null;
  created: string;
}

export interface CaseDocumentsData {
  status: string;
  data: DocumentData[];
  message: string;
}

export interface CaseMessageData {
  id: string;
  case_info: {
    id: string;
    case_number: string;
    detainee_name: string;
    client_name: string;
    client_phone: string;
    status: string;
    status_display: string;
    assigned_lawyer_name: string;
    created: string;
  };
  sender: string | null;
  recipient: string | null;
  content: string;
  message_type: "notification" | "system" | "lawyer" | "client";
  message_type_display: string;
  is_read: boolean;
  is_archived: boolean;
  attachments: any[];
  has_attachments: boolean;
  created: string;
  updated: string;
  read_at: string | null;
  read_by: string | null;
  case_timeline: {
    case_number: string;
    detainee_name: string;
    client_name: string;
    status: string;
    assigned_lawyer: string;
    created_date: string;
    visits_count: number;
    documents_count: number;
    messages_count: number;
  };
}

export interface CaseMessagesResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: {
    case_info: {
      id: string;
      case_number: string;
      detainee_name: string;
      client_name: string;
      status: string;
      assigned_lawyer: string;
      created: string;
      visits_count: number;
      documents_count: number;
      messages_count: number;
    };
    messages: CaseMessageData[];
    can_client_reply: boolean;
  };
}

export default function CaseDetailsPage() {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [activeTab, setActiveTab] = useState<"overview" | "info">("overview");
  const [caseData, setCaseData] = useState<CaseDetailsData | null>(null);
  const [documentsData, setDocumentsData] = useState<CaseDocumentsData | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [trackAccessToken, setTrackAccessToken] = useState<string>("");

  useEffect(() => {
    const fetchCaseData = async () => {
      try {
        const token = localStorage.getItem("track_access_token");
        const tokenExpires = localStorage.getItem("track_token_expires");

        if (!token || !tokenExpires) {
          router.replace(`/${locale}/track`);
          return;
        }

        // Check if token is expired
        const expiryTime = parseInt(tokenExpires);
        if (Date.now() >= expiryTime) {
          // Token expired, clear storage and redirect
          localStorage.removeItem("track_access_token");
          localStorage.removeItem("track_case_number");
          localStorage.removeItem("track_detainee_name");
          localStorage.removeItem("track_token_expires");
          router.replace(`/${locale}/track`);
          return;
        }

        setAuthorized(true);
        setLoading(true);
        setError(null);

        try {
          // Set the token
          setTrackAccessToken(token);

          // Fetch case details and documents in parallel
          const [caseResponse, documentsResponse] = await Promise.all([
            getCaseDetails(token, locale),
            getCaseDocuments(token, locale),
          ]);

          if (caseResponse.status === "success") {
            setCaseData(caseResponse.data);
          } else {
            setError(t("track.errors.failedToLoadCase").toString());
          }

          if (documentsResponse.status === "success") {
            console.log("Documents response:", documentsResponse);
            // Transform ApiResponse to CaseDocumentsData
            const documentsData: CaseDocumentsData = {
              status: documentsResponse.status,
              data: documentsResponse.data || [],
              message: documentsResponse.message || "",
            };
            setDocumentsData(documentsData);
          } else {
            console.log("Documents fetch failed:", documentsResponse);
          }
        } catch (apiError: any) {
          console.error("Failed to fetch case data:", apiError);

          // Handle different error scenarios
          if (apiError.status === 401) {
            // Token invalid, clear storage and redirect
            localStorage.removeItem("track_access_token");
            localStorage.removeItem("track_case_number");
            localStorage.removeItem("track_detainee_name");
            localStorage.removeItem("track_token_expires");
            router.replace(`/${locale}/track`);
            return;
          } else {
            setError(t("track.errors.failedToLoadCase").toString());
          }
        } finally {
          setLoading(false);
        }
      } catch {
        router.replace(`/${locale}/track`);
      }
    };

    fetchCaseData();
  }, [router, locale, t]);

  if (!authorized) return null;

  return (
    <div className="track track--details">
      <div className="track__container">
        <header className="track__header">
          <div className="track__logo">
            <Logo />
          </div>
          <div className="track__header-controls">
            <button
              onClick={() => {
                // Clear authentication data and redirect to track page
                localStorage.removeItem("track_access_token");
                localStorage.removeItem("track_case_number");
                localStorage.removeItem("track_detainee_name");
                localStorage.removeItem("track_token_expires");
                router.push(`/${locale}/track`);
              }}
              className="track__back-button"
            >
              <span>{t("track.logout")}</span>
            </button>
            <LanguageSwitcher />
          </div>
        </header>

        <main className="track__main">
          <section className="track__card" aria-labelledby="case-title">
            {loading && (
              <div className="track__loading">
                <p>{t("track.loading")}</p>
              </div>
            )}

            {error && (
              <div className="track__error">
                <p>{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="track__retry-button"
                >
                  {t("track.retry")}
                </button>
              </div>
            )}

            {!loading && !error && caseData && (
              <div className="tabs">
                <div className="tabs__list" role="tablist">
                  <button
                    role="tab"
                    className={`tabs__tab ${
                      activeTab === "overview" ? "tabs__tab--active" : ""
                    }`}
                    onClick={() => setActiveTab("overview")}
                  >
                    {t("tabs.overview")}
                  </button>
                  <button
                    role="tab"
                    className={`tabs__tab ${
                      activeTab === "info" ? "tabs__tab--active" : ""
                    }`}
                    onClick={() => setActiveTab("info")}
                  >
                    {t("tabs.info")}
                  </button>
                </div>

                <div className="tabs__content">
                  {activeTab === "overview" ? (
                    <Overview
                      caseData={caseData}
                      documentsData={documentsData}
                      caseTrackingToken={trackAccessToken}
                    />
                  ) : (
                    <DisappearanceInfo
                      caseData={caseData}
                      documentsData={documentsData}
                    />
                  )}
                </div>
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  );
}
