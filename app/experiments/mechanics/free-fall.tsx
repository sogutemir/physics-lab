import { useState, useRef } from 'react';
import { View, Dimensions, StyleSheet } from 'react-native';
import ExperimentLayout from '../../../components/ExperimentLayout';
import { WebFreeFall } from './components/free-fall/WebFreeFall';
import { MobileFreeFall } from './components/free-fall/MobileFreeFall';

const { width, height } = Dimensions.get('window');
const isMobile = width < 768;

// Ref için tip tanımı
type FreeFallRefType = {
  startSimulation: () => void;
  stopSimulation: () => void;
  resetSimulation: () => void;
};

export default function FreeFallExperiment() {
  const [isRunning, setIsRunning] = useState(false);
  const webFreeFallRef = useRef<FreeFallRefType>(null);
  const mobileFreeFallRef = useRef<FreeFallRefType>(null);

  const handleToggleSimulation = () => {
    if (isRunning) {
      // Deneyi durdur
      if (isMobile && mobileFreeFallRef.current) {
        mobileFreeFallRef.current.stopSimulation();
      } else if (!isMobile && webFreeFallRef.current) {
        webFreeFallRef.current.stopSimulation();
      }
    } else {
      // Deneyi başlat
      if (isMobile && mobileFreeFallRef.current) {
        mobileFreeFallRef.current.startSimulation();
      } else if (!isMobile && webFreeFallRef.current) {
        webFreeFallRef.current.startSimulation();
      }
    }
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    // Deneyi sıfırla
    if (isMobile && mobileFreeFallRef.current) {
      mobileFreeFallRef.current.resetSimulation();
    } else if (!isMobile && webFreeFallRef.current) {
      webFreeFallRef.current.resetSimulation();
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
      <View style={styles.container}>
        {isMobile ? (
          <MobileFreeFall 
            ref={mobileFreeFallRef}
            width={width}
            height={height * 0.65}
          />
        ) : (
          <WebFreeFall 
            ref={webFreeFallRef}
            width={width}
            height={height * 0.75}
          />
        )}
      </View>
    </ExperimentLayout>
  );
}

const styles = StyleSheet.create({
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