import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import ExperimentLayout from '../../../components/ExperimentLayout';
import DoubleSlitControlPanel from './components/double-slit/DoubleSlitControlPanel';
import DoubleSlitSimulation from './components/double-slit/DoubleSlitSimulation';
import DoubleSlitInfoPanel from './components/double-slit/DoubleSlitInfoPanel';

const DoubleSlit: React.FC = () => {
  // Deney parametreleri - Çift yarıklı deney için optimize edilmiş değerler
  const [wavelength, setWavelength] = useState(550); // nm - yeşil ışık
  const [slitWidth, setSlitWidth] = useState(0.15); // mm - yarık genişliği
  const [slitSeparation, setSlitSeparation] = useState(2.0); // mm - yarıklar arası mesafe
  const [sourceDistance, setSourceDistance] = useState(200); // mm - ışık kaynağı mesafesi
  const [screenDistance, setScreenDistance] = useState(400); // mm - ekran mesafesi
  const [isRunning, setIsRunning] = useState(true);

  return (
    <ExperimentLayout
      title="Çift Yarık Deneyi"
      titleEn="Double-Slit Experiment"
      difficulty="Orta Seviye"
      difficultyEn="Intermediate"
      description="Bu interaktif deneyde ışığın dalga doğasını gözlemleyin. Işığın iki yarıktan geçişi sırasında oluşan girişim desenleri, dalga özelliklerini açıkça gösterir."
      descriptionEn="Observe the wave nature of light in this interactive experiment. The interference patterns formed when light passes through two slits clearly demonstrate its wave properties."
      hideControls={true}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <View style={styles.content}>
          {/* Simülasyon */}
          <DoubleSlitSimulation
            wavelength={wavelength}
            slitWidth={slitWidth}
            slitSeparation={slitSeparation}
            sourceDistance={sourceDistance}
            screenDistance={screenDistance}
            isRunning={isRunning}
          />

          {/* Kontrol Paneli */}
          <View style={styles.sectionSpacing}>
            <DoubleSlitControlPanel
              wavelength={wavelength}
              setWavelength={setWavelength}
              slitWidth={slitWidth}
              setSlitWidth={setSlitWidth}
              slitSeparation={slitSeparation}
              setSlitSeparation={setSlitSeparation}
              sourceDistance={sourceDistance}
              setSourceDistance={setSourceDistance}
              screenDistance={screenDistance}
              setScreenDistance={setScreenDistance}
              isRunning={isRunning}
              setIsRunning={setIsRunning}
            />
          </View>

          {/* Bilgi Paneli */}
          <View style={styles.sectionSpacing}>
            <DoubleSlitInfoPanel />
          </View>
        </View>
      </ScrollView>
    </ExperimentLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  content: {
    padding: 16,
  },
  sectionSpacing: {
    marginTop: 16,
  },
});

export default DoubleSlit;
