import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useLanguage } from '../../../../../components/LanguageContext';

interface CoreTypeOption {
  value: 'E' | 'U' | 'toroid';
  label: string;
  labelEN: string;
  description: string;
  descriptionEN: string;
}

interface CoreTypeSelectorProps {
  options: CoreTypeOption[];
  value: 'E' | 'U' | 'toroid';
  onChange: (value: 'E' | 'U' | 'toroid') => void;
}

const CoreTypeSelector: React.FC<CoreTypeSelectorProps> = ({
  options,
  value,
  onChange,
}) => {
  const { t } = useLanguage();

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{t('Nüve Geometrisi', 'Core Geometry')}</Text>
      <View style={styles.optionsGrid}>
        {options.map((option) => (
          <TouchableOpacity
            key={option.value}
            style={[
              styles.optionItem,
              value === option.value ? styles.optionItemSelected : null,
            ]}
            onPress={() => onChange(option.value)}
          >
            <Text
              style={[
                styles.optionLabel,
                value === option.value ? styles.optionLabelSelected : null,
              ]}
            >
              {t(option.label, option.labelEN)}
            </Text>
            <Text
              style={[
                styles.optionDescription,
                value === option.value
                  ? styles.optionDescriptionSelected
                  : null,
              ]}
            >
              {t(option.description, option.descriptionEN)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
    color: '#334155',
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  optionItem: {
    flex: 1,
    minWidth: '30%',
    borderWidth: 2,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    padding: 8,
    alignItems: 'center',
    backgroundColor: 'white',
  },
  optionItemSelected: {
    borderColor: '#3b82f6',
    backgroundColor: 'rgba(59, 130, 246, 0.05)',
  },
  optionLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#64748b',
    marginBottom: 4,
    textAlign: 'center',
  },
  optionLabelSelected: {
    color: '#2563eb',
  },
  optionDescription: {
    fontSize: 10,
    color: '#94a3b8',
    textAlign: 'center',
  },
  optionDescriptionSelected: {
    color: '#6366f1',
  },
});

export default CoreTypeSelector;
