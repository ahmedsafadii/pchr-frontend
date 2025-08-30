"use client";

import { useState, useEffect, useMemo } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Tooltip } from "react-tooltip";
import { IconInfoCircle } from "@tabler/icons-react";
import { CaseData } from "../page";
import CustomSelect from "../../components/CustomSelect";
import GazaAddressSelector from "../../components/GazaAddressSelector";
import { validatePalestinianId, getPalestinianIdErrorMessage, getPalestinianIdTooltip } from "../../utils/validation";
import { defaultTooltipProps, createTooltipProps, tooltipIconClasses } from "../../utils/tooltip";
import { useConstantsStore } from "../../store/constants.store";
import { useTranslations } from "next-globe-gen";

interface Step1Props {
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

export default function Step1({
  data,
  updateData,
  onComplete,
  onNext,
  currentStep,
  canGoNext,
  locale = "ar",
  externalErrors = [],
}: Step1Props) {
  const [formData, setFormData] = useState(data.detaineeInfo);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { constants, isLoading: isConstantsLoading } = useConstantsStore();
  const t = useTranslations();

  useEffect(() => {
    setFormData(data.detaineeInfo);
  }, [data.detaineeInfo]);

  // Handle external errors from API validation
  useEffect(() => {
    if (externalErrors.length > 0) {
      const newErrors: Record<string, string> = {};
      
      externalErrors.forEach(errorMsg => {
        // Map error messages to field names based on content
        const lowerMsg = errorMsg.toLowerCase();
        if (lowerMsg.includes('detainee name') || lowerMsg.includes('detainee_name')) {
          newErrors.fullName = errorMsg;
        } else if (lowerMsg.includes('detainee id') || lowerMsg.includes('detainee_id')) {
          newErrors.idNumber = errorMsg;
        } else if (
          // Handle backend messages that reference the detainee implicitly
          lowerMsg.includes('case already exists for this detainee') ||
          lowerMsg.includes('this detainee')
        ) {
          newErrors.idNumber = errorMsg;
        } else if (lowerMsg.includes('date of birth') || lowerMsg.includes('detainee_date_of_birth')) {
          newErrors.dateOfBirth = errorMsg;
        } else if (lowerMsg.includes('health') || lowerMsg.includes('detainee_health_status')) {
          newErrors.healthStatus = errorMsg;
        } else if (lowerMsg.includes('marital') || lowerMsg.includes('detainee_marital_status')) {
          newErrors.maritalStatus = errorMsg;
        } else if (lowerMsg.includes('city') || lowerMsg.includes('detainee_city')) {
          newErrors.city = errorMsg;
        } else if (lowerMsg.includes('governorate') || lowerMsg.includes('detainee_governorate')) {
          newErrors.governorate = errorMsg;
        } else if (lowerMsg.includes('district') || lowerMsg.includes('detainee_district')) {
          newErrors.district = errorMsg;
        } else if (lowerMsg.includes('job') || lowerMsg.includes('detainee_job')) {
          newErrors.job = errorMsg;
        }
      });
      
      // If we received errors for this step but none matched a specific field,
      // default to showing the first message under ID number since most backend
      // validations for this step are about identification.
      if (Object.keys(newErrors).length === 0 && externalErrors[0]) {
        newErrors.idNumber = externalErrors[0];
      }

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
    updateData("detaineeInfo", updatedFormData);

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

    if (!formData.detainee_name.trim()) newErrors.fullName = t("newCase.step1.errors.fullNameRequired");

    if (!formData.detainee_id.trim()) newErrors.idNumber = t("newCase.step1.errors.idNumberRequired");
    else if (!validatePalestinianId(formData.detainee_id)) newErrors.idNumber = getPalestinianIdErrorMessage(locale);

    if (!formData.detainee_date_of_birth.trim()) newErrors.dateOfBirth = t("newCase.step1.errors.dateOfBirthRequired");

    if (!formData.detainee_health_status.trim()) newErrors.healthStatus = t("newCase.step1.errors.healthStatusRequired");

    if (!formData.detainee_marital_status.trim()) newErrors.maritalStatus = t("newCase.step1.errors.maritalStatusRequired");

    if (!formData.detainee_location.trim()) newErrors.location = t("newCase.step1.errors.locationRequired");

    if (!formData.detainee_city.trim()) newErrors.city = t("newCase.step1.errors.cityRequired");

    if (!formData.detainee_governorate.trim()) newErrors.governorate = t("newCase.step1.errors.governorateRequired");

    if (!formData.detainee_district.trim()) newErrors.district = t("newCase.step1.errors.districtRequired");

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateForm()) {
      updateData("detaineeInfo", formData);
      onComplete(currentStep);
      onNext();
    }
  };

  const healthStatusOptions = useMemo(() => (constants?.data?.health_statuses as any[]) || [], [constants]);
  const maritalStatusOptions = useMemo(() => (constants?.data?.marital_statuses as any[]) || [], [constants]);
  const jobOptions = useMemo(() => (constants?.data?.jobs as any[]) || [], [constants]);

  // Check if the person is under 18
  const isUnder18 = useMemo(() => {
    if (!formData.detainee_date_of_birth) return false;
    const dob = new Date(formData.detainee_date_of_birth);
    const now = new Date();
    const eighteenYearsAgo = new Date(now.getFullYear() - 18, now.getMonth(), now.getDate());
    return dob > eighteenYearsAgo;
  }, [formData.detainee_date_of_birth]);



  return (
    <div className="steps">
      <header className="steps__header">
        <span className="steps__step-number">{t("newCase.step1.stepNumber")}</span>
        <h2 className="steps__title">
          {t("newCase.step1.title")}
        </h2>
      </header>

      <form className="steps__form" onSubmit={(e) => e.preventDefault()}>
        {/* Personal Details Section */}
        <section className="steps__section">
          <div className="steps__form-groups">
            <div className="steps__form-group">
              <label className="steps__label">
                {t("newCase.step1.fullName")} {" "}
                <span className="steps__required">*</span>
              </label>
              <input
                type="text"
                className={`steps__input ${
                  errors.fullName ? "steps__input--error" : ""
                }`}
                placeholder={t("newCase.step1.fullNamePlaceholder")}
                value={formData.detainee_name}
                onChange={(e) => handleInputChange("detainee_name", e.target.value)}
              />
              {errors.fullName && (
                <span className="steps__error">{errors.fullName}</span>
              )}
            </div>

            <div className="steps__form-group">
              <label className="steps__label">
                {t("newCase.step1.idNumber")} {" "}
                <span className="steps__required">*</span>
                <IconInfoCircle 
                  size={16} 
                  className={tooltipIconClasses}
                  {...createTooltipProps("id-number-tooltip", getPalestinianIdTooltip(locale))}
                />
              </label>
              <input
                type="text"
                className={`steps__input ${
                  errors.idNumber ? "steps__input--error" : ""
                }`}
                placeholder={t("newCase.step1.idNumberPlaceholder")}
                value={formData.detainee_id}
                onChange={(e) => handleInputChange("detainee_id", e.target.value)}
                maxLength={9}
              />
              {errors.idNumber && (
                <span className="steps__error">{errors.idNumber}</span>
              )}
              <Tooltip 
                id="id-number-tooltip"
                {...defaultTooltipProps}
              />
            </div>

            <div className="steps__form-group">
              <label className="steps__label">
                {t("newCase.step1.dateOfBirth")} {" "}
                <span className="steps__required">*</span>
              </label>
              <div className="steps__input-wrapper">
                <DatePicker
                  selected={
                    formData.detainee_date_of_birth ? new Date(formData.detainee_date_of_birth) : null
                  }
                  onChange={(date) => {
                    const formattedDate = date
                      ? date.toISOString().split("T")[0]
                      : "";
                    handleInputChange("detainee_date_of_birth", formattedDate);
                  }}
                  dateFormat="dd/MM/yyyy"
                  placeholderText={t("newCase.step1.dateOfBirthPlaceholder")}
                  maxDate={new Date()}
                  showYearDropdown
                  scrollableYearDropdown
                  yearDropdownItemNumber={100}
                />
              </div>
              {isUnder18 && (
                <span className="steps__hint">
                  {t("newCase.step1.ageHint")}
                </span>
              )}
              {errors.dateOfBirth && (
                <span className="steps__error">{errors.dateOfBirth}</span>
              )}
            </div>

            <div className="steps__form-group">
              <label className="steps__label">{t("newCase.step1.job")}</label>
              <CustomSelect
                options={jobOptions}
                labelKey="name"
                valueKey="id"
                value={formData.detainee_job}
                onChange={(value) => handleInputChange("detainee_job", value)}
                placeholder={`${t("newCase.common.choose")} ${t("newCase.step1.job")}`}
                isDisabled={isConstantsLoading || !constants}
                instanceId="step1-job-select"
                fullWidth
              />
            </div>

            <div className="steps__form-group">
              <label className="steps__label">
                {t("newCase.step1.healthStatus")} {" "}
                <span className="steps__required">*</span>
              </label>
                <CustomSelect
                  options={healthStatusOptions}
                  labelKey="name"
                  valueKey="id"
                  value={formData.detainee_health_status}
                  onChange={(value) => handleInputChange("detainee_health_status", value)}
                  placeholder={`${t("newCase.common.choose")} ${t("newCase.step1.healthStatus")}`}
                  isError={!!errors.healthStatus}
                  isDisabled={isConstantsLoading || !constants}
                  instanceId="step1-health-status-select"
                  fullWidth
                />
              {errors.healthStatus && (
                <span className="steps__error">{errors.healthStatus}</span>
              )}
            </div>

            <div className="steps__form-group">
              <label className="steps__label">
                {t("newCase.step1.maritalStatus")} {" "}
                <span className="steps__required">*</span>
              </label>
              <CustomSelect
                options={maritalStatusOptions}
                labelKey="name"
                valueKey="id"
                value={formData.detainee_marital_status}
                onChange={(value) => handleInputChange("detainee_marital_status", value)}
                placeholder={`${t("newCase.common.choose")} ${t("newCase.step1.maritalStatus")}`}
                isError={!!errors.maritalStatus}
                isDisabled={isConstantsLoading || !constants}
                instanceId="step1-marital-status-select"
                fullWidth
              />
              {errors.maritalStatus && (
                <span className="steps__error">{errors.maritalStatus}</span>
              )}
            </div>
          </div>
        </section>

        {/* Address Section */}
        <section className="steps__section">
          <h3 className="steps__section-title">
            {t("newCase.address.title")}
          </h3>
          <div className="steps__form-groups">
            <GazaAddressSelector
              location={formData.detainee_location}
              governorate={formData.detainee_governorate}
              city={formData.detainee_city}
              district={formData.detainee_district}
              onLocationChange={(value) => handleInputChange("detainee_location", value)}
              onGovernorateChange={(value) => handleInputChange("detainee_governorate", value)}
              onCityChange={(value) => handleInputChange("detainee_city", value)}
              onDistrictChange={(value) => handleInputChange("detainee_district", value)}
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
              idPrefix="step1-address"
            />

            <div className="steps__form-group steps__form-group--full-width">
              <label className="steps__label">
                {t("newCase.address.streetName")}
              </label>
              <input
                type="text"
                className="steps__input"
                placeholder={t("newCase.address.streetNamePlaceholder")}
                value={formData.detainee_street}
                onChange={(e) =>
                  handleInputChange("detainee_street", e.target.value)
                }
              />
            </div>
          </div>
        </section>

        {/* Navigation */}
        <div className="steps__navigation">
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
