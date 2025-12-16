import '@testing-library/jest-native/extend-expect';
// eslint-disable-next-line @typescript-eslint/no-unused-vars

// Reanimated (only if used)
jest.mock('react-native-reanimated', () => require('react-native-reanimated/mock'));

// Mock expo-image-picker to avoid ESM import issues in Jest
jest.mock('expo-image-picker', () => ({
  requestCameraPermissionsAsync: jest.fn().mockResolvedValue({ granted: true }),
  launchCameraAsync: jest.fn().mockResolvedValue({ canceled: true }),
  requestMediaLibraryPermissionsAsync: jest.fn().mockResolvedValue({ granted: true }),
  launchImageLibraryAsync: jest.fn().mockResolvedValue({ canceled: true, assets: [] }),
}));

// Mock react-native-firebase modules to avoid importing ESM native builds in Jest
jest.mock('@react-native-firebase/app', () => ({
  getApp: jest.fn(() => ({})),
}));

jest.mock('@react-native-firebase/firestore', () => ({
  getFirestore: jest.fn(() => ({})),
  collection: jest.fn(() => ({})),
  addDoc: jest.fn(async () => ({ id: 'mock-id' })),
  deleteDoc: jest.fn(async () => {}),
  doc: jest.fn(() => ({})),
  getDoc: jest.fn(async () => ({ exists: () => false })),
  onSnapshot: jest.fn((_ref, success, _error) => {
    // call success with empty snapshot-like object
    const unsubscribe = () => {};
    setTimeout(() => success({ docs: [] }), 0);
    return unsubscribe;
  }),
  updateDoc: jest.fn(async () => {}),
}));

jest.mock('@react-native-firebase/auth', () => ({
  getAuth: jest.fn(() => ({})),
  onAuthStateChanged: jest.fn(() => () => {}),
  signInWithEmailAndPassword: jest.fn(async () => ({})),
  createUserWithEmailAndPassword: jest.fn(async () => ({})),
}));

// Mock react-native-paper components
jest.mock('react-native-paper', () => {
  const React = require('react');
  const RN = require('react-native');
  return {
    Button: ({ onPress, children, disabled }: any) =>
      React.createElement(
        'Pressable',
        { onPress, accessibilityState: { disabled } },
        React.createElement('Text', null, typeof children === 'string' ? children : children)
      ),
    TextInput: ({ label, value, onChangeText, ...props }: any) =>
      React.createElement(RN.TextInput, {
        accessibilityLabel: label,
        testID: label
          ? `input-${String(label).replace(/\*/g, '').trim().replace(/\s+/g, '-')}`
          : undefined,
        value,
        onChangeText,
        ...props,
      }),
    HelperText: ({ children }: any) => React.createElement('Text', null, children),
    IconButton: ({ icon, onPress }: any) =>
      React.createElement('Pressable', { onPress }, React.createElement('Text', null, icon)),
    Text: ({ children }: any) => React.createElement('Text', null, children),
    Divider: ({ children }: any) => React.createElement('Text', null, children),
  };
});

// Mock Themed components
jest.mock('@/components/Themed', () => {
  const React = require('react');
  const RN = require('react-native');
  return { View: (props: any) => React.createElement(RN.View, props, props.children) };
});

// Mock expo-router
jest.mock('expo-router', () => ({ useRouter: () => ({ push: jest.fn(), back: jest.fn() }) }));
