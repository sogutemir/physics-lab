export interface Point {
  x: number;
  y: number;
}

export interface WaveState {
  amplitude: number;
  wavelength: number;
  phase: number;
  waveSpeed: number;
  markedPoints: Point[];
  showVelocity: boolean;
  direction: 'left' | 'right';
  isPaused: boolean;
  isStep: boolean;
  showGraph: boolean[];
  animationSpeed: number;
  timeStep: number;
  stepSize: 'quarter' | 'half' | 'threeQuarters' | 'full' | 'none';
  showPeriodGraph: boolean;
}

export interface TransverseWaveProps {
  width: number;
  height: number;
  onStateChange?: (state: WaveState) => void;
}

export interface WaveParameters {
  amplitude: number;
  wavelength: number;
  waveSpeed: number;
  period: number;
  waveNumber: number;
}

export interface TransverseWaveControlsProps {
  state: WaveState;
  onAmplitudeChange: (value: number) => void;
  onWavelengthChange: (value: number) => void;
  onSpeedChange: (value: number) => void;
  onDirectionChange: (direction: 'left' | 'right') => void;
  onVelocityToggle: () => void;
  onMarkedPointsChange: (value: number) => void;
  onStepSizeChange: (
    size: 'quarter' | 'half' | 'threeQuarters' | 'full' | 'none'
  ) => void;
  onPeriodGraphToggle?: () => void;
}
