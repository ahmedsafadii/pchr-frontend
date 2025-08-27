export interface NotificationCase {
  id: string;
  case_number: string;
  detainee_name: string;
  status: string;
  is_urgent: boolean;
}

export interface Notification {
  id: string;
  content: string;
  content_preview: string;
  message_type: string;
  is_read: boolean;
  is_archived: boolean;
  read_at: string | null;
  created: string;
  updated: string;
  sender: any | null;
  case: NotificationCase;
  attachments_count: number;
  has_attachments: boolean;
}

export interface NotificationPagination {
  current_page: number;
  page_size: number;
  total_items: number;
  total_pages: number;
  has_next: boolean;
  has_previous: boolean;
}

export interface NotificationSummary {
  unread_count: number;
  urgent_count: number;
  total_count: number;
}

export interface NotificationFilters {
  is_read: boolean | null;
  message_type: string;
  search: string;
}

export interface NotificationsResponse {
  status: string;
  data: {
    notifications: Notification[];
    pagination: NotificationPagination;
    summary: NotificationSummary;
    filters_applied: NotificationFilters;
  };
  message: string;
  meta: {
    timestamp: string;
    version: string;
  };
  debug?: any;
}
