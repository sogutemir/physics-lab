import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Switch, TouchableOpacity, Platform, Alert } from 'react-native';
import { ChevronRight, CircleHelp as HelpCircle, Info, Languages, Moon, Settings as SettingsIcon, Volume2 } from 'lucide-react-native';
import { useLanguage } from '../../components/LanguageContext';

export default function SettingsScreen() {
  const [darkMode, setDarkMode] = useState(false);
  const [soundEffects, setSoundEffects] = useState(true);
  const [highQualityGraphics, setHighQualityGraphics] = useState(true);
  const [showHints, setShowHints] = useState(true);
  const { language, setLanguage, t } = useLanguage();

  const handleLanguageChange = () => {
    const newLanguage = language === 'tr' ? 'en' : 'tr';
    setLanguage(newLanguage);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('Ayarlar', 'Settings')}</Text>
        <Text style={styles.subtitle}>
          {t('Uygulama tercihlerinizi özelleştirin', 'Customize your application preferences')}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('Görünüm', 'Appearance')}</Text>
        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <View style={styles.iconContainer}>
              <Moon size={22} color="#3498db" />
            </View>
            <Text style={styles.settingLabel}>{t('Karanlık Mod', 'Dark Mode')}</Text>
          </View>
          <Switch
            value={darkMode}
            onValueChange={setDarkMode}
            trackColor={{ false: '#e0e0e0', true: '#bde0fe' }}
            thumbColor={darkMode ? '#3498db' : '#f4f3f4'}
            ios_backgroundColor="#e0e0e0"
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('Ses ve Görüntü', 'Sound and Display')}</Text>
        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <View style={styles.iconContainer}>
              <Volume2 size={22} color="#3498db" />
            </View>
            <Text style={styles.settingLabel}>{t('Ses Efektleri', 'Sound Effects')}</Text>
          </View>
          <Switch
            value={soundEffects}
            onValueChange={setSoundEffects}
            trackColor={{ false: '#e0e0e0', true: '#bde0fe' }}
            thumbColor={soundEffects ? '#3498db' : '#f4f3f4'}
            ios_backgroundColor="#e0e0e0"
          />
        </View>

        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <View style={styles.iconContainer}>
              <SettingsIcon size={22} color="#3498db" />
            </View>
            <Text style={styles.settingLabel}>{t('Yüksek Kalite Grafikler', 'High Quality Graphics')}</Text>
          </View>
          <Switch
            value={highQualityGraphics}
            onValueChange={setHighQualityGraphics}
            trackColor={{ false: '#e0e0e0', true: '#bde0fe' }}
            thumbColor={highQualityGraphics ? '#3498db' : '#f4f3f4'}
            ios_backgroundColor="#e0e0e0"
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('Deneyler', 'Experiments')}</Text>
        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <View style={styles.iconContainer}>
              <HelpCircle size={22} color="#3498db" />
            </View>
            <Text style={styles.settingLabel}>{t('İpuçlarını Göster', 'Show Hints')}</Text>
          </View>
          <Switch
            value={showHints}
            onValueChange={setShowHints}
            trackColor={{ false: '#e0e0e0', true: '#bde0fe' }}
            thumbColor={showHints ? '#3498db' : '#f4f3f4'}
            ios_backgroundColor="#e0e0e0"
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('Dil', 'Language')}</Text>
        <TouchableOpacity 
          style={styles.settingItemWithArrow}
          onPress={handleLanguageChange}
        >
          <View style={styles.settingInfo}>
            <View style={styles.iconContainer}>
              <Languages size={22} color="#3498db" />
            </View>
            <Text style={styles.settingLabel}>{t('Uygulama Dili', 'Application Language')}</Text>
          </View>
          <View style={styles.settingAction}>
            <Text style={styles.settingValue}>{language === 'tr' ? 'Türkçe' : 'English'}</Text>
            <ChevronRight size={20} color="#7f8c8d" />
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('Hakkında', 'About')}</Text>
        <TouchableOpacity style={styles.settingItemWithArrow}>
          <View style={styles.settingInfo}>
            <View style={styles.iconContainer}>
              <Info size={22} color="#3498db" />
            </View>
            <Text style={styles.settingLabel}>{t('Uygulama Hakkında', 'About Application')}</Text>
          </View>
          <ChevronRight size={20} color="#7f8c8d" />
        </TouchableOpacity>
      </View>

      <View style={styles.versionContainer}>
        <Text style={styles.versionText}>{t('Sürüm 1.0.0', 'Version 1.0.0')}</Text>
        <Text style={styles.copyrightText}>{t('© 2025 Sanal Fizik Laboratuvarı', '© 2025 Virtual Physics Laboratory')}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  header: {
    padding: 20,
    paddingTop: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  subtitle: {
    fontSize: 16,
    color: '#7f8c8d',
    marginTop: 5,
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 15,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  settingItemWithArrow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#ecf0f1',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  settingLabel: {
    fontSize: 16,
    color: '#2c3e50',
  },
  settingAction: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingValue: {
    fontSize: 16,
    color: '#7f8c8d',
    marginRight: 10,
  },
  versionContainer: {
    alignItems: 'center',
    padding: 20,
    marginBottom: 20,
  },
  versionText: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  copyrightText: {
    fontSize: 14,
    color: '#7f8c8d',
    marginTop: 5,
  },
});