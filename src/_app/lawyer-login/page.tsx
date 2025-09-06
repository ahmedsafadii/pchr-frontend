"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-globe-gen";
import Logo from "../components/Logo";
import LanguageSwitcher from "../components/LanguageSwitcher";
import ClientOnly from "../components/ClientOnly";
import ErrorBoundary from "../components/ErrorBoundary";
import "@/app/css/track.css";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import toast from "react-hot-toast";
import { lawyerLogin } from "@/_app/services/api";
import { LawyerAuth } from "@/_app/utils/auth";
import { IconMail, IconLock, IconEye, IconEyeOff } from "@tabler/icons-react";

function LawyerLoginInner() {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setIsLoading(true);
      
      const validationErrors: string[] = [];
      
              if (!email.trim()) {
          validationErrors.push(t("lawyerLogin.errors.email"));
        } else if (!validateEmail(email)) {
          validationErrors.push(t("lawyerLogin.errors.email"));
        }
        
        if (!password.trim()) {
          validationErrors.push(t("lawyerLogin.errors.password"));
        }
      
      if (validationErrors.length > 0) {
        // Show validation errors as toast
        validationErrors.forEach(error => {
          toast.error(error);
        });
        setIsLoading(false);
        return;
      }

      try {
        const response = await lawyerLogin(email, password, locale);
        
        if (response.status === 'success' && response.data?.access) {
          // Store authentication data using the utility
          LawyerAuth.storeAuth(
            { access: response.data.access, refresh: response.data.refresh },
            response.data.user
          );
          
          // Navigate to lawyer dashboard
          router.push(`/${locale}/lawyer`);
        } else {
          toast.error(t("lawyerLogin.errors.invalidCredentials"));
        }
        
      } catch (error: any) {
        console.error('Lawyer login error:', error);
        
        // Handle different error types based on the new API response structure
        if (error.payload?.error?.code === 'LOGIN_FAILED' || error.payload?.error?.type === 'authentication_error') {
          toast.error(t("lawyerLogin.errors.invalidCredentials"));
        } else {
          toast.error(t("lawyerLogin.errors.general"));
        }
      } finally {
        setIsLoading(false);
      }
    },
    [email, password, t, locale, router]
  );

  return (
    <div className="track">
      <div className="track__container">
        <header className="track__header">
          <div className="track__logo">
            <Logo />
          </div>
          <div className="track__header-controls">
            <Link href={`/${locale}`} className="track__back-button">
              <span>{t("lawyerLogin.backToHome")}</span>
            </Link>
            <LanguageSwitcher />
          </div>
        </header>

        <main className="track__main">
          <section className="track__card" aria-labelledby="lawyer-login-title">
            <h1 id="lawyer-login-title" className="track__title">
              {t("lawyerLogin.title")}
            </h1>

            <form className="track__form" onSubmit={handleSubmit}>
              <div className="track__form-group">
                <label className="track__label" htmlFor="email">
                  {t("lawyerLogin.email")} <span className="track__required">*</span>
                </label>
                <div className="track__input-container">
                  <IconMail className="track__input-icon" size={20} />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    className="track__input track__input--with-icon"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t("lawyerLogin.emailPlaceholder")}
                    required
                  />
                </div>
              </div>

              <div className="track__form-group">
                <label className="track__label" htmlFor="password">
                  {t("lawyerLogin.password")} <span className="track__required">*</span>
                </label>
                <div className="track__input-container">
                  <IconLock className="track__input-icon" size={20} />
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    className="track__input track__input--with-icon track__input--with-toggle"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={t("lawyerLogin.passwordPlaceholder")}
                    required
                  />
                  <button
                    type="button"
                    className="track__input-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? t("lawyerLogin.hidePassword") : t("lawyerLogin.showPassword")}
                  >
                    {showPassword ? <IconEyeOff size={20} /> : <IconEye size={20} />}
                  </button>
                </div>
              </div>
              

              
              <button type="submit" className="track__submit" disabled={isLoading}>
                {isLoading ? t("lawyerLogin.loggingIn") : t("lawyerLogin.login")}
              </button>
            </form>
          </section>
        </main>
      </div>
    </div>
  );
}

export default function LawyerLoginPage() { 
  return (
    <ErrorBoundary>
      <ClientOnly fallback={
        <div className="track">
          <div className="track__container">
            <header className="track__header">
              <div className="track__logo">
                <Logo />
              </div>
              <div className="track__header-controls">
                <LanguageSwitcher />
              </div>
            </header>
            <main className="track__main">
              <section className="track__card" aria-labelledby="lawyer-login-title">
                <h1 id="lawyer-login-title" className="track__title">
                  تسجيل دخول المحامي
                </h1>
                <div style={{ textAlign: 'center', padding: '2rem' }}>
                  <div style={{ 
                    width: '40px', 
                    height: '40px', 
                    border: '4px solid #f3f3f3',
                    borderTop: '4px solid #3498db',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite',
                    margin: '0 auto 1rem'
                  }}></div>
                  <p>جاري التحميل...</p>
                </div>
              </section>
            </main>
          </div>
        </div>
      }>
        <LawyerLoginInner />
      </ClientOnly>
    </ErrorBoundary>
  ); 
}
