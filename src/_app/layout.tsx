import type { Metadata } from "next";
import Head from "./components/Head";
import { IBM_Plex_Sans_Arabic } from "next/font/google";
import { useLocale } from "next-globe-gen";
import { ReactNode } from "react";
import "@/app/css/globals.css";
import ClientProviders from "./components/ClientProviders";
import { generateMetadata as generateDynamicMetadata } from "./utils/metadata";

const ibmPlexSansArabic = IBM_Plex_Sans_Arabic({
  weight: ["100", "200", "300", "400", "500", "600", "700"],
  subsets: ["latin", "arabic", "cyrillic-ext", "latin-ext"],
  variable: "--font-ibm-plex-sans-arabic",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  return generateDynamicMetadata();
}

export const viewport = {
  width: "device-width",
  initialScale: 1.0,
  maximumScale: 1.0,
  userScalable: false,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  const locale = useLocale();
  return (
    <html lang={locale}>
      <Head />
      <body className={`${ibmPlexSansArabic.variable} antialiased`}>
        {/* <div className="overlay">
          <img src="/img/screenshot.png" alt="PCHR" />
        </div> */}
        <ClientProviders locale={locale}>{children}</ClientProviders>
      </body>
    </html>
  );
}
