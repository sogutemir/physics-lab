import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import ExperimentLayout from '../../../components/ExperimentLayout';
import CircuitSimulation from './components/CircuitSimulation';
import { useLanguage } from '../../../components/LanguageContext';

export default function OhmLawExperiment() {
  const { t } = useLanguage();

  return (
    <ExperimentLayout
      title="Ohm Yasası Deneyi"
      titleEn="Ohm's Law Experiment"
      description="Elektrik devrelerinde akım, gerilim ve direnç arasındaki ilişkiyi keşfedin."
      descriptionEn="Explore the relationship between current, voltage, and resistance in electrical circuits."
      difficulty="Başlangıç"
      difficultyEn="Beginner"
      hideControls={true}
      hideDescription={true}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
      >
        <View style={styles.headerContainer}>
          <Text style={styles.title}>
            {t('Ohm Yasası Simülasyonu', "Ohm's Law Simulation")}
          </Text>
          <Text style={styles.subtitle}>
            {t('Etkileşimli fizik deneyi', 'Interactive physics experiment')}
          </Text>
        </View>

        <CircuitSimulation />
      </ScrollView>
    </ExperimentLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 40,
    paddingTop: 20,
  },
  headerContainer: {
    paddingHorizontal: 16,
    paddingVertical: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#3498db',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    marginTop: 8,
  },
});
