export interface ConicalPendulumState {
  length: number;        // İp uzunluğu (0.75 m)
  omega: number;         // Açısal hız (3-7 rad/s)
  alpha: number;         // İp ile düşey arasındaki açı
  time: number;          // Geçen süre
  isRunning: boolean;    // Animasyon çalışıyor mu?
  showForces: boolean;   // Kuvvetleri göster
  showTrajectory: boolean; // Yörüngeyi göster
  viewAngle: number;     // Görüş açısı (-70° ile 90° arası)
} 