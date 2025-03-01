import { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, Animated, PanResponder, Text, Dimensions } from 'react-native';
import ExperimentLayout from '../../../components/ExperimentLayout';

const { width } = Dimensions.get('window');
const SPRING_REST_HEIGHT = 100;
const MAX_STRETCH = 150;
const SPRING_CONSTANT = 0.5;
const MASS = 1.0;
const DAMPING = 0.98;

export default function SpringMassExperiment() {
  const [isRunning, setIsRunning] = useState(false);
  const [displacement, setDisplacement] = useState(0);
  const [velocity, setVelocity] = useState(0);
  const [period, setPeriod] = useState(0);
  
  const springPosition = useRef(new Animated.Value(SPRING_REST_HEIGHT)).current;
  const animationRef = useRef<number | null>(null);
  const lastUpdateTime = useRef(Date.now());
  const startTime = useRef<number | null>(null);
  const oscillationCount = useRef(0);
  const lastDirection = useRef<'up' | 'down' | null>(null);

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderGrant: () => {
      if (isRunning) {
        setIsRunning(false);
        if (animationRef.current !== null) {
          cancelAnimationFrame(animationRef.current);
          animationRef.current = null;
        }
      }
    },
    onPanResponderMove: (_, gestureState) => {
      const newPosition = SPRING_REST_HEIGHT + gestureState.dy;
      // Limit the stretch
      const clampedPosition = Math.min(Math.max(newPosition, SPRING_REST_HEIGHT - MAX_STRETCH), SPRING_REST_HEIGHT + MAX_STRETCH);
      
      springPosition.setValue(clampedPosition);
      setDisplacement(clampedPosition - SPRING_REST_HEIGHT);
    },
    onPanResponderRelease: () => {
      // Reset oscillation tracking when manually positioned
      startTime.current = null;
      oscillationCount.current = 0;
      lastDirection.current = null;
    },
  });

  const toggleSimulation = () => {
    setIsRunning(!isRunning);
  };

  const resetSimulation = () => {
    setIsRunning(false);
    setDisplacement(0);
    setVelocity(0);
    springPosition.setValue(SPRING_REST_HEIGHT);
    setPeriod(0);
    startTime.current = null;
    oscillationCount.current = 0;
    lastDirection.current = null;
    
    if (animationRef.current !== null) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
  };

  const updateSpring = () => {
    if (!isRunning) return;

    const now = Date.now();
    const deltaTime = (now - lastUpdateTime.current) / 1000; // Convert to seconds
    lastUpdateTime.current = now;

    // Calculate force using Hooke's Law: F = -kx
    const force = -SPRING_CONSTANT * displacement;
    
    // Calculate acceleration: a = F/m
    const acceleration = force / MASS;
    
    // Update velocity and position
    const newVelocity = (velocity + acceleration * deltaTime) * DAMPING;
    const newDisplacement = displacement + newVelocity * deltaTime;
    
    setVelocity(newVelocity);
    setDisplacement(newDisplacement);
    
    // Update spring position
    springPosition.setValue(SPRING_REST_HEIGHT + newDisplacement);

    // Track oscillations for period calculation
    if (startTime.current === null) {
      startTime.current = now;
    }

    // Detect direction changes to count oscillations
    const currentDirection = newVelocity > 0 ? 'down' : 'up';
    if (lastDirection.current !== null && currentDirection !== lastDirection.current && Math.abs(newDisplacement) < 5) {
      oscillationCount.current += 0.5; // Half oscillation when direction changes near equilibrium
      
      if (oscillationCount.current >= 1) {
        const elapsedTime = (now - startTime.current) / 1000; // seconds
        const calculatedPeriod = elapsedTime / oscillationCount.current;
        setPeriod(calculatedPeriod);
      }
    }
    lastDirection.current = currentDirection;

    animationRef.current = requestAnimationFrame(updateSpring);
  };

  useEffect(() => {
    if (isRunning) {
      lastUpdateTime.current = Date.now();
      animationRef.current = requestAnimationFrame(updateSpring);
    } else if (animationRef.current !== null) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }

    return () => {
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isRunning]);

  // Calculate theoretical period
  useEffect(() => {
    // T = 2π√(m/k)
    const theoreticalPeriod = 2 * Math.PI * Math.sqrt(MASS / SPRING_CONSTANT);
    if (period === 0) {
      setPeriod(theoreticalPeriod);
    }
  }, []);

  return (
    <ExperimentLayout
      title="Yay-Kütle Sistemi"
      titleEn="Spring-Mass System"
      difficulty="Başlangıç"
      difficultyEn="Beginner"
      description="Yay-kütle sistemi, bir yaya bağlı bir kütleden oluşan fiziksel bir sistemdir. Hooke Yasası'na göre, yayın uyguladığı kuvvet, yayın uzama veya sıkışma miktarıyla doğru orantılıdır (F = -kx). Bu deneyde, yay-kütle sisteminin harmonik hareketini ve periyodunu gözlemleyebilirsiniz. Kütleyi hareket ettirmek için ekrana dokunun ve sürükleyin."
      descriptionEn="A spring-mass system is a physical system consisting of a mass attached to a spring. According to Hooke's Law, the force exerted by the spring is directly proportional to the amount of extension or compression of the spring (F = -kx). In this experiment, you can observe the harmonic motion and period of the spring-mass system. Touch and drag the screen to move the mass."
      isRunning={isRunning}
      onToggleSimulation={toggleSimulation}
      onReset={resetSimulation}
    >
      <View style={styles.experimentArea}>
        <View style={styles.springContainer}>
          <View style={styles.ceiling} />
          
          <View style={styles.springWrapper}>
            <Animated.View
              style={[
                styles.spring,
                {
                  height: springPosition,
                },
              ]}
            >
              {/* Spring coils visualization */}
              {Array.from({ length: 10 }).map((_, index) => (
                <View 
                  key={index} 
                  style={[
                    styles.springCoil,
                    { top: (index + 1) * 10 }
                  ]} 
                />
              ))}
            </Animated.View>
          </View>
          
          <Animated.View
            style={[
              styles.mass,
              {
                transform: [
                  { translateY: Animated.subtract(springPosition, SPRING_REST_HEIGHT) },
                ],
              },
            ]}
            {...panResponder.panHandlers}
          />
        </View>

        <View style={styles.measurementsContainer}>
          <View style={styles.measurementItem}>
            <Text style={styles.measurementLabel}>Uzama / Displacement:</Text>
            <Text style={styles.measurementValue}>{displacement.toFixed(1)} cm</Text>
          </View>
          <View style={styles.measurementItem}>
            <Text style={styles.measurementLabel}>Hız / Velocity:</Text>
            <Text style={styles.measurementValue}>{velocity.toFixed(2)} cm/s</Text>
          </View>
          <View style={styles.measurementItem}>
            <Text style={styles.measurementLabel}>Periyot / Period:</Text>
            <Text style={styles.measurementValue}>{period.toFixed(2)} s</Text>
          </View>
        </View>
      </View>
    </ExperimentLayout>
  );
}

const styles = StyleSheet.create({
  experimentArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  springContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: '100%',
  },
  ceiling: {
    width: '100%',
    height: 20,
    backgroundColor: '#95a5a6',
    position: 'absolute',
    top: 0,
  },
  springWrapper: {
    alignItems: 'center',
    position: 'absolute',
    top: 20,
    left: 0,
    right: 0,
  },
  spring: {
    width: 20,
    backgroundColor: 'transparent',
    position: 'relative',
  },
  springCoil: {
    position: 'absolute',
    width: 20,
    height: 4,
    backgroundColor: '#7f8c8d',
    borderRadius: 2,
  },
  mass: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#3498db',
    position: 'absolute',
    top: SPRING_REST_HEIGHT,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  measurementsContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 10,
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  measurementItem: {
    alignItems: 'center',
  },
  measurementLabel: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 5,
  },
  measurementValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
});