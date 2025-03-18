import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Animated,
  Platform,
} from 'react-native';
import { useLanguage } from '../../../../../components/LanguageContext';
import PhotonSource from './PhotonSource';
import MetalSurface from './MetalSurface';
import ElectronCollector from './ElectronCollector';
import ControlPanel from './ControlPanel';
import {
  MetalType,
  calculateCurrent,
  calculateKineticEnergy,
  calculateThresholdFrequency,
  generateIVCurveData,
  generateEnergyFrequencyData,
  frequencyToWavelength,
} from '../../utils/photoelectric';

const PhotoelectricSimulator: React.FC = () => {
  const { language, t } = useLanguage();
  const isMobile = Platform.OS !== 'web';

  // Durum değişkenleri
  const [frequency, setFrequency] = useState(6e14); // 600 THz (yaklaşık 500 nm)
  const [intensity, setIntensity] = useState(50); // %50
  const [metalType, setMetalType] = useState<MetalType>('sodium'); // Sodyum
  const [stoppingVoltage, setStoppingVoltage] = useState(0); // 0V
  const [temperature, setTemperature] = useState(300); // 300K (oda sıcaklığı)
  const [isLightOn, setIsLightOn] = useState(true);

  // Hesaplanmış değerler
  const [current, setCurrent] = useState(0);
  const [kineticEnergy, setKineticEnergy] = useState(0);
  const [ivCurveData, setIVCurveData] = useState<any[]>([]);
  const [efCurveData, setEFCurveData] = useState<any[]>([]);

  // Animasyon için değişkenler
  const emissionAnimation = useRef(new Animated.Value(0)).current;
  const collectAnimation = useRef(new Animated.Value(0)).current;
  // Animasyon referansını saklamak için
  const animationRef = useRef<Animated.CompositeAnimation | null>(null);

  // Eşik frekansını hesapla
  const thresholdFrequency = calculateThresholdFrequency(metalType);

  // Elektron emisyonu oluyor mu?
  const isEmittingElectrons =
    isLightOn && frequency >= thresholdFrequency && kineticEnergy > 0;

  // Emisyon durumu değiştiğinde animasyon
  useEffect(() => {
    // Önceki animasyonu durdur
    if (animationRef.current) {
      animationRef.current.stop();
      animationRef.current = null;
    }

    if (isEmittingElectrons) {
      const animation = Animated.sequence([
        Animated.timing(emissionAnimation, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(collectAnimation, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]);

      animation.start();
      animationRef.current = animation;
    } else {
      const animation = Animated.parallel([
        Animated.timing(emissionAnimation, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(collectAnimation, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]);

      animation.start();
      animationRef.current = animation;
    }

    // Temizleme fonksiyonu
    return () => {
      if (animationRef.current) {
        animationRef.current.stop();
        animationRef.current = null;
      }
    };
  }, [isEmittingElectrons, emissionAnimation, collectAnimation]);

  // Değerler değiştiğinde hesaplamaları güncelle
  useEffect(() => {
    if (isLightOn) {
      const newKineticEnergy = calculateKineticEnergy(
        frequency,
        metalType,
        stoppingVoltage
      );
      const newCurrent = calculateCurrent(
        frequency,
        intensity,
        metalType,
        stoppingVoltage,
        temperature
      );

      setKineticEnergy(newKineticEnergy);
      setCurrent(newCurrent);

      // I-V eğrisi verilerini güncelle
      setIVCurveData(
        generateIVCurveData(frequency, intensity, metalType, temperature)
      );

      // E-f eğrisi verilerini güncelle
      const minFreq = Math.max(1e14, thresholdFrequency * 0.8);
      const maxFreq = 2e15;
      setEFCurveData(generateEnergyFrequencyData(minFreq, maxFreq, metalType));
    } else {
      setKineticEnergy(0);
      setCurrent(0);
    }
  }, [
    frequency,
    intensity,
    metalType,
    stoppingVoltage,
    temperature,
    isLightOn,
    thresholdFrequency,
  ]);

  // Veri değişikliğini vurgulama
  const highlightValue = (current: number, previous: number) => {
    if (previous === 0 && current > 0) return styles.resultHighlightPositive;
    if (previous > 0 && current === 0) return styles.resultHighlightNegative;
    if (current > previous * 1.5) return styles.resultHighlightPositive;
    if (current < previous * 0.5 && current > 0)
      return styles.resultHighlightNegative;
    return null;
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.experimentContainer}>
        {/* Deney Aparatı */}
        <Animated.View
          style={[
            styles.experimentSetup,
            {
              opacity: isLightOn ? 1 : 0.7,
              transform: [
                {
                  scale: isLightOn
                    ? Animated.add(
                        1,
                        Animated.multiply(emissionAnimation, 0.02)
                      )
                    : 1,
                },
              ],
            },
          ]}
        >
          <View
            style={[
              styles.apparatusContainer,
              isMobile && styles.apparatusMobile,
            ]}
          >
            <PhotonSource
              wavelength={frequencyToWavelength(frequency)}
              intensity={intensity}
              isActive={isLightOn}
            />
            <MetalSurface
              metalType={metalType}
              emittingElectrons={isEmittingElectrons}
              intensity={intensity}
            />
            <ElectronCollector voltage={stoppingVoltage} current={current} />
          </View>
        </Animated.View>

        {/* Kontrol Paneli ve Sonuçlar */}
        <View style={styles.controlsAndResults}>
          <ControlPanel
            frequency={frequency}
            setFrequency={setFrequency}
            intensity={intensity}
            setIntensity={setIntensity}
            metalType={metalType}
            setMetalType={setMetalType}
            stoppingVoltage={stoppingVoltage}
            setStoppingVoltage={setStoppingVoltage}
            temperature={temperature}
            setTemperature={setTemperature}
            isLightOn={isLightOn}
            setIsLightOn={setIsLightOn}
          />

          {/* Deney Sonuçları */}
          <View style={styles.resultsContainer}>
            <Text style={styles.resultsTitle}>
              {t('Deney Sonuçları', 'Experiment Results')}
            </Text>
            <View style={styles.resultsRow}>
              <Text style={styles.resultsLabel}>
                {t('Dalga Boyu:', 'Wavelength:')}
              </Text>
              <Text style={styles.resultsValue}>
                {frequencyToWavelength(frequency).toFixed(0)} nm
              </Text>
            </View>
            <View style={styles.resultsRow}>
              <Text style={styles.resultsLabel}>
                {t('Frekans:', 'Frequency:')}
              </Text>
              <Text style={styles.resultsValue}>
                {(frequency / 1e12).toFixed(2)} THz
              </Text>
            </View>
            <View style={styles.resultsRow}>
              <Text style={styles.resultsLabel}>
                {t('Eşik Frekansı:', 'Threshold Frequency:')}
              </Text>
              <Animated.View
                style={[
                  styles.resultIndicator,
                  frequency >= thresholdFrequency
                    ? styles.resultIndicatorSuccess
                    : styles.resultIndicatorWarning,
                  { opacity: emissionAnimation },
                ]}
              />
              <Text style={styles.resultsValue}>
                {(thresholdFrequency / 1e12).toFixed(2)} THz
              </Text>
            </View>
            <View style={styles.resultsRow}>
              <Text style={styles.resultsLabel}>
                {t('Kinetik Enerji:', 'Kinetic Energy:')}
              </Text>
              <Animated.View
                style={[
                  styles.resultIndicator,
                  kineticEnergy > 0
                    ? styles.resultIndicatorSuccess
                    : styles.resultIndicatorWarning,
                  { opacity: emissionAnimation },
                ]}
              />
              <Text
                style={[
                  styles.resultsValue,
                  kineticEnergy > 0 ? styles.resultPositive : null,
                ]}
              >
                {kineticEnergy.toFixed(2)} eV
              </Text>
            </View>
            <View style={styles.resultsRow}>
              <Text style={styles.resultsLabel}>{t('Akım:', 'Current:')}</Text>
              <Animated.View
                style={[
                  styles.resultIndicator,
                  current > 0
                    ? styles.resultIndicatorSuccess
                    : styles.resultIndicatorWarning,
                  { opacity: collectAnimation },
                ]}
              />
              <Text
                style={[
                  styles.resultsValue,
                  current > 0 ? styles.resultPositive : null,
                ]}
              >
                {current.toFixed(2)} μA
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Teorik Bilgi */}
      <View style={styles.infoContainer}>
        <Text style={styles.infoTitle}>
          {t('Fotoelektrik Olay Hakkında', 'About Photoelectric Effect')}
        </Text>
        <Text style={styles.infoText}>
          {t(
            'Fotoelektrik olay, ışığın bir metal yüzeye çarpması sonucu elektronların koparılması olayıdır. Bu deney, ışığın dalga teorisiyle açıklanamayan özellikleri olduğunu göstermiş ve kuantum fiziğinin temellerinin atılmasına yardımcı olmuştur.',
            'The photoelectric effect is the emission of electrons when light strikes a metal surface. This experiment demonstrated properties of light that could not be explained by the wave theory and helped establish the foundations of quantum physics.'
          )}
        </Text>
        <Text style={styles.infoText}>
          {t(
            "Einstein'ın açıklamasına göre, ışık foton adı verilen enerji paketlerinden oluşur ve her fotonun enerjisi E = hf formülüyle hesaplanır (h: Planck sabiti, f: frekans). Bir foton, enerjisi metalin iş fonksiyonundan (Φ) büyükse elektron koparabilir: E = hf - Φ",
            "According to Einstein's explanation, light consists of energy packets called photons, and the energy of each photon is calculated by the formula E = hf (h: Planck's constant, f: frequency). A photon can eject an electron if its energy is greater than the metal's work function (Φ): E = hf - Φ"
          )}
        </Text>
      </View>

      <View style={styles.chartSection}>
        <Text style={styles.chartTitle}>{t('Grafikler', 'Charts')}</Text>
        <Text style={styles.chartDescription}>
          {t(
            'Fotoelektrik deneyi sonuçlarına göre oluşturulan grafikler burada gösterilecektir. Web versiyonda gerçek grafikler, mobilden farklı olarak, görsel grafikler yerine verilerle temsil edilmektedir.',
            'Charts generated from the photoelectric experiment results would be shown here. In the web version, actual charts are displayed, unlike mobile which is represented with data.'
          )}
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  experimentContainer: {
    flexDirection: 'column',
  },
  experimentSetup: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 300,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  apparatusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
  },
  apparatusMobile: {
    // Mobil cihazlarda bileşenlerin arasındaki mesafeyi ayarla
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },
  controlsAndResults: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  resultsContainer: {
    flex: 1,
    minWidth: 250,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  resultsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#2c3e50',
  },
  resultsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    position: 'relative',
  },
  resultIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    position: 'absolute',
    right: '30%',
  },
  resultIndicatorSuccess: {
    backgroundColor: '#2ecc71',
  },
  resultIndicatorWarning: {
    backgroundColor: '#e74c3c',
  },
  resultHighlightPositive: {
    backgroundColor: 'rgba(46, 204, 113, 0.2)',
  },
  resultHighlightNegative: {
    backgroundColor: 'rgba(231, 76, 60, 0.2)',
  },
  resultPositive: {
    color: '#2ecc71',
    fontWeight: 'bold',
  },
  resultsLabel: {
    fontSize: 14,
    color: '#34495e',
  },
  resultsValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#2c3e50',
  },
  infoContainer: {
    marginTop: 24,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 16,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#2c3e50',
  },
  infoText: {
    fontSize: 14,
    lineHeight: 22,
    color: '#34495e',
    marginBottom: 12,
  },
  chartSection: {
    marginTop: 24,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 16,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#2c3e50',
  },
  chartDescription: {
    fontSize: 14,
    lineHeight: 22,
    color: '#34495e',
    marginBottom: 12,
    fontStyle: 'italic',
  },
});

export default PhotoelectricSimulator;
