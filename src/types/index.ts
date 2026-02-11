export interface StepRecord {
  id: string;
  date: string; // YYYY-MM-DD format
  steps: number;
  createdAt: string;
  updatedAt: string;
}

export interface Settings {
  goalSteps: number;
}

export interface DailyStats {
  date: string;
  steps: number;
  goalSteps: number;
  achievementRate: number;
  isGoalAchieved: boolean;
}

export interface WeeklyStats {
  weekStart: string;
  weekEnd: string;
  totalSteps: number;
  averageSteps: number;
  daysRecorded: number;
  daysAchieved: number;
}

export interface MonthlyStats {
  month: string; // YYYY-MM format
  totalSteps: number;
  averageSteps: number;
  daysRecorded: number;
  daysAchieved: number;
}

export interface StreakInfo {
  currentStreak: number;
  longestStreak: number;
  lastAchievedDate: string | null;
}

export type PeriodType = 'daily' | 'weekly' | 'monthly';
