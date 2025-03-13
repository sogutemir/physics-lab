import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useLanguage } from '../../../../components/LanguageContext';

const FormulaDisplay: React.FC = () => {
  const { t } = useLanguage();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('Formüller', 'Formulas')}</Text>
      <View style={styles.formulaGrid}>
        <View style={styles.formulaItem}>
          <Text style={styles.formulaTitle}>
            {t('Konum Denklemi', 'Position Equation')}
          </Text>
          <Text style={styles.formula}>x = x₀ + v₀t + ½at²</Text>
          <Text style={styles.description}>
            {t(
              'Cismin t anındaki konumunu hesaplar.',
              'Calculates the position of the object at time t.'
            )}
          </Text>
        </View>

        <View style={styles.formulaItem}>
          <Text style={styles.formulaTitle}>
            {t('Hız Denklemi', 'Velocity Equation')}
          </Text>
          <Text style={styles.formula}>v = v₀ + at</Text>
          <Text style={styles.description}>
            {t(
              'Cismin t anındaki hızını hesaplar.',
              'Calculates the velocity of the object at time t.'
            )}
          </Text>
        </View>

        <View style={styles.formulaItem}>
          <Text style={styles.formulaTitle}>
            {t('İvme Denklemi', 'Acceleration Equation')}
          </Text>
          <Text style={styles.formula}>a = Δv/Δt</Text>
          <Text style={styles.description}>
            {t(
              'Hızdaki değişimin zamana oranını verir.',
              'Gives the rate of change in velocity over time.'
            )}
          </Text>
        </View>
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
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 12,
  },
  formulaGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  formulaItem: {
    flex: 1,
    minWidth: 200,
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  formulaTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4b5563',
    marginBottom: 8,
  },
  formula: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3b82f6',
    marginBottom: 8,
    fontFamily: 'monospace',
  },
  description: {
    fontSize: 12,
    color: '#6b7280',
    lineHeight: 16,
  },
});

export default FormulaDisplay;
