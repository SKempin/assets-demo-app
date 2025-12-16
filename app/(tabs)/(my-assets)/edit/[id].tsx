import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';

import AssetForm from '@/components/AssetForm';
import { EmptyState } from '@/components/EmptyState';
import { LoadingState } from '@/components/LoadingState';
import { View } from '@/components/Themed';
import { useFirestore } from '@/context/FirestoreContext';
import { Asset } from '@/types/Asset';

export default function EditAssetScreen() {
  const { id } = useLocalSearchParams();
  const [asset, setAsset] = useState<Asset | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const { getAsset, deleteAsset } = useFirestore();

  useEffect(() => {
    const fetchAsset = async () => {
      if (!id) {
        setLoading(false);
        return;
      }

      try {
        const assetData = await getAsset(id as string);
        setAsset(assetData);
      } catch (error) {
        console.error('Error fetching asset:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAsset();
  }, [id, getAsset]);

  const handleDelete = async () => {
    if (!id) return;

    Alert.alert(
      'Delete Asset',
      'Are you sure you want to delete this asset? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              setDeleting(true);
              await deleteAsset(id as string);
              router.back();
              router.back();
            } catch (error) {
              console.error('Error deleting asset:', error);
              Alert.alert('Error', 'Failed to delete asset. Please try again.');
            } finally {
              setDeleting(false);
            }
          },
        },
      ]
    );
  };

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
    <>
      <Stack.Screen options={{ title: `Edit ${asset.name}` }} />
      <View style={styles.container}>
        <AssetForm
          assetId={asset.id}
          initialValues={{
            id: asset.id,
            name: asset.name,
            description: asset.description,
            location: asset.location || '',
          }}
          initialAttachments={asset.attachments || []}
        />
        <View style={styles.footer}>
          <Button
            mode="outlined"
            onPress={handleDelete}
            loading={deleting}
            disabled={deleting}
            buttonColor="transparent"
            textColor="#dc2626"
            style={styles.deleteButton}>
            Delete Asset
          </Button>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    opacity: 0.5,
  },
  footer: {
    padding: 16,
    paddingBottom: 32,
  },
  deleteButton: {
    borderColor: '#dc2626',
    paddingVertical: 6,
  },
});
