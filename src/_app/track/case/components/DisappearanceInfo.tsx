"use client";

import { useTranslations } from "next-globe-gen";
import Image from "next/image";
import { IconFileText, IconDownload } from "@tabler/icons-react";

export default function DisappearanceInfo() {
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
              <dd>Khaled Ahmed Shaban</dd>
            </div>
            <div className="case-info__row">
              <dt>{(t as any)("trackCase.info.job")}</dt>
              <dd>Worker</dd>
            </div>
            <div className="case-info__row">
              <dt>{(t as any)("trackCase.info.dob")}</dt>
              <dd>24 FEB 2022</dd>
            </div>
            <div className="case-info__row">
              <dt>{(t as any)("trackCase.info.id")}</dt>
              <dd>123421222222</dd>
            </div>
            <div className="case-info__row">
              <dt>{(t as any)("trackCase.info.health")}</dt>
              <dd>Bad</dd>
            </div>
            <div className="case-info__row">
              <dt>{(t as any)("trackCase.info.marital")}</dt>
              <dd>Single</dd>
            </div>
            <div className="case-info__row">
              <dt>{(t as any)("trackCase.info.location")}</dt>
              <dd>Jabalia Camp, Gaza Strip</dd>
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
              <dd>24 FEB 2022</dd>
            </div>
            <div className="case-info__row">
              <dt>{(t as any)("trackCase.info.status")}</dt>
              <dd>Worker</dd>
            </div>
            <div className="case-info__row">
              <dt>{(t as any)("trackCase.info.location")}</dt>
              <dd>Jabalia Camp, Gaza</dd>
            </div>
            <div className="case-info__row case-info__row--full">
            <dt>{(t as any)("trackCase.info.describe")}</dt>
            <dd>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec
              quis augue eu purus rhoncus placerat.
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
            <dd>Mohammed Ali</dd>
          </div>
          <div className="case-info__row">
            <dt>{(t as any)("trackCase.info.id")}</dt>
            <dd>000000000</dd>
          </div>
          <div className="case-info__row">
            <dt>{(t as any)("trackCase.info.phone")}</dt>
            <dd>059 0000000</dd>
          </div>
          <div className="case-info__row">
            <dt>{(t as any)("trackCase.info.relationship")}</dt>
            <dd>Friend</dd>
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
