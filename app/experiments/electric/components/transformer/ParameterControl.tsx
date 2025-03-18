import React from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';
import Slider from '@react-native-community/slider';
import { useLanguage } from '../../../../../components/LanguageContext';

interface ParameterControlProps {
  label: string;
  labelEN?: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  helperText?: string;
  helperTextEN?: string;
}

const ParameterControl: React.FC<ParameterControlProps> = ({
  label,
  labelEN,
  value,
  onChange,
  min,
  max,
  step = 1,
  unit,
  helperText,
  helperTextEN,
}) => {
  const { t } = useLanguage();

  // Metin girişinden değer değiştiğinde çağrılır
  const handleTextChange = (text: string) => {
    const newValue = parseFloat(text);
    if (!isNaN(newValue) && newValue >= min && newValue <= max) {
      onChange(newValue);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.label}>{labelEN ? t(label, labelEN) : label}</Text>
        <View style={styles.valueContainer}>
          <TextInput
            style={styles.valueInput}
            value={value.toString()}
            onChangeText={handleTextChange}
            keyboardType="numeric"
          />
          {unit && <Text style={styles.unit}>{unit}</Text>}
        </View>
      </View>

      <Slider
        value={value}
        minimumValue={min}
        maximumValue={max}
        step={step}
        onValueChange={onChange}
        minimumTrackTintColor="#3b82f6"
        maximumTrackTintColor="#e2e8f0"
        thumbTintColor="#2563eb"
        style={styles.slider}
      />

      {(helperText || helperTextEN) && (
        <Text style={styles.helperText}>
          {helperTextEN ? t(helperText || '', helperTextEN) : helperText}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 13,
    fontWeight: '500',
    color: '#334155',
  },
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  valueInput: {
    width: 50,
    height: 30,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 4,
    paddingHorizontal: 6,
    fontSize: 12,
    textAlign: 'right',
    backgroundColor: 'white',
  },
  unit: {
    fontSize: 11,
    color: '#64748b',
    marginLeft: 4,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  helperText: {
    fontSize: 10,
    color: '#94a3b8',
    marginTop: 4,
  },
});

export default ParameterControl;
