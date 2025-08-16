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
  city: LocationData;
}

export interface CaseDetailsData {
  case_number: string;
  detainee_name: string;
  detainee_id: string;
  detainee_date_of_birth: string;
  detainee_health_status_display: string;
  detainee_marital_status_display: string;
  detainee_city: LocationData;
  detainee_governorate: LocationData;
  detainee_district: DistrictData;
  detainee_street: string;
  detention_date: string;
  detention_circumstances: string;
  disappearance_status_display: string;
  detention_city: LocationData;
  detention_governorate: LocationData;
  detention_district: DistrictData;
  detention_street: string;
  client_name: string;
  client_phone: string;
  client_id: string;
  client_relationship_display: string;
  status_display: string;
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

export interface CaseDocumentsData {
  // Will be defined based on the documents API response structure
  documents?: any[];
}

export default function CaseDetailsPage() {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [activeTab, setActiveTab] = useState<"overview" | "info">("overview");
  const [caseData, setCaseData] = useState<CaseDetailsData | null>(null);
  const [documentsData, setDocumentsData] = useState<CaseDocumentsData | null>(null); // eslint-disable-line @typescript-eslint/no-unused-vars
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
          // Fetch case details and documents in parallel
          const [caseResponse, documentsResponse] = await Promise.all([
            getCaseDetails(token, locale),
            getCaseDocuments(token, locale)
          ]);
          
          if (caseResponse.status === 'success') {
            setCaseData(caseResponse.data);
          } else {
            setError(t("track.errors.failedToLoadCase").toString());
          }
          
          if (documentsResponse.status === 'success') {
            setDocumentsData(documentsResponse.data);
          }
          
        } catch (apiError: any) {
          console.error('Failed to fetch case data:', apiError);
          
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
                    className={`tabs__tab ${activeTab === "overview" ? "tabs__tab--active" : ""}`}
                    onClick={() => setActiveTab("overview")}
                  >
                    {(t as any)("tabs.overview")}
                  </button>
                  <button
                    role="tab"
                    className={`tabs__tab ${activeTab === "info" ? "tabs__tab--active" : ""}`}
                    onClick={() => setActiveTab("info")}
                  >
                    {(t as any)("tabs.info")}
                  </button>
                </div>

                <div className="tabs__content">
                  {activeTab === "overview" ? (
                    <Overview caseData={caseData} />
                  ) : (
                    <DisappearanceInfo caseData={caseData} />
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


