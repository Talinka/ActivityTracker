import { ActivityId, ActivityType } from 'models/activities';

// API Response wrapper
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Activity history query parameters
export interface HistoryQuery {
  startDate?: string;
  endDate?: string;
  type?: ActivityType;
}

// Mark done request
export interface MarkDoneRequest {
  type: ActivityType;
  id: ActivityId;
}