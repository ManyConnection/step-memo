import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Alert,
} from 'react-native';
import { useFocusEffect } from 'expo-router';
import { ProgressRing } from '../../src/components/ProgressRing';
import { StepInput } from '../../src/components/StepInput';
import { StreakBadge } from '../../src/components/StreakBadge';
import { stepStorage } from '../../src/storage/stepStorage';
import { StepRecord, Settings } from '../../src/types';
import { getToday, formatDisplayDate } from '../../src/utils/dateUtils';
import { calculateStreak } from '../../src/utils/statsUtils';

export default function HomeScreen() {
  const [todayRecord, setTodayRecord] = useState<StepRecord | null>(null);
  const [settings, setSettings] = useState<Settings>({ goalSteps: 8000 });
  const [allRecords, setAllRecords] = useState<StepRecord[]>([]);
  const [isInputModalVisible, setInputModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);
      const [record, settingsData, records] = await Promise.all([
        stepStorage.getRecordByDate(getToday()),
        stepStorage.getSettings(),
        stepStorage.getRecords(),
      ]);
      setTodayRecord(record);
      setSettings(settingsData);
      setAllRecords(records);
    } catch (error) {
      Alert.alert('エラー', 'データの読み込みに失敗しました');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  const handleSaveSteps = async (steps: number) => {
    try {
      const today = getToday();
      const now = new Date().toISOString();
      const record: StepRecord = {
        id: todayRecord?.id || `record_${today}`,
        date: today,
        steps,
        createdAt: todayRecord?.createdAt || now,
        updatedAt: now,
      };
      await stepStorage.saveRecord(record);
      setTodayRecord(record);
      setInputModalVisible(false);
      loadData();
    } catch (error) {
      Alert.alert('エラー', '保存に失敗しました');
    }
  };

  const todaySteps = todayRecord?.steps || 0;
  const goalSteps = settings.goalSteps;
  const progress = goalSteps > 0 ? (todaySteps / goalSteps) * 100 : 0;
  const streakInfo = calculateStreak(allRecords, goalSteps);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>読み込み中...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.dateText}>{formatDisplayDate(getToday())}</Text>

      <View style={styles.progressContainer}>
        <ProgressRing
          progress={progress}
          steps={todaySteps}
          goal={goalSteps}
          size={220}
        />
      </View>

      <TouchableOpacity
        testID="record-button"
        style={styles.recordButton}
        onPress={() => setInputModalVisible(true)}
      >
        <Text style={styles.recordButtonText}>
          {todayRecord ? '歩数を更新' : '歩数を記録'}
        </Text>
      </TouchableOpacity>

      <View style={styles.streakContainer}>
        <StreakBadge
          currentStreak={streakInfo.currentStreak}
          longestStreak={streakInfo.longestStreak}
        />
      </View>

      {progress >= 100 && (
        <View style={styles.achievementBanner} testID="achievement-banner">
          <Text style={styles.achievementText}>🎉 目標達成！おめでとうございます！</Text>
        </View>
      )}

      <Modal
        visible={isInputModalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setInputModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <StepInput
              initialValue={todaySteps}
              onSave={handleSaveSteps}
              onCancel={() => setInputModalVisible(false)}
            />
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  content: {
    padding: 20,
    alignItems: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 20,
  },
  progressContainer: {
    marginBottom: 30,
  },
  recordButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 16,
    paddingHorizontal: 48,
    borderRadius: 30,
    marginBottom: 24,
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  recordButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  streakContainer: {
    width: '100%',
    marginBottom: 20,
  },
  achievementBanner: {
    backgroundColor: '#E8F5E9',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    width: '100%',
  },
  achievementText: {
    color: '#4CAF50',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: 'transparent',
  },
});
