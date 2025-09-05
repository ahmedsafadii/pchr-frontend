"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-globe-gen";
import Logo from "../../components/Logo";
import LanguageSwitcher from "../../components/LanguageSwitcher";
import { useRouter } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import { useLawyerAuth } from "@/_app/hooks/useLawyerAuth";
import { getLawyerNotifications, markNotificationAsRead } from "@/_app/utils/apiWithAuth";
import { Notification } from "@/types/notifications";
import {
  IconHomeSpark,
  IconBriefcase,
  IconUser,
  IconLogout,
  IconChevronDown,
  IconLock,
  IconBell,
  IconCalendarEvent,
  IconRefresh,
} from "@tabler/icons-react";
import { formatDateWithLocale } from "../../utils/dateUtils";

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
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [notificationsLoading, setNotificationsLoading] = useState(false);
  const [notificationsError, setNotificationsError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

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
  const handleNotificationClick = async (notification: Notification) => {
    try {
      // Mark notification as read
      await markNotificationAsRead(notification.id, locale);
      
      // Update local state immediately for better UX
      setNotifications(prev => 
        prev.map(n => 
          n.id === notification.id ? { ...n, is_read: true } : n
        )
      );
      
      // Update unread count
      setUnreadCount(prev => Math.max(0, prev - 1));
      
      // Close dropdown
      setShowNotifications(false);

      // Navigate to case details
      router.push(`/${locale}/lawyer/cases/${notification.case.id}`);
      
      // Refresh notifications to get updated data
      setTimeout(() => {
        fetchNotifications(1, false);
      }, 100);
      
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
      // Still navigate even if marking as read fails
      setShowNotifications(false);
      router.push(`/${locale}/lawyer/cases/${notification.case.id}`);
    }
  };

  // Fetch notifications
  const fetchNotifications = useCallback(async (page: number = 1, append: boolean = false, updateCountOnly: boolean = false) => {
    try {
      if (!updateCountOnly) {
        setNotificationsLoading(true);
      }
      setNotificationsError(null);
      
      const response = await getLawyerNotifications(locale, { page, page_size: 5 });
      
      if (response.status === 'success') {
        const newNotifications = response.data.notifications;
        const pagination = response.data.pagination;
        const summary = response.data.summary;
        
        if (!updateCountOnly) {
          if (append) {
            setNotifications(prev => [...prev, ...newNotifications]);
          } else {
            setNotifications(newNotifications);
          }
          
          setCurrentPage(pagination.current_page);
          setHasMore(pagination.has_next);
        }
        
        // Always update unread count
        setUnreadCount(summary.unread_count);
      } else {
        setNotificationsError(response.message || 'Failed to fetch notifications');
      }
    } catch (error: any) {
      console.error('Failed to fetch notifications:', error);
      setNotificationsError(error.message || 'Failed to fetch notifications');
    } finally {
      if (!updateCountOnly) {
        setNotificationsLoading(false);
      }
    }
  }, [locale]);

  // Load more notifications
  const handleLoadMore = () => {
    if (hasMore && !notificationsLoading) {
      fetchNotifications(currentPage + 1, true);
    }
  };

  // Fetch notifications when component mounts and keep them updated
  useEffect(() => {
    // Initial fetch for unread count
    fetchNotifications(1, false);
    
    // Set up periodic refresh every 30 seconds to keep unread count updated
    const interval = setInterval(() => {
      fetchNotifications(1, false, true); // updateCountOnly = true
    }, 30000); // 30 seconds
    
    return () => clearInterval(interval);
  }, [locale, fetchNotifications]);

  // Fetch notifications when dropdown is opened (for full list)
  useEffect(() => {
    if (showNotifications) {
      fetchNotifications(1, false);
    }
  }, [showNotifications, fetchNotifications]);

  // Close notifications dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (showNotifications && !target.closest('.lawyer__notifications')) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showNotifications]);

  // Refresh notifications when page becomes visible (user returns to tab)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        fetchNotifications(1, false, true); // updateCountOnly = true
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [fetchNotifications]);

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
                  <div className="lawyer__notifications-header-left">
                    <h3>{t("lawyer.notifications.title")}</h3>
                    <span className="lawyer__notifications-count">
                      {unreadCount} {t("lawyer.notifications.unread")}
                    </span>
                  </div>
                  <div className="lawyer__notifications-header-actions">
                    <button
                      className="lawyer__notifications-action-btn"
                      onClick={() => fetchNotifications(1, false)}
                      title="Refresh notifications"
                      disabled={notificationsLoading}
                    >
                      <IconRefresh size={16} className={notificationsLoading ? "animate-spin" : ""} />
                    </button>
                  </div>
                </div>
                
                {notificationsError && (
                  <div className="lawyer__notifications-error">
                    {notificationsError}
                  </div>
                )}
                
                <div className="lawyer__notifications-list">
                  {notificationsLoading && notifications.length === 0 ? (
                    <div className="lawyer__notifications-loading">
                      <IconRefresh size={20} className="animate-spin" />
                      <span>{t("lawyer.notifications.loading")}</span>
                    </div>
                  ) : notifications.length === 0 ? (
                    <div className="lawyer__notifications-empty">
                      {t("lawyer.notifications.empty")}
                    </div>
                  ) : (
                    <>
                      {notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`lawyer__notification-item ${
                            !notification.is_read
                              ? "lawyer__notification-item--unread"
                              : ""
                          }`}
                          onClick={() => handleNotificationClick(notification)}
                        >
                          <div className="lawyer__notification-content">
                            <div className="lawyer__notification-title">
                              {notification.content_preview}
                            </div>
                            <div className="lawyer__notification-message">
                              {notification.case.case_number} - {notification.case.detainee_name}
                            </div>
                            <div className="lawyer__notification-date">
                              {formatDateWithLocale(notification.created, locale)}
                            </div>
                          </div>
                          {!notification.is_read && (
                            <div className="lawyer__notification-dot"></div>
                          )}
                        </div>
                      ))}
                      
                      {hasMore && (
                        <div className="lawyer__notifications-load-more">
                          <button
                            className="lawyer__notifications-load-more-btn"
                            onClick={handleLoadMore}
                            disabled={notificationsLoading}
                          >
                            {notificationsLoading ? (
                              <IconRefresh size={16} className="animate-spin" />
                            ) : (
                              t("lawyer.notifications.loadMore")
                            )}
                          </button>
                        </div>
                      )}
                    </>
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
          <span>{t("lawyer.navigation.mobile.overview")}</span>
        </Link>
        <Link
          href={`/${locale}/lawyer/cases`}
          className={`lawyer__bottom-nav-item ${
            activeTab === "cases" ? "lawyer__bottom-nav-item--active" : ""
          }`}
        >
          <IconBriefcase size={20} />
          <span>{t("lawyer.navigation.mobile.allCases")}</span>
        </Link>
        <Link
          href={`/${locale}/lawyer/profile`}
          className={`lawyer__bottom-nav-item ${
            activeTab === "profile" ? "lawyer__bottom-nav-item--active" : ""
          }`}
        >
          <IconUser size={20} />
          <span>{t("lawyer.navigation.mobile.profile")}</span>
        </Link>
        <Link
          href={`/${locale}/lawyer/visits`}
          className={`lawyer__bottom-nav-item ${
            activeTab === "visits" ? "lawyer__bottom-nav-item--active" : ""
          }`}
        >
          <IconCalendarEvent size={20} />
          <span>{t("lawyer.navigation.mobile.visits")}</span>
        </Link>
      </nav>
    </>
  );
}
