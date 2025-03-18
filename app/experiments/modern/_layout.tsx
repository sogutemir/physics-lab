import { Stack } from 'expo-router';
import { useLanguage } from '../../../components/LanguageContext';

export default function ModernPhysicsLayout() {
  const { language } = useLanguage();

  return (
    <Stack>
      <Stack.Screen
        name="photoelectric"
        options={{
          headerShown: false,
          title:
            language === 'tr' ? 'Fotoelektrik Olay' : 'Photoelectric Effect',
          animation: 'slide_from_right',
        }}
      />
    </Stack>
  );
}
