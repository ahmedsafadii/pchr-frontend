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
      // Make the API request using the specified method
      const method = apiOptions.method || 'GET';
      let response: T;
      
      switch (method) {
        case 'GET':
          response = await api.get<T>(path, { ...apiOptions, headers });
          break;
        case 'POST':
          response = await api.post<T>(path, apiOptions.body, { ...apiOptions, headers });
          break;
        case 'PUT':
          response = await api.put<T>(path, apiOptions.body, { ...apiOptions, headers });
          break;
        case 'PATCH':
          response = await api.patch<T>(path, apiOptions.body, { ...apiOptions, headers });
          break;
        case 'DELETE':
          response = await api.delete<T>(path, { ...apiOptions, headers });
          break;
        default:
          throw new Error(`Unsupported HTTP method: ${method}`);
      }
      
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
      const refreshSuccess = await LawyerAuth.refreshToken(options.lang || 'ar');
      
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
export async function getLawyerCases(lang: string = 'ar') {
  return apiWithAuth.get<ApiResponse>('/lawyer/cases/', { lang });
}

export async function getLawyerVisits(
  lang: string = 'ar', 
  caseId?: string, 
  params?: {
    page?: number;
    page_size?: number;
    days?: number;
    status?: string;
    [key: string]: any;
  }
) {
  let path = caseId ? '/lawyer/dashboard/upcoming-visits/' : '/lawyer/visits/';
  
  // Build query parameters
  const queryParams = new URLSearchParams();
  
  // Add case_id if provided
  if (caseId) {
    queryParams.append('case_id', caseId);
  }
  
  // Add other parameters if provided
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, String(value));
      }
    });
  }
  
  // Construct final URL
  const queryString = queryParams.toString();
  if (queryString) {
    path = `${path}?${queryString}`;
  }
  
  return apiWithAuth.get<ApiResponse>(path, { lang });
}

export async function getLawyerCaseDetails(caseId: string, lang: string = 'ar') {
  return apiWithAuth.get<ApiResponse>(`/lawyer/cases/${caseId}/`, { lang });
}

export async function getLawyerDashboard(lang: string = 'ar') {
  return apiWithAuth.get<ApiResponse>('/lawyer/dashboard/', { lang });
}

export async function requestCaseVisit(
  caseId: string,
  payload: {
    title: string;
    prison_id: string;
    visit_date: string; // yyyy-mm-dd
    visit_type: string; // e.g., 'legal' | 'follow_up' etc.
  },
  lang: string = 'ar'
) {
  return apiWithAuth.post<ApiResponse>(`/lawyer/cases/${caseId}/visits/request/`, payload, { lang });
}

export async function getLawyerNotifications(
  lang: string = 'ar',
  params?: {
    page?: number;
    page_size?: number;
    message_type?: string;
    is_read?: boolean;
    search?: string;
  }
) {
  // Build query parameters
  const queryParams = new URLSearchParams();
  
  // Set default values only if not provided by user
  const finalParams = {
    page: 1,
    page_size: 5, // Changed to 5 for notifications
    message_type: 'notification',
    ...params // User params override defaults
  };
  
  // Add all parameters
  Object.entries(finalParams).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      queryParams.append(key, String(value));
    }
  });
  
  // Construct final URL
  const queryString = queryParams.toString();
  const path = `/lawyer/notifications/?${queryString}`;
  
  return apiWithAuth.get<ApiResponse>(path, { lang });
}

export async function markNotificationAsRead(
  notificationId: string,
  lang: string = 'ar'
) {
  const payload = {
    is_read: true,
    is_archived: false
  };
  
  return apiWithAuth.patch<ApiResponse>(`/lawyer/notifications/${notificationId}/`, payload, { lang });
}

export async function markAllNotificationsAsRead(
  lang: string = 'ar'
) {
  const payload = {
    is_read: true,
    is_archived: false
  };
  
  return apiWithAuth.patch<ApiResponse>('/lawyer/notifications/mark-all-read/', payload, { lang });
}
