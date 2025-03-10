import React, {
  useRef,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Svg, { Line, Circle, Rect } from 'react-native-svg';
import { MomentBalanceProps, Point2D } from './types';
import { useMomentBalance } from './useMomentBalance';
import { MomentBalanceControls } from './MomentBalanceControls';

const BEAM_LENGTH = 250;
const BEAM_WIDTH = 10;
const PIVOT_RADIUS = 5;
const WEIGHT_RADIUS_BASE = 10;

export const MobileMomentBalance = forwardRef<any, MomentBalanceProps>(
  (
    {
      width = Dimensions.get('window').width - 30,
      height = 300,
      onStateChange,
    },
    ref
  ) => {
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
              x={centerPos.x - 5}
              y={centerPos.y}
              width={10}
              height={height / 2 - centerPos.y}
              fill="#7f8c8d"
            />

            {/* Sol ağırlık */}
            <Circle
              cx={leftPos.x}
              cy={leftPos.y}
              r={WEIGHT_RADIUS_BASE + state.leftWeight * 2}
              fill="#3498db"
            />

            {/* Sağ ağırlık */}
            <Circle
              cx={rightPos.x}
              cy={rightPos.y}
              r={WEIGHT_RADIUS_BASE + state.rightWeight * 2}
              fill="#e74c3c"
            />
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
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ecf0f1',
  },
});
