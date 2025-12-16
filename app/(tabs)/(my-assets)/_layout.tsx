import { Stack } from 'expo-router';

export default function IndexLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerShown: true,
          title: 'My Assets',
        }}
      />
      <Stack.Screen
        name="details/[id]"
        options={{
          headerShown: true,
          title: 'Asset Details',
        }}
      />
    </Stack>
  );
}
