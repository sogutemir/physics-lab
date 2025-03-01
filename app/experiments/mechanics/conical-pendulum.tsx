import { useState, useRef, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch, Dimensions, ScrollView, GestureResponderEvent, Platform } from 'react-native';
import Slider from '@react-native-community/slider';
import Svg, { Line, Circle, Rect, Path } from 'react-native-svg';
import ExperimentLayout from '../../../components/ExperimentLayout';
import { useConicalPendulum } from './components/conical-pendulum/useConicalPendulum';
import {
  Point2D,
  Point3D,
  calculateProjectionConstants,
  project3DTo2D,
} from './components/conical-pendulum/drawing';

const { width, height } = Dimensions.get('window');
const PENDULUM_RADIUS = 8;
const PROJECTION_DISTANCE = 1000;
const PROJECTION_RHO = 5.5;

export default function ConicalPendulumExperiment() {
  const [viewDimensions, setViewDimensions] = useState({
    width: width - 30,
    height: 400,
  });
  
  const {
    state,
    startAnimation,
    stopAnimation,
    resetAnimation,
    setOmega,
    toggleShowForces,
    toggleShowTrajectory,
    setViewAngle,
    setLength,
  } = useConicalPendulum();

  // Dokunma olayları için state
  const [touchState, setTouchState] = useState({
    isDragging: false,
    lastX: 0,
    lastY: 0,
  });

  const handleTouchStart = (e: GestureResponderEvent) => {
    const touch = e.nativeEvent.touches[0];
    setTouchState({
      isDragging: true,
      lastX: touch.pageX,
      lastY: touch.pageY,
    });
  };

  const handleTouchMove = (e: GestureResponderEvent) => {
    if (!touchState.isDragging) return;
    
    const touch = e.nativeEvent.touches[0];
    const deltaX = touch.pageX - touchState.lastX;
    
    // Görüş açısını değiştir
    setViewAngle(state.viewAngle + deltaX * 0.5);
    
    setTouchState({
      ...touchState,
      lastX: touch.pageX,
      lastY: touch.pageY,
    });
  };

  const handleTouchEnd = () => {
    setTouchState({
      ...touchState,
      isDragging: false,
    });
  };

  // Web için mouse olayları
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setTouchState({
      isDragging: true,
      lastX: e.clientX,
      lastY: e.clientY,
    });
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!touchState.isDragging) return;
    
    const deltaX = e.clientX - touchState.lastX;
    
    // Görüş açısını değiştir
    setViewAngle(state.viewAngle + deltaX * 0.5);
    
    setTouchState({
      ...touchState,
      lastX: e.clientX,
      lastY: e.clientY,
    });
  }, [touchState, state.viewAngle, setViewAngle]);

  const handleMouseUp = useCallback(() => {
    setTouchState(prev => ({
      ...prev,
      isDragging: false,
    }));
  }, []);

  // Web için mouse olaylarını document'a ekle/kaldır
  useEffect(() => {
    if (Platform.OS === 'web') {
      document.addEventListener('mousemove', handleMouseMove as any);
      document.addEventListener('mouseup', handleMouseUp as any);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove as any);
        document.removeEventListener('mouseup', handleMouseUp as any);
      };
    }
  }, [handleMouseMove, handleMouseUp]);

  const toggleSimulation = () => {
    if (state.isRunning) {
      stopAnimation();
    } else {
      startAnimation();
    }
  };

  // SVG içinde çizim için hesaplamalar
  const centerX = viewDimensions.width / 2;
  const centerY = viewDimensions.height / 2;
  const projConstants = calculateProjectionConstants(0, state.viewAngle);

  // Sarkaç konumunu hesapla
  const radius = state.length * Math.sin(state.alpha);
  const height = state.length * Math.cos(state.alpha);
  const angle = state.omega * state.time;

  const pendulumPos: Point3D = {
    x: radius * Math.cos(angle),
    y: radius * Math.sin(angle),
    z: 1 - height,
  };

  // 3D noktaları 2D'ye dönüştür
  const projectPoint = (point: Point3D) => {
    const projected = project3DTo2D(point, projConstants, PROJECTION_DISTANCE, PROJECTION_RHO);
    return {
      x: centerX + projected.x,
      y: centerY - projected.y,
    };
  };

  // Zemin noktaları
  const groundPoints = [
    { x: 1, y: -1, z: 0 },
    { x: 1, y: 1, z: 0 },
    { x: -1, y: 1, z: 0 },
    { x: -1, y: -1, z: 0 },
  ].map(projectPoint);

  // Zemin path'i oluştur
  const groundPath = `
    M ${groundPoints[0].x} ${groundPoints[0].y}
    L ${groundPoints[1].x} ${groundPoints[1].y}
    L ${groundPoints[2].x} ${groundPoints[2].y}
    L ${groundPoints[3].x} ${groundPoints[3].y}
    Z
  `;

  // Dikey eksen noktaları
  const axisTop = projectPoint({ x: 0, y: 0, z: 1 });
  const axisBottom = projectPoint({ x: 0, y: 0, z: 0 });

  // Sarkaç noktası
  const projectedPendulum = projectPoint(pendulumPos);

  // Yörünge noktaları
  const trajectoryPoints = [];
  if (state.showTrajectory) {
    const steps = 40;
    for (let i = 0; i < steps; i++) {
      const a = (2 * Math.PI * i) / steps;
      const p: Point3D = {
        x: radius * Math.cos(a),
        y: radius * Math.sin(a),
        z: 1 - height,
      };
      trajectoryPoints.push(projectPoint(p));
    }
  }

  // Yörünge path'i oluştur
  let trajectoryPath = '';
  if (trajectoryPoints.length > 0) {
    trajectoryPath = `M ${trajectoryPoints[0].x} ${trajectoryPoints[0].y}`;
    for (let i = 1; i < trajectoryPoints.length; i++) {
      trajectoryPath += ` L ${trajectoryPoints[i].x} ${trajectoryPoints[i].y}`;
    }
    trajectoryPath += ` L ${trajectoryPoints[0].x} ${trajectoryPoints[0].y}`;
  }

  return (
    <ExperimentLayout
      title="Konik Sarkaç"
      titleEn="Conical Pendulum"
      difficulty="Orta Seviye"
      difficultyEn="Intermediate"
      description="Konik sarkaç, bir ipin ucuna bağlı bir kütlenin yatay düzlemde dairesel hareket yaparak konik bir yörünge izlediği fiziksel bir sistemdir. Bu deneyde, konik sarkacın hareketini ve açısal hızın sarkaç açısına etkisini gözlemleyebilirsiniz. Görüş açısını değiştirmek için ekrana dokunup sürükleyin."
      descriptionEn="A conical pendulum is a physical system where a mass attached to the end of a string moves in a circular path in the horizontal plane, tracing a conical trajectory. In this experiment, you can observe the motion of the conical pendulum and the effect of angular velocity on the pendulum angle. Touch and drag the screen to change the viewing angle."
      isRunning={state.isRunning}
      onToggleSimulation={toggleSimulation}
      onReset={resetAnimation}
    >
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.experimentArea}>
          <View style={styles.canvasContainer}>
            <View
              style={styles.svgContainer}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              onTouchCancel={handleTouchEnd}
            >
              {Platform.OS === 'web' && (
                <div 
                  style={{ 
                    position: 'absolute', 
                    width: '100%', 
                    height: '100%', 
                    zIndex: 10,
                    cursor: 'grab' 
                  }}
                  onMouseDown={handleMouseDown}
                />
              )}
              <Svg
                width={viewDimensions.width}
                height={viewDimensions.height}
                style={styles.svg}
              >
                {/* Zemin */}
                <Path
                  d={groundPath}
                  fill={state.viewAngle >= 0 ? 'white' : 'gray'}
                  stroke="black"
                  strokeWidth={1}
                />
                
                {/* Yörünge */}
                {state.showTrajectory && (
                  <Path
                    d={trajectoryPath}
                    stroke="gray"
                    strokeWidth={2}
                    strokeDasharray="6,4"
                    fill="none"
                  />
                )}
                
                {/* Dikey eksen */}
                <Line
                  x1={axisTop.x}
                  y1={axisTop.y}
                  x2={axisBottom.x}
                  y2={axisBottom.y}
                  stroke="black"
                  strokeWidth={4}
                />
                
                {/* İp */}
                <Line
                  x1={axisTop.x}
                  y1={axisTop.y}
                  x2={projectedPendulum.x}
                  y2={projectedPendulum.y}
                  stroke="black"
                  strokeWidth={1}
                />
                
                {/* Sarkaç */}
                <Circle
                  cx={projectedPendulum.x}
                  cy={projectedPendulum.y}
                  r={PENDULUM_RADIUS}
                  fill="red"
                  stroke="black"
                  strokeWidth={1}
                />
              </Svg>
            </View>
          </View>

          <View style={styles.controlsContainer}>
            <View style={styles.controlGroup}>
              <View style={styles.labelRow}>
                <Text style={styles.label}>İp Uzunluğu</Text>
                <Text style={styles.value}>{state.length.toFixed(2)} m</Text>
              </View>
              <Slider
                value={state.length}
                onValueChange={setLength}
                minimumValue={0.5}
                maximumValue={0.75}
                step={0.01}
                minimumTrackTintColor="#3498db"
                maximumTrackTintColor="#bdc3c7"
                thumbTintColor="#2980b9"
                style={styles.slider}
              />
            </View>

            <View style={styles.controlGroup}>
              <View style={styles.labelRow}>
                <Text style={styles.label}>Açısal Hız</Text>
                <Text style={styles.value}>{state.omega.toFixed(1)} rad/s</Text>
              </View>
              <Slider
                value={state.omega}
                onValueChange={setOmega}
                minimumValue={3.0}
                maximumValue={7.0}
                step={0.1}
                minimumTrackTintColor="#3498db"
                maximumTrackTintColor="#bdc3c7"
                thumbTintColor="#2980b9"
                style={styles.slider}
              />
            </View>

            <View style={styles.switchRow}>
              <Text style={styles.label}>Kuvvetleri Göster</Text>
              <Switch
                value={state.showForces}
                onValueChange={toggleShowForces}
                trackColor={{ false: "#bdc3c7", true: "#3498db" }}
                thumbColor={state.showForces ? "#2980b9" : "#ecf0f1"}
              />
            </View>

            <View style={styles.switchRow}>
              <Text style={styles.label}>Yörüngeyi Göster</Text>
              <Switch
                value={state.showTrajectory}
                onValueChange={toggleShowTrajectory}
                trackColor={{ false: "#bdc3c7", true: "#3498db" }}
                thumbColor={state.showTrajectory ? "#2980b9" : "#ecf0f1"}
              />
            </View>

            <View style={styles.measurementsContainer}>
              <View style={styles.measurementItem}>
                <Text style={styles.measurementLabel}>Açı α:</Text>
                <Text style={styles.measurementValue}>{(state.alpha * 180 / Math.PI).toFixed(1)}°</Text>
              </View>
              <View style={styles.measurementItem}>
                <Text style={styles.measurementLabel}>Görüş Açısı:</Text>
                <Text style={styles.measurementValue}>{state.viewAngle.toFixed(1)}°</Text>
              </View>
            </View>
          </View>
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
    paddingBottom: Platform.OS === 'web' ? 50 : 200, // Mobilde alt boşluğu artırdım
  },
  experimentArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  canvasContainer: {
    width: '100%',
    height: 400,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 16,
  },
  svgContainer: {
    width: '100%',
    height: '100%',
    backgroundColor: 'silver',
  },
  svg: {
    width: '100%',
    height: '100%',
  },
  controlsContainer: {
    width: '100%',
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 16,
  },
  controlGroup: {
    marginBottom: 16,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  value: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  slider: {
    width: '100%',
    height: 40,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  measurementsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 12,
  },
  measurementItem: {
    alignItems: 'center',
  },
  measurementLabel: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 4,
  },
  measurementValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
}); 