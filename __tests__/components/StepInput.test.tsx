import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Alert } from 'react-native';
import { StepInput } from '../../src/components/StepInput';

jest.spyOn(Alert, 'alert');

describe('StepInput', () => {
  const mockOnSave = jest.fn();
  const mockOnCancel = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render with initial value', () => {
    const { getByTestId } = render(
      <StepInput initialValue={5000} onSave={mockOnSave} />
    );

    const input = getByTestId('step-input');
    expect(input.props.value).toBe('5000');
  });

  it('should render with zero when no initial value', () => {
    const { getByTestId } = render(<StepInput onSave={mockOnSave} />);

    const input = getByTestId('step-input');
    expect(input.props.value).toBe('0');
  });

  it('should update value when typing', () => {
    const { getByTestId } = render(<StepInput onSave={mockOnSave} />);

    const input = getByTestId('step-input');
    fireEvent.changeText(input, '8500');

    expect(input.props.value).toBe('8500');
  });

  it('should call onSave with correct value when save button pressed', () => {
    const { getByTestId } = render(
      <StepInput initialValue={8000} onSave={mockOnSave} />
    );

    const saveButton = getByTestId('save-button');
    fireEvent.press(saveButton);

    expect(mockOnSave).toHaveBeenCalledWith(8000);
    expect(mockOnSave).toHaveBeenCalledTimes(1);
  });

  it('should show error alert for invalid input', () => {
    const { getByTestId } = render(<StepInput onSave={mockOnSave} />);

    const input = getByTestId('step-input');
    fireEvent.changeText(input, 'abc');

    const saveButton = getByTestId('save-button');
    fireEvent.press(saveButton);

    expect(Alert.alert).toHaveBeenCalledWith(
      'エラー',
      '正しい歩数を入力してください'
    );
    expect(mockOnSave).not.toHaveBeenCalled();
  });

  it('should show error alert for negative input', () => {
    const { getByTestId } = render(<StepInput onSave={mockOnSave} />);

    const input = getByTestId('step-input');
    fireEvent.changeText(input, '-100');

    const saveButton = getByTestId('save-button');
    fireEvent.press(saveButton);

    expect(Alert.alert).toHaveBeenCalledWith(
      'エラー',
      '正しい歩数を入力してください'
    );
    expect(mockOnSave).not.toHaveBeenCalled();
  });

  it('should add 1000 steps when quick add button pressed', () => {
    const { getByTestId } = render(
      <StepInput initialValue={5000} onSave={mockOnSave} />
    );

    const quickAdd1000 = getByTestId('quick-add-1000');
    fireEvent.press(quickAdd1000);

    const input = getByTestId('step-input');
    expect(input.props.value).toBe('6000');
  });

  it('should add 5000 steps when quick add button pressed', () => {
    const { getByTestId } = render(
      <StepInput initialValue={3000} onSave={mockOnSave} />
    );

    const quickAdd5000 = getByTestId('quick-add-5000');
    fireEvent.press(quickAdd5000);

    const input = getByTestId('step-input');
    expect(input.props.value).toBe('8000');
  });

  it('should add 10000 steps when quick add button pressed', () => {
    const { getByTestId } = render(
      <StepInput initialValue={0} onSave={mockOnSave} />
    );

    const quickAdd10000 = getByTestId('quick-add-10000');
    fireEvent.press(quickAdd10000);

    const input = getByTestId('step-input');
    expect(input.props.value).toBe('10000');
  });

  it('should call onCancel when cancel button pressed', () => {
    const { getByTestId } = render(
      <StepInput onSave={mockOnSave} onCancel={mockOnCancel} />
    );

    const cancelButton = getByTestId('cancel-button');
    fireEvent.press(cancelButton);

    expect(mockOnCancel).toHaveBeenCalledTimes(1);
  });

  it('should not show cancel button when onCancel not provided', () => {
    const { queryByTestId } = render(<StepInput onSave={mockOnSave} />);

    const cancelButton = queryByTestId('cancel-button');
    expect(cancelButton).toBeNull();
  });

  it('should handle multiple quick add presses', () => {
    const { getByTestId } = render(
      <StepInput initialValue={0} onSave={mockOnSave} />
    );

    fireEvent.press(getByTestId('quick-add-1000'));
    fireEvent.press(getByTestId('quick-add-1000'));
    fireEvent.press(getByTestId('quick-add-5000'));

    const input = getByTestId('step-input');
    expect(input.props.value).toBe('7000');
  });

  it('should handle empty input as 0 for quick add', () => {
    const { getByTestId } = render(<StepInput onSave={mockOnSave} />);

    const input = getByTestId('step-input');
    fireEvent.changeText(input, '');
    fireEvent.press(getByTestId('quick-add-1000'));

    expect(input.props.value).toBe('1000');
  });
});
