"use client";

import { useLocale } from "next-globe-gen";
import { usePathname } from "next/navigation";

export default function LanguageSwitcher() {
  const currentLocale = useLocale();
  const pathname = usePathname();
  
  // Function to construct the URL for the other language
  const getLanguageUrl = (targetLocale: string) => {
    // Replace the first segment (language) with the target locale
    const pathSegments = pathname.split('/');
    if (pathSegments.length > 1) {
      pathSegments[1] = targetLocale;
      return pathSegments.join('/');
    }
    // Fallback if pathname is just "/"
    return `/${targetLocale}`;
  };
  
  return (
    <span className="language-switcher">
      {currentLocale !== "ar" && (
        <a href={getLanguageUrl("ar")}>
          عربي
        </a>
      )}
      {currentLocale !== "en" && (
        <a href={getLanguageUrl("en")}>
          English
        </a>
      )}
    </span>
  );
}
