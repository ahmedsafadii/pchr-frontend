"use client";

import { useState, useEffect } from "react";
import { Tooltip } from "react-tooltip";
import { IconInfoCircle } from "@tabler/icons-react";
import { CaseData } from "../page";
import CustomSelect from "../../components/CustomSelect";
import { 
  validatePalestinianId, 
  getPalestinianIdErrorMessage, 
  getPalestinianIdTooltip,
  validatePalestinianPhone,
  getPalestinianPhoneErrorMessage,
  getPalestinianPhoneTooltip
} from "../../utils/validation";
import { defaultTooltipProps, createTooltipProps, tooltipIconClasses } from "../../utils/tooltip";

interface Step3Props {
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

export default function Step3({
  data,
  updateData,
  onComplete,
  onNext,
  onPrevious,
  currentStep,
  canGoNext,
  locale = "en",
}: Step3Props) {
  const [formData, setFormData] = useState(data.clientInfo);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    setFormData(data.clientInfo);
  }, [data.clientInfo]);

  const handleInputChange = (field: string, value: string) => {
    const updatedFormData = {
      ...formData,
      [field]: value,
    };
    
    setFormData(updatedFormData);
    
    // Update parent component data immediately
    updateData("clientInfo", updatedFormData);

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

    if (!formData.fullName.trim()) {
      newErrors.fullName =
        locale === "ar" ? "الاسم الكامل مطلوب" : "Full name is required";
    }

    if (!formData.idNumber.trim()) {
      newErrors.idNumber =
        locale === "ar" ? "رقم الهوية مطلوب" : "ID number is required";
    } else if (!validatePalestinianId(formData.idNumber)) {
      newErrors.idNumber = getPalestinianIdErrorMessage(locale);
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber =
        locale === "ar" ? "رقم الهاتف مطلوب" : "Phone number is required";
    } else if (!validatePalestinianPhone(formData.phoneNumber)) {
      newErrors.phoneNumber = getPalestinianPhoneErrorMessage(locale);
    }

    if (!formData.relationship.trim()) {
      newErrors.relationship =
        locale === "ar" ? "العلاقة مطلوبة" : "Relationship is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateForm()) {
      updateData("clientInfo", formData);
      onComplete(currentStep);
      onNext();
    }
  };

  const relationshipOptions = [
    { value: "", label: locale === "ar" ? "اختر" : "Choose" },
    { value: "spouse", label: locale === "ar" ? "زوج/زوجة" : "Spouse" },
    { value: "parent", label: locale === "ar" ? "أب/أم" : "Parent" },
    { value: "child", label: locale === "ar" ? "ابن/ابنة" : "Child" },
    { value: "sibling", label: locale === "ar" ? "أخ/أخت" : "Sibling" },
    { value: "relative", label: locale === "ar" ? "قريب" : "Relative" },
    { value: "friend", label: locale === "ar" ? "صديق" : "Friend" },
    { value: "other", label: locale === "ar" ? "أخرى" : "Other" },
  ];

  return (
    <div className="steps">
      <header className="steps__header">
        <span className="steps__step-number">STEP 3</span>
        <h2 className="steps__title">
          {locale === "ar" ? "معلومات العميل" : "Client Informations"}
        </h2>
      </header>

      <form className="steps__form" onSubmit={(e) => e.preventDefault()}>
        {/* Client Details Section */}
        <section className="steps__section">
          <div className="steps__form-groups">
            <div className="steps__form-group">
              <label className="steps__label">
                {locale === "ar" ? "الاسم الكامل" : "Full Name"}{" "}
                <span className="steps__required">*</span>
              </label>
              <input
                type="text"
                className={`steps__input ${
                  errors.fullName ? "steps__input--error" : ""
                }`}
                placeholder={
                  locale === "ar" ? "مثال: محمد علي" : "Ex: Mohammed Ali"
                }
                value={formData.fullName}
                onChange={(e) => handleInputChange("fullName", e.target.value)}
              />
              {errors.fullName && (
                <span className="steps__error">{errors.fullName}</span>
              )}
            </div>

            <div className="steps__form-group">
              <label className="steps__label">
                {locale === "ar" ? "رقم الهوية" : "ID Number"}{" "}
                <span className="steps__required">*</span>
                <IconInfoCircle 
                  size={16} 
                  className={tooltipIconClasses}
                  {...createTooltipProps("client-id-number-tooltip", getPalestinianIdTooltip(locale))}
                />
              </label>
              <input
                type="text"
                className={`steps__input ${
                  errors.idNumber ? "steps__input--error" : ""
                }`}
                placeholder="123456789"
                value={formData.idNumber}
                onChange={(e) => handleInputChange("idNumber", e.target.value)}
                maxLength={9}
              />
              {errors.idNumber && (
                <span className="steps__error">{errors.idNumber}</span>
              )}
              <Tooltip 
                id="client-id-number-tooltip"
                {...defaultTooltipProps}
              />
            </div>

            <div className="steps__form-group">
              <label className="steps__label">
                {locale === "ar" ? "رقم الهاتف" : "Phone Number"}{" "}
                <span className="steps__required">*</span>
                <IconInfoCircle 
                  size={16} 
                  className={tooltipIconClasses}
                  {...createTooltipProps("phone-number-tooltip", getPalestinianPhoneTooltip(locale))}
                />
              </label>
              <div className="steps__input-wrapper">
                <input
                  type="tel"
                  className={`steps__input ${
                    errors.phoneNumber ? "steps__input--error" : ""
                  }`}
                  placeholder="0591234567"
                  value={formData.phoneNumber}
                  onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
                  maxLength={10}
                />
              </div>
              {errors.phoneNumber && (
                <span className="steps__error">{errors.phoneNumber}</span>
              )}
              <Tooltip 
                id="phone-number-tooltip"
                {...defaultTooltipProps}
              />
            </div>

            <div className="steps__form-group">
              <label className="steps__label">
                {locale === "ar" ? "العلاقة" : "Relationship"}{" "}
                <span className="steps__required">*</span>
              </label>
              <CustomSelect
                options={relationshipOptions}
                value={formData.relationship}
                onChange={(value) => handleInputChange("relationship", value)}
                placeholder={locale === "ar" ? "اختر" : "Choose"}
                isError={!!errors.relationship}
                instanceId="step3-relationship-select"
              />
              {errors.relationship && (
                <span className="steps__error">{errors.relationship}</span>
              )}
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