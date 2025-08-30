"use client";

import CustomSelect from "./CustomSelect";
import { useConstantsStore } from "../store/constants.store";
import { useMemo, useRef, useEffect } from "react";
import { useTranslations } from "next-globe-gen";

interface GazaAddressSelectorProps {
  location?: string; // Add location prop to specify which location's governorates to use
  governorate: string;
  city: string;
  district: string;
  onLocationChange?: (location: string) => void; // Add callback for location changes
  onGovernorateChange: (governorate: string) => void;
  onCityChange: (city: string) => void;
  onDistrictChange: (district: string) => void;
  errors?: {
    location?: string;
    governorate?: string;
    city?: string;
    district?: string;
  };
  required?: {
    location?: boolean;
    governorate?: boolean;
    city?: boolean;
    district?: boolean;
  };
  idPrefix?: string;
}

export default function GazaAddressSelector({
  location = "gaza_strip", // Default to Gaza Strip for backward compatibility
  governorate,
  city,
  district,
  onLocationChange,
  onGovernorateChange,
  onCityChange,
  onDistrictChange,
  errors = {},
  required = { governorate: true, city: true, district: true },
  idPrefix = "address",
}: GazaAddressSelectorProps) {
  const t = useTranslations();
  const { constants, isLoading } = useConstantsStore();

  // Get the top-level locations from constants
  const locations = useMemo(() => {
    if (!constants?.data?.locations) return [];
    
    return Object.entries(constants.data.locations).map(([, locationData]: [string, any]) => ({
      id: locationData.value,
      name: locationData.name,
      value: locationData.value
    }));
  }, [constants]);

  // Set default to Gaza Strip if no location is selected
  useEffect(() => {
    if (!location && locations.length > 0) {
      const gazaStrip = locations.find(loc => loc.value === 'gaza_strip');
      if (gazaStrip && onLocationChange) {
        onLocationChange(gazaStrip.value);
      }
    }
  }, [location, locations, onLocationChange]);

  // Get governorates from the specified location
  const selectedLocation = constants?.data?.locations?.[location as keyof typeof constants.data.locations];
  const governorates = useMemo(() => (selectedLocation?.governorates as any[]) || [], [selectedLocation]);
  
  const selectedGovernorate = useMemo(
    () => governorates.find((g: any) => String(g.id) === String(governorate)),
    [governorates, governorate]
  );
  const cities = useMemo(() => (selectedGovernorate?.cities as any[]) || [], [selectedGovernorate]);
  const selectedCity = useMemo(() => cities.find((c: any) => String(c.id) === String(city)), [cities, city]);
  const districts = useMemo(() => (selectedCity?.districts as any[]) || [], [selectedCity]);

  // Reset dependent fields when location changes
  const prevLocationRef = useRef(location);
  useEffect(() => {
    if (prevLocationRef.current !== location && prevLocationRef.current !== "") {
      if (governorate) onGovernorateChange("");
      if (city) onCityChange("");
      if (district) onDistrictChange("");
    }
    prevLocationRef.current = location;
  }, [location, governorate, city, district, onGovernorateChange, onCityChange, onDistrictChange]);

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
      {/* Location Selection */}
      {onLocationChange && (
        <div className="steps__form-group">
          <label className="steps__label">
            {t("newCase.address.location")} {required.location && <span className="steps__required">*</span>}
          </label>
          <CustomSelect
            options={locations}
            labelKey="name"
            valueKey="value"
            value={location}
            onChange={(value) => {
              // Prevent empty location selection
              if (value && value.trim() !== "") {
                onLocationChange(value);
              }
            }}
            isError={!!errors.location}
            isDisabled={isLoading}
            instanceId={`${idPrefix}-location-select`}
            fullWidth
          />
          {errors.location && <span className="steps__error">{errors.location}</span>}
        </div>
      )}

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
          placeholder={`${t("newCase.common.choose")} ${t("newCase.address.governorate")}`}
          isError={!!errors.governorate}
          isDisabled={isLoading}
          instanceId={`${idPrefix}-governorate-select`}
          fullWidth
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
          placeholder={`${t("newCase.common.choose")} ${t("newCase.address.city")}`}
          isError={!!errors.city}
          isDisabled={!governorate || isLoading}
          instanceId={`${idPrefix}-city-select`}
          fullWidth
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
          placeholder={`${t("newCase.common.choose")} ${t("newCase.address.district")}`}
          isError={!!errors.district}
          isDisabled={!governorate || !city || isLoading}
          instanceId={`${idPrefix}-district-select`}
          fullWidth
        />
        {errors.district && <span className="steps__error">{errors.district}</span>}
      </div>
    </>
  );
}


