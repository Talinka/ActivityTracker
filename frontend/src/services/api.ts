import {
  ActivityDefinition,
  FinishedActivity,
  ActivitySuggestion,
} from 'models/activities';
import { CurrentStatistics } from 'models/statistics';
import { ApiResponse, HistoryQuery, MarkDoneRequest } from 'models/api';

const API_BASE = import.meta.env.DEV ? 'http://localhost:3000/api' : '/api';

export class ApiService {
  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${API_BASE}${endpoint}`;

    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
      },
      ...options
    });

    const data: ApiResponse<T> = await response.json();

    if (!data.success) {
      throw new Error(data.error || 'API request failed');
    }

    return data.data as T;
  }

  async getActivities(): Promise<ActivityDefinition[]> {
    return this.request<ActivityDefinition[]>('/activities');
  }

  async getSuggestion(): Promise<ActivitySuggestion> {
    return this.request<ActivitySuggestion>('/activities/suggest');
  }

  async markDone(type: string, id: number): Promise<{ message: string }> {
    const requestParams: MarkDoneRequest = { type, id };
    return this.request<{ message: string }>('/activities/done', {
      method: 'POST',
      body: JSON.stringify(requestParams)
    });
  }

  async cancelLastActivity(): Promise<{ message: string }> {
    return this.request<{ message: string }>('/activities/cancelLast', {
      method: 'PUT'
    });
  }

  async getHistory(params?: HistoryQuery): Promise<FinishedActivity[]> {
    const queryString = params
      ? '?' + new URLSearchParams(params as Record<string, string>).toString()
      : '';

    return this.request<FinishedActivity[]>(`/activities/history${queryString}`);
  }

  async getStatistics(): Promise<CurrentStatistics> {
    return this.request<CurrentStatistics>('/current-statistics');
  }
}

export const apiService = new ApiService();