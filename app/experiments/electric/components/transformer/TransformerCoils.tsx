import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { G, Rect, Circle } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withRepeat,
  withSequence,
  withTiming,
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

  // Toroid nüve için bobinler - halkanın tam üzerinde
  const renderToroidCoils = () => (
    <G>
      {/* Primer bobin (mavi) - toroid nüvesinin üst yarısı */}
      <G>
        {Array.from({ length: visiblePrimaryTurns }).map((_, i) => {
          // Sarımları yay şeklinde dağıtmak için açı hesaplaması
          // -135 dereceden -45 dereceye (üst yarıda)
          const angle = -135 + (i * 90) / (visiblePrimaryTurns - 1 || 1);
          const radians = (angle * Math.PI) / 180;

          // ÖNEMLİ: Radius değeri tam olarak nüvenin dış ve iç yarıçapı arasında olmalı
          // Toroid nüve 40 (iç) ve 80 (dış) yarıçaplara sahip, bu nedenle 60 kullanıyoruz
          const radius = 60;
          const x = 200 + radius * Math.cos(radians);
          const y = 120 + radius * Math.sin(radians);

          return (
            <AnimatedCircle
              key={`primary-${i}`}
              cx={x}
              cy={y}
              r={5}
              fill="#3b82f6" // Mavi renk
              animatedProps={primaryAnimatedProps}
            />
          );
        })}
      </G>

      {/* Sekonder bobin (kırmızı) - toroid nüvesinin alt yarısı */}
      <G>
        {Array.from({ length: visibleSecondaryTurns }).map((_, i) => {
          // Sarımları yay şeklinde dağıtmak için açı hesaplaması
          // 45 dereceden 135 dereceye (alt yarıda)
          const angle = 45 + (i * 90) / (visibleSecondaryTurns - 1 || 1);
          const radians = (angle * Math.PI) / 180;

          // ÖNEMLİ: Radius değeri tam olarak nüvenin dış ve iç yarıçapı arasında olmalı
          const radius = 60;
          const x = 200 + radius * Math.cos(radians);
          const y = 120 + radius * Math.sin(radians);

          return (
            <AnimatedCircle
              key={`secondary-${i}`}
              cx={x}
              cy={y}
              r={5}
              fill="#ef4444" // Kırmızı renk
              animatedProps={secondaryAnimatedProps}
            />
          );
        })}
      </G>
    </G>
  );

  // E tipi nüve için bobinler
  const renderECoreCoils = () => (
    <G>
      {/* Primer bobin - sol kol üzerinde */}
      <G>
        {Array.from({ length: visiblePrimaryTurns }).map((_, i) => (
          <AnimatedRect
            key={`primary-${i}`}
            x={130} // Sol kol üzerinde, tam ortalanmış
            y={90 + i * 7}
            width={40} // Nüveyi tamamen saracak genişlikte
            height={5}
            rx={2}
            fill="#ef4444"
            animatedProps={primaryAnimatedProps}
          />
        ))}
      </G>

      {/* Sekonder bobin - orta kol üzerinde */}
      <G>
        {Array.from({ length: visibleSecondaryTurns }).map((_, i) => (
          <AnimatedRect
            key={`secondary-${i}`}
            x={230} // Orta kol üzerinde, biraz daha sağa çekildi (180'den 195'e)
            y={90 + i * 7}
            width={40} // Nüveyi tamamen saracak genişlikte
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
      {/* Primer bobin - sol U üzerinde */}
      <G>
        {Array.from({ length: visiblePrimaryTurns }).map((_, i) => (
          <AnimatedRect
            key={`primary-${i}`}
            x={125} // Sol U nüvesinin üzerinde, tam ortalanmış
            y={70 + i * 8}
            width={75} // Nüveyi tamamen saracak genişlikte
            height={6}
            rx={3}
            fill="#ef4444"
            animatedProps={primaryAnimatedProps}
          />
        ))}
      </G>

      {/* Sekonder bobin - sağ U üzerinde */}
      <G>
        {Array.from({ length: visibleSecondaryTurns }).map((_, i) => (
          <AnimatedRect
            key={`secondary-${i}`}
            x={300} // Sağ U nüvesinin üzerinde, tam ortalanmış
            y={70 + i * 8}
            width={75} // Nüveyi tamamen saracak genişlikte
            height={6}
            rx={3}
            fill="#3b82f6"
            animatedProps={secondaryAnimatedProps}
          />
        ))}
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
    width: '100%',
    height: '100%',
    zIndex: 10, // Nüve üzerinde gösterilmesi için zIndex eklendi
  },
});

export default TransformerCoils;
