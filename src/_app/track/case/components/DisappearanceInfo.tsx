"use client";

import { useTranslations } from "next-globe-gen";

export default function DisappearanceInfo() {
  const t = useTranslations();
  return (
    <div className="case-info">
      <h2 className="case-info__title">{(t as any)("trackCase.info.title")}</h2>

      <div className="case-info__grid">
        <div className="case-info__block">
          <h3 className="case-info__subtitle">{(t as any)("trackCase.info.detainee")}</h3>
          <dl className="case-info__dl">
            <div className="case-info__row"><dt>{(t as any)("trackCase.info.fullName")}</dt><dd>Khaled Ahmed Shaban</dd></div>
            <div className="case-info__row"><dt>{(t as any)("trackCase.info.job")}</dt><dd>Worker</dd></div>
            <div className="case-info__row"><dt>{(t as any)("trackCase.info.dob")}</dt><dd>24 FEB 2022</dd></div>
            <div className="case-info__row"><dt>{(t as any)("trackCase.info.id")}</dt><dd>123421222222</dd></div>
            <div className="case-info__row"><dt>{(t as any)("trackCase.info.health")}</dt><dd>Bad</dd></div>
            <div className="case-info__row"><dt>{(t as any)("trackCase.info.marital")}</dt><dd>Single</dd></div>
            <div className="case-info__row"><dt>{(t as any)("trackCase.info.location")}</dt><dd>Jabalia Camp, Gaza Strip</dd></div>
          </dl>
        </div>

        <div className="case-info__block">
          <h3 className="case-info__subtitle">{(t as any)("trackCase.info.detention")}</h3>
          <dl className="case-info__dl">
            <div className="case-info__row"><dt>{(t as any)("trackCase.info.disappearanceDate")}</dt><dd>24 FEB 2022</dd></div>
            <div className="case-info__row"><dt>{(t as any)("trackCase.info.status")}</dt><dd>Worker</dd></div>
            <div className="case-info__row"><dt>{(t as any)("trackCase.info.location")}</dt><dd>Jabalia Camp, Gaza</dd></div>
            <div className="case-info__row"><dt>{(t as any)("trackCase.info.describe")}</dt><dd>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec quis augue eu purus rhoncus placerat.</dd></div>
          </dl>
        </div>
      </div>

      <div className="case-info__block">
        <h3 className="case-info__subtitle">{(t as any)("trackCase.info.client")}</h3>
        <dl className="case-info__dl">
          <div className="case-info__row"><dt>{(t as any)("trackCase.info.fullName")}</dt><dd>Mohammed Ali</dd></div>
          <div className="case-info__row"><dt>{(t as any)("trackCase.info.id")}</dt><dd>000000000</dd></div>
          <div className="case-info__row"><dt>{(t as any)("trackCase.info.phone")}</dt><dd>059 0000000</dd></div>
          <div className="case-info__row"><dt>{(t as any)("trackCase.info.relationship")}</dt><dd>Friend</dd></div>
        </dl>
      </div>

      <div className="case-info__block">
        <h3 className="case-info__subtitle">{(t as any)("trackCase.info.documents")}</h3>
        <ul className="case-info__files">
          <li>ID.pdf</li>
          <li>Proposal.pdf</li>
          <li>Case.pdf</li>
        </ul>
      </div>

      <div className="case-info__block">
        <h3 className="case-info__subtitle">{(t as any)("trackCase.info.signature")}</h3>
        <p className="case-info__link">{(t as any)("trackCase.info.terms")}</p>
        <div className="case-info__signature">—</div>
      </div>
    </div>
  );
}


