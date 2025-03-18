import React from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { useLanguage } from '../../../../../components/LanguageContext';
import { wavelengthToColor } from '../../utils/photoelectric';

interface PhotonSourceProps {
  wavelength: number;
  intensity: number;
  isActive: boolean;
}

const PhotonSource: React.FC<PhotonSourceProps> = ({
  wavelength,
  intensity,
  isActive,
}) => {
  const { t } = useLanguage();
  const lightColor = wavelengthToColor(wavelength);

  // Animasyon için Animated değerleri
  const photonAnimValues = React.useRef<Animated.Value[]>([]);
  const [photonCount, setPhotonCount] = React.useState(0);

  React.useEffect(() => {
    // Işık şiddetine göre foton sayısını hesapla
    const newPhotonCount = Math.max(1, Math.floor(intensity / 10));
    setPhotonCount(newPhotonCount);

    // Animasyon değerlerini ayarla
    photonAnimValues.current = Array(newPhotonCount)
      .fill(0)
      .map(() => new Animated.Value(0));
  }, [intensity]);

  React.useEffect(() => {
    // Işık aktifse animasyonu başlat
    if (isActive && photonCount > 0) {
      // Tüm fotonlar için animasyon oluştur
      const animations = photonAnimValues.current.map((anim, index) => {
        // Animasyonu başa al
        anim.setValue(0);
        // Fotonun hareketini sağlayan animasyon
        return Animated.timing(anim, {
          toValue: 1,
          duration: 1000 + Math.random() * 500,
          useNativeDriver: true,
          // Her foton için farklı gecikme ile başlat
          delay: (index * 200) % 1000,
        });
      });

      // Animasyonları sırayla ve tekrarlayarak başlat
      const loop = Animated.loop(Animated.stagger(100, animations));

      loop.start();

      return () => {
        loop.stop();
      };
    }
  }, [isActive, photonCount]);

  return (
    <View style={styles.container}>
      {/* Işık kaynağı */}
      <View style={styles.source}>
        <View style={styles.sourceInner}>
          <View
            style={[
              styles.lightBulb,
              {
                backgroundColor: lightColor,
                opacity: isActive ? 0.9 : 0.3,
                shadowColor: lightColor,
                shadowOpacity: isActive ? 0.8 : 0.1,
              },
            ]}
          />
        </View>
      </View>

      {/* Işın demetleri */}
      {isActive &&
        photonAnimValues.current.map((anim, index) => (
          <Animated.View
            key={index}
            style={[
              styles.photon,
              {
                backgroundColor: lightColor,
                top: (index - photonCount / 2) * 4 + 80,
                opacity: 0.7,
                transform: [
                  {
                    translateX: anim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, 100],
                    }),
                  },
                  {
                    scale: anim.interpolate({
                      inputRange: [0, 0.5, 1],
                      outputRange: [0.8, 1, 0.8],
                    }),
                  },
                ],
              },
            ]}
          />
        ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 160,
    width: 96,
    alignItems: 'center',
    justifyContent: 'flex-end',
    position: 'relative',
  },
  source: {
    width: 64,
    height: 96,
    backgroundColor: '#333',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sourceInner: {
    position: 'absolute',
    top: 8,
    bottom: 8,
    left: 8,
    right: 8,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    backgroundColor: '#444',
    alignItems: 'center',
    justifyContent: 'center',
  },
  lightBulb: {
    width: 32,
    height: 32,
    borderRadius: 16,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 0 },
  },
  photon: {
    position: 'absolute',
    height: 4,
    width: 20,
    borderRadius: 2,
    left: 80,
  },
});

export default PhotonSource;
