import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useFocusEffect } from 'expo-router';
import { StepChart } from '../../src/components/StepChart';
import { stepStorage } from '../../src/storage/stepStorage';
import { StepRecord, Settings, PeriodType } from '../../src/types';
import {
  getToday,
  getWeekDates,
  getMonthDates,
  formatMonth,
  formatDisplayMonth,
  parseDate,
} from '../../src/utils/dateUtils';
import {
  calculateWeeklyStats,
  calculateMonthlyStats,
  getChartData,
} from '../../src/utils/statsUtils';

export default function StatsScreen() {
  const [records, setRecords] = useState<StepRecord[]>([]);
  const [settings, setSettings] = useState<Settings>({ goalSteps: 8000 });
  const [periodType, setPeriodType] = useState<PeriodType>('weekly');
  const [isLoading, setIsLoading] = useState(true);

  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);
      const [recordsData, settingsData] = await Promise.all([
        stepStorage.getRecords(),
        stepStorage.getSettings(),
      ]);
      setRecords(recordsData);
      setSettings(settingsData);
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

  const today = new Date();
  const currentMonth = formatMonth(today);
  const weekDates = getWeekDates(today);
  const monthDates = getMonthDates(currentMonth);

  const weeklyStats = calculateWeeklyStats(records, today, settings.goalSteps);
  const monthlyStats = calculateMonthlyStats(records, currentMonth, settings.goalSteps);

  const chartDates = periodType === 'weekly' ? weekDates : monthDates.slice(-14);
  const chartData = getChartData(records, chartDates);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>読み込み中...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Period Selector */}
      <View style={styles.periodSelector}>
        <TouchableOpacity
          testID="period-weekly"
          style={[
            styles.periodButton,
            periodType === 'weekly' && styles.periodButtonActive,
          ]}
          onPress={() => setPeriodType('weekly')}
        >
          <Text
            style={[
              styles.periodButtonText,
              periodType === 'weekly' && styles.periodButtonTextActive,
            ]}
          >
            週間
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          testID="period-monthly"
          style={[
            styles.periodButton,
            periodType === 'monthly' && styles.periodButtonActive,
          ]}
          onPress={() => setPeriodType('monthly')}
        >
          <Text
            style={[
              styles.periodButtonText,
              periodType === 'monthly' && styles.periodButtonTextActive,
            ]}
          >
            月間
          </Text>
        </TouchableOpacity>
      </View>

      {/* Chart */}
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>
          {periodType === 'weekly' ? '今週の歩数' : formatDisplayMonth(currentMonth)}
        </Text>
        <StepChart
          data={chartData}
          goalSteps={settings.goalSteps}
          showLabels={periodType === 'weekly'}
        />
      </View>

      {/* Stats Summary */}
      <View style={styles.summaryContainer}>
        <Text style={styles.summaryTitle}>
          {periodType === 'weekly' ? '週間サマリー' : '月間サマリー'}
        </Text>
        
        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Text style={styles.statValue} testID="total-steps">
              {(periodType === 'weekly'
                ? weeklyStats.totalSteps
                : monthlyStats.totalSteps
              ).toLocaleString()}
            </Text>
            <Text style={styles.statLabel}>合計歩数</Text>
          </View>
          
          <View style={styles.statItem}>
            <Text style={styles.statValue} testID="average-steps">
              {(periodType === 'weekly'
                ? weeklyStats.averageSteps
                : monthlyStats.averageSteps
              ).toLocaleString()}
            </Text>
            <Text style={styles.statLabel}>平均歩数</Text>
          </View>
          
          <View style={styles.statItem}>
            <Text style={styles.statValue} testID="days-recorded">
              {periodType === 'weekly'
                ? weeklyStats.daysRecorded
                : monthlyStats.daysRecorded}
            </Text>
            <Text style={styles.statLabel}>記録日数</Text>
          </View>
          
          <View style={styles.statItem}>
            <Text style={[styles.statValue, styles.achievedValue]} testID="days-achieved">
              {periodType === 'weekly'
                ? weeklyStats.daysAchieved
                : monthlyStats.daysAchieved}
            </Text>
            <Text style={styles.statLabel}>目標達成日</Text>
          </View>
        </View>
      </View>

      {/* Goal Info */}
      <View style={styles.goalInfo}>
        <Text style={styles.goalInfoText}>
          現在の目標: {settings.goalSteps.toLocaleString()}歩/日
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  content: {
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  periodSelector: {
    flexDirection: 'row',
    backgroundColor: '#E0E0E0',
    borderRadius: 8,
    padding: 4,
    marginBottom: 20,
  },
  periodButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 6,
  },
  periodButtonActive: {
    backgroundColor: '#fff',
  },
  periodButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  periodButtonTextActive: {
    color: '#4CAF50',
  },
  chartContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  summaryContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  statItem: {
    width: '50%',
    alignItems: 'center',
    paddingVertical: 12,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  achievedValue: {
    color: '#4CAF50',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  goalInfo: {
    backgroundColor: '#E8F5E9',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  goalInfoText: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: '500',
  },
});
