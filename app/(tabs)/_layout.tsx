import { Tabs } from 'expo-router';
import { Beaker, BookOpen, Chrome as Home, Settings } from 'lucide-react-native';
import { StyleSheet } from 'react-native';
import { useLanguage } from '../../components/LanguageContext';

export default function TabLayout() {
  const { t } = useLanguage();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#3498db',
        tabBarStyle: styles.tabBar,
        headerShown: true,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: t('Ana Sayfa', 'Home'),
          tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="experiments"
        options={{
          title: t('Deneyler', 'Experiments'),
          tabBarIcon: ({ color, size }) => <Beaker size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="theory"
        options={{
          title: t('Teori', 'Theory'),
          tabBarIcon: ({ color, size }) => <BookOpen size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: t('Ayarlar', 'Settings'),
          tabBarIcon: ({ color, size }) => <Settings size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    elevation: 0,
    shadowOpacity: 0,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    height: 60,
    paddingBottom: 5,
  },
});