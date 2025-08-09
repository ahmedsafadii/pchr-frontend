"use client";

import BlockingModal from "./BlockingModal";
import { useTranslations } from "next-globe-gen";
import { IconX } from "@tabler/icons-react";

interface ErrorModalProps {
  isOpen: boolean;
  message?: string;
  onRetry: () => void;
  onClose: () => void;
}

export default function ErrorModal({
  isOpen,
  message,
  onRetry,
  onClose,
}: ErrorModalProps) {
  const t = useTranslations();
  return (
    <BlockingModal isOpen={isOpen}>
      <div className="error">
        <div className="modal__icon">
          <IconX size={32} stroke={1.2} />
        </div>
        <h3 className="error__title">
          {t("newCase.submitModals.error.title")}
        </h3>
        <p className="error__message">
          {message || t("newCase.submitModals.error.message")}
        </p>
        <div className="error__actions">
          <button
            className="error__btn error__btn--secondary"
            onClick={onClose}
          >
            {t("newCase.submitModals.error.close")}
          </button>
          <button className="error__btn error__btn--primary" onClick={onRetry}>
            {t("newCase.submitModals.error.retry")}
          </button>
        </div>
      </div>
      <style jsx>{`
        .modal__icon {
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
        .error__title {
          font-size: 24px;
          margin: 0 auto 8px auto;
          font-weight: 900;
          max-width: 300px;
        }
        .error__message {
          text-align: center;
          margin-bottom: 36px;
        }
        .error__actions {
          display: flex;
          gap: 12px;
          justify-content: center;
        }
        .error__btn {
          min-width: 120px;
          height: 44px;
          border-radius: 8px;
        }
        .error__btn--primary {
          background: var(--primary-900);
          color: #fff;
          cursor: pointer;
        }
        .error__btn--primary:hover {
          background: var(--secondary-900);
          color: #fff;
        }
        .error__btn--secondary {
          background: var(--neutral-100);
          cursor: pointer;
        }
        .error__btn--secondary:hover {
          background: var(--neutral-300);
        }
      `}</style>
    </BlockingModal>
  );
}
