export interface Point2D {
  x: number;
  y: number;
}

export interface FreeFallState {
  velocity: number;      // Başlangıç hızı (m/s)
  angle: number;        // Atış açısı (derece)
  frictionCoef: number; // Sürtünme katsayısı (β/m)
  time: number;         // Geçen süre (s)
  position: Point2D;    // Konum (x,y)
  trajectory: Point2D[]; // Yörünge noktaları
  isRunning: boolean;   // Simülasyon çalışıyor mu?
}

export interface FreeFallControlsProps {
  state: FreeFallState;
  onStart: () => void;
  onReset: () => void;
  onVelocityChange: (velocity: number) => void;
  onAngleChange: (angle: number) => void;
  onFrictionChange: (friction: number) => void;
}

export interface FreeFallProps {
  width?: number;
  height?: number;
  onStateChange?: (state: FreeFallState) => void;
} 