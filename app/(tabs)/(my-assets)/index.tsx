import { useRouter } from 'expo-router';
import { FlatList, StyleSheet } from 'react-native';
import { Divider, List, Text } from 'react-native-paper';

import { LoadingState } from '@/components/LoadingState';
import { View } from '@/components/Themed';
import { useFirestore } from '@/context/FirestoreContext';

export default function MyAssetsScreen() {
  const { assets, loading } = useFirestore();
  const router = useRouter();

  if (loading) {
    return <LoadingState />;
  }

  const renderAssetItem = ({ item }) => (
    <List.Item
      title={item.name}
      description={item.description}
      left={(props) => <List.Icon {...props} icon="file-document" />}
      right={(props) => <List.Icon {...props} icon="chevron-right" />}
      descriptionNumberOfLines={3}
      onPress={() => router.push(`/(tabs)/(my-assets)/details/${item.id}`)}
    />
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text variant="bodyLarge" style={styles.emptyText}>
        No assets found
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={assets}
        renderItem={renderAssetItem}
        keyExtractor={(item) => item.id}
        ItemSeparatorComponent={() => <Divider />}
        ListEmptyComponent={renderEmptyState}
        contentContainerStyle={assets.length === 0 ? styles.emptyContentContainer : undefined}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loader: {
    marginTop: 50,
  },
  emptyContentContainer: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 50,
  },
  emptyText: {
    opacity: 0.5,
  },
});
