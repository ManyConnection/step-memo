import {
  formatDate,
  formatMonth,
  parseDate,
  getToday,
  getWeekStart,
  getWeekEnd,
  getDaysInMonth,
  getMonthDates,
  getWeekDates,
  getDayOfWeek,
  formatDisplayDate,
  formatDisplayMonth,
  addDays,
  isToday,
  isYesterday,
} from '../../src/utils/dateUtils';

describe('dateUtils', () => {
  describe('formatDate', () => {
    it('should format date as YYYY-MM-DD', () => {
      const date = new Date(2026, 1, 12); // Feb 12, 2026
      expect(formatDate(date)).toBe('2026-02-12');
    });

    it('should pad single digit months and days', () => {
      const date = new Date(2026, 0, 5); // Jan 5, 2026
      expect(formatDate(date)).toBe('2026-01-05');
    });
  });

  describe('formatMonth', () => {
    it('should format date as YYYY-MM', () => {
      const date = new Date(2026, 1, 12);
      expect(formatMonth(date)).toBe('2026-02');
    });
  });

  describe('parseDate', () => {
    it('should parse YYYY-MM-DD string to Date', () => {
      const date = parseDate('2026-02-12');
      expect(date.getFullYear()).toBe(2026);
      expect(date.getMonth()).toBe(1); // 0-indexed
      expect(date.getDate()).toBe(12);
    });
  });

  describe('getToday', () => {
    it('should return today in YYYY-MM-DD format', () => {
      const today = getToday();
      expect(today).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });
  });

  describe('getWeekStart', () => {
    it('should return Monday of the week', () => {
      // Feb 12, 2026 is Thursday
      const date = new Date(2026, 1, 12);
      const weekStart = getWeekStart(date);
      expect(formatDate(weekStart)).toBe('2026-02-09'); // Monday
    });

    it('should handle Sunday correctly', () => {
      // Feb 15, 2026 is Sunday
      const date = new Date(2026, 1, 15);
      const weekStart = getWeekStart(date);
      expect(formatDate(weekStart)).toBe('2026-02-09'); // Previous Monday
    });
  });

  describe('getWeekEnd', () => {
    it('should return Sunday of the week', () => {
      const date = new Date(2026, 1, 12); // Thursday
      const weekEnd = getWeekEnd(date);
      expect(formatDate(weekEnd)).toBe('2026-02-15'); // Sunday
    });
  });

  describe('getDaysInMonth', () => {
    it('should return correct days for February 2026', () => {
      expect(getDaysInMonth(2026, 1)).toBe(28);
    });

    it('should return correct days for leap year February', () => {
      expect(getDaysInMonth(2024, 1)).toBe(29);
    });

    it('should return correct days for January', () => {
      expect(getDaysInMonth(2026, 0)).toBe(31);
    });
  });

  describe('getMonthDates', () => {
    it('should return all dates in a month', () => {
      const dates = getMonthDates('2026-02');
      expect(dates).toHaveLength(28);
      expect(dates[0]).toBe('2026-02-01');
      expect(dates[27]).toBe('2026-02-28');
    });
  });

  describe('getWeekDates', () => {
    it('should return 7 dates starting from Monday', () => {
      const date = new Date(2026, 1, 12); // Thursday
      const dates = getWeekDates(date);
      expect(dates).toHaveLength(7);
      expect(dates[0]).toBe('2026-02-09'); // Monday
      expect(dates[6]).toBe('2026-02-15'); // Sunday
    });
  });

  describe('getDayOfWeek', () => {
    it('should return Japanese day of week', () => {
      expect(getDayOfWeek('2026-02-09')).toBe('月');
      expect(getDayOfWeek('2026-02-12')).toBe('木');
      expect(getDayOfWeek('2026-02-15')).toBe('日');
    });
  });

  describe('formatDisplayDate', () => {
    it('should format date for display', () => {
      const result = formatDisplayDate('2026-02-12');
      expect(result).toBe('2/12(木)');
    });
  });

  describe('formatDisplayMonth', () => {
    it('should format month for display', () => {
      expect(formatDisplayMonth('2026-02')).toBe('2026年2月');
    });
  });

  describe('addDays', () => {
    it('should add positive days', () => {
      expect(addDays('2026-02-12', 3)).toBe('2026-02-15');
    });

    it('should subtract days with negative value', () => {
      expect(addDays('2026-02-12', -5)).toBe('2026-02-07');
    });

    it('should handle month boundary', () => {
      expect(addDays('2026-02-28', 2)).toBe('2026-03-02');
    });
  });

  describe('isToday', () => {
    it('should return true for today', () => {
      const today = getToday();
      expect(isToday(today)).toBe(true);
    });

    it('should return false for other dates', () => {
      expect(isToday('2020-01-01')).toBe(false);
    });
  });

  describe('isYesterday', () => {
    it('should return true for yesterday', () => {
      const yesterday = addDays(getToday(), -1);
      expect(isYesterday(yesterday)).toBe(true);
    });

    it('should return false for today', () => {
      expect(isYesterday(getToday())).toBe(false);
    });
  });
});
