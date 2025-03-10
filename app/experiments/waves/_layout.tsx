import { Stack } from 'expo-router';

export default function WavesLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="doppler-effect"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="double-slit"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="transverse-wave"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}
