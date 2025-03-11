import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useLanguage } from '../../../../components/LanguageContext';

interface FormulaDisplayProps {
  voltage: number;
  current: number;
  resistance: number;
  highlightedValue: string | null;
}

const FormulaDisplay: React.FC<FormulaDisplayProps> = ({
  voltage,
  current,
  resistance,
  highlightedValue,
}) => {
  const { t } = useLanguage();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('Ohm Yasası', "Ohm's Law")}</Text>

      <View style={styles.formulaContainer}>
        <Text
          style={[
            styles.formulaItem,
            highlightedValue === 'voltage' && styles.highlightedVoltage,
          ]}
        >
          V = {voltage.toFixed(2)}V
        </Text>
        <Text style={styles.formulaOperator}>=</Text>
        <Text
          style={[
            styles.formulaItem,
            highlightedValue === 'current' && styles.highlightedCurrent,
          ]}
        >
          I = {current.toFixed(2)}A
        </Text>
        <Text style={styles.formulaOperator}>×</Text>
        <Text
          style={[
            styles.formulaItem,
            highlightedValue === 'resistance' && styles.highlightedResistance,
          ]}
        >
          R = {resistance.toFixed(2)}Ω
        </Text>
      </View>

      <View style={styles.labelsContainer}>
        <View style={styles.voltageLabel}>
          <Text style={styles.labelTitle}>
            {t('Gerilim (V)', 'Voltage (V)')}
          </Text>
          <Text style={styles.labelUnit}>{t('Volt', 'Volt')}</Text>
        </View>
        <View style={styles.currentLabel}>
          <Text style={styles.labelTitle}>{t('Akım (I)', 'Current (I)')}</Text>
          <Text style={styles.labelUnit}>{t('Amper', 'Ampere')}</Text>
        </View>
        <View style={styles.resistanceLabel}>
          <Text style={styles.labelTitle}>
            {t('Direnç (R)', 'Resistance (R)')}
          </Text>
          <Text style={styles.labelUnit}>{t('Ohm', 'Ohm')}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    borderRadius: 16,
    marginVertical: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 16,
  },
  formulaContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  formulaItem: {
    fontSize: 18,
    fontWeight: '500',
    paddingHorizontal: 4,
  },
  formulaOperator: {
    fontSize: 18,
    color: '#666',
    paddingHorizontal: 4,
  },
  highlightedVoltage: {
    color: '#3498db',
    fontSize: 20,
  },
  highlightedCurrent: {
    color: '#f39c12',
    fontSize: 20,
  },
  highlightedResistance: {
    color: '#e74c3c',
    fontSize: 20,
  },
  labelsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  voltageLabel: {
    flex: 1,
    padding: 8,
    backgroundColor: 'rgba(52, 152, 219, 0.1)',
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  currentLabel: {
    flex: 1,
    padding: 8,
    backgroundColor: 'rgba(243, 156, 18, 0.1)',
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  resistanceLabel: {
    flex: 1,
    padding: 8,
    backgroundColor: 'rgba(231, 76, 60, 0.1)',
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  labelTitle: {
    fontWeight: '500',
    fontSize: 14,
  },
  labelUnit: {
    fontSize: 12,
    opacity: 0.8,
  },
});

export default FormulaDisplay;
