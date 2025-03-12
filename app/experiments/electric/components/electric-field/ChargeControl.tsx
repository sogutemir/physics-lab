import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Dimensions,
} from 'react-native';
import Slider from '@react-native-community/slider';
import { useLanguage } from '../../../../../components/LanguageContext';

interface ChargeControlProps {
  onAddPositiveCharge: (value: number) => void;
  onAddNegativeCharge: (value: number) => void;
  onClearCharges: () => void;
  onPlay: () => void;
  onPause: () => void;
  isRunning: boolean;
}

// Özel Slider bileşeni
interface ValueSliderProps {
  value: number;
  onValueChange: (value: number) => void;
  minimumValue: number;
  maximumValue: number;
  step: number;
  minimumTrackTintColor: string;
  maximumTrackTintColor: string;
}

const ValueSlider: React.FC<ValueSliderProps> = ({
  value,
  onValueChange,
  minimumValue,
  maximumValue,
  step,
  minimumTrackTintColor,
  maximumTrackTintColor,
}) => {
  return (
    <Slider
      value={value}
      onValueChange={onValueChange}
      minimumValue={minimumValue}
      maximumValue={maximumValue}
      step={step}
      minimumTrackTintColor={minimumTrackTintColor}
      maximumTrackTintColor={maximumTrackTintColor}
      style={styles.slider}
    />
  );
};

const ChargeControl: React.FC<ChargeControlProps> = ({
  onAddPositiveCharge,
  onAddNegativeCharge,
  onClearCharges,
  onPlay,
  onPause,
  isRunning,
}) => {
  const { t } = useLanguage();
  const [chargeValue, setChargeValue] = useState<number>(1);
  const isWeb = Platform.OS === 'web';
  const screenWidth = Dimensions.get('window').width;
  const isMobile = !isWeb || screenWidth < 768;

  return (
    <View style={[styles.container, isMobile && styles.containerMobile]}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('Yük Kontrolü', 'Charge Controls')}</Text>
        <View style={styles.simControls}>
          <TouchableOpacity
            style={[styles.button, styles.smallButton]}
            onPress={isRunning ? onPause : onPlay}
          >
            <Text style={styles.buttonText}>
              {isRunning ? t('Durdur', 'Pause') : t('Başlat', 'Start')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.smallButton, styles.clearButton]}
            onPress={onClearCharges}
          >
            <Text style={styles.buttonText}>{t('Temizle', 'Clear')}</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.sliderContainer}>
        <View style={styles.sliderLabelRow}>
          <Text style={styles.sliderLabel}>
            {t('Yük Değeri:', 'Charge Value:')}
          </Text>
          <Text style={styles.sliderValue}>{chargeValue.toFixed(1)}</Text>
        </View>
        <ValueSlider
          value={chargeValue}
          onValueChange={setChargeValue}
          minimumValue={0.1}
          maximumValue={5}
          step={0.1}
          minimumTrackTintColor="#3498db"
          maximumTrackTintColor="#bdc3c7"
        />
      </View>

      <View style={styles.chargeButtons}>
        <TouchableOpacity
          style={[styles.button, styles.positiveButton]}
          onPress={() => onAddPositiveCharge(chargeValue)}
        >
          <Text style={styles.buttonText}>
            {t('+ Pozitif Yük Ekle', '+ Add Positive Charge')}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.negativeButton]}
          onPress={() => onAddNegativeCharge(chargeValue)}
        >
          <Text style={styles.buttonText}>
            {t('- Negatif Yük Ekle', '- Add Negative Charge')}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>
          {t(
            'İpucu: Yükleri sürükleyerek hareket ettirebilirsiniz. Simülasyon başladığında sabit olmayan yükler birbirlerini etkileyecektir.',
            'Tip: You can drag charges to move them. When the simulation starts, non-fixed charges will be affected by each other.'
          )}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    flex: 1,
    minWidth: Platform.OS === 'web' ? 320 : '100%',
    maxWidth: Platform.OS === 'web' ? 400 : '100%',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
      web: {
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      },
    }),
  },
  containerMobile: {
    maxWidth: '100%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    flexWrap: 'wrap',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 4,
  },
  simControls: {
    flexDirection: 'row',
  },
  sliderContainer: {
    marginBottom: 16,
  },
  sliderLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sliderLabel: {
    fontSize: 14,
    color: '#555',
  },
  sliderValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2c3e50',
  },
  slider: {
    width: '100%',
    height: 40,
  },
  chargeButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    flexWrap: 'wrap',
    gap: 8,
  },
  button: {
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 100,
  },
  smallButton: {
    padding: 8,
    paddingHorizontal: 16,
    marginLeft: 8,
    minWidth: 0,
  },
  positiveButton: {
    backgroundColor: '#e74c3c',
    flex: 1,
    marginRight: 4,
  },
  negativeButton: {
    backgroundColor: '#3498db',
    flex: 1,
    marginLeft: 4,
  },
  clearButton: {
    backgroundColor: '#95a5a6',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '500',
    fontSize: 14,
  },
  infoContainer: {
    backgroundColor: 'rgba(52, 152, 219, 0.1)',
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  infoText: {
    fontSize: 13,
    color: '#2980b9',
    lineHeight: 18,
  },
});

export default ChargeControl;
