"use client";

import { useTranslations } from "next-globe-gen";
import BlockingModal from "./BlockingModal";

interface ConfirmSubmitModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmSubmitModal({
  isOpen,
  onConfirm,
  onCancel,
}: ConfirmSubmitModalProps) {
  const t = useTranslations();
  return (
    <BlockingModal isOpen={isOpen}>
      <div className="confirm">
        <h3 className="confirm__title">
          {t("newCase.submitModals.confirm.title")}
        </h3>
        <div className="confirm__actions">
          <button
            className="confirm__btn confirm__btn--primary"
            onClick={onConfirm}
          >
            {t("newCase.submitModals.confirm.yes")}
          </button>
          <button
            className="confirm__btn confirm__btn--secondary"
            onClick={onCancel}
          >
            {t("newCase.submitModals.confirm.no")}
          </button>
        </div>
      </div>
      <style jsx>{`
        .confirm__title {
          font-size: 24px;
          margin: 0 auto 36px auto;
          font-weight: 700;
          max-width: 300px;
        }
        .confirm__actions {
          display: flex;
          gap: 12px;
          justify-content: center;
        }
        .confirm__btn {
          min-width: 120px;
          height: 44px;
          border-radius: 8px;
          cursor: pointer;
        }
        .confirm__btn--primary {
          background: var(--primary-900);
          color: #fff;
        }
        .confirm__btn--primary:hover {
          background: var(--secondary-900);
          color: #fff;
        }
        .confirm__btn--secondary {
          background: var(--neutral-100);
          cursor: pointer;
        }
        .confirm__btn--secondary:hover {
          background: var(--neutral-300);
        }
      `}</style>
    </BlockingModal>
  );
}
