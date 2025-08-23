"use client";

import { useState } from "react";
import { useTranslations } from "next-globe-gen";
import { IconX } from "@tabler/icons-react";

interface VisitRejectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (reason: string) => void;
  visitId?: string;
}

export default function VisitRejectionModal({ isOpen, onClose, onSubmit }: VisitRejectionModalProps) {
  const t = useTranslations();
  const [rejectionReason, setRejectionReason] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rejectionReason.trim()) {
      onSubmit(rejectionReason);
      setRejectionReason("");
      onClose();
    }
  };

  const handleClose = () => {
    setRejectionReason("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">{t("lawyer.modals.visitRejection.title")}</h2>
          <button className="modal-close-btn" onClick={handleClose}>
            <IconX size={24} />
          </button>
        </div>

        <form className="modal-form" onSubmit={handleSubmit}>
          <div className="modal-field">
            <label className="modal-label">
              {t("lawyer.modals.visitRejection.rejectionReasonField")}
            </label>
            <textarea
              className="modal-textarea"
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder={t("lawyer.modals.visitRejection.rejectionReasonPlaceholder")?.toString()}
              rows={8}
              required
            />
          </div>

          <button type="submit" className="modal-submit-btn">
            {t("lawyer.modals.visitRejection.save")}
          </button>
        </form>
      </div>
    </div>
  );
}
