"use client";

import { useState, useEffect, useMemo } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { CaseData } from "../page";
import CustomSelect from "../../components/CustomSelect";
import GazaAddressSelector from "../../components/GazaAddressSelector";
import { useTranslations } from "next-globe-gen";
import { useConstantsStore } from "../../store/constants.store";

interface Step2Props {
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

export default function Step2({
  data,
  updateData,
  onComplete,
  onNext,
  onPrevious,
  currentStep,
  canGoNext,
  externalErrors = [],
}: Step2Props) {
  const [formData, setFormData] = useState(data.detentionInfo);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const t = useTranslations();
  const { constants, isLoading: isConstantsLoading } = useConstantsStore();

  useEffect(() => {
    setFormData(data.detentionInfo);
  }, [data.detentionInfo]);

  // Handle external errors from API validation
  useEffect(() => {
    if (externalErrors.length > 0) {
      const newErrors: Record<string, string> = {};
      
      externalErrors.forEach(errorMsg => {
        // Map error messages to field names based on content
        const lowerMsg = errorMsg.toLowerCase();
        if (lowerMsg.includes('detention date') || lowerMsg.includes('detention_date') || lowerMsg.includes('disappearance date')) {
          newErrors.disappearanceDate = errorMsg;
        } else if (lowerMsg.includes('detention city') || lowerMsg.includes('detention_city')) {
          newErrors.city = errorMsg;
        } else if (lowerMsg.includes('detention governorate') || lowerMsg.includes('detention_governorate')) {
          newErrors.governorate = errorMsg;
        } else if (lowerMsg.includes('detention district') || lowerMsg.includes('detention_district')) {
          newErrors.district = errorMsg;
        } else if (lowerMsg.includes('circumstances') || lowerMsg.includes('detention_circumstances')) {
          newErrors.circumstances = errorMsg;
        } else if (lowerMsg.includes('status') || lowerMsg.includes('disappearance_status')) {
          newErrors.disappearanceStatus = errorMsg;
        }
      });
      
      setErrors(prev => ({ ...prev, ...newErrors }));
    }
  }, [externalErrors]);

  const handleInputChange = (field: string, value: string) => {
    const updatedFormData = {
      ...formData,
      [field]: value,
    };

    setFormData(updatedFormData);

    // Update parent component data immediately
    updateData("detentionInfo", updatedFormData);

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

    if (!formData.detention_date.trim())
      newErrors.disappearanceDate = t(
        "newCase.step2.errors.disappearanceDateRequired"
      );

    if (!formData.detention_location.trim())
      newErrors.location = t("newCase.step2.errors.locationRequired");

    if (!formData.detention_city.trim())
      newErrors.city = t("newCase.step2.errors.cityRequired");

    if (!formData.detention_governorate.trim())
      newErrors.governorate = t("newCase.step2.errors.governorateRequired");

    if (!formData.detention_district.trim())
      newErrors.district = t("newCase.step2.errors.districtRequired");

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateForm()) {
      updateData("detentionInfo", formData);
      onComplete(currentStep);
      onNext();
    }
  };

  const disappearanceStatusOptions = useMemo(
    () => (constants?.data?.disappearance_statuses as any[]) || [],
    [constants]
  );

  return (
    <div className="steps">
      <header className="steps__header">
        <span className="steps__step-number">
          {t("newCase.step2.stepNumber")}
        </span>
        <h2 className="steps__title">{t("newCase.step2.title")}</h2>
      </header>

      <form className="steps__form" onSubmit={(e) => e.preventDefault()}>
        {/* Disappearance Details Section */}
        <section className="steps__section">
          <div className="steps__form-groups">
            <div className="steps__form-group">
              <label className="steps__label">
                {t("newCase.step2.disappearanceDate")}{" "}
                <span className="steps__required">*</span>
              </label>
              <div className="steps__input-wrapper">
                <DatePicker
                  selected={formData.detention_date ? new Date(formData.detention_date) : null}
                  onChange={(date) => {
                    const formattedDate = date
                      ? date.toISOString().split("T")[0]
                      : "";
                    handleInputChange("detention_date", formattedDate);
                  }}
                  dateFormat="dd/MM/yyyy"
                  placeholderText={t(
                    "newCase.step2.disappearanceDatePlaceholder"
                  )}
                  maxDate={new Date()}
                  showYearDropdown
                  scrollableYearDropdown
                  yearDropdownItemNumber={100}
                  className={`steps__input ${
                    errors.disappearanceDate ? "steps__input--error" : ""
                  }`}
                />
              </div>
              {errors.disappearanceDate && (
                <span className="steps__error">{errors.disappearanceDate}</span>
              )}
            </div>

            <div className="steps__form-group">
              <label className="steps__label">
                {t("newCase.step2.disappearanceStatus")}
              </label>
              <CustomSelect
                options={disappearanceStatusOptions}
                labelKey="name"
                valueKey="id"
                value={formData.disappearance_status}
                onChange={(value) => handleInputChange("disappearance_status", value)}
                placeholder={`${t("newCase.common.choose")} ${t("newCase.step2.disappearanceStatus")}`}
                isDisabled={isConstantsLoading || !constants}
                instanceId="step2-disappearance-status-select"
                fullWidth
              />
            </div>
          </div>
        </section>

        {/* Place of Detention/Disappearance Section */}
        <section className="steps__section">
          <h3 className="steps__section-title">
            {t("newCase.step2.placeTitle")}
          </h3>
          <div className="steps__form-groups">
            <GazaAddressSelector
              location={formData.detention_location}
              governorate={formData.detention_governorate}
              city={formData.detention_city}
              district={formData.detention_district}
              onLocationChange={(value) => handleInputChange("detention_location", value)}
              onGovernorateChange={(value) =>
                handleInputChange("detention_governorate", value)
              }
              onCityChange={(value) => handleInputChange("detention_city", value)}
              onDistrictChange={(value) => handleInputChange("detention_district", value)}
              errors={{
                location: errors.location,
                governorate: errors.governorate,
                city: errors.city,
                district: errors.district,
              }}
              required={{
                location: true,
                governorate: true,
                city: true,
                district: true,
              }}
              idPrefix="step2-location"
            />

            <div className="steps__form-group steps__form-group--full-width">
              <label className="steps__label">
                {t("newCase.address.streetName")}
              </label>
              <input
                type="text"
                className="steps__input"
                placeholder={t("newCase.address.streetNamePlaceholder")}
                value={formData.detention_street}
                onChange={(e) =>
                  handleInputChange("detention_street", e.target.value)
                }
              />
            </div>
          </div>
        </section>

        {/* Circumstances Section */}
        <section className="steps__section">
          <div className="steps__form-group">
            <label className="steps__label">
              {t("newCase.step2.circumstancesLabel")}
            </label>
            <textarea
              className={`steps__textarea ${formData.detention_circumstances.length > 500 ? 'steps__input--error' : ''}`}
              placeholder={t("newCase.step2.circumstancesPlaceholder")}
              value={formData.detention_circumstances}
              onChange={(e) => {
                const value = e.target.value;
                if (value.length <= 500) {
                  handleInputChange("detention_circumstances", value);
                }
              }}
              rows={4}
              maxLength={500}
            />
            {formData.detention_circumstances.length > 500 && (
              <span className="steps__error">{t("newCase.step2.errors.circumstancesMax500")}</span>
            )}
            <div className={`steps__character-count ${formData.detention_circumstances.length > 500 ? 'steps__character-count--error' : ''}`}>
              {formData.detention_circumstances.length}/500
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
