import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Platform, Dimensions } from 'react-native';
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

interface InterferencePatternProps {
  wavelength: number;
  slitWidth: number;
  slitSeparation: number;
  distanceToScreen: number;
  isActive: boolean;
}

// Ekran bileşeni (Frame + stand)
const ScreenFrame: React.FC<{ color: string }> = ({ color }) => (
  <View style={styles.screenFrame}>
    {/* Ekran standı */}
    <View style={styles.screenStand} />

    {/* Ekran üst ve alt destekleri */}
    <View style={[styles.screenSupport, { top: 0 }]} />
    <View style={[styles.screenSupport, { bottom: 0 }]} />
  </View>
);

const InterferencePattern: React.FC<InterferencePatternProps> = ({
  wavelength,
  slitWidth,
  slitSeparation,
  distanceToScreen,
  isActive,
}) => {
  const { t } = useLanguage();
  const color = wavelengthToRGB(wavelength);

  // Mobil cihaz kontrolü
  const { width: deviceWidth } = Dimensions.get('window');
  const isMobile = Platform.OS !== 'web' || deviceWidth < 768;

  // Mobil cihazlarda ekran mesafesini sınırla
  const effectiveDistance =
    isMobile && distanceToScreen > 200 ? 200 : distanceToScreen;

  // Animasyon değerleri
  const patternOpacity = useSharedValue(0);
  const pulseIntensity = useSharedValue(1);

  // Girişim deseni animasyonu
  useEffect(() => {
    if (isActive) {
      patternOpacity.value = withTiming(1, { duration: 500 });
      pulseIntensity.value = withRepeat(
        withTiming(1.2, { duration: 1000, easing: Easing.inOut(Easing.sin) }),
        -1,
        true
      );
    } else {
      cancelAnimation(pulseIntensity);
      patternOpacity.value = withTiming(0, { duration: 300 });
      pulseIntensity.value = withTiming(1);
    }

    return () => {
      cancelAnimation(patternOpacity);
      cancelAnimation(pulseIntensity);
    };
  }, [isActive]);

  // Animasyon stilleri
  const patternStyle = useAnimatedStyle(() => ({
    opacity: patternOpacity.value,
  }));

  const pulseStyle = useAnimatedStyle(() => ({
    opacity: patternOpacity.value * pulseIntensity.value,
  }));

  // Girişim deseni oluşturma (parametrelere göre dinamik)
  const renderInterferencePattern = () => {
    // Girişim deseni parametreleri
    const lineCount = 11; // Toplam çizgi sayısı
    const lines = [];

    // Yarık ayrımı etkisi - d sin(theta) = m * lambda formülünden
    // d arttıkça çizgiler sıklaşır (dalga boyu sabit için)
    const baseSpacing = 7;

    // Ekran mesafesi etkisi - L * sin(theta) ters orantılı
    // Ekran uzaklaştıkça desenler genişler
    const distanceFactor = Math.sqrt(effectiveDistance / 100);

    // Ekran mesafesi ve yarık ayrımının kombinasyonu
    const spacing = baseSpacing * (2 / (slitSeparation + 0.5)) * distanceFactor;

    // Yarık genişliği etkisi - a sin(theta) = m * lambda
    // a küçüldükçe maksimum ve minimumlar belirginsizleşir
    const maxBrightness = Math.min(1, 1.5 / (slitWidth + 0.5)); // Yarık genişliği artınca maksimum düşer
    const minBrightness = Math.max(0.05, 0.1 / (slitWidth + 0.5)); // Minimum parlaklık artar

    for (let i = 0; i < lineCount; i++) {
      // Merkezi çizgi ve alternatif parlak/karanlık bantlar
      const isCenterLine = i === Math.floor(lineCount / 2);
      const position = i - Math.floor(lineCount / 2); // -5 to +5

      // Mesafenin girişim deseni üzerindeki etkisi
      const normPosition = position / Math.floor(lineCount / 2); // -1 to +1

      // Mesafeye bağlı ölçekleme faktörü - yakın mesafede desenler sıkışık, uzak mesafede genişlemiş olmalı
      const scaledPosition = normPosition / distanceFactor;

      // Merkezdeki yoğunluk zarfı
      const envelopeValue = Math.cos((Math.PI * scaledPosition) / 2); // 1 den 0'a

      // Slit ayrımı ve mesafeye bağlı girişim
      const interference = Math.pow(
        Math.cos((Math.PI * slitSeparation * scaledPosition) / 2),
        2
      );

      // Mesafeye bağlı kırınım faktörü
      const diffractionFactor = Math.min(
        1.2,
        Math.max(0.7, effectiveDistance / 150)
      );

      // Kırınım deseni
      const diffraction =
        Math.pow(
          Math.sin(Math.PI * slitWidth * scaledPosition + 0.001) /
            (Math.PI * slitWidth * scaledPosition + 0.001),
          2
        ) * diffractionFactor;

      // Toplam opaklık hesabı
      let opacity = isCenterLine
        ? maxBrightness
        : interference *
          envelopeValue *
          maxBrightness *
          (1 - 0.3 * Math.abs(normPosition));

      // Mesafe arttıkça maksimumlar daha belirgin olur
      if (effectiveDistance > 150 && !isCenterLine && interference > 0.7) {
        opacity = opacity * Math.min(1.3, effectiveDistance / 150);
      }

      // Belirli bir maksimum ve minimum arasında sınırlama
      opacity = Math.max(minBrightness, Math.min(maxBrightness, opacity));

      lines.push(
        <View
          key={`line-${i}`}
          style={[
            styles.intensityLine,
            {
              top: 5 + i * spacing,
              backgroundColor: color,
              opacity,
              height: isCenterLine ? 3 : 2, // Merkez çizgi daha kalın
            },
          ]}
        />
      );
    }

    return lines;
  };

  return (
    <View style={styles.container}>
      <View style={styles.screenContainer}>
        {/* Ekran çerçevesi */}
        <ScreenFrame color={color} />

        {/* Girişim deseni ekranı */}
        <View style={styles.screen}>
          <Animated.View style={[styles.patternContainer, patternStyle]}>
            {renderInterferencePattern()}
          </Animated.View>
        </View>
      </View>

      {/* Etiket */}
      <View style={styles.label}>
        <Text style={styles.labelText}>{t('Ekran', 'Screen')}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 140, // Daha kısa
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    right: 10, // Sağdan biraz içeri çekiyoruz
  },
  screenContainer: {
    width: 25, // Daha dar
    height: 90, // Daha kısa
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  screenFrame: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderWidth: 2,
    borderColor: '#64748b',
    borderRadius: 4,
    backgroundColor: 'transparent',
  },
  screen: {
    width: '88%',
    height: '92%',
    backgroundColor: '#111', // Daha koyu arka plan
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 2,
  },
  patternContainer: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  intensityLine: {
    position: 'absolute',
    left: 1,
    right: 1,
    height: 2, // Daha ince
    borderRadius: 1,
  },
  screenStand: {
    position: 'absolute',
    bottom: -12,
    width: 2,
    height: 16,
    backgroundColor: '#94a3b8',
    zIndex: -1,
  },
  screenSupport: {
    position: 'absolute',
    left: 0,
    width: 6,
    height: 8,
    backgroundColor: '#94a3b8',
    zIndex: -1,
  },
  label: {
    position: 'absolute',
    bottom: -18, // Daha yakın
    alignItems: 'center',
  },
  labelText: {
    fontSize: 10, // Daha küçük
    fontWeight: '500',
    color: '#4b5563',
  },
});

export default InterferencePattern;
