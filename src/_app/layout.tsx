import type { Metadata } from "next";
import Head from "./components/Head";
import { IBM_Plex_Sans_Arabic } from "next/font/google";
import { useLocale } from "next-globe-gen";
import { ReactNode } from "react";
import "@/app/css/globals.css";

const ibmPlexSansArabic = IBM_Plex_Sans_Arabic({
  weight: ["100", "200", "300", "400", "500", "600", "700"],
  subsets: ["latin", "arabic", "cyrillic-ext", "latin-ext"],
  variable: "--font-ibm-plex-sans-arabic",
  display: "swap",
});

export const metadata: Metadata = {
  title: { template: "%s | PCHR GAZA", default: "PCHR GAZA" },
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
        {children}
      </body>
    </html>
  );
}
