import React, { useState, useEffect, useRef } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  ScrollView,
  StyleSheet,
  Dimensions,
  Platform,
  Alert,
} from 'react-native';
import ExperimentLayout from '../../../components/ExperimentLayout';
import SimulationCanvas from './components/momentum-bullet/SimulationCanvas';
import ControlPanel from './components/momentum-bullet/ControlPanel';
import ProjectileSettings from './components/momentum-bullet/ProjectileSettings';
import { useSimulation } from './utils/momentum-bullet/useSimulation';
import { useLanguage } from '../../../components/LanguageContext';

const MomentumBulletExperiment = () => {
  const { t } = useLanguage();
  const isWeb = Platform.OS === 'web';
  const screenWidth = Dimensions.get('window').width;
  const screenHeight = Dimensions.get('window').height;

  // Canvas boyutlarını belirle (platform bazlı)
  const canvasWidth = isWeb
    ? Math.min(screenWidth - 40, 800)
    : screenWidth - 40;
  const canvasHeight = isWeb ? 500 : Math.min(screenHeight * 0.4, 400);

  // Simülasyon hook'unu kullan
  const simulation = useSimulation({
    width: canvasWidth,
    height: canvasHeight,
    timeScale: 1.0,
    wallElasticity: 0.8,
  });

  return (
    <ExperimentLayout
      title="Mermi-Kutu Çarpışma Deneyi"
      titleEn="Bullet-Box Collision Experiment"
      description="Merminin hedefe çarpması ve momentum aktarımını gözlemleyin."
      descriptionEn="Observe bullet collision with a target and momentum transfer."
      difficulty="Orta Seviye"
      difficultyEn="Intermediate"
      isRunning={simulation.isRunning}
      onToggleSimulation={() =>
        simulation.isRunning
          ? simulation.pauseSimulation()
          : simulation.startSimulation()
      }
      onReset={simulation.resetSimulation}
    >
      <ScrollView style={styles.container}>
        <View style={styles.canvasContainer}>
          <SimulationCanvas
            width={canvasWidth}
            height={canvasHeight}
            projectiles={simulation.projectiles}
            targetBox={simulation.targetBox}
            isRunning={simulation.isRunning}
            collisionData={simulation.collisionData}
          />
        </View>

        <View style={styles.controlsContainer}>
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>
              {t('Simülasyon Kontrolü', 'Simulation Controls')}
            </Text>
            <ControlPanel
              isRunning={simulation.isRunning}
              timeScale={simulation.timeScale}
              wallElasticity={simulation.wallElasticity}
              projectilesCount={simulation.projectiles.length}
              onTimeScaleChange={simulation.setTimeScale}
              onWallElasticityChange={simulation.setWallElasticity}
              onStart={simulation.startSimulation}
              onPause={simulation.pauseSimulation}
              onReset={simulation.resetSimulation}
              onClear={simulation.clearProjectiles}
            />
          </View>

          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>
              {t('Deney Ayarları', 'Experiment Settings')}
            </Text>
            <ProjectileSettings
              canvasWidth={canvasWidth}
              canvasHeight={canvasHeight}
              onAddProjectile={simulation.addProjectile}
              onUpdateTargetBox={simulation.updateTargetBox}
              targetBox={simulation.targetBox}
              disabled={simulation.isRunning}
            />
          </View>

          <View style={styles.infoContainer}>
            <Text style={styles.infoTitle}>
              {t('Deney Bilgileri', 'Experiment Information')}
            </Text>
            <Text style={styles.infoText}>
              {t(
                'Bu deneyde merminin hedefe çarpması ve penetrasyon özellikleri gözlemlenmektedir. Mermi kütlesi ve hızı arttıkça delme olasılığı artar. Kutu sertliği ve kalınlığı arttıkça delme olasılığı azalır. Farklı parametrelerle denemeler yaparak sonuçları gözlemleyin.',
                'In this experiment, the collision and penetration properties of the bullet hitting the target are observed. As the bullet mass and velocity increase, the probability of penetration increases. As the box hardness and thickness increase, the probability of penetration decreases. Try different parameters and observe the results.'
              )}
            </Text>
          </View>
        </View>
      </ScrollView>
    </ExperimentLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  canvasContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 16,
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  controlsContainer: {
    padding: 16,
  },
  sectionContainer: {
    marginBottom: 24,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  infoContainer: {
    marginBottom: 24,
    backgroundColor: '#EBF5FF', // Açık mavi arka plan
    padding: 16,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#3B82F6', // Mavi vurgu çizgisi
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#1E40AF', // Koyu mavi başlık
  },
  infoText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#3B4252', // Koyu gri metin
  },
});

export default MomentumBulletExperiment;
