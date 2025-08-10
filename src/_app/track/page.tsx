"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-globe-gen";
import Logo from "../components/Logo";
import LanguageSwitcher from "../components/LanguageSwitcher";
import "@/app/css/track.css";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { validatePalestinianPhone } from "@/_app/utils/validation";
// reCAPTCHA removed

function TrackInner() {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const [mobile, setMobile] = useState("0599000000");
  const [caseNo, setCaseNo] = useState("00000");
  const [errors, setErrors] = useState<{ mobile?: string; case?: string; code?: string }>({});
  const [step, setStep] = useState<"form" | "verify">("form");
  const [code, setCode] = useState<string[]>(["0","0","0","0","0"]);
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);
  const [resendAt, setResendAt] = useState<number>(0);
  const [now, setNow] = useState<number>(Date.now());
  const canResend = useMemo(() => now >= resendAt, [resendAt, now]);
  // reCAPTCHA removed

  useEffect(() => {
    if (!resendAt) return;
    if (now >= resendAt) return;
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [resendAt, now]);

  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const nextErrors: typeof errors = {};
      if (!validatePalestinianPhone(mobile)) {
        nextErrors.mobile = t("track.errors.phone").toString();
      }
      if (!/^\d{5}$/.test(caseNo)) {
        nextErrors.case = t("track.errors.case").toString();
      }
      setErrors(nextErrors);
      if (Object.keys(nextErrors).length > 0) return;
      // Move to verify step and start 60s cooldown
      setStep("verify");
      setResendAt(Date.now() + 60_000);
      setTimeout(() => setResendAt(Date.now()), 60_000);
    },
    [mobile, caseNo, t]
  );

  const handleVerify = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const value = code.join("");
      if (!/^\d{5}$/.test(value)) {
        setErrors((prev) => ({ ...prev, code: t("track.errors.code").toString() }));
        return;
      }
      // Demo happy-path: accept 00000
      if (mobile === "0599000000" && caseNo === "00000" && value === "00000") {
        try { sessionStorage.setItem("track_access_granted", "1"); } catch {}
        router.push(`/${locale}/track/case`);
        return;
      }
      // Otherwise still allow navigation for demo
      try { sessionStorage.setItem("track_access_granted", "1"); } catch {}
      router.push(`/${locale}/track/case`);
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
                  {errors.mobile && <span className="track__error">{errors.mobile}</span>}
                </div>

                <div className="track__form-group">
                  <label className="track__label" htmlFor="caseNumber">
                    {t("track.caseNumber")}
                  </label>
                  <input
                    id="caseNumber"
                    name="caseNumber"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    className="track__input"
                    value={caseNo}
                    onChange={(e) => setCaseNo(e.target.value.replace(/\D/g, "").slice(0, 5))}
                    placeholder={t("track.caseNumberPlaceholder")?.toString()}
                  />
                  {errors.case && <span className="track__error">{errors.case}</span>}
                </div>
                <button type="submit" className="track__submit">
                  {t("track.sendCode")}
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
                {errors.code && <span className="track__error">{errors.code}</span>}
                <button type="submit" className="track__submit">
                  {t("track.verify")}
                </button>
                <div className="track__resend-wrap">
                  <span className="track__resend-text">{t("track.resendMessage")}</span>
                  <button
                    type="button"
                    className="track__resend"
                    disabled={!canResend}
                    onClick={() => {
                      setResendAt(Date.now() + 60_000);
                      setTimeout(() => setResendAt(Date.now()), 60_000);
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


