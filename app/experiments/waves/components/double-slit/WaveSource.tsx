import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  Easing,
  cancelAnimation,
} from 'react-native-reanimated';
import { useLanguage } from '../../../../../components/LanguageContext';
import { wavelengthToRGB } from '../../utils/physics';

interface WaveSourceProps {
  wavelength: number;
  isActive: boolean;
}

const WaveSource: React.FC<WaveSourceProps> = ({ wavelength, isActive }) => {
  const { t } = useLanguage();
  const color = wavelengthToRGB(wavelength);

  // Animasyon değerleri
  const pulseScale = useSharedValue(1);
  const pulseOpacity = useSharedValue(0);

  // Işık kaynağı pulse animasyonu
  useEffect(() => {
    if (isActive) {
      pulseScale.value = 1;
      pulseOpacity.value = 0.8;

      pulseScale.value = withRepeat(
        withTiming(1.4, { duration: 1200, easing: Easing.inOut(Easing.ease) }),
        -1,
        true
      );

      pulseOpacity.value = withRepeat(
        withTiming(0, { duration: 1200, easing: Easing.inOut(Easing.ease) }),
        -1,
        false
      );
    } else {
      cancelAnimation(pulseScale);
      cancelAnimation(pulseOpacity);

      pulseScale.value = withTiming(1);
      pulseOpacity.value = withTiming(0);
    }

    return () => {
      cancelAnimation(pulseScale);
      cancelAnimation(pulseOpacity);
    };
  }, [isActive]);

  // Pulse animasyon stili
  const pulseAnimStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: pulseScale.value }],
      opacity: pulseOpacity.value,
    };
  });

  return (
    <View style={styles.container}>
      {/* Işık Kaynağı */}
      <View style={styles.sourceContainer}>
        {/* Pulse animasyonu */}
        <Animated.View
          style={[
            styles.pulse,
            { backgroundColor: color + '30' },
            pulseAnimStyle,
          ]}
        />

        {/* Işık kaynağı merkezi */}
        <View
          style={[
            styles.source,
            { backgroundColor: isActive ? color : '#94a3b8' },
          ]}
        >
          <View style={styles.sourceInner} />
        </View>

        {/* Taşıyıcı stand */}
        <View style={styles.stand} />
      </View>

      {/* Etiket */}
      <View style={styles.label}>
        <Text style={styles.labelText}>
          {t('Işık Kaynağı', 'Light Source')}
        </Text>
        <Text style={styles.wavelengthText}>{wavelength} nm</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 160,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  sourceContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  pulse: {
    width: 36,
    height: 36,
    borderRadius: 18,
    position: 'absolute',
  },
  source: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#3b82f6',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
  },
  sourceInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#ffffff',
    opacity: 0.5,
  },
  stand: {
    position: 'absolute',
    width: 1,
    height: 180,
    backgroundColor: '#9ca3af',
    zIndex: -1,
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
  wavelengthText: {
    fontSize: 12,
    fontFamily: 'monospace',
    color: '#6b7280',
  },
});

export default WaveSource;
