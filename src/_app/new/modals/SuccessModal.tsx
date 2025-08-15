"use client";

import BlockingModal from "./BlockingModal";
import { useTranslations, useLocale } from "next-globe-gen";
import { IconCircleCheck } from "@tabler/icons-react";
import { useRouter } from "next/navigation";

interface SuccessModalProps {
  isOpen: boolean;
  caseRef: string;
  onTrack: () => void;
  onClose?: () => void;
}

export default function SuccessModal({
  isOpen,
  caseRef,
  onTrack,
}: SuccessModalProps) {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();

  const handleTrackClick = () => {
    onTrack(); // Call the original callback (for any cleanup)
    router.push(`/${locale}/track`); // Navigate to track page with locale prefix
  };
  return (
    <BlockingModal isOpen={isOpen}>
      <div className="success">
        <div className="success__icon">
          <IconCircleCheck size={32} stroke={1.2} />
        </div>
        <h3 className="success__title">
          {t("newCase.submitModals.success.title")}
        </h3>
        <div className="success__ref">
          <span>{t("newCase.submitModals.success.caseRef")}</span>
          <strong>{caseRef}</strong>
          <button
            className="success__copy"
            onClick={() => navigator.clipboard.writeText(caseRef)}
          >
            {t("newCase.submitModals.success.copy")}
          </button>
        </div>
        <button
          className="success__cta success__cta--primary"
          onClick={handleTrackClick}
        >
          {t("newCase.submitModals.success.cta")}
        </button>
      </div>
      <style jsx>{`
        .success {
          text-align: center;
        }
        .success__icon {
          background: var(--secondary-900);
          color: var(--white);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 16px auto;
          width: 64px;
          height: 64px;
          margin: 0 auto 16px auto;
        }
        .success__title {
          font-size: 24px;
          margin: 0 auto 8px auto;
          font-weight: 900;
        }
        .success__ref {
          display: flex;
          align-items: center;
          gap: 8px;
          justify-content: center;
          margin: 8px 0 16px;
        }
        .success__copy {
          background: transparent;
          text-decoration: underline;
        }
        .success__cta {
          background: var(--color-primary, #da9305);
          color: #fff;
          border-radius: 8px;
          height: 44px;
          padding: 0 16px;
        }
        .success__cta--primary {
          background: var(--primary-900);
          color: #fff;
          cursor: pointer;
        }
        .error__btn--primary:hover {
          background: var(--secondary-900);
          color: #fff;
        }
      `}</style>
    </BlockingModal>
  );
}
