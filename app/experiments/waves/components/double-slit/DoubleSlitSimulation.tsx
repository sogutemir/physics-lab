import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  cancelAnimation,
} from 'react-native-reanimated';
import { useLanguage } from '../../../../../components/LanguageContext';
import { wavelengthToRGB } from '../../utils/physics';
import WaveSource from './WaveSource';
import SlitBarrier from './SlitBarrier';
import InterferencePattern from './InterferencePattern';

interface ExperimentSimulationProps {
  wavelength: number;
  slitWidth: number;
  slitSeparation: number;
  sourceDistance: number;
  screenDistance: number;
  isRunning: boolean;
}

const DoubleSlitSimulation: React.FC<ExperimentSimulationProps> = ({
  wavelength,
  slitWidth,
  slitSeparation,
  sourceDistance,
  screenDistance,
  isRunning,
}) => {
  const { t } = useLanguage();
  const { width: screenWidth } = Dimensions.get('window');
  const color = wavelengthToRGB(wavelength);
  const [phase, setPhase] = useState(0);

  // Dalga animasyonu için shared values
  const waveOpacity = useSharedValue(0);

  // Bariyerin konumu her zaman sabit
  const barrierX = screenWidth * 0.5; // Bariyer tam ortada sabit

  // Mobil cihazlarda uyum kontrolü
  const { width: deviceWidth } = Dimensions.get('window');
  const isMobile = deviceWidth < 768;

  // Mobil cihazlarda ekran mesafesini sınırla
  const effectiveScreenDistance =
    isMobile && screenDistance > 200 ? 200 : screenDistance;

  // Kaynak pozisyonu sadece kaynak mesafesine bağlı
  const sourceX = Math.max(10, barrierX - (sourceDistance / 100) * 40);

  // Ekran pozisyonu sadece ekran mesafesine bağlı - mobilde güvenli sınırlar içinde
  const screenXRatio = (effectiveScreenDistance / 100) * 40;
  const maxScreenX = screenWidth * 0.85; // Güvenli sınır
  const screenX = Math.min(maxScreenX, barrierX + screenXRatio);

  // Ekran merkez Y pozisyonu (mobil cihazlarda daha kompakt olması için)
  const centerY = 80;

  // Yarıkların pozisyonları (mobil cihazlar için yarık ayrımını daha küçük tutuyoruz)
  const separationPx = Math.min(60, slitSeparation * 8);
  const slit1Y = centerY - separationPx / 2;
  const slit2Y = centerY + separationPx / 2;

  // Faz animasyonu
  useEffect(() => {
    if (isRunning) {
      const interval = setInterval(() => {
        setPhase((prev) => (prev + 0.05) % 1);
      }, 50);

      return () => clearInterval(interval);
    }
  }, [isRunning]);

  // Dalga animasyonları
  useEffect(() => {
    if (isRunning) {
      waveOpacity.value = withTiming(0.8, { duration: 500 });
    } else {
      waveOpacity.value = withTiming(0, { duration: 300 });
    }

    return () => {
      cancelAnimation(waveOpacity);
    };
  }, [isRunning]);

  // Animasyon stili
  const waveStyle = useAnimatedStyle(() => ({
    opacity: waveOpacity.value,
  }));

  // Işık kaynağından çıkan dalgaları çizme
  const renderSourceWaves = () => {
    return (
      <Animated.View
        style={[
          { position: 'absolute', left: 0, top: 0, right: 0, bottom: 0 },
          waveStyle,
        ]}
      >
        <View style={{ position: 'relative', width: '100%', height: '100%' }}>
          {/* Işık kaynağından çıkan dairesel dalgalar */}
          {[...Array(4)].map((_, i) => {
            const maxRadius = barrierX - sourceX;
            const radius = (((i + phase) % 4) / 4) * maxRadius;
            if (radius > 0 && radius < maxRadius) {
              return (
                <View
                  key={`source-wave-${i}`}
                  style={{
                    position: 'absolute',
                    left: sourceX - radius,
                    top: centerY - radius,
                    width: radius * 2,
                    height: radius * 2,
                    borderRadius: radius,
                    borderWidth: 1,
                    borderColor: color + '60', // Yarı saydam renk
                    opacity: 0.5 - radius / maxRadius / 3,
                  }}
                />
              );
            }
            return null;
          })}
        </View>
      </Animated.View>
    );
  };

  // Yarıklardan çıkan girişim dalgalarını çizme
  const renderInterferenceWaves = () => {
    return (
      <Animated.View
        style={[
          { position: 'absolute', left: 0, top: 0, right: 0, bottom: 0 },
          waveStyle,
        ]}
      >
        <View style={{ position: 'relative', width: '100%', height: '100%' }}>
          {/* Üst yarıktan çıkan dalgalar - Ekrana doğru (sağa) */}
          {[...Array(4)].map((_, i) => {
            const maxRadius = screenX - barrierX;
            const radius = (((i + phase) % 4) / 4) * maxRadius;

            // Yarık genişliğine göre yayılan dalganın açısını ayarla
            const waveAngle = Math.max(20, 70 - slitWidth * 20); // Yarık genişliği artınca dalga açısı azalır
            // Ekran mesafesi arttıkça dalga yayılımı azalır (ters orantılı)
            const distanceFactor = Math.min(
              1.0,
              Math.max(0.4, 100 / effectiveScreenDistance)
            );

            if (radius > 0 && radius < maxRadius) {
              return (
                <View
                  key={`slit1-wave-${i}`}
                  style={{
                    position: 'absolute',
                    left: barrierX,
                    top:
                      slit1Y -
                      radius *
                        Math.sin((waveAngle * Math.PI) / 180) *
                        distanceFactor,
                    width: radius,
                    height:
                      radius *
                      2 *
                      Math.sin((waveAngle * Math.PI) / 180) *
                      distanceFactor,
                    borderTopRightRadius: radius,
                    borderBottomRightRadius: radius,
                    borderRightWidth: 1,
                    borderTopWidth: 1,
                    borderBottomWidth: 1,
                    borderLeftWidth: 0,
                    borderColor: color + '40',
                    opacity: 0.6 - radius / maxRadius / 2,
                  }}
                />
              );
            }
            return null;
          })}

          {/* Alt yarıktan çıkan dalgalar - Ekrana doğru (sağa) */}
          {[...Array(4)].map((_, i) => {
            const maxRadius = screenX - barrierX;
            const radius = (((i + phase) % 4) / 4) * maxRadius;

            // Yarık genişliğine göre yayılan dalganın açısını ayarla
            const waveAngle = Math.max(20, 70 - slitWidth * 20); // Yarık genişliği artınca dalga açısı azalır
            // Ekran mesafesi arttıkça dalga yayılımı azalır (ters orantılı)
            const distanceFactor = Math.min(
              1.0,
              Math.max(0.4, 100 / effectiveScreenDistance)
            );

            if (radius > 0 && radius < maxRadius) {
              return (
                <View
                  key={`slit2-wave-${i}`}
                  style={{
                    position: 'absolute',
                    left: barrierX,
                    top:
                      slit2Y -
                      radius *
                        Math.sin((waveAngle * Math.PI) / 180) *
                        distanceFactor,
                    width: radius,
                    height:
                      radius *
                      2 *
                      Math.sin((waveAngle * Math.PI) / 180) *
                      distanceFactor,
                    borderTopRightRadius: radius,
                    borderBottomRightRadius: radius,
                    borderRightWidth: 1,
                    borderTopWidth: 1,
                    borderBottomWidth: 1,
                    borderLeftWidth: 0,
                    borderColor: color + '40',
                    opacity: 0.6 - radius / maxRadius / 2,
                  }}
                />
              );
            }
            return null;
          })}
        </View>
      </Animated.View>
    );
  };

  // Dikey ışık ışınları çizme
  const renderVerticalLightLines = () => {
    return (
      <Animated.View
        style={[
          { position: 'absolute', left: 0, top: 0, right: 0, bottom: 0 },
          waveStyle,
        ]}
      >
        <View style={{ position: 'relative', width: '100%', height: '100%' }}>
          {/* Dikey çizgi - barrierX'ten screenX'e kadar */}
          <View
            style={{
              position: 'absolute',
              left: barrierX,
              top: 0,
              bottom: 0,
              width: 1,
              backgroundColor: '#6b7280',
              opacity: 0.3,
            }}
          />

          {/* Dikey çizgi - ekranın bulunduğu konumda */}
          <View
            style={{
              position: 'absolute',
              left: screenX,
              top: 0,
              bottom: 0,
              width: 1,
              backgroundColor: '#6b7280',
              opacity: 0.3,
            }}
          />
        </View>
      </Animated.View>
    );
  };

  // Işık ışınlarının yarıklardan ekrana giden yolunu çizme
  const renderInterferencePattern = () => {
    // Ekrandaki farklı noktalara giden dalga yolları
    const points = 5; // Ekrandaki nokta sayısı (azaltıldı)
    const waveLines = [];

    // Yarık ayrımına göre maksimum ve minimum mesafeleri ayarla
    const spread = Math.min(30, 15 + slitSeparation * 5); // Yarık ayrımı artınca ışınlar daha geniş açı yapar

    // Ekran mesafesi arttıkça ışınların açılma faktörü - ters orantılı
    const distanceFactor = Math.min(
      1.5,
      Math.max(0.5, 200 / effectiveScreenDistance)
    );

    for (let i = 0; i < points; i++) {
      // Yarık ayrımına göre hedef noktaları ayarla - ekran mesafesini de hesaba katıyoruz
      const targetY =
        centerY + ((i - (points - 1) / 2) * spread) / distanceFactor;

      // Yarık genişliği ve ayrımına göre parlaklık hesapla
      const normalizedPos = (i - (points - 1) / 2) / ((points - 1) / 2);
      const phaseShift = (Math.abs(normalizedPos) * Math.PI) / 2; // Faz farkı
      // Ekran mesafesi arttıkça girişim daha belirgin
      const distanceIntensityFactor = Math.min(
        1.2,
        Math.max(0.6, effectiveScreenDistance / 100)
      );
      const interferenceFactor =
        Math.pow(Math.cos((slitSeparation * normalizedPos * Math.PI) / 2), 2) *
        distanceIntensityFactor;
      const opacity = 0.2 + interferenceFactor * 0.5;

      // Üst yarıktan gelen ışın
      waveLines.push(
        <View
          key={`wave-line-top-${i}`}
          style={{
            position: 'absolute',
            left: barrierX,
            top: slit1Y,
            width: Math.sqrt(
              Math.pow(screenX - barrierX, 2) + Math.pow(targetY - slit1Y, 2)
            ),
            height: 1,
            backgroundColor: color + '40',
            transformOrigin: 'left',
            transform: [
              {
                rotate: `${
                  Math.atan2(targetY - slit1Y, screenX - barrierX) *
                  (180 / Math.PI)
                }deg`,
              },
            ],
            opacity:
              (opacity * (1 + Math.sin(phase * Math.PI * 2 + phaseShift))) / 2,
          }}
        />
      );

      // Alt yarıktan gelen ışın
      waveLines.push(
        <View
          key={`wave-line-bottom-${i}`}
          style={{
            position: 'absolute',
            left: barrierX,
            top: slit2Y,
            width: Math.sqrt(
              Math.pow(screenX - barrierX, 2) + Math.pow(targetY - slit2Y, 2)
            ),
            height: 1,
            backgroundColor: color + '40',
            transformOrigin: 'left',
            transform: [
              {
                rotate: `${
                  Math.atan2(targetY - slit2Y, screenX - barrierX) *
                  (180 / Math.PI)
                }deg`,
              },
            ],
            opacity:
              (opacity * (1 + Math.cos(phase * Math.PI * 2 + phaseShift))) / 2,
          }}
        />
      );
    }

    return (
      <Animated.View
        style={[
          { position: 'absolute', left: 0, top: 0, right: 0, bottom: 0 },
          waveStyle,
        ]}
      >
        <View style={{ position: 'relative', width: '100%', height: '100%' }}>
          {waveLines}
        </View>
      </Animated.View>
    );
  };

  // Ekrana ışık izdüşümünü çizme
  const renderLightToScreen = () => {
    // Ekran mesafesine göre ışık hüzmesi genişliği
    const beamHeight = Math.min(60, 30 + (effectiveScreenDistance / 100) * 30);

    return (
      <Animated.View
        style={[
          { position: 'absolute', left: 0, top: 0, right: 0, bottom: 0 },
          waveStyle,
        ]}
      >
        <View style={{ position: 'relative', width: '100%', height: '100%' }}>
          {/* Ekrana ışık ışınları - Mobil için daha kompakt */}
          <View
            style={{
              position: 'absolute',
              left: barrierX,
              top: centerY - beamHeight / 2,
              width: screenX - barrierX,
              height: beamHeight,
              backgroundColor: 'transparent',
              borderColor: color + '15',
              borderRightWidth: 1,
              borderLeftWidth: 0,
              borderTopWidth: 1,
              borderBottomWidth: 1,
              borderTopRightRadius: beamHeight,
              borderBottomRightRadius: beamHeight,
              opacity: 0.6 + Math.sin(phase * Math.PI * 2) * 0.2,
            }}
          />
        </View>
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.canvasContainer}>
        {/* Dikey çizgiler */}
        {renderVerticalLightLines()}

        {/* Işık kaynağından engele doğru ışık genişlemesi */}
        {renderSourceWaves()}

        {/* Engelden ekrana doğru ışık yayılması */}
        {renderLightToScreen()}

        {/* Yarıklardan çıkan dalgalar */}
        {renderInterferenceWaves()}

        {/* Girişim deseni - Noktalardan giden ışınlar */}
        {renderInterferencePattern()}

        {/* Işık Kaynağı - daha kompakt */}
        <View
          style={[styles.componentPosition, { left: sourceX, height: 120 }]}
        >
          <WaveSource wavelength={wavelength} isActive={isRunning} />
        </View>

        {/* Çift Yarık Bariyeri - daha kompakt */}
        <View
          style={[styles.componentPosition, { left: barrierX, height: 120 }]}
        >
          <SlitBarrier
            slitWidth={slitWidth}
            slitSeparation={slitSeparation}
            wavelength={wavelength}
            isActive={isRunning}
          />
        </View>

        {/* Ekran (Sağ tarafta) - daha kompakt */}
        <View
          style={[styles.componentPosition, { left: screenX, height: 120 }]}
        >
          <InterferencePattern
            wavelength={wavelength}
            slitWidth={slitWidth}
            slitSeparation={slitSeparation}
            distanceToScreen={screenDistance}
            isActive={isRunning}
          />
        </View>
      </View>

      {/* Deney diyagramı - mobil için daha kompakt */}
      <View style={styles.diagramContainer}>
        <View style={styles.diagramLabel}>
          <Text style={styles.diagramText}>
            {t('Işık Kaynağı', 'Light Source')}
          </Text>
        </View>

        <View style={styles.distanceContainer}>
          <View style={styles.distanceLine}></View>
          <Text style={styles.distanceText}>
            {sourceDistance.toFixed(0)} mm
          </Text>
        </View>

        <View style={styles.diagramLabel}>
          <Text style={styles.diagramText}>
            {t('Çift Yarık', 'Double Slit')}
          </Text>
        </View>

        <View style={styles.distanceContainer}>
          <View style={styles.distanceLine}></View>
          <Text style={styles.distanceText}>
            {effectiveScreenDistance.toFixed(0)} mm
          </Text>
        </View>

        <View style={styles.diagramLabel}>
          <Text style={styles.diagramText}>{t('Ekran', 'Screen')}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 12, // Daha az padding
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  canvasContainer: {
    height: 140, // Daha kısa yükseklik
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    overflow: 'hidden',
    position: 'relative',
  },
  componentPosition: {
    position: 'absolute',
    top: 10, // Daha az boşluk
    bottom: 10, // Daha az boşluk
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  diagramContainer: {
    marginTop: 12, // Daha az boşluk
    paddingTop: 12, // Daha az boşluk
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  diagramLabel: {
    alignItems: 'center',
  },
  diagramText: {
    fontSize: 10, // Daha küçük yazı
    fontWeight: '500',
    color: '#64748b',
  },
  distanceContainer: {
    alignItems: 'center',
  },
  distanceLine: {
    width: 40, // Daha kısa çizgi
    height: 2,
    backgroundColor: '#e2e8f0',
    borderRadius: 1,
  },
  distanceText: {
    fontSize: 9, // Daha küçük yazı
    fontFamily: 'monospace',
    color: '#94a3b8',
    marginTop: 4,
  },
});

export default DoubleSlitSimulation;
