import React from 'react';
import { View, ViewProps } from 'react-native';
import Slider from '@react-native-community/slider';

interface CustomSliderProps extends ViewProps {
  value: number;
  min: number;
  max: number;
  step?: number;
  onValueChange: (value: number) => void;
}

export const CustomSlider: React.FC<CustomSliderProps> = ({
  value,
  min,
  max,
  step = 1,
  onValueChange,
  style,
  ...props
}) => {
  return (
    <View style={[{ height: 40, marginVertical: 8 }, style]} {...props}>
      <Slider
        style={{ width: '100%', height: '100%' }}
        minimumValue={min}
        maximumValue={max}
        step={step}
        value={value}
        onValueChange={onValueChange}
        minimumTrackTintColor="#3b82f6"
        maximumTrackTintColor="#e2e8f0"
        thumbTintColor="#3b82f6"
      />
    </View>
  );
};
