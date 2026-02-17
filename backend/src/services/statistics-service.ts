import { CurrentStatistics, ExercisesStatistics, ExercisesStatisticsByTypes } from 'models/statistics';
import { dataService } from './data.service';
import { FinishedActivity } from 'models/activities';
export class StatisticsService {
  private history: FinishedActivity[] = [];

  constructor() {
    this.loadData();
  }

  private loadData(): void {
    this.history = dataService.loadHistory();
  }

  public reloadData(): void {
    this.loadData();
  }

  private convertDateToInnerFormat(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  private getExercisesStatistics(activities: FinishedActivity[]): ExercisesStatistics {
    const total: number = activities.length;
    const byType: ExercisesStatisticsByTypes = {};

    for (const activity of activities) {
      byType[activity.type] = (byType[activity.type] || 0) + 1;
    }

    return { total, byType };
  }

  getCurrentStatistics(now = new Date()): CurrentStatistics {
    // Current week statistics
    const thisWeekActivities: FinishedActivity[] = [];
    const dayNumber = (now.getDay() + 6) % 7;

    for (let i = dayNumber; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(now.getDate() - i);
      const dateStr = this.convertDateToInnerFormat(date);
      const activities = this.history.filter(h => h.date === dateStr);
      thisWeekActivities.push(...activities);
    }
    const week = this.getExercisesStatistics(thisWeekActivities);

    // Current month statistics
    const currentMonth = now.getFullYear() + '-' +
      String(now.getMonth() + 1).padStart(2, '0');

    const thisMonthActivities = this.history.filter(h =>
      h.date.startsWith(currentMonth)
    );

    const month = this.getExercisesStatistics(thisMonthActivities);

    // Current year statistics
    const currentYear = now.getFullYear().toString();
    const thisYearActivities = this.history.filter(h =>
      h.date.startsWith(currentYear)
    );

    const year = this.getExercisesStatistics(thisYearActivities);
    const uniqueTrainingDates = new Set(thisYearActivities.map(h => h.date));

    // Calculate current streak
    let streak = 0;
    let consecutiveDays = 1;
    let activitiesCount = 0;
    let streakBroken = false;

    // Check up to 365 days for streak
    for (let i = 0; i < 365 && !streakBroken; i++) {
      const checkDate = new Date(now);
      checkDate.setDate(now.getDate() - i);
      const checkDateStr = this.convertDateToInnerFormat(checkDate);

      const activitiesOnDate = this.history.filter(h => h.date === checkDateStr);
      activitiesCount += activitiesOnDate.length;
      if (activitiesCount >= consecutiveDays) {
        consecutiveDays++;
      } else {
        streakBroken = true;
      }
    }

    streak = consecutiveDays - 1;

    return {
      week,
      month,
      year,
      streak
    };
  }
}

export const statisticsService = new StatisticsService();