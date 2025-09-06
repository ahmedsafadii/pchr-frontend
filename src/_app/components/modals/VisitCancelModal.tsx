"use client";

import { useState } from "react";
import { useTranslations } from "next-globe-gen";
import { IconX } from "@tabler/icons-react";

interface VisitCancelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (reason: string) => void;
  visitId?: string;
}

export default function VisitCancelModal({ isOpen, onClose, onSubmit }: VisitCancelModalProps) {
  const t = useTranslations();
  const [cancelReason, setCancelReason] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (cancelReason.trim()) {
      onSubmit(cancelReason);
      setCancelReason("");
      onClose();
    }
  };

  const handleClose = () => {
    setCancelReason("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">{t("lawyer.modals.visitCancel.title")}</h2>
          <button className="modal-close-btn" onClick={handleClose}>
            <IconX size={24} />
          </button>
        </div>

        <form className="modal-form" onSubmit={handleSubmit}>
          <div className="modal-field">
            <label className="modal-label modal-label--required">
              {t("lawyer.modals.visitCancel.cancelReasonField")}
            </label>
            <textarea
              className="modal-textarea"
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              placeholder={t("lawyer.modals.visitCancel.cancelReasonPlaceholder")?.toString()}
              rows={8}
              required
            />
          </div>

          <button type="submit" className="modal-submit-btn">
            {t("lawyer.modals.visitCancel.cancel")}
          </button>
        </form>
      </div>
    </div>
  );
}
