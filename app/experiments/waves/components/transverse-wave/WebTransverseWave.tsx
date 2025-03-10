import React, {
  useRef,
  useEffect,
  forwardRef,
  useImperativeHandle,
  useState,
} from 'react';
import { View, StyleSheet, Dimensions, Platform } from 'react-native';
import Svg, {
  Path,
  Line,
  Circle,
  Text as SvgText,
  Polyline,
} from 'react-native-svg';
import { TransverseWaveProps } from './types';
import { useTransverseWave } from './useTransverseWave';
import { TransverseWaveControls } from './TransverseWaveControls';
import { calculateWaveParameters } from './wave';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const WebTransverseWave = forwardRef<any, TransverseWaveProps>(
  (
    { width = Math.min(SCREEN_WIDTH * 0.8, 800), height = 300, onStateChange },
    ref
  ) => {
    const {
      state,
      waveParameters,
      periodGraphData,
      setAmplitude,
      setWavelength,
      setWaveSpeed,
      setDirection,
      toggleVelocity,
      togglePeriodGraph,
      setMarkedPoints,
      setStepSize,
      startSimulation,
      stopSimulation,
      resetSimulation,
    } = useTransverseWave(onStateChange);

    // Ref ile dışarıya metodları açıyoruz
    useImperativeHandle(ref, () => ({
      startSimulation,
      stopSimulation,
      resetSimulation,
    }));

    // SVG için dalga yolu oluştur
    const createWavePath = () => {
      const { amplitude, waveNumber } = waveParameters;
      const centerY = height / 2;
      const directionFactor = state.direction === 'right' ? -1 : 1;

      let path = '';

      for (let x = 0; x <= width; x += 2) {
        // y = A * sin(kx - ωt)
        const y =
          amplitude * Math.sin(waveNumber * x + directionFactor * state.phase);
        const canvasY = centerY - y;

        if (x === 0) {
          path = `M ${x} ${canvasY}`;
        } else {
          path += ` L ${x} ${canvasY}`;
        }
      }

      return path;
    };

    // Izgara çizgileri oluştur
    const renderGridLines = () => {
      const centerY = height / 2;
      const gridLines = [];

      // Yatay ızgara çizgileri
      for (let y = centerY; y >= 0; y -= state.amplitude / 4) {
        gridLines.push(
          <Line
            key={`h-up-${y}`}
            x1={0}
            y1={y}
            x2={width}
            y2={y}
            stroke="#e9ecef"
            strokeWidth={1}
          />
        );
      }

      for (let y = centerY; y <= height; y += state.amplitude / 4) {
        gridLines.push(
          <Line
            key={`h-down-${y}`}
            x1={0}
            y1={y}
            x2={width}
            y2={y}
            stroke="#e9ecef"
            strokeWidth={1}
          />
        );
      }

      // Dikey ızgara çizgileri
      for (let x = 0; x < width; x += state.wavelength / 4) {
        gridLines.push(
          <Line
            key={`v-${x}`}
            x1={x}
            y1={0}
            x2={x}
            y2={height}
            stroke="#e9ecef"
            strokeWidth={1}
          />
        );
      }

      // X ekseni
      gridLines.push(
        <Line
          key="x-axis"
          x1={0}
          y1={centerY}
          x2={width}
          y2={centerY}
          stroke="#adb5bd"
          strokeWidth={2}
        />
      );

      // Y ekseni
      gridLines.push(
        <Line
          key="y-axis"
          x1={0}
          y1={0}
          x2={0}
          y2={height}
          stroke="#adb5bd"
          strokeWidth={2}
        />
      );

      // Eksen etiketleri
      gridLines.push(
        <SvgText
          key="x-label"
          x={width - 10}
          y={centerY - 10}
          fill="#495057"
          fontSize={12}
          textAnchor="middle"
        >
          x
        </SvgText>
      );

      gridLines.push(
        <SvgText
          key="y-label"
          x={10}
          y={10}
          fill="#495057"
          fontSize={12}
          textAnchor="middle"
        >
          y
        </SvgText>
      );

      return gridLines;
    };

    // İşaretli noktaları oluştur
    const renderMarkedPoints = () => {
      const { amplitude, waveNumber } = waveParameters;
      const centerY = height / 2;
      const directionFactor = state.direction === 'right' ? -1 : 1;

      return state.markedPoints.map((point, index) => {
        const y =
          amplitude *
          Math.sin(waveNumber * point.x + directionFactor * state.phase);
        const canvasY = centerY - y;

        return (
          <Circle
            key={`point-${index}`}
            cx={point.x}
            cy={canvasY}
            r={6}
            fill="#fa5252"
          />
        );
      });
    };

    // Hız vektörlerini oluştur
    const renderVelocityVectors = () => {
      if (!state.showVelocity) return null;

      const { amplitude, waveNumber } = waveParameters;
      const centerY = height / 2;
      const directionFactor = state.direction === 'right' ? -1 : 1;
      const omega = waveParameters.waveSpeed * waveNumber;

      return state.markedPoints.map((point, index) => {
        const y =
          amplitude *
          Math.sin(waveNumber * point.x + directionFactor * state.phase);
        const canvasY = centerY - y;

        // Hız vektörü: v = -ω * A * cos(kx - ωt)
        const velocityY =
          -omega *
          amplitude *
          Math.cos(waveNumber * point.x + directionFactor * state.phase);
        const scaledVelocity = velocityY / 5; // Ölçeklendirme faktörü

        // Ok başı için açı
        const arrowLength = 10;
        const angle = Math.atan2(-scaledVelocity, 0);

        return (
          <React.Fragment key={`velocity-${index}`}>
            <Line
              x1={point.x}
              y1={canvasY}
              x2={point.x}
              y2={canvasY - scaledVelocity}
              stroke="#4dabf7"
              strokeWidth={2}
            />
            <Path
              d={`
                M ${point.x} ${canvasY - scaledVelocity}
                L ${point.x - arrowLength * Math.cos(angle - Math.PI / 6)} ${
                canvasY -
                scaledVelocity -
                arrowLength * Math.sin(angle - Math.PI / 6)
              }
                L ${point.x - arrowLength * Math.cos(angle + Math.PI / 6)} ${
                canvasY -
                scaledVelocity -
                arrowLength * Math.sin(angle + Math.PI / 6)
              }
                Z
              `}
              fill="#4dabf7"
            />
          </React.Fragment>
        );
      });
    };

    // Periyot grafiğini SVG ile çiz
    const renderPeriodGraph = () => {
      if (!state.showPeriodGraph || !periodGraphData) return null;

      const periodGraphHeight = height / 2;
      const centerY = periodGraphHeight / 2;
      const elements = [];

      // Arka plan
      elements.push(
        <Path
          key="background"
          d={`M 0 0 H ${width} V ${periodGraphHeight} H 0 Z`}
          fill="#f8f9fa"
        />
      );

      // X ekseni
      elements.push(
        <Line
          key="x-axis"
          x1={0}
          y1={centerY}
          x2={width}
          y2={centerY}
          stroke="#adb5bd"
          strokeWidth={2}
        />
      );

      // Zaman işaretleri
      const period = waveParameters.period;
      const timeScale = width / (period * 2);

      for (let t = 0; t <= period * 2; t += period / 4) {
        const x = t * timeScale;
        elements.push(
          <Line
            key={`time-mark-${t}`}
            x1={x}
            y1={centerY - 5}
            x2={x}
            y2={centerY + 5}
            stroke="#adb5bd"
            strokeWidth={1}
          />
        );
        elements.push(
          <SvgText
            key={`time-label-${t}`}
            x={x}
            y={centerY + 20}
            fill="#495057"
            fontSize={10}
            textAnchor="middle"
          >
            {t.toFixed(1)}s
          </SvgText>
        );
      }

      // Her nokta için zaman grafiği çiz
      const colors = ['#4263eb', '#fa5252', '#40c057', '#fab005', '#7950f2'];

      Object.keys(periodGraphData).forEach((pointIndex, idx) => {
        const pointData = periodGraphData[Number(pointIndex)];
        if (!pointData || pointData.length < 2) return;

        const color = colors[idx % colors.length];
        let points = '';

        pointData.forEach((point) => {
          const x = point.x * timeScale;
          const y = centerY - point.y;
          points += `${x},${y} `;
        });

        elements.push(
          <Polyline
            key={`graph-${pointIndex}`}
            points={points}
            fill="none"
            stroke={color}
            strokeWidth={2}
          />
        );
      });

      return elements;
    };

    return (
      <View style={styles.container}>
        <View style={styles.layout}>
          <View style={styles.mainContent}>
            <View style={[styles.canvasContainer, { width, height }]}>
              <Svg
                width={width}
                height={height}
                style={{ backgroundColor: '#f8f9fa' }}
              >
                {renderGridLines()}
                <Path
                  d={createWavePath()}
                  stroke="#4263eb"
                  strokeWidth={3}
                  fill="none"
                />
                {renderMarkedPoints()}
                {renderVelocityVectors()}
              </Svg>
            </View>

            {state.showPeriodGraph && (
              <View
                style={[styles.canvasContainer, { width, height: height / 2 }]}
              >
                <Svg
                  width={width}
                  height={height / 2}
                  style={{ backgroundColor: '#f8f9fa' }}
                >
                  {renderPeriodGraph()}
                </Svg>
              </View>
            )}
          </View>

          <View style={styles.controlsContainer}>
            <TransverseWaveControls
              state={state}
              onAmplitudeChange={setAmplitude}
              onWavelengthChange={setWavelength}
              onSpeedChange={setWaveSpeed}
              onDirectionChange={setDirection}
              onVelocityToggle={toggleVelocity}
              onMarkedPointsChange={setMarkedPoints}
              onStepSizeChange={setStepSize}
              onPeriodGraphToggle={togglePeriodGraph}
            />
          </View>
        </View>
      </View>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
  },
  layout: {
    flexDirection: Platform.OS === 'web' ? 'row' : 'column',
    alignItems: 'flex-start',
    justifyContent: 'center',
    width: '100%',
  },
  mainContent: {
    flexDirection: 'column',
    flex: Platform.OS === 'web' ? 2 : undefined,
  },
  canvasContainer: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  controlsContainer: {
    flex: 1,
    marginLeft: Platform.OS === 'web' ? 20 : 0,
    width: Platform.OS === 'web' ? 300 : '100%',
  },
});
