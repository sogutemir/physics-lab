import { useState, useRef, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch, Dimensions } from 'react-native';
import Slider from '@react-native-community/slider';
import ExperimentLayout from '../../../components/ExperimentLayout';
import { useConicalPendulum } from './components/conical-pendulum/useConicalPendulum';
import {
  Point2D,
  Point3D,
  calculateProjectionConstants,
  project3DTo2D,
  drawLine,
  drawCircle,
  drawVector
} from './components/conical-pendulum/drawing';

const { width } = Dimensions.get('window');
const PENDULUM_RADIUS = 8;
const PROJECTION_DISTANCE = 1000;
const PROJECTION_RHO = 5.5;

export default function ConicalPendulumExperiment() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef<{ x: number; y: number; isDragging: boolean }>({
    x: 0,
    y: 0,
    isDragging: false,
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

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx || !canvas) return;

    // Arka planı temizle
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'silver';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    // Projeksiyon sabitlerini hesapla
    const projConstants = calculateProjectionConstants(0, state.viewAngle);

    // Zemin çiz
    const groundPoints: Point3D[] = [
      { x: 1, y: -1, z: 0 },
      { x: 1, y: 1, z: 0 },
      { x: -1, y: 1, z: 0 },
      { x: -1, y: -1, z: 0 },
    ];

    ctx.fillStyle = state.viewAngle >= 0 ? 'white' : 'gray';
    ctx.beginPath();
    const firstPoint = project3DTo2D(groundPoints[0], projConstants, PROJECTION_DISTANCE, PROJECTION_RHO);
    ctx.moveTo(centerX + firstPoint.x, centerY - firstPoint.y);
    for (let i = 1; i < groundPoints.length; i++) {
      const point = project3DTo2D(groundPoints[i], projConstants, PROJECTION_DISTANCE, PROJECTION_RHO);
      ctx.lineTo(centerX + point.x, centerY - point.y);
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Sarkaç konumunu hesapla
    const radius = state.length * Math.sin(state.alpha);
    const height = state.length * Math.cos(state.alpha);
    const angle = state.omega * state.time;

    const pendulumPos: Point3D = {
      x: radius * Math.cos(angle),
      y: radius * Math.sin(angle),
      z: 1 - height,
    };

    // Yörüngeyi çiz
    if (state.showTrajectory) {
      ctx.strokeStyle = 'gray';
      ctx.setLineDash([6, 4]);
      ctx.lineWidth = 2;

      const steps = 40;
      for (let i = 0; i < steps; i++) {
        const a = (2 * Math.PI * i) / steps;
        const p1: Point3D = {
          x: radius * Math.cos(a),
          y: radius * Math.sin(a),
          z: 1 - height,
        };
        const p2: Point3D = {
          x: radius * Math.cos(a + (2 * Math.PI) / steps),
          y: radius * Math.sin(a + (2 * Math.PI) / steps),
          z: 1 - height,
        };

        const projected1 = project3DTo2D(p1, projConstants, PROJECTION_DISTANCE, PROJECTION_RHO);
        const projected2 = project3DTo2D(p2, projConstants, PROJECTION_DISTANCE, PROJECTION_RHO);
        drawLine(ctx, 
          { x: centerX + projected1.x, y: centerY - projected1.y },
          { x: centerX + projected2.x, y: centerY - projected2.y }
        );
      }
      ctx.setLineDash([]);
    }

    // Dikey ekseni çiz
    const axisTop: Point3D = { x: 0, y: 0, z: 1 };
    const axisBottom: Point3D = { x: 0, y: 0, z: 0 };
    const projectedTop = project3DTo2D(axisTop, projConstants, PROJECTION_DISTANCE, PROJECTION_RHO);
    const projectedBottom = project3DTo2D(axisBottom, projConstants, PROJECTION_DISTANCE, PROJECTION_RHO);

    ctx.strokeStyle = 'black';
    ctx.lineWidth = 8;
    drawLine(ctx,
      { x: centerX + projectedTop.x, y: centerY - projectedTop.y },
      { x: centerX + projectedBottom.x, y: centerY - projectedBottom.y }
    );
    ctx.lineWidth = 1;

    // İpi çiz
    const projectedPendulum = project3DTo2D(pendulumPos, projConstants, PROJECTION_DISTANCE, PROJECTION_RHO);
    drawLine(ctx,
      { x: centerX + projectedTop.x, y: centerY - projectedTop.y },
      { x: centerX + projectedPendulum.x, y: centerY - projectedPendulum.y }
    );

    // Sarkacı çiz
    ctx.fillStyle = 'red';
    drawCircle(ctx,
      { x: centerX + projectedPendulum.x, y: centerY - projectedPendulum.y },
      PENDULUM_RADIUS,
      true
    );
    ctx.strokeStyle = 'black';
    drawCircle(ctx,
      { x: centerX + projectedPendulum.x, y: centerY - projectedPendulum.y },
      PENDULUM_RADIUS,
      false
    );

    // Kuvvetleri çiz
    if (state.showForces) {
      const mass = 0.18; // kg
      const scaleForce = 0.075;

      // Ağırlık kuvveti (mg)
      const weightForce: Point3D = {
        x: pendulumPos.x,
        y: pendulumPos.y,
        z: pendulumPos.z - mass,
      };
      const projectedWeight = project3DTo2D(weightForce, projConstants, PROJECTION_DISTANCE, PROJECTION_RHO);
      ctx.strokeStyle = 'blue';
      drawVector(ctx,
        { x: centerX + projectedPendulum.x, y: centerY - projectedPendulum.y },
        { x: centerX + projectedWeight.x, y: centerY - projectedWeight.y }
      );
      ctx.fillText('mg', centerX + projectedWeight.x - 15, centerY - projectedWeight.y + 20);

      // İp gerilmesi (T)
      const tensionLength = state.length - mass / Math.cos(state.alpha);
      const tensionForce: Point3D = {
        x: tensionLength * Math.sin(state.alpha) * Math.cos(angle),
        y: tensionLength * Math.sin(state.alpha) * Math.sin(angle),
        z: 1 - tensionLength * Math.cos(state.alpha),
      };
      const projectedTension = project3DTo2D(tensionForce, projConstants, PROJECTION_DISTANCE, PROJECTION_RHO);
      ctx.strokeStyle = 'brown';
      drawVector(ctx,
        { x: centerX + projectedPendulum.x, y: centerY - projectedPendulum.y },
        { x: centerX + projectedTension.x, y: centerY - projectedTension.y }
      );
      ctx.fillText('T', centerX + projectedTension.x + 10, centerY - projectedTension.y - 10);

      // Merkezcil kuvvet (F)
      const centForce: Point3D = {
        x: (radius - mass * Math.tan(state.alpha)) * Math.cos(angle),
        y: (radius - mass * Math.tan(state.alpha)) * Math.sin(angle),
        z: pendulumPos.z,
      };
      const projectedCent = project3DTo2D(centForce, projConstants, PROJECTION_DISTANCE, PROJECTION_RHO);
      ctx.strokeStyle = 'green';
      drawVector(ctx,
        { x: centerX + projectedPendulum.x, y: centerY - projectedPendulum.y },
        { x: centerX + projectedCent.x, y: centerY - projectedCent.y }
      );
      ctx.fillText('F', centerX + projectedCent.x + 10, centerY - projectedCent.y);
    }

    // Bilgileri yaz
    ctx.font = 'bold 12px Arial';
    ctx.fillStyle = 'black';
    ctx.fillText(`L = ${state.length.toFixed(2)} m`, 60, 50);
    ctx.fillText(`Açı α = ${(state.alpha * 180 / Math.PI).toFixed(1)}°`, 370, 50);
    ctx.fillText(`Görüş açısı = ${state.viewAngle.toFixed(1)}°`, 180, canvas.height - 30);

  }, [state]);

  useEffect(() => {
    draw();
  }, [draw]);

  // Mouse olayları
  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    mouseRef.current = {
      x: 0,
      y: clientY - rect.top,
      isDragging: true,
    };
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!mouseRef.current.isDragging) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const y = clientY - rect.top;
    const dy = mouseRef.current.y - y;
    
    setViewAngle((prev: number) => {
      const newAngle = prev + dy * 0.5;
      return Math.max(-70, Math.min(90, newAngle));
    });

    mouseRef.current.y = y;
  }, [setViewAngle]);

  const handleMouseUp = useCallback(() => {
    mouseRef.current.isDragging = false;
  }, []);

  const toggleSimulation = () => {
    if (state.isRunning) {
      stopAnimation();
    } else {
      startAnimation();
    }
  };

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
      <View style={styles.experimentArea}>
        <View style={styles.canvasContainer}>
          <canvas
            ref={canvasRef}
            width={Math.min(width * 0.95, 600)}
            height={400}
            style={styles.canvas}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleMouseDown}
            onTouchMove={handleMouseMove}
            onTouchEnd={handleMouseUp}
            onTouchCancel={handleMouseUp}
          />
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
    </ExperimentLayout>
  );
}

const styles = StyleSheet.create({
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
  canvas: {
    width: '100%',
    height: '100%',
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: 'silver',
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