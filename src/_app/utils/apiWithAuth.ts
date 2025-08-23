import { api, ApiResponse } from '@/_app/services/api';
import { LawyerAuth } from './auth';

type RequestOptions = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  headers?: Record<string, string>;
  body?: unknown;
  lang?: string;
  cache?: RequestCache;
  next?: any;
  retryOnUnauthorized?: boolean; // New option to control retry behavior
};

/**
 * Enhanced API client with automatic token refresh for lawyer authentication
 */
class AuthenticatedApi {
  private isRefreshing = false;
  private failedQueue: Array<{
    resolve: (value: any) => void;
    reject: (reason?: any) => void;
  }> = [];

  /**
   * Process the failed queue after token refresh
   */
  private processQueue(error: any = null) {
    this.failedQueue.forEach(({ resolve, reject }) => {
      if (error) {
        reject(error);
      } else {
        resolve(null);
      }
    });
    
    this.failedQueue = [];
  }

  /**
   * Make an authenticated request with automatic token refresh
   */
  async request<T>(
    path: string, 
    options: RequestOptions = {},
    isRetry = false
  ): Promise<T> {
    const { retryOnUnauthorized = true, ...apiOptions } = options;
    
    // Add authorization headers
    const authHeaders = LawyerAuth.getAuthHeaders();
    const headers = { ...apiOptions.headers, ...authHeaders };

    try {
      // Make the API request
      const response = await api.post<T>(path, apiOptions.body, {
        ...apiOptions,
        headers,
      });
      
      return response;
    } catch (error: any) {
      // Handle 401 Unauthorized errors with token refresh
      if (error.status === 401 && retryOnUnauthorized && !isRetry) {
        return this.handleUnauthorized<T>(path, options);
      }
      
      throw error;
    }
  }

  /**
   * Handle 401 errors by attempting token refresh
   */
  private async handleUnauthorized<T>(
    path: string, 
    options: RequestOptions
  ): Promise<T> {
    // If already refreshing, queue this request
    if (this.isRefreshing) {
      return new Promise((resolve, reject) => {
        this.failedQueue.push({ resolve, reject });
      }).then(() => {
        return this.request<T>(path, options, true);
      });
    }

    this.isRefreshing = true;

    try {
      // Attempt to refresh the token
      const refreshSuccess = await LawyerAuth.refreshToken(options.lang || 'en');
      
      if (refreshSuccess) {
        // Token refreshed successfully, process queue and retry original request
        this.processQueue();
        return this.request<T>(path, options, true);
      } else {
        // Refresh failed, reject all queued requests
        const refreshError = new Error('Token refresh failed');
        this.processQueue(refreshError);
        throw refreshError;
      }
    } catch (error) {
      // Refresh failed, clear queue and logout
      this.processQueue(error);
      LawyerAuth.clearTokens();
      throw error;
    } finally {
      this.isRefreshing = false;
    }
  }

  // Convenience methods
  get<T>(path: string, opts?: Omit<RequestOptions, "method" | "body">) {
    return this.request<T>(path, { ...opts, method: "GET" });
  }

  post<T>(path: string, body?: unknown, opts?: Omit<RequestOptions, "method" | "body">) {
    return this.request<T>(path, { ...opts, method: "POST", body });
  }

  put<T>(path: string, body?: unknown, opts?: Omit<RequestOptions, "method" | "body">) {
    return this.request<T>(path, { ...opts, method: "PUT", body });
  }

  patch<T>(path: string, body?: unknown, opts?: Omit<RequestOptions, "method" | "body">) {
    return this.request<T>(path, { ...opts, method: "PATCH", body });
  }

  delete<T>(path: string, opts?: Omit<RequestOptions, "method" | "body">) {
    return this.request<T>(path, { ...opts, method: "DELETE" });
  }
}

// Export singleton instance
export const apiWithAuth = new AuthenticatedApi();

// Convenience functions for lawyer-specific API calls with authentication
export async function getLawyerCases(lang: string = 'en') {
  return apiWithAuth.get<ApiResponse>('/lawyer/cases/', { lang });
}

export async function getLawyerVisits(lang: string = 'en') {
  return apiWithAuth.get<ApiResponse>('/lawyer/visits/', { lang });
}

export async function getLawyerCaseDetails(caseId: string, lang: string = 'en') {
  return apiWithAuth.get<ApiResponse>(`/lawyer/cases/${caseId}/`, { lang });
}
