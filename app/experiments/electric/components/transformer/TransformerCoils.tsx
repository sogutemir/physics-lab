import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { G, Rect, Circle } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
} from 'react-native-reanimated';

// Animated SVG bileşenleri için gerekli tanımlamalar
const AnimatedRect = Animated.createAnimatedComponent(Rect);
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface TransformerCoilsProps {
  coreType: 'E' | 'U' | 'toroid';
  primaryTurns: number;
  secondaryTurns: number;
  primaryCurrent: number;
}

const TransformerCoils: React.FC<TransformerCoilsProps> = ({
  coreType,
  primaryTurns,
  secondaryTurns,
  primaryCurrent,
}) => {
  // Görünür sarım sayısını sınırlama (görsel temsil için)
  const maxVisibleTurns = 10;
  const visiblePrimaryTurns = Math.min(
    Math.ceil(primaryTurns / 20),
    maxVisibleTurns
  );
  const visibleSecondaryTurns = Math.min(
    Math.ceil(secondaryTurns / 20),
    maxVisibleTurns
  );

  // Akım yoğunluğuna göre animasyon hızı
  const currentIntensity = Math.min(Math.abs(primaryCurrent) / 5, 1);
  const animationDuration = 2000 - currentIntensity * 1000; // 1-2 saniye arası

  // Bobinlerin opaklık animasyonu
  const primaryOpacity = useSharedValue(0.7);
  const secondaryOpacity = useSharedValue(0.7);

  // Animasyonu başlatma
  React.useEffect(() => {
    if (primaryCurrent !== 0) {
      // İlk bobin animasyonu
      primaryOpacity.value = withRepeat(
        withSequence(
          withTiming(1, {
            duration: animationDuration / 2,
            easing: Easing.inOut(Easing.sin),
          }),
          withTiming(0.7, {
            duration: animationDuration / 2,
            easing: Easing.inOut(Easing.sin),
          })
        ),
        -1, // sonsuz tekrar
        false
      );

      // İkinci bobin animasyonu (küçük bir gecikme ile)
      secondaryOpacity.value = withRepeat(
        withSequence(
          withTiming(0.7, {
            duration: animationDuration / 2,
            easing: Easing.inOut(Easing.sin),
          }),
          withTiming(1, {
            duration: animationDuration / 2,
            easing: Easing.inOut(Easing.sin),
          })
        ),
        -1, // sonsuz tekrar
        false
      );
    } else {
      // Animasyonu durdur
      primaryOpacity.value = withTiming(0.7);
      secondaryOpacity.value = withTiming(0.7);
    }
  }, [primaryCurrent, animationDuration]);

  // Animasyon stilleri
  const primaryAnimatedProps = useAnimatedProps(() => ({
    opacity: primaryOpacity.value,
  }));

  const secondaryAnimatedProps = useAnimatedProps(() => ({
    opacity: secondaryOpacity.value,
  }));

  // E tipi nüve için bobinler
  const renderECoreCoils = () => (
    <G>
      {/* Primer bobin */}
      <G>
        {Array.from({ length: visiblePrimaryTurns }).map((_, i) => (
          <AnimatedRect
            key={`primary-${i}`}
            x={130}
            y={90 + i * 7}
            width={10}
            height={5}
            rx={2}
            fill="#ef4444"
            animatedProps={primaryAnimatedProps}
          />
        ))}
      </G>

      {/* Sekonder bobin */}
      <G>
        {Array.from({ length: visibleSecondaryTurns }).map((_, i) => (
          <AnimatedRect
            key={`secondary-${i}`}
            x={260}
            y={90 + i * 7}
            width={10}
            height={5}
            rx={2}
            fill="#3b82f6"
            animatedProps={secondaryAnimatedProps}
          />
        ))}
      </G>
    </G>
  );

  // U tipi nüve için bobinler
  const renderUCoreCoils = () => (
    <G>
      {/* Primer bobin */}
      <G>
        {Array.from({ length: visiblePrimaryTurns }).map((_, i) => (
          <AnimatedRect
            key={`primary-${i}`}
            x={225}
            y={70 + i * 8}
            width={50}
            height={6}
            rx={3}
            fill="#ef4444"
            animatedProps={primaryAnimatedProps}
          />
        ))}
      </G>

      {/* Sekonder bobin */}
      <G>
        {Array.from({ length: visibleSecondaryTurns }).map((_, i) => (
          <AnimatedRect
            key={`secondary-${i}`}
            x={225}
            y={160 - i * 8}
            width={50}
            height={6}
            rx={3}
            fill="#3b82f6"
            animatedProps={secondaryAnimatedProps}
          />
        ))}
      </G>
    </G>
  );

  // Toroid nüve için bobinler
  const renderToroidCoils = () => (
    <G>
      {/* Primer bobin */}
      <G>
        {Array.from({ length: visiblePrimaryTurns }).map((_, i) => {
          const angle = (i * 15) % 360;
          const radians = (angle * Math.PI) / 180;
          const x = 200 + 60 * Math.cos(radians);
          const y = 120 + 60 * Math.sin(radians);

          return (
            <AnimatedCircle
              key={`primary-${i}`}
              cx={x}
              cy={y}
              r={5}
              fill="#ef4444"
              animatedProps={primaryAnimatedProps}
            />
          );
        })}
      </G>

      {/* Sekonder bobin */}
      <G>
        {Array.from({ length: visibleSecondaryTurns }).map((_, i) => {
          const angle = (i * 15 + 180) % 360;
          const radians = (angle * Math.PI) / 180;
          const x = 200 + 60 * Math.cos(radians);
          const y = 120 + 60 * Math.sin(radians);

          return (
            <AnimatedCircle
              key={`secondary-${i}`}
              cx={x}
              cy={y}
              r={5}
              fill="#3b82f6"
              animatedProps={secondaryAnimatedProps}
            />
          );
        })}
      </G>
    </G>
  );

  return (
    <View style={styles.container}>
      <Svg width="400" height="240" viewBox="0 0 400 240">
        {coreType === 'E' && renderECoreCoils()}
        {coreType === 'U' && renderUCoreCoils()}
        {coreType === 'toroid' && renderToroidCoils()}
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default TransformerCoils;
