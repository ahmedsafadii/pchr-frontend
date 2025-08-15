"use client";

import { useState, useEffect, useMemo } from "react";
import { Tooltip } from "react-tooltip";
import { IconInfoCircle } from "@tabler/icons-react";
import { CaseData } from "../page";
import CustomSelect from "../../components/CustomSelect";
import {
  validatePalestinianPhone,
  getPalestinianPhoneErrorMessage,
  getPalestinianPhoneTooltip,
  validatePalestinianId,
  getPalestinianIdErrorMessage,
  getPalestinianIdTooltip,
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

    if (!formData.client_name.trim()) newErrors.client_name = t("newCase.step3.errors.client_name_required");

    if (!formData.client_id.trim()) newErrors.client_id = t("newCase.step3.errors.client_id_required");
    else if (!validatePalestinianId(formData.client_id)) newErrors.client_id = getPalestinianIdErrorMessage(locale);

    if (!formData.client_phone.trim()) newErrors.client_phone = t("newCase.step3.errors.client_phone_required");
    else if (!validatePalestinianPhone(formData.client_phone)) newErrors.client_phone = getPalestinianPhoneErrorMessage(locale);

    if (!formData.client_relationship.trim()) newErrors.client_relationship = t("newCase.step3.errors.client_relationship_required");

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
                className={`steps__input ${errors.client_name ? "steps__input--error" : ""}`}
                placeholder={t("newCase.step3.fullNamePlaceholder")}
                value={formData.client_name}
                onChange={(e) => handleInputChange("client_name", e.target.value)}
              />
              {errors.client_name && (
                <span className="steps__error">{errors.client_name}</span>
              )}
            </div>

            <div className="steps__form-group">
              <label className="steps__label">
                {t("newCase.step3.idNumber")} {" "}
                <span className="steps__required">*</span>
                <IconInfoCircle 
                  size={16} 
                  className={tooltipIconClasses}
                  {...createTooltipProps("client-id-tooltip", getPalestinianIdTooltip(locale))}
                />
              </label>
              <input
                type="text"
                className={`steps__input ${errors.client_id ? "steps__input--error" : ""}`}
                placeholder={t("newCase.step3.idNumberPlaceholder")}
                value={formData.client_id}
                onChange={(e) => handleInputChange("client_id", e.target.value)}
                maxLength={9}
              />
              {errors.client_id && (
                <span className="steps__error">{errors.client_id}</span>
              )}
              <Tooltip 
                id="client-id-tooltip"
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
                  className={`steps__input ${errors.client_phone ? "steps__input--error" : ""}`}
                  placeholder={t("newCase.step3.phoneNumberPlaceholder")}
                  value={formData.client_phone}
                  onChange={(e) => handleInputChange("client_phone", e.target.value)}
                  maxLength={10}
                />
              </div>
              {errors.client_phone && (
                <span className="steps__error">{errors.client_phone}</span>
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
                value={formData.client_relationship}
                onChange={(value) => handleInputChange("client_relationship", value)}
                placeholder={`${t("newCase.common.choose")} ${t("newCase.step3.relationship")}`}
                isError={!!errors.client_relationship}
                isDisabled={isConstantsLoading || !constants}
                instanceId="step3-relationship-select"
              />
              {errors.client_relationship && (
                <span className="steps__error">{errors.client_relationship}</span>
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