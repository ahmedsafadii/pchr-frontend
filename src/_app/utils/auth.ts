export interface LawyerUser {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  is_verified: boolean;
}

export interface AuthTokens {
  access: string;
  refresh: string;
}

/**
 * Authentication utility functions for lawyer authentication
 */
export class LawyerAuth {
  private static ACCESS_TOKEN_KEY = 'lawyer_access_token';
  private static REFRESH_TOKEN_KEY = 'lawyer_refresh_token';
  private static USER_DATA_KEY = 'lawyer_user_data';

  /**
   * Store authentication tokens and user data
   */
  static storeAuth(tokens: AuthTokens, user: LawyerUser): void {
    try {
      localStorage.setItem(this.ACCESS_TOKEN_KEY, tokens.access);
      localStorage.setItem(this.REFRESH_TOKEN_KEY, tokens.refresh);
      localStorage.setItem(this.USER_DATA_KEY, JSON.stringify(user));
    } catch (error) {
      console.warn('Failed to store authentication data:', error);
    }
  }

  /**
   * Get the current access token
   */
  static getAccessToken(): string | null {
    try {
      return localStorage.getItem(this.ACCESS_TOKEN_KEY);
    } catch {
      return null;
    }
  }

  /**
   * Get the current refresh token
   */
  static getRefreshToken(): string | null {
    try {
      return localStorage.getItem(this.REFRESH_TOKEN_KEY);
    } catch {
      return null;
    }
  }

  /**
   * Get the current user data
   */
  static getUserData(): LawyerUser | null {
    try {
      const userData = localStorage.getItem(this.USER_DATA_KEY);
      return userData ? JSON.parse(userData) : null;
    } catch {
      return null;
    }
  }

  /**
   * Check if user is currently authenticated
   */
  static isAuthenticated(): boolean {
    return !!this.getAccessToken();
  }

  /**
   * Clear all authentication data
   */
  static clearTokens(): void {
    try {
      localStorage.removeItem(this.ACCESS_TOKEN_KEY);
      localStorage.removeItem(this.REFRESH_TOKEN_KEY);
      localStorage.removeItem(this.USER_DATA_KEY);
    } catch (error) {
      console.warn('Failed to clear authentication data:', error);
    }
  }

  /**
   * Logout with API call to invalidate tokens on server
   */
  static async logout(lang: string = 'ar'): Promise<void> {
    const refreshToken = this.getRefreshToken();
    
    // Clear local tokens first
    this.clearTokens();
    
    // Try to logout on server if we have a refresh token
    if (refreshToken) {
      try {
        const { lawyerLogout } = await import('@/_app/services/api');
        await lawyerLogout(refreshToken, lang);
      } catch (error) {
        console.warn('Server logout failed, but local tokens cleared:', error);
      }
    }
  }

  /**
   * Get authorization headers for API requests
   */
  static getAuthHeaders(): Record<string, string> {
    const token = this.getAccessToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  /**
   * Update the access token (useful after refresh)
   */
  static updateAccessToken(newAccessToken: string): void {
    try {
      localStorage.setItem(this.ACCESS_TOKEN_KEY, newAccessToken);
    } catch (error) {
      console.warn('Failed to update access token:', error);
    }
  }

  /**
   * Refresh the access token using the refresh token
   */
  static async refreshToken(lang: string = 'ar'): Promise<boolean> {
    const refreshToken = this.getRefreshToken();
    
    if (!refreshToken) {
      console.warn('No refresh token available');
      return false;
    }

    try {
      const { lawyerRefreshToken } = await import('@/_app/services/api');
      const response = await lawyerRefreshToken(refreshToken, lang);
      
      if (response.status === 'success' && response.data?.access) {
        // Update tokens with new values
        this.updateAccessToken(response.data.access);
        
        // Update refresh token if a new one is provided
        if (response.data.refresh) {
          try {
            localStorage.setItem(this.REFRESH_TOKEN_KEY, response.data.refresh);
          } catch (error) {
            console.warn('Failed to update refresh token:', error);
          }
        }
        
        return true;
      } else {
        console.warn('Token refresh failed: Invalid response');
        return false;
      }
    } catch (error: any) {
      console.error('Token refresh failed:', error);
      
      // If refresh fails with specific error codes, clear tokens
      if (error.payload?.error?.code === 'TOKEN_REFRESH_FAILED' || 
          error.payload?.error?.type === 'token_error') {
        this.clearTokens();
      }
      
      return false;
    }
  }
}
