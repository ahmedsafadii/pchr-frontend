"use client";

import { useLocale, useTranslations } from "next-globe-gen";
import { useCallback, useEffect, useState, useMemo } from "react";
import { useLawyerAuth } from "@/_app/hooks/useLawyerAuth";
import { LawyerAuth } from "@/_app/utils/auth";
import { getLawyerProfile, updateLawyerProfile } from "@/_app/services/api";
import { validatePalestinianPhone } from "@/_app/utils/validation";
import toast from "react-hot-toast";

// Phone number formatting utilities
const formatPhoneForDisplay = (phone: string): string => {
  // Remove +97 prefix for display if present
  if (phone.startsWith('+97')) {
    return phone.substring(3);
  }
  return phone;
};

const formatPhoneForAPI = (phone: string): string => {
  // Add +97 prefix for API if not present
  if (phone && !phone.startsWith('+97')) {
    return `+97${phone}`;
  }
  return phone;
};

interface ProfileData {
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  address: string;
}

interface ProfileErrors {
  first_name?: string;
  last_name?: string;
  phone_number?: string;
  general?: string;
}

function LawyerProfileInner() {
  const t = useTranslations();
  const locale = useLocale();
  const { user } = useLawyerAuth();
  
  const [profileData, setProfileData] = useState<ProfileData>({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    address: "",
  });
  
  const [originalData, setOriginalData] = useState<ProfileData>({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    address: "",
  });
  
  const [errors, setErrors] = useState<ProfileErrors>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Load profile data
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const token = LawyerAuth.getAccessToken();
        if (!token) return;

        const response = await getLawyerProfile(token, locale);
        
        if (response.status === 'success' && response.data) {
          const data = {
            first_name: response.data.first_name || "",
            last_name: response.data.last_name || "",
            email: response.data.email || "",
            phone_number: formatPhoneForDisplay(response.data.phone_number || ""),
            address: response.data.address || "",
          };
          setProfileData(data);
          setOriginalData(data);
        }
      } catch (error) {
        console.error('Failed to load profile:', error);
        setErrors({ general: t("lawyerProfile.errors.general").toString() });
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, [locale, t]);

  const handleInputChange = (field: keyof ProfileData, value: string) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field as keyof ProfileErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = useCallback((): boolean => {
    const newErrors: ProfileErrors = {};

    if (!profileData.first_name.trim()) {
      newErrors.first_name = t("lawyerProfile.errors.firstName").toString();
    }

    if (!profileData.last_name.trim()) {
      newErrors.last_name = t("lawyerProfile.errors.lastName").toString();
    }

    if (profileData.phone_number.trim() && !validatePalestinianPhone(profileData.phone_number)) {
      newErrors.phone_number = t("lawyerProfile.errors.phoneNumber").toString();
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [profileData.first_name, profileData.last_name, profileData.phone_number, t]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSaving(true);
    setErrors({});

    try {
      const token = LawyerAuth.getAccessToken();
      if (!token) return;

      const updateData = {
        first_name: profileData.first_name,
        last_name: profileData.last_name,
        phone_number: formatPhoneForAPI(profileData.phone_number),
        address: profileData.address,
      };

      const response = await updateLawyerProfile(token, updateData, locale);
      
      if (response.status === 'success') {
        // Update user data in localStorage
        if (user) {
          const updatedUser = {
            ...user,
            first_name: response.data.first_name,
            last_name: response.data.last_name,
          };
          LawyerAuth.storeAuth(
            { 
              access: LawyerAuth.getAccessToken() || "", 
              refresh: LawyerAuth.getRefreshToken() || "" 
            },
            updatedUser
          );
        }
        
        // Show success toast
        toast.success(t("lawyerProfile.success").toString());
        
        // Update the profile data with the formatted phone number from the response
        const updatedProfileData = {
          ...profileData,
          phone_number: formatPhoneForDisplay(response.data.phone_number || profileData.phone_number),
        };
        setProfileData(updatedProfileData);
        setOriginalData(updatedProfileData);
      } else {
        // Show error toast for unsuccessful response
        toast.error(t("lawyerProfile.errors.general").toString());
      }
    } catch (error: any) {
      console.error('Profile update error:', error);
      
      // Show specific error message if available, otherwise show general error
      const errorMessage = error.payload?.error?.message || t("lawyerProfile.errors.general").toString();
      toast.error(errorMessage);
    } finally {
      setIsSaving(false);
    }
  }, [profileData, locale, t, user, validateForm]);

  // More robust change detection that handles phone number formatting
  const hasChanges = useMemo(() => {
    return (
      profileData.first_name !== originalData.first_name ||
      profileData.last_name !== originalData.last_name ||
      profileData.phone_number !== originalData.phone_number ||
      profileData.address !== originalData.address
      // Note: email is not included as it's read-only
    );
  }, [profileData, originalData]);
  
  const hasErrors = Object.keys(errors).length > 0;

  if (isLoading) {
    return (
      <div className="lawyer__loading">
        <div className="lawyer__loading-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="lawyer__profile">
      <form onSubmit={handleSubmit} className="lawyer__profile-form">
        {errors.general && (
          <div className="lawyer__error-message">
            {errors.general}
          </div>
        )}

        <div className="lawyer__form-grid">
          <div className="lawyer__form-group">
            <label htmlFor="firstName" className="lawyer__label">
              {t("lawyerProfile.firstName")} <span className="lawyer__required">*</span>
            </label>
            <input
              id="firstName"
              type="text"
              className={`lawyer__input ${errors.first_name ? 'lawyer__input--error' : ''}`}
              value={profileData.first_name}
              onChange={(e) => handleInputChange('first_name', e.target.value)}
              placeholder={t("lawyerProfile.firstName").toString()}
            />
            {errors.first_name && (
              <span className="lawyer__error">{errors.first_name}</span>
            )}
          </div>

          <div className="lawyer__form-group">
            <label htmlFor="lastName" className="lawyer__label">
              {t("lawyerProfile.lastName")} <span className="lawyer__required">*</span>
            </label>
            <input
              id="lastName"
              type="text"
              className={`lawyer__input ${errors.last_name ? 'lawyer__input--error' : ''}`}
              value={profileData.last_name}
              onChange={(e) => handleInputChange('last_name', e.target.value)}
              placeholder={t("lawyerProfile.lastName").toString()}
            />
            {errors.last_name && (
              <span className="lawyer__error">{errors.last_name}</span>
            )}
          </div>

          <div className="lawyer__form-group lawyer__form-group--full">
            <label htmlFor="email" className="lawyer__label">
              {t("lawyerProfile.email")}
            </label>
            <input
              id="email"
              type="email"
              className="lawyer__input lawyer__input--disabled"
              value={profileData.email}
              disabled
              placeholder={t("lawyerProfile.email").toString()}
            />
          </div>

          <div className="lawyer__form-group">
            <label htmlFor="phoneNumber" className="lawyer__label">
              {t("lawyerProfile.phoneNumber")}
            </label>
            <input
              id="phoneNumber"
              type="tel"
              className={`lawyer__input ${errors.phone_number ? 'lawyer__input--error' : ''}`}
              value={profileData.phone_number}
              onChange={(e) => handleInputChange('phone_number', e.target.value)}
              placeholder="0591234567"
              dir="ltr"
            />
            {errors.phone_number && (
              <span className="lawyer__error">{errors.phone_number}</span>
            )}
          </div>

          <div className="lawyer__form-group lawyer__form-group--full">
            <label htmlFor="address" className="lawyer__label">
              {t("lawyerProfile.address")}
            </label>
            <textarea
              id="address"
              className="lawyer__textarea"
              value={profileData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              placeholder={t("lawyerProfile.address").toString()}
              rows={3}
            />
          </div>
        </div>

        <div className="lawyer__form-actions">
          <button
            type="submit"
            className={`lawyer__btn lawyer__btn--primary ${!hasChanges || isSaving ? 'lawyer__btn--disabled' : ''}`}
            disabled={!hasChanges || isSaving}
            title={!hasChanges ? "No changes to save" : hasErrors ? "Please fix errors before saving" : ""}
          >
            {isSaving ? t("lawyerProfile.saving") : t("lawyerProfile.save")}
          </button>
        </div>
      </form>
    </div>
  );
}

export default function LawyerProfilePage() {
  return <LawyerProfileInner />;
}
