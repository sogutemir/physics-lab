import React from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity } from 'react-native';
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

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('Kontrol Paneli', 'Control Panel')}</Text>
      </View>

      <View style={styles.controlGroup}>
        <Text style={styles.label}>
          {t('Dalga Boyu', 'Wavelength')} ({wavelength} nm)
        </Text>
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
          {t('Yarık Genişliği', 'Slit Width')} ({slitWidth.toFixed(1)} mm)
        </Text>
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
          {t('Yarık Ayrımı', 'Slit Separation')} ({slitSeparation.toFixed(1)}{' '}
          mm)
        </Text>
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

      <View style={styles.controlGroup}>
        <Text style={styles.label}>
          {t('Kaynak Mesafesi', 'Source Distance')} ({sourceDistance.toFixed(0)}{' '}
          mm)
        </Text>
        <Slider
          value={sourceDistance}
          minimumValue={200}
          maximumValue={1000}
          step={50}
          onValueChange={setSourceDistance}
          minimumTrackTintColor="#3b82f6"
          thumbTintColor="#2563eb"
          style={styles.slider}
        />
      </View>

      <View style={styles.controlGroup}>
        <Text style={styles.label}>
          {t('Ekran Mesafesi', 'Screen Distance')} ({screenDistance.toFixed(0)}{' '}
          mm)
        </Text>
        <Slider
          value={screenDistance}
          minimumValue={200}
          maximumValue={1000}
          step={50}
          onValueChange={setScreenDistance}
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
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
  },
  controlGroup: {
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748b',
    marginBottom: 4,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  button: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
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
});

export default DoubleSlitControlPanel;
