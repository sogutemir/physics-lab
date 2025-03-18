import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Slider from '@react-native-community/slider';
import { useLanguage } from '../../../../../components/LanguageContext';
import { wavelengthToRGB } from '../../utils/physics';

interface ControlPanelProps {
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

const DoubleSlitControlPanel: React.FC<ControlPanelProps> = ({
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
        <Text style={styles.title}>
          {t('Deney Kontrolleri', 'Experiment Controls')}
        </Text>
        <TouchableOpacity
          onPress={() => setIsRunning(!isRunning)}
          style={[
            styles.button,
            isRunning ? styles.pauseButton : styles.startButton,
          ]}
        >
          <Text style={styles.buttonText}>
            {isRunning ? t('Durdur', 'Pause') : t('Başlat', 'Start')}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.controlsContainer}>
        {/* Dalga Boyu Kontrolü */}
        <View style={styles.controlItem}>
          <View style={styles.labelContainer}>
            <Text style={styles.label}>{t('Dalga Boyu', 'Wavelength')}</Text>
            <Text style={styles.value}>{wavelength} nm</Text>
          </View>
          <Slider
            value={wavelength}
            minimumValue={380}
            maximumValue={780}
            step={1}
            onValueChange={setWavelength}
            minimumTrackTintColor={waveColor}
            maximumTrackTintColor="#d1d5db"
            thumbTintColor={waveColor}
            style={styles.slider}
          />
          <View style={styles.rangeLabels}>
            <Text style={styles.rangeLabel}>380 nm</Text>
            <Text style={styles.rangeLabel}>780 nm</Text>
          </View>
        </View>

        {/* Yarık Genişliği Kontrolü */}
        <View style={styles.controlItem}>
          <View style={styles.labelContainer}>
            <Text style={styles.label}>
              {t('Yarık Genişliği', 'Slit Width')}
            </Text>
            <Text style={styles.value}>{slitWidth.toFixed(2)} mm</Text>
          </View>
          <Slider
            value={slitWidth}
            minimumValue={0.05}
            maximumValue={1}
            step={0.01}
            onValueChange={setSlitWidth}
            minimumTrackTintColor="#3b82f6"
            maximumTrackTintColor="#d1d5db"
            thumbTintColor="#3b82f6"
            style={styles.slider}
          />
          <View style={styles.rangeLabels}>
            <Text style={styles.rangeLabel}>0.05 mm</Text>
            <Text style={styles.rangeLabel}>1.0 mm</Text>
          </View>
        </View>

        {/* Yarık Ayrımı Kontrolü */}
        <View style={styles.controlItem}>
          <View style={styles.labelContainer}>
            <Text style={styles.label}>
              {t('Yarık Ayrımı', 'Slit Separation')}
            </Text>
            <Text style={styles.value}>{slitSeparation.toFixed(1)} mm</Text>
          </View>
          <Slider
            value={slitSeparation}
            minimumValue={0.5}
            maximumValue={10}
            step={0.1}
            onValueChange={setSlitSeparation}
            minimumTrackTintColor="#3b82f6"
            maximumTrackTintColor="#d1d5db"
            thumbTintColor="#3b82f6"
            style={styles.slider}
          />
          <View style={styles.rangeLabels}>
            <Text style={styles.rangeLabel}>0.5 mm</Text>
            <Text style={styles.rangeLabel}>10.0 mm</Text>
          </View>
        </View>

        {/* Kaynak Mesafesi Kontrolü */}
        <View style={styles.controlItem}>
          <View style={styles.labelContainer}>
            <Text style={styles.label}>
              {t('Kaynak Mesafesi', 'Source Distance')}
            </Text>
            <Text style={styles.value}>{sourceDistance.toFixed(0)} mm</Text>
          </View>
          <Slider
            value={sourceDistance}
            minimumValue={100}
            maximumValue={500}
            step={10}
            onValueChange={setSourceDistance}
            minimumTrackTintColor="#3b82f6"
            maximumTrackTintColor="#d1d5db"
            thumbTintColor="#3b82f6"
            style={styles.slider}
          />
          <View style={styles.rangeLabels}>
            <Text style={styles.rangeLabel}>100 mm</Text>
            <Text style={styles.rangeLabel}>500 mm</Text>
          </View>
        </View>

        {/* Ekran Mesafesi Kontrolü */}
        <View style={styles.controlItem}>
          <View style={styles.labelContainer}>
            <Text style={styles.label}>
              {t('Ekran Mesafesi', 'Screen Distance')}
            </Text>
            <Text style={styles.value}>{screenDistance.toFixed(0)} mm</Text>
          </View>
          <Slider
            value={screenDistance}
            minimumValue={100}
            maximumValue={1000}
            step={10}
            onValueChange={setScreenDistance}
            minimumTrackTintColor="#3b82f6"
            maximumTrackTintColor="#d1d5db"
            thumbTintColor="#3b82f6"
            style={styles.slider}
          />
          <View style={styles.rangeLabels}>
            <Text style={styles.rangeLabel}>100 mm</Text>
            <Text style={styles.rangeLabel}>1000 mm</Text>
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
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  button: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  startButton: {
    backgroundColor: '#3b82f6',
  },
  pauseButton: {
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#ffffff',
  },
  controlsContainer: {
    gap: 20,
  },
  controlItem: {
    marginBottom: 16,
  },
  labelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4b5563',
  },
  value: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3b82f6',
    fontFamily: 'monospace',
  },
  slider: {
    width: '100%',
    height: 40,
  },
  rangeLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  rangeLabel: {
    fontSize: 12,
    color: '#9ca3af',
  },
});

export default DoubleSlitControlPanel;
