"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-globe-gen";
import Logo from "../components/Logo";
import LanguageSwitcher from "../components/LanguageSwitcher";
import "@/app/css/track.css";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";
import { validatePalestinianPhone } from "@/_app/utils/validation";
import { requestTrackingCode, verifyTrackingCode, resendTrackingCode } from "@/_app/services/api";
// reCAPTCHA removed

function TrackInner() {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const [mobile, setMobile] = useState("");
  const [caseNo, setCaseNo] = useState("");

  const [step, setStep] = useState<"form" | "verify">("form");
  const [code, setCode] = useState<string[]>(["","","","",""]); 
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);
  const [resendAt, setResendAt] = useState<number>(0);
  const [now, setNow] = useState<number>(Date.now());
  const [isLoading, setIsLoading] = useState(false);
  const canResend = useMemo(() => now >= resendAt, [resendAt, now]);
  // reCAPTCHA removed

  useEffect(() => {
    if (!resendAt) return;
    if (now >= resendAt) return;
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [resendAt, now]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setIsLoading(true);
      
      const validationErrors: string[] = [];
      if (!validatePalestinianPhone(mobile)) {
        validationErrors.push(t("track.errors.phone").toString());
      }
      if (!/^PCHR-\d{4}-\d+$/.test(caseNo)) {
        validationErrors.push(t("track.errors.case").toString());
      }
      
      if (validationErrors.length > 0) {
        validationErrors.forEach(error => {
          toast.error(error);
        });
        setIsLoading(false);
        return;
      }

      try {
        await requestTrackingCode(caseNo, mobile, locale);
        
        // Move to verify step and start 10-minute cooldown (600 seconds as per API response)
        setStep("verify");
        setResendAt(Date.now() + 60_000); // Still use 60s for resend button
      } catch (error: any) {
        console.error('Tracking request error:', error);
        
        // Handle API error response
        if (error.payload?.error?.code === 'CASE_NOT_FOUND') {
          toast.error(t("track.errors.caseNotFound").toString());
        } else {
          toast.error(t("track.errors.general").toString());
        }
      } finally {
        setIsLoading(false);
      }
    },
    [mobile, caseNo, t, locale]
  );

  const handleVerify = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setIsLoading(true);
      
      const value = code.join("");
      if (!/^\d{5}$/.test(value)) {
        toast.error(t("track.errors.code").toString());
        setIsLoading(false);
        return;
      }

      try {
        const response = await verifyTrackingCode(caseNo, mobile, value, locale);
        
        if (response.status === 'success' && response.data?.access_token) {
          // Store JWT token in localStorage for persistent authentication
          try {
            localStorage.setItem('track_access_token', response.data.access_token);
            localStorage.setItem('track_case_number', response.data.case_number);
            localStorage.setItem('track_detainee_name', response.data.detainee_name);
            localStorage.setItem('track_token_expires', (Date.now() + (response.data.expires_in * 1000)).toString());
          } catch (storageError) {
            console.warn('Failed to store authentication data:', storageError);
          }
          
          // Navigate to case tracking page
          router.push(`/${locale}/track/case`);
        } else {
          toast.error(t("track.errors.verificationFailed").toString());
        }
      } catch (error: any) {
        console.error('Verification error:', error);
        
        // Handle different error types
        if (error.payload?.error?.code === 'INVALID_VERIFICATION_CODE') {
          toast.error(t("track.errors.invalidCode").toString());
        } else if (error.payload?.error?.code === 'VERIFICATION_CODE_EXPIRED') {
          toast.error(t("track.errors.expiredCode").toString());
        } else {
          toast.error(t("track.errors.general").toString());
        }
      } finally {
        setIsLoading(false);
      }
    },
    [code, mobile, caseNo, router, locale, t]
  );

  const handleCodeChange = (idx: number, v: string) => {
    if (v === "") {
      setCode((prev) => {
        const next = [...prev];
        next[idx] = "";
        return next;
      });
      return;
    }
    if (!/^\d$/.test(v)) return;
    setCode((prev) => {
      const next = [...prev];
      next[idx] = v;
      return next;
    });
    const nextEl = inputsRef.current[idx + 1];
    if (nextEl) nextEl.focus();
  };

  const handleCodeKeyDown = (idx: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      if (code[idx]) {
        setCode((prev) => {
          const next = [...prev];
          next[idx] = "";
          return next;
        });
      } else {
        const prevEl = inputsRef.current[idx - 1];
        if (prevEl) prevEl.focus();
      }
    }
  };

  return (
    <div className="track">
      <div className="track__container">
        <header className="track__header">
          <div className="track__logo">
            <Logo />
          </div>
          <div className="track__header-controls">
            <Link href={`/${locale}`} className="track__back-button">
              <span>{t("newCase.back")}</span>
            </Link>
            <LanguageSwitcher />
          </div>
        </header>

        <main className="track__main">
          <section className="track__card" aria-labelledby="track-title">
            <h1 id="track-title" className="track__title">
              {t("track.title")}
            </h1>

            {step === "form" && (
              <form className="track__form" onSubmit={handleSubmit}>
                <div className="track__form-group">
                  <label className="track__label" htmlFor="mobile">
                    {t("track.mobile")} <span className="track__required">*</span>
                  </label>
                  <input
                    id="mobile"
                    name="mobile"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    className="track__input"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    placeholder={t("track.mobilePlaceholder")?.toString()}
                    required
                  />

                </div>

                <div className="track__form-group">
                  <label className="track__label" htmlFor="caseNumber">
                    {t("track.caseNumber")}
                  </label>
                  <input
                    id="caseNumber"
                    name="caseNumber"
                    className="track__input"
                    value={caseNo}
                    onChange={(e) => {
                      let value = e.target.value.toUpperCase();
                      // Allow only valid characters for case number format
                      value = value.replace(/[^PCHR0-9-]/g, '');
                      // Format as PCHR-YYYY-XXXXXXXXX while typing
                      if (value.length <= 4 && !value.startsWith('PCHR')) {
                        if (value.length > 0) {
                          value = 'PCHR-' + value;
                        }
                      }
                      setCaseNo(value);
                    }}
                    placeholder={t("track.caseNumberPlaceholder")?.toString()}
                    maxLength={50}
                  />

                </div>
                <button type="submit" className="track__submit" disabled={isLoading}>
                  {isLoading ? t("track.sending") : t("track.sendCode")}
                </button>
                {/* reCAPTCHA legal notice removed */}
              </form>
            )}

            {step === "verify" && (
              <form className="track__form" onSubmit={handleVerify}>
                <div>
                  <h2 className="track__subtitle">{t("track.verifyTitle")}</h2>
                  <p className="track__hint">{t("track.verifyDesc")}</p>
                </div>
                <div className="track__code">
                  {[0,1,2,3,4].map((i) => (
                    <input
                      key={i}
                      ref={(el) => { inputsRef.current[i] = el; }}
                      className="track__code-input"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={1}
                      value={code[i]}
                      onChange={(e) => handleCodeChange(i, e.target.value)}
                      onKeyDown={(e) => handleCodeKeyDown(i, e)}
                    />
                  ))}
                </div>

                <button type="submit" className="track__submit" disabled={isLoading}>
                  {isLoading ? t("track.verifying") : t("track.verify")}
                </button>
                <div className="track__resend-wrap">
                  <span className="track__resend-text">{t("track.resendMessage")}</span>
                  <button
                    type="button"
                    className="track__resend"
                    disabled={!canResend || isLoading}
                    onClick={async () => {
                      if (!canResend || isLoading) return;
                      
                      setIsLoading(true);
                      
                      try {
                        await resendTrackingCode(caseNo, mobile, locale);
                        setResendAt(Date.now() + 60_000);
                        toast.success(t("track.resend").toString() + " ✓");
                      } catch (error: any) {
                        console.error('Resend error:', error);
                        if (error.payload?.error?.code === 'CASE_NOT_FOUND') {
                          toast.error(t("track.errors.caseNotFound").toString());
                        } else {
                          toast.error(t("track.errors.general").toString());
                        }
                      } finally {
                        setIsLoading(false);
                      }
                    }}
                  >
                    {canResend
                      ? t("track.resend")
                      : `${t("track.resendIn")} ${Math.max(0, Math.ceil((resendAt - now) / 1000))}${t("track.secondsSuffix")}`}
                  </button>
                </div>
              </form>
            )}
          </section>
        </main>
      </div>
    </div>
  );
}

export default function TrackPage() { return <TrackInner />; }


