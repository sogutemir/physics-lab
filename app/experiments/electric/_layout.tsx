import { Stack } from 'expo-router';
import { useLanguage } from '../../../components/LanguageContext';

export default function ElectricLayout() {
  const { t } = useLanguage();

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: '#3498db',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: t('Elektrik Deneyleri', 'Electric Experiments'),
        }}
      />
      <Stack.Screen
        name="ohm-law"
        options={{
          title: t('Ohm Yasası', "Ohm's Law"),
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="circuit-builder"
        options={{
          title: t('Devre Oluşturucu', 'Circuit Builder'),
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="electric-field"
        options={{
          title: t('Elektrik Alanı', 'Electric Field'),
          headerShown: false,
        }}
      />
    </Stack>
  );
}
