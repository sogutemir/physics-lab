import { Stack } from 'expo-router';

export default function WavesLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="transverse-wave"
        options={{
          headerShown: false,
          title: 'Transverse Wave',
          animation: 'slide_from_right',
        }}
      />
      <Stack.Screen
        name="doppler-effect"
        options={{
          headerShown: false,
          title: 'Doppler Effect',
          animation: 'slide_from_right',
        }}
      />
      <Stack.Screen
        name="double-slit"
        options={{
          headerShown: false,
          title: 'Double-Slit Experiment',
          animation: 'slide_from_right',
        }}
      />
    </Stack>
  );
}
