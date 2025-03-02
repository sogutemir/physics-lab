import React, { useState, useEffect, useRef } from "react";
import { View, Text, StyleSheet, Platform } from "react-native";
import Slider from "@react-native-community/slider";
import Svg, { Line, Circle, Path, Rect } from "react-native-svg";
import ExperimentLayout from "../../../components/ExperimentLayout";

// Fiziksel sabitler
const CONSTANTS = {
  g: 9.81,                // Yerçekimi ivmesi (m/s²)
  BASE_SPRING_LENGTH: 100, // Yayın temel uzunluğu (piksel)
  TOP_MARGIN: 50,         // Üst kenar boşluğu
  MIN_MASS: 0.1,          // Minimum kütle (kg)
  MAX_MASS: 2.0,          // Maximum kütle (kg)
  MIN_SPRING_CONSTANT: 5,  // Minimum yay sabiti (N/m)
  MAX_SPRING_CONSTANT: 50, // Maximum yay sabiti (N/m)
  MIN_DAMPING: 0,         // Minimum sönümleme
  MAX_DAMPING: 1,         // Maximum sönümleme
  MIN_AMPLITUDE: 0.1,     // Minimum genlik (m)
  MAX_AMPLITUDE: 1.0,     // Maximum genlik (m)
  MIN_BASE_LENGTH: 0.25,  // Minimum temel uzunluk (m)
  MAX_BASE_LENGTH: 1.0,   // Maximum temel uzunluk (m)
};

interface SpringMassState {
  position: number;      // Denge konumundan sapma (metre)
  velocity: number;      // Hız (m/s)
  mass: number;         // Kütle (kg)
  springConstant: number; // Yay sabiti (N/m)
  damping: number;      // Sönümleme katsayısı
  amplitude: number;    // Genlik (metre)
  isRunning: boolean;   // Simülasyon çalışıyor mu?
  time: number;         // Geçen süre (s)
  kineticEnergy: number; // Kinetik enerji (J)
  potentialEnergy: number; // Potansiyel enerji (J)
  totalEnergy: number;  // Toplam enerji (J)
  baseLength: number;   // Yayın temel uzunluğu (m)
}

