export const API_BASE_URL: string =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://api-d.pchrgaza.org/api/v1";

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

type RequestOptions = {
  method?: HttpMethod;
  headers?: Record<string, string>;
  body?: unknown;
  lang?: string; // language code, e.g., 'en' | 'ar'
  cache?: RequestCache;
  next?: any;
};

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = "GET", headers = {}, body, lang = "en", cache, next } = options;
  const url = `${API_BASE_URL}${path}`;

  const isFormData = typeof FormData !== 'undefined' && body instanceof FormData;
  const mergedHeaders: HeadersInit = {
    Accept: "application/json",
    ...(body !== undefined && !isFormData ? { "Content-Type": "application/json" } : {}),
    // Common header name used for language negotiation
    "Accept-Language": lang,
    ...headers,
  };

  const init: RequestInit = {
    method,
    headers: mergedHeaders,
    body: body !== undefined && !isFormData ? JSON.stringify(body) : (body as any),
    cache,
    next,
  };

  const res = await fetch(url, init);
  if (!res.ok) {
    let errorPayload: unknown = undefined;
    try {
      errorPayload = await res.json();
    } catch {
      // noop
    }
    const error = new Error(`API ${method} ${path} failed with status ${res.status}`);
    (error as any).status = res.status;
    (error as any).payload = errorPayload;
    throw error;
  }

  if (res.status === 204) {
    return undefined as unknown as T;
  }

  const data = (await res.json()) as T;
  return data;
}

export const api = {
  get: <T>(path: string, opts?: Omit<RequestOptions, "method" | "body">) =>
    request<T>(path, { ...opts, method: "GET" }),
  post: <T>(path: string, body?: unknown, opts?: Omit<RequestOptions, "method" | "body">) =>
    request<T>(path, { ...opts, method: "POST", body }),
  put: <T>(path: string, body?: unknown, opts?: Omit<RequestOptions, "method" | "body">) =>
    request<T>(path, { ...opts, method: "PUT", body }),
  patch: <T>(path: string, body?: unknown, opts?: Omit<RequestOptions, "method" | "body">) =>
    request<T>(path, { ...opts, method: "PATCH", body }),
  delete: <T>(path: string, opts?: Omit<RequestOptions, "method" | "body">) =>
    request<T>(path, { ...opts, method: "DELETE" }),
};

export type ApiResponse = {
  status: string;
  data: any;
  message?: string;
  meta?: any;
  debug?: any;
};

export async function fetchPublicConstants(lang: string) {
  return api.get<ApiResponse>("/public/constants/", { lang });
}

export async function uploadDocumentFile(documentTypeId: string, file: File, lang: string) {
  const formData = new FormData();
  // Some backends expect the type id under different keys; include common variants
  formData.append("document_type", documentTypeId);
  formData.append("document_type_id", documentTypeId);
  formData.append("file", file);
  return api.post<ApiResponse>("/public/documents/upload/", formData, { lang });
}

export async function submitCase(payload: Record<string, any>, lang: string) {
  return api.post<ApiResponse>("/public/cases/submit/", payload, { lang });
}

// Tracking API functions
export async function requestTrackingCode(caseNumber: string, clientPhone: string, lang: string) {
  return api.post<ApiResponse>("/public/cases/tracking/request/", {
    case_number: caseNumber,
    client_phone: clientPhone
  }, { lang });
}

export async function verifyTrackingCode(caseNumber: string, clientPhone: string, verificationCode: string, lang: string) {
  return api.post<ApiResponse>("/public/cases/tracking/verify/", {
    case_number: caseNumber,
    client_phone: clientPhone,
    verification_code: verificationCode
  }, { lang });
}

export async function resendTrackingCode(caseNumber: string, clientPhone: string, lang: string) {
  return api.post<ApiResponse>("/public/cases/tracking/resend/", {
    case_number: caseNumber,
    client_phone: clientPhone
  }, { lang });
}

// Case details API functions (requires JWT authentication)
export async function getCaseDetails(token: string, lang: string) {
  return api.get<ApiResponse>("/public/cases/details/", {
    headers: {
      Authorization: `Bearer ${token}`
    },
    lang
  });
}

export async function getCaseDocuments(token: string, lang: string) {
  return api.get<ApiResponse>("/public/cases/documents/", {
    headers: {
      Authorization: `Bearer ${token}`
    },
    lang
  });
}

// Lawyer authentication API functions
export async function lawyerLogin(email: string, password: string, lang: string) {
  return api.post<ApiResponse>("/lawyer/auth/login/", {
    email,
    password
  }, { lang });
}

export async function lawyerRefreshToken(refreshToken: string, lang: string) {
  return api.post<ApiResponse>("/lawyer/auth/refresh/", {
    refresh: refreshToken
  }, { lang });
}

export async function lawyerLogout(refreshToken: string, lang: string) {
  return api.post<ApiResponse>("/lawyer/auth/logout/", {
    refresh: refreshToken
  }, { lang });
}

// Lawyer profile API functions
export async function getLawyerProfile(token: string, lang: string) {
  return api.get<ApiResponse>("/lawyer/auth/profile/", {
    headers: {
      Authorization: `Bearer ${token}`
    },
    lang
  });
}

export async function updateLawyerProfile(
  token: string, 
  profileData: {
    first_name: string;
    last_name: string;
    phone_number: string;
    address: string;
  }, 
  lang: string
) {
  return api.put<ApiResponse>("/lawyer/auth/profile/", profileData, {
    headers: {
      Authorization: `Bearer ${token}`
    },
    lang
  });
}

export async function changeLawyerPassword(
  token: string,
  passwordData: {
    current_password: string;
    new_password: string;
    confirm_password: string;
  },
  lang: string
) {
  return api.post<ApiResponse>("/lawyer/auth/change-password/", passwordData, {
    headers: {
      Authorization: `Bearer ${token}`
    },
    lang
  });
}

// Lawyer cases API functions
export async function getLawyerCases(
  token: string, 
  params: {
    status?: string;
    search?: string;
    page?: number;
    page_size?: number;
    urgent_only?: boolean;
    sort?: string;
    order?: 'asc' | 'desc';
  }, 
  lang: string
) {
  const searchParams = new URLSearchParams();
  
  if (params.status) searchParams.append('status', params.status);
  if (params.search) searchParams.append('search', params.search);
  if (params.page) searchParams.append('page', params.page.toString());
  if (params.page_size) searchParams.append('page_size', params.page_size.toString());
  if (params.urgent_only !== undefined) searchParams.append('urgent_only', params.urgent_only.toString());
  if (params.sort) searchParams.append('sort', params.sort);
  if (params.order) searchParams.append('order', params.order);

  const queryString = searchParams.toString();
  const path = `/lawyer/cases${queryString ? `?${queryString}` : ''}`;

  return api.get<ApiResponse>(path, {
    headers: {
      Authorization: `Bearer ${token}`
    },
    lang
  });
}


