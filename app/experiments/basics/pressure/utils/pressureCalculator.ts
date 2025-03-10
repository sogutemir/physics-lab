/**
 * Belirli bir derinlikteki sıvı basıncını hesaplar
 *
 * Formül: P = ρ × g × h
 * P: basınç (Pa veya N/m²)
 * ρ (rho): sıvı yoğunluğu (kg/m³)
 * g: yerçekimi ivmesi (9.8 m/s²)
 * h: derinlik (m)
 */
export const calculatePressure = (
  fluidDensity: number, // kg/m³
  depth: number // m
): number => {
  const gravitationalAcceleration = 9.8; // m/s²
  return fluidDensity * gravitationalAcceleration * depth;
};

/**
 * Sıvı içindeki bir cisme etki eden kaldırma kuvvetini hesaplar
 *
 * Formül: F = ρsıvı × g × V
 * F: kaldırma kuvveti (N)
 * ρsıvı: sıvı yoğunluğu (kg/m³)
 * g: yerçekimi ivmesi (9.8 m/s²)
 * V: cismin hacmi (m³)
 */
export const calculateBuoyantForce = (
  fluidDensity: number, // kg/m³
  objectVolume: number // m³
): number => {
  const gravitationalAcceleration = 9.8; // m/s²
  return fluidDensity * gravitationalAcceleration * objectVolume;
};

/**
 * Cismin yüzüp yüzmeyeceğini hesaplar
 *
 * - Cisim yoğunluğu < sıvı yoğunluğu: Cisim yüzer
 * - Cisim yoğunluğu > sıvı yoğunluğu: Cisim batar
 * - Cisim yoğunluğu = sıvı yoğunluğu: Cisim askıda kalır
 */
export const determineFloatStatus = (
  objectDensity: number, // kg/m³
  fluidDensity: number // kg/m³
): 'float' | 'sink' | 'neutral' => {
  if (objectDensity < fluidDensity) {
    return 'float';
  } else if (objectDensity > fluidDensity) {
    return 'sink';
  } else {
    return 'neutral';
  }
};

/**
 * Yüzen cismin ne kadarının battığını yüzde olarak hesaplar
 *
 * Formül: % batan = (ρcisim / ρsıvı) × 100%
 * Sadece cisim yüzdüğünde geçerlidir (cisim yoğunluğu < sıvı yoğunluğu)
 */
export const calculateSubmergedPercentage = (
  objectDensity: number, // kg/m³
  fluidDensity: number // kg/m³
): number => {
  if (objectDensity >= fluidDensity) {
    return 100; // Tamamen batmış
  }

  return (objectDensity / fluidDensity) * 100;
};

/**
 * Pascal cinsinden basıncı okunabilir formata çevirir
 */
export const formatPressure = (pressurePascals: number): string => {
  if (pressurePascals >= 1000000) {
    return `${(pressurePascals / 1000000).toFixed(2)} MPa`;
  } else if (pressurePascals >= 1000) {
    return `${(pressurePascals / 1000).toFixed(2)} kPa`;
  } else {
    return `${pressurePascals.toFixed(2)} Pa`;
  }
};

/**
 * Sayısal değeri birimle birlikte okunabilir formata çevirir
 */
export const formatWithUnits = (
  value: number,
  unit: string,
  precision = 2
): string => {
  return `${value.toFixed(precision)} ${unit}`;
};
