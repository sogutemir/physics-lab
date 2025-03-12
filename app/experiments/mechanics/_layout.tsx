import { Stack } from 'expo-router';

export default function MechanicsLayout() {
  return (
    <Stack>
      <Stack.Screen name="vector-addition" options={{ headerShown: false }} />
      <Stack.Screen name="conical-pendulum" options={{ headerShown: false }} />
      <Stack.Screen name="free-fall" options={{ headerShown: false }} />
      <Stack.Screen name="pendulum" options={{ headerShown: false }} />
      <Stack.Screen name="spring-mass" options={{ headerShown: false }} />
      <Stack.Screen name="weighted-pulley" options={{ headerShown: false }} />
      <Stack.Screen name="momentum-bullet" options={{ headerShown: false }} />
    </Stack>
  );
}
