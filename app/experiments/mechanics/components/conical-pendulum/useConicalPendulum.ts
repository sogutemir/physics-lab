import { useCallback, useEffect, useRef, useState } from 'react';
import { ConicalPendulumState } from './types';

const GRAVITY = 9.81;

export const useConicalPendulum = () => {
  const [state, setState] = useState<ConicalPendulumState>({
    length: 0.75, // 75 cm
    omega: 5.0,   // rad/s
    alpha: 0,     // hesaplanacak
    time: 0,
    isRunning: false,
    showForces: true,
    showTrajectory: true,
    viewAngle: 15,
  });

  const animationFrameRef = useRef<number>();
  const lastTimeRef = useRef<number>();

  // Alpha açısını hesapla (g/(L*ω²))
  const calculateAlpha = useCallback((omega: number) => {
    const ratio = GRAVITY / (state.length * omega * omega);
    if (ratio >= 1) return 0;
    return Math.acos(ratio);
  }, [state.length]);

  const updateState = useCallback((timestamp: number) => {
    if (!lastTimeRef.current) {
      lastTimeRef.current = timestamp;
      animationFrameRef.current = requestAnimationFrame(updateState);
      return;
    }

    const deltaTime = (timestamp - lastTimeRef.current) / 1000;
    lastTimeRef.current = timestamp;

    setState(prevState => {
      if (!prevState.isRunning) return prevState;

      const newTime = prevState.time + deltaTime;
      const alpha = calculateAlpha(prevState.omega);

      return {
        ...prevState,
        time: newTime,
        alpha: alpha,
      };
    });

    animationFrameRef.current = requestAnimationFrame(updateState);
  }, [calculateAlpha]);

  const startAnimation = useCallback(() => {
    setState(prev => ({ ...prev, isRunning: true }));
    lastTimeRef.current = undefined;
    animationFrameRef.current = requestAnimationFrame(updateState);
  }, [updateState]);

  const stopAnimation = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    setState(prev => ({ ...prev, isRunning: false }));
  }, []);

  const resetAnimation = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    setState(prev => ({
      ...prev,
      time: 0,
      isRunning: false,
    }));
  }, []);

  const setOmega = useCallback((omega: number) => {
    setState(prev => ({ ...prev, omega }));
  }, []);

  const setLength = useCallback((length: number) => {
    setState(prev => ({ ...prev, length }));
  }, []);

  const toggleShowForces = useCallback(() => {
    setState(prev => ({ ...prev, showForces: !prev.showForces }));
  }, []);

  const toggleShowTrajectory = useCallback(() => {
    setState(prev => ({ ...prev, showTrajectory: !prev.showTrajectory }));
  }, []);

  const setViewAngle = useCallback((angleOrFn: number | ((prev: number) => number)) => {
    setState(prev => {
      const newAngle = typeof angleOrFn === 'function' ? angleOrFn(prev.viewAngle) : angleOrFn;
      return { ...prev, viewAngle: newAngle };
    });
  }, []);

  useEffect(() => {
    // Alpha açısını hesapla
    setState(prev => ({
      ...prev,
      alpha: calculateAlpha(prev.omega),
    }));
  }, [state.length, state.omega, calculateAlpha]);

  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return {
    state,
    startAnimation,
    stopAnimation,
    resetAnimation,
    setOmega,
    setLength,
    toggleShowForces,
    toggleShowTrajectory,
    setViewAngle,
  };
}; 