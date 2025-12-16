import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  ActionSheetIOS,
  Alert,
  FlatList,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { Button, Divider, HelperText, IconButton, Text, TextInput } from 'react-native-paper';

import { View } from '@/components/Themed';
import { useFirestore } from '@/context/FirestoreContext';
import { Asset } from '@/types/Asset';

interface AssetFormProps {
  assetId?: string;
  initialValues?: Asset;
  initialAttachments?: string[];
}

export default function AssetForm({ assetId, initialValues, initialAttachments }: AssetFormProps) {
  const {
    control,
    handleSubmit: handleFormSubmit,
    formState: { errors, isDirty },
    reset,
    watch,
  } = useForm<Asset>({
    defaultValues: initialValues || {
      name: '',
      description: '',
      location: '',
    },
  });
  const [attachments, setAttachments] = useState<string[]>(initialAttachments || []);
  const [saving, setSaving] = useState(false);
  const router = useRouter();
  const { createAsset, updateAsset } = useFirestore();

  const isAttachmentsDirty =
    JSON.stringify(attachments) !== JSON.stringify(initialAttachments || []);
  const isFormDirty = isDirty || isAttachmentsDirty;

  useEffect(() => {
    if (initialValues) {
      reset(initialValues);
    }
    if (initialAttachments) {
      setAttachments(initialAttachments);
    }
  }, [initialValues, initialAttachments, reset]);

  const handleChooseAttachment = () => {
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ['Cancel', 'Take Photo', 'Choose from Library'],
          cancelButtonIndex: 0,
        },
        (buttonIndex) => {
          if (buttonIndex === 1) {
            openCamera();
          } else if (buttonIndex === 2) {
            openPhotoLibrary();
          }
        }
      );
    } else {
      Alert.alert(
        'Choose Attachment',
        'Select an option',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Take Photo', onPress: openCamera },
          { text: 'Choose from Library', onPress: openPhotoLibrary },
        ],
        { cancelable: true }
      );
    }
  };

  const openCamera = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert('Permission Required', 'Camera permission is required to take photos.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setAttachments([...attachments, result.assets[0].uri]);
    }
  };

  const openPhotoLibrary = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert('Permission Required', 'Photo library permission is required to select photos.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: false,
      allowsMultipleSelection: true,
      quality: 1,
    });

    if (!result.canceled) {
      const newUris = result.assets.map((asset) => asset.uri);
      setAttachments([...attachments, ...newUris]);
    }
  };

  const handleSubmit = async (data: Asset) => {
    setSaving(true);
    try {
      const assetData = {
        name: data.name.trim(),
        description: data.description.trim(),
        location: data.location?.trim(),
        attachments: attachments,
      };

      if (assetId) {
        await updateAsset(assetId, assetData);

        Alert.alert('Success', 'Asset updated successfully!', [
          {
            text: 'OK',
            onPress: () => {
              router.back();
            },
          },
        ]);
      } else {
        const newAssetId = await createAsset(assetData);

        Alert.alert('Success', 'Asset saved successfully!', [
          {
            text: 'OK',
            onPress: () => {
              reset();
              setAttachments([]);
              router.push(`/(tabs)/(my-assets)/details/${newAssetId}`);
            },
          },
        ]);
      }
    } catch (error) {
      console.error('Error saving asset:', error);
      Alert.alert('Error', 'Failed to save asset. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={styles.wrapper}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.fieldGroup}>
          <Controller
            control={control}
            name="name"
            rules={{ required: 'Name is required' }}
            render={({ field: { onChange, onBlur, value } }) => (
              <>
                <TextInput
                  label="Name *"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  mode="outlined"
                  error={!!errors.name}
                />
                {errors.name && (
                  <HelperText type="error" visible={!!errors.name}>
                    {errors.name.message}
                  </HelperText>
                )}
              </>
            )}
          />
        </View>

        <View style={styles.fieldGroup}>
          <Controller
            control={control}
            name="description"
            rules={{ required: 'Description is required' }}
            render={({ field: { onChange, onBlur, value } }) => (
              <>
                <TextInput
                  label="Description *"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  mode="outlined"
                  multiline
                  numberOfLines={4}
                  error={!!errors.description}
                />
                {errors.description && (
                  <HelperText type="error" visible={!!errors.description}>
                    {errors.description.message}
                  </HelperText>
                )}
              </>
            )}
          />
        </View>

        <View style={styles.fieldGroup}>
          <Controller
            control={control}
            name="location"
            render={({ field: { onChange, onBlur, value } }) => (
              <>
                <TextInput
                  label="Location"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  mode="outlined"
                  error={!!errors.location}
                />
                {errors.location && (
                  <HelperText type="error" visible={!!errors.location}>
                    {errors.location.message}
                  </HelperText>
                )}
              </>
            )}
          />
        </View>

        <View style={styles.fieldGroup}>
          <Text variant="titleSmall" style={styles.attachmentLabel}>
            Attachments {attachments.length > 0 && `(${attachments.length})`}
          </Text>
          {attachments.length > 0 && (
            <FlatList
              data={attachments}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item, index }) => (
                <View style={styles.thumbnailContainer}>
                  <Image source={{ uri: item }} style={styles.thumbnail} resizeMode="cover" />
                  <IconButton
                    icon="close-circle"
                    size={20}
                    style={styles.removeButton}
                    onPress={() => {
                      setAttachments(attachments.filter((_, i) => i !== index));
                    }}
                  />
                </View>
              )}
              style={styles.thumbnailList}
            />
          )}
          <Button
            mode="outlined"
            onPress={handleChooseAttachment}
            icon="attachment"
            style={styles.button}>
            Add Attachment
          </Button>
        </View>
      </ScrollView>
      <Divider bold />

      <View style={styles.footer}>
        <Button
          mode="contained"
          onPress={handleFormSubmit(handleSubmit)}
          loading={saving}
          disabled={saving || (assetId ? !isFormDirty : false)}
          style={styles.saveButton}>
          {saving ? 'Saving...' : assetId ? 'Update Asset' : 'Save Asset'}
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  scrollContent: {
    paddingBottom: 16,
    justifyContent: 'space-between',
    gap: 12,
  },
  fieldGroup: {
    marginBottom: 16,
  },
  attachmentLabel: {
    marginBottom: 8,
    opacity: 0.7,
  },
  thumbnailList: {
    marginBottom: 8,
  },
  thumbnailContainer: {
    position: 'relative',
    marginRight: 8,
  },
  thumbnail: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
  },
  removeButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    margin: 0,
    backgroundColor: 'white',
  },
  button: {
    marginTop: 8,
    paddingVertical: 6,
  },
  footer: {
    padding: 16,
  },
  saveButton: {
    paddingVertical: 6,
  },
});
