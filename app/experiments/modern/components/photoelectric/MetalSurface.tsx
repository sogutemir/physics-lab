import React from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { useLanguage } from '../../../../../components/LanguageContext';
import { MetalType } from '../../utils/photoelectric';

interface MetalSurfaceProps {
  metalType: MetalType;
  emittingElectrons: boolean;
  intensity: number;
}

const MetalSurface: React.FC<MetalSurfaceProps> = ({
  metalType,
  emittingElectrons,
  intensity,
}) => {
  const { t } = useLanguage();

  // Elektron animasyonları için değişkenler
  const electronAnimValues = React.useRef<Animated.Value[]>([]);
  const [electronCount, setElectronCount] = React.useState(0);

  React.useEffect(() => {
    // Elektron yoğunluğu (ışık şiddetine bağlı)
    const newElectronCount = emittingElectrons
      ? Math.max(1, Math.floor(intensity / 20))
      : 0;
    setElectronCount(newElectronCount);

    // Animasyon değerlerini ayarla
    electronAnimValues.current = Array(newElectronCount)
      .fill(0)
      .map(() => new Animated.Value(0));
  }, [intensity, emittingElectrons]);

  React.useEffect(() => {
    // Elektron emisyonu varsa animasyonu başlat
    if (emittingElectrons && electronCount > 0) {
      // Tüm elektronlar için animasyon oluştur
      const animations = electronAnimValues.current.map((anim, index) => {
        // Animasyonu başa al
        anim.setValue(0);
        // Elektronun hareketini sağlayan animasyon
        return Animated.timing(anim, {
          toValue: 1,
          duration: 800 + Math.random() * 400,
          useNativeDriver: true,
          // Her elektron için farklı gecikme ile başlat
          delay: (index * 300) % 1200,
        });
      });

      // Animasyonları sırayla ve tekrarlayarak başlat
      const loop = Animated.loop(Animated.stagger(150, animations));

      loop.start();

      return () => {
        loop.stop();
      };
    }
  }, [emittingElectrons, electronCount]);

  // Metal türüne göre renk belirle
  const getMetalColor = () => {
    switch (metalType) {
      case 'potassium':
        return '#c0c0c0'; // Gümüş-gri
      case 'sodium':
        return '#ffd700'; // Altın-sarı
      case 'copper':
        return '#b87333'; // Bakır rengi
      case 'zinc':
        return '#d3d3d3'; // Açık gri
      default:
        return '#a0a0a0'; // Varsayılan metal rengi
    }
  };

  return (
    <View style={styles.container}>
      {/* Metal yüzeyi */}
      <View style={[styles.metalSurface, { backgroundColor: getMetalColor() }]}>
        <View style={styles.metalGradient} />
      </View>

      {/* Elektron emisyonu */}
      {emittingElectrons &&
        electronAnimValues.current.map((anim, index) => (
          <Animated.View
            key={index}
            style={[
              styles.electron,
              {
                top: 100 + Math.random() * 40 - 20,
                transform: [
                  {
                    translateX: anim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, 100],
                    }),
                  },
                  {
                    translateY: anim.interpolate({
                      inputRange: [0, 0.5, 1],
                      outputRange: [0, 5 * Math.sin(index), 0],
                    }),
                  },
                  {
                    scale: anim.interpolate({
                      inputRange: [0, 0.5, 1],
                      outputRange: [0.7, 1, 0.7],
                    }),
                  },
                ],
                opacity: anim.interpolate({
                  inputRange: [0, 0.1, 0.9, 1],
                  outputRange: [0, 1, 1, 0],
                }),
              },
            ]}
          />
        ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  metalSurface: {
    height: 256,
    width: 80,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  metalGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 8,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    opacity: 0.6,
  },
  electron: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#50a8ff',
    shadowColor: '#1e90ff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 4,
    left: 80,
  },
});

export default MetalSurface;
