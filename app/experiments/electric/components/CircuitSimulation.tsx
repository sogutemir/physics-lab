import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native';
import CircuitVisualizer from './CircuitVisualizer';
import FormulaDisplay from './FormulaDisplay';
import ValueSlider from './ValueSlider';
import InfoCard from './InfoCard';
import { useLanguage } from '../../../../components/LanguageContext';
import {
  calculateCurrent,
  calculateVoltage,
  calculateResistance,
} from '../utils/ohmLaw';

const CircuitSimulation: React.FC = () => {
  const { t } = useLanguage();

  // Devre değerleri
  const [voltage, setVoltage] = useState(12); // Volt cinsinden
  const [current, setCurrent] = useState(2); // Amper cinsinden
  const [resistance, setResistance] = useState(6); // Ohm cinsinden

  // Formülde vurgulanan değer
  const [highlightedValue, setHighlightedValue] = useState<string | null>(null);

  // Gerilim slider değişikliğini işle
  const handleVoltageChange = (values: number[]) => {
    const newVoltage = values[0];
    setVoltage(newVoltage);
    // Direnç sabit kalırken akımı güncelle (I = V/R)
    setCurrent(calculateCurrent(newVoltage, resistance));
    setHighlightedValue('voltage');
  };

  // Akım slider değişikliğini işle
  const handleCurrentChange = (values: number[]) => {
    const newCurrent = values[0];
    setCurrent(newCurrent);
    // Direnç sabit kalırken gerilimi güncelle (V = I*R)
    setVoltage(calculateVoltage(newCurrent, resistance));
    setHighlightedValue('current');
  };

  // Direnç slider değişikliğini işle
  const handleResistanceChange = (values: number[]) => {
    const newResistance = values[0];
    setResistance(newResistance);
    // Gerilim sabit kalırken akımı güncelle (I = V/R)
    setCurrent(calculateCurrent(voltage, newResistance));
    setHighlightedValue('resistance');
  };

  // Vurgulamayı sıfırla
  useEffect(() => {
    if (highlightedValue) {
      const timer = setTimeout(() => setHighlightedValue(null), 1500);
      return () => clearTimeout(timer);
    }
  }, [highlightedValue]);

  return (
    <View style={styles.container}>
      <CircuitVisualizer
        voltage={voltage}
        current={current}
        resistance={resistance}
      />

      <FormulaDisplay
        voltage={voltage}
        current={current}
        resistance={resistance}
        highlightedValue={highlightedValue}
      />

      <View style={styles.slidersContainer}>
        <View style={styles.sliderPanel}>
          <ValueSlider
            value={voltage}
            min={0}
            max={24}
            step={0.1}
            onChange={handleVoltageChange}
            colorClass="voltage"
            label={t('Gerilim (V)', 'Voltage (V)')}
            unit="V"
            disabled={false}
          />
        </View>

        <View style={styles.sliderPanel}>
          <ValueSlider
            value={current}
            min={0}
            max={10}
            step={0.01}
            onChange={handleCurrentChange}
            colorClass="current"
            label={t('Akım (I)', 'Current (I)')}
            unit="A"
            disabled={false}
          />
        </View>

        <View style={styles.sliderPanel}>
          <ValueSlider
            value={resistance}
            min={0.1}
            max={50}
            step={0.1}
            onChange={handleResistanceChange}
            colorClass="resistance"
            label={t('Direnç (R)', 'Resistance (R)')}
            unit="Ω"
            disabled={false}
          />
        </View>
      </View>

      <InfoCard />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    maxWidth: 800,
    alignSelf: 'center',
    padding: 16,
  },
  slidersContainer: {
    marginTop: 24,
    marginBottom: 16,
    ...Platform.select({
      web: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
      },
      default: {
        flexDirection: 'column',
      },
    }),
  },
  sliderPanel: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    ...Platform.select({
      web: {
        width: '31%',
      },
      default: {
        width: '100%',
      },
    }),
  },
});

export default CircuitSimulation;