export default function SpringMassExperiment() {
  const [state, setState] = useState<SpringMassState>({
    position: 0,
    velocity: 0,
    mass: 1.0,
    springConstant: 20,
    damping: 0.1,
    amplitude: 0.5,
    isRunning: false,
    time: 0,
    kineticEnergy: 0,
    potentialEnergy: 0,
    totalEnergy: 0,
    baseLength: 0.50,
  });

  const animationFrameRef = useRef<number>();
  const lastTimeRef = useRef<number>(0);

  const updatePhysics = (timestamp: number) => {
    if (!lastTimeRef.current) {
      lastTimeRef.current = timestamp;
      animationFrameRef.current = requestAnimationFrame(updatePhysics);
      return;
    }

    const dt = Math.min((timestamp - lastTimeRef.current) / 1000, 0.016);
    lastTimeRef.current = timestamp;

    setState((prev) => {
      if (!prev.isRunning) return prev;

      // İvme hesabı (F = -kx - bv)
      const acceleration = (-prev.springConstant * prev.position - prev.damping * prev.velocity) / prev.mass;

      // Hız ve konum güncelleme (Euler metodu)
      const newVelocity = prev.velocity + acceleration * dt;
      const newPosition = prev.position + newVelocity * dt;
      const newTime = prev.time + dt;

      // Enerji hesaplamaları
      const kineticEnergy = 0.5 * prev.mass * Math.pow(newVelocity, 2);
      const potentialEnergy = 0.5 * prev.springConstant * Math.pow(newPosition, 2);
      const totalEnergy = kineticEnergy + potentialEnergy;

      // Hareket çok küçükse durdur
      const EPSILON = 0.001;
      if (Math.abs(newPosition) < EPSILON && Math.abs(newVelocity) < EPSILON) {
        return {
          ...prev,
          position: 0,
          velocity: 0,
          isRunning: false,
          kineticEnergy: 0,
          potentialEnergy: 0,
          totalEnergy: 0,
        };
      }

      return {
        ...prev,
        position: newPosition,
        velocity: newVelocity,
        time: newTime,
        kineticEnergy,
        potentialEnergy,
        totalEnergy,
      };
    });

    animationFrameRef.current = requestAnimationFrame(updatePhysics);
  };

  useEffect(() => {
    if (state.isRunning) {
      lastTimeRef.current = 0;
      animationFrameRef.current = requestAnimationFrame(updatePhysics);
    }
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [state.isRunning]);

  const handleToggleSimulation = () => {
    setState(prev => {
      if (!prev.isRunning) {
        return {
          ...prev,
          isRunning: true,
          position: prev.amplitude,
          velocity: 0,
          time: 0,
        };
      }
      return { ...prev, isRunning: false };
    });
  };

  const handleReset = () => {
    setState(prev => ({
      ...prev,
      position: 0,
      velocity: 0,
      time: 0,
      isRunning: false,
      kineticEnergy: 0,
      potentialEnergy: 0,
      totalEnergy: 0,
    }));
  };

  // Yay yolu hesaplama
  const renderSpringPath = () => {
    const springLength = CONSTANTS.BASE_SPRING_LENGTH + state.baseLength * 200 + state.position * 200;
    const numCoils = 15;
    const coilSpacing = springLength / numCoils;
    const coilWidth = 30;
    const startY = CONSTANTS.TOP_MARGIN;
    const endY = startY + springLength;

    let path = `M ${300 / 2} ${startY} `; // Başlangıç noktası
    path += `L ${300 / 2} ${startY + 10} `; // İlk düz çizgi

    // Yay sarmalları
    for (let i = 0; i < numCoils; i++) {
      const y = startY + 10 + i * coilSpacing;
      if (i % 2 === 0) {
        path += `Q ${300 / 2 - coilWidth} ${y + coilSpacing / 2} ${300 / 2} ${y + coilSpacing} `;
      } else {
        path += `Q ${300 / 2 + coilWidth} ${y + coilSpacing / 2} ${300 / 2} ${y + coilSpacing} `;
      }
    }

    path += `L ${300 / 2} ${endY}`; // Son düz çizgi
    return path;
  };

  // Deney açıklamaları
  const description = `
    Yay-Kütle sistemi, basit harmonik hareketin temel bir örneğidir. Bu deneyde, bir yaya bağlı kütlenin 
    salınım hareketini inceleyebilirsiniz. Sistemin davranışını etkileyen parametreler:
    
    - Kütle: Sistemin eylemsizliğini belirler
    - Yay sabiti: Yayın sertliğini belirler
    - Sönümleme: Sistemdeki enerji kaybını temsil eder
    - Genlik: İlk çekme mesafesini belirler
    
    Sistemin toplam enerjisi, kinetik ve potansiyel enerjinin toplamıdır. Sönümleme olmadığında 
    toplam enerji korunur.
  `;

  const descriptionEn = `
    The Spring-Mass system is a fundamental example of simple harmonic motion. In this experiment, 
    you can study the oscillatory motion of a mass attached to a spring. Parameters affecting the 
    system's behavior:
    
    - Mass: Determines the system's inertia
    - Spring constant: Determines the spring's stiffness
    - Damping: Represents energy loss in the system
    - Amplitude: Sets the initial displacement
    
    The total energy of the system is the sum of kinetic and potential energies. Without damping, 
    total energy is conserved.
  `;

  return (
    <ExperimentLayout
      title="Yay-Kütle Sistemi"
      titleEn="Spring-Mass System"
      difficulty="Başlangıç"
      difficultyEn="Beginner"
      description={description}
      descriptionEn={descriptionEn}
      isRunning={state.isRunning}
      onToggleSimulation={handleToggleSimulation}
      onReset={handleReset}
    >
      <View style={styles.container}>
        <View style={styles.simulation}>
          <Svg
            width="100%"
            height="100%"
            viewBox="0 0 300 400"
            preserveAspectRatio="xMidYMid meet"
          >
            {/* Sabit tavan */}
            <Rect
              x={300 / 2 - 50}
              y={CONSTANTS.TOP_MARGIN - 10}
              width={100}
              height={10}
              fill="#2c3e50"
              stroke="#fff"
              strokeWidth={1}
            />

            {/* Yay */}
            <Path
              d={renderSpringPath()}
              stroke="#3498db"
              strokeWidth={2.5}
              fill="none"
            />

            {/* Kütle */}
            <Circle
              cx={300 / 2}
              cy={CONSTANTS.TOP_MARGIN + CONSTANTS.BASE_SPRING_LENGTH + state.baseLength * 200 + state.position * 200}
              r={20 + state.mass * 10}
              fill="#e74c3c"
              stroke="#fff"
              strokeWidth={2}
            />
          </Svg>
        </View>

        <View style={styles.controls}>
          <View style={styles.sliders}>
            <View style={styles.sliderRow}>
              <Text style={styles.sliderLabel}>
                Yay Uzunluğu: {state.baseLength.toFixed(2)} m
              </Text>
              <Slider
                style={styles.slider}
                minimumValue={CONSTANTS.MIN_BASE_LENGTH}
                maximumValue={CONSTANTS.MAX_BASE_LENGTH}
                value={state.baseLength}
                onValueChange={(value) => setState(prev => ({ ...prev, baseLength: value }))}
                minimumTrackTintColor="#3498db"
                maximumTrackTintColor="#bdc3c7"
                thumbTintColor="#3498db"
              />
            </View>

            <View style={styles.sliderRow}>
              <Text style={styles.sliderLabel}>
                Kütle: {state.mass.toFixed(1)} kg
              </Text>
              <Slider
                style={styles.slider}
                minimumValue={CONSTANTS.MIN_MASS}
                maximumValue={CONSTANTS.MAX_MASS}
                value={state.mass}
                onValueChange={(value) => setState(prev => ({ ...prev, mass: value }))}
                minimumTrackTintColor="#3498db"
                maximumTrackTintColor="#bdc3c7"
                thumbTintColor="#3498db"
              />
            </View>

            <View style={styles.sliderRow}>
              <Text style={styles.sliderLabel}>
                Yay Sabiti: {state.springConstant.toFixed(1)} N/m
              </Text>
              <Slider
                style={styles.slider}
                minimumValue={CONSTANTS.MIN_SPRING_CONSTANT}
                maximumValue={CONSTANTS.MAX_SPRING_CONSTANT}
                value={state.springConstant}
                onValueChange={(value) => setState(prev => ({ ...prev, springConstant: value }))}
                minimumTrackTintColor="#3498db"
                maximumTrackTintColor="#bdc3c7"
                thumbTintColor="#3498db"
              />
            </View>

            <View style={styles.sliderRow}>
              <Text style={styles.sliderLabel}>
                Sönümleme: {state.damping.toFixed(2)}
              </Text>
              <Slider
                style={styles.slider}
                minimumValue={CONSTANTS.MIN_DAMPING}
                maximumValue={CONSTANTS.MAX_DAMPING}
                value={state.damping}
                onValueChange={(value) => setState(prev => ({ ...prev, damping: value }))}
                minimumTrackTintColor="#3498db"
                maximumTrackTintColor="#bdc3c7"
                thumbTintColor="#3498db"
              />
            </View>

            <View style={styles.sliderRow}>
              <Text style={styles.sliderLabel}>
                Genlik: {state.amplitude.toFixed(2)} m
              </Text>
              <Slider
                style={styles.slider}
                minimumValue={CONSTANTS.MIN_AMPLITUDE}
                maximumValue={CONSTANTS.MAX_AMPLITUDE}
                value={state.amplitude}
                onValueChange={(value) => setState(prev => ({ ...prev, amplitude: value }))}
                minimumTrackTintColor="#3498db"
                maximumTrackTintColor="#bdc3c7"
                thumbTintColor="#3498db"
              />
            </View>
          </View>

          <View style={styles.info}>
            <View style={styles.infoContainer}>
              <Text style={styles.infoItem}>Zaman: {state.time.toFixed(2)} s</Text>
              <Text style={styles.infoItem}>Konum: {state.position.toFixed(3)} m</Text>
              <Text style={styles.infoItem}>Hız: {state.velocity.toFixed(2)} m/s</Text>
              <Text style={styles.infoItem}>Kinetik Enerji: {state.kineticEnergy.toFixed(2)} J</Text>
              <Text style={styles.infoItem}>Potansiyel Enerji: {state.potentialEnergy.toFixed(2)} J</Text>
              <Text style={styles.infoItem}>Toplam Enerji: {state.totalEnergy.toFixed(2)} J</Text>
            </View>
          </View>
        </View>
      </View>
    </ExperimentLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  simulation: {
    aspectRatio: 0.75,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    backgroundColor: '#f5f5f5',
    width: '100%',
    marginBottom: 10,
  },
  controls: {
    flex: 1,
  },
  sliders: {
    marginBottom: 10,
  },
  sliderRow: {
    marginBottom: 10,
  },
  sliderLabel: {
    fontSize: 14,
    marginBottom: 2,
    color: '#2c3e50',
  },
  slider: {
    width: '100%',
    height: 30,
  },
  info: {
    backgroundColor: '#e3f2fd',
    borderRadius: 8,
    padding: 10,
    marginTop: 8,
  },
  infoContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  infoItem: {
    width: '48%',
    padding: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#bbdefb',
    fontSize: 12,
    color: '#2c3e50',
    marginBottom: 4,
  },
});