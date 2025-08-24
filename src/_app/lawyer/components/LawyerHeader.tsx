"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-globe-gen";
import Logo from "../../components/Logo";
import LanguageSwitcher from "../../components/LanguageSwitcher";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useLawyerAuth } from "@/_app/hooks/useLawyerAuth";
import {
  IconHomeSpark,
  IconBriefcase,
  IconUser,
  IconLogout,
  IconChevronDown,
  IconLock,
  IconBell,
  IconCalendarEvent,
} from "@tabler/icons-react";

interface LawyerHeaderProps {
  activeTab?: "overview" | "cases" | "profile" | "visits";
}

export default function LawyerHeader({
  activeTab = "overview",
}: LawyerHeaderProps) {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const { user, logout } = useLawyerAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "New case assignment",
      message: "Case #23444 - Ahmed Khaled has been assigned to you",
      date: "2 hours ago",
      isRead: false,
      caseId: "23444",
    },
    {
      id: 2,
      title: "Visit scheduled",
      message: "Visit for Case #23445 scheduled for tomorrow 10:00 AM",
      date: "1 day ago",
      isRead: false,
      caseId: "23445",
    },
    {
      id: 3,
      title: "Case update",
      message: "Case #23446 status changed to completed",
      date: "2 days ago",
      isRead: true,
      caseId: "23446",
    },
  ]);

  // Get lawyer display name
  const lawyerName = user ? `${user.first_name} ${user.last_name}` : "";

  const handleLogout = async () => {
    await logout();
  };

  // Get initials from lawyer name
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Handle notification click
  const handleNotificationClick = (notification: any) => {
    // Mark as read
    setNotifications((prev) =>
      prev.map((n) => (n.id === notification.id ? { ...n, isRead: true } : n))
    );

    // Close dropdown
    setShowNotifications(false);

    // Navigate to case details
    router.push(`/${locale}/lawyer/cases/${notification.caseId}`);
  };

  // Get unread notifications count
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <>
      <header className="lawyer__header">
        <div className="lawyer__logo">
          <Logo />
        </div>
        <div className="lawyer__header-left lawyer__header-left--desktop">
          <nav className="lawyer__nav">
            <Link
              href={`/${locale}/lawyer`}
              className={`lawyer__nav-link ${
                activeTab === "overview" ? "lawyer__nav-link--active" : ""
              }`}
            >
              <IconHomeSpark size={20} />
              <span>{t("lawyer.navigation.overview")}</span>
            </Link>
            <Link
              href={`/${locale}/lawyer/cases`}
              className={`lawyer__nav-link ${
                activeTab === "cases" ? "lawyer__nav-link--active" : ""
              }`}
            >
              <IconBriefcase size={20} />
              <span>{t("lawyer.navigation.allCases")}</span>
            </Link>
          </nav>
        </div>

        <div className="lawyer__header-right">
          {/* Language Switcher */}
          <div className="lawyer__language-switcher">
            <LanguageSwitcher />
          </div>
          {/* Notifications */}
          <div className="lawyer__notifications">
            <div
              className="lawyer__notifications-button"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <div className="lawyer__notifications-icon">
                <IconBell size={24} stroke={1.5} />
                {unreadCount > 0 && (
                  <div className="lawyer__notifications-badge">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </div>
                )}
              </div>
            </div>

            {showNotifications && (
              <div className="lawyer__notifications-dropdown">
                <div className="lawyer__notifications-header">
                  <h3>Notifications</h3>
                  <span className="lawyer__notifications-count">
                    {unreadCount} unread
                  </span>
                </div>
                <div className="lawyer__notifications-list">
                  {notifications.length === 0 ? (
                    <div className="lawyer__notifications-empty">
                      No notifications
                    </div>
                  ) : (
                    notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`lawyer__notification-item ${
                          !notification.isRead
                            ? "lawyer__notification-item--unread"
                            : ""
                        }`}
                        onClick={() => handleNotificationClick(notification)}
                      >
                        <div className="lawyer__notification-content">
                          <div className="lawyer__notification-title">
                            {notification.title}
                          </div>
                          <div className="lawyer__notification-message">
                            {notification.message}
                          </div>
                          <div className="lawyer__notification-date">
                            {notification.date}
                          </div>
                        </div>
                        {!notification.isRead && (
                          <div className="lawyer__notification-dot"></div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="lawyer__user lawyer__user--desktop">
            <div
              className="lawyer__user-dropdown"
              onClick={() => setShowUserMenu(!showUserMenu)}
            >
              <div className="lawyer__user-avatar">
                {getInitials(lawyerName)}
              </div>
              <IconChevronDown size={16} />

              {showUserMenu && (
                <div className="lawyer__user-menu">
                  <Link
                    href={`/${locale}/lawyer/profile`}
                    className="lawyer__user-menu-item"
                    onClick={() => setShowUserMenu(false)}
                  >
                    <IconUser size={16} />
                    {t("lawyerProfile.title")}
                  </Link>
                  <Link
                    href={`/${locale}/lawyer/change-password`}
                    className="lawyer__user-menu-item"
                    onClick={() => setShowUserMenu(false)}
                  >
                    <IconLock size={16} />
                    {t("lawyerProfile.changePassword.title")}
                  </Link>

                  <button
                    className="lawyer__user-menu-item"
                    onClick={handleLogout}
                  >
                    <IconLogout size={16} />
                    {t("lawyer.navigation.logout")}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation */}
      <nav className="lawyer__bottom-nav">
        <Link
          href={`/${locale}/lawyer`}
          className={`lawyer__bottom-nav-item ${
            activeTab === "overview" ? "lawyer__bottom-nav-item--active" : ""
          }`}
        >
          <IconHomeSpark size={20} />
          <span>{(t as any)("lawyer.navigation.mobile.overview")}</span>
        </Link>
        <Link
          href={`/${locale}/lawyer/cases`}
          className={`lawyer__bottom-nav-item ${
            activeTab === "cases" ? "lawyer__bottom-nav-item--active" : ""
          }`}
        >
          <IconBriefcase size={20} />
          <span>{(t as any)("lawyer.navigation.mobile.allCases")}</span>
        </Link>
        <Link
          href={`/${locale}/lawyer/profile`}
          className={`lawyer__bottom-nav-item ${
            activeTab === "profile" ? "lawyer__bottom-nav-item--active" : ""
          }`}
        >
          <IconUser size={20} />
          <span>{(t as any)("lawyer.navigation.mobile.profile")}</span>
        </Link>
        <Link
          href={`/${locale}/lawyer/visits`}
          className={`lawyer__bottom-nav-item ${
            activeTab === "visits" ? "lawyer__bottom-nav-item--active" : ""
          }`}
        >
          <IconCalendarEvent size={20} />
          <span>{(t as any)("lawyer.navigation.mobile.visits")}</span>
        </Link>
      </nav>
    </>
  );
}
