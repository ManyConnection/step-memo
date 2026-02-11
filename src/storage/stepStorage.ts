import AsyncStorage from '@react-native-async-storage/async-storage';
import { StepRecord, Settings } from '../types';

const STEPS_KEY = '@step_memo_records';
const SETTINGS_KEY = '@step_memo_settings';

const DEFAULT_SETTINGS: Settings = {
  goalSteps: 8000,
};

export const stepStorage = {
  async getRecords(): Promise<StepRecord[]> {
    try {
      const json = await AsyncStorage.getItem(STEPS_KEY);
      if (!json) return [];
      return JSON.parse(json) as StepRecord[];
    } catch (error) {
      console.error('Failed to get step records:', error);
      return [];
    }
  },

  async saveRecord(record: StepRecord): Promise<void> {
    try {
      const records = await this.getRecords();
      const existingIndex = records.findIndex(r => r.date === record.date);
      
      if (existingIndex >= 0) {
        records[existingIndex] = record;
      } else {
        records.push(record);
      }
      
      records.sort((a, b) => b.date.localeCompare(a.date));
      await AsyncStorage.setItem(STEPS_KEY, JSON.stringify(records));
    } catch (error) {
      console.error('Failed to save step record:', error);
      throw error;
    }
  },

  async getRecordByDate(date: string): Promise<StepRecord | null> {
    try {
      const records = await this.getRecords();
      return records.find(r => r.date === date) || null;
    } catch (error) {
      console.error('Failed to get record by date:', error);
      return null;
    }
  },

  async deleteRecord(date: string): Promise<void> {
    try {
      const records = await this.getRecords();
      const filtered = records.filter(r => r.date !== date);
      await AsyncStorage.setItem(STEPS_KEY, JSON.stringify(filtered));
    } catch (error) {
      console.error('Failed to delete record:', error);
      throw error;
    }
  },

  async getSettings(): Promise<Settings> {
    try {
      const json = await AsyncStorage.getItem(SETTINGS_KEY);
      if (!json) return DEFAULT_SETTINGS;
      return { ...DEFAULT_SETTINGS, ...JSON.parse(json) };
    } catch (error) {
      console.error('Failed to get settings:', error);
      return DEFAULT_SETTINGS;
    }
  },

  async saveSettings(settings: Settings): Promise<void> {
    try {
      await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    } catch (error) {
      console.error('Failed to save settings:', error);
      throw error;
    }
  },

  async clearAllData(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([STEPS_KEY, SETTINGS_KEY]);
    } catch (error) {
      console.error('Failed to clear data:', error);
      throw error;
    }
  },
};
