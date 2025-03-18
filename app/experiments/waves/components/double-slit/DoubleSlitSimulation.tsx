import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
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

  // Komponentlerin yatay pozisyonları (piksel cinsinden)
  const sourceX = screenWidth * 0.15; // Işık kaynağı sol tarafta
  const barrierX = screenWidth * 0.5; // Bariyer ortada
  const screenX = screenWidth * 0.85; // Ekran sağ tarafta

  // Ekran merkez Y pozisyonu
  const centerY = 100;

  // Yarıkların pozisyonları
  const separationPx = Math.min(80, slitSeparation * 10);
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
          {[...Array(5)].map((_, i) => {
            const radius = (((i + phase) % 5) / 5) * (barrierX - sourceX);
            if (radius > 0 && radius < barrierX - sourceX) {
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
                    opacity: 0.5 - radius / (barrierX - sourceX) / 4,
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
          {[...Array(6)].map((_, i) => {
            const maxRadius = screenX - barrierX;
            const radius = (((i + phase) % 6) / 6) * maxRadius;
            if (radius > 0 && radius < maxRadius) {
              return (
                <View
                  key={`slit1-wave-${i}`}
                  style={{
                    position: 'absolute',
                    left: barrierX,
                    top: slit1Y - radius,
                    width: radius,
                    height: radius * 2,
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
          {[...Array(6)].map((_, i) => {
            const maxRadius = screenX - barrierX;
            const radius = (((i + phase) % 6) / 6) * maxRadius;
            if (radius > 0 && radius < maxRadius) {
              return (
                <View
                  key={`slit2-wave-${i}`}
                  style={{
                    position: 'absolute',
                    left: barrierX,
                    top: slit2Y - radius,
                    width: radius,
                    height: radius * 2,
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
    const points = 9; // Ekrandaki nokta sayısı
    const waveLines = [];

    for (let i = 0; i < points; i++) {
      const targetY = centerY + (i - (points - 1) / 2) * 12;
      const opacity = 0.2 + (i % 2) * 0.1;

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
            opacity: (opacity * (1 + Math.sin(phase * Math.PI * 2))) / 2,
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
            opacity: (opacity * (1 + Math.cos(phase * Math.PI * 2))) / 2,
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
    return (
      <Animated.View
        style={[
          { position: 'absolute', left: 0, top: 0, right: 0, bottom: 0 },
          waveStyle,
        ]}
      >
        <View style={{ position: 'relative', width: '100%', height: '100%' }}>
          {/* Ekrana ışık ışınları - Ekrana eşit aralıklarla düşen ışık */}
          <View
            style={{
              position: 'absolute',
              left: barrierX,
              top: centerY - 40,
              width: screenX - barrierX,
              height: 80,
              backgroundColor: 'transparent',
              borderColor: color + '15',
              borderRightWidth: 1,
              borderLeftWidth: 0,
              borderTopWidth: 1,
              borderBottomWidth: 1,
              borderTopRightRadius: 80,
              borderBottomRightRadius: 80,
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

        {/* Işık Kaynağı */}
        <View style={[styles.componentPosition, { left: sourceX }]}>
          <WaveSource wavelength={wavelength} isActive={isRunning} />
        </View>

        {/* Çift Yarık Bariyeri */}
        <View style={[styles.componentPosition, { left: barrierX }]}>
          <SlitBarrier
            slitWidth={slitWidth}
            slitSeparation={slitSeparation}
            wavelength={wavelength}
            isActive={isRunning}
          />
        </View>

        {/* Ekran (Sağ tarafta) */}
        <View style={[styles.componentPosition, { left: screenX }]}>
          <InterferencePattern
            wavelength={wavelength}
            slitWidth={slitWidth}
            slitSeparation={slitSeparation}
            distanceToScreen={screenDistance}
            isActive={isRunning}
          />
        </View>
      </View>

      {/* Deney diyagramı */}
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
            {screenDistance.toFixed(0)} mm
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
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  canvasContainer: {
    height: 200,
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    overflow: 'hidden',
    position: 'relative',
  },
  componentPosition: {
    position: 'absolute',
    top: 20,
    bottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  diagramContainer: {
    marginTop: 16,
    paddingTop: 16,
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
    fontSize: 12,
    fontWeight: '500',
    color: '#64748b',
  },
  distanceContainer: {
    alignItems: 'center',
  },
  distanceLine: {
    width: 50,
    height: 2,
    backgroundColor: '#e2e8f0',
    borderRadius: 1,
  },
  distanceText: {
    fontSize: 11,
    fontFamily: 'monospace',
    color: '#94a3b8',
    marginTop: 4,
  },
});

export default DoubleSlitSimulation;
