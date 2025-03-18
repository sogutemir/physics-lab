import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  withRepeat,
} from 'react-native-reanimated';
import { useLanguage } from '../../../../../components/LanguageContext';
import {
  wavelengthToRGB,
  generateInterferencePattern,
  calculatePeriod,
} from '../../utils/physics';

interface InterferencePatternProps {
  wavelength: number; // nm cinsinden
  slitWidth: number; // mm cinsinden
  slitSeparation: number; // mm cinsinden
  distanceToScreen: number; // mm cinsinden
  isActive: boolean;
}

const InterferencePattern: React.FC<InterferencePatternProps> = ({
  wavelength,
  slitWidth,
  slitSeparation,
  distanceToScreen,
  isActive,
}) => {
  const { t } = useLanguage();
  const color = wavelengthToRGB(wavelength);
  const opacity = useSharedValue(0);
  const pulseAnim = useSharedValue(0);

  // Girişim periyodu hesaplama
  const period = calculatePeriod(wavelength, slitSeparation, distanceToScreen);

  // IsActive değiştiğinde animasyon
  useEffect(() => {
    opacity.value = withTiming(isActive ? 1 : 0, {
      duration: 500,
      easing: Easing.inOut(Easing.ease),
    });

    if (isActive) {
      pulseAnim.value = withRepeat(
        withTiming(1, { duration: 1500, easing: Easing.inOut(Easing.sin) }),
        -1,
        true
      );
    } else {
      pulseAnim.value = 0;
    }
  }, [isActive]);

  // Girişim deseni oluşturma
  const screenHeight = 80;
  const pattern = generateInterferencePattern(
    screenHeight,
    25, // Çizgi sayısı
    wavelength,
    slitSeparation,
    slitWidth,
    distanceToScreen
  );

  // RGB bileşenlerini alma
  const rgbMatch = color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
  const [, r, g, b] = rgbMatch ? rgbMatch.map(Number) : [0, 0, 0, 0];

  // Animasyonlu stil
  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    };
  });

  // Nabız animasyonu
  const pulseStyle = useAnimatedStyle(() => {
    return {
      opacity: 0.5 + pulseAnim.value * 0.5,
    };
  });

  return (
    <View style={styles.container}>
      {/* Dikey stand çubuğu */}
      <View style={styles.standPole} />

      {/* Ekran - Siyah dikdörtgen */}
      <View style={styles.screenContainer}>
        {/* Girişim deseni - Çift yarık için */}
        {isActive && (
          <Animated.View style={[styles.patternContainer, animatedStyle]}>
            {/* Girişim çizgileri */}
            {pattern.map((intensity, index) => (
              <Animated.View
                key={`line-${index}`}
                style={[
                  styles.intensityLine,
                  pulseStyle,
                  {
                    opacity: intensity,
                    backgroundColor: `rgba(${r}, ${g}, ${b}, ${intensity})`,
                    height: intensity * 3 + 1, // Daha kalın çizgiler
                    marginVertical: 0.5,
                  },
                ]}
              />
            ))}
          </Animated.View>
        )}
      </View>

      {/* Periyot bilgisi */}
      {isActive && (
        <View style={styles.periodInfo}>
          <Text style={styles.periodText}>
            {t('Periyot', 'Period')}: {period.toFixed(2)} mm
          </Text>
        </View>
      )}

      {/* Etiket */}
      <View style={styles.label}>
        <Text style={styles.labelText}>{t('Ekran', 'Screen')}</Text>
        <Text style={styles.valueText}>{distanceToScreen.toFixed(0)} mm</Text>
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
  standPole: {
    width: 1,
    height: 180,
    backgroundColor: '#6b7280',
    position: 'absolute',
    zIndex: 1,
  },
  screenContainer: {
    width: 40,
    height: 80,
    backgroundColor: '#000000',
    borderRadius: 1,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#333',
  },
  patternContainer: {
    width: '100%',
    height: '100%',
    flexDirection: 'column',
    justifyContent: 'space-evenly',
  },
  intensityLine: {
    width: '100%',
    height: 1,
    marginVertical: 0.5,
  },
  periodInfo: {
    position: 'absolute',
    top: -20,
    right: -40,
    padding: 2,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 4,
    zIndex: 20,
  },
  periodText: {
    fontSize: 10,
    color: '#fff',
    fontFamily: 'monospace',
  },
  lightLine: {
    width: '100%',
    height: 1,
    position: 'absolute',
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

export default InterferencePattern;
