"use client";

import CustomSelect from "./CustomSelect";
import { useConstantsStore } from "../store/constants.store";
import { useMemo, useRef, useEffect } from "react";
import { useTranslations } from "next-globe-gen";

interface GazaAddressSelectorProps {
  location?: string; // Add location prop to specify which location's governorates to use
  governorate: string;
  locality: string;
  district: string;
  onLocationChange?: (location: string) => void; // Add callback for location changes
  onGovernorateChange: (governorate: string) => void;
  onLocalityChange: (locality: string) => void;
  onDistrictChange: (district: string) => void;
  errors?: {
    location?: string;
    governorate?: string;
    locality?: string;
    district?: string;
  };
  required?: {
    location?: boolean;
    governorate?: boolean;
    locality?: boolean;
    district?: boolean;
  };
  idPrefix?: string;
}

export default function GazaAddressSelector({
  location = "gaza_strip", // Default to Gaza Strip for backward compatibility
  governorate,
  locality,
  district,
  onLocationChange,
  onGovernorateChange,
  onLocalityChange,
  onDistrictChange,
  errors = {},
  required = { governorate: true, locality: true, district: true },
  idPrefix = "address",
}: GazaAddressSelectorProps) {
  const t = useTranslations();
  const { constants, isLoading } = useConstantsStore();

  // Get the top-level locations from constants
  const locations = useMemo(() => {
    if (!constants?.data?.locations) return [];

    return Object.entries(constants.data.locations).map(
      ([, locationData]: [string, any]) => ({
        id: locationData.value,
        name: locationData.name,
        value: locationData.value,
      })
    );
  }, [constants]);

  // Set default to Gaza Strip if no location is selected
  useEffect(() => {
    if (!location && locations.length > 0) {
      const gazaStrip = locations.find((loc) => loc.value === "gaza_strip");
      if (gazaStrip && onLocationChange) {
        onLocationChange(gazaStrip.value);
      }
    }
  }, [location, locations, onLocationChange]);

  // Get governorates from the specified location
  const selectedLocation =
    constants?.data?.locations?.[
      location as keyof typeof constants.data.locations
    ];
  const governorates = useMemo(
    () => (selectedLocation?.governorates as any[]) || [],
    [selectedLocation]
  );

  const selectedGovernorate = useMemo(
    () => governorates.find((g: any) => String(g.id) === String(governorate)),
    [governorates, governorate]
  );
  const localities = useMemo(
    () => (selectedGovernorate?.localities as any[]) || [],
    [selectedGovernorate]
  );
  const selectedLocality = useMemo(
    () => localities.find((c: any) => String(c.id) === String(locality)),
    [localities, locality]
  );
  const districts = useMemo(
    () => (selectedLocality?.districts as any[]) || [],
    [selectedLocality]
  );

  // Track if component has been initialized to prevent resetting on first load
  const isInitializedRef = useRef(false);
  const prevLocationRef = useRef(location);
  const prevGovernorateRef = useRef(governorate);
  const prevLocalityRef = useRef(locality);

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
      const newLocationData =
        constants?.data?.locations?.[
          location as keyof typeof constants.data.locations
        ];
      const currentGovInNewLocation = newLocationData?.governorates?.find(
        (g: any) => String(g.id) === String(governorate)
      );

      if (!currentGovInNewLocation && governorate) {
        onGovernorateChange("");
      }
      if (!currentGovInNewLocation && locality) {
        onLocalityChange("");
      }
      if (!currentGovInNewLocation && district) {
        onDistrictChange("");
      }
    }
    prevLocationRef.current = location;
  }, [
    location,
    governorate,
    locality,
    district,
    onGovernorateChange,
    onLocalityChange,
    onDistrictChange,
    constants,
  ]);

  // Only reset dependent fields when governorate actually changes
  useEffect(() => {
    if (!isInitializedRef.current) {
      return;
    }

    if (
      prevGovernorateRef.current &&
      prevGovernorateRef.current !== governorate
    ) {
      // Check if the new governorate still contains the current locality
      const newGovData = governorates.find(
        (g: any) => String(g.id) === String(governorate)
      );
      const currentLocalityInNewGov = newGovData?.localities?.find(
        (c: any) => String(c.id) === String(locality)
      );

      if (!currentLocalityInNewGov && locality) {
        onLocalityChange("");
      }
      if (!currentLocalityInNewGov && district) {
        onDistrictChange("");
      }
    }
    prevGovernorateRef.current = governorate;
  }, [
    governorate,
    locality,
    district,
    onLocalityChange,
    onDistrictChange,
    governorates,
  ]);

  // Only reset dependent fields when locality actually changes
  useEffect(() => {
    if (!isInitializedRef.current) {
      return;
    }

    if (prevLocalityRef.current && prevLocalityRef.current !== locality) {
      // Check if the new locality still contains the current district
      const newLocalityData = localities.find(
        (c: any) => String(c.id) === String(locality)
      );
      const currentDistrictInNewLocality = newLocalityData?.districts?.find(
        (d: any) => String(d.id) === String(district)
      );

      if (!currentDistrictInNewLocality && district) {
        onDistrictChange("");
      }
    }
    prevLocalityRef.current = locality;
  }, [locality, district, onDistrictChange, localities]);

  // Validate saved values after initialization to ensure they're still valid
  useEffect(() => {
    if (!isInitializedRef.current || isLoading || !constants) {
      return;
    }

    // Check if current governorate is valid in current location
    if (governorate && location) {
      const locationData =
        constants.data.locations?.[
          location as keyof typeof constants.data.locations
        ];
      const isValidGovernorate = locationData?.governorates?.find(
        (g: any) => String(g.id) === String(governorate)
      );

      if (!isValidGovernorate && governorate) {
        onGovernorateChange("");
      }
    }

    // Check if current locality is valid in current governorate
    if (locality && governorate) {
      const governorateData = governorates.find(
        (g: any) => String(g.id) === String(governorate)
      );
      const isValidLocality = governorateData?.localities?.find(
        (c: any) => String(c.id) === String(locality)
      );

      if (!isValidLocality && locality) {
        onLocalityChange("");
      }
    }

    // Check if current district is valid in current locality
    if (district && locality) {
      const localityData = localities.find(
        (c: any) => String(c.id) === String(locality)
      );
      const isValidDistrict = localityData?.districts?.find(
        (d: any) => String(d.id) === String(district)
      );

      if (!isValidDistrict && district) {
        onDistrictChange("");
      }
    }
  }, [
    isLoading,
    constants,
    location,
    governorate,
    locality,
    district,
    governorates,
    localities,
    onGovernorateChange,
    onLocalityChange,
    onDistrictChange,
  ]);

  return (
    <>
      {/* Location Selection */}
      {onLocationChange && (
        <div className="steps__form-group">
          <label className="steps__label">
            {t("newCase.address.location")}{" "}
            {required.location && <span className="steps__required">*</span>}
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
          {errors.location && (
            <span className="steps__error">{errors.location}</span>
          )}
        </div>
      )}

      {/* Governorate */}
      <div className="steps__form-group">
        <label className="steps__label">
          {t("newCase.address.governorate")}{" "}
          {required.governorate && <span className="steps__required">*</span>}
        </label>
        <CustomSelect
          options={governorates}
          labelKey="name"
          valueKey="id"
          value={governorate}
          onChange={onGovernorateChange}
          placeholder={`${t("newCase.common.choose")} ${t(
            "newCase.address.governorate"
          )}`}
          isError={!!errors.governorate}
          isDisabled={isLoading}
          instanceId={`${idPrefix}-governorate-select`}
          fullWidth
        />
        {errors.governorate && (
          <span className="steps__error">{errors.governorate}</span>
        )}
      </div>

      {/* Locality */}
      <div className="steps__form-group">
        <label className="steps__label">
          {t("newCase.address.locality")}{" "}
          {required.locality && <span className="steps__required">*</span>}
        </label>
        <CustomSelect
          options={localities}
          labelKey="name"
          valueKey="id"
          value={locality}
          onChange={onLocalityChange}
          placeholder={`${t("newCase.common.choose")} ${t(
            "newCase.address.locality"
          )}`}
          isError={!!errors.locality}
          isDisabled={!governorate || isLoading}
          instanceId={`${idPrefix}-locality-select`}
          fullWidth
        />
        {errors.locality && (
          <span className="steps__error">{errors.locality}</span>
        )}
      </div>

      {/* District */}
      <div className="steps__form-group">
        <label className="steps__label">
          {t("newCase.address.district")}{" "}
          {required.district && <span className="steps__required">*</span>}
        </label>
        <CustomSelect
          options={districts}
          labelKey="name"
          valueKey="id"
          value={district}
          onChange={onDistrictChange}
          placeholder={`${t("newCase.common.choose")} ${t(
            "newCase.address.district"
          )}`}
          isError={!!errors.district}
          isDisabled={!governorate || !locality || isLoading}
          instanceId={`${idPrefix}-district-select`}
          fullWidth
        />
        {errors.district && (
          <span className="steps__error">{errors.district}</span>
        )}
      </div>
    </>
  );
}
