"use client";

import { useTranslations } from "next-globe-gen";
import Image from "next/image";
import { IconFileText, IconDownload } from "@tabler/icons-react";

import { CaseDetailsData, CaseDocumentsData } from "../page";

interface DisappearanceInfoProps {
  caseData: CaseDetailsData | null;
  documentsData?: CaseDocumentsData | null; // Optional for now
}

export default function DisappearanceInfo({ caseData }: DisappearanceInfoProps) {
  const t = useTranslations();
  return (
    <div className="case-info">
      <h2 className="case-info__title">{(t as any)("trackCase.info.title")}</h2>

      <div className="case-info__grid">
        <div className="case-info__block">
          <h3 className="case-info__subtitle">
            {(t as any)("trackCase.info.detainee")}
          </h3>
          <dl className="case-info__dl">
            <div className="case-info__row">
              <dt>{(t as any)("trackCase.info.fullName")}</dt>
              <dd>{caseData?.detainee_name || "Loading..."}</dd>
            </div>
            <div className="case-info__row">
              <dt>{(t as any)("trackCase.info.dob")}</dt>
              <dd>{caseData?.detainee_date_of_birth ? new Date(caseData.detainee_date_of_birth).toLocaleDateString('en-GB', {
                day: '2-digit',
                month: 'short',
                year: 'numeric'
              }) : "Not available"}</dd>
            </div>
            <div className="case-info__row">
              <dt>{(t as any)("trackCase.info.id")}</dt>
              <dd>{caseData?.detainee_id || "Not available"}</dd>
            </div>
            <div className="case-info__row">
              <dt>{(t as any)("trackCase.info.health")}</dt>
              <dd>{caseData?.detainee_health_status_display || "Not available"}</dd>
            </div>
            <div className="case-info__row">
              <dt>{(t as any)("trackCase.info.marital")}</dt>
              <dd>{caseData?.detainee_marital_status_display || "Not available"}</dd>
            </div>
            <div className="case-info__row">
              <dt>{(t as any)("trackCase.info.location")}</dt>
              <dd>{caseData ? `${caseData.detainee_street || ""}, ${caseData.detainee_district?.name || ""}, ${caseData.detainee_city?.name || ""}, ${caseData.detainee_governorate?.name || ""}`.replace(/^,\s*|,\s*$/g, '').replace(/,\s*,/g, ',') : "Not available"}</dd>
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
              <dd>{caseData?.detention_date ? new Date(caseData.detention_date).toLocaleDateString('en-GB', {
                day: '2-digit',
                month: 'short',
                year: 'numeric'
              }) : "Not available"}</dd>
            </div>
            <div className="case-info__row">
              <dt>{(t as any)("trackCase.info.status")}</dt>
              <dd>{caseData?.disappearance_status_display || "Not available"}</dd>
            </div>
            <div className="case-info__row">
              <dt>{(t as any)("trackCase.info.location")}</dt>
              <dd>{caseData ? `${caseData.detention_district?.name || ""}, ${caseData.detention_city?.name || ""}, ${caseData.detention_governorate?.name || ""}`.replace(/^,\s*|,\s*$/g, '').replace(/,\s*,/g, ',') : "Not available"}</dd>
            </div>
            <div className="case-info__row case-info__row--full">
            <dt>{(t as any)("trackCase.info.describe")}</dt>
            <dd>
              {caseData?.detention_circumstances || "No description available"}
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
            <dd>{caseData?.client_name || "Not available"}</dd>
          </div>
          <div className="case-info__row">
            <dt>{(t as any)("trackCase.info.id")}</dt>
            <dd>{caseData?.client_id || "Not available"}</dd>
          </div>
          <div className="case-info__row">
            <dt>{(t as any)("trackCase.info.phone")}</dt>
            <dd>{caseData?.client_phone || "Not available"}</dd>
          </div>
          <div className="case-info__row">
            <dt>{(t as any)("trackCase.info.relationship")}</dt>
            <dd>{caseData?.client_relationship_display || "Not available"}</dd>
          </div>
        </dl>
      </div>

      <div className="case-info__block">
        <h3 className="case-info__subtitle">
          {(t as any)("trackCase.info.documents")}
        </h3>
        <ul className="case-overview__files">
          <li className="case-overview__file">
            <span className="case-overview__file-left">
              <IconFileText size={18} /> ID.PDF
            </span>
            <button
              className="case-overview__file-download"
              aria-label="download"
            >
              <IconDownload size={18} />
            </button>
          </li>
          <li className="case-overview__file">
            <span className="case-overview__file-left">
              <IconFileText size={18} /> Proposal.PDF
            </span>
            <button
              className="case-overview__file-download"
              aria-label="download"
            >
              <IconDownload size={18} />
            </button>
          </li>
          <li className="case-overview__file">
            <span className="case-overview__file-left">
              <IconFileText size={18} /> Case.PDF
            </span>
            <button
              className="case-overview__file-download"
              aria-label="download"
            >
              <IconDownload size={18} />
            </button>
          </li>
        </ul>
      </div>

      <div className="case-info__block">
        <h3 className="case-info__subtitle">
          {(t as any)("trackCase.info.signature")}
        </h3>
        <ul className="case-overview__files">
          <li className="case-overview__file">
            <span className="case-overview__file-left">
              <IconFileText size={18} /> {t("trackCase.info.terms")}
            </span>
            <button
              className="case-overview__file-download"
              aria-label="download"
            >
              <IconDownload size={18} />
            </button>
          </li>
        </ul>
        <div className="case-info__signature">
          <Image
            src="https://upload.wikimedia.org/wikipedia/commons/8/86/Muhammad-ali-signature-6a40cd5a6c27559411db066f62d64886c42bbeb03b347237ffae98b0b15e0005_%28905749513095%29.svg"
            alt="signature"
            width={600}
            height={160}
            style={{ width: "100%", height: "auto" }}
          />
        </div>
      </div>
    </div>
  );
}
