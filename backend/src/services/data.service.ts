import * as fs from 'fs';
import * as path from 'path';
import { ActivityDefinition, FinishedActivity } from '../models/types';
import { env } from 'process';

export class DataService {
  private activitiesFile: string;
  private historyFile: string;

  constructor() {
    const dataDir = env.EXERCIZE_TRACKER_DATA_DIR ?? path.join(__dirname, '../../../data');
    this.activitiesFile = path.join(dataDir, 'activities.json');
    this.historyFile = path.join(dataDir, 'activities-history.json');
    // Ensure data directory exists
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    // Ensure activities.json exists with default data
    if (!fs.existsSync(this.activitiesFile)) {
      this.saveActivities([
        {
          type: "stretching",
          ids: [12, 14, 16, 18]
        },
        {
          type: "fitness",
          ids: [1, 3, 5, 7]
        }
      ]);
    }

    // Ensure activities-history.json exists as empty array
    if (!fs.existsSync(this.historyFile)) {
      this.saveHistory([]);
    }
  }

  loadActivities(): ActivityDefinition[] {
    try {
      const data = fs.readFileSync(this.activitiesFile, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Error loading activities:', error);
      return [];
    }
  }

  loadHistory(): FinishedActivity[] {
		
    try {
      const data = fs.readFileSync(this.historyFile, 'utf8');
			console.log("loadHistory", data);
      return JSON.parse(data);
    } catch (error) {
      console.error('Error loading history:', error);
      return [];
    }
  }

  saveActivities(activities: ActivityDefinition[]): void {
    try {
      fs.writeFileSync(this.activitiesFile, JSON.stringify(activities, null, 2));
    } catch (error) {
      console.error('Error saving activities:', error);
      throw new Error('Failed to save activities');
    }
  }

  saveHistory(history: FinishedActivity[]): void {
		console.log("Save history", history);
    try {
      fs.writeFileSync(this.historyFile, JSON.stringify(history, null, 2));
    } catch (error) {
      console.error('Error saving history:', error);
      throw new Error('Failed to save history');
    }
  }

  appendToHistory(activity: FinishedActivity): void {
    const history = this.loadHistory();
    history.push(activity);
    this.saveHistory(history);
  }
}

export const dataService = new DataService();
