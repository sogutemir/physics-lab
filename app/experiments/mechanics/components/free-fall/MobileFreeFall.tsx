import React, { useCallback, useRef, useEffect, forwardRef, useImperativeHandle, useState } from 'react';
import { View, ScrollView, StyleSheet, Text, Dimensions } from 'react-native';
import Svg, { Line, Circle, Path, Text as SvgText } from 'react-native-svg';
import { FreeFallProps } from './types';
import { useFreeFall } from './useFreeFall';
import { FreeFallControls } from './FreeFallControls';

const CANVAS_PADDING = 20;
const GRAVITY = 9.81;
const MAX_X = 1500;
const MAX_Y = 800;

export const MobileFreeFall = forwardRef<any, FreeFallProps>(({
  width = Dimensions.get('window').width,
  height = Dimensions.get('window').height * 0.4,
  onStateChange,
}, ref) => {
  const animationRef = useRef<number>();
  const timeRef = useRef<number>(0);
  
  const canvasWidth = width * 0.95;
  const canvasHeight = height * 0.4;
  const scaleX = (canvasWidth - 2 * CANVAS_PADDING) / MAX_X;
  const scaleY = (canvasHeight - 2 * CANVAS_PADDING) / MAX_Y;

  const toCanvasX = useCallback((x: number) => x * scaleX + CANVAS_PADDING, [scaleX]);
  const toCanvasY = useCallback((y: number) => canvasHeight - (y * scaleY + CANVAS_PADDING), [canvasHeight, scaleY]);

  const {
    state,
    setVelocity,
    setAngle,
    setFrictionCoef,
    startSimulation,
    stopSimulation,
    resetSimulation,
    updatePosition,
  } = useFreeFall(onStateChange);

  // Ref ile dışarıya metodları açıyoruz
  useImperativeHandle(ref, () => ({
    startSimulation,
    stopSimulation,
    resetSimulation
  }));

  // X ekseni işaretleri
  const xAxisTicks = [];
  for (let x = 0; x <= MAX_X; x += 300) {
    const canvasX = toCanvasX(x);
    xAxisTicks.push(
      <React.Fragment key={`x-${x}`}>
        <Line
          x1={canvasX}
          y1={canvasHeight - CANVAS_PADDING - 5}
          x2={canvasX}
          y2={canvasHeight - CANVAS_PADDING + 5}
          stroke="#7f8c8d"
          strokeWidth={1}
        />
        <SvgText
          x={canvasX}
          y={canvasHeight - CANVAS_PADDING + 15}
          fill="#7f8c8d"
          fontSize={9}
          textAnchor="middle"
        >
          {x.toString() + ' m'}
        </SvgText>
      </React.Fragment>
    );
  }

  // Y ekseni işaretleri
  const yAxisTicks = [];
  for (let y = 0; y <= MAX_Y; y += 200) {
    const canvasY = toCanvasY(y);
    yAxisTicks.push(
      <React.Fragment key={`y-${y}`}>
        <Line
          x1={CANVAS_PADDING - 5}
          y1={canvasY}
          x2={CANVAS_PADDING + 5}
          y2={canvasY}
          stroke="#7f8c8d"
          strokeWidth={1}
        />
        <SvgText
          x={CANVAS_PADDING - 8}
          y={canvasY + 4}
          fill="#7f8c8d"
          fontSize={9}
          textAnchor="end"
        >
          {y.toString() + ' m'}
        </SvgText>
      </React.Fragment>
    );
  }

  // Yörünge path'i oluştur
  let trajectoryPath = '';
  if (state.trajectory.length >= 2) {
    trajectoryPath = `M ${toCanvasX(state.trajectory[0].x)} ${toCanvasY(state.trajectory[0].y)}`;
    for (let i = 1; i < state.trajectory.length; i++) {
      trajectoryPath += ` L ${toCanvasX(state.trajectory[i].x)} ${toCanvasY(state.trajectory[i].y)}`;
    }
  }

  // Cisim ve hız vektörü için hesaplamalar
  const x = toCanvasX(state.position.x);
  const y = toCanvasY(state.position.y);
  const angle = state.angle * Math.PI / 180;
  const vx = state.velocity * Math.cos(angle) * 0.2 * scaleX;
  const vy = state.velocity * Math.sin(angle) * 0.2 * scaleY;

  // Ok ucu için path
  const arrowPath = `
    M ${x + vx} ${y - vy}
    L ${x + vx - 8 * Math.cos(angle - Math.PI/6)} ${y - vy + 8 * Math.sin(angle - Math.PI/6)}
    L ${x + vx - 8 * Math.cos(angle + Math.PI/6)} ${y - vy + 8 * Math.sin(angle + Math.PI/6)}
    Z
  `;

  // Bilgi metinleri
  const infoTexts = [
    `t = ${state.time.toFixed(2)} s`,
    `x = ${state.position.x.toFixed(1)} m`,
    `y = ${state.position.y.toFixed(1)} m`,
    `v = ${state.velocity.toFixed(1)} m/s`,
  ];

  const animate = useCallback(() => {
    if (state.isRunning) {
      updatePosition();
      animationRef.current = requestAnimationFrame(animate);
    }
  }, [state.isRunning, updatePosition]);

  useEffect(() => {
    if (state.isRunning) {
      animationRef.current = requestAnimationFrame(animate);
    } else {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    }
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [state.isRunning, animate]);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.canvasContainer}>
          <Svg
            width={canvasWidth}
            height={canvasHeight}
            style={styles.canvas}
          >
            {/* Arka plan */}
            <Path
              d={`M 0 0 H ${canvasWidth} V ${canvasHeight} H 0 Z`}
              fill="#f5f5f5"
            />
            
            {/* X ekseni */}
            <Line
              x1={CANVAS_PADDING}
              y1={canvasHeight - CANVAS_PADDING}
              x2={canvasWidth - CANVAS_PADDING}
              y2={canvasHeight - CANVAS_PADDING}
              stroke="#7f8c8d"
              strokeWidth={1}
            />
            
            {/* Y ekseni */}
            <Line
              x1={CANVAS_PADDING}
              y1={CANVAS_PADDING}
              x2={CANVAS_PADDING}
              y2={canvasHeight - CANVAS_PADDING}
              stroke="#7f8c8d"
              strokeWidth={1}
            />
            
            {/* Eksen işaretleri */}
            {xAxisTicks}
            {yAxisTicks}
            
            {/* Eksen etiketleri */}
            <SvgText
              x={canvasWidth / 2}
              y={canvasHeight - 2}
              fill="#2c3e50"
              fontSize={12}
              fontWeight="bold"
              textAnchor="middle"
            >
              x (m)
            </SvgText>
            
            <SvgText
              x={10}
              y={canvasHeight / 2}
              fill="#2c3e50"
              fontSize={12}
              fontWeight="bold"
              textAnchor="middle"
              rotation="-90"
              originX={10}
              originY={canvasHeight / 2}
            >
              y (m)
            </SvgText>
            
            {/* Yörünge */}
            {trajectoryPath && (
              <Path
                d={trajectoryPath}
                stroke="#3498db"
                strokeWidth={2}
                fill="none"
              />
            )}
            
            {/* Cisim */}
            <Circle
              cx={x}
              cy={y}
              r={4}
              fill="#2ecc71"
            />
            
            {/* Hız vektörü */}
            <Line
              x1={x}
              y1={y}
              x2={x + vx}
              y2={y - vy}
              stroke="#e74c3c"
              strokeWidth={1}
            />
            
            {/* Ok ucu */}
            <Path
              d={arrowPath}
              fill="#e74c3c"
              stroke="#e74c3c"
            />
            
            {/* Bilgi metinleri */}
            {infoTexts.map((text, index) => (
              <SvgText
                key={`info-${index}`}
                x={canvasWidth - 120}
                y={20 + index * 15}
                fill="#2c3e50"
                fontSize={12}
                fontWeight="bold"
                textAnchor="start"
              >
                {text}
              </SvgText>
            ))}
          </Svg>
        </View>

        <FreeFallControls
          state={state}
          onStart={state.isRunning ? stopSimulation : startSimulation}
          onReset={resetSimulation}
          onVelocityChange={setVelocity}
          onAngleChange={setAngle}
          onFrictionChange={setFrictionCoef}
        />
      </View>
    </ScrollView>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ecf0f1',
  },
  content: {
    padding: 10,
  },
  canvasContainer: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  canvas: {
    width: '100%',
    height: '100%',
    backgroundColor: '#f5f5f5',
  },
}); 