import React from 'react';
import { render } from '@testing-library/react-native';
import { StreakBadge } from '../../src/components/StreakBadge';

describe('StreakBadge', () => {
  it('should render current streak', () => {
    const { getByTestId } = render(
      <StreakBadge currentStreak={5} longestStreak={10} />
    );

    const currentStreak = getByTestId('current-streak');
    expect(currentStreak.props.children).toBe(5);
  });

  it('should render longest streak', () => {
    const { getByTestId } = render(
      <StreakBadge currentStreak={5} longestStreak={10} />
    );

    const longestStreak = getByTestId('longest-streak');
    expect(longestStreak.props.children).toBe(10);
  });

  it('should render zeros when no streak', () => {
    const { getByTestId } = render(
      <StreakBadge currentStreak={0} longestStreak={0} />
    );

    expect(getByTestId('current-streak').props.children).toBe(0);
    expect(getByTestId('longest-streak').props.children).toBe(0);
  });

  it('should render badge container', () => {
    const { getByTestId } = render(
      <StreakBadge currentStreak={3} longestStreak={7} />
    );

    expect(getByTestId('streak-badge')).toBeTruthy();
  });

  it('should display large streak numbers', () => {
    const { getByTestId } = render(
      <StreakBadge currentStreak={365} longestStreak={500} />
    );

    expect(getByTestId('current-streak').props.children).toBe(365);
    expect(getByTestId('longest-streak').props.children).toBe(500);
  });
});
