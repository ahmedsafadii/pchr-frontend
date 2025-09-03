import { Metadata } from "next";
import { getTranslations } from "next-globe-gen";

export interface MetadataConfig {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  url?: string;
  locale?: string;
}

export async function generateMetadata(
  config: MetadataConfig = {}
): Promise<Metadata> {
  const t = await getTranslations();

  const defaultTitle = t("landing.title");
  const defaultDescription = t("landing.description");

  const title = config.title || defaultTitle;
  const description = config.description || defaultDescription;
  const locale = config.locale || "en";

  const baseUrl = "https://pchr.ps";
  const currentUrl = config.url ? `${baseUrl}${config.url}` : baseUrl;

  return {
    title: {
      template: `%s | ${t("common.organizationName")}`,
      default: title,
    },
    description,
    keywords: config.keywords || [
      "PCHR",
      t("common.organizationName"),
      "missing persons",
      "disappearance report",
      "Gaza",
      "human rights",
      "legal assistance",
      "case tracking",
    ],
    authors: [{ name: t("common.organizationName") }],
    creator: t("common.organizationName"),
    publisher: t("common.organizationName"),
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    openGraph: {
      type: "website",
      locale: locale === "ar" ? "ar_PS" : "en_US",
      url: currentUrl,
      siteName: t("common.organizationName"),
      title,
      description,
      images: [
        {
          url: config.image || "/img/screenshot.png",
          width: 1200,
          height: 630,
          alt: `${t("common.organizationName")} - ${title}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [config.image || "/img/screenshot.png"],
    },
    alternates: {
      canonical: currentUrl,
      languages: {
        en: `${baseUrl}/en`,
        ar: `${baseUrl}/ar`,
      },
    },
  };
}

// Helper function for page-specific metadata
export async function generatePageMetadata(
  pageTitle: string,
  pageDescription?: string,
  additionalConfig: Omit<MetadataConfig, "title" | "description"> = {}
): Promise<Metadata> {
  const t = await getTranslations();

  return generateMetadata({
    title: `${pageTitle} | ${t("common.organizationName")}`,
    description: pageDescription,
    ...additionalConfig,
  });
}
