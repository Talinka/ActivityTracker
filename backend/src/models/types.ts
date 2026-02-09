export type ActivityType = string;
export type ActivityId = number;

// Activity definition as stored in activities.json
export interface ActivityDefinition {
  type: ActivityType;
  ids: ActivityId[];
}

// Finished activity record in activities-history.json
export interface FinishedActivity {
  date: string; // ISO date (YYYY-MM-DD)
  type: ActivityType;
  id: ActivityId;
  timestamp: number; // Unix timestamp when marked as done
	canceled?: boolean;
}

// Suggested activity for today
export interface ActivitySuggestion {
  type: ActivityType;
  id: ActivityId;
  date: string; // ISO date (YYYY-MM-DD)
}

// Statistics response
export interface Statistics {
  weekly: { [date: string]: number }; // e.g., {"2026-01-24": 1}
  monthly: { [month: string]: { total: number; byType: { [type: string]: number } } };
  yearly: { [year: string]: { total: number; days: number } };
  streak: number; // Current consecutive days
}

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