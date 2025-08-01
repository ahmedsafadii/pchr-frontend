"use client";

import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Tooltip } from "react-tooltip";
import { IconInfoCircle } from "@tabler/icons-react";
import { CaseData } from "../page";
import CustomSelect from "../../components/CustomSelect";
import AddressSelector from "../../components/AddressSelector";
import { validatePalestinianId, getPalestinianIdErrorMessage, getPalestinianIdTooltip } from "../../utils/validation";
import { defaultTooltipProps, createTooltipProps, tooltipIconClasses } from "../../utils/tooltip";

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
}

export default function Step1({
  data,
  updateData,
  onComplete,
  onNext,
  currentStep,
  canGoNext,
  locale = "en",
}: Step1Props) {
  const [formData, setFormData] = useState(data.detaineeInfo);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    setFormData(data.detaineeInfo);
  }, [data.detaineeInfo]);

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

    if (!formData.dateOfBirth.trim()) {
      newErrors.dateOfBirth =
        locale === "ar" ? "تاريخ الميلاد مطلوب" : "Date of birth is required";
    }

    if (!formData.healthStatus.trim()) {
      newErrors.healthStatus =
        locale === "ar" ? "الحالة الصحية مطلوبة" : "Health status is required";
    }

    if (!formData.maritalStatus.trim()) {
      newErrors.maritalStatus =
        locale === "ar"
          ? "الحالة الاجتماعية مطلوبة"
          : "Marital status is required";
    }

    if (!formData.city.trim()) {
      newErrors.city = locale === "ar" ? "المدينة مطلوبة" : "City is required";
    }

    if (!formData.governorate.trim()) {
      newErrors.governorate =
        locale === "ar" ? "المحافظة مطلوبة" : "Governorate is required";
    }

    if (!formData.district.trim()) {
      newErrors.district =
        locale === "ar" ? "المنطقة مطلوبة" : "District is required";
    }

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

  const healthStatusOptions = [
    { value: "", label: locale === "ar" ? "اختر" : "Choose" },
    { value: "healthy", label: locale === "ar" ? "صحي" : "Healthy" },
    {
      value: "chronic-illness",
      label: locale === "ar" ? "مرض مزمن" : "Chronic Illness",
    },
    { value: "disability", label: locale === "ar" ? "إعاقة" : "Disability" },
    { value: "pregnancy", label: locale === "ar" ? "حمل" : "Pregnancy" },
    { value: "other", label: locale === "ar" ? "أخرى" : "Other" },
  ];

  const maritalStatusOptions = [
    { value: "", label: locale === "ar" ? "اختر" : "Choose" },
    { value: "single", label: locale === "ar" ? "أعزب" : "Single" },
    { value: "married", label: locale === "ar" ? "متزوج" : "Married" },
    { value: "divorced", label: locale === "ar" ? "مطلق" : "Divorced" },
    { value: "widowed", label: locale === "ar" ? "أرمل" : "Widowed" },
  ];



  return (
    <div className="steps">
      <header className="steps__header">
        <span className="steps__step-number">STEP 1</span>
        <h2 className="steps__title">
          {locale === "ar" ? "معلومات المعتقل" : "Detainee Informations"}
        </h2>
      </header>

      <form className="steps__form" onSubmit={(e) => e.preventDefault()}>
        {/* Personal Details Section */}
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
                  {...createTooltipProps("id-number-tooltip", getPalestinianIdTooltip(locale))}
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
                id="id-number-tooltip"
                {...defaultTooltipProps}
              />
            </div>

            <div className="steps__form-group">
              <label className="steps__label">
                {locale === "ar" ? "تاريخ الميلاد" : "Date Of Birth"}{" "}
                <span className="steps__required">*</span>
              </label>
              <div className="steps__input-wrapper">
                <DatePicker
                  selected={
                    formData.dateOfBirth ? new Date(formData.dateOfBirth) : null
                  }
                  onChange={(date) => {
                    const formattedDate = date
                      ? date.toISOString().split("T")[0]
                      : "";
                    handleInputChange("dateOfBirth", formattedDate);
                  }}
                  dateFormat="dd/MM/yyyy"
                  placeholderText="DD/MM/YYYY"
                  maxDate={new Date()}
                  showYearDropdown
                  scrollableYearDropdown
                  yearDropdownItemNumber={100}
                />
              </div>
              <span className="steps__hint">
                {locale === "ar"
                  ? "أقل من 18 سنة يعتبر طفلاً"
                  : "Under 18 To Be Child"}
              </span>
              {errors.dateOfBirth && (
                <span className="steps__error">{errors.dateOfBirth}</span>
              )}
            </div>

            <div className="steps__form-group">
              <label className="steps__label">
                {locale === "ar" ? "المهنة" : "Job"}
              </label>
              <input
                type="text"
                className="steps__input"
                placeholder={locale === "ar" ? "مثل: عامل" : "Like: Worker"}
                value={formData.job}
                onChange={(e) => handleInputChange("job", e.target.value)}
              />
            </div>

            <div className="steps__form-group">
              <label className="steps__label">
                {locale === "ar" ? "الحالة الصحية" : "Healthy Status"}{" "}
                <span className="steps__required">*</span>
              </label>
              <CustomSelect
                options={healthStatusOptions}
                value={formData.healthStatus}
                onChange={(value) => handleInputChange("healthStatus", value)}
                placeholder={locale === "ar" ? "اختر" : "Choose"}
                isError={!!errors.healthStatus}
                instanceId="step1-health-status-select"
              />
              {errors.healthStatus && (
                <span className="steps__error">{errors.healthStatus}</span>
              )}
            </div>

            <div className="steps__form-group">
              <label className="steps__label">
                {locale === "ar" ? "الحالة الاجتماعية" : "Marital Status"}{" "}
                <span className="steps__required">*</span>
              </label>
              <CustomSelect
                options={maritalStatusOptions}
                value={formData.maritalStatus}
                onChange={(value) => handleInputChange("maritalStatus", value)}
                placeholder={locale === "ar" ? "اختر" : "Choose"}
                isError={!!errors.maritalStatus}
                instanceId="step1-marital-status-select"
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
            {locale === "ar" ? "العنوان" : "Address"}
          </h3>
          <div className="steps__form-groups">
            <AddressSelector
              governorate={formData.governorate}
              city={formData.city}
              district={formData.district}
              onGovernorateChange={(value) => handleInputChange("governorate", value)}
              onCityChange={(value) => handleInputChange("city", value)}
              onDistrictChange={(value) => handleInputChange("district", value)}
              locale={locale}
              errors={{
                governorate: errors.governorate,
                city: errors.city,
                district: errors.district,
              }}
              required={{
                governorate: true,
                city: true,
                district: true,
              }}
              idPrefix="step1-address"
            />

            <div className="steps__form-group">
              <label className="steps__label">
                {locale === "ar" ? "اسم الشارع" : "Street Name"}
              </label>
              <input
                type="text"
                className="steps__input"
                placeholder={locale === "ar" ? "اسم الشارع" : "Street Name"}
                value={formData.streetName}
                onChange={(e) =>
                  handleInputChange("streetName", e.target.value)
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
            <span>{locale === "ar" ? "التالي" : "Next"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
