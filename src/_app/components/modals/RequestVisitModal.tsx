"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-globe-gen";
import LocalizedDatePicker from "../LocalizedDatePicker";
import CustomSelect from "../CustomSelect";
import { IconX } from "@tabler/icons-react";
import { getVisitFormOptions } from "@/_app/services/api";
import { LawyerAuth } from "@/_app/utils/auth";

interface RequestVisitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: RequestVisitData) => Promise<any>;
}

interface RequestVisitData {
  title: string;
  prison_id: string;
  visit_type: string; // backend expects a string value key
  visitDate: Date | null;
}

interface FieldErrors {
  title?: string[];
  prison_id?: string[];
  visit_type?: string[];
  visit_date?: string[];
  [key: string]: string[] | undefined; // Allow for additional field names
}

export default function RequestVisitModal({
  isOpen,
  onClose,
  onSubmit,
}: RequestVisitModalProps) {
  const t = useTranslations();
  const locale = useLocale();
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [prisons, setPrisons] = useState<any[]>([]);
  const [visitTypes, setVisitTypes] = useState<any[]>([]);
  const [formData, setFormData] = useState<RequestVisitData>({
    title: "",
    prison_id: "",
    visit_type: "",
    visitDate: null,
  });

  // Load form options when modal opens
  useEffect(() => {
    const loadOptions = async () => {
      if (!isOpen) return;
      setIsLoading(true);
      setFieldErrors({});
      try {
        const token = LawyerAuth.getAccessToken();
        if (!token) throw new Error("NOT_AUTHENTICATED");
        const res = await getVisitFormOptions(token, locale);
        const data = res?.data ?? {};
        setPrisons(Array.isArray(data.prisons) ? data.prisons : []);
        setVisitTypes(Array.isArray(data.visit_types) ? data.visit_types : []);
      } catch (e: any) {
        console.error("Failed to load visit form options", e);
      } finally {
        setIsLoading(false);
      }
    };
    loadOptions();
  }, [isOpen, locale]);

  const clearErrors = () => {
    setFieldErrors({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearErrors();

    // Client-side validation
    const validationErrors: FieldErrors = {};
    if (!formData.prison_id) {
      validationErrors.prison_id = [
        t("lawyer.modals.requestVisit.errors.prison"),
      ];
    }
    if (!formData.visit_type) {
      validationErrors.visit_type = [
        t("lawyer.modals.requestVisit.errors.visitType"),
      ];
    }
    if (!formData.visitDate) {
      validationErrors.visit_date = [
        t("lawyer.modals.requestVisit.errors.visitDate"),
      ];
    }

    if (Object.keys(validationErrors).length > 0) {
      setFieldErrors(validationErrors);
      return;
    }

    const payload = {
      title: formData.title,
      prison_id: formData.prison_id,
      visit_type: formData.visit_type,
      visit_date: formData.visitDate!.toISOString().split("T")[0],
    };

    setIsSubmitting(true);
    try {
      const result = await onSubmit(payload as any);

      // If successful, close modal
      if (result?.status === "success") {
        handleClose();
        return;
      } else {
        // Handle any non-success response as an error
        handleApiError(result);
      }
    } catch (error: any) {
      // Handle API errors
      handleApiError(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({ title: "", prison_id: "", visit_type: "", visitDate: null });
    clearErrors();
    onClose();
  };

  // Function to handle API errors and set field-specific errors
  const handleApiError = (errorResponse: any) => {
    // Handle validation errors with field details
    if (
      errorResponse?.error?.type === "validation_error" &&
      errorResponse?.error?.details
    ) {
      // Use the exact field names from the API response
      setFieldErrors(errorResponse.error.details);
    }
    // Handle other API errors - just log them for now
    else if (errorResponse?.error?.message) {
      console.error("API Error:", errorResponse.error.message);
    }
    // Handle generic errors
    else if (errorResponse?.message) {
      console.error("API Error:", errorResponse.message);
    }
    // Fallback
    else {
      console.error("An error occurred while processing your request");
    }
  };

  // Check if a field has errors
  const hasFieldError = (fieldName: string) => {
    return fieldErrors[fieldName] && fieldErrors[fieldName]!.length > 0;
  };

  // Get error message for a field
  const getFieldError = (fieldName: string) => {
    return fieldErrors[fieldName]?.[0] || "";
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">
            {t("lawyer.modals.requestVisit.title")}
          </h2>
          <button className="modal-close-btn" onClick={handleClose}>
            <IconX size={24} />
          </button>
        </div>

        <form className="modal-form" onSubmit={handleSubmit}>
          <div className="modal-field">
            <label className="modal-label">
              {t("lawyer.modals.requestVisit.titleField")}
            </label>
            <input
              type="text"
              className={`modal-input ${
                hasFieldError("title") ? "modal-input--error" : ""
              }`}
              value={formData.title}
              onChange={(e) => {
                setFormData({ ...formData, title: e.target.value });
                if (hasFieldError("title")) {
                  setFieldErrors((prev) => ({ ...prev, title: undefined }));
                }
              }}
              placeholder={t(
                "lawyer.modals.requestVisit.titlePlaceholder"
              )?.toString()}
            />
            {hasFieldError("title") && (
              <div className="modal-field-error">{getFieldError("title")}</div>
            )}
          </div>

          <div className="modal-field">
            <label className="modal-label modal-label--required">
              {t("lawyer.modals.requestVisit.prisonName")}
            </label>
            <div
              className={
                hasFieldError("prison_id") ? "modal-select--error" : ""
              }
            >
              <CustomSelect
                value={formData.prison_id}
                onChange={(value) => {
                  setFormData({ ...formData, prison_id: value });
                  if (hasFieldError("prison_id")) {
                    setFieldErrors((prev) => ({
                      ...prev,
                      prison_id: undefined,
                    }));
                  }
                }}
                placeholder={
                  t("lawyer.modals.requestVisit.choosePrison")?.toString() ||
                  "Choose"
                }
                options={prisons}
                labelKey="name"
                valueKey="id"
                includeNullOption={false}
                isSearchable={true}
                instanceId="request-visit-prison-select"
                fullWidth
              />
            </div>
            {hasFieldError("prison_id") && (
              <div className="modal-field-error">
                {getFieldError("prison_id")}
              </div>
            )}
          </div>

          <div className="modal-field">
            <label className="modal-label modal-label--required">
              {t("lawyer.visits.table.visitType")}
            </label>
            <div
              className={
                hasFieldError("visit_type") ? "modal-select--error" : ""
              }
            >
              <CustomSelect
                value={formData.visit_type}
                onChange={(value) => {
                  setFormData({ ...formData, visit_type: value });
                  if (hasFieldError("visit_type")) {
                    setFieldErrors((prev) => ({
                      ...prev,
                      visit_type: undefined,
                    }));
                  }
                }}
                placeholder={`${t("newCase.common.choose")} ${t("lawyer.visits.table.visitType")}`}
                options={visitTypes}
                labelKey="name"
                valueKey="value"
                includeNullOption={false}
                isSearchable={true}
                instanceId="request-visit-type-select"
                fullWidth
              />
            </div>
            {hasFieldError("visit_type") && (
              <div className="modal-field-error">
                {getFieldError("visit_type")}
              </div>
            )}
          </div>

          <div className="modal-field">
            <label className="modal-label modal-label--required">
              {t("lawyer.modals.requestVisit.visitDate")}
            </label>
            <div className="modal-date-picker-wrapper">
              <LocalizedDatePicker
                selected={formData.visitDate}
                onChange={(date: Date | null) => {
                  setFormData({ ...formData, visitDate: date });
                  if (hasFieldError("visit_date")) {
                    setFieldErrors((prev) => ({
                      ...prev,
                      visit_date: undefined,
                    }));
                  }
                }}
                dateFormat="dd/MM/yyyy"
                placeholderText={
                  t("lawyer.modals.requestVisit.chooseDate")?.toString() ||
                  "Choose Date"
                }
                className={`modal-date-input ${
                  hasFieldError("visit_date") ? "modal-date-input--error" : ""
                }`}
                showYearDropdown
                scrollableYearDropdown
                yearDropdownItemNumber={10}
                required
              />
            </div>
            {hasFieldError("visit_date") && (
              <div className="modal-field-error">
                {getFieldError("visit_date")}
              </div>
            )}
          </div>

          <button
            type="submit"
            className="modal-submit-btn"
            disabled={isSubmitting || isLoading}
          >
            {isSubmitting || isLoading
              ? t("newCase.common.loading")
              : t("lawyer.modals.requestVisit.send")}
          </button>
        </form>
      </div>
    </div>
  );
}
