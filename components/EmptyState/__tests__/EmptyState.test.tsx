import { render } from '@testing-library/react-native';
import React from 'react';
import { EmptyState } from '../EmptyState';

jest.mock('react-native-paper', () => {
  const React = require('react');
  return {
    Text: ({ children, ...props }: any) => React.createElement('Text', props, children),
    Icon: ({ source, size }: any) =>
      React.createElement('Text', { testID: 'icon', children: `${source}:${size}` }),
  };
});

jest.mock('@/components/Themed', () => {
  const React = require('react');
  return {
    View: ({ children, ...props }: any) => React.createElement('View', props, children),
  };
});

describe('EmptyState', () => {
  it('renders default title', () => {
    const { getByText } = render(<EmptyState />);
    expect(getByText('No data found')).toBeTruthy();
  });

  it('renders custom title and subtitle', () => {
    const { getByText } = render(<EmptyState title="Empty" subtitle="Try again" />);
    expect(getByText('Empty')).toBeTruthy();
    expect(getByText('Try again')).toBeTruthy();
  });

  it('renders icon with provided name and size', () => {
    const { getByTestId } = render(<EmptyState icon="check" iconSize={32} />);
    const icon = getByTestId('icon');
    expect(icon).toBeTruthy();
    expect(icon.props.children).toBe('check:32');
  });
});
