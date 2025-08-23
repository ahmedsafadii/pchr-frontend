"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "next-globe-gen";
import { LawyerAuth, LawyerUser } from "@/_app/utils/auth";

interface UseLawyerAuthReturn {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: LawyerUser | null;
  logout: () => Promise<void>;
  refreshToken: () => Promise<boolean>;
}

/**
 * Custom hook to handle lawyer authentication
 * Automatically redirects to login page if not authenticated
 */
export function useLawyerAuth(): UseLawyerAuthReturn {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<LawyerUser | null>(null);
  const router = useRouter();
  const locale = useLocale();

  useEffect(() => {
    const checkAuth = () => {
      try {
        const token = LawyerAuth.getAccessToken();
        const userData = LawyerAuth.getUserData();

        if (!token || !userData) {
          // No valid authentication, redirect to login
          setIsAuthenticated(false);
          setUser(null);
          setIsLoading(false);
          router.replace(`/${locale}/lawyer-login`);
          return;
        }

        // TODO: Add JWT token validation/expiry check here if needed
        // For now, we assume if token exists, it's valid
        setIsAuthenticated(true);
        setUser(userData);
        setIsLoading(false);
      } catch (error) {
        console.error('Authentication check failed:', error);
        setIsAuthenticated(false);
        setUser(null);
        setIsLoading(false);
        router.replace(`/${locale}/lawyer-login`);
      }
    };

    checkAuth();
  }, [router, locale]);

  const logout = async () => {
    try {
      await LawyerAuth.logout(locale);
    } catch (error) {
      console.error('Logout error:', error);
    }
    setIsAuthenticated(false);
    setUser(null);
    router.push(`/${locale}/lawyer-login`);
  };

  const refreshToken = async (): Promise<boolean> => {
    try {
      const success = await LawyerAuth.refreshToken(locale);
      if (!success) {
        // If refresh fails, logout user
        setIsAuthenticated(false);
        setUser(null);
        router.replace(`/${locale}/lawyer-login`);
      }
      return success;
    } catch (error) {
      console.error('Token refresh error:', error);
      setIsAuthenticated(false);
      setUser(null);
      router.replace(`/${locale}/lawyer-login`);
      return false;
    }
  };

  return {
    isAuthenticated,
    isLoading,
    user,
    logout,
    refreshToken,
  };
}

/**
 * Higher-order component that wraps a component with authentication protection
 */
export function withLawyerAuth<P extends object>(
  Component: React.ComponentType<P>
): React.ComponentType<P> {
  return function AuthenticatedComponent(props: P) {
    const { isAuthenticated, isLoading } = useLawyerAuth();

    if (isLoading) {
      return (
        <div className="auth-loading">
          <div className="auth-loading__spinner"></div>
          <p>Loading...</p>
        </div>
      );
    }

    if (!isAuthenticated) {
      return null; // useLawyerAuth will handle the redirect
    }

    return <Component {...props} />;
  };
}
