import { useState, useRef } from 'react';
import { View, Dimensions, StyleSheet, ScrollView } from 'react-native';
import ExperimentLayout from '../../../components/ExperimentLayout';
import { TransverseWave } from './components/transverse-wave';

const { width, height } = Dimensions.get('window');

// Ref için tip tanımı
type TransverseWaveRefType = {
  startSimulation: () => void;
  stopSimulation: () => void;
  resetSimulation: () => void;
};

export default function TransverseWaveExperiment() {
  const [isRunning, setIsRunning] = useState(false);
  const transverseWaveRef = useRef<TransverseWaveRefType>(null);

  const handleToggleSimulation = () => {
    if (isRunning) {
      // Deneyi durdur
      if (transverseWaveRef.current) {
        transverseWaveRef.current.stopSimulation();
      }
    } else {
      // Deneyi başlat
      if (transverseWaveRef.current) {
        transverseWaveRef.current.startSimulation();
      }
    }
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    // Deneyi sıfırla
    if (transverseWaveRef.current) {
      transverseWaveRef.current.resetSimulation();
    }
    setIsRunning(false);
  };

  return (
    <ExperimentLayout
      title="Enine Dalga"
      titleEn="Transverse Wave"
      difficulty="Orta Seviye"
      difficultyEn="Intermediate"
      description="Bu deneyde, enine dalga hareketini inceleyebilirsiniz. Dalga genliği, dalga boyu ve dalga hızı gibi parametreleri değiştirerek dalga hareketinin nasıl etkilendiğini gözlemleyin."
      descriptionEn="In this experiment, you can examine the transverse wave motion. Observe how the wave motion is affected by changing parameters such as wave amplitude, wavelength, and wave speed."
      isRunning={isRunning}
      onToggleSimulation={handleToggleSimulation}
      onReset={handleReset}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.container}>
          <TransverseWave
            ref={transverseWaveRef}
            width={width}
            height={height * 0.5}
          />
        </View>
      </ScrollView>
    </ExperimentLayout>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingBottom: 200, // Mobilde alt boşluğu artırdım
  },
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    overflow: 'hidden',
    margin: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 10,
    borderWidth: 1,
    borderColor: '#dfe6e9',
  },
});
