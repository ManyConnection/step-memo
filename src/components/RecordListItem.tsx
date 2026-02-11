import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { formatDisplayDate, isToday, isYesterday } from '../utils/dateUtils';

interface RecordListItemProps {
  date: string;
  steps: number;
  goalSteps: number;
  onPress: () => void;
}

export const RecordListItem: React.FC<RecordListItemProps> = ({
  date,
  steps,
  goalSteps,
  onPress,
}) => {
  const isAchieved = steps >= goalSteps;
  const achievementRate = goalSteps > 0 ? Math.round((steps / goalSteps) * 100) : 0;

  const getDateLabel = () => {
    if (isToday(date)) return '今日';
    if (isYesterday(date)) return '昨日';
    return formatDisplayDate(date);
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      testID={`record-item-${date}`}
    >
      <View style={styles.dateContainer}>
        <Text style={styles.dateText}>{getDateLabel()}</Text>
        {isAchieved && <Text style={styles.achievedBadge}>🎉</Text>}
      </View>
      
      <View style={styles.stepsContainer}>
        <Text style={[styles.stepsText, isAchieved && styles.achievedText]}>
          {steps.toLocaleString()}
        </Text>
        <Text style={styles.unitText}>歩</Text>
      </View>
      
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              {
                width: `${Math.min(achievementRate, 100)}%`,
                backgroundColor: isAchieved ? '#4CAF50' : '#FFC107',
              },
            ]}
          />
        </View>
        <Text style={styles.percentText}>{achievementRate}%</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginVertical: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 100,
  },
  dateText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  achievedBadge: {
    marginLeft: 4,
    fontSize: 12,
  },
  stepsContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'center',
  },
  stepsText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  achievedText: {
    color: '#4CAF50',
  },
  unitText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 2,
  },
  progressContainer: {
    width: 80,
    alignItems: 'flex-end',
  },
  progressBar: {
    width: '100%',
    height: 6,
    backgroundColor: '#E0E0E0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  percentText: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
});
