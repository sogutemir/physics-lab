import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from 'react-native';
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
  const [localAmplitude, setLocalAmplitude] = useState(
    state.amplitude.toString()
  );
  const [localWavelength, setLocalWavelength] = useState(
    state.wavelength.toString()
  );
  const [localWaveSpeed, setLocalWaveSpeed] = useState(
    state.waveSpeed.toString()
  );
  const [localMarkedPoints, setLocalMarkedPoints] = useState(
    state.markedPoints.length.toString()
  );

  const handleAmplitudeChange = (text: string) => {
    setLocalAmplitude(text);
    const value = parseInt(text);
    if (!isNaN(value) && value >= 10 && value <= 100) {
      onAmplitudeChange(value);
    }
  };

  const handleWavelengthChange = (text: string) => {
    setLocalWavelength(text);
    const value = parseInt(text);
    if (!isNaN(value) && value >= 50 && value <= 400) {
      onWavelengthChange(value);
    }
  };

  const handleWaveSpeedChange = (text: string) => {
    setLocalWaveSpeed(text);
    const value = parseInt(text);
    if (!isNaN(value) && value >= 10 && value <= 100) {
      onSpeedChange(value);
    }
  };

  const handleMarkedPointsChange = (text: string) => {
    setLocalMarkedPoints(text);
    const value = parseInt(text);
    if (!isNaN(value) && value >= 1 && value <= 5) {
      onMarkedPointsChange(value);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.controlGroup}>
        <Text style={styles.label}>
          {t('Genlik', 'Amplitude')}: {state.amplitude.toFixed(0)}
        </Text>
        <View style={styles.inputContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              const newValue = Math.max(10, state.amplitude - 5);
              onAmplitudeChange(newValue);
              setLocalAmplitude(newValue.toString());
            }}
          >
            <Text style={styles.buttonText}>-</Text>
          </TouchableOpacity>
          <TextInput
            style={styles.input}
            value={localAmplitude}
            onChangeText={handleAmplitudeChange}
            keyboardType="numeric"
          />
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              const newValue = Math.min(100, state.amplitude + 5);
              onAmplitudeChange(newValue);
              setLocalAmplitude(newValue.toString());
            }}
          >
            <Text style={styles.buttonText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.controlGroup}>
        <Text style={styles.label}>
          {t('Dalga Boyu', 'Wavelength')}: {state.wavelength.toFixed(0)}
        </Text>
        <View style={styles.inputContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              const newValue = Math.max(50, state.wavelength - 10);
              onWavelengthChange(newValue);
              setLocalWavelength(newValue.toString());
            }}
          >
            <Text style={styles.buttonText}>-</Text>
          </TouchableOpacity>
          <TextInput
            style={styles.input}
            value={localWavelength}
            onChangeText={handleWavelengthChange}
            keyboardType="numeric"
          />
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              const newValue = Math.min(400, state.wavelength + 10);
              onWavelengthChange(newValue);
              setLocalWavelength(newValue.toString());
            }}
          >
            <Text style={styles.buttonText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.controlGroup}>
        <Text style={styles.label}>
          {t('Dalga Hızı', 'Wave Speed')}: {state.waveSpeed.toFixed(0)}
        </Text>
        <View style={styles.inputContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              const newValue = Math.max(10, state.waveSpeed - 5);
              onSpeedChange(newValue);
              setLocalWaveSpeed(newValue.toString());
            }}
          >
            <Text style={styles.buttonText}>-</Text>
          </TouchableOpacity>
          <TextInput
            style={styles.input}
            value={localWaveSpeed}
            onChangeText={handleWaveSpeedChange}
            keyboardType="numeric"
          />
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              const newValue = Math.min(100, state.waveSpeed + 5);
              onSpeedChange(newValue);
              setLocalWaveSpeed(newValue.toString());
            }}
          >
            <Text style={styles.buttonText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.controlGroup}>
        <Text style={styles.label}>
          {t('İşaretli Noktalar', 'Marked Points')}: {state.markedPoints.length}
        </Text>
        <View style={styles.inputContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              const newValue = Math.max(1, state.markedPoints.length - 1);
              onMarkedPointsChange(newValue);
              setLocalMarkedPoints(newValue.toString());
            }}
          >
            <Text style={styles.buttonText}>-</Text>
          </TouchableOpacity>
          <TextInput
            style={styles.input}
            value={localMarkedPoints}
            onChangeText={handleMarkedPointsChange}
            keyboardType="numeric"
          />
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              const newValue = Math.min(5, state.markedPoints.length + 1);
              onMarkedPointsChange(newValue);
              setLocalMarkedPoints(newValue.toString());
            }}
          >
            <Text style={styles.buttonText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.buttonGroup}>
        <TouchableOpacity
          style={[
            styles.directionButton,
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
            styles.directionButton,
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
            styles.toggleButton,
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
              styles.toggleButton,
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
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  input: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: '#e9ecef',
    borderRadius: 4,
    paddingHorizontal: 10,
    textAlign: 'center',
    marginHorizontal: 5,
  },
  button: {
    width: 40,
    height: 40,
    backgroundColor: '#4263eb',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '500',
    fontSize: 14,
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  directionButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    flex: 1,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  toggleButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    flex: 1,
    alignItems: 'center',
  },
  activeButton: {
    backgroundColor: '#4263eb',
  },
  inactiveButton: {
    backgroundColor: '#e9ecef',
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
