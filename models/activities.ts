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