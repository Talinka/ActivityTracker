import { FinishedActivity, Statistics } from '../models/types';
import { dataService } from './data.service';

export class StatisticsService {
  private history: FinishedActivity[] = [];

  constructor() {
    this.loadData();
  }

  private loadData(): void {
    this.history = dataService.loadHistory();
  }

  getStatistics(): Statistics {
    const now = new Date();
    const today = now.toISOString().split('T')[0];

    // Weekly statistics (last 7 days)
    const weekly: { [date: string]: number } = {};
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(now.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];

        const count = this.history.filter(h => h.date === dateStr).length;
        weekly[dateStr] = count;
		}

    // Monthly statistics (current month)
    const currentMonth = now.getFullYear() + '-' +
      String(now.getMonth() + 1).padStart(2, '0');

    const thisMonthActivities = this.history.filter(h =>
      h.date.startsWith(currentMonth)
    );

    const monthly: { [month: string]: { total: number; byType: { [type: string]: number } } } = {};
    monthly[currentMonth] = { total: thisMonthActivities.length, byType: {} };

    thisMonthActivities.forEach(activity => {
      monthly[currentMonth].byType[activity.type] =
        (monthly[currentMonth].byType[activity.type] || 0) + 1;
    });

    // Yearly statistics (current year)
    const currentYear = now.getFullYear().toString();
    const thisYearActivities = this.history.filter(h =>
      h.date.startsWith(currentYear)
    );

    const yearly: { [year: string]: { total: number; days: number } } = {};
    const uniqueTrainingDates = new Set(thisYearActivities.map(h => h.date));

    yearly[currentYear] = {
      total: thisYearActivities.length,
      days: uniqueTrainingDates.size
    };

    // Calculate current streak
    let streak = 0;
    let currentDate = new Date();

    // Don't include today in streak calculation
    if (currentDate.toISOString().split('T')[0] === today &&
        this.history.some(h => h.date === today)) {
      streak = 0; // Today is marked but we'll continue from yesterday
    }

    // Start from yesterday and work backwards
    currentDate.setDate(currentDate.getDate() - 1);

    let consecutiveDays = 0;
    let streakBroken = false;

    // Check up to 365 days for streak
    for (let i = 0; i < 365 && !streakBroken; i++) {
      const checkDate = new Date(currentDate);
      checkDate.setDate(currentDate.getDate() - i);
      const checkDateStr = checkDate.toISOString().split('T')[0];

      const activitiesOnDate = this.history.filter(h => h.date === checkDateStr);

      if (activitiesOnDate.length > 0) {
        consecutiveDays++;
      } else {
        streakBroken = true;
      }
    }

    streak = consecutiveDays;

    return {
      weekly,
      monthly,
      yearly,
      streak
    };
  }
}

export const statisticsService = new StatisticsService();