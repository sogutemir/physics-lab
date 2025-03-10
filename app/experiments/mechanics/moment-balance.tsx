import { useState, useRef } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Platform,
  Dimensions,
} from 'react-native';
import ExperimentLayout from '../../../components/ExperimentLayout';
import { MobileMomentBalance } from './components/moment-balance/MobileMomentBalance';
import { WebMomentBalance } from './components/moment-balance/WebMomentBalance';

// Ref için tip tanımı
type MomentBalanceRefType = {
  startSimulation: () => void;
  stopSimulation: () => void;
  resetSimulation: () => void;
};

export default function MomentBalanceExperiment() {
  const [isRunning, setIsRunning] = useState(false);
  const momentBalanceRef = useRef<MomentBalanceRefType>(null);

  const handleToggleSimulation = () => {
    if (isRunning) {
      // Deneyi durdur
      if (momentBalanceRef.current) {
        momentBalanceRef.current.stopSimulation();
      }
    } else {
      // Deneyi başlat
      if (momentBalanceRef.current) {
        momentBalanceRef.current.startSimulation();
      }
    }
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    // Deneyi sıfırla
    if (momentBalanceRef.current) {
      momentBalanceRef.current.resetSimulation();
    }
    setIsRunning(false);
  };

  return (
    <ExperimentLayout
      title="Moment Dengesi"
      titleEn="Torque Balance"
      difficulty="Orta Seviye"
      difficultyEn="Intermediate"
      description="Bu deneyde, bir çubuk üzerindeki ağırlıkların oluşturduğu momentleri ve denge koşullarını inceleyebilirsiniz. Ağırlıkları ve konumlarını değiştirerek sistemin nasıl dengelendiğini gözlemleyin."
      descriptionEn="In this experiment, you can examine the torques created by weights on a beam and the conditions for equilibrium. Observe how the system balances by changing the weights and their positions."
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
          {Platform.OS === 'web' ? (
            <WebMomentBalance
              ref={momentBalanceRef}
              width={Math.min(Dimensions.get('window').width - 40, 800)}
              height={400}
            />
          ) : (
            <MobileMomentBalance
              ref={momentBalanceRef}
              width={Dimensions.get('window').width - 30}
              height={300}
            />
          )}
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
    paddingBottom: Platform.OS === 'web' ? 20 : 200, // Mobilde alt boşluğu artırdım
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
