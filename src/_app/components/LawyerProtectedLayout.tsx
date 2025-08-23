"use client";

import { useLawyerAuth } from "@/_app/hooks/useLawyerAuth";

interface LawyerProtectedLayoutProps {
  children: React.ReactNode;
}

/**
 * Protected layout component that ensures only authenticated lawyers can access the wrapped content
 */
export default function LawyerProtectedLayout({ children }: LawyerProtectedLayoutProps) {
  const { isAuthenticated, isLoading } = useLawyerAuth();

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="lawyer-auth-loading">
        <div className="lawyer-auth-loading__container">
          <div className="lawyer-auth-loading__spinner"></div>
          <p className="lawyer-auth-loading__text">جاري التحميل...</p>
        </div>
        <style jsx>{`
          .lawyer-auth-loading {
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            background-color: #f8fafc;
          }
          
          .lawyer-auth-loading__container {
            text-align: center;
          }
          
          .lawyer-auth-loading__spinner {
            width: 40px;
            height: 40px;
            border: 4px solid #e2e8f0;
            border-top: 4px solid #3b82f6;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin: 0 auto 16px;
          }
          
          .lawyer-auth-loading__text {
            color: #64748b;
            font-size: 16px;
            margin: 0;
          }
          
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  // If not authenticated, useLawyerAuth will handle the redirect
  if (!isAuthenticated) {
    return null;
  }

  // Render children if authenticated
  return <>{children}</>;
}
