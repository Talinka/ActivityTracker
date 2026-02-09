// Activity definition
export interface ActivityDefinition {
  type: string;
  ids: number[];
}

// Finished activity record
export interface FinishedActivity {
  date: string;
  type: string;
  id: number;
  timestamp: number;
	canceled?: boolean;
}

// Suggested activity for today
export interface ActivitySuggestion {
  type: string;
  id: number;
  date: string;
}

// Statistics response
export interface Statistics {
  weekly: { [date: string]: number };
  monthly: { [month: string]: { total: number; byType: { [type: string]: number } } };
  yearly: { [year: string]: { total: number; days: number } };
  streak: number;
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
  type?: string;
}

// Mark done request
export interface MarkDoneRequest {
  skip?: boolean;
}