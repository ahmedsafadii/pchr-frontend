"use client";

import { useState, useEffect, useMemo } from "react";
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
import { useTranslations } from "next-globe-gen";
import { useConstantsStore } from "../../store/constants.store";

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
  const t = useTranslations();
  const { constants, isLoading: isConstantsLoading } = useConstantsStore();

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

    if (!formData.fullName.trim()) newErrors.fullName = t("newCase.step3.errors.fullNameRequired");

    if (!formData.idNumber.trim()) newErrors.idNumber = t("newCase.step3.errors.idNumberRequired");
    else if (!validatePalestinianId(formData.idNumber)) newErrors.idNumber = getPalestinianIdErrorMessage(locale);

    if (!formData.phoneNumber.trim()) newErrors.phoneNumber = t("newCase.step3.errors.phoneNumberRequired");
    else if (!validatePalestinianPhone(formData.phoneNumber)) newErrors.phoneNumber = getPalestinianPhoneErrorMessage(locale);

    if (!formData.relationship.trim()) newErrors.relationship = t("newCase.step3.errors.relationshipRequired");

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

  const relationshipOptions = useMemo(() => (constants?.data?.relationships as any[]) || [], [constants]);

  return (
    <div className="steps">
      <header className="steps__header">
        <span className="steps__step-number">{t("newCase.step3.stepNumber")}</span>
        <h2 className="steps__title">
          {t("newCase.step3.title")}
        </h2>
      </header>

      <form className="steps__form" onSubmit={(e) => e.preventDefault()}>
        {/* Client Details Section */}
        <section className="steps__section">
          <div className="steps__form-groups">
            <div className="steps__form-group">
              <label className="steps__label">
                {t("newCase.step3.fullName")} {" "}
                <span className="steps__required">*</span>
              </label>
              <input
                type="text"
                className={`steps__input ${
                  errors.fullName ? "steps__input--error" : ""
                }`}
                placeholder={t("newCase.step3.fullNamePlaceholder")}
                value={formData.fullName}
                onChange={(e) => handleInputChange("fullName", e.target.value)}
              />
              {errors.fullName && (
                <span className="steps__error">{errors.fullName}</span>
              )}
            </div>

            <div className="steps__form-group">
              <label className="steps__label">
                {t("newCase.step3.idNumber")} {" "}
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
                placeholder={t("newCase.step3.idNumberPlaceholder")}
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
                {t("newCase.step3.phoneNumber")} {" "}
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
                  placeholder={t("newCase.step3.phoneNumberPlaceholder")}
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
                {t("newCase.step3.relationship")} {" "}
                <span className="steps__required">*</span>
              </label>
              <CustomSelect
                options={relationshipOptions}
                labelKey="name"
                valueKey="id"
                value={formData.relationship}
                onChange={(value) => handleInputChange("relationship", value)}
                placeholder={t("newCase.common.choose")}
                isError={!!errors.relationship}
                isDisabled={isConstantsLoading || !constants}
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