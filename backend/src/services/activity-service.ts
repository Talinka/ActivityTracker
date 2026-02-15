import { ActivityDefinition, FinishedActivity, ActivitySuggestion } from 'models/activities';
import { dataService } from './data.service';

export class ActivityService {
  private activities: ActivityDefinition[] = [];
  private history: FinishedActivity[] = [];

  constructor() {
    this.loadData();
  }

  private loadData(): void {
    this.activities = dataService.loadActivities();
    this.history = dataService.loadHistory();
  }

  public reloadData(): void {
    this.loadData();
  }

  suggestActivity(): ActivitySuggestion {
    const today = new Date();
    const dateString = today.toISOString().split('T')[0];

    // Get last activity from history
    const filteredHistory = this.history.filter(h => !h.canceled);
    const lastActivity = filteredHistory[filteredHistory.length - 1];

    // Find current type index
    let lastActivityTypeIndex = lastActivity
      ? this.activities.findIndex(a => a.type === lastActivity.type)
      : -1;
    
    // Move to next type (circular)
    const currentTypeIndex = (lastActivityTypeIndex + 1) % this.activities.length;
    const currentType = this.activities[currentTypeIndex];

    // Find next ID for this type
    const lastIdForType = this.history
      .filter(h => h.type === currentType.type && h.timestamp > 0)
      .map(h => h.id)
      .pop();

    const currentIndex = lastIdForType !== undefined
      ? currentType.ids.indexOf(lastIdForType)
      : -1;

    const nextIndex = (currentIndex + 1) % currentType.ids.length;
    const nextId = currentType.ids[nextIndex];

    return {
      type: currentType.type,
      id: nextId,
      date: dateString
    };
  }

  markDone(type: string, id: number): void {
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];

    // create new completed activity
    const activity: FinishedActivity = {
      date: todayStr,
      type: type,
      id: id,
      timestamp: today.getTime()
    };
    dataService.appendToHistory(activity);

    this.reloadData();
  }

  cancelLastActivity(): void {
    // Get last activity from history
    const lastActivity = this.history.pop();
    if (!lastActivity || lastActivity.canceled) {
      return;
    }

    lastActivity.canceled = true;
    this.history.push(lastActivity);
    dataService.saveHistory(this.history);

    this.reloadData();
  }

  getAllActivities(): ActivityDefinition[] {
    return [...this.activities];
  }

  getHistory(startDate?: string, endDate?: string, type?: string): FinishedActivity[] {
    let filtered = [...this.history];

    if (startDate) {
      filtered = filtered.filter(h => h.date >= startDate);
    }

    if (endDate) {
      filtered = filtered.filter(h => h.date <= endDate);
    }

    if (type) {
      filtered = filtered.filter(h => h.type === type);
    }

    // Sort by timestamp desc
    return filtered.sort((a, b) => b.timestamp - a.timestamp);
  }
}

export const activityService = new ActivityService();