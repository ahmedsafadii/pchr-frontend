"use client";

import { Link, useRoute, useLocale } from "next-globe-gen";

/**
 * If there is dynamic route segments in some of the application routes (i.e. "/images/[id]"),
 * the params provided by Next.js useParams function have to be passed as a prop to
 * Link components for language switching to work properly.
 */
export default function LanguageSwitcher() {
  const route = useRoute();
  const currentLocale = useLocale();
  return (
    <span>
      {currentLocale !== "en" && (
        <Link href={route} locale="en">
          English
        </Link>
      )}
      {currentLocale !== "ar" && (
        <Link href={route} locale="ar">
          عربي
        </Link>
      )}
    </span>
  );
}
