import { useState, useCallback, useRef, useEffect } from 'react';
import { WaveState, Point } from './types';
import { calculateWaveParameters } from './wave';

const INITIAL_STATE: WaveState = {
  amplitude: 50,
  wavelength: 200,
  phase: 0,
  waveSpeed: 50,
  markedPoints: [{ x: 100, y: 0 }],
  showVelocity: false,
  direction: 'right',
  isPaused: true,
  isStep: false,
  showGraph: [false, false],
  animationSpeed: 1,
  timeStep: 0.016, // 60fps için yaklaşık değer
  stepSize: 'quarter',
  showPeriodGraph: false, // Periyot grafiğini başlangıçta gizle
};

export const useTransverseWave = (
  onStateChange?: (state: WaveState) => void
) => {
  const [state, setState] = useState<WaveState>(INITIAL_STATE);
  const animationRef = useRef<number>();
  const lastTimeRef = useRef<number>(0);
  const accumulatedTimeRef = useRef<number>(0);
  const periodGraphDataRef = useRef<{ [key: number]: Point[] }>({});

  // Dalga parametrelerini hesapla
  const waveParameters = calculateWaveParameters(
    state.amplitude,
    state.wavelength,
    state.waveSpeed
  );

  // Genliği değiştir
  const setAmplitude = useCallback((amplitude: number) => {
    setState((prev) => ({ ...prev, amplitude }));
  }, []);

  // Dalga boyunu değiştir
  const setWavelength = useCallback((wavelength: number) => {
    setState((prev) => ({ ...prev, wavelength }));
  }, []);

  // Dalga hızını değiştir
  const setWaveSpeed = useCallback((waveSpeed: number) => {
    setState((prev) => ({ ...prev, waveSpeed }));
  }, []);

  // Yönü değiştir
  const setDirection = useCallback((direction: 'left' | 'right') => {
    setState((prev) => ({ ...prev, direction }));
  }, []);

  // Hız vektörlerini göster/gizle
  const toggleVelocity = useCallback(() => {
    setState((prev) => ({ ...prev, showVelocity: !prev.showVelocity }));
  }, []);

  // Periyot grafiğini göster/gizle
  const togglePeriodGraph = useCallback(() => {
    setState((prev) => ({ ...prev, showPeriodGraph: !prev.showPeriodGraph }));
  }, []);

  // İşaretli nokta sayısını değiştir
  const setMarkedPoints = useCallback(
    (count: number) => {
      const newPoints: Point[] = [];
      const wavelength = state.wavelength;

      for (let i = 0; i < count; i++) {
        newPoints.push({
          x: (i * wavelength) / (count > 1 ? count - 1 : 1),
          y: 0,
        });
      }

      setState((prev) => ({ ...prev, markedPoints: newPoints }));
      // Periyot grafiği verilerini sıfırla
      periodGraphDataRef.current = {};
    },
    [state.wavelength]
  );

  // Adım boyutunu değiştir
  const setStepSize = useCallback(
    (stepSize: 'quarter' | 'half' | 'threeQuarters' | 'full' | 'none') => {
      setState((prev) => ({ ...prev, stepSize }));
    },
    []
  );

  // Simülasyonu başlat
  const startSimulation = useCallback(() => {
    setState((prev) => ({ ...prev, isPaused: false }));
  }, []);

  // Simülasyonu durdur
  const stopSimulation = useCallback(() => {
    setState((prev) => ({ ...prev, isPaused: true }));
  }, []);

  // Simülasyonu sıfırla
  const resetSimulation = useCallback(() => {
    setState((prev) => ({
      ...INITIAL_STATE,
      amplitude: prev.amplitude,
      wavelength: prev.wavelength,
      waveSpeed: prev.waveSpeed,
      direction: prev.direction,
      showVelocity: prev.showVelocity,
      markedPoints: prev.markedPoints,
      stepSize: prev.stepSize,
      showPeriodGraph: prev.showPeriodGraph,
    }));
    // Periyot grafiği verilerini sıfırla
    periodGraphDataRef.current = {};
  }, []);

  // Tek adım ilerlet
  const stepSimulation = useCallback(() => {
    let phaseIncrement = 0;

    switch (state.stepSize) {
      case 'quarter':
        phaseIncrement = Math.PI / 2;
        break;
      case 'half':
        phaseIncrement = Math.PI;
        break;
      case 'threeQuarters':
        phaseIncrement = (3 * Math.PI) / 2;
        break;
      case 'full':
        phaseIncrement = 2 * Math.PI;
        break;
      default:
        phaseIncrement = 0;
    }

    setState((prev) => ({
      ...prev,
      phase: prev.phase + phaseIncrement,
      isStep: true,
    }));

    // Adım sonrası isStep'i false yap
    setTimeout(() => {
      setState((prev) => ({ ...prev, isStep: false }));
    }, 100);
  }, [state.stepSize]);

  // Animasyon döngüsü
  const animate = useCallback(
    (time: number) => {
      if (lastTimeRef.current === 0) {
        lastTimeRef.current = time;
      }

      const deltaTime = time - lastTimeRef.current;
      lastTimeRef.current = time;

      if (!state.isPaused && !state.isStep) {
        accumulatedTimeRef.current += deltaTime;

        // Zaman adımı kadar birikmiş zaman varsa faz güncelle
        while (accumulatedTimeRef.current >= state.timeStep * 1000) {
          accumulatedTimeRef.current -= state.timeStep * 1000;

          // Faz güncelleme
          const omega = waveParameters.waveSpeed * waveParameters.waveNumber;
          const phaseIncrement = omega * state.timeStep * state.animationSpeed;

          setState((prev) => ({
            ...prev,
            phase: prev.phase + phaseIncrement,
          }));

          // Periyot grafiği için veri toplama
          if (state.showPeriodGraph) {
            const directionFactor = state.direction === 'right' ? -1 : 1;
            const currentPhase = state.phase + phaseIncrement;

            state.markedPoints.forEach((point, index) => {
              const y =
                state.amplitude *
                Math.sin(
                  waveParameters.waveNumber * point.x +
                    directionFactor * currentPhase
                );

              if (!periodGraphDataRef.current[index]) {
                periodGraphDataRef.current[index] = [];
              }

              // Zaman değerini normalize et (8 saniyelik pencere)
              const normalizedTime = (time % 8000) / 1000;

              // Eğer yeni bir periyoda geçiliyorsa, veriyi temizle
              if (
                periodGraphDataRef.current[index].length > 0 &&
                normalizedTime <
                  periodGraphDataRef.current[index][
                    periodGraphDataRef.current[index].length - 1
                  ].x
              ) {
                periodGraphDataRef.current[index] = [];
              }

              periodGraphDataRef.current[index].push({ x: normalizedTime, y });
            });
          }
        }
      }

      animationRef.current = requestAnimationFrame(animate);
    },
    [
      state.isPaused,
      state.isStep,
      state.timeStep,
      state.animationSpeed,
      waveParameters,
      state.showPeriodGraph,
      state.direction,
      state.amplitude,
      state.markedPoints,
      state.phase,
    ]
  );

  // Animasyon döngüsünü başlat/durdur
  useEffect(() => {
    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [animate]);

  // State değişikliklerini dışarıya bildir
  useEffect(() => {
    if (onStateChange) {
      onStateChange(state);
    }
  }, [state, onStateChange]);

  // Dalga parametreleri değiştiğinde periyot grafiği verilerini sıfırla
  useEffect(() => {
    periodGraphDataRef.current = {};
  }, [state.amplitude, state.wavelength, state.waveSpeed]);

  return {
    state,
    waveParameters,
    periodGraphData: periodGraphDataRef.current,
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
    stepSimulation,
  };
};
