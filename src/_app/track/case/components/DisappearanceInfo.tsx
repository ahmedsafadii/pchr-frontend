"use client";

import { useTranslations, useLocale } from "next-globe-gen";
import { IconFileText, IconDownload } from "@tabler/icons-react";
import { formatDateWithLocale } from "../../../utils/dateUtils";

import { CaseDetailsData, CaseDocumentsData } from "../page";

interface DisappearanceInfoProps {
  caseData: CaseDetailsData | null;
  documentsData?: CaseDocumentsData | null; // Optional for now
}

export default function DisappearanceInfo({
  caseData,
  documentsData,
}: DisappearanceInfoProps) {
  const t = useTranslations();
  const locale = useLocale();
  return (
    <div className="case-info">
      <h2 className="case-info__title">{(t as any)("trackCase.info.title")}</h2>

      <div className="case-info__block">
        <h3 className="case-info__subtitle">
          {(t as any)("trackCase.info.caseInfo")}
        </h3>
        <dl className="case-info__dl">
          <div className="case-info__row">
            <dt>{(t as any)("trackCase.info.caseNumber")}</dt>
            <dd>{caseData?.case_number || t("common.notAvailable")}</dd>
          </div>
          <div className="case-info__row">
            <dt>{(t as any)("trackCase.info.status")}</dt>
            <dd>
              <div
                className={`case-overview__badge case-overview__badge--sm ${
                  caseData?.status_display
                    ? `case__status--${caseData.status_display
                        .toLowerCase()
                        .replace(/\s+/g, "-")}`
                    : ""
                }`}
              >
                {caseData?.status_display || t("common.notAvailable")}
              </div>
            </dd>
          </div>
        </dl>
      </div>

      <div className="case-info__grid">
        <div className="case-info__block">
          <h3 className="case-info__subtitle">
            {(t as any)("trackCase.info.detainee")}
          </h3>
          <dl className="case-info__dl">
            <div className="case-info__row">
              <dt>{(t as any)("trackCase.info.fullName")}</dt>
              <dd>{caseData?.detainee_name || t("common.loading")}</dd>
            </div>
            <div className="case-info__row">
              <dt>{(t as any)("trackCase.info.dob")}</dt>
              <dd>
                {caseData?.detainee_date_of_birth
                  ? formatDateWithLocale(caseData.detainee_date_of_birth, locale)
                  : t("common.notAvailable")}
              </dd>
            </div>
            <div className="case-info__row">
              <dt>{(t as any)("trackCase.info.id")}</dt>
              <dd>{caseData?.detainee_id || t("common.notAvailable")}</dd>
            </div>
            <div className="case-info__row">
              <dt>{(t as any)("trackCase.info.health")}</dt>
              <dd>
                {caseData?.detainee_health_status_display || t("common.notAvailable")}
              </dd>
            </div>
            <div className="case-info__row">
              <dt>{(t as any)("trackCase.info.job")}</dt>
              <dd>{caseData?.detainee_job_display || t("common.notAvailable")}</dd>
            </div>
            <div className="case-info__row">
              <dt>{(t as any)("trackCase.info.marital")}</dt>
              <dd>
                {caseData?.detainee_marital_status_display || t("common.notAvailable")}
              </dd>
            </div>
            <div className="case-info__row">
              <dt>{(t as any)("trackCase.info.location")}</dt>
              <dd>
                {caseData
                  ? `${caseData.detainee_street || ""}, ${
                      caseData.detainee_district?.name || ""
                    }, ${caseData.detainee_city?.name || ""                    }, ${
                      caseData.detainee_governorate?.name || ""
                    }`
                      .replace(/^,\s*|,\s*$/g, "")
                      .replace(/,\s*,/g, ",")
                  : t("common.notAvailable")}
              </dd>
            </div>
          </dl>
        </div>

        <div className="case-info__block">
          <h3 className="case-info__subtitle">
            {(t as any)("trackCase.info.detention")}
          </h3>
          <dl className="case-info__dl">
            <div className="case-info__row">
              <dt>{(t as any)("trackCase.info.disappearanceDate")}</dt>
              <dd>
                {caseData?.detention_date
                  ? formatDateWithLocale(caseData.detention_date, locale)
                  : t("common.notAvailable")}
              </dd>
            </div>
            <div className="case-info__row">
              <dt>{(t as any)("trackCase.info.disappearanceStatus")}</dt>
              <dd>
                {caseData?.disappearance_status_display || t("common.notAvailable")}
              </dd>
            </div>
            <div className="case-info__row">
              <dt>{(t as any)("trackCase.info.location")}</dt>
              <dd>
                {caseData
                  ? `${caseData?.detention_street || ""}, ${
                      caseData?.detention_district?.name || ""
                    }, ${caseData?.detention_city?.name || ""                    }, ${
                      caseData?.detention_governorate?.name || ""
                    }`
                      .replace(/^,\s*|,\s*$/g, "")
                      .replace(/,\s*,/g, ",")
                  : t("common.notAvailable")}
              </dd>
            </div>
            <div className="case-info__row case-info__row--full">
              <dt>{(t as any)("trackCase.info.describe")}</dt>
              <dd>
                {caseData?.detention_circumstances ||
                  t("common.noDescription")}
              </dd>
            </div>
          </dl>
        </div>
      </div>

      <div className="case-info__block">
        <h3 className="case-info__subtitle">
          {(t as any)("trackCase.info.client")}
        </h3>
        <dl className="case-info__dl">
          <div className="case-info__row">
            <dt>{(t as any)("trackCase.info.fullName")}</dt>
            <dd>{caseData?.client_name || t("common.notAvailable")}</dd>
          </div>
          <div className="case-info__row">
            <dt>{(t as any)("trackCase.info.id")}</dt>
            <dd>{caseData?.client_id || t("common.notAvailable")}</dd>
          </div>
          <div className="case-info__row">
            <dt>{(t as any)("trackCase.info.phone")}</dt>
            <dd>{caseData?.client_phone || t("common.notAvailable")}</dd>
          </div>
          <div className="case-info__row">
            <dt>{(t as any)("trackCase.info.relationship")}</dt>
            <dd>{caseData?.client_relationship_display || t("common.notAvailable")}</dd>
          </div>
        </dl>
      </div>

      <div className="case-info__block">
        <h3 className="case-info__subtitle">
          {(t as any)("trackCase.info.documents")}
        </h3>
        <ul className="case-overview__files">
          {documentsData?.data && documentsData.data.length > 0 ? (
            documentsData.data.map((document) => (
              <li key={document.id} className="case-overview__file">
                <span className="case-overview__file-left">
                  <IconFileText size={18} />{" "}
                  {document.document_type_display.toLowerCase() === "other" 
                    ? document.file_name 
                    : `${document.document_type_display}${document.file_extension}`}{" "}
                  ({document.file_size_mb}MB)
                </span>
                <button
                  className="case-overview__file-download"
                  aria-label="download"
                  onClick={() => {
                    if (document.download_url) {
                      window.open(
                        document.download_url,
                        "_blank",
                        "noopener,noreferrer"
                      );
                    }
                  }}
                >
                  <IconDownload size={18} />
                </button>
              </li>
            ))
          ) : (
            <li className="case-overview__file">
              <span className="case-overview__file-left">
                <IconFileText size={18} />{" "}
                {(t as any)("trackCase.info.noDocuments")}
              </span>
            </li>
          )}
        </ul>
      </div>

      <div className="case-info__block">
        <h3 className="case-info__subtitle">
          {(t as any)("trackCase.info.signature")}
        </h3>
        <div className="case-info__signature">
          {(() => {
            // Find signature document from the documents data
            const signatureDoc = documentsData?.data?.find(
              (doc) => doc.document_type === "signature"
            );
            console.log("Signature document found:", signatureDoc);

            if (signatureDoc) {
              // Check if it's an image file
              const isImage = signatureDoc.mime_type?.startsWith("image/");

              if (isImage) {
                // Use preview_url if available, otherwise try download_url
                const imageUrl =
                  signatureDoc.preview_url || signatureDoc.download_url;

                if (imageUrl) {
                  // Display image signature
                  return (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={imageUrl}
                      alt="signature"
                      style={{ width: "100%", height: "auto", maxWidth: "600px" }}
                    />
                  );
                }
              } else {
                // Display message for PDF or non-image files
                return (
                  <div className="case-info__signature-message">
                    <p>{(t as any)("trackCase.info.signaturePdfMessage")}</p>
                  </div>
                );
              }
            } else {
              // No signature document found
              return (
                <div className="case-info__signature-message">
                  <p>{(t as any)("trackCase.info.noDocuments")}</p>
                </div>
              );
            }
          })()}
        </div>
      </div>
    </div>
  );
}
