"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-globe-gen";
import LawyerHeader from "./components/LawyerHeader";
import "@/app/css/lawyer.css";
import { usePathname } from "next/navigation";
import { IconUser, IconLock, IconLogout } from "@tabler/icons-react";
import LawyerProtectedLayout from "../components/LawyerProtectedLayout";
import { useLawyerAuth } from "../hooks/useLawyerAuth";

interface LawyerProfileLayoutProps {
  children: React.ReactNode;
}

export default function LawyerProfileLayout({ children }: LawyerProfileLayoutProps) {
  return (
    <LawyerProtectedLayout>
      <LawyerProfileLayoutInner>{children}</LawyerProfileLayoutInner>
    </LawyerProtectedLayout>
  );
}

function LawyerProfileLayoutInner({ children }: LawyerProfileLayoutProps) {
  const t = useTranslations();
  const locale = useLocale();
  const pathname = usePathname();
  const { logout } = useLawyerAuth();

  // Determine active tab based on pathname
  const isProfileActive = pathname.includes('/profile') && !pathname.includes('/change-password');
  const isChangePasswordActive = pathname.includes('/change-password');

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="lawyer">
      <div className="lawyer__container">
        <LawyerHeader activeTab="overview" />
        
        {/* Profile Layout */}
        <main className="lawyer__case-layout">
          {/* Sidebar Navigation */}
          <aside className="lawyer__case-sidebar">
            <div className="lawyer__case-header">
              <h1 className="lawyer__case-title">
                {t("lawyerProfile.title")}
              </h1>
            </div>
            
            <nav className="lawyer__case-nav">
              <Link
                href={`/${locale}/lawyer/profile`}
                className={`lawyer__case-nav-item ${isProfileActive ? 'lawyer__case-nav-item--active' : ''}`}
              >
                <div className="lawyer__case-nav-icon">
                  <IconUser size={20} />
                </div>
                <span>{t("lawyerProfile.personalInfo")}</span>
              </Link>
              <Link
                href={`/${locale}/lawyer/change-password`}
                className={`lawyer__case-nav-item ${isChangePasswordActive ? 'lawyer__case-nav-item--active' : ''}`}
              >
                <div className="lawyer__case-nav-icon">
                  <IconLock size={20} />
                </div>
                <span>{t("lawyerProfile.changePassword.title")}</span>
              </Link>
              <button
                onClick={handleLogout}
                className="lawyer__case-nav-item lawyer__case-nav-item--logout"
              >
                <div className="lawyer__case-nav-icon">
                  <IconLogout size={20} />
                </div>
                <span>{t("lawyer.navigation.logout")}</span>
              </button>
            </nav>
          </aside>

          {/* Profile Content */}
          <section className="lawyer__case-content">
            {children}
          </section>
        </main>
      </div>
    </div>
  );
}
