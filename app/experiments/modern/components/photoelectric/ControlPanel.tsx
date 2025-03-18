import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Platform,
} from 'react-native';
import { useLanguage } from '../../../../../components/LanguageContext';
import Slider from '@react-native-community/slider';
import {
  MetalType,
  METAL_NAMES_TR,
  METAL_NAMES_EN,
  frequencyToWavelength,
  wavelengthToFrequency,
} from '../../utils/photoelectric';

interface ControlPanelProps {
  frequency: number;
  setFrequency: (value: number) => void;
  intensity: number;
  setIntensity: (value: number) => void;
  metalType: MetalType;
  setMetalType: (value: MetalType) => void;
  stoppingVoltage: number;
  setStoppingVoltage: (value: number) => void;
  temperature: number;
  setTemperature: (value: number) => void;
  isLightOn: boolean;
  setIsLightOn: (value: boolean) => void;
}

const MIN_FREQUENCY = 1e14; // 100 THz
const MAX_FREQUENCY = 2e15; // 2000 THz

const ControlPanel: React.FC<ControlPanelProps> = ({
  frequency,
  setFrequency,
  intensity,
  setIntensity,
  metalType,
  setMetalType,
  stoppingVoltage,
  setStoppingVoltage,
  temperature,
  setTemperature,
  isLightOn,
  setIsLightOn,
}) => {
  const { language, t } = useLanguage();

  // Animasyon değişkenleri
  const [lastChanged, setLastChanged] = useState<string | null>(null);
  const valueAnimations = {
    frequency: React.useRef(new Animated.Value(1)).current,
    intensity: React.useRef(new Animated.Value(1)).current,
    voltage: React.useRef(new Animated.Value(1)).current,
    temperature: React.useRef(new Animated.Value(1)).current,
  };

  // Frekans ve dalga boyu dönüşümleri
  const wavelength = frequencyToWavelength(frequency);

  // Işığı otomatik olarak açık tut
  useEffect(() => {
    if (!isLightOn) {
      setIsLightOn(true);
    }
  }, [isLightOn, setIsLightOn]);

  // Değişiklik olduğunda animasyon gösterme
  const animateChange = (param: keyof typeof valueAnimations) => {
    setLastChanged(param);
    Animated.sequence([
      Animated.timing(valueAnimations[param], {
        toValue: 1.2,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(valueAnimations[param], {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
  };

  // Dile göre metal isimlerini seç
  const metalNames = language === 'tr' ? METAL_NAMES_TR : METAL_NAMES_EN;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {t('Deney Parametreleri', 'Experiment Parameters')}
      </Text>

      {/* Dalga boyu / Frekans kontrolü */}
      <View style={styles.control}>
        <View style={styles.controlHeader}>
          <Text style={styles.label}>{t('Dalga Boyu', 'Wavelength')}</Text>
          <Animated.Text
            style={[
              styles.value,
              { transform: [{ scale: valueAnimations.frequency }] },
            ]}
          >
            {wavelength.toFixed(0)} nm
          </Animated.Text>
        </View>
        <Slider
          minimumValue={MIN_FREQUENCY}
          maximumValue={MAX_FREQUENCY}
          step={(MAX_FREQUENCY - MIN_FREQUENCY) / 1000}
          value={frequency}
          onValueChange={(value) => {
            setFrequency(value);
            animateChange('frequency');
          }}
          minimumTrackTintColor="#3498db"
          maximumTrackTintColor="#bdc3c7"
          thumbTintColor="#3498db"
        />
        <View style={styles.sliderLabels}>
          <Text style={styles.sliderLabel}>
            {t('Kırmızı (750nm)', 'Red (750nm)')}
          </Text>
          <Text style={styles.sliderLabel}>
            {t('Mor (380nm)', 'Violet (380nm)')}
          </Text>
        </View>
      </View>

      {/* Işık şiddeti kontrolü */}
      <View style={styles.control}>
        <View style={styles.controlHeader}>
          <Text style={styles.label}>
            {t('Işık Şiddeti', 'Light Intensity')}
          </Text>
          <Animated.Text
            style={[
              styles.value,
              { transform: [{ scale: valueAnimations.intensity }] },
            ]}
          >
            {intensity.toFixed(0)}%
          </Animated.Text>
        </View>
        <Slider
          minimumValue={0}
          maximumValue={100}
          step={1}
          value={intensity}
          onValueChange={(value) => {
            setIntensity(value);
            animateChange('intensity');
          }}
          minimumTrackTintColor="#3498db"
          maximumTrackTintColor="#bdc3c7"
          thumbTintColor="#3498db"
        />
      </View>

      {/* Metal türü seçimi */}
      <View style={styles.control}>
        <Text style={styles.label}>{t('Metal Türü', 'Metal Type')}</Text>
        <View style={styles.metalTypeSelector}>
          {Object.entries(metalNames).map(([key, value]) => (
            <TouchableOpacity
              key={key}
              style={[
                styles.metalTypeButton,
                metalType === key ? styles.metalTypeButtonActive : null,
              ]}
              onPress={() => setMetalType(key as MetalType)}
            >
              <Text
                style={[
                  styles.metalTypeButtonText,
                  metalType === key ? styles.metalTypeButtonTextActive : null,
                ]}
              >
                {value}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Durdurucu potansiyel kontrolü */}
      <View style={styles.control}>
        <View style={styles.controlHeader}>
          <Text style={styles.label}>
            {t('Durdurucu Potansiyel', 'Stopping Potential')}
          </Text>
          <Animated.Text
            style={[
              styles.value,
              { transform: [{ scale: valueAnimations.voltage }] },
            ]}
          >
            {stoppingVoltage.toFixed(2)} V
          </Animated.Text>
        </View>
        <Slider
          minimumValue={-1}
          maximumValue={5}
          step={0.1}
          value={stoppingVoltage}
          onValueChange={(value) => {
            setStoppingVoltage(value);
            animateChange('voltage');
          }}
          minimumTrackTintColor="#3498db"
          maximumTrackTintColor="#bdc3c7"
          thumbTintColor="#3498db"
        />
      </View>

      {/* Sıcaklık kontrolü */}
      <View style={styles.control}>
        <View style={styles.controlHeader}>
          <Text style={styles.label}>{t('Sıcaklık', 'Temperature')}</Text>
          <Animated.Text
            style={[
              styles.value,
              { transform: [{ scale: valueAnimations.temperature }] },
            ]}
          >
            {temperature.toFixed(0)} K
          </Animated.Text>
        </View>
        <Slider
          minimumValue={100}
          maximumValue={500}
          step={10}
          value={temperature}
          onValueChange={(value) => {
            setTemperature(value);
            animateChange('temperature');
          }}
          minimumTrackTintColor="#3498db"
          maximumTrackTintColor="#bdc3c7"
          thumbTintColor="#3498db"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#2c3e50',
  },
  controlRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  control: {
    marginBottom: 16,
  },
  controlHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#34495e',
  },
  value: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  sliderLabel: {
    fontSize: 12,
    color: '#95a5a6',
  },
  button: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonActive: {
    backgroundColor: '#3498db',
  },
  buttonInactive: {
    backgroundColor: '#95a5a6',
  },
  buttonText: {
    color: 'white',
    fontWeight: '500',
  },
  metalTypeSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
    gap: 8,
  },
  metalTypeButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: 'white',
  },
  metalTypeButtonActive: {
    backgroundColor: '#3498db',
    borderColor: '#3498db',
  },
  metalTypeButtonText: {
    fontSize: 14,
    color: '#34495e',
  },
  metalTypeButtonTextActive: {
    color: 'white',
    fontWeight: '500',
  },
});

export default ControlPanel;
