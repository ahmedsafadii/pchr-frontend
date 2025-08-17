"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-globe-gen";
import Logo from "../../components/Logo";
import LanguageSwitcher from "../../components/LanguageSwitcher";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { IconHomeSpark, IconBriefcase, IconUser, IconLogout, IconChevronDown, IconLock, IconWorld, IconBell } from "@tabler/icons-react";

interface LawyerHeaderProps {
  activeTab?: 'overview' | 'cases';
}

export default function LawyerHeader({ activeTab = 'overview' }: LawyerHeaderProps) {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const [lawyerName, setLawyerName] = useState("");
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "New case assignment",
      message: "Case #23444 - Ahmed Khaled has been assigned to you",
      date: "2 hours ago",
      isRead: false,
      caseId: "23444"
    },
    {
      id: 2,
      title: "Visit scheduled",
      message: "Visit for Case #23445 scheduled for tomorrow 10:00 AM",
      date: "1 day ago",
      isRead: false,
      caseId: "23445"
    },
    {
      id: 3,
      title: "Case update",
      message: "Case #23446 status changed to completed",
      date: "2 days ago",
      isRead: true,
      caseId: "23446"
    }
  ]);

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('lawyer_access_token');
    if (!token) {
      // Add fake JWT for UI exploration
      localStorage.setItem('lawyer_access_token', 'fake-jwt-token-for-ui-exploration');
      localStorage.setItem('lawyer_name', 'Sami Alkhaldi');
      localStorage.setItem('lawyer_email', 'sami.alkhaldi@example.com');
      // router.push(`/${locale}/lawyer-login`);
      // return;
    }

    // Get lawyer name from localStorage
    const name = localStorage.getItem('lawyer_name') || 'Sami Alkhaldi';
    setLawyerName(name);
  }, [locale, router]);

  const handleLogout = () => {
    localStorage.removeItem('lawyer_access_token');
    localStorage.removeItem('lawyer_email');
    localStorage.removeItem('lawyer_name');
    localStorage.removeItem('lawyer_token_expires');
    router.push(`/${locale}/lawyer-login`);
  };

  // Get initials from lawyer name
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Handle notification click
  const handleNotificationClick = (notification: any) => {
    // Mark as read
    setNotifications(prev => 
      prev.map(n => 
        n.id === notification.id ? { ...n, isRead: true } : n
      )
    );
    
    // Close dropdown
    setShowNotifications(false);
    
    // Navigate to case details
    router.push(`/${locale}/lawyer/cases/${notification.caseId}`);
  };

  // Get unread notifications count
  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <header className="lawyer__header">
      <div className="lawyer__header-left">
        <div className="lawyer__logo">
          <Logo />
        </div>
        
        <nav className="lawyer__nav">
          <Link 
            href={`/${locale}/lawyer`} 
            className={`lawyer__nav-link ${activeTab === 'overview' ? 'lawyer__nav-link--active' : ''}`}
          >
            <IconHomeSpark size={20} />
            <span>{t("lawyer.navigation.overview")}</span>
          </Link>
          <Link 
            href={`/${locale}/lawyer/cases`} 
            className={`lawyer__nav-link ${activeTab === 'cases' ? 'lawyer__nav-link--active' : ''}`}
          >
            <IconBriefcase size={20} />
            <span>{t("lawyer.navigation.allCases")}</span>
          </Link>
        </nav>
      </div>

      <div className="lawyer__header-right">
        {/* Notifications */}
        <div className="lawyer__notifications">
          <div 
            className="lawyer__notifications-button"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <div className="lawyer__notifications-icon">
              <IconBell size={20} />
              {unreadCount > 0 && (
                <div className="lawyer__notifications-badge">
                  {unreadCount > 9 ? '9+' : unreadCount}
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
                        !notification.isRead ? 'lawyer__notification-item--unread' : ''
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

        <div className="lawyer__user">
          <div 
            className="lawyer__user-dropdown"
            onClick={() => setShowUserMenu(!showUserMenu)}
          >
            <div className="lawyer__user-avatar">{getInitials(lawyerName)}</div>
            <IconChevronDown size={16} />
            
            {showUserMenu && (
              <div className="lawyer__user-menu">
                <button className="lawyer__user-menu-item">
                  <IconUser size={16} />
                  Profile
                </button>
                <button className="lawyer__user-menu-item">
                  <IconLock size={16} />
                  Change Password
                </button>
                <div className="lawyer__user-menu-item">
                  <IconWorld size={16} />
                  <LanguageSwitcher />
                </div>
                <button className="lawyer__user-menu-item" onClick={handleLogout}>
                  <IconLogout size={16} />
                  {t("lawyer.navigation.logout")}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
