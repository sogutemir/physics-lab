import React, {
  useRef,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Svg, { Line, Circle, Rect, Text as SvgText } from 'react-native-svg';
import { MomentBalanceProps, Point2D } from './types';
import { useMomentBalance } from './useMomentBalance';
import { MomentBalanceControls } from './MomentBalanceControls';

const BEAM_LENGTH = 400;
const BEAM_WIDTH = 15;
const PIVOT_RADIUS = 8;
const WEIGHT_RADIUS_BASE = 15;
const SCALE_MARKS = 10; // Ölçek işaretleri sayısı

export const WebMomentBalance = forwardRef<any, MomentBalanceProps>(
  ({ width = 800, height = 400, onStateChange }, ref) => {
    const animationRef = useRef<number>();
    const lastTimeRef = useRef<number>();

    const {
      state,
      setLeftWeight,
      setRightWeight,
      setLeftRatio,
      setRightRatio,
      startSimulation,
      stopSimulation,
      resetSimulation,
      updateSimulation,
    } = useMomentBalance(onStateChange);

    // Ref ile dışarıya metodları açıyoruz
    useImperativeHandle(ref, () => ({
      startSimulation,
      stopSimulation,
      resetSimulation,
    }));

    // Çubuğun noktalarını hesapla
    const getBeamPoints = (): Point2D[] => {
      const centerX = width / 2;
      const centerY = height / 2;
      const angleRad = (state.angle * Math.PI) / 180;

      // Çubuğun merkez noktası
      const center: Point2D = { x: centerX, y: centerY };

      // Çubuğun sol ucu
      const left: Point2D = {
        x:
          centerX -
          (BEAM_LENGTH / 2) * Math.cos(angleRad) +
          (BEAM_WIDTH / 2) * Math.sin(angleRad),
        y:
          centerY +
          (BEAM_LENGTH / 2) * Math.sin(angleRad) +
          (BEAM_WIDTH / 2) * Math.cos(angleRad),
      };

      // Çubuğun sağ ucu
      const right: Point2D = {
        x:
          centerX +
          (BEAM_LENGTH / 2) * Math.cos(angleRad) -
          (BEAM_WIDTH / 2) * Math.sin(angleRad),
        y:
          centerY -
          (BEAM_LENGTH / 2) * Math.sin(angleRad) -
          (BEAM_WIDTH / 2) * Math.cos(angleRad),
      };

      return [center, left, right];
    };

    // Ağırlıkların konumlarını hesapla
    const getWeightPositions = (
      beamPoints: Point2D[]
    ): { leftPos: Point2D; rightPos: Point2D } => {
      const center = beamPoints[0];
      const left = beamPoints[1];
      const right = beamPoints[2];

      // Sol ağırlığın konumu
      const leftPos: Point2D = {
        x: center.x - (center.x - left.x) * state.leftRatio,
        y: center.y - (center.y - left.y) * state.leftRatio,
      };

      // Sağ ağırlığın konumu
      const rightPos: Point2D = {
        x: center.x + (right.x - center.x) * state.rightRatio,
        y: center.y + (right.y - center.y) * state.rightRatio,
      };

      return { leftPos, rightPos };
    };

    // Ölçek işaretlerini oluştur
    const renderScaleMarks = (beamPoints: Point2D[]) => {
      const center = beamPoints[0];
      const left = beamPoints[1];
      const right = beamPoints[2];

      const marks = [];

      // Sol taraf işaretleri
      for (let i = 1; i <= SCALE_MARKS; i++) {
        const ratio = i / SCALE_MARKS;
        const x = center.x - (center.x - left.x) * ratio;
        const y = center.y - (center.y - left.y) * ratio;

        marks.push(
          <Line
            key={`left-${i}`}
            x1={x}
            y1={y - 5}
            x2={x}
            y2={y + 5}
            stroke="#7f8c8d"
            strokeWidth={1}
          />
        );

        if (i % 2 === 0) {
          marks.push(
            <SvgText
              key={`left-text-${i}`}
              x={x}
              y={y + 20}
              fontSize="10"
              textAnchor="middle"
              fill="#7f8c8d"
            >
              {(ratio * 100).toFixed(0)}%
            </SvgText>
          );
        }
      }

      // Sağ taraf işaretleri
      for (let i = 1; i <= SCALE_MARKS; i++) {
        const ratio = i / SCALE_MARKS;
        const x = center.x + (right.x - center.x) * ratio;
        const y = center.y + (right.y - center.y) * ratio;

        marks.push(
          <Line
            key={`right-${i}`}
            x1={x}
            y1={y - 5}
            x2={x}
            y2={y + 5}
            stroke="#7f8c8d"
            strokeWidth={1}
          />
        );

        if (i % 2 === 0) {
          marks.push(
            <SvgText
              key={`right-text-${i}`}
              x={x}
              y={y + 20}
              fontSize="10"
              textAnchor="middle"
              fill="#7f8c8d"
            >
              {(ratio * 100).toFixed(0)}%
            </SvgText>
          );
        }
      }

      return marks;
    };

    // Animasyon döngüsü
    useEffect(() => {
      const animate = (timestamp: number) => {
        if (!lastTimeRef.current) {
          lastTimeRef.current = timestamp;
          animationRef.current = requestAnimationFrame(animate);
          return;
        }

        const deltaTime = (timestamp - lastTimeRef.current) / 1000;
        lastTimeRef.current = timestamp;

        const beamPoints = getBeamPoints();
        updateSimulation(deltaTime, beamPoints);

        animationRef.current = requestAnimationFrame(animate);
      };

      animationRef.current = requestAnimationFrame(animate);
      return () => {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
      };
    }, [updateSimulation]);

    // Çubuğu ve ağırlıkları çiz
    const beamPoints = getBeamPoints();
    const { leftPos, rightPos } = getWeightPositions(beamPoints);
    const centerPos = beamPoints[0];

    return (
      <View style={styles.container}>
        <View style={styles.canvasContainer}>
          <Svg width={width} height={height}>
            {/* Ölçek işaretleri */}
            {renderScaleMarks(beamPoints)}

            {/* Çubuk */}
            <Line
              x1={beamPoints[1].x}
              y1={beamPoints[1].y}
              x2={beamPoints[2].x}
              y2={beamPoints[2].y}
              stroke="#2c3e50"
              strokeWidth={BEAM_WIDTH}
              strokeLinecap="round"
            />

            {/* Pivot noktası */}
            <Circle
              cx={centerPos.x}
              cy={centerPos.y}
              r={PIVOT_RADIUS}
              fill="#7f8c8d"
            />

            {/* Pivot desteği */}
            <Rect
              x={centerPos.x - 8}
              y={centerPos.y}
              width={16}
              height={height / 2 - centerPos.y}
              fill="#7f8c8d"
            />

            {/* Sol ağırlık */}
            <Circle
              cx={leftPos.x}
              cy={leftPos.y}
              r={WEIGHT_RADIUS_BASE + state.leftWeight * 3}
              fill="#3498db"
            />

            {/* Sol ağırlık değeri */}
            <SvgText
              x={leftPos.x}
              y={leftPos.y + 5}
              fontSize="12"
              fontWeight="bold"
              textAnchor="middle"
              fill="white"
            >
              {state.leftWeight.toFixed(1)}N
            </SvgText>

            {/* Sağ ağırlık */}
            <Circle
              cx={rightPos.x}
              cy={rightPos.y}
              r={WEIGHT_RADIUS_BASE + state.rightWeight * 3}
              fill="#e74c3c"
            />

            {/* Sağ ağırlık değeri */}
            <SvgText
              x={rightPos.x}
              y={rightPos.y + 5}
              fontSize="12"
              fontWeight="bold"
              textAnchor="middle"
              fill="white"
            >
              {state.rightWeight.toFixed(1)}N
            </SvgText>
          </Svg>
        </View>

        <MomentBalanceControls
          state={state}
          onLeftWeightChange={setLeftWeight}
          onRightWeightChange={setRightWeight}
          onLeftRatioChange={setLeftRatio}
          onRightRatioChange={setRightRatio}
          onReset={resetSimulation}
        />
      </View>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  canvasContainer: {
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ecf0f1',
  },
});
