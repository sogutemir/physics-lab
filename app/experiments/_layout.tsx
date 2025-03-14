import { Stack } from 'expo-router';

export default function ExperimentsLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="mechanics/vector-addition"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="mechanics/conical-pendulum"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="mechanics/free-fall"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="mechanics/pendulum"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="mechanics/spring-mass"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="mechanics/inclined-plane"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="mechanics/moment-balance"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="waves/doppler-effect"
        options={{ headerShown: false }}
      />
      <Stack.Screen name="waves/double-slit" options={{ headerShown: false }} />
      <Stack.Screen
        name="waves/transverse-wave"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="basics/coriolis-effect"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="basics/buoyancy"
        options={{
          headerShown: false,
          title: 'Kaldırma Kuvveti Deneyi',
          animation: 'slide_from_right',
        }}
      />
      <Stack.Screen
        name="basics/pressure"
        options={{
          headerShown: false,
          title: 'Sıvı Basıncı Deneyi',
          animation: 'slide_from_right',
        }}
      />
      <Stack.Screen
        name="basics/acceleration"
        options={{
          headerShown: false,
          title: 'İvme Deneyi',
          animation: 'slide_from_right',
        }}
      />
      <Stack.Screen
        name="electric/ohm-law"
        options={{
          headerShown: false,
          title: 'Ohm Yasası Deneyi',
          animation: 'slide_from_right',
        }}
      />
      <Stack.Screen
        name="electric/circuit-builder"
        options={{
          headerShown: false,
          title: 'Devre Oluşturucu Deneyi',
          animation: 'slide_from_right',
        }}
      />
      <Stack.Screen
        name="electric/electric-field"
        options={{
          headerShown: false,
          title: 'Elektrik Alanı Deneyi',
          animation: 'slide_from_right',
        }}
      />
    </Stack>
  );
}
