"use client";

import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { CaseData } from "../page";

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

  const cityOptions = [
    {
      value: "",
      label: locale === "ar" ? "اختر المدينة" : "Select City",
    },
    { value: "gaza", label: locale === "ar" ? "غزة" : "Gaza" },
    {
      value: "westbank",
      label: locale === "ar" ? "الضفة الغربية" : "West Bank",
    },
  ];

  const governorateOptions = [
    {
      value: "",
      label: locale === "ar" ? "اختر المحافظة" : "Choose Governorate",
    },
    { value: "gaza", label: locale === "ar" ? "غزة" : "Gaza" },
    { value: "north-gaza", label: locale === "ar" ? "شمال غزة" : "North Gaza" },
    {
      value: "deir-al-balah",
      label: locale === "ar" ? "دير البلح" : "Deir Al-Balah",
    },
    { value: "khan-yunis", label: locale === "ar" ? "خان يونس" : "Khan Yunis" },
    { value: "rafah", label: locale === "ar" ? "رفح" : "Rafah" },
    { value: "jenin", label: locale === "ar" ? "جنين" : "Jenin" },
    { value: "tubas", label: locale === "ar" ? "طوباس" : "Tubas" },
    { value: "tulkarm", label: locale === "ar" ? "طولكرم" : "Tulkarm" },
    { value: "nablus", label: locale === "ar" ? "نابلس" : "Nablus" },
    { value: "qalqilya", label: locale === "ar" ? "قلقيلية" : "Qalqilya" },
    { value: "salfit", label: locale === "ar" ? "سلفيت" : "Salfit" },
    { value: "ramallah", label: locale === "ar" ? "رام الله" : "Ramallah" },
    { value: "jericho", label: locale === "ar" ? "أريحا" : "Jericho" },
    { value: "jerusalem", label: locale === "ar" ? "القدس" : "Jerusalem" },
    { value: "bethlehem", label: locale === "ar" ? "بيت لحم" : "Bethlehem" },
    { value: "hebron", label: locale === "ar" ? "الخليل" : "Hebron" },
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
              </label>
              <input
                type="text"
                className={`steps__input ${
                  errors.idNumber ? "steps__input--error" : ""
                }`}
                placeholder="0000000000"
                value={formData.idNumber}
                onChange={(e) => handleInputChange("idNumber", e.target.value)}
              />
              {errors.idNumber && (
                <span className="steps__error">{errors.idNumber}</span>
              )}
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
              <select
                className={`steps__select ${
                  errors.healthStatus ? "steps__select--error" : ""
                }`}
                value={formData.healthStatus}
                onChange={(e) =>
                  handleInputChange("healthStatus", e.target.value)
                }
              >
                {healthStatusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {errors.healthStatus && (
                <span className="steps__error">{errors.healthStatus}</span>
              )}
            </div>

            <div className="steps__form-group">
              <label className="steps__label">
                {locale === "ar" ? "الحالة الاجتماعية" : "Marital Status"}{" "}
                <span className="steps__required">*</span>
              </label>
              <select
                className={`steps__select ${
                  errors.maritalStatus ? "steps__select--error" : ""
                }`}
                value={formData.maritalStatus}
                onChange={(e) =>
                  handleInputChange("maritalStatus", e.target.value)
                }
              >
                {maritalStatusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
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
            <div className="steps__form-group">
              <label className="steps__label">
                {locale === "ar" ? "المحافظة" : "Governorate"}{" "}
                <span className="steps__required">*</span>
              </label>
              <select
                className={`steps__select ${
                  errors.governorate ? "steps__select--error" : ""
                }`}
                value={formData.governorate}
                onChange={(e) =>
                  handleInputChange("governorate", e.target.value)
                }
              >
                {governorateOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {errors.governorate && (
                <span className="steps__error">{errors.governorate}</span>
              )}
            </div>

            <div className="steps__form-group">
              <label className="steps__label">
                {locale === "ar" ? "المدينة" : "City"}{" "}
                <span className="steps__required">*</span>
              </label>
              <select
                className={`steps__select ${
                  errors.city ? "steps__select--error" : ""
                }`}
                value={formData.city}
                onChange={(e) => handleInputChange("city", e.target.value)}
              >
                {cityOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {errors.city && (
                <span className="steps__error">{errors.city}</span>
              )}
            </div>
            <div className="steps__form-group">
              <label className="steps__label">
                {locale === "ar" ? "المنطقة" : "District"}{" "}
                <span className="steps__required">*</span>
              </label>
              <select
                className={`steps__select ${
                  errors.district ? "steps__select--error" : ""
                }`}
                value={formData.district}
                onChange={(e) => handleInputChange("district", e.target.value)}
              >
                <option value="">
                  {locale === "ar" ? "المنطقة" : "District"}
                </option>
                <option value="district1">
                  {locale === "ar" ? "المنطقة 1" : "District 1"}
                </option>
                <option value="district2">
                  {locale === "ar" ? "المنطقة 2" : "District 2"}
                </option>
                <option value="district3">
                  {locale === "ar" ? "المنطقة 3" : "District 3"}
                </option>
              </select>
              {errors.district && (
                <span className="steps__error">{errors.district}</span>
              )}
            </div>

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
