"use client";

import { useLocale, useTranslations } from "next-globe-gen";
import { useCallback, useState } from "react";
import { LawyerAuth } from "@/_app/utils/auth";
import { changeLawyerPassword } from "@/_app/services/api";
import { IconEye, IconEyeOff } from "@tabler/icons-react";
import toast from "react-hot-toast";

interface PasswordData {
  current_password: string;
  new_password: string;
  confirm_password: string;
}

interface PasswordErrors {
  current_password?: string;
  new_password?: string;
  confirm_password?: string;
  general?: string;
}

function LawyerChangePasswordInner() {
  const t = useTranslations();
  const locale = useLocale();
  
  const [passwordData, setPasswordData] = useState<PasswordData>({
    current_password: "",
    new_password: "",
    confirm_password: "",
  });
  
  const [errors, setErrors] = useState<PasswordErrors>({});
  const [isChanging, setIsChanging] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const handleInputChange = (field: keyof PasswordData, value: string) => {
    setPasswordData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field as keyof PasswordErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }

  };

  const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const validateForm = useCallback((): boolean => {
    const newErrors: PasswordErrors = {};

    if (!passwordData.current_password.trim()) {
      newErrors.current_password = t("lawyerProfile.changePassword.errors.currentPassword").toString();
    }

    if (!passwordData.new_password.trim()) {
      newErrors.new_password = t("lawyerProfile.changePassword.errors.newPassword").toString();
    } else if (passwordData.new_password.length < 8) {
      newErrors.new_password = t("lawyerProfile.changePassword.errors.passwordTooShort").toString();
    }

    if (!passwordData.confirm_password.trim()) {
      newErrors.confirm_password = t("lawyerProfile.changePassword.errors.confirmPassword").toString();
    } else if (passwordData.new_password !== passwordData.confirm_password) {
      newErrors.confirm_password = t("lawyerProfile.changePassword.errors.passwordMismatch").toString();
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [passwordData.current_password, passwordData.new_password, passwordData.confirm_password, t]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsChanging(true);
    setErrors({});

    try {
      const token = LawyerAuth.getAccessToken();
      if (!token) return;

      const response = await changeLawyerPassword(token, passwordData, locale);
      
      if (response.status === 'success') {
        // Show success toast
        toast.success(t("lawyerProfile.changePassword.success").toString());
        // Clear form
        setPasswordData({
          current_password: "",
          new_password: "",
          confirm_password: "",
        });
      } else {
        // Show error toast for unsuccessful response
        toast.error(t("lawyerProfile.changePassword.errors.general").toString());
      }
    } catch (error: any) {
      console.error('Password change error:', error);
      
      // Handle specific error cases and show appropriate error messages
      if (error.payload?.error?.code === 'INVALID_CURRENT_PASSWORD' || 
          error.payload?.error?.message?.includes('current password')) {
        // Show field-specific error for wrong current password
        setErrors({ current_password: t("lawyerProfile.changePassword.errors.wrongCurrentPassword").toString() });
        toast.error(t("lawyerProfile.changePassword.errors.wrongCurrentPassword").toString());
      } else if (error.payload?.error?.code === 'PASSWORD_CHANGE_FAILED') {
        // Show specific error message from API
        const errorMessage = error.payload.error.message || t("lawyerProfile.changePassword.errors.general").toString();
        toast.error(errorMessage);
      } else {
        // Show general error for other cases
        const errorMessage = error.payload?.error?.message || t("lawyerProfile.changePassword.errors.general").toString();
        toast.error(errorMessage);
      }
    } finally {
      setIsChanging(false);
    }
  }, [passwordData, locale, t, validateForm]);

  return (
    <div className="lawyer__profile">
      <form onSubmit={handleSubmit} className="lawyer__profile-form">
        {errors.general && (
          <div className="lawyer__error-message">
            {errors.general}
          </div>
        )}

        <div className="lawyer__form-grid lawyer__form-grid--single">
          <div className="lawyer__form-group">
            <label htmlFor="currentPassword" className="lawyer__label">
              {t("lawyerProfile.changePassword.currentPassword")} <span className="lawyer__required">*</span>
            </label>
            <div className="lawyer__password-input">
              <input
                id="currentPassword"
                type={showPasswords.current ? "text" : "password"}
                className={`lawyer__input ${errors.current_password ? 'lawyer__input--error' : ''}`}
                value={passwordData.current_password}
                onChange={(e) => handleInputChange('current_password', e.target.value)}
                placeholder={t("lawyerProfile.changePassword.currentPassword").toString()}
              />
              <button
                type="button"
                className="lawyer__password-toggle"
                onClick={() => togglePasswordVisibility('current')}
              >
                {showPasswords.current ? <IconEyeOff size={20} /> : <IconEye size={20} />}
              </button>
            </div>
            {errors.current_password && (
              <span className="lawyer__error">{errors.current_password}</span>
            )}
          </div>

          <div className="lawyer__form-group">
            <label htmlFor="newPassword" className="lawyer__label">
              {t("lawyerProfile.changePassword.newPassword")} <span className="lawyer__required">*</span>
            </label>
            <div className="lawyer__password-input">
              <input
                id="newPassword"
                type={showPasswords.new ? "text" : "password"}
                className={`lawyer__input ${errors.new_password ? 'lawyer__input--error' : ''}`}
                value={passwordData.new_password}
                onChange={(e) => handleInputChange('new_password', e.target.value)}
                placeholder={t("lawyerProfile.changePassword.newPassword").toString()}
              />
              <button
                type="button"
                className="lawyer__password-toggle"
                onClick={() => togglePasswordVisibility('new')}
              >
                {showPasswords.new ? <IconEyeOff size={20} /> : <IconEye size={20} />}
              </button>
            </div>
            {errors.new_password && (
              <span className="lawyer__error">{errors.new_password}</span>
            )}
          </div>

          <div className="lawyer__form-group">
            <label htmlFor="confirmPassword" className="lawyer__label">
              {t("lawyerProfile.changePassword.confirmPassword")} <span className="lawyer__required">*</span>
            </label>
            <div className="lawyer__password-input">
              <input
                id="confirmPassword"
                type={showPasswords.confirm ? "text" : "password"}
                className={`lawyer__input ${errors.confirm_password ? 'lawyer__input--error' : ''}`}
                value={passwordData.confirm_password}
                onChange={(e) => handleInputChange('confirm_password', e.target.value)}
                placeholder={t("lawyerProfile.changePassword.confirmPassword").toString()}
              />
              <button
                type="button"
                className="lawyer__password-toggle"
                onClick={() => togglePasswordVisibility('confirm')}
              >
                {showPasswords.confirm ? <IconEyeOff size={20} /> : <IconEye size={20} />}
              </button>
            </div>
            {errors.confirm_password && (
              <span className="lawyer__error">{errors.confirm_password}</span>
            )}
          </div>
        </div>

        <div className="lawyer__form-actions">
          <button
            type="submit"
            className={`lawyer__btn lawyer__btn--primary ${isChanging ? 'lawyer__btn--disabled' : ''}`}
            disabled={isChanging}
          >
            {isChanging ? t("lawyerProfile.changePassword.changing") : t("lawyerProfile.changePassword.changePassword")}
          </button>
        </div>
      </form>
    </div>
  );
}

export default function LawyerChangePasswordPage() {
  return <LawyerChangePasswordInner />;
}
