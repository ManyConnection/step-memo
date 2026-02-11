import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';

interface ChartDataPoint {
  date: string;
  steps: number;
}

interface StepChartProps {
  data: ChartDataPoint[];
  goalSteps: number;
  showLabels?: boolean;
}

const BAR_WIDTH = 30;
const BAR_GAP = 8;
const CHART_HEIGHT = 200;

export const StepChart: React.FC<StepChartProps> = ({
  data,
  goalSteps,
  showLabels = true,
}) => {
  const maxSteps = Math.max(...data.map(d => d.steps), goalSteps);
  const scale = maxSteps > 0 ? CHART_HEIGHT / maxSteps : 1;

  const formatDateLabel = (date: string) => {
    const parts = date.split('-');
    return `${parseInt(parts[1])}/${parseInt(parts[2])}`;
  };

  return (
    <View style={styles.container} testID="step-chart">
      {/* Goal line */}
      <View
        style={[
          styles.goalLine,
          { bottom: goalSteps * scale + 30 },
        ]}
        testID="goal-line"
      >
        <Text style={styles.goalLineText}>{goalSteps.toLocaleString()}</Text>
        <View style={styles.goalLineDash} />
      </View>

      {/* Bars */}
      <View style={styles.barsContainer}>
        {data.map((item, index) => {
          const barHeight = Math.max(item.steps * scale, 2);
          const isAchieved = item.steps >= goalSteps;

          return (
            <View key={item.date} style={styles.barWrapper} testID={`bar-${index}`}>
              <View
                style={[
                  styles.bar,
                  {
                    height: barHeight,
                    backgroundColor: isAchieved ? '#4CAF50' : '#E0E0E0',
                  },
                ]}
              />
              {showLabels && (
                <Text style={styles.barLabel}>{formatDateLabel(item.date)}</Text>
              )}
            </View>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    paddingTop: 20,
    paddingBottom: 10,
  },
  goalLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 1,
  },
  goalLineText: {
    fontSize: 10,
    color: '#FF5722',
    marginRight: 4,
    width: 40,
    textAlign: 'right',
  },
  goalLineDash: {
    flex: 1,
    height: 1,
    backgroundColor: '#FF5722',
  },
  barsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    height: CHART_HEIGHT + 30,
    paddingLeft: 45,
  },
  barWrapper: {
    alignItems: 'center',
    marginHorizontal: BAR_GAP / 2,
  },
  bar: {
    width: BAR_WIDTH,
    borderRadius: 4,
  },
  barLabel: {
    fontSize: 10,
    color: '#666',
    marginTop: 4,
  },
});
