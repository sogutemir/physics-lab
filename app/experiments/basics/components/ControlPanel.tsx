import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Slider from '@react-native-community/slider';
import { useLanguage } from '../../../../components/LanguageContext';
import { Play, Pause, RotateCcw, Info } from 'lucide-react-native';

interface ControlPanelProps {
  acceleration: number;
  setAcceleration: (value: number) => void;
  initialVelocity: number;
  setInitialVelocity: (value: number) => void;
  time: number;
  setTime: (value: number) => void;
  isRunning: boolean;
  toggleSimulation: () => void;
  resetSimulation: () => void;
}

const ControlPanel: React.FC<ControlPanelProps> = ({
  acceleration,
  setAcceleration,
  initialVelocity,
  setInitialVelocity,
  time,
  setTime,
  isRunning,
  toggleSimulation,
  resetSimulation,
}) => {
  const { t } = useLanguage();

  const renderTooltip = (title: string, content: string) => (
    <TouchableOpacity
      onPress={() => {
        // Tooltip içeriğini göster (Toast veya Modal ile)
      }}
    >
      <Info size={16} color="#6b7280" />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <View style={styles.labelContainer}>
          <Text style={styles.label}>{t('İvme (a)', 'Acceleration (a)')}</Text>
          <View style={styles.valueContainer}>
            <Text style={styles.value}>{acceleration.toFixed(1)} m/s²</Text>
            {renderTooltip(
              t('İvme', 'Acceleration'),
              t(
                'İvme, hızın zamana göre değişim oranıdır. Pozitif değerler hızlanma, negatif değerler yavaşlama gösterir.',
                'Acceleration is the rate of change of velocity over time. Positive values indicate speeding up, negative values indicate slowing down.'
              )
            )}
          </View>
        </View>
        <Slider
          minimumValue={-10}
          maximumValue={10}
          step={0.1}
          value={acceleration}
          onValueChange={setAcceleration}
          disabled={isRunning}
          minimumTrackTintColor="#3b82f6"
          maximumTrackTintColor="#e5e7eb"
          thumbTintColor="#3b82f6"
          style={styles.slider}
        />
      </View>

      <View style={styles.section}>
        <View style={styles.labelContainer}>
          <Text style={styles.label}>
            {t('Başlangıç Hızı (v₀)', 'Initial Velocity (v₀)')}
          </Text>
          <View style={styles.valueContainer}>
            <Text style={styles.value}>{initialVelocity.toFixed(1)} m/s</Text>
            {renderTooltip(
              t('Başlangıç Hızı', 'Initial Velocity'),
              t(
                'Cismin hareket başlangıcındaki hızı. Pozitif değerler sağa, negatif değerler sola hareketi temsil eder.',
                'The initial velocity of the object. Positive values represent motion to the right, negative values represent motion to the left.'
              )
            )}
          </View>
        </View>
        <Slider
          minimumValue={-10}
          maximumValue={10}
          step={0.1}
          value={initialVelocity}
          onValueChange={setInitialVelocity}
          disabled={isRunning}
          minimumTrackTintColor="#3b82f6"
          maximumTrackTintColor="#e5e7eb"
          thumbTintColor="#3b82f6"
          style={styles.slider}
        />
      </View>

      <View style={styles.section}>
        <View style={styles.labelContainer}>
          <Text style={styles.label}>{t('Zaman (t)', 'Time (t)')}</Text>
          <View style={styles.valueContainer}>
            <Text style={styles.value}>{time.toFixed(1)} s</Text>
            {renderTooltip(
              t('Zaman', 'Time'),
              t(
                'Simülasyonun çalışacağı toplam süre.',
                'The total duration of the simulation.'
              )
            )}
          </View>
        </View>
        <Slider
          minimumValue={1}
          maximumValue={10}
          step={0.1}
          value={time}
          onValueChange={setTime}
          disabled={isRunning}
          minimumTrackTintColor="#3b82f6"
          maximumTrackTintColor="#e5e7eb"
          thumbTintColor="#3b82f6"
          style={styles.slider}
        />
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[
            styles.button,
            styles.primaryButton,
            isRunning && styles.stopButton,
          ]}
          onPress={toggleSimulation}
        >
          <View style={styles.buttonContent}>
            {isRunning ? (
              <Pause size={16} color="#fff" />
            ) : (
              <Play size={16} color="#fff" />
            )}
            <Text style={styles.buttonText}>
              {isRunning ? t('Durdur', 'Stop') : t('Başlat', 'Start')}
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.resetButton]}
          onPress={resetSimulation}
          disabled={isRunning}
        >
          <RotateCcw size={16} color="#6b7280" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  section: {
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
    color: '#4b5563',
    fontWeight: '500',
  },
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  value: {
    fontSize: 14,
    color: '#3b82f6',
    fontWeight: '500',
  },
  slider: {
    width: '100%',
    height: 40,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  button: {
    borderRadius: 8,
    padding: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  primaryButton: {
    backgroundColor: '#3b82f6',
    flex: 1,
  },
  stopButton: {
    backgroundColor: '#ef4444',
  },
  resetButton: {
    backgroundColor: '#f3f4f6',
    padding: 12,
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
});

export default ControlPanel;
