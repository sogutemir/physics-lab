import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, Dimensions, Text, ScrollView } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  Easing,
  withSpring,
  withRepeat,
  cancelAnimation,
  runOnJS,
} from 'react-native-reanimated';
import { useLanguage } from '../../../components/LanguageContext';
import ExperimentLayout from '../../../components/ExperimentLayout';
import ControlPanel from './components/ControlPanel';
import DataDisplay from './components/DataDisplay';
import FormulaDisplay from './components/FormulaDisplay';
import Toast from 'react-native-toast-message';

const AccelerationExperiment: React.FC = () => {
  const [acceleration, setAcceleration] = useState(2);
  const [initialVelocity, setInitialVelocity] = useState(0);
  const [time, setTime] = useState(5);
  const [isRunning, setIsRunning] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [currentVelocity, setCurrentVelocity] = useState(0);
  const [currentPosition, setCurrentPosition] = useState(0);
  const [showGraph, setShowGraph] = useState(false);
  const [lapCount, setLapCount] = useState(0);
  const [totalDistance, setTotalDistance] = useState(0);
  const [lastLapTime, setLastLapTime] = useState(0);

  const { t } = useLanguage();
  const { width: screenWidth } = Dimensions.get('window');
  const CANVAS_HEIGHT = 200;
  const SCALE_FACTOR = 30;
  const TRACK_LENGTH = 100; // 100 metre

  // Animasyon değerleri
  const animatedPosition = useSharedValue(0);
  const startTime = useSharedValue(0);
  const lastFrameTime = useSharedValue(0);

  const calculatePosition = useCallback(
    (t: number) => {
      return initialVelocity * t + 0.5 * acceleration * t * t;
    },
    [initialVelocity, acceleration]
  );

  const calculateVelocity = useCallback(
    (t: number) => {
      return initialVelocity + acceleration * t;
    },
    [initialVelocity, acceleration]
  );

  const showLapNotification = useCallback(
    (lapNumber: number, lapTime: number) => {
      Toast.show({
        type: 'success',
        text1: t('Tur Tamamlandı!', 'Lap Completed!'),
        text2: t(
          `${lapNumber}. tur ${lapTime.toFixed(2)} saniyede tamamlandı.`,
          `Lap ${lapNumber} completed in ${lapTime.toFixed(2)} seconds.`
        ),
        position: 'bottom',
        visibilityTime: 2000,
      });
    },
    [t]
  );

  const frameCallback = useCallback(() => {
    const now = Date.now();
    if (startTime.value === 0) {
      startTime.value = now;
      lastFrameTime.value = now;
      return;
    }

    const elapsedTime = (now - startTime.value) / 1000;
    const deltaTime = Math.min((now - lastFrameTime.value) / 1000, 0.1); // Limit delta time
    lastFrameTime.value = now;

    if (elapsedTime <= time) {
      const newPosition = calculatePosition(elapsedTime);
      const newVelocity = calculateVelocity(elapsedTime);

      // Pozisyonu normalize et (0-100m arası)
      const normalizedPosition =
        ((newPosition % TRACK_LENGTH) + TRACK_LENGTH) % TRACK_LENGTH;

      // Animasyon pozisyonunu güncelle (ekran genişliğine göre ölçeklendir)
      const screenPosition =
        (normalizedPosition / TRACK_LENGTH) * (screenWidth - 60);

      // Daha akıcı animasyon için config
      animatedPosition.value = withTiming(screenPosition, {
        duration: 16, // 60 FPS'e yakın
        easing: Easing.linear,
      });

      // Tur sayısını ve zamanını güncelle
      const currentLap = Math.floor(Math.abs(newPosition) / TRACK_LENGTH);
      if (currentLap > lapCount) {
        const lapTime = elapsedTime - lastLapTime;
        setLastLapTime(elapsedTime);
        setLapCount(currentLap);
        showLapNotification(currentLap, lapTime);
      }

      setCurrentTime(elapsedTime);
      setCurrentVelocity(newVelocity);
      setCurrentPosition(newPosition);
      setTotalDistance(Math.abs(newPosition));
    } else {
      setIsRunning(false);
    }
  }, [
    time,
    calculatePosition,
    calculateVelocity,
    TRACK_LENGTH,
    lapCount,
    lastLapTime,
    showLapNotification,
  ]);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (isRunning) {
      intervalId = setInterval(frameCallback, 16); // 60 FPS'e yakın
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isRunning, frameCallback]);

  const toggleSimulation = () => {
    if (isRunning) {
      setIsRunning(false);
    } else {
      startTime.value = 0;
      lastFrameTime.value = 0;
      setCurrentTime(0);
      setCurrentVelocity(initialVelocity);
      setCurrentPosition(0);
      setLapCount(0);
      setTotalDistance(0);
      setLastLapTime(0);
      animatedPosition.value = 0;
      setIsRunning(true);
    }
  };

  const resetSimulation = () => {
    setIsRunning(false);
    startTime.value = 0;
    lastFrameTime.value = 0;
    setCurrentTime(0);
    setCurrentVelocity(initialVelocity);
    setCurrentPosition(0);
    setLapCount(0);
    setTotalDistance(0);
    setLastLapTime(0);
    animatedPosition.value = 0;
  };

  const objectStyle = useAnimatedStyle(
    () => ({
      transform: [{ translateX: animatedPosition.value }],
    }),
    []
  );

  return (
    <ExperimentLayout
      title="İvmeli Hareket"
      titleEn="Acceleration Motion"
      difficulty="Başlangıç"
      difficultyEn="Beginner"
      description="İvmeli hareketi interaktif olarak keşfedin. Hız, ivme ve konum değişimlerini gözlemleyin."
      descriptionEn="Interactively explore accelerated motion. Observe changes in velocity, acceleration, and position."
      hideControls={true}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <View style={styles.header}>
          <Text style={styles.title}>
            {t('İvmeli Hareket Deneyi', 'Acceleration Experiment')}
          </Text>
          <Text style={styles.subtitle}>
            {t(
              'Bu interaktif simülasyon ile sabit ivmeli hareketi inceleyebilir, parametreleri değiştirerek sonuçları gözlemleyebilirsiniz.',
              'With this interactive simulation, you can study uniform accelerated motion and observe results by changing parameters.'
            )}
          </Text>
        </View>

        <View style={styles.simulationContainer}>
          <View style={styles.canvasContainer}>
            {/* Zemin çizgisi */}
            <View style={[styles.groundLine, { top: CANVAS_HEIGHT / 2 }]} />

            {/* Ölçek çizgileri */}
            <View style={styles.rulerContainer}>
              {[...Array(11)].map((_, i) => (
                <View key={i} style={styles.rulerMark}>
                  <View style={styles.rulerLine} />
                  <Text style={styles.rulerText}>{i * 10}</Text>
                </View>
              ))}
            </View>

            {/* Hareketli nesne */}
            <Animated.View
              style={[
                styles.object,
                { top: CANVAS_HEIGHT / 2 - 15 },
                objectStyle,
              ]}
            />

            {/* Tur sayacı */}
            <View style={styles.lapCounter}>
              <Text style={styles.lapCounterText}>
                {lapCount > 0
                  ? `${lapCount} ${t('tur', 'laps')} (${totalDistance.toFixed(
                      1
                    )}m)`
                  : t('Başlangıç noktası', 'Starting point')}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.controlsContainer}>
          <ControlPanel
            acceleration={acceleration}
            setAcceleration={setAcceleration}
            initialVelocity={initialVelocity}
            setInitialVelocity={setInitialVelocity}
            time={time}
            setTime={setTime}
            isRunning={isRunning}
            toggleSimulation={toggleSimulation}
            resetSimulation={resetSimulation}
          />

          <DataDisplay
            currentTime={currentTime}
            currentVelocity={currentVelocity}
            currentPosition={currentPosition}
          />

          <FormulaDisplay />
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
  header: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
  },
  simulationContainer: {
    marginHorizontal: 16,
    marginTop: 16,
  },
  canvasContainer: {
    height: 200,
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  groundLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: '#e5e7eb',
  },
  rulerContainer: {
    position: 'absolute',
    bottom: 16,
    left: 8,
    right: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rulerMark: {
    alignItems: 'center',
  },
  rulerLine: {
    width: 1,
    height: 8,
    backgroundColor: '#9ca3af',
  },
  rulerText: {
    fontSize: 10,
    color: '#6b7280',
    marginTop: 2,
  },
  object: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#3b82f6',
    left: 0,
  },
  lapCounter: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    borderRadius: 8,
    padding: 8,
  },
  lapCounterText: {
    fontSize: 12,
    color: '#3b82f6',
    fontWeight: '500',
  },
  controlsContainer: {
    padding: 16,
    gap: 16,
  },
});

export default AccelerationExperiment;
