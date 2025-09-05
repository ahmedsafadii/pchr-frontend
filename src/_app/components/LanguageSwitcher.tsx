"use client";

import { useLocale } from "next-globe-gen";

export default function LanguageSwitcher() {
  const currentLocale = useLocale();
  
  // Only Arabic language is supported, but show current language
  return (
    <span className="language-switcher">
      <span className="current-language">
        {currentLocale === "ar" ? "عربي" : "عربي"}
      </span>
    </span>
  );
}
