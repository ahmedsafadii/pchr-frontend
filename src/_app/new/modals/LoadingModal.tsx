"use client";

import BlockingModal from "./BlockingModal";
import { useTranslations } from "next-globe-gen";

export default function LoadingModal({ isOpen }: { isOpen: boolean }) {
  const t = useTranslations();
  return (
    <BlockingModal isOpen={isOpen}>
      <div className="loading">
        <div className="loading__spinner" />
        <p className="loading__text">{t("newCase.submitModals.loading.title")}</p>
      </div>
      <style jsx>{`
        .loading { display: flex; flex-direction: column; align-items: center; gap: 12px; }
        .loading__spinner { width: 40px; height: 40px; border: 4px solid #eee; border-top-color: var(--color-primary, #da9305); border-radius: 50%; animation: spin 1s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </BlockingModal>
  );
}


