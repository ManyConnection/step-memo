import {
  calculateDailyStats,
  calculateWeeklyStats,
  calculateMonthlyStats,
  calculateStreak,
  getChartData,
} from '../../src/utils/statsUtils';
import { StepRecord } from '../../src/types';
import * as dateUtils from '../../src/utils/dateUtils';

// Mock getToday to return a fixed date
jest.mock('../../src/utils/dateUtils', () => ({
  ...jest.requireActual('../../src/utils/dateUtils'),
  getToday: jest.fn(() => '2026-02-12'),
}));

describe('statsUtils', () => {
  const mockRecords: StepRecord[] = [
    { id: '1', date: '2026-02-12', steps: 10000, createdAt: '', updatedAt: '' },
    { id: '2', date: '2026-02-11', steps: 8500, createdAt: '', updatedAt: '' },
    { id: '3', date: '2026-02-10', steps: 6000, createdAt: '', updatedAt: '' },
    { id: '4', date: '2026-02-09', steps: 9000, createdAt: '', updatedAt: '' },
    { id: '5', date: '2026-02-08', steps: 5000, createdAt: '', updatedAt: '' },
  ];

  describe('calculateDailyStats', () => {
    it('should calculate stats for a day with record', () => {
      const stats = calculateDailyStats(mockRecords, '2026-02-12', 8000);
      
      expect(stats.date).toBe('2026-02-12');
      expect(stats.steps).toBe(10000);
      expect(stats.goalSteps).toBe(8000);
      expect(stats.achievementRate).toBe(125);
      expect(stats.isGoalAchieved).toBe(true);
    });

    it('should calculate stats for a day without record', () => {
      const stats = calculateDailyStats(mockRecords, '2026-02-07', 8000);
      
      expect(stats.steps).toBe(0);
      expect(stats.achievementRate).toBe(0);
      expect(stats.isGoalAchieved).toBe(false);
    });

    it('should handle zero goal steps', () => {
      const stats = calculateDailyStats(mockRecords, '2026-02-12', 0);
      expect(stats.achievementRate).toBe(0);
    });

    it('should mark as not achieved when below goal', () => {
      const stats = calculateDailyStats(mockRecords, '2026-02-10', 8000);
      expect(stats.steps).toBe(6000);
      expect(stats.achievementRate).toBe(75);
      expect(stats.isGoalAchieved).toBe(false);
    });
  });

  describe('calculateWeeklyStats', () => {
    it('should calculate weekly statistics', () => {
      const date = new Date(2026, 1, 12); // Feb 12, 2026 (Thursday)
      const stats = calculateWeeklyStats(mockRecords, date, 8000);
      
      expect(stats.weekStart).toBe('2026-02-09');
      expect(stats.weekEnd).toBe('2026-02-15');
      expect(stats.daysRecorded).toBe(4); // 9, 10, 11, 12
      expect(stats.daysAchieved).toBe(3); // 9, 11, 12 (steps >= 8000)
    });

    it('should calculate correct totals', () => {
      const date = new Date(2026, 1, 12);
      const stats = calculateWeeklyStats(mockRecords, date, 8000);
      
      // 10000 + 8500 + 6000 + 9000 = 33500
      expect(stats.totalSteps).toBe(33500);
      expect(stats.averageSteps).toBe(Math.round(33500 / 4));
    });

    it('should handle week with no records', () => {
      const date = new Date(2026, 0, 5); // Jan 5, 2026
      const stats = calculateWeeklyStats(mockRecords, date, 8000);
      
      expect(stats.totalSteps).toBe(0);
      expect(stats.averageSteps).toBe(0);
      expect(stats.daysRecorded).toBe(0);
      expect(stats.daysAchieved).toBe(0);
    });
  });

  describe('calculateMonthlyStats', () => {
    it('should calculate monthly statistics', () => {
      const stats = calculateMonthlyStats(mockRecords, '2026-02', 8000);
      
      expect(stats.month).toBe('2026-02');
      expect(stats.daysRecorded).toBe(5);
      expect(stats.daysAchieved).toBe(3); // 12, 11, 9
    });

    it('should calculate correct monthly totals', () => {
      const stats = calculateMonthlyStats(mockRecords, '2026-02', 8000);
      
      // 10000 + 8500 + 6000 + 9000 + 5000 = 38500
      expect(stats.totalSteps).toBe(38500);
      expect(stats.averageSteps).toBe(Math.round(38500 / 5));
    });

    it('should handle month with no records', () => {
      const stats = calculateMonthlyStats(mockRecords, '2026-01', 8000);
      
      expect(stats.totalSteps).toBe(0);
      expect(stats.averageSteps).toBe(0);
      expect(stats.daysRecorded).toBe(0);
    });
  });

  describe('calculateStreak', () => {
    it('should return zeros for empty records', () => {
      const streak = calculateStreak([], 8000);
      
      expect(streak.currentStreak).toBe(0);
      expect(streak.longestStreak).toBe(0);
      expect(streak.lastAchievedDate).toBeNull();
    });

    it('should calculate current streak correctly', () => {
      const records: StepRecord[] = [
        { id: '1', date: '2026-02-12', steps: 8000, createdAt: '', updatedAt: '' },
        { id: '2', date: '2026-02-11', steps: 9000, createdAt: '', updatedAt: '' },
        { id: '3', date: '2026-02-10', steps: 8500, createdAt: '', updatedAt: '' },
      ];
      
      const streak = calculateStreak(records, 8000);
      expect(streak.currentStreak).toBe(3);
    });

    it('should handle streak broken by non-achieved day', () => {
      const records: StepRecord[] = [
        { id: '1', date: '2026-02-12', steps: 8000, createdAt: '', updatedAt: '' },
        { id: '2', date: '2026-02-11', steps: 5000, createdAt: '', updatedAt: '' }, // Not achieved
        { id: '3', date: '2026-02-10', steps: 9000, createdAt: '', updatedAt: '' },
      ];
      
      const streak = calculateStreak(records, 8000);
      expect(streak.currentStreak).toBe(1);
    });

    it('should calculate longest streak', () => {
      const records: StepRecord[] = [
        { id: '1', date: '2026-02-12', steps: 8000, createdAt: '', updatedAt: '' },
        { id: '2', date: '2026-02-08', steps: 9000, createdAt: '', updatedAt: '' },
        { id: '3', date: '2026-02-07', steps: 8500, createdAt: '', updatedAt: '' },
        { id: '4', date: '2026-02-06', steps: 10000, createdAt: '', updatedAt: '' },
        { id: '5', date: '2026-02-05', steps: 8200, createdAt: '', updatedAt: '' },
      ];
      
      const streak = calculateStreak(records, 8000);
      expect(streak.longestStreak).toBe(4); // Feb 5-8
    });

    it('should return last achieved date', () => {
      const records: StepRecord[] = [
        { id: '1', date: '2026-02-10', steps: 8000, createdAt: '', updatedAt: '' },
        { id: '2', date: '2026-02-08', steps: 9000, createdAt: '', updatedAt: '' },
      ];
      
      const streak = calculateStreak(records, 8000);
      expect(streak.lastAchievedDate).toBe('2026-02-10');
    });

    it('should handle no achieved days', () => {
      const records: StepRecord[] = [
        { id: '1', date: '2026-02-12', steps: 5000, createdAt: '', updatedAt: '' },
        { id: '2', date: '2026-02-11', steps: 3000, createdAt: '', updatedAt: '' },
      ];
      
      const streak = calculateStreak(records, 8000);
      expect(streak.currentStreak).toBe(0);
      expect(streak.longestStreak).toBe(0);
      expect(streak.lastAchievedDate).toBeNull();
    });
  });

  describe('getChartData', () => {
    it('should return chart data for given dates', () => {
      const dates = ['2026-02-10', '2026-02-11', '2026-02-12'];
      const data = getChartData(mockRecords, dates);
      
      expect(data).toHaveLength(3);
      expect(data[0]).toEqual({ date: '2026-02-10', steps: 6000 });
      expect(data[1]).toEqual({ date: '2026-02-11', steps: 8500 });
      expect(data[2]).toEqual({ date: '2026-02-12', steps: 10000 });
    });

    it('should return 0 steps for dates without records', () => {
      const dates = ['2026-02-05', '2026-02-06', '2026-02-07'];
      const data = getChartData(mockRecords, dates);
      
      expect(data).toHaveLength(3);
      expect(data.every(d => d.steps === 0)).toBe(true);
    });
  });
});
