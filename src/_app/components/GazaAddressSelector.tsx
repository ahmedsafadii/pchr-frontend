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

  // Track if component has been initialized to prevent resetting on first load
  const isInitializedRef = useRef(false);
  const prevLocationRef = useRef(location);
  const prevGovernorateRef = useRef(governorate);
  const prevCityRef = useRef(city);
  
  // Only reset dependent fields when user actually changes a selection
  // Don't reset on component initialization
  useEffect(() => {
    if (!isInitializedRef.current) {
      isInitializedRef.current = true;
      return;
    }
    
    // Only reset if we had a previous value and it's different
    if (prevLocationRef.current && prevLocationRef.current !== location) {
      // Check if the new location still contains the current governorate
      const newLocationData = constants?.data?.locations?.[location as keyof typeof constants.data.locations];
      const currentGovInNewLocation = newLocationData?.governorates?.find((g: any) => String(g.id) === String(governorate));
      
      if (!currentGovInNewLocation && governorate) {
        onGovernorateChange("");
      }
      if (!currentGovInNewLocation && city) {
        onCityChange("");
      }
      if (!currentGovInNewLocation && district) {
        onDistrictChange("");
      }
    }
    prevLocationRef.current = location;
  }, [location, governorate, city, district, onGovernorateChange, onCityChange, onDistrictChange, constants]);

  // Only reset dependent fields when governorate actually changes
  useEffect(() => {
    if (!isInitializedRef.current) {
      return;
    }
    
    if (prevGovernorateRef.current && prevGovernorateRef.current !== governorate) {
      // Check if the new governorate still contains the current city
      const newGovData = governorates.find((g: any) => String(g.id) === String(governorate));
      const currentCityInNewGov = newGovData?.cities?.find((c: any) => String(c.id) === String(city));
      
      if (!currentCityInNewGov && city) {
        onCityChange("");
      }
      if (!currentCityInNewGov && district) {
        onDistrictChange("");
      }
    }
    prevGovernorateRef.current = governorate;
  }, [governorate, city, district, onCityChange, onDistrictChange, governorates]);

  // Only reset dependent fields when city actually changes
  useEffect(() => {
    if (!isInitializedRef.current) {
      return;
    }
    
    if (prevCityRef.current && prevCityRef.current !== city) {
      // Check if the new city still contains the current district
      const newCityData = cities.find((c: any) => String(c.id) === String(city));
      const currentDistrictInNewCity = newCityData?.districts?.find((d: any) => String(d.id) === String(district));
      
      if (!currentDistrictInNewCity && district) {
        onDistrictChange("");
      }
    }
    prevCityRef.current = city;
  }, [city, district, onDistrictChange, cities]);

  // Validate saved values after initialization to ensure they're still valid
  useEffect(() => {
    if (!isInitializedRef.current || isLoading || !constants) {
      return;
    }
    
    // Check if current governorate is valid in current location
    if (governorate && location) {
      const locationData = constants.data.locations?.[location as keyof typeof constants.data.locations];
      const isValidGovernorate = locationData?.governorates?.find((g: any) => String(g.id) === String(governorate));
      
      if (!isValidGovernorate && governorate) {
        onGovernorateChange("");
      }
    }
    
    // Check if current city is valid in current governorate
    if (city && governorate) {
      const governorateData = governorates.find((g: any) => String(g.id) === String(governorate));
      const isValidCity = governorateData?.cities?.find((c: any) => String(c.id) === String(city));
      
      if (!isValidCity && city) {
        onCityChange("");
      }
    }
    
    // Check if current district is valid in current city
    if (district && city) {
      const cityData = cities.find((c: any) => String(c.id) === String(city));
      const isValidDistrict = cityData?.districts?.find((d: any) => String(d.id) === String(district));
      
      if (!isValidDistrict && district) {
        onDistrictChange("");
      }
    }
  }, [isLoading, constants, location, governorate, city, district, governorates, cities, onGovernorateChange, onCityChange, onDistrictChange]);

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


