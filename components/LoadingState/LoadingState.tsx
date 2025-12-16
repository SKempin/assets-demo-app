import { ActivityIndicator, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';

import { View } from '@/components/Themed';

interface LoadingStateProps {
  message?: string;
  size?: 'small' | 'large';
  style?: object;
  showMessage?: boolean;
}

export function LoadingState({
  message = 'Loading...',
  size = 'large',
  style,
  showMessage = false,
}: LoadingStateProps) {
  return (
    <View style={[styles.container, style]}>
      <ActivityIndicator testID="loading-indicator" size={size} style={styles.indicator} />
      {showMessage && (
        <Text variant="bodyMedium" style={styles.message}>
          {message}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  indicator: {
    marginBottom: 16,
  },
  message: {
    textAlign: 'center',
    opacity: 0.7,
  },
});
