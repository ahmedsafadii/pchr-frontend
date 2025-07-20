"use client";

import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { CaseData } from "../page";

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
}

export default function Step4({
  data,
  updateData,
  onComplete,
  onNext,
  onPrevious,
  currentStep,
  canGoNext,
  locale = "en",
}: Step4Props) {
  const [formData, setFormData] = useState(data.delegationInfo);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    setFormData(data.delegationInfo);
  }, [data.delegationInfo]);

  const handleInputChange = (field: string, value: string) => {
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

    if (!formData.authorizedAnotherParty.trim()) {
      newErrors.authorizedAnotherParty =
        locale === "ar" ? "هذا الحقل مطلوب" : "This field is required";
    }

    if (!formData.previousDelegation.trim()) {
      newErrors.previousDelegation =
        locale === "ar" ? "هذا الحقل مطلوب" : "This field is required";
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

  const yesNoOptions = [
    { value: "", label: locale === "ar" ? "اختر" : "Choose" },
    { value: "yes", label: locale === "ar" ? "نعم" : "Yes" },
    { value: "no", label: locale === "ar" ? "لا" : "No" },
  ];

  return (
    <div className="steps">
      <header className="steps__header">
        <span className="steps__step-number">STEP 4</span>
        <h2 className="steps__title">
          {locale === "ar" ? "التفويض والتواصل" : "Delegation & Communication"}
        </h2>
      </header>

      <form className="steps__form" onSubmit={(e) => e.preventDefault()}>
        {/* Delegation Details Section */}
        <section className="steps__section">
          <div className="steps__form-groups">
            <div className="steps__form-group">
              <label className="steps__label">
                {locale === "ar" ? "هل فوضت طرف آخر من قبل؟" : "Authorized Another Party Before?"}{" "}
                <span className="steps__required">*</span>
              </label>
              <select
                className={`steps__select ${
                  errors.authorizedAnotherParty ? "steps__select--error" : ""
                }`}
                value={formData.authorizedAnotherParty}
                onChange={(e) =>
                  handleInputChange("authorizedAnotherParty", e.target.value)
                }
              >
                {yesNoOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {errors.authorizedAnotherParty && (
                <span className="steps__error">{errors.authorizedAnotherParty}</span>
              )}
            </div>

            <div className="steps__form-group">
              <label className="steps__label">
                {locale === "ar" ? "التفويض السابق؟" : "Previous Delegation?"}{" "}
                <span className="steps__required">*</span>
              </label>
              <select
                className={`steps__select ${
                  errors.previousDelegation ? "steps__select--error" : ""
                }`}
                value={formData.previousDelegation}
                onChange={(e) =>
                  handleInputChange("previousDelegation", e.target.value)
                }
              >
                {yesNoOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {errors.previousDelegation && (
                <span className="steps__error">{errors.previousDelegation}</span>
              )}
            </div>

            <div className="steps__form-group">
              <label className="steps__label">
                {locale === "ar" ? "اسم المنظمة" : "Organisation Name"}
              </label>
              <input
                type="text"
                className="steps__input"
                placeholder={
                  locale === "ar" ? "اسم المنظمة" : "Organisation Name"
                }
                value={formData.organisationName}
                onChange={(e) => handleInputChange("organisationName", e.target.value)}
              />
            </div>

            <div className="steps__form-group">
              <label className="steps__label">
                {locale === "ar" ? "التاريخ" : "Date"}
              </label>
              <div className="steps__input-wrapper">
                <DatePicker
                  selected={
                    formData.date
                      ? new Date(formData.date)
                      : null
                  }
                  onChange={(date) => {
                    const formattedDate = date
                      ? date.toISOString().split("T")[0]
                      : "";
                    handleInputChange("date", formattedDate);
                  }}
                  dateFormat="dd/MM/yyyy"
                  placeholderText="DD/MM/YYYY"
                  maxDate={new Date()}
                  showYearDropdown
                  scrollableYearDropdown
                  yearDropdownItemNumber={100}
                  className="steps__input"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Navigation */}
        <div className="steps__navigation">
          <button
            type="button"
            className="steps__button steps__button--previous"
            onClick={onPrevious}
          >
            <span>{locale === "ar" ? "السابق" : "Prev"}</span>
          </button>
          <button
            type="button"
            className="steps__button steps__button--next"
            onClick={handleNext}
            disabled={!canGoNext}
          >
            <span>{locale === "ar" ? "التالي" : "Next"}</span>
          </button>
        </div>
      </form>
    </div>
  );
} 