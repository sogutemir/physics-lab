import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { useLanguage } from '../../../../../components/LanguageContext';

interface MeterDisplayProps {
  label: string;
  labelEN?: string;
  value: number;
  unit: string;
  precision?: number;
  icon?: React.ReactNode;
}

const MeterDisplay: React.FC<MeterDisplayProps> = ({
  label,
  labelEN,
  value,
  unit,
  precision = 2,
  icon,
}) => {
  const { t } = useLanguage();
  const formattedValue = value.toFixed(precision);

  // Animasyon için değer
  const pulseValue = useSharedValue(1);

  // Komponent monte edildiğinde animasyonu başlat
  React.useEffect(() => {
    pulseValue.value = withRepeat(
      withTiming(1.03, {
        duration: 2000,
        easing: Easing.inOut(Easing.ease),
      }),
      -1, // sonsuz tekrar
      true // tersine çevir
    );
  }, []);

  // Animasyon stili
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: pulseValue.value }],
    };
  });

  return (
    <View style={styles.container}>
      <View style={styles.labelRow}>
        <Text style={styles.label}>{labelEN ? t(label, labelEN) : label}</Text>
        {icon && <View style={styles.iconContainer}>{icon}</View>}
      </View>
      <View style={styles.valueRow}>
        <Animated.Text style={[styles.value, animatedStyle]}>
          {formattedValue}
        </Animated.Text>
        <Text style={styles.unit}>{unit}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  label: {
    fontSize: 11,
    fontWeight: '500',
    color: '#64748b',
  },
  iconContainer: {
    opacity: 0.5,
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  value: {
    fontSize: 22,
    fontWeight: '600',
    color: '#0f172a',
    fontFamily: 'monospace',
  },
  unit: {
    fontSize: 12,
    color: '#64748b',
    marginLeft: 4,
    marginBottom: 3,
  },
});

export default MeterDisplay;
