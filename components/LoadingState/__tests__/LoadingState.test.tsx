import { render } from '@testing-library/react-native';
import React from 'react';

import { LoadingState } from '../LoadingState';

describe('LoadingState', () => {
  it('renders without crashing', () => {
    const { getByTestId } = render(<LoadingState />);
    expect(getByTestId('loading-indicator')).toBeTruthy();
  });

  it('shows message when showMessage is true', () => {
    const { getByText } = render(<LoadingState showMessage message="Please wait" />);
    expect(getByText('Please wait')).toBeTruthy();
  });

  it('does not show message when showMessage is false', () => {
    const { queryByText } = render(<LoadingState message="Hidden" showMessage={false} />);
    expect(queryByText('Hidden')).toBeNull();
  });

  it('passes size prop to ActivityIndicator', () => {
    const { getByTestId } = render(<LoadingState size="small" />);
    const indicator = getByTestId('loading-indicator');
    expect(indicator.props.size).toBe('small');
  });
});
