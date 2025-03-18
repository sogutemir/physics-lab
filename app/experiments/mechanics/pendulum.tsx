import React, { useState, useEffect } from "react";
import { SafeAreaView, View, Text, Dimensions, Platform, StyleSheet, ScrollView } from "react-native";
import Slider from "@react-native-community/slider";
import Svg, { Line, Circle } from "react-native-svg";
import ExperimentLayout from '../../../components/ExperimentLayout';

const { width, height } = Dimensions.get("window");
const G = 9.81; // Yerçekimi ivmesi (m/s²)

export default function PendulumExperiment() {
  const [state, setState] = useState({
    angle: Math.PI / 4, // Başlangıç açısı (45 derece)
    angularVelocity: 0,
    length: 2, // metre
    mass: 1, // kg
    damping: 0.1, // Sönümleme katsayısı
    isRunning: false,
    time: 0,
  });

  // Ekran boyutlarını alıyorum
  const screenWidth = width;
  const screenHeight = height;
  
  // Canvas boyutlarını ekran boyutuna göre ayarlıyorum
  const canvasWidth = Platform.OS === "web" ? Math.min(screenWidth - 40, 800) : screenWidth - 20;
  const canvasHeight = Platform.OS === "web" ? 1000 : Math.min(screenHeight * 0.35, 250); // Mobil için yüksekliği ayarlıyorum
  
  // Sarkaç pivot noktasını ve ölçeği ayarlıyorum
  const centerX = Platform.OS === "web" ? canvasWidth / 2 : screenWidth / 2 - 10;
  const centerY = Platform.OS === "web" ? 75 : 50; // Mobil için pivot noktasını ayarlıyorum
  const scale = Platform.OS === "web" ? 75 : 55; // Mobil için ölçeği küçültüyorum

  useEffect(() => {
    let animationFrame: number;

    const updatePhysics = () => {
      if (state.isRunning) {
        setState((prev) => {
          // Basit harmonik hareket denklemi (sönümleme ile)
          const angularAcceleration =
            -(G / prev.length) * Math.sin(prev.angle) -
            prev.damping * prev.angularVelocity;

          const dt = 0.016; // 60 FPS için zaman adımı
          const newAngularVelocity =
            prev.angularVelocity + angularAcceleration * dt;
          const newAngle = prev.angle + newAngularVelocity * dt;
          const newTime = prev.time + dt;

          return {
            ...prev,
            angle: newAngle,
            angularVelocity: newAngularVelocity,
            time: newTime,
          };
        });

        animationFrame = requestAnimationFrame(updatePhysics);
      }
    };

    animationFrame = requestAnimationFrame(updatePhysics);
    return () => cancelAnimationFrame(animationFrame);
  }, [state.isRunning]);

  const renderMetrics = () => (
    <View style={styles.metrics}>
      <View style={styles.metricRow}>
        <Text style={styles.metricLabel}>Zaman / Time:</Text>
        <Text style={styles.metricValue}>
          {state.time.toFixed(2)} s
        </Text>
      </View>
      <View style={styles.metricRow}>
        <Text style={styles.metricLabel}>Açı / Angle:</Text>
        <Text style={styles.metricValue}>
          {((state.angle * 180) / Math.PI).toFixed(1)}°
        </Text>
      </View>
      <View style={styles.metricRow}>
        <Text style={styles.metricLabel}>Hız / Velocity:</Text>
        <Text style={styles.metricValue}>
          {state.angularVelocity.toFixed(2)} rad/s
        </Text>
      </View>
    </View>
  );

  const bobX = centerX + Math.sin(state.angle) * (state.length * scale);
  const bobY = centerY + Math.cos(state.angle) * (state.length * scale);

  const toggleSimulation = () => {
    setState((prev) => ({ ...prev, isRunning: !prev.isRunning }));
  };

  const resetSimulation = () => {
    setState({
      angle: Math.PI / 4,
      angularVelocity: 0,
      length: 2,
      mass: 1,
      damping: 0.1,
      isRunning: false,
      time: 0,
    });
  };

  return (
    <ExperimentLayout
      title="Basit Sarkaç"
      titleEn="Simple Pendulum"
      difficulty="Başlangıç"
      difficultyEn="Beginner"
      description="Basit sarkaç hareketi ve periyot hesaplamaları. Sarkacın uzunluğunu, kütlesini ve sönümleme katsayısını değiştirerek hareketin nasıl değiştiğini gözlemleyebilirsiniz."
      descriptionEn="Simple pendulum motion and period calculations. You can observe how the motion changes by adjusting the pendulum's length, mass, and damping coefficient."
      isRunning={state.isRunning}
      onToggleSimulation={toggleSimulation}
      onReset={resetSimulation}
    >
      {Platform.OS === "web" ? (
        <View style={styles.experimentContainer}>
          <View style={styles.controlsAndSliders}>
            <View style={styles.sliderContainer}>
              {renderSliders()}
            </View>
          </View>
          <View style={styles.canvasContainer}>
            {renderCanvas()}
          </View>
        </View>
      ) : (
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollViewContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.experimentContainer}>
            <View style={styles.controlsAndSliders}>
              <View style={styles.sliderContainer}>
                {renderSliders()}
              </View>
            </View>
            <View style={styles.canvasContainer}>
              {renderCanvas()}
            </View>
          </View>
        </ScrollView>
      )}
    </ExperimentLayout>
  );

  function renderSliders() {
    return (
      <>
        <View style={styles.sliderRow}>
          <Text style={styles.sliderLabel}>
            Uzunluk / Length: {state.length.toFixed(1)} m
          </Text>
          <Slider
            style={styles.slider}
            minimumValue={0.5}
            maximumValue={3}
            value={state.length}
            onValueChange={(value: number) =>
              setState((prev) => ({ ...prev, length: value }))
            }
          />
        </View>
        <View style={styles.sliderRow}>
          <Text style={styles.sliderLabel}>
            Kütle / Mass: {state.mass.toFixed(1)} kg
          </Text>
          <Slider
            style={styles.slider}
            minimumValue={0.1}
            maximumValue={2}
            value={state.mass}
            onValueChange={(value: number) =>
              setState((prev) => ({ ...prev, mass: value }))
            }
          />
        </View>
        <View style={styles.sliderRow}>
          <Text style={styles.sliderLabel}>
            Sönüm / Damping: {state.damping.toFixed(2)}
          </Text>
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={0.5}
            value={state.damping}
            onValueChange={(value: number) =>
              setState((prev) => ({ ...prev, damping: value }))
            }
          />
        </View>
      </>
    );
  }

  function renderCanvas() {
    return (
      <>
        <Svg
          width={canvasWidth}
          height={canvasHeight}
          style={styles.svg}
        >
          <Circle
            cx={centerX}
            cy={centerY}
            r={5}
            fill="#2c3e50"
          />
          <Line
            x1={centerX}
            y1={centerY}
            x2={bobX}
            y2={bobY}
            stroke="black"
            strokeWidth={2}
          />
          <Circle
            cx={bobX}
            cy={bobY}
            r={15 + state.mass * 8}
            fill="#3498db"
            stroke="black"
            strokeWidth={2}
          />
        </Svg>
        {renderMetrics()}
      </>
    );
  }
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingBottom: Platform.OS === "web" ? 20 : 200, // Mobilde alt boşluğu artırıyorum
  },
  experimentContainer: {
    flex: 1,
  },
  controlsAndSliders: {
    marginBottom: Platform.OS === "web" ? 8 : 12,
    marginHorizontal: Platform.OS === "web" ? 0 : 4,
  },
  sliderContainer: {
    backgroundColor: '#f9f9f9',
    padding: Platform.OS === "web" ? 8 : 12,
    borderRadius: 10,
    marginBottom: Platform.OS === "web" ? 8 : 12,
  },
  sliderRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Platform.OS === "web" ? 6 : 8,
  },
  sliderLabel: {
    width: Platform.OS === "web" ? 150 : 115,
    fontSize: Platform.OS === "web" ? 12 : 11,
  },
  slider: {
    flex: 1,
    height: Platform.OS === "web" ? 30 : 28,
  },
  canvasContainer: {
    flex: Platform.OS === "web" ? 1 : 0,
    minHeight: Platform.OS === "web" ? 800 : 250,
    backgroundColor: '#fff',
    borderRadius: 10,
    overflow: 'hidden',
    position: 'relative',
    alignItems: 'center',
    marginHorizontal: Platform.OS === "web" ? 0 : 4,
    marginBottom: Platform.OS === "web" ? 0 : 12,
  },
  svg: {
    width: '100%',
    height: '100%',
    zIndex: 1,
  },
  metrics: {
    position: "absolute",
    left: Platform.OS === "web" ? 15 : 4,
    top: Platform.OS === "web" ? 15 : 4,
    backgroundColor: "rgba(255, 255, 255, 0.98)",
    padding: Platform.OS === "web" ? 10 : 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    minWidth: Platform.OS === "web" ? 200 : 130,
    maxWidth: Platform.OS === "web" ? 250 : 150,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2.84,
    elevation: 3,
    zIndex: 2,
  },
  metricRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 3,
  },
  metricLabel: {
    fontSize: Platform.OS === "web" ? 12 : 10,
    color: "#7f8c8d",
    marginRight: 6,
    flex: 1,
  },
  metricValue: {
    fontSize: Platform.OS === "web" ? 13 : 11,
    color: "#2c3e50",
    fontWeight: "bold",
    minWidth: Platform.OS === "web" ? 80 : 60,
    textAlign: "right",
  },
});
