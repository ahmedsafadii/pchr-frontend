"use client";

import { useState, useEffect, useRef } from "react";
import CustomSelect from "./CustomSelect";
import { getGovernorateOptions, getCityOptions, getDistrictOptions } from "../data/palestineLocations";

interface AddressSelectorProps {
  governorate: string;
  city: string;
  district: string;
  onGovernorateChange: (governorate: string) => void;
  onCityChange: (city: string) => void;
  onDistrictChange: (district: string) => void;
  locale?: string;
  errors?: {
    governorate?: string;
    city?: string;
    district?: string;
  };
  required?: {
    governorate?: boolean;
    city?: boolean;
    district?: boolean;
  };
  idPrefix?: string;
}

export default function AddressSelector({
  governorate,
  city,
  district,
  onGovernorateChange,
  onCityChange,
  onDistrictChange,
  locale = "en",
  errors = {},
  required = { governorate: true, city: true, district: true },
  idPrefix = "address"
}: AddressSelectorProps) {
  const [governorateOptions, setGovernorateOptions] = useState(getGovernorateOptions(locale));
  const [cityOptions, setCityOptions] = useState(getCityOptions("", locale));
  const [districtOptions, setDistrictOptions] = useState(getDistrictOptions("", "", locale));

  // Update options when locale changes
  useEffect(() => {
    setGovernorateOptions(getGovernorateOptions(locale));
  }, [locale]);

  // Update city options when governorate changes
  useEffect(() => {
    setCityOptions(getCityOptions(governorate, locale));
  }, [governorate, locale]);

  // Update district options when city changes
  useEffect(() => {
    setDistrictOptions(getDistrictOptions(governorate, city, locale));
  }, [governorate, city, locale]);

  // Reset city and district when governorate changes
  const prevGovernorateRef = useRef(governorate);
  useEffect(() => {
    if (prevGovernorateRef.current !== governorate && prevGovernorateRef.current !== '') {
      if (city) {
        onCityChange("");
      }
      if (district) {
        onDistrictChange("");
      }
    }
    prevGovernorateRef.current = governorate;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [governorate]); // Only depend on governorate to avoid infinite loop

  // Reset district when city changes
  const prevCityRef = useRef(city);
  useEffect(() => {
    if (prevCityRef.current !== city && prevCityRef.current !== '') {
      if (district) {
        onDistrictChange("");
      }
    }
    prevCityRef.current = city;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [city]); // Only depend on city to avoid infinite loop

  const handleGovernorateChange = (value: string) => {
    onGovernorateChange(value);
  };

  const handleCityChange = (value: string) => {
    onCityChange(value);
  };

  const handleDistrictChange = (value: string) => {
    onDistrictChange(value);
  };

  return (
    <>
      {/* Governorate */}
      <div className="steps__form-group">
        <label className="steps__label">
          {locale === "ar" ? "المحافظة" : "Governorate"}
          {required.governorate && <span className="steps__required">*</span>}
        </label>
        <CustomSelect
          options={governorateOptions}
          value={governorate}
          onChange={handleGovernorateChange}
          placeholder={locale === "ar" ? "اختر المحافظة" : "Choose Governorate"}
          isError={!!errors.governorate}
          instanceId={`${idPrefix}-governorate-select`}
        />
        {errors.governorate && (
          <span className="steps__error">{errors.governorate}</span>
        )}
      </div>

      {/* City */}
      <div className="steps__form-group">
        <label className="steps__label">
          {locale === "ar" ? "المدينة" : "City"}
          {required.city && <span className="steps__required">*</span>}
        </label>
        <CustomSelect
          options={cityOptions}
          value={city}
          onChange={handleCityChange}
          placeholder={locale === "ar" ? "اختر المدينة" : "Choose City"}
          isError={!!errors.city}
          isDisabled={!governorate}
          instanceId={`${idPrefix}-city-select`}
        />
        {errors.city && (
          <span className="steps__error">{errors.city}</span>
        )}
      </div>

      {/* District */}
      <div className="steps__form-group">
        <label className="steps__label">
          {locale === "ar" ? "المنطقة" : "District"}
          {required.district && <span className="steps__required">*</span>}
        </label>
        <CustomSelect
          options={districtOptions}
          value={district}
          onChange={handleDistrictChange}
          placeholder={locale === "ar" ? "اختر المنطقة" : "Choose District"}
          isError={!!errors.district}
          isDisabled={!governorate || !city}
          instanceId={`${idPrefix}-district-select`}
        />
        {errors.district && (
          <span className="steps__error">{errors.district}</span>
        )}
      </div>
    </>
  );
}