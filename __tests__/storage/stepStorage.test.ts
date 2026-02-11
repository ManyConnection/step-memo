import AsyncStorage from '@react-native-async-storage/async-storage';
import { stepStorage } from '../../src/storage/stepStorage';
import { StepRecord, Settings } from '../../src/types';

describe('stepStorage', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
  });

  describe('getRecords', () => {
    it('should return empty array when no records exist', async () => {
      const records = await stepStorage.getRecords();
      expect(records).toEqual([]);
    });

    it('should return stored records', async () => {
      const testRecords: StepRecord[] = [
        {
          id: 'record_2026-02-12',
          date: '2026-02-12',
          steps: 8500,
          createdAt: '2026-02-12T10:00:00.000Z',
          updatedAt: '2026-02-12T10:00:00.000Z',
        },
      ];
      await AsyncStorage.setItem('@step_memo_records', JSON.stringify(testRecords));
      
      const records = await stepStorage.getRecords();
      expect(records).toEqual(testRecords);
    });
  });

  describe('saveRecord', () => {
    it('should save a new record', async () => {
      const record: StepRecord = {
        id: 'record_2026-02-12',
        date: '2026-02-12',
        steps: 8500,
        createdAt: '2026-02-12T10:00:00.000Z',
        updatedAt: '2026-02-12T10:00:00.000Z',
      };
      
      await stepStorage.saveRecord(record);
      const records = await stepStorage.getRecords();
      
      expect(records).toHaveLength(1);
      expect(records[0]).toEqual(record);
    });

    it('should update existing record for same date', async () => {
      const record1: StepRecord = {
        id: 'record_2026-02-12',
        date: '2026-02-12',
        steps: 5000,
        createdAt: '2026-02-12T08:00:00.000Z',
        updatedAt: '2026-02-12T08:00:00.000Z',
      };
      const record2: StepRecord = {
        id: 'record_2026-02-12',
        date: '2026-02-12',
        steps: 10000,
        createdAt: '2026-02-12T08:00:00.000Z',
        updatedAt: '2026-02-12T18:00:00.000Z',
      };
      
      await stepStorage.saveRecord(record1);
      await stepStorage.saveRecord(record2);
      const records = await stepStorage.getRecords();
      
      expect(records).toHaveLength(1);
      expect(records[0].steps).toBe(10000);
    });

    it('should sort records by date descending', async () => {
      const records: StepRecord[] = [
        { id: '1', date: '2026-02-10', steps: 5000, createdAt: '', updatedAt: '' },
        { id: '2', date: '2026-02-12', steps: 8000, createdAt: '', updatedAt: '' },
        { id: '3', date: '2026-02-11', steps: 7000, createdAt: '', updatedAt: '' },
      ];
      
      for (const record of records) {
        await stepStorage.saveRecord(record);
      }
      
      const stored = await stepStorage.getRecords();
      expect(stored[0].date).toBe('2026-02-12');
      expect(stored[1].date).toBe('2026-02-11');
      expect(stored[2].date).toBe('2026-02-10');
    });
  });

  describe('getRecordByDate', () => {
    it('should return null when no record exists for date', async () => {
      const record = await stepStorage.getRecordByDate('2026-02-12');
      expect(record).toBeNull();
    });

    it('should return record for specific date', async () => {
      const testRecord: StepRecord = {
        id: 'record_2026-02-12',
        date: '2026-02-12',
        steps: 8500,
        createdAt: '2026-02-12T10:00:00.000Z',
        updatedAt: '2026-02-12T10:00:00.000Z',
      };
      await stepStorage.saveRecord(testRecord);
      
      const record = await stepStorage.getRecordByDate('2026-02-12');
      expect(record).toEqual(testRecord);
    });
  });

  describe('deleteRecord', () => {
    it('should delete record by date', async () => {
      const record: StepRecord = {
        id: 'record_2026-02-12',
        date: '2026-02-12',
        steps: 8500,
        createdAt: '',
        updatedAt: '',
      };
      await stepStorage.saveRecord(record);
      
      await stepStorage.deleteRecord('2026-02-12');
      const records = await stepStorage.getRecords();
      
      expect(records).toHaveLength(0);
    });

    it('should only delete the specified record', async () => {
      const records: StepRecord[] = [
        { id: '1', date: '2026-02-10', steps: 5000, createdAt: '', updatedAt: '' },
        { id: '2', date: '2026-02-11', steps: 8000, createdAt: '', updatedAt: '' },
        { id: '3', date: '2026-02-12', steps: 7000, createdAt: '', updatedAt: '' },
      ];
      for (const record of records) {
        await stepStorage.saveRecord(record);
      }
      
      await stepStorage.deleteRecord('2026-02-11');
      const stored = await stepStorage.getRecords();
      
      expect(stored).toHaveLength(2);
      expect(stored.find(r => r.date === '2026-02-11')).toBeUndefined();
    });
  });

  describe('getSettings', () => {
    it('should return default settings when none exist', async () => {
      const settings = await stepStorage.getSettings();
      expect(settings).toEqual({ goalSteps: 8000 });
    });

    it('should return stored settings', async () => {
      const testSettings: Settings = { goalSteps: 10000 };
      await AsyncStorage.setItem('@step_memo_settings', JSON.stringify(testSettings));
      
      const settings = await stepStorage.getSettings();
      expect(settings).toEqual(testSettings);
    });
  });

  describe('saveSettings', () => {
    it('should save settings', async () => {
      const testSettings: Settings = { goalSteps: 12000 };
      
      await stepStorage.saveSettings(testSettings);
      const settings = await stepStorage.getSettings();
      
      expect(settings).toEqual(testSettings);
    });

    it('should overwrite existing settings', async () => {
      await stepStorage.saveSettings({ goalSteps: 8000 });
      await stepStorage.saveSettings({ goalSteps: 15000 });
      
      const settings = await stepStorage.getSettings();
      expect(settings.goalSteps).toBe(15000);
    });
  });

  describe('clearAllData', () => {
    it('should clear all data', async () => {
      await stepStorage.saveRecord({
        id: '1',
        date: '2026-02-12',
        steps: 8000,
        createdAt: '',
        updatedAt: '',
      });
      await stepStorage.saveSettings({ goalSteps: 10000 });
      
      await stepStorage.clearAllData();
      
      const records = await stepStorage.getRecords();
      const settings = await stepStorage.getSettings();
      
      expect(records).toEqual([]);
      expect(settings).toEqual({ goalSteps: 8000 }); // Returns default
    });
  });
});
