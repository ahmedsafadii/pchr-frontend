"use client";

import { useState } from "react";
import { useTranslations } from "next-globe-gen";
import { IconX } from "@tabler/icons-react";

interface VisitOutcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (outcome: string) => void;
  visitId?: string;
}

export default function VisitOutcomeModal({ isOpen, onClose, onSubmit }: VisitOutcomeModalProps) {
  const t = useTranslations();
  const [outcome, setOutcome] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (outcome.trim()) {
      onSubmit(outcome);
      setOutcome("");
      onClose();
    }
  };

  const handleClose = () => {
    setOutcome("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">{t("lawyer.modals.visitOutcome.title")}</h2>
          <button className="modal-close-btn" onClick={handleClose}>
            <IconX size={24} />
          </button>
        </div>

        <form className="modal-form" onSubmit={handleSubmit}>
          <div className="modal-field">
            <label className="modal-label">
              {t("lawyer.modals.visitOutcome.outcomesField")}
            </label>
            <textarea
              className="modal-textarea"
              value={outcome}
              onChange={(e) => setOutcome(e.target.value)}
              placeholder={t("lawyer.modals.visitOutcome.outcomesPlaceholder")?.toString()}
              rows={8}
              required
            />
          </div>

          <button type="submit" className="modal-submit-btn">
            {t("lawyer.modals.visitOutcome.save")}
          </button>
        </form>
      </div>
    </div>
  );
}
