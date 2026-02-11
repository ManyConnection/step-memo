import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useFocusEffect } from 'expo-router';
import { stepStorage } from '../../src/storage/stepStorage';
import { Settings } from '../../src/types';

const GOAL_PRESETS = [5000, 6000, 8000, 10000, 12000, 15000];

export default function SettingsScreen() {
  const [settings, setSettings] = useState<Settings>({ goalSteps: 8000 });
  const [customGoal, setCustomGoal] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);
      const settingsData = await stepStorage.getSettings();
      setSettings(settingsData);
      setCustomGoal(settingsData.goalSteps.toString());
    } catch (error) {
      Alert.alert('エラー', '設定の読み込みに失敗しました');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  const handlePresetSelect = async (goal: number) => {
    try {
      const newSettings = { ...settings, goalSteps: goal };
      await stepStorage.saveSettings(newSettings);
      setSettings(newSettings);
      setCustomGoal(goal.toString());
      Alert.alert('保存完了', `目標歩数を${goal.toLocaleString()}歩に設定しました`);
    } catch (error) {
      Alert.alert('エラー', '設定の保存に失敗しました');
    }
  };

  const handleCustomGoalSave = async () => {
    const goal = parseInt(customGoal, 10);
    if (isNaN(goal) || goal <= 0) {
      Alert.alert('エラー', '正しい歩数を入力してください');
      return;
    }

    try {
      const newSettings = { ...settings, goalSteps: goal };
      await stepStorage.saveSettings(newSettings);
      setSettings(newSettings);
      Alert.alert('保存完了', `目標歩数を${goal.toLocaleString()}歩に設定しました`);
    } catch (error) {
      Alert.alert('エラー', '設定の保存に失敗しました');
    }
  };

  const handleClearData = () => {
    Alert.alert(
      'データ削除',
      'すべての歩数記録と設定を削除します。この操作は取り消せません。',
      [
        { text: 'キャンセル', style: 'cancel' },
        {
          text: '削除',
          style: 'destructive',
          onPress: async () => {
            try {
              await stepStorage.clearAllData();
              setSettings({ goalSteps: 8000 });
              setCustomGoal('8000');
              Alert.alert('完了', 'すべてのデータを削除しました');
            } catch (error) {
              Alert.alert('エラー', 'データの削除に失敗しました');
            }
          },
        },
      ]
    );
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>読み込み中...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Current Goal */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>現在の目標</Text>
        <View style={styles.currentGoal}>
          <Text style={styles.currentGoalValue} testID="current-goal">
            {settings.goalSteps.toLocaleString()}
          </Text>
          <Text style={styles.currentGoalUnit}>歩/日</Text>
        </View>
      </View>

      {/* Goal Presets */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>目標を選択</Text>
        <View style={styles.presetsGrid}>
          {GOAL_PRESETS.map((goal) => (
            <TouchableOpacity
              key={goal}
              testID={`preset-${goal}`}
              style={[
                styles.presetButton,
                settings.goalSteps === goal && styles.presetButtonActive,
              ]}
              onPress={() => handlePresetSelect(goal)}
            >
              <Text
                style={[
                  styles.presetButtonText,
                  settings.goalSteps === goal && styles.presetButtonTextActive,
                ]}
              >
                {goal.toLocaleString()}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Custom Goal */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>カスタム目標</Text>
        <View style={styles.customGoalContainer}>
          <TextInput
            testID="custom-goal-input"
            style={styles.customGoalInput}
            value={customGoal}
            onChangeText={setCustomGoal}
            keyboardType="number-pad"
            placeholder="歩数を入力"
          />
          <TouchableOpacity
            testID="save-custom-goal"
            style={styles.customGoalButton}
            onPress={handleCustomGoalSave}
          >
            <Text style={styles.customGoalButtonText}>設定</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Data Management */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>データ管理</Text>
        <TouchableOpacity
          testID="clear-data-button"
          style={styles.dangerButton}
          onPress={handleClearData}
        >
          <Text style={styles.dangerButtonText}>すべてのデータを削除</Text>
        </TouchableOpacity>
      </View>

      {/* App Info */}
      <View style={styles.appInfo}>
        <Text style={styles.appInfoText}>歩数メモ v1.0.0</Text>
        <Text style={styles.appInfoSubtext}>© 2026 ManyConnection LLC</Text>
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
  section: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 12,
  },
  currentGoal: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'center',
  },
  currentGoalValue: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  currentGoalUnit: {
    fontSize: 16,
    color: '#666',
    marginLeft: 8,
  },
  presetsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  presetButton: {
    width: '30%',
    margin: '1.5%',
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  presetButtonActive: {
    backgroundColor: '#E8F5E9',
    borderColor: '#4CAF50',
  },
  presetButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  presetButtonTextActive: {
    color: '#4CAF50',
  },
  customGoalContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  customGoalInput: {
    flex: 1,
    fontSize: 18,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    marginRight: 12,
  },
  customGoalButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  customGoalButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  dangerButton: {
    backgroundColor: '#FFEBEE',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  dangerButtonText: {
    color: '#F44336',
    fontSize: 14,
    fontWeight: '600',
  },
  appInfo: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  appInfoText: {
    fontSize: 14,
    color: '#999',
  },
  appInfoSubtext: {
    fontSize: 12,
    color: '#CCC',
    marginTop: 4,
  },
});
