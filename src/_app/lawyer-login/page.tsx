"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-globe-gen";
import Logo from "../components/Logo";
import LanguageSwitcher from "../components/LanguageSwitcher";
import "@/app/css/track.css";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { lawyerLogin } from "@/_app/services/api";

function LawyerLoginInner() {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setIsLoading(true);
      setErrors({});
      
      const nextErrors: typeof errors = {};
      
      if (!email.trim()) {
        nextErrors.email = t("lawyerLogin.errors.email").toString();
      } else if (!validateEmail(email)) {
        nextErrors.email = t("lawyerLogin.errors.email").toString();
      }
      
      if (!password.trim()) {
        nextErrors.password = t("lawyerLogin.errors.password").toString();
      }
      
      if (Object.keys(nextErrors).length > 0) {
        setErrors(nextErrors);
        setIsLoading(false);
        return;
      }

      try {
        const response = await lawyerLogin(email, password, locale);
        
        if (response.status === 'success' && response.data?.access_token) {
          // Store JWT token in localStorage for persistent authentication
          try {
            localStorage.setItem('lawyer_access_token', response.data.access_token);
            localStorage.setItem('lawyer_email', email);
            localStorage.setItem('lawyer_name', response.data.name || '');
            localStorage.setItem('lawyer_token_expires', (Date.now() + (response.data.expires_in * 1000)).toString());
          } catch (storageError) {
            console.warn('Failed to store authentication data:', storageError);
          }
          
          // Navigate to lawyer dashboard
          router.push(`/${locale}/lawyer`);
        } else {
          setErrors({ general: t("lawyerLogin.errors.invalidCredentials").toString() });
        }
        
      } catch (error: any) {
        console.error('Lawyer login error:', error);
        
        // Handle different error types
        if (error.payload?.error?.code === 'INVALID_CREDENTIALS') {
          setErrors({ general: t("lawyerLogin.errors.invalidCredentials").toString() });
        } else {
          setErrors({ general: t("lawyerLogin.errors.general").toString() });
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
                <input
                  id="email"
                  name="email"
                  type="email"
                  className="track__input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t("lawyerLogin.emailPlaceholder")?.toString()}
                  required
                />
                {errors.email && <span className="track__error">{errors.email}</span>}
              </div>

              <div className="track__form-group">
                <label className="track__label" htmlFor="password">
                  {t("lawyerLogin.password")} <span className="track__required">*</span>
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  className="track__input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t("lawyerLogin.passwordPlaceholder")?.toString()}
                  required
                />
                {errors.password && <span className="track__error">{errors.password}</span>}
              </div>
              
              {errors.general && <span className="track__error">{errors.general}</span>}
              
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
  return <LawyerLoginInner />; 
}
