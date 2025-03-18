import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  Easing,
  withDelay,
} from 'react-native-reanimated';
import { useLanguage } from '../../../../../components/LanguageContext';
import { wavelengthToRGB } from '../../utils/physics';

interface WaveSourceProps {
  wavelength: number; // nm cinsinden
  isActive: boolean;
}

const WaveSource: React.FC<WaveSourceProps> = ({ wavelength, isActive }) => {
  const { t } = useLanguage();
  const color = wavelengthToRGB(wavelength);

  // Işık animasyonu için shared values
  const pulseScale = useSharedValue(1);
  const glowOpacity = useSharedValue(0.7);
  const brightness = useSharedValue(0.8);

  // Animasyonlar
  useEffect(() => {
    if (isActive) {
      // Nabız animasyonu
      pulseScale.value = withRepeat(
        withTiming(1.15, { duration: 1200, easing: Easing.inOut(Easing.sin) }),
        -1,
        true
      );

      // Parlaklık animasyonu
      glowOpacity.value = withRepeat(
        withTiming(0.9, { duration: 1500, easing: Easing.inOut(Easing.quad) }),
        -1,
        true
      );

      // Işık parlaması
      brightness.value = withRepeat(
        withTiming(1, { duration: 800, easing: Easing.inOut(Easing.quad) }),
        -1,
        true
      );
    } else {
      // Animasyonları durdur ve reset et
      pulseScale.value = withTiming(1, { duration: 300 });
      glowOpacity.value = withTiming(0.5, { duration: 300 });
      brightness.value = withTiming(0.6, { duration: 300 });
    }
  }, [isActive]);

  // Animated styles
  const sourceStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
    opacity: brightness.value,
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
  }));

  // RGB bileşenlerini alma
  const rgbMatch = color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
  const [, r, g, b] = rgbMatch ? rgbMatch.map(Number) : [0, 0, 0, 0];

  return (
    <View style={styles.container}>
      {/* Işık kaynağı standı */}
      <View style={styles.stand} />

      {/* Işık kaynağı dış parlaklık */}
      <Animated.View
        style={[
          styles.outerGlow,
          glowStyle,
          {
            backgroundColor: `rgba(${r}, ${g}, ${b}, 0.15)`,
            shadowColor: color,
          },
        ]}
      />

      {/* Işık kaynağı iç parlaklık */}
      <Animated.View
        style={[
          styles.innerGlow,
          glowStyle,
          {
            backgroundColor: `rgba(${r}, ${g}, ${b}, 0.3)`,
            shadowColor: color,
          },
        ]}
      />

      {/* Işık kaynağı merkezi */}
      <Animated.View
        style={[
          styles.source,
          sourceStyle,
          {
            backgroundColor: color,
            shadowColor: color,
          },
        ]}
      />

      {/* Etiket */}
      <View style={styles.label}>
        <Text style={styles.labelText}>
          {t('Işık Kaynağı', 'Light Source')}
        </Text>
        <Text style={styles.valueText}>{wavelength} nm</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 160,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  stand: {
    position: 'absolute',
    left: -10,
    width: 10,
    height: 40,
    backgroundColor: '#555',
    borderTopRightRadius: 2,
    borderBottomRightRadius: 2,
  },
  outerGlow: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 20,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
  },
  innerGlow: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderRadius: 12,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 5,
  },
  source: {
    width: 16,
    height: 16,
    borderRadius: 8,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 5,
  },
  label: {
    position: 'absolute',
    bottom: -24,
    alignItems: 'center',
  },
  labelText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#4b5563',
  },
  valueText: {
    fontSize: 12,
    fontFamily: 'monospace',
    color: '#6b7280',
  },
});

export default WaveSource;
