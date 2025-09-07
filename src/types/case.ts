export interface CaseData {
  id: string;
  case_number: string;
  detainee_name: string;
  detainee_id: string;
  detainee_date_of_birth: string;
  client_name: string;
  client_id?: string;
  client_phone: string;
  client_whatsapp?: string;
  client_relationship: string;
  status: string;
  status_display: string;
  is_urgent: boolean;
  detention_date: string;
  detention_circumstances: string;
  created: string;
  updated: string;
  detainee_job: string;
  detainee_health_status: string;
  detainee_street?: string;
  detainee_district?: { name?: string } | null;
  detainee_locality?: string | { name?: string } | null;
  detainee_governorate?: string | { name?: string } | null;
  detainee_marital_status_display?: string;
  detainee_gender_display?: string;
  detainee_gender?: string;
  // Disappearance-specific fields (optional to be resilient to API variations)
  disappearance_status?: string;
  disappearance_status_display?: string;
  detention_street?: string;
  detention_district?: { name?: string } | null;
  detention_locality?: { name?: string } | null;
  detention_governorate?: { name?: string } | null;
  detainee_marital_status: string | null;
  detention_full_address?: string;
  detainee_full_address?: string;
}

// Alias for backward compatibility
export type Case = CaseData;

export interface PaginationInfo {
  current_page: number;
  page_size: number;
  total_pages: number;
  total_count: number;
}

export interface LawyerMessageData {
  id: string;
  case_info: {
    id: string;
    case_number: string;
    detainee_name: string;
    client_name: string;
    client_phone: string;
    status: string;
    status_display: string;
    assigned_lawyer_name: string;
    created: string;
  };
  sender: {
    id: string;
    email: string;
    full_name: string;
    role: string;
  } | null;
  recipient: {
    id: string;
    email: string;
    full_name: string;
    role: string;
  } | null;
  content: string;
  message_type: "notification" | "system" | "lawyer" | "client";
  message_type_display: string;
  is_read: boolean;
  is_archived: boolean;
  attachments: Array<{
    id: string;
    file_name: string;
    file_url: string;
    file_size: number;
    file_size_formatted: string;
    document_type: string;
    created: string;
  }>;
  has_attachments: boolean;
  created: string;
  updated: string;
  read_at: string | null;
  read_by: string | null;
  case_timeline: {
    case_number: string;
    detainee_name: string;
    client_name: string;
    status: string;
    assigned_lawyer: string;
    created_date: string;
    visits_count: number;
    documents_count: number;
    messages_count: number;
  };
}

export interface Visit {
  id: string;
  case_id: string;
  visit_date: string;
  visit_type: string;
  visit_type_display: string;
  visit_status: string;
  visit_status_display: string;
  visit_outcome: string;
  visit_outcome_display: string;
  visit_notes: string;
  visit_location: string;
  visit_duration: number;
  visit_duration_display: string;
  visit_attachments: Array<{
    id: string;
    file_name: string;
    file_url: string;
    file_size: number;
    file_size_formatted: string;
    document_type: string;
    created: string;
  }>;
  has_attachments: boolean;
  created: string;
  updated: string;
  created_by: string;
  updated_by: string;
}

export interface UpcomingVisit {
  id: string;
  case_id: string;
  title: string;
  case_number: string;
  detainee_name: string;
  visit_date: string;
  visit_approved_date: string | null;
  visit_time: string | null;
  visit_type: string;
  status: string;
  is_urgent: boolean;
  prison_name: string;
}
