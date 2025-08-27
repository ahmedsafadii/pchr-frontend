"use client";

import { useState, useEffect } from "react";
import { useLocale, useTranslations } from "next-globe-gen";
import { IconX } from "@tabler/icons-react";
import CustomSelect from "../CustomSelect";
import toast from "react-hot-toast";
import { updateCaseStatus } from "../../services/api";
import { LawyerAuth } from "../../utils/auth";

interface UpdateCaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: UpdateCaseData) => Promise<any>;
  currentStatus?: string;
  caseId: string;
}

interface UpdateCaseData {
  status: string;
  details: string;
  files: string[];
}

interface FieldErrors {
  status?: string[];
  details?: string[];
  [key: string]: string[] | undefined;
}

export default function UpdateCaseModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  currentStatus,
  caseId 
}: UpdateCaseModalProps) {
  const t = useTranslations();
  const locale = useLocale();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  
  const [formData, setFormData] = useState<UpdateCaseData>({
    status: currentStatus || "",
    details: "",
    files: [],
  });

  // Status options for case updates
  const statusOptions = [
    { value: "pending", label: t("lawyer.cases.statusOptions.pending", locale) },
    { value: "in_progress", label: t("lawyer.cases.statusOptions.inProgress", locale) },
    { value: "completed", label: t("lawyer.cases.statusOptions.completed", locale) },
    { value: "under_review", label: t("lawyer.cases.statusOptions.underReview", locale) },
    { value: "awaiting_documents", label: t("lawyer.cases.statusOptions.awaitingDocuments", locale) },
    { value: "detention_confirmed", label: t("lawyer.cases.statusOptions.detentionConfirmed", locale) },
    { value: "released", label: t("lawyer.cases.statusOptions.released", locale) },
    { value: "deceased", label: t("lawyer.cases.statusOptions.deceased", locale) },
    { value: "enforced_disappearance", label: t("lawyer.cases.statusOptions.enforcedDisappearance", locale) },
    { value: "re-open", label: t("lawyer.cases.statusOptions.reOpen", locale) },
  ];

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setFormData({
        status: currentStatus || "",
        details: "",
        files: [],
      });
      setError(null);
      setFieldErrors({});
    }
  }, [isOpen, currentStatus]);

  const clearErrors = () => {
    setError(null);
    setFieldErrors({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearErrors();
    
    // Client-side validation
    const validationErrors: FieldErrors = {};
    if (!formData.status) {
      validationErrors.status = [t("lawyer.caseDetails.updateCaseModal.errors.statusRequired", locale)];
    }
    if (!formData.details.trim()) {
      validationErrors.details = [t("lawyer.caseDetails.updateCaseModal.errors.detailsRequired", locale)];
    }
    
    if (Object.keys(validationErrors).length > 0) {
      setFieldErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      // Get auth token
      const token = LawyerAuth.getAccessToken();
      if (!token) {
        throw new Error("Not authenticated");
      }

      // Call the API to update case status
      const response = await updateCaseStatus(
        caseId,
        formData.status,
        formData.details,
        token,
        locale
      );

      if (response.status === "success") {
        // Show success toast
        toast.success(response.message || "Case status updated successfully");
        
        // Call the parent onSubmit to refresh the page
        await onSubmit({
          ...formData,
          files: [],
        });
        
        onClose();
      } else {
        throw new Error(response.message || "Failed to update case status");
      }
    } catch (err: any) {
      console.error("Error updating case status:", err);
      
      // Show error toast
      const errorMessage = err.message || "Failed to update case status";
      toast.error(errorMessage);
      
      // Set error in modal for additional context
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof UpdateCaseData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear field error when user starts typing
    if (fieldErrors[field]) {
      setFieldErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleStatusChange = (selectedValue: string) => {
    handleInputChange("status", selectedValue);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h2 className="modal-title">{t("lawyer.caseDetails.updateCaseModal.title", locale)}</h2>
          <button className="modal-close-btn" onClick={onClose}>
            <IconX size={24} />
          </button>
        </div>

        <form className="modal-form" onSubmit={handleSubmit}>
          {error && (
            <div className="modal-field">
              <div className="modal-field-error">{error}</div>
            </div>
          )}

          {/* Status Field */}
          <div className="modal-field">
            <label className="modal-label">
              {t("lawyer.caseDetails.updateCaseModal.status", locale)}
            </label>
            <CustomSelect
              options={statusOptions}
              value={formData.status}
              onChange={handleStatusChange}
              placeholder={t("lawyer.caseDetails.updateCaseModal.status", locale)}
              className={fieldErrors.status ? "modal-select--error" : ""}
              fullWidth={true}
            />
            {fieldErrors.status && (
              <div className="modal-field-error">{fieldErrors.status[0]}</div>
            )}
          </div>

          {/* Details Field */}
          <div className="modal-field">
            <label className="modal-label">
              {t("lawyer.caseDetails.updateCaseModal.details", locale)}
            </label>
            <textarea
              className={`modal-textarea ${fieldErrors.details ? "modal-input--error" : ""}`}
              value={formData.details}
              onChange={(e) => handleInputChange("details", e.target.value)}
              placeholder={t("lawyer.caseDetails.updateCaseModal.detailsPlaceholder", locale)}
              rows={4}
            />
            {fieldErrors.details && (
              <div className="modal-field-error">{fieldErrors.details[0]}</div>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="modal-submit-btn"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Updating..." : t("lawyer.caseDetails.updateCaseModal.updateCase", locale)}
          </button>
        </form>
      </div>
    </div>
  );
}
