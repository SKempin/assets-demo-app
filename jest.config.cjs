module.exports = {
  preset: 'react-native',
  setupFilesAfterEnv: ['<rootDir>/jest-setup.js'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
  },
  // Allow transforming a few ESM packages used by Expo and RN Firebase
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|@react-native-firebase|expo-image-picker|expo-modules-core|expo-modules-autolinking|expo-.*)/)',
  ],
};
