"use client";

import { useState } from "react";
import { useTranslations } from "next-globe-gen";
import { IconX } from "@tabler/icons-react";
import LocalizedDatePicker from "../LocalizedDatePicker";
import toast from "react-hot-toast";

interface VisitApproveModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (notes: string, visit_approved_date: string) => Promise<void>;
  visitId?: string;
}

export default function VisitApproveModal({
  isOpen,
  onClose,
  onSubmit,
}: VisitApproveModalProps) {
  const t = useTranslations();
  const [notes, setNotes] = useState("");
  const [visitApprovedDate, setVisitApprovedDate] = useState<Date | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ notes?: string; date?: string }>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clear previous errors
    setErrors({});
    
    // Validation
    const newErrors: { notes?: string; date?: string } = {};
    
    if (!notes.trim()) {
      newErrors.notes = t("lawyer.modals.visitApprove.errors.notesRequired");
    }
    
    if (!visitApprovedDate) {
      newErrors.date = t("lawyer.modals.visitApprove.errors.dateRequired");
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    
    try {
      const formattedDate = visitApprovedDate!.toISOString().split("T")[0];
      await onSubmit(notes, formattedDate);
      
      // Show success toast
      toast.success(t("lawyer.modals.visitApprove.success"));
      
      // Reset form and close modal
      setNotes("");
      setVisitApprovedDate(null);
      onClose();
    } catch (error: any) {
      console.error('Error approving visit:', error);
      
      // Show error toast with backend error message
      const errorMessage = error?.error?.message || error?.message || t("messages.errors.failedToApproveVisit");
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setNotes("");
    setVisitApprovedDate(null);
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">
            {t("lawyer.modals.visitApprove.title")}
          </h2>
          <button className="modal-close-btn" onClick={handleClose}>
            <IconX size={24} />
          </button>
        </div>

        <form className="modal-form" onSubmit={handleSubmit}>
          <div className="modal-field">
            <label className="modal-label modal-label--required">
              {t("lawyer.modals.visitApprove.approvedDateField")}
            </label>
            <div className="modal-date-picker-wrapper">
              <LocalizedDatePicker
                selected={visitApprovedDate}
                onChange={(date: Date | null) => setVisitApprovedDate(date)}
                dateFormat="dd/MM/yyyy"
                placeholderText={t(
                  "lawyer.modals.visitApprove.approvedDatePlaceholder"
                )?.toString()}
                className={`modal-input ${errors.date ? 'modal-input--error' : ''}`}
                required
                showYearDropdown
                showMonthDropdown
                dropdownMode="select"
              />
            </div>
            {errors.date && (
              <div className="modal-error">
                {errors.date}
              </div>
            )}
          </div>

          <div className="modal-field">
            <label className="modal-label modal-label--required">
              {t("lawyer.modals.visitApprove.notesField")}
            </label>
            <textarea
              className={`modal-textarea ${errors.notes ? 'modal-textarea--error' : ''}`}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={t(
                "lawyer.modals.visitApprove.notesPlaceholder"
              )?.toString()}
              rows={8}
            />
            {errors.notes && (
              <div className="modal-error">
                {errors.notes}
              </div>
            )}
          </div>

          <button 
            type="submit" 
            className="modal-submit-btn"
            disabled={isSubmitting}
          >
            {isSubmitting ? t("common.sending") : t("lawyer.modals.visitApprove.approve")}
          </button>
        </form>
      </div>
    </div>
  );
}
