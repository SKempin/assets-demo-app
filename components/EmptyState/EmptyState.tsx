import { StyleSheet } from 'react-native';
import { Icon, Text } from 'react-native-paper';

import { View } from '@/components/Themed';

interface EmptyStateProps {
  title?: string;
  subtitle?: string;
  icon?: string;
  iconSize?: number;
  textVariant?: 'bodyLarge' | 'bodyMedium' | 'headlineSmall' | 'headlineMedium';
  style?: object;
}

export function EmptyState({
  title = 'No data found',
  subtitle,
  icon = 'information-outline',
  iconSize = 48,
  textVariant = 'bodyLarge',
  style,
}: EmptyStateProps) {
  return (
    <View style={[styles.container, style]}>
      <Icon source={icon} size={iconSize} />
      <Text variant={textVariant} style={styles.title}>
        {title}
      </Text>
      {subtitle && (
        <Text variant="bodyMedium" style={styles.subtitle}>
          {subtitle}
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
  title: {
    textAlign: 'center',
    marginTop: 16,
    opacity: 0.7,
  },
  subtitle: {
    textAlign: 'center',
    marginTop: 8,
    opacity: 0.5,
  },
});
