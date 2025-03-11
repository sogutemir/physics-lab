import { Stack } from 'expo-router';

export default function ElectricExperimentsLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="ohm-law"
        options={{
          headerShown: false,
          title: 'Ohm Yasası Deneyi',
          animation: 'slide_from_right',
        }}
      />
      <Stack.Screen
        name="rc-circuit"
        options={{
          headerShown: false,
          title: 'RLC Devre Deneyi',
          animation: 'slide_from_right',
        }}
      />
    </Stack>
  );
}
