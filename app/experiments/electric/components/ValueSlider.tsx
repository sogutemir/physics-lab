import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Slider from '@react-native-community/slider';

interface ValueSliderProps {
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number[]) => void;
  colorClass: string;
  label: string;
  unit: string;
  disabled?: boolean;
}

const ValueSlider: React.FC<ValueSliderProps> = ({
  value,
  min,
  max,
  step,
  onChange,
  colorClass,
  label,
  unit,
  disabled = false,
}) => {
  // Renk sınıfına göre renk belirle
  const getColorByClass = (colorClass: string): string => {
    switch (colorClass) {
      case 'voltage':
        return '#3498db';
      case 'current':
        return '#f39c12';
      case 'resistance':
        return '#e74c3c';
      default:
        return '#666';
    }
  };

  const color = getColorByClass(colorClass);

  return (
    <View style={styles.container}>
      <View style={styles.labelContainer}>
        <Text style={styles.label}>{label}</Text>
        <Text style={[styles.value, { color }]}>
          {value.toFixed(2)} {unit}
        </Text>
      </View>

      <Slider
        value={value}
        minimumValue={min}
        maximumValue={max}
        step={step}
        onValueChange={(val) => onChange([val])}
        disabled={false}
        minimumTrackTintColor={color}
        maximumTrackTintColor="rgba(0, 0, 0, 0.1)"
        thumbTintColor={color}
        style={styles.slider}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  labelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
  },
  value: {
    fontSize: 14,
    fontWeight: '500',
  },
  slider: {
    width: '100%',
    height: 40,
  },
});

export default ValueSlider;
