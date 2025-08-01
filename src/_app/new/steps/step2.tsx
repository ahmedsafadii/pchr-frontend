"use client";

import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { CaseData } from "../page";
import CustomSelect from "../../components/CustomSelect";
import AddressSelector from "../../components/AddressSelector";

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
}

export default function Step2({
  data,
  updateData,
  onComplete,
  onNext,
  onPrevious,
  currentStep,
  canGoNext,
  locale = "en",
}: Step2Props) {
  const [formData, setFormData] = useState(data.detentionInfo);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    setFormData(data.detentionInfo);
  }, [data.detentionInfo]);

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

    if (!formData.disappearanceDate.trim()) {
      newErrors.disappearanceDate =
        locale === "ar"
          ? "تاريخ الاختفاء مطلوب"
          : "Disappearance date is required";
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
      updateData("detentionInfo", formData);
      onComplete(currentStep);
      onNext();
    }
  };

  const disappearanceStatusOptions = [
    { value: "", label: locale === "ar" ? "اختر" : "Choose" },
    { value: "detained", label: locale === "ar" ? "معتقل" : "Detained" },
    { value: "disappeared", label: locale === "ar" ? "مختفي" : "Disappeared" },
    { value: "kidnapped", label: locale === "ar" ? "مختطف" : "Kidnapped" },
    { value: "arrested", label: locale === "ar" ? "مقبوض عليه" : "Arrested" },
    { value: "other", label: locale === "ar" ? "أخرى" : "Other" },
  ];



  return (
    <div className="steps">
      <header className="steps__header">
        <span className="steps__step-number">STEP 2</span>
        <h2 className="steps__title">
          {locale === "ar"
            ? "معلومات الاعتقال/الاختفاء"
            : "Detention/Disappearance Info"}
        </h2>
      </header>

      <form className="steps__form" onSubmit={(e) => e.preventDefault()}>
        {/* Disappearance Details Section */}
        <section className="steps__section">
          <div className="steps__form-groups">
            <div className="steps__form-group">
              <label className="steps__label">
                {locale === "ar" ? "تاريخ الاختفاء" : "Disappearance Date"}{" "}
                <span className="steps__required">*</span>
              </label>
              <div className="steps__input-wrapper">
                <DatePicker
                  selected={
                    formData.disappearanceDate
                      ? new Date(formData.disappearanceDate)
                      : null
                  }
                  onChange={(date) => {
                    const formattedDate = date
                      ? date.toISOString().split("T")[0]
                      : "";
                    handleInputChange("disappearanceDate", formattedDate);
                  }}
                  dateFormat="dd/MM/yyyy"
                  placeholderText="DD/MM/YYYY"
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
                {locale === "ar" ? "حالة الاختفاء" : "Disappearance Status"}
              </label>
              <CustomSelect
                options={disappearanceStatusOptions}
                value={formData.disappearanceStatus}
                onChange={(value) => handleInputChange("disappearanceStatus", value)}
                placeholder={locale === "ar" ? "اختر" : "Choose"}
                instanceId="step2-disappearance-status-select"
              />
            </div>
          </div>
        </section>

        {/* Place of Detention/Disappearance Section */}
        <section className="steps__section">
          <h3 className="steps__section-title">
            {locale === "ar"
              ? "مكان الاعتقال/الاختفاء"
              : "Place of detention/disappearance"}
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
              idPrefix="step2-location"
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

        {/* Circumstances Section */}
        <section className="steps__section">
          <div className="steps__form-group">
            <label className="steps__label">
              {locale === "ar"
                ? "ظروف الاعتقال/الاختفاء"
                : "Circumstances Of The Detention/Disappearance"}
            </label>
            <textarea
              className="steps__textarea"
              placeholder={locale === "ar" ? "اكتب هنا..." : "Placeholder"}
              value={formData.disappearanceCircumstances}
              onChange={(e) => {
                const value = e.target.value;
                if (value.length <= 100) {
                  handleInputChange("disappearanceCircumstances", value);
                }
              }}
              rows={4}
            />
            <div className="steps__character-count">
              {formData.disappearanceCircumstances.length}/100
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
