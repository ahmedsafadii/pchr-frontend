export const API_BASE_URL: string =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://api-d.pchrgaza.org/api/v1";

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

type RequestOptions = {
  method?: HttpMethod;
  headers?: Record<string, string>;
  body?: unknown;
  lang?: string; // language code, e.g., 'ar'
  cache?: RequestCache;
  next?: any;
};

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = "GET", headers = {}, body, lang = "ar", cache, next } = options;
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

// Request throttling for constants
let lastConstantsRequest = 0;
const CONSTANTS_REQUEST_THROTTLE = 2000; // 2 seconds minimum between requests

export async function fetchPublicConstants(lang: string) {
  const now = Date.now();
  if (now - lastConstantsRequest < CONSTANTS_REQUEST_THROTTLE) {
    const waitTime = CONSTANTS_REQUEST_THROTTLE - (now - lastConstantsRequest);
    console.log(`Constants request throttled. Waiting ${waitTime}ms`);
    await new Promise(resolve => setTimeout(resolve, waitTime));
  }
  
  lastConstantsRequest = now;
  return api.get<ApiResponse>("/public/constants/", { lang });
}

export async function getCaseMessages(caseId: string, caseTrackingToken: string, page: number = 1, pageSize: number = 20) {
  // caseId should be the internal GUID case ID
  return api.get<any>(`/public/cases/${caseId}/messages/?page=${page}&page_size=${pageSize}`, {
    headers: {
      Authorization: `Bearer ${caseTrackingToken}`
    }
  });
}

export async function uploadDocument(file: File) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('document_type', 'other');
  
  return api.post<any>('/public/documents/upload/', formData);
}

export async function sendMessage(caseId: string, content: string, attachmentIds: string[], caseTrackingToken: string) {
  return api.post<any>('/public/messages/reply/', {
    case: caseId,
    content: content,
    attachment_ids: attachmentIds
  }, {
    headers: {
      Authorization: `Bearer ${caseTrackingToken}`
    }
  });
}

export async function getLawyerConversation(caseId: string, page: number = 1, pageSize: number = 20, accessToken: string) {
  return api.get<any>(`/lawyer/cases/${caseId}/conversation/?page=${page}&page_size=${pageSize}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });
}

export async function sendLawyerMessage(caseId: string, content: string, messageType: string, attachmentIds: string[], accessToken: string) {
  return api.post<any>('/lawyer/messages/send/', {
    case: caseId,
    content: content,
    message_type: messageType,
    attachment_ids: attachmentIds
  }, {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });
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

export async function updateCaseStatus(
  caseId: string, 
  status: string, 
  notes: string, 
  token: string,
  lang: string = "ar"
) {
  return api.put<ApiResponse>(`/lawyer/cases/${caseId}/status/`, {
    status,
    notes
  }, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    lang
  });
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
  const path = `/lawyer/cases/${queryString ? `?${queryString}` : ''}`;

  return api.get<ApiResponse>(path, {
    headers: {
      Authorization: `Bearer ${token}`
    },
    lang
  });
}

// Lawyer visits API functions
export async function getLawyerVisits(
  token: string, 
  params: {
    days?: number;
    status?: string;
    page?: number;
    page_size?: number;
    urgent_only?: boolean;
    case_id?: string;
  }, 
  lang: string
) {
  const searchParams = new URLSearchParams();
  
  if (params.days) searchParams.append('days', params.days.toString());
  if (params.status) searchParams.append('status', params.status);
  if (params.page) searchParams.append('page', params.page.toString());
  if (params.page_size) searchParams.append('page_size', params.page_size.toString());
  if (params.urgent_only !== undefined) searchParams.append('urgent_only', params.urgent_only.toString());
  if (params.case_id) searchParams.append('case_id', params.case_id);

  const queryString = searchParams.toString();
  const path = `/lawyer/dashboard/upcoming-visits/${queryString ? `?${queryString}` : ''}`;

  return api.get<ApiResponse>(path, {
    headers: {
      Authorization: `Bearer ${token}`
    },
    lang
  });
}


// Lawyer visits form options (prisons, visit types)
export async function getVisitFormOptions(
  token: string,
  lang: string
) {
  return api.get<ApiResponse>("/lawyer/visits/form-options/", {
    headers: {
      Authorization: `Bearer ${token}`
    },
    lang
  });
}

// Lawyer case documents API functions
export async function getLawyerCaseDocuments(
  token: string,
  caseId: string,
  lang: string
) {
  return api.get<ApiResponse>(`/lawyer/cases/${caseId}/documents/`, {
    headers: {
      Authorization: `Bearer ${token}`
    },
    lang
  });
}

export async function uploadLawyerCaseDocument(
  token: string,
  caseId: string,
  formData: FormData,
  lang: string
) {
  return api.post<ApiResponse>(`/lawyer/cases/${caseId}/documents/upload/`, formData, {
    headers: {
      Authorization: `Bearer ${token}`
    },
    lang
  });
}

// Visit action API functions
export async function approveVisit(
  token: string,
  visitId: string,
  notes: string,
  lang: string,
  visit_approved_date?: string
) {
  const payload: { notes: string; visit_approved_date?: string } = { notes };
  if (visit_approved_date) {
    payload.visit_approved_date = visit_approved_date;
  }
  
  return api.patch<ApiResponse>(`/lawyer/visits/${visitId}/approve/`, payload, {
    headers: {
      Authorization: `Bearer ${token}`
    },
    lang
  });
}

export async function rejectVisit(
  token: string,
  visitId: string,
  reason: string,
  lang: string
) {
  return api.patch<ApiResponse>(`/lawyer/visits/${visitId}/reject/`, {
    rejection_reason: reason
  }, {
    headers: {
      Authorization: `Bearer ${token}`
    },
    lang
  });
}

export async function completeVisit(
  token: string,
  visitId: string,
  outcome: string,
  lang: string
) {
  return api.patch<ApiResponse>(`/lawyer/visits/${visitId}/complete/`, {
    outcome
  }, {
    headers: {
      Authorization: `Bearer ${token}`
    },
    lang
  });
}


