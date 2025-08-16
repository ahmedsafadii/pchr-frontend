"use client";

import { useState, useEffect, useMemo } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { CaseData } from "../page";
import CustomSelect from "../../components/CustomSelect";
import { useTranslations } from "next-globe-gen";

interface Step4Props {
  data: CaseData;
  updateData: (section: keyof CaseData, data: any) => void;
  onComplete: (stepNumber: number) => void;
  isCompleted: boolean;
  onNext: () => void;
  onPrevious: () => void;
  canGoNext: boolean;
  currentStep: number;
  totalSteps: number;
  locale?: string;
  externalErrors?: string[];
}

export default function Step4({
  data,
  updateData,
  onComplete,
  onNext,
  onPrevious,
  currentStep,
  canGoNext,
  externalErrors = [],
}: Step4Props) {
  const [formData, setFormData] = useState(data.delegationInfo);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const t = useTranslations();

  useEffect(() => {
    setFormData(data.delegationInfo);
  }, [data.delegationInfo]);

  // Handle external errors from API validation
  useEffect(() => {
    if (externalErrors.length > 0) {
      const newErrors: Record<string, string> = {};
      
      externalErrors.forEach(errorMsg => {
        // Map error messages to field names based on content
        const lowerMsg = errorMsg.toLowerCase();
        if (lowerMsg.includes('authorized') || lowerMsg.includes('authorized_another_party')) {
          newErrors.authorizedAnotherParty = errorMsg;
        } else if (lowerMsg.includes('previous delegation') || lowerMsg.includes('previous_delegation')) {
          newErrors.previousDelegation = errorMsg;
        } else if (lowerMsg.includes('organisation') || lowerMsg.includes('organisation_name')) {
          newErrors.organisationName = errorMsg;
        } else if (lowerMsg.includes('delegation date') || lowerMsg.includes('delegation_date')) {
          newErrors.delegationDate = errorMsg;
        } else if (lowerMsg.includes('notes') || lowerMsg.includes('delegation_notes')) {
          newErrors.delegationNotes = errorMsg;
        }
      });
      
      setErrors(prev => ({ ...prev, ...newErrors }));
    }
  }, [externalErrors]);

  const handleInputChange = (field: string, value: string | boolean) => {
    const updatedFormData = {
      ...formData,
      [field]: value,
    };
    
    setFormData(updatedFormData);
    
    // Update parent component data immediately
    updateData("delegationInfo", updatedFormData);

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Always require authorized_another_party
    if (typeof formData.authorized_another_party !== 'boolean') {
      newErrors.authorizedAnotherParty = t("newCase.step4.errors.required");
    }

    // Only require previous_delegation if authorized_another_party is true
    if (formData.authorized_another_party && typeof formData.previous_delegation !== 'boolean') {
      newErrors.previousDelegation = t("newCase.step4.errors.required");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateForm()) {
      updateData("delegationInfo", formData);
      onComplete(currentStep);
      onNext();
    }
  };

  const yesNoOptions = useMemo(() => [
    { value: "true", label: t("newCase.step4.yes") },
    { value: "false", label: t("newCase.step4.no") },
  ], [t]);

  return (
    <div className="steps">
      <header className="steps__header">
        <span className="steps__step-number">{t("newCase.step4.stepNumber")}</span>
        <h2 className="steps__title">
          {t("newCase.step4.title")}
        </h2>
      </header>

      <form className="steps__form" onSubmit={(e) => e.preventDefault()}>
        {/* Delegation Details Section */}
        <section className="steps__section">
          <div className="steps__form-groups">
            {/* Always show: Authorized Another Party Before? */}
            <div className="steps__form-group">
              <label className="steps__label">
                {t("newCase.step4.authorizedAnotherParty")} {" "}
                <span className="steps__required">*</span>
              </label>
              <CustomSelect
                options={yesNoOptions}
                value={String(formData.authorized_another_party)}
                onChange={(value) => handleInputChange("authorized_another_party", value === 'true')}
                placeholder={`${t("newCase.common.choose")} ${t("newCase.step4.authorizedAnotherParty")}`}
                isError={!!errors.authorizedAnotherParty}
                instanceId="step4-authorized-party-select"
              />
              {errors.authorizedAnotherParty && (
                <span className="steps__error">{errors.authorizedAnotherParty}</span>
              )}
            </div>

            {/* Show if authorized_another_party is Yes */}
            {formData.authorized_another_party && (
              <>
                <div className="steps__form-group">
                  <label className="steps__label">
                    {t("newCase.step4.organisationName")}
                  </label>
                  <input
                    type="text"
                    className="steps__input"
                    placeholder={t("newCase.step4.organisationNamePlaceholder")}
                    value={formData.organisation_name}
                    onChange={(e) => handleInputChange("organisation_name", e.target.value)}
                  />
                </div>

                <div className="steps__form-group">
                  <label className="steps__label">
                    {t("newCase.step4.previousDelegation")} {" "}
                    <span className="steps__required">*</span>
                  </label>
                  <CustomSelect
                    options={yesNoOptions}
                    value={String(formData.previous_delegation)}
                    onChange={(value) => handleInputChange("previous_delegation", value === 'true')}
                    placeholder={`${t("newCase.common.choose")} ${t("newCase.step4.previousDelegation")}`}
                    isError={!!errors.previousDelegation}
                    instanceId="step4-previous-delegation-select"
                  />
                  {errors.previousDelegation && (
                    <span className="steps__error">{errors.previousDelegation}</span>
                  )}
                </div>

                {/* Show date field if previous_delegation is Yes */}
                {formData.previous_delegation && (
                  <div className="steps__form-group">
                    <label className="steps__label">
                      {t("newCase.step4.date")}
                    </label>
                    <div className="steps__input-wrapper">
                      <DatePicker
                        selected={
                          formData.delegation_date
                            ? new Date(formData.delegation_date)
                            : null
                        }
                        onChange={(date) => {
                          const formattedDate = date
                            ? date.toISOString().split("T")[0]
                            : "";
                          handleInputChange("delegation_date", formattedDate);
                        }}
                        dateFormat="dd/MM/yyyy"
                        placeholderText={t("newCase.step4.datePlaceholder")}
                        maxDate={new Date()}
                        showYearDropdown
                        scrollableYearDropdown
                        yearDropdownItemNumber={100}
                        className="steps__input"
                      />
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </section>

        {/* Navigation */}
        <div className="steps__navigation">
          <button
            type="button"
            className="steps__button steps__button--previous"
            onClick={onPrevious}
          >
            <span>{t("newCase.common.prev")}</span>
          </button>
          <button
            type="button"
            className="steps__button steps__button--next"
            onClick={handleNext}
            disabled={!canGoNext}
          >
            <span>{t("newCase.common.next")}</span>
          </button>
        </div>
      </form>
    </div>
  );
} 