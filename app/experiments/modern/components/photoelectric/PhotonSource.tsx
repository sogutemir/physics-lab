import React, { useRef } from 'react';
import { View, StyleSheet, Animated, Platform } from 'react-native';
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
  const isMobile = Platform.OS !== 'web';

  // Animasyon için Animated değerleri
  const photonAnimValues = useRef<Animated.Value[]>([]);
  const [photonCount, setPhotonCount] = React.useState(0);
  // Animasyon referansını saklamak için
  const animationRef = useRef<Animated.CompositeAnimation | null>(null);

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
    // Önceki animasyonu durdur
    if (animationRef.current) {
      animationRef.current.stop();
      animationRef.current = null;
    }

    // Işık aktifse animasyonu başlat
    if (isActive && photonCount > 0 && photonAnimValues.current) {
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
      animationRef.current = loop;

      return () => {
        if (animationRef.current) {
          animationRef.current.stop();
          animationRef.current = null;
        }
      };
    }
  }, [isActive, photonCount]);

  // Foton için translation hesaplama
  const getPhotonTranslation = (anim: Animated.Value) => {
    // Metale kadar olan mesafe (60) - mobilde metal yüzey daha ince (40px) ama fotonlar metal yüzeyin başlangıcına kadar gitmeli
    const distanceToMetal = isMobile ? 60 : 60;

    return anim.interpolate({
      inputRange: [0, 1],
      // Fotonlar metal yüzeyin başlangıcına kadar gidecek, metali geçmeyecek
      outputRange: [0, distanceToMetal],
    });
  };

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
        photonAnimValues.current &&
        photonAnimValues.current.length > 0 &&
        photonAnimValues.current.map((anim, index) => (
          <Animated.View
            key={`photon-${index}`}
            style={[
              styles.photon,
              {
                backgroundColor: lightColor,
                top: (index - photonCount / 2) * 4 + 80,
                width: isMobile ? 35 : 20, // Mobilde daha kısa fotonlar, metal yüzeyi geçmemesi için
                opacity: anim.interpolate({
                  inputRange: [0, 0.8, 1],
                  outputRange: [0.7, 0.9, 0], // Foton metal yüzeye yaklaştıkça kaybolur
                }),
                transform: [
                  {
                    translateX: getPhotonTranslation(anim),
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
