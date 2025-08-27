"use client";

import { useState } from "react";
import { useTranslations } from "next-globe-gen";
import { IconX } from "@tabler/icons-react";

interface VisitApproveModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (notes: string) => void;
  visitId?: string;
}

export default function VisitApproveModal({ isOpen, onClose, onSubmit }: VisitApproveModalProps) {
  const t = useTranslations();
  const [notes, setNotes] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (notes.trim()) {
      onSubmit(notes);
      setNotes("");
      onClose();
    }
  };

  const handleClose = () => {
    setNotes("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">{t("lawyer.modals.visitApprove.title")}</h2>
          <button className="modal-close-btn" onClick={handleClose}>
            <IconX size={24} />
          </button>
        </div>

        <form className="modal-form" onSubmit={handleSubmit}>
          <div className="modal-field">
            <label className="modal-label">
              {t("lawyer.modals.visitApprove.notesField")}
            </label>
            <textarea
              className="modal-textarea"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={t("lawyer.modals.visitApprove.notesPlaceholder")?.toString()}
              rows={8}
              required
            />
          </div>

          <button type="submit" className="modal-submit-btn">
            {t("lawyer.modals.visitApprove.approve")}
          </button>
        </form>
      </div>
    </div>
  );
}
