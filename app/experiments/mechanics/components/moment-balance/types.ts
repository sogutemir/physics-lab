export interface Point2D {
  x: number;
  y: number;
}

export interface MomentBalanceState {
  leftWeight: number; // Sol ağırlık (1-6 N arası)
  rightWeight: number; // Sağ ağırlık (1-6 N arası)
  leftRatio: number; // Sol ağırlığın merkeze olan uzaklık oranı (0-1 arası)
  rightRatio: number; // Sağ ağırlığın merkeze olan uzaklık oranı (0-1 arası)
  angle: number; // Çubuğun açısı (-5 ile +5 derece arası)
  isRunning: boolean; // Animasyon çalışıyor mu?
  time: number; // Geçen süre (s)
  momentLeft: number; // Sol tarafın momenti (N.m)
  momentRight: number; // Sağ tarafın momenti (N.m)
  momentNet: number; // Net moment (N.m)
}

export interface MomentBalanceControlsProps {
  state: MomentBalanceState;
  onLeftWeightChange: (weight: number) => void;
  onRightWeightChange: (weight: number) => void;
  onLeftRatioChange: (ratio: number) => void;
  onRightRatioChange: (ratio: number) => void;
  onReset: () => void;
}

export interface MomentBalanceProps {
  width?: number;
  height?: number;
  onStateChange?: (state: MomentBalanceState) => void;
}
