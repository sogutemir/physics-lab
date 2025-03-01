import { useState, useRef } from 'react';
import { View, Dimensions, StyleSheet, ScrollView } from 'react-native';
import ExperimentLayout from '../../../components/ExperimentLayout';
import { MobileFreeFall } from './components/free-fall/MobileFreeFall';

const { width, height } = Dimensions.get('window');

// Ref için tip tanımı
type FreeFallRefType = {
  startSimulation: () => void;
  stopSimulation: () => void;
  resetSimulation: () => void;
};

export default function FreeFallExperiment() {
  const [isRunning, setIsRunning] = useState(false);
  const freeFallRef = useRef<FreeFallRefType>(null);

  const handleToggleSimulation = () => {
    if (isRunning) {
      // Deneyi durdur
      if (freeFallRef.current) {
        freeFallRef.current.stopSimulation();
      }
    } else {
      // Deneyi başlat
      if (freeFallRef.current) {
        freeFallRef.current.startSimulation();
      }
    }
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    // Deneyi sıfırla
    if (freeFallRef.current) {
      freeFallRef.current.resetSimulation();
    }
    setIsRunning(false);
  };

  return (
    <ExperimentLayout
      title="Sürtünmeli Serbest Düşme"
      titleEn="Free Fall with Friction"
      difficulty="Orta Seviye"
      difficultyEn="Intermediate"
      description="Bu deneyde, sürtünme kuvvetinin serbest düşme hareketi üzerindeki etkisini inceleyebilirsiniz. Başlangıç hızı, atış açısı ve sürtünme katsayısını değiştirerek hareketin nasıl etkilendiğini gözlemleyin."
      descriptionEn="In this experiment, you can examine the effect of friction force on free fall motion. Observe how the motion is affected by changing the initial velocity, launch angle, and friction coefficient."
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
          <MobileFreeFall 
            ref={freeFallRef}
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
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 10,
    borderWidth: 1,
    borderColor: '#dfe6e9',
  }
}); 