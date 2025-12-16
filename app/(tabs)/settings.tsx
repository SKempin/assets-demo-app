import Constants from 'expo-constants';
import { Alert, Linking, Platform, StyleSheet } from 'react-native';
import { Button, Divider, List, Text } from 'react-native-paper';

import { View } from '@/components/Themed';
import { useAuth } from '@/context/AuthContext';

export default function SettingsScreen() {
  const { logout, user } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: logout,
        },
      ],
      { cancelable: true }
    );
  };

  const storeURL = () => {
    const url =
      Platform.OS === 'ios'
        ? 'https://apps.apple.com/gb/developer/stephen-kempin/id1451415928'
        : 'https://play.google.com/store/apps/developer?id=SK+UK+Digital';
    Linking.openURL(url);
  };

  return (
    <View style={styles.container}>
      <List.Section>
        <List.Subheader>Account</List.Subheader>
        <List.Item title={user} left={(props) => <List.Icon {...props} icon="account" />} />
        <Divider />

        <List.Subheader>About</List.Subheader>
        <List.Item
          title="App Store"
          left={(props) => <List.Icon {...props} icon="open-in-new" />}
          onPress={storeURL}
        />
        <Divider />
      </List.Section>

      <View style={styles.buttonContainer}>
        <Button mode="outlined" onPress={handleLogout} style={styles.button}>
          Logout
        </Button>
        <Text variant="bodySmall" style={styles.version}>
          Version {Constants.expoConfig?.version || '1.0.0'}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 16,
  },
  buttonContainer: {
    padding: 16,
    marginTop: 'auto',
  },
  button: {
    marginVertical: 8,
  },
  version: {
    textAlign: 'center',
    marginTop: 16,
    opacity: 0.5,
  },
});
