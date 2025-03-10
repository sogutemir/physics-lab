import { useState, useCallback } from 'react';
import { MomentBalanceState, Point2D } from './types';

// Sabitler
const MAX_ANGLE = 5; // Maksimum açı (derece)
const ANGLE_DAMPING = 0.2; // Açı sönümleme faktörü

// Başlangıç durumu
const INITIAL_STATE: MomentBalanceState = {
  leftWeight: 2,
  rightWeight: 2,
  leftRatio: 0.5,
  rightRatio: 0.5,
  angle: 0,
  isRunning: false,
  time: 0,
  momentLeft: 0,
  momentRight: 0,
  momentNet: 0,
};

export const useMomentBalance = (
  onStateChange?: (state: MomentBalanceState) => void
) => {
  const [state, setState] = useState<MomentBalanceState>(INITIAL_STATE);

  // Ağırlık ve uzaklık değiştiriciler
  const setLeftWeight = useCallback((leftWeight: number) => {
    setState((prev) => ({ ...prev, leftWeight }));
  }, []);

  const setRightWeight = useCallback((rightWeight: number) => {
    setState((prev) => ({ ...prev, rightWeight }));
  }, []);

  const setLeftRatio = useCallback((leftRatio: number) => {
    setState((prev) => ({ ...prev, leftRatio }));
  }, []);

  const setRightRatio = useCallback((rightRatio: number) => {
    setState((prev) => ({ ...prev, rightRatio }));
  }, []);

  // Moment hesaplama
  const calculateMoment = useCallback(
    (beamPoints: Point2D[]) => {
      const centerX = beamPoints[0].x;
      const leftX =
        beamPoints[0].x - (beamPoints[0].x - beamPoints[1].x) * state.leftRatio;
      const rightX =
        beamPoints[0].x +
        (beamPoints[2].x - beamPoints[0].x) * state.rightRatio;

      const leftDistance = Math.abs(leftX - centerX) / 100; // metre cinsinden
      const rightDistance = Math.abs(rightX - centerX) / 100; // metre cinsinden

      const momentLeft = state.leftWeight * leftDistance;
      const momentRight = state.rightWeight * rightDistance;
      const momentNet = momentLeft - momentRight;

      return { momentLeft, momentRight, momentNet };
    },
    [state.leftWeight, state.rightWeight, state.leftRatio, state.rightRatio]
  );

  // Açı hesaplama
  const calculateFinalAngle = useCallback((momentNet: number) => {
    // Moment dengesine göre açı hesaplama (basitleştirilmiş model)
    const targetAngle = Math.min(
      Math.max(-MAX_ANGLE, momentNet * 2),
      MAX_ANGLE
    );
    return targetAngle;
  }, []);

  // Simülasyonu başlat
  const startSimulation = useCallback(() => {
    setState((prev) => ({ ...prev, isRunning: true, time: 0 }));
  }, []);

  // Simülasyonu durdur
  const stopSimulation = useCallback(() => {
    setState((prev) => ({ ...prev, isRunning: false }));
  }, []);

  // Simülasyonu sıfırla
  const resetSimulation = useCallback(() => {
    setState(INITIAL_STATE);
  }, []);

  // Durumu güncelle
  const updateSimulation = useCallback(
    (deltaTime: number, beamPoints: Point2D[]) => {
      if (!state.isRunning) return;

      setState((prev) => {
        const { momentLeft, momentRight, momentNet } =
          calculateMoment(beamPoints);
        const targetAngle = calculateFinalAngle(momentNet);

        // Açıyı hedef açıya doğru yumuşak bir şekilde değiştir
        const newAngle =
          prev.angle + (targetAngle - prev.angle) * ANGLE_DAMPING;

        const newState = {
          ...prev,
          angle: newAngle,
          time: prev.time + deltaTime,
          momentLeft,
          momentRight,
          momentNet,
        };

        if (onStateChange) onStateChange(newState);
        return newState;
      });
    },
    [state.isRunning, calculateMoment, calculateFinalAngle, onStateChange]
  );

  return {
    state,
    setLeftWeight,
    setRightWeight,
    setLeftRatio,
    setRightRatio,
    startSimulation,
    stopSimulation,
    resetSimulation,
    updateSimulation,
    calculateMoment,
  };
};
