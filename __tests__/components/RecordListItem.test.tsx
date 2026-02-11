import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { RecordListItem } from '../../src/components/RecordListItem';
import * as dateUtils from '../../src/utils/dateUtils';

// Mock dateUtils
jest.mock('../../src/utils/dateUtils', () => ({
  ...jest.requireActual('../../src/utils/dateUtils'),
  isToday: jest.fn(),
  isYesterday: jest.fn(),
  formatDisplayDate: jest.fn((date) => `${date} display`),
}));

describe('RecordListItem', () => {
  const mockOnPress = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (dateUtils.isToday as jest.Mock).mockReturnValue(false);
    (dateUtils.isYesterday as jest.Mock).mockReturnValue(false);
  });

  it('should display steps correctly', () => {
    const { getByText } = render(
      <RecordListItem
        date="2026-02-12"
        steps={8500}
        goalSteps={8000}
        onPress={mockOnPress}
      />
    );

    expect(getByText('8,500')).toBeTruthy();
  });

  it('should call onPress when pressed', () => {
    const { getByTestId } = render(
      <RecordListItem
        date="2026-02-12"
        steps={8500}
        goalSteps={8000}
        onPress={mockOnPress}
      />
    );

    const item = getByTestId('record-item-2026-02-12');
    fireEvent.press(item);

    expect(mockOnPress).toHaveBeenCalledTimes(1);
  });

  it('should display "今日" for today\'s record', () => {
    (dateUtils.isToday as jest.Mock).mockReturnValue(true);

    const { getByText } = render(
      <RecordListItem
        date="2026-02-12"
        steps={8500}
        goalSteps={8000}
        onPress={mockOnPress}
      />
    );

    expect(getByText('今日')).toBeTruthy();
  });

  it('should display "昨日" for yesterday\'s record', () => {
    (dateUtils.isYesterday as jest.Mock).mockReturnValue(true);

    const { getByText } = render(
      <RecordListItem
        date="2026-02-11"
        steps={8500}
        goalSteps={8000}
        onPress={mockOnPress}
      />
    );

    expect(getByText('昨日')).toBeTruthy();
  });

  it('should show achievement badge when goal achieved', () => {
    const { getByText } = render(
      <RecordListItem
        date="2026-02-12"
        steps={10000}
        goalSteps={8000}
        onPress={mockOnPress}
      />
    );

    expect(getByText('🎉')).toBeTruthy();
  });

  it('should not show achievement badge when goal not achieved', () => {
    const { queryByText } = render(
      <RecordListItem
        date="2026-02-12"
        steps={5000}
        goalSteps={8000}
        onPress={mockOnPress}
      />
    );

    expect(queryByText('🎉')).toBeNull();
  });

  it('should calculate and display achievement rate', () => {
    const { getByText } = render(
      <RecordListItem
        date="2026-02-12"
        steps={6000}
        goalSteps={8000}
        onPress={mockOnPress}
      />
    );

    expect(getByText('75%')).toBeTruthy();
  });

  it('should handle 0 goal steps without crashing', () => {
    const { getByText } = render(
      <RecordListItem
        date="2026-02-12"
        steps={5000}
        goalSteps={0}
        onPress={mockOnPress}
      />
    );

    expect(getByText('0%')).toBeTruthy();
  });

  it('should handle over 100% achievement', () => {
    const { getByText } = render(
      <RecordListItem
        date="2026-02-12"
        steps={12000}
        goalSteps={8000}
        onPress={mockOnPress}
      />
    );

    expect(getByText('150%')).toBeTruthy();
  });

  it('should format large step numbers with commas', () => {
    const { getByText } = render(
      <RecordListItem
        date="2026-02-12"
        steps={15000}
        goalSteps={8000}
        onPress={mockOnPress}
      />
    );

    expect(getByText('15,000')).toBeTruthy();
  });
});
