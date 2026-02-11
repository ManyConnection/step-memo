import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  Alert,
} from 'react-native';
import { useFocusEffect } from 'expo-router';
import { RecordListItem } from '../../src/components/RecordListItem';
import { StepInput } from '../../src/components/StepInput';
import { stepStorage } from '../../src/storage/stepStorage';
import { StepRecord, Settings } from '../../src/types';

export default function HistoryScreen() {
  const [records, setRecords] = useState<StepRecord[]>([]);
  const [settings, setSettings] = useState<Settings>({ goalSteps: 8000 });
  const [selectedRecord, setSelectedRecord] = useState<StepRecord | null>(null);
  const [isEditModalVisible, setEditModalVisible] = useState(false);
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

  const handleRecordPress = (record: StepRecord) => {
    setSelectedRecord(record);
    setEditModalVisible(true);
  };

  const handleSaveEdit = async (steps: number) => {
    if (!selectedRecord) return;

    try {
      const updatedRecord: StepRecord = {
        ...selectedRecord,
        steps,
        updatedAt: new Date().toISOString(),
      };
      await stepStorage.saveRecord(updatedRecord);
      setEditModalVisible(false);
      setSelectedRecord(null);
      loadData();
    } catch (error) {
      Alert.alert('エラー', '保存に失敗しました');
    }
  };

  const handleDeleteRecord = async () => {
    if (!selectedRecord) return;

    Alert.alert(
      '削除確認',
      'この記録を削除しますか？',
      [
        { text: 'キャンセル', style: 'cancel' },
        {
          text: '削除',
          style: 'destructive',
          onPress: async () => {
            try {
              await stepStorage.deleteRecord(selectedRecord.date);
              setEditModalVisible(false);
              setSelectedRecord(null);
              loadData();
            } catch (error) {
              Alert.alert('エラー', '削除に失敗しました');
            }
          },
        },
      ]
    );
  };

  const renderItem = ({ item }: { item: StepRecord }) => (
    <RecordListItem
      date={item.date}
      steps={item.steps}
      goalSteps={settings.goalSteps}
      onPress={() => handleRecordPress(item)}
    />
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>読み込み中...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {records.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>まだ記録がありません</Text>
          <Text style={styles.emptySubtext}>「今日」タブから歩数を記録しましょう</Text>
        </View>
      ) : (
        <FlatList
          data={records}
          renderItem={renderItem}
          keyExtractor={(item) => item.date}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}

      <Modal
        visible={isEditModalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {selectedRecord && (
              <>
                <StepInput
                  initialValue={selectedRecord.steps}
                  onSave={handleSaveEdit}
                  onCancel={() => {
                    setEditModalVisible(false);
                    setSelectedRecord(null);
                  }}
                />
                <TouchableOpacity
                  testID="delete-button"
                  style={styles.deleteButton}
                  onPress={handleDeleteRecord}
                >
                  <Text style={styles.deleteButtonText}>この記録を削除</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
  listContent: {
    padding: 16,
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
  deleteButton: {
    marginTop: 12,
    paddingVertical: 14,
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
  },
  deleteButtonText: {
    color: '#F44336',
    fontSize: 16,
    fontWeight: '600',
  },
});
