import React from 'react';
import { render } from '@testing-library/react-native';
import { ProgressRing } from '../../src/components/ProgressRing';

describe('ProgressRing', () => {
  it('should render with correct steps', () => {
    const { getByTestId } = render(
      <ProgressRing progress={50} steps={4000} goal={8000} />
    );

    const stepsDisplay = getByTestId('steps-display');
    expect(stepsDisplay.props.children).toBe('4,000');
  });

  it('should render with correct goal', () => {
    const { getByTestId } = render(
      <ProgressRing progress={50} steps={4000} goal={8000} />
    );

    const goalDisplay = getByTestId('goal-display');
    expect(goalDisplay.props.children).toContain('8,000');
  });

  it('should render with correct percentage', () => {
    const { getByTestId } = render(
      <ProgressRing progress={75} steps={6000} goal={8000} />
    );

    const percentDisplay = getByTestId('percent-display');
    const children = percentDisplay.props.children;
    expect(children[0]).toBe(75);
    expect(children[1]).toBe('%');
  });

  it('should round percentage to integer', () => {
    const { getByTestId } = render(
      <ProgressRing progress={66.67} steps={5333} goal={8000} />
    );

    const percentDisplay = getByTestId('percent-display');
    const children = percentDisplay.props.children;
    expect(children[0]).toBe(67);
  });

  it('should handle 0 progress', () => {
    const { getByTestId } = render(
      <ProgressRing progress={0} steps={0} goal={8000} />
    );

    const percentDisplay = getByTestId('percent-display');
    const children = percentDisplay.props.children;
    expect(children[0]).toBe(0);
    expect(children[1]).toBe('%');
  });

  it('should handle 100% progress', () => {
    const { getByTestId } = render(
      <ProgressRing progress={100} steps={8000} goal={8000} />
    );

    const percentDisplay = getByTestId('percent-display');
    const children = percentDisplay.props.children;
    expect(children[0]).toBe(100);
  });

  it('should handle over 100% progress', () => {
    const { getByTestId } = render(
      <ProgressRing progress={125} steps={10000} goal={8000} />
    );

    const percentDisplay = getByTestId('percent-display');
    const children = percentDisplay.props.children;
    expect(children[0]).toBe(125);
  });

  it('should format large step numbers with commas', () => {
    const { getByTestId } = render(
      <ProgressRing progress={100} steps={15000} goal={10000} />
    );

    const stepsDisplay = getByTestId('steps-display');
    expect(stepsDisplay.props.children).toBe('15,000');
  });

  it('should render the progress ring container', () => {
    const { getByTestId } = render(
      <ProgressRing progress={50} steps={4000} goal={8000} />
    );

    expect(getByTestId('progress-ring')).toBeTruthy();
  });
});
