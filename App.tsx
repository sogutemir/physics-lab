import React from 'react';
import { View } from 'react-native';
import { Stack } from 'expo-router';
import { LanguageProvider } from './components/LanguageContext';
import Toast from 'react-native-toast-message';

export default function App() {
  return (
    <LanguageProvider>
      <View style={{ flex: 1 }}>
        <Stack />
        <Toast />
      </View>
    </LanguageProvider>
  );
}
