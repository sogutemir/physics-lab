/**
 * Ohm Yasası için hesaplama fonksiyonları: V = I * R
 * V = Gerilim (Volt)
 * I = Akım (Amper)
 * R = Direnç (Ohm)
 */

export interface CircuitValues {
  voltage: number; // Volt cinsinden
  current: number; // Amper cinsinden
  resistance: number; // Ohm cinsinden
}

// Gerilim ve dirence göre akımı hesapla (I = V/R)
export const calculateCurrent = (
  voltage: number,
  resistance: number
): number => {
  if (resistance === 0) return 0; // Sıfıra bölünmeyi önle
  return voltage / resistance;
};

// Akım ve dirence göre gerilimi hesapla (V = I*R)
export const calculateVoltage = (
  current: number,
  resistance: number
): number => {
  return current * resistance;
};

// Gerilim ve akıma göre direnci hesapla (R = V/I)
export const calculateResistance = (
  voltage: number,
  current: number
): number => {
  if (current === 0) return 0; // Sıfıra bölünmeyi önle
  return voltage / current;
};

// Değerleri uygun birimlerle ve hassasiyetle formatla
export const formatWithUnit = (
  value: number,
  unit: string,
  precision: number = 2
): string => {
  return `${value.toFixed(precision)} ${unit}`;
};

// Akıma göre animasyon hızını belirle
export const calculateFlowSpeed = (current: number): number => {
  // Akımı makul bir animasyon hızına dönüştür (1-3 saniye)
  const minCurrent = 0;
  const maxCurrent = 10;
  const minSpeed = 3; // Daha yavaş hız (3 saniye)
  const maxSpeed = 0.5; // Daha hızlı hız (0.5 saniye)

  if (current <= 0) return 0; // Akım yoksa animasyon yok

  // Akım aralığından hız aralığına doğrusal haritalama
  const normalizedCurrent = Math.min(Math.max(current, minCurrent), maxCurrent);
  const speed =
    maxSpeed +
    ((minSpeed - maxSpeed) * (maxCurrent - normalizedCurrent)) /
      (maxCurrent - minCurrent);

  return speed;
};

// Gerilime göre parlaklığı belirle
export const calculateBrightness = (voltage: number): number => {
  // Gerilimi parlaklık yüzdesine dönüştür (0-100%)
  const minVoltage = 0;
  const maxVoltage = 24;

  if (voltage <= 0) return 0;

  const normalizedVoltage = Math.min(Math.max(voltage, minVoltage), maxVoltage);
  const brightness = (normalizedVoltage / maxVoltage) * 100;

  return brightness;
};
