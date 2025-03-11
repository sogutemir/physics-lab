import React from 'react';
import { StyleSheet } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import ExperimentLayout from '../../../components/ExperimentLayout';
import { useLanguage } from '../../../components/LanguageContext';
import RlcCircuit from './rc-circuit/components/RlcCircuit';

export default function RcCircuitExperiment() {
  const { t } = useLanguage();

  return (
    <ExperimentLayout
      title="RLC Devre Laboratuvarı"
      titleEn="RLC Circuit Laboratory"
      description="Bu deneyde direnç, indüktans ve kapasitans arasındaki ilişkiyi keşfedin. Farklı parametreleri değiştirerek devrenin davranışını gözlemleyin ve rezonans frekansını bulun."
      descriptionEn="In this experiment, explore the relationship between resistance, inductance, and capacitance. Observe the behavior of the circuit by changing different parameters and find the resonance frequency."
      difficulty="Orta Seviye"
      difficultyEn="Intermediate"
      hideControls={true}
    >
      <ScrollView style={styles.container}>
        <RlcCircuit />
      </ScrollView>
    </ExperimentLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
});
