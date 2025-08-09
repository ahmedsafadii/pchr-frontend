"use client";

import CustomSelect from "./CustomSelect";
import { useConstantsStore } from "../store/constants.store";
import { useMemo, useRef, useEffect } from "react";
import { useTranslations } from "next-globe-gen";

interface GazaAddressSelectorProps {
  governorate: string;
  city: string;
  district: string;
  onGovernorateChange: (governorate: string) => void;
  onCityChange: (city: string) => void;
  onDistrictChange: (district: string) => void;
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

export default function GazaAddressSelector({
  governorate,
  city,
  district,
  onGovernorateChange,
  onCityChange,
  onDistrictChange,
  errors = {},
  required = { governorate: true, city: true, district: true },
  idPrefix = "address",
}: GazaAddressSelectorProps) {
  const t = useTranslations();
  const { constants, isLoading } = useConstantsStore();

  const gazaStrip = constants?.data?.locations?.gaza_strip;
  const governorates = useMemo(() => (gazaStrip?.governorates as any[]) || [], [gazaStrip]);
  const selectedGovernorate = useMemo(
    () => governorates.find((g: any) => String(g.id) === String(governorate)),
    [governorates, governorate]
  );
  const cities = useMemo(() => (selectedGovernorate?.cities as any[]) || [], [selectedGovernorate]);
  const selectedCity = useMemo(() => cities.find((c: any) => String(c.id) === String(city)), [cities, city]);
  const districts = useMemo(() => (selectedCity?.districts as any[]) || [], [selectedCity]);

  // Reset dependent fields when parent changes
  const prevGovernorateRef = useRef(governorate);
  useEffect(() => {
    if (prevGovernorateRef.current !== governorate && prevGovernorateRef.current !== "") {
      if (city) onCityChange("");
      if (district) onDistrictChange("");
    }
    prevGovernorateRef.current = governorate;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [governorate]);

  const prevCityRef = useRef(city);
  useEffect(() => {
    if (prevCityRef.current !== city && prevCityRef.current !== "") {
      if (district) onDistrictChange("");
    }
    prevCityRef.current = city;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [city]);

  return (
    <>
      {/* Governorate */}
      <div className="steps__form-group">
        <label className="steps__label">
          {t("newCase.address.governorate")} {required.governorate && <span className="steps__required">*</span>}
        </label>
        <CustomSelect
          options={governorates}
          labelKey="name"
          valueKey="id"
          value={governorate}
          onChange={onGovernorateChange}
          placeholder={t("newCase.common.choose")}
          isError={!!errors.governorate}
          isDisabled={isLoading}
          instanceId={`${idPrefix}-governorate-select`}
        />
        {errors.governorate && <span className="steps__error">{errors.governorate}</span>}
      </div>

      {/* City */}
      <div className="steps__form-group">
        <label className="steps__label">
          {t("newCase.address.city")} {required.city && <span className="steps__required">*</span>}
        </label>
        <CustomSelect
          options={cities}
          labelKey="name"
          valueKey="id"
          value={city}
          onChange={onCityChange}
          placeholder={t("newCase.common.choose")}
          isError={!!errors.city}
          isDisabled={!governorate || isLoading}
          instanceId={`${idPrefix}-city-select`}
        />
        {errors.city && <span className="steps__error">{errors.city}</span>}
      </div>

      {/* District */}
      <div className="steps__form-group">
        <label className="steps__label">
          {t("newCase.address.district")} {required.district && <span className="steps__required">*</span>}
        </label>
        <CustomSelect
          options={districts}
          labelKey="name"
          valueKey="id"
          value={district}
          onChange={onDistrictChange}
          placeholder={t("newCase.common.choose")}
          isError={!!errors.district}
          isDisabled={!governorate || !city || isLoading}
          instanceId={`${idPrefix}-district-select`}
        />
        {errors.district && <span className="steps__error">{errors.district}</span>}
      </div>
    </>
  );
}


