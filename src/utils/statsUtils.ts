import { StepRecord, DailyStats, WeeklyStats, MonthlyStats, StreakInfo } from '../types';
import { 
  formatDate, 
  formatMonth, 
  getWeekStart, 
  getWeekEnd, 
  getWeekDates, 
  getMonthDates,
  addDays,
  getToday
} from './dateUtils';

export const calculateDailyStats = (
  records: StepRecord[],
  date: string,
  goalSteps: number
): DailyStats => {
  const record = records.find(r => r.date === date);
  const steps = record?.steps || 0;
  const achievementRate = goalSteps > 0 ? Math.round((steps / goalSteps) * 100) : 0;
  
  return {
    date,
    steps,
    goalSteps,
    achievementRate,
    isGoalAchieved: steps >= goalSteps,
  };
};

export const calculateWeeklyStats = (
  records: StepRecord[],
  date: Date,
  goalSteps: number
): WeeklyStats => {
  const weekStart = getWeekStart(date);
  const weekEnd = getWeekEnd(date);
  const weekDates = getWeekDates(date);
  
  let totalSteps = 0;
  let daysRecorded = 0;
  let daysAchieved = 0;
  
  for (const dateStr of weekDates) {
    const record = records.find(r => r.date === dateStr);
    if (record) {
      totalSteps += record.steps;
      daysRecorded++;
      if (record.steps >= goalSteps) {
        daysAchieved++;
      }
    }
  }
  
  return {
    weekStart: formatDate(weekStart),
    weekEnd: formatDate(weekEnd),
    totalSteps,
    averageSteps: daysRecorded > 0 ? Math.round(totalSteps / daysRecorded) : 0,
    daysRecorded,
    daysAchieved,
  };
};

export const calculateMonthlyStats = (
  records: StepRecord[],
  month: string,
  goalSteps: number
): MonthlyStats => {
  const monthDates = getMonthDates(month);
  
  let totalSteps = 0;
  let daysRecorded = 0;
  let daysAchieved = 0;
  
  for (const dateStr of monthDates) {
    const record = records.find(r => r.date === dateStr);
    if (record) {
      totalSteps += record.steps;
      daysRecorded++;
      if (record.steps >= goalSteps) {
        daysAchieved++;
      }
    }
  }
  
  return {
    month,
    totalSteps,
    averageSteps: daysRecorded > 0 ? Math.round(totalSteps / daysRecorded) : 0,
    daysRecorded,
    daysAchieved,
  };
};

export const calculateStreak = (
  records: StepRecord[],
  goalSteps: number
): StreakInfo => {
  if (records.length === 0) {
    return {
      currentStreak: 0,
      longestStreak: 0,
      lastAchievedDate: null,
    };
  }

  // Sort records by date descending
  const sortedRecords = [...records].sort((a, b) => b.date.localeCompare(a.date));
  
  // Find achieved days
  const achievedDates = new Set(
    sortedRecords
      .filter(r => r.steps >= goalSteps)
      .map(r => r.date)
  );

  if (achievedDates.size === 0) {
    return {
      currentStreak: 0,
      longestStreak: 0,
      lastAchievedDate: null,
    };
  }

  // Calculate current streak
  let currentStreak = 0;
  let checkDate = getToday();
  
  // If today is not achieved, check if yesterday was achieved
  if (!achievedDates.has(checkDate)) {
    checkDate = addDays(checkDate, -1);
    // If yesterday also not achieved, current streak is 0
    if (!achievedDates.has(checkDate)) {
      currentStreak = 0;
    }
  }
  
  // Count consecutive days backward
  if (currentStreak === 0 && achievedDates.has(checkDate)) {
    while (achievedDates.has(checkDate)) {
      currentStreak++;
      checkDate = addDays(checkDate, -1);
    }
  } else if (achievedDates.has(getToday())) {
    checkDate = getToday();
    while (achievedDates.has(checkDate)) {
      currentStreak++;
      checkDate = addDays(checkDate, -1);
    }
  }

  // Calculate longest streak
  const sortedDates = Array.from(achievedDates).sort();
  let longestStreak = 0;
  let tempStreak = 1;
  
  for (let i = 1; i < sortedDates.length; i++) {
    const prevDate = sortedDates[i - 1];
    const currDate = sortedDates[i];
    
    if (addDays(prevDate, 1) === currDate) {
      tempStreak++;
    } else {
      longestStreak = Math.max(longestStreak, tempStreak);
      tempStreak = 1;
    }
  }
  longestStreak = Math.max(longestStreak, tempStreak);

  // Find last achieved date
  const lastAchievedDate = sortedDates[sortedDates.length - 1] || null;

  return {
    currentStreak,
    longestStreak,
    lastAchievedDate,
  };
};

export const getChartData = (
  records: StepRecord[],
  dates: string[]
): { date: string; steps: number }[] => {
  return dates.map(date => {
    const record = records.find(r => r.date === date);
    return {
      date,
      steps: record?.steps || 0,
    };
  });
};
