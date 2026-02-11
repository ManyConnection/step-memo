export const formatDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const formatMonth = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
};

export const parseDate = (dateStr: string): Date => {
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day);
};

export const getToday = (): string => {
  return formatDate(new Date());
};

export const getWeekStart = (date: Date): Date => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d;
};

export const getWeekEnd = (date: Date): Date => {
  const start = getWeekStart(date);
  const end = new Date(start);
  end.setDate(end.getDate() + 6);
  return end;
};

export const getDaysInMonth = (year: number, month: number): number => {
  return new Date(year, month + 1, 0).getDate();
};

export const getMonthDates = (month: string): string[] => {
  const [year, monthNum] = month.split('-').map(Number);
  const daysInMonth = getDaysInMonth(year, monthNum - 1);
  const dates: string[] = [];
  
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, monthNum - 1, day);
    dates.push(formatDate(date));
  }
  
  return dates;
};

export const getWeekDates = (date: Date): string[] => {
  const start = getWeekStart(date);
  const dates: string[] = [];
  
  for (let i = 0; i < 7; i++) {
    const d = new Date(start);
    d.setDate(d.getDate() + i);
    dates.push(formatDate(d));
  }
  
  return dates;
};

export const getDayOfWeek = (dateStr: string): string => {
  const days = ['日', '月', '火', '水', '木', '金', '土'];
  const date = parseDate(dateStr);
  return days[date.getDay()];
};

export const formatDisplayDate = (dateStr: string): string => {
  const date = parseDate(dateStr);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const dayOfWeek = getDayOfWeek(dateStr);
  return `${month}/${day}(${dayOfWeek})`;
};

export const formatDisplayMonth = (month: string): string => {
  const [year, monthNum] = month.split('-').map(Number);
  return `${year}年${monthNum}月`;
};

export const addDays = (dateStr: string, days: number): string => {
  const date = parseDate(dateStr);
  date.setDate(date.getDate() + days);
  return formatDate(date);
};

export const isToday = (dateStr: string): boolean => {
  return dateStr === getToday();
};

export const isYesterday = (dateStr: string): boolean => {
  return dateStr === addDays(getToday(), -1);
};
