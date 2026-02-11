import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';

interface StepInputProps {
  initialValue?: number;
  onSave: (steps: number) => void;
  onCancel?: () => void;
}

export const StepInput: React.FC<StepInputProps> = ({
  initialValue = 0,
  onSave,
  onCancel,
}) => {
  const [steps, setSteps] = useState(initialValue.toString());

  const handleSave = () => {
    const value = parseInt(steps, 10);
    if (isNaN(value) || value < 0) {
      Alert.alert('エラー', '正しい歩数を入力してください');
      return;
    }
    onSave(value);
  };

  const handleQuickAdd = (amount: number) => {
    const current = parseInt(steps, 10) || 0;
    setSteps((current + amount).toString());
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>歩数を入力</Text>
      
      <TextInput
        testID="step-input"
        style={styles.input}
        value={steps}
        onChangeText={setSteps}
        keyboardType="number-pad"
        placeholder="0"
        selectTextOnFocus
      />

      <View style={styles.quickButtons}>
        <TouchableOpacity
          testID="quick-add-1000"
          style={styles.quickButton}
          onPress={() => handleQuickAdd(1000)}
        >
          <Text style={styles.quickButtonText}>+1000</Text>
        </TouchableOpacity>
        <TouchableOpacity
          testID="quick-add-5000"
          style={styles.quickButton}
          onPress={() => handleQuickAdd(5000)}
        >
          <Text style={styles.quickButtonText}>+5000</Text>
        </TouchableOpacity>
        <TouchableOpacity
          testID="quick-add-10000"
          style={styles.quickButton}
          onPress={() => handleQuickAdd(10000)}
        >
          <Text style={styles.quickButtonText}>+10000</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.actionButtons}>
        {onCancel && (
          <TouchableOpacity
            testID="cancel-button"
            style={[styles.button, styles.cancelButton]}
            onPress={onCancel}
          >
            <Text style={styles.cancelButtonText}>キャンセル</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          testID="save-button"
          style={[styles.button, styles.saveButton]}
          onPress={handleSave}
        >
          <Text style={styles.saveButtonText}>保存</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  label: {
    fontSize: 16,
    color: '#666',
    marginBottom: 12,
    textAlign: 'center',
  },
  input: {
    fontSize: 48,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#4CAF50',
    borderBottomWidth: 2,
    borderBottomColor: '#4CAF50',
    paddingVertical: 12,
    marginBottom: 20,
  },
  quickButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  quickButton: {
    backgroundColor: '#E8F5E9',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  quickButtonText: {
    color: '#4CAF50',
    fontWeight: '600',
    fontSize: 14,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveButton: {
    backgroundColor: '#4CAF50',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: '#f5f5f5',
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
});
