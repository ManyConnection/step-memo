import React from 'react';
import { render } from '@testing-library/react-native';
import { StepChart } from '../../src/components/StepChart';

describe('StepChart', () => {
  const mockData = [
    { date: '2026-02-09', steps: 5000 },
    { date: '2026-02-10', steps: 8500 },
    { date: '2026-02-11', steps: 10000 },
    { date: '2026-02-12', steps: 6000 },
  ];

  it('should render chart container', () => {
    const { getByTestId } = render(
      <StepChart data={mockData} goalSteps={8000} />
    );

    expect(getByTestId('step-chart')).toBeTruthy();
  });

  it('should render goal line', () => {
    const { getByTestId } = render(
      <StepChart data={mockData} goalSteps={8000} />
    );

    expect(getByTestId('goal-line')).toBeTruthy();
  });

  it('should render bars for each data point', () => {
    const { getByTestId } = render(
      <StepChart data={mockData} goalSteps={8000} />
    );

    expect(getByTestId('bar-0')).toBeTruthy();
    expect(getByTestId('bar-1')).toBeTruthy();
    expect(getByTestId('bar-2')).toBeTruthy();
    expect(getByTestId('bar-3')).toBeTruthy();
  });

  it('should render correct number of bars', () => {
    const data = [
      { date: '2026-02-12', steps: 5000 },
      { date: '2026-02-13', steps: 6000 },
    ];

    const { queryByTestId } = render(
      <StepChart data={data} goalSteps={8000} />
    );

    expect(queryByTestId('bar-0')).toBeTruthy();
    expect(queryByTestId('bar-1')).toBeTruthy();
    expect(queryByTestId('bar-2')).toBeNull();
  });

  it('should handle empty data', () => {
    const { getByTestId, queryByTestId } = render(
      <StepChart data={[]} goalSteps={8000} />
    );

    expect(getByTestId('step-chart')).toBeTruthy();
    expect(queryByTestId('bar-0')).toBeNull();
  });

  it('should handle all zeros', () => {
    const data = [
      { date: '2026-02-12', steps: 0 },
      { date: '2026-02-13', steps: 0 },
    ];

    const { getByTestId } = render(
      <StepChart data={data} goalSteps={8000} />
    );

    expect(getByTestId('bar-0')).toBeTruthy();
    expect(getByTestId('bar-1')).toBeTruthy();
  });
});
