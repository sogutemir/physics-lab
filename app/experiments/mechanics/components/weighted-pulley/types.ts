export interface Point {
  x: number;
  y: number;
}

export interface WeightedPulleyState {
  inertia: number;      // Makaranın atalet momenti (kg.m²)
  massM: number;        // Asılı kütle M (gram)
  massm: number;        // Bağlı kütle m (gram)
  angle: number;        // Başlangıç açısı (derece)
  time: number;         // Geçen süre (s)
  isRunning: boolean;   // Simülasyon çalışıyor mu?
  phi: number;          // Anlık açı (radyan)
  dphi: number;         // Açısal hız (rad/s)
  potentialEnergy: number;  // Potansiyel enerji (Joule)
  kineticEnergy: number;    // Kinetik enerji (Joule)
  totalEnergy: number;      // Toplam enerji (Joule)
  period: number;           // Periyot (s)
}

export interface WeightedPulleyControlsProps {
  state: WeightedPulleyState;
  onStart: () => void;
  onReset: () => void;
  onInertiaChange: (value: number) => void;
  onMassMChange: (value: number) => void;
  onMassmChange: (value: number) => void;
  onAngleChange: (value: number) => void;
}

export const INERTIA_OPTIONS = [
  { value: 0.10, label: "0.10 kg.m²" },
  { value: 0.25, label: "0.25 kg.m²" },
  { value: 0.50, label: "0.50 kg.m²" },
  { value: 1.00, label: "1.00 kg.m²" }
];

export const DEFAULT_STATE: WeightedPulleyState = {
  inertia: 0.10,
  massM: 200,
  massm: 600,
  angle: 0,
  time: 0,
  isRunning: false,
  phi: 0,
  dphi: 0,
  potentialEnergy: 0,
  kineticEnergy: 0,
  totalEnergy: 0,
  period: 0
}; 