import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useLanguage } from '../../../../components/LanguageContext';

interface DataDisplayProps {
  currentTime: number;
  currentVelocity: number;
  currentPosition: number;
}

const DataDisplay: React.FC<DataDisplayProps> = ({
  currentTime,
  currentVelocity,
  currentPosition,
}) => {
  const { t } = useLanguage();

  const renderDataItem = (
    label: string,
    value: number,
    unit: string,
    precision: number = 2
  ) => (
    <View style={styles.dataItem}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>
        {value.toFixed(precision)} {unit}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('Anlık Değerler', 'Current Values')}</Text>
      <View style={styles.grid}>
        {renderDataItem(t('Zaman (t)', 'Time (t)'), currentTime, 's')}
        {renderDataItem(t('Hız (v)', 'Velocity (v)'), currentVelocity, 'm/s')}
        {renderDataItem(
          t('Konum (x)', 'Position (x)'),
          currentPosition,
          'm',
          1
        )}
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
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  dataItem: {
    flex: 1,
    minWidth: 120,
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    padding: 12,
  },
  label: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3b82f6',
  },
});

export default DataDisplay;
