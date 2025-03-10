import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Slider from '@react-native-community/slider';
import { useLanguage } from '../../../../../components/LanguageContext';
import { TransverseWaveControlsProps } from './types';

export const TransverseWaveControls: React.FC<TransverseWaveControlsProps> = ({
  state,
  onAmplitudeChange,
  onWavelengthChange,
  onSpeedChange,
  onDirectionChange,
  onVelocityToggle,
  onMarkedPointsChange,
  onStepSizeChange,
  onPeriodGraphToggle,
}) => {
  const { t } = useLanguage();

  return (
    <View style={styles.container}>
      <View style={styles.controlGroup}>
        <Text style={styles.label}>
          {t('Genlik', 'Amplitude')}: {state.amplitude.toFixed(0)}
        </Text>
        <Slider
          style={styles.slider}
          minimumValue={10}
          maximumValue={100}
          step={5}
          value={state.amplitude}
          onValueChange={onAmplitudeChange}
          minimumTrackTintColor="#4263eb"
          maximumTrackTintColor="#e9ecef"
          thumbTintColor="#4263eb"
        />
      </View>

      <View style={styles.controlGroup}>
        <Text style={styles.label}>
          {t('Dalga Boyu', 'Wavelength')}: {state.wavelength.toFixed(0)}
        </Text>
        <Slider
          style={styles.slider}
          minimumValue={50}
          maximumValue={400}
          step={10}
          value={state.wavelength}
          onValueChange={onWavelengthChange}
          minimumTrackTintColor="#4263eb"
          maximumTrackTintColor="#e9ecef"
          thumbTintColor="#4263eb"
        />
      </View>

      <View style={styles.controlGroup}>
        <Text style={styles.label}>
          {t('Dalga Hızı', 'Wave Speed')}: {state.waveSpeed.toFixed(0)}
        </Text>
        <Slider
          style={styles.slider}
          minimumValue={10}
          maximumValue={100}
          step={5}
          value={state.waveSpeed}
          onValueChange={onSpeedChange}
          minimumTrackTintColor="#4263eb"
          maximumTrackTintColor="#e9ecef"
          thumbTintColor="#4263eb"
        />
      </View>

      <View style={styles.controlGroup}>
        <Text style={styles.label}>
          {t('İşaretli Noktalar', 'Marked Points')}: {state.markedPoints.length}
        </Text>
        <Slider
          style={styles.slider}
          minimumValue={1}
          maximumValue={5}
          step={1}
          value={state.markedPoints.length}
          onValueChange={onMarkedPointsChange}
          minimumTrackTintColor="#4263eb"
          maximumTrackTintColor="#e9ecef"
          thumbTintColor="#4263eb"
        />
      </View>

      <View style={styles.buttonGroup}>
        <TouchableOpacity
          style={[
            styles.button,
            state.direction === 'right'
              ? styles.activeButton
              : styles.inactiveButton,
          ]}
          onPress={() => onDirectionChange('right')}
        >
          <Text
            style={[
              styles.buttonText,
              state.direction === 'right'
                ? styles.activeButtonText
                : styles.inactiveButtonText,
            ]}
          >
            {t('Sağa', 'Right')}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.button,
            state.direction === 'left'
              ? styles.activeButton
              : styles.inactiveButton,
          ]}
          onPress={() => onDirectionChange('left')}
        >
          <Text
            style={[
              styles.buttonText,
              state.direction === 'left'
                ? styles.activeButtonText
                : styles.inactiveButtonText,
            ]}
          >
            {t('Sola', 'Left')}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.buttonGroup}>
        <TouchableOpacity
          style={[
            styles.button,
            state.showVelocity ? styles.activeButton : styles.inactiveButton,
          ]}
          onPress={onVelocityToggle}
        >
          <Text
            style={[
              styles.buttonText,
              state.showVelocity
                ? styles.activeButtonText
                : styles.inactiveButtonText,
            ]}
          >
            {state.showVelocity
              ? t('Hız Vektörleri: Açık', 'Velocity Vectors: On')
              : t('Hız Vektörleri: Kapalı', 'Velocity Vectors: Off')}
          </Text>
        </TouchableOpacity>
      </View>

      {onPeriodGraphToggle && (
        <View style={styles.buttonGroup}>
          <TouchableOpacity
            style={[
              styles.button,
              state.showPeriodGraph
                ? styles.activeButton
                : styles.inactiveButton,
            ]}
            onPress={onPeriodGraphToggle}
          >
            <Text
              style={[
                styles.buttonText,
                state.showPeriodGraph
                  ? styles.activeButtonText
                  : styles.inactiveButtonText,
              ]}
            >
              {state.showPeriodGraph
                ? t('Periyot Grafiği: Açık', 'Period Graph: On')
                : t('Periyot Grafiği: Kapalı', 'Period Graph: Off')}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.stepSizeContainer}>
        <Text style={styles.label}>{t('Adım Boyutu', 'Step Size')}:</Text>
        <View style={styles.stepSizeButtons}>
          <TouchableOpacity
            style={[
              styles.stepButton,
              state.stepSize === 'quarter'
                ? styles.activeStepButton
                : styles.inactiveStepButton,
            ]}
            onPress={() => onStepSizeChange('quarter')}
          >
            <Text
              style={[
                styles.stepButtonText,
                state.stepSize === 'quarter'
                  ? styles.activeButtonText
                  : styles.inactiveButtonText,
              ]}
            >
              λ/4
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.stepButton,
              state.stepSize === 'half'
                ? styles.activeStepButton
                : styles.inactiveStepButton,
            ]}
            onPress={() => onStepSizeChange('half')}
          >
            <Text
              style={[
                styles.stepButtonText,
                state.stepSize === 'half'
                  ? styles.activeButtonText
                  : styles.inactiveButtonText,
              ]}
            >
              λ/2
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.stepButton,
              state.stepSize === 'threeQuarters'
                ? styles.activeStepButton
                : styles.inactiveStepButton,
            ]}
            onPress={() => onStepSizeChange('threeQuarters')}
          >
            <Text
              style={[
                styles.stepButtonText,
                state.stepSize === 'threeQuarters'
                  ? styles.activeButtonText
                  : styles.inactiveButtonText,
              ]}
            >
              3λ/4
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.stepButton,
              state.stepSize === 'full'
                ? styles.activeStepButton
                : styles.inactiveStepButton,
            ]}
            onPress={() => onStepSizeChange('full')}
          >
            <Text
              style={[
                styles.stepButtonText,
                state.stepSize === 'full'
                  ? styles.activeButtonText
                  : styles.inactiveButtonText,
              ]}
            >
              λ
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 10,
  },
  controlGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 5,
    color: '#495057',
  },
  slider: {
    height: 40,
    width: '100%',
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    flex: 1,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  activeButton: {
    backgroundColor: '#4263eb',
  },
  inactiveButton: {
    backgroundColor: '#e9ecef',
  },
  buttonText: {
    fontWeight: '500',
    fontSize: 14,
  },
  activeButtonText: {
    color: '#fff',
  },
  inactiveButtonText: {
    color: '#495057',
  },
  stepSizeContainer: {
    marginBottom: 15,
  },
  stepSizeButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  stepButton: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 2,
  },
  activeStepButton: {
    backgroundColor: '#4263eb',
  },
  inactiveStepButton: {
    backgroundColor: '#e9ecef',
  },
  stepButtonText: {
    fontWeight: '500',
    fontSize: 12,
  },
});
