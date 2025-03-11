export interface RlcState {
  voltage: number; // Kaynak gerilimi (V)
  frequency: number; // Açısal frekans (rad/s)
  resistance: number; // Direnç (Ω)
  capacitance: number; // Kapasitans (μF)
  inductance: number; // İndüktans (mH)
  time: number; // Geçen süre (s)
  isRunning: boolean; // Simülasyon çalışıyor mu?
}

export interface CircuitValues {
  omega: number; // Açısal frekans
  XL: number; // İndüktif reaktans
  XC: number; // Kapasitif reaktans
  Z: number; // Empedans
  phase: number; // Faz açısı
  current: number; // Akım
  VR: number; // Direnç üzerindeki gerilim
  VC: number; // Kondansatör üzerindeki gerilim
  VL: number; // Bobin üzerindeki gerilim
}
