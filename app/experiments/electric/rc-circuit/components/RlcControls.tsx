import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Slider from '@react-native-community/slider';
import { useLanguage } from '../../../../../components/LanguageContext';
import { RlcState } from '../utils/types';

interface RlcControlsProps {
  state: RlcState;
  onStartStop: () => void;
  onReset: () => void;
  onVoltageChange: (voltage: number) => void;
  onFrequencyChange: (frequency: number) => void;
  onResistanceChange: (resistance: number) => void;
  onCapacitanceChange: (capacitance: number) => void;
  onInductanceChange: (inductance: number) => void;
  onResonance: () => void;
  resonanceFrequency: number;
}

const RlcControls: React.FC<RlcControlsProps> = ({
  state,
  onStartStop,
  onReset,
  onVoltageChange,
  onFrequencyChange,
  onResistanceChange,
  onCapacitanceChange,
  onInductanceChange,
  onResonance,
  resonanceFrequency,
}) => {
  const { t } = useLanguage();

  return (
    <View style={styles.container}>
      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={[styles.button, styles.primaryButton]}
          onPress={onStartStop}
        >
          <Text style={styles.buttonText}>
            {state.isRunning ? t('Durdur', 'Stop') : t('Başlat', 'Start')}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.secondaryButton]}
          onPress={onReset}
        >
          <Text style={styles.buttonText}>{t('Sıfırla', 'Reset')}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.accentButton]}
          onPress={onResonance}
        >
          <Text style={styles.buttonText}>{t('Rezonans', 'Resonance')}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.resonanceInfo}>
        <Text style={styles.resonanceText}>
          {t('Rezonans Frekansı', 'Resonance Frequency')}:{' '}
          {resonanceFrequency.toFixed(1)} Hz
        </Text>
      </View>

      <View style={styles.slidersContainer}>
        <View style={styles.sliderContainer}>
          <View style={styles.sliderHeader}>
            <Text style={[styles.sliderLabel, styles.voltageText]}>
              {t('Gerilim (V₀)', 'Voltage (V₀)')}
            </Text>
            <Text style={[styles.sliderValue, styles.voltageText]}>
              {state.voltage.toFixed(1)} V
            </Text>
          </View>
          <Slider
            value={state.voltage}
            onValueChange={onVoltageChange}
            minimumValue={2}
            maximumValue={9}
            step={0.1}
            minimumTrackTintColor="#3498db"
            maximumTrackTintColor="rgba(52, 152, 219, 0.2)"
            thumbTintColor="#3498db"
            style={styles.slider}
          />
        </View>

        <View style={styles.sliderContainer}>
          <View style={styles.sliderHeader}>
            <Text style={[styles.sliderLabel, styles.voltageText]}>
              {t('Frekans (ω)', 'Frequency (ω)')}
            </Text>
            <Text style={[styles.sliderValue, styles.voltageText]}>
              {state.frequency.toFixed(1)} Hz
            </Text>
          </View>
          <Slider
            value={state.frequency}
            onValueChange={onFrequencyChange}
            minimumValue={10}
            maximumValue={1000}
            step={1}
            minimumTrackTintColor="#3498db"
            maximumTrackTintColor="rgba(52, 152, 219, 0.2)"
            thumbTintColor="#3498db"
            style={styles.slider}
          />
        </View>

        <View style={styles.sliderContainer}>
          <View style={styles.sliderHeader}>
            <Text style={[styles.sliderLabel, styles.resistanceText]}>
              {t('Direnç (R)', 'Resistance (R)')}
            </Text>
            <Text style={[styles.sliderValue, styles.resistanceText]}>
              {(state.resistance * 0.1).toFixed(1)} Ω
            </Text>
          </View>
          <Slider
            value={state.resistance}
            onValueChange={onResistanceChange}
            minimumValue={10}
            maximumValue={500}
            step={1}
            minimumTrackTintColor="#e74c3c"
            maximumTrackTintColor="rgba(231, 76, 60, 0.2)"
            thumbTintColor="#e74c3c"
            style={styles.slider}
          />
        </View>

        <View style={styles.sliderContainer}>
          <View style={styles.sliderHeader}>
            <Text style={[styles.sliderLabel, styles.capacitanceText]}>
              {t('Kapasitans (C)', 'Capacitance (C)')}
            </Text>
            <Text style={[styles.sliderValue, styles.capacitanceText]}>
              {state.capacitance.toFixed(0)} μF
            </Text>
          </View>
          <Slider
            value={state.capacitance}
            onValueChange={onCapacitanceChange}
            minimumValue={10}
            maximumValue={1000}
            step={1}
            minimumTrackTintColor="#3498db"
            maximumTrackTintColor="rgba(52, 152, 219, 0.2)"
            thumbTintColor="#3498db"
            style={styles.slider}
          />
        </View>

        <View style={styles.sliderContainer}>
          <View style={styles.sliderHeader}>
            <Text style={[styles.sliderLabel, styles.inductanceText]}>
              {t('İndüktans (L)', 'Inductance (L)')}
            </Text>
            <Text style={[styles.sliderValue, styles.inductanceText]}>
              {state.inductance.toFixed(1)} mH
            </Text>
          </View>
          <Slider
            value={state.inductance}
            onValueChange={onInductanceChange}
            minimumValue={10}
            maximumValue={1000}
            step={1}
            minimumTrackTintColor="#2ecc71"
            maximumTrackTintColor="rgba(46, 204, 113, 0.2)"
            thumbTintColor="#2ecc71"
            style={styles.slider}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
    padding: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  button: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 4,
  },
  primaryButton: {
    backgroundColor: '#3498db',
  },
  secondaryButton: {
    backgroundColor: '#95a5a6',
  },
  accentButton: {
    backgroundColor: '#9b59b6',
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
  resonanceInfo: {
    backgroundColor: 'rgba(155, 89, 182, 0.1)',
    padding: 10,
    borderRadius: 8,
    marginBottom: 16,
  },
  resonanceText: {
    color: '#9b59b6',
    fontWeight: '500',
    textAlign: 'center',
  },
  slidersContainer: {
    marginTop: 8,
  },
  sliderContainer: {
    marginBottom: 16,
  },
  sliderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sliderLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  sliderValue: {
    fontSize: 14,
    fontWeight: '700',
  },
  slider: {
    width: '100%',
    height: 40,
  },
  voltageText: {
    color: '#3498db',
  },
  resistanceText: {
    color: '#e74c3c',
  },
  capacitanceText: {
    color: '#3498db',
  },
  inductanceText: {
    color: '#2ecc71',
  },
});

export default RlcControls;
