import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface StreakBadgeProps {
  currentStreak: number;
  longestStreak: number;
}

export const StreakBadge: React.FC<StreakBadgeProps> = ({
  currentStreak,
  longestStreak,
}) => {
  return (
    <View style={styles.container} testID="streak-badge">
      <View style={styles.streakItem}>
        <Text style={styles.streakValue} testID="current-streak">{currentStreak}</Text>
        <Text style={styles.streakLabel}>連続達成日数</Text>
      </View>
      <View style={styles.divider} />
      <View style={styles.streakItem}>
        <Text style={styles.streakValue} testID="longest-streak">{longestStreak}</Text>
        <Text style={styles.streakLabel}>最長記録</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#FFF3E0',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  streakItem: {
    alignItems: 'center',
    flex: 1,
  },
  streakValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FF9800',
  },
  streakLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  divider: {
    width: 1,
    height: 40,
    backgroundColor: '#FFE0B2',
  },
});
