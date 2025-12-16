import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { FlatList, Image, ScrollView, StyleSheet } from 'react-native';
import { Divider, IconButton, List } from 'react-native-paper';

import { EmptyState } from '@/components/EmptyState';
import { LoadingState } from '@/components/LoadingState';
import { View } from '@/components/Themed';
import { useFirestore } from '@/context/FirestoreContext';
import { Asset } from '@/types/Asset';

export default function AssetDetailsScreen() {
  const { id } = useLocalSearchParams();
  const [asset, setAsset] = useState<Asset | null>(null);
  const [loading, setLoading] = useState(true);
  const { subscribeToAsset } = useFirestore();
  const router = useRouter();

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    const unsubscribe = subscribeToAsset(id as string, (updatedAsset) => {
      setAsset(updatedAsset);
      setLoading(false);
    });

    return unsubscribe;
  }, [id, subscribeToAsset]);

  if (loading) {
    return (
      <>
        <Stack.Screen options={{ title: 'Edit Asset' }} />
        <LoadingState />
      </>
    );
  }

  if (!asset) {
    return <EmptyState title="Asset not found" icon="file-question" />;
  }

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerRight: () => (
            <IconButton
              icon="pencil"
              size={20}
              style={{ margin: 0 }}
              onPress={() => {
                router.push(`/(tabs)/(my-assets)/edit/${asset.id}`);
              }}
            />
          ),
        }}
      />
      <ScrollView style={styles.scrollView}>
        <List.Section>
          <List.Subheader>Asset Information</List.Subheader>

          <List.Item
            title="Name"
            description={asset.name || 'N/A'}
            left={(props) => <List.Icon {...props} icon="tag" />}
          />
          <Divider />

          {asset.description && (
            <>
              <List.Item
                title="Description"
                description={asset.description}
                descriptionNumberOfLines={10}
                left={(props) => <List.Icon {...props} icon="text" />}
              />
              <Divider />
            </>
          )}

          {asset.location && (
            <>
              <List.Item
                title="Location"
                description={asset.location}
                left={(props) => <List.Icon {...props} icon="map-marker" />}
              />
              <Divider />
            </>
          )}

          {asset.createdAt && (
            <>
              <List.Item
                title="Created At"
                description={
                  asset.createdAt?.toDate
                    ? asset.createdAt.toDate().toLocaleString()
                    : asset.createdAt
                }
                left={(props) => <List.Icon {...props} icon="clock" />}
              />
              <Divider />
            </>
          )}
        </List.Section>

        {asset.attachments && asset.attachments.length > 0 && (
          <List.Section>
            <List.Subheader>Attachments ({asset.attachments.length})</List.Subheader>
            <View style={styles.thumbnailContainer}>
              <FlatList
                data={asset.attachments}
                keyExtractor={(item, index) => index.toString()}
                numColumns={3}
                columnWrapperStyle={styles.thumbnailRow}
                renderItem={({ item: uri }) => (
                  <View style={styles.thumbnailWrapper}>
                    <Image source={{ uri }} style={styles.thumbnail} resizeMode="cover" />
                  </View>
                )}
                showsVerticalScrollIndicator={false}
                scrollEnabled={false}
                ItemSeparatorComponent={() => <View style={styles.rowSeparator} />}
              />
            </View>
          </List.Section>
        )}

        <List.Section>
          <List.Item
            title="ID"
            description={asset.id || 'N/A'}
            descriptionStyle={styles.idText}
            left={(props) => <List.Icon {...props} icon="identifier" />}
          />
        </List.Section>
      </ScrollView>
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
  scrollView: {
    flex: 1,
  },
  idText: {
    fontFamily: 'monospace',
    fontSize: 12,
  },
  thumbnailContainer: {
    padding: 8,
  },
  thumbnailRow: {
    justifyContent: 'flex-start',
    paddingHorizontal: 8,
    gap: 10,
  },
  thumbnailWrapper: {
    width: 100,
    height: 100,
    borderRadius: 8,
    overflow: 'hidden',
  },
  rowSeparator: {
    height: 12,
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
});
