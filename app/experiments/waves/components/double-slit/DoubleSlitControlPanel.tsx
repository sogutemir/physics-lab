import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Dimensions,
} from 'react-native';
import Slider from '@react-native-community/slider';
import { useLanguage } from '../../../../../components/LanguageContext';
import { wavelengthToRGB } from '../../utils/physics';

interface ControlProps {
  wavelength: number;
  setWavelength: (value: number) => void;
  slitWidth: number;
  setSlitWidth: (value: number) => void;
  slitSeparation: number;
  setSlitSeparation: (value: number) => void;
  sourceDistance: number;
  setSourceDistance: (value: number) => void;
  screenDistance: number;
  setScreenDistance: (value: number) => void;
  isRunning: boolean;
  setIsRunning: (value: boolean) => void;
}

const DoubleSlitControlPanel: React.FC<ControlProps> = ({
  wavelength,
  setWavelength,
  slitWidth,
  setSlitWidth,
  slitSeparation,
  setSlitSeparation,
  sourceDistance,
  setSourceDistance,
  screenDistance,
  setScreenDistance,
  isRunning,
  setIsRunning,
}) => {
  const { t } = useLanguage();
  const waveColor = wavelengthToRGB(wavelength);

  // Ekran genişliğini kontrol et
  const { width: screenWidth } = Dimensions.get('window');
  const isMobile = Platform.OS !== 'web' || screenWidth < 768;

  // Mobil cihazlarda maksimum ekran mesafesi
  const maxScreenDistance = isMobile ? 200 : 500;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('Kontrol Paneli', 'Control Panel')}</Text>
      </View>

      <View style={styles.controlsGrid}>
        <View style={styles.controlColumn}>
          <View style={styles.controlGroup}>
            <Text style={styles.label}>{t('Dalga Boyu', 'Wavelength')}</Text>
            <Text style={styles.value}>{wavelength} nm</Text>
            <Slider
              value={wavelength}
              minimumValue={380}
              maximumValue={750}
              step={10}
              onValueChange={setWavelength}
              minimumTrackTintColor={waveColor}
              thumbTintColor={waveColor}
              style={styles.slider}
            />
          </View>

          <View style={styles.controlGroup}>
            <Text style={styles.label}>
              {t('Yarık Genişliği', 'Slit Width')}
            </Text>
            <Text style={styles.value}>{slitWidth.toFixed(1)} mm</Text>
            <Slider
              value={slitWidth}
              minimumValue={0.1}
              maximumValue={2}
              step={0.1}
              onValueChange={setSlitWidth}
              minimumTrackTintColor="#3b82f6"
              thumbTintColor="#2563eb"
              style={styles.slider}
            />
          </View>

          <View style={styles.controlGroup}>
            <Text style={styles.label}>
              {t('Yarık Ayrımı', 'Slit Separation')}
            </Text>
            <Text style={styles.value}>{slitSeparation.toFixed(1)} mm</Text>
            <Slider
              value={slitSeparation}
              minimumValue={0.5}
              maximumValue={10}
              step={0.5}
              onValueChange={setSlitSeparation}
              minimumTrackTintColor="#3b82f6"
              thumbTintColor="#2563eb"
              style={styles.slider}
            />
          </View>
        </View>

        <View style={styles.controlColumn}>
          <View style={styles.controlGroup}>
            <Text style={styles.label}>
              {t('Kaynak Mesafesi', 'Source Distance')}
            </Text>
            <Text style={styles.value}>{sourceDistance.toFixed(0)} mm</Text>
            <Slider
              value={sourceDistance}
              minimumValue={50}
              maximumValue={300}
              step={10}
              onValueChange={setSourceDistance}
              minimumTrackTintColor="#3b82f6"
              thumbTintColor="#2563eb"
              style={styles.slider}
            />
          </View>

          <View style={styles.controlGroup}>
            <Text style={styles.label}>
              {t('Ekran Mesafesi', 'Screen Distance')}
              {isMobile && (
                <Text style={styles.mobileNote}>
                  {' '}
                  {t('(Mobilde maks. 200mm)', '(Max 200mm on mobile)')}
                </Text>
              )}
            </Text>
            <Text style={styles.value}>{screenDistance.toFixed(0)} mm</Text>
            <Slider
              value={screenDistance}
              minimumValue={50}
              maximumValue={maxScreenDistance}
              step={10}
              onValueChange={(value) => {
                // Mobilde 200mm'den fazla değer seçilememesini sağla
                if (isMobile && value > 200) {
                  setScreenDistance(200);
                } else {
                  setScreenDistance(value);
                }
              }}
              minimumTrackTintColor="#3b82f6"
              thumbTintColor="#2563eb"
              style={styles.slider}
            />
          </View>

          <View style={styles.controlGroup}>
            <TouchableOpacity
              onPress={() => setIsRunning(!isRunning)}
              style={[
                styles.button,
                isRunning ? styles.stopButton : styles.startButton,
              ]}
            >
              <Text style={styles.buttonText}>
                {isRunning ? t('Durdur', 'Stop') : t('Başlat', 'Start')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    textAlign: 'center',
  },
  controlsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  controlColumn: {
    flex: 1,
    paddingHorizontal: 4,
  },
  controlGroup: {
    marginBottom: 10,
  },
  label: {
    fontSize: 12,
    fontWeight: '500',
    color: '#64748b',
    marginBottom: 2,
  },
  value: {
    fontSize: 12,
    fontFamily: 'monospace',
    color: '#0f172a',
    marginBottom: 4,
  },
  slider: {
    width: '100%',
    height: 30,
  },
  button: {
    padding: 10,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
  },
  startButton: {
    backgroundColor: '#22c55e',
  },
  stopButton: {
    backgroundColor: '#ef4444',
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
  },
  mobileNote: {
    fontSize: 9,
    fontStyle: 'italic',
    color: '#94a3b8',
  },
});

export default DoubleSlitControlPanel;
