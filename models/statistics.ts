import { ActivityType } from "./activities";

export interface ExercisesStatisticsByTypes {
  [type: ActivityType]: number
}
export interface ExercisesStatistics {
  total: number;
  byType: ExercisesStatisticsByTypes
}

export interface CurrentStatistics {
  week: ExercisesStatistics;
  month: ExercisesStatistics;
  year: ExercisesStatistics;
  streak: number; // Current consecutive days
}

export interface FullStatistics {
  weekly: { [date: string]: ExercisesStatistics };
  monthly: { [month: string]: ExercisesStatistics };
  yearly: { [year: string]: ExercisesStatistics };
}