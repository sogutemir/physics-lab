import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { CircuitValues } from '../utils/types';
import { useLanguage } from '../../../../../components/LanguageContext';

interface CircuitValuesDisplayProps {
  values: CircuitValues;
  resistance: number;
}

const CircuitValuesDisplay: React.FC<CircuitValuesDisplayProps> = ({
  values,
  resistance,
}) => {
  const { t } = useLanguage();
  const { XL, XC, Z, phase } = values;
  const phaseDegrees = (57.2958 * Math.abs(phase)).toFixed(1);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>
          {t('Devre Analizi', 'Circuit Analysis')}
        </Text>
      </View>

      <View style={styles.content}>
        <View style={styles.grid}>
          <View style={styles.gridItem}>
            <Text style={styles.label}>{t('Direnç', 'Resistance')}</Text>
            <Text style={[styles.value, styles.resistanceText]}>
              R = {(resistance * 0.1).toFixed(1)} Ω
            </Text>
          </View>

          <View style={styles.gridItem}>
            <Text style={styles.label}>
              {t('Kapasitif Reaktans', 'Capacitive Reactance')}
            </Text>
            <Text style={[styles.value, styles.capacitanceText]}>
              XC = {XC.toFixed(1)} Ω
            </Text>
          </View>

          <View style={styles.gridItem}>
            <Text style={styles.label}>
              {t('İndüktif Reaktans', 'Inductive Reactance')}
            </Text>
            <Text style={[styles.value, styles.inductanceText]}>
              XL = {XL.toFixed(1)} Ω
            </Text>
          </View>

          <View style={styles.gridItem}>
            <Text style={styles.label}>
              {t('Toplam Empedans', 'Total Impedance')}
            </Text>
            <Text style={styles.value}>Z = {Z.toFixed(1)} Ω</Text>
          </View>
        </View>

        <View style={styles.phaseContainer}>
          <Text style={styles.label}>{t('Faz Açısı', 'Phase Angle')}</Text>
          <Text style={styles.value}>Φ = {phaseDegrees}°</Text>

          <View style={styles.phaseInfo}>
            {XL > XC ? (
              <View>
                <Text style={styles.phaseText}>
                  {t('İndüktif devre', 'Inductive circuit')}
                </Text>
                <Text style={styles.phaseText}>
                  {t('Gerilim akımdan önde', 'Voltage leads current by')}{' '}
                  {phaseDegrees}°
                </Text>
              </View>
            ) : XL < XC ? (
              <View>
                <Text style={styles.phaseText}>
                  {t('Kapasitif devre', 'Capacitive circuit')}
                </Text>
                <Text style={styles.phaseText}>
                  {t('Akım gerilimden önde', 'Current leads voltage by')}{' '}
                  {phaseDegrees}°
                </Text>
              </View>
            ) : (
              <View>
                <Text style={[styles.phaseText, styles.resonanceText]}>
                  {t('Rezonans!', 'Resonance!')}
                </Text>
                <Text style={styles.phaseText}>
                  {t(
                    'Gerilim ve akım aynı fazda',
                    'Voltage and current in phase'
                  )}
                </Text>
              </View>
            )}
          </View>
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
    backgroundColor: 'white',
    borderRadius: 16,
    overflow: 'hidden',
    marginVertical: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  content: {
    padding: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  gridItem: {
    width: '50%',
    paddingVertical: 8,
    paddingRight: 8,
  },
  label: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    fontWeight: '500',
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
  phaseContainer: {
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.1)',
  },
  phaseInfo: {
    marginTop: 8,
    padding: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    borderRadius: 8,
  },
  phaseText: {
    fontSize: 14,
    marginBottom: 4,
  },
  resonanceText: {
    fontWeight: 'bold',
    color: '#9b59b6',
  },
});

export default CircuitValuesDisplay;
