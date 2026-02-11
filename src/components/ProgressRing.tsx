import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

interface ProgressRingProps {
  progress: number; // 0-100
  size?: number;
  strokeWidth?: number;
  steps: number;
  goal: number;
}

export const ProgressRing: React.FC<ProgressRingProps> = ({
  progress,
  size = 200,
  strokeWidth = 12,
  steps,
  goal,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const clampedProgress = Math.min(Math.max(progress, 0), 100);
  const strokeDashoffset = circumference - (clampedProgress / 100) * circumference;

  const getProgressColor = () => {
    if (progress >= 100) return '#4CAF50';
    if (progress >= 75) return '#8BC34A';
    if (progress >= 50) return '#FFC107';
    return '#FF9800';
  };

  return (
    <View style={styles.container} testID="progress-ring">
      <Svg width={size} height={size}>
        {/* Background circle */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#E0E0E0"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        {/* Progress circle */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={getProgressColor()}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
      <View style={[styles.textContainer, { width: size, height: size }]}>
        <Text style={styles.stepsText} testID="steps-display">{steps.toLocaleString()}</Text>
        <Text style={styles.labelText}>歩</Text>
        <Text style={styles.goalText} testID="goal-display">目標: {goal.toLocaleString()}</Text>
        <Text style={[styles.percentText, { color: getProgressColor() }]} testID="percent-display">
          {Math.round(progress)}%
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepsText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#333',
  },
  labelText: {
    fontSize: 16,
    color: '#666',
    marginTop: -4,
  },
  goalText: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
  },
  percentText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 4,
  },
});
