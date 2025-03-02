import { Point } from './types';

// Fiziksel sabitler
export const G = 9.81;  // Yerçekimi ivmesi (m/s²)
export const RAD = Math.PI / 180;  // Derece-Radyan dönüşümü
export const DT = 0.015;  // Zaman adımı (s)

// Makara parametreleri (metre cinsinden)
export const PULLEY_RADIUS = 0.80;  // Makara yarıçapı R = 80 cm
export const MASS_RADIUS = 0.40;    // Bağlı kütle yarıçapı r = 40 cm

// Hareket sınırları
export const MAX_ANGLE = Math.PI;  // Maksimum açı (180 derece)
export const MIN_ANGLE = -Math.PI; // Minimum açı (-180 derece)

// RK4 integrasyon için sonuç tipi
interface RK4Result {
  phi1: number;  // Yeni açı
  dphi1: number; // Yeni açısal hız
}

// İkinci türev fonksiyonu: d²φ/dt² = f(φ, dφ/dt)
function calculateAcceleration(
  phi: number,
  dphi: number,
  params: {
    inertia: number;   // Ip
    massM: number;     // M (kg)
    massm: number;     // m (kg)
  }
): number {
  const { inertia, massM, massm } = params;
  const R = PULLEY_RADIUS;
  const r = MASS_RADIUS;
  
  // Toplam atalet momenti
  const I = inertia + massm * r * r + massM * R * R;
  
  // K = g/I faktörü
  const K = G / I;
  
  // d²φ/dt² = K(MR - mrsin(φ))
  return K * (massM * R - massm * r * Math.sin(phi));
}

// Runge-Kutta 4. derece integrasyon
export function calculateRK4(
  t: number,
  phi0: number,
  dphi0: number,
  params: {
    inertia: number;
    massM: number;
    massm: number;
  }
): RK4Result {
  // Açı sınırlarını kontrol et
  if (phi0 > MAX_ANGLE) {
    return { phi1: MAX_ANGLE, dphi1: 0 };
  }
  if (phi0 < MIN_ANGLE) {
    return { phi1: MIN_ANGLE, dphi1: 0 };
  }

  // k1 = f(t, y)
  const k1_dphi = DT * dphi0;
  const k1_ddphi = DT * calculateAcceleration(phi0, dphi0, params);
  
  // k2 = f(t + dt/2, y + k1/2)
  const phi2 = phi0 + k1_dphi / 2;
  const dphi2 = dphi0 + k1_ddphi / 2;
  const k2_dphi = DT * dphi2;
  const k2_ddphi = DT * calculateAcceleration(phi2, dphi2, params);
  
  // k3 = f(t + dt/2, y + k2/2)
  const phi3 = phi0 + k2_dphi / 2;
  const dphi3 = dphi0 + k2_ddphi / 2;
  const k3_dphi = DT * dphi3;
  const k3_ddphi = DT * calculateAcceleration(phi3, dphi3, params);
  
  // k4 = f(t + dt, y + k3)
  const phi4 = phi0 + k3_dphi;
  const dphi4 = dphi0 + k3_ddphi;
  const k4_dphi = DT * dphi4;
  const k4_ddphi = DT * calculateAcceleration(phi4, dphi4, params);
  
  // y(t + dt) = y(t) + (k1 + 2k2 + 2k3 + k4)/6
  const phi1 = phi0 + (k1_dphi + 2 * k2_dphi + 2 * k3_dphi + k4_dphi) / 6;
  const dphi1 = dphi0 + (k1_ddphi + 2 * k2_ddphi + 2 * k3_ddphi + k4_ddphi) / 6;
  
  return { phi1, dphi1 };
}

// Denge açısını hesapla
export function calculateEquilibriumAngle(massM: number, massm: number): number | null {
  const ratio = (massM * PULLEY_RADIUS) / (massm * MASS_RADIUS);
  
  // Denge mümkün değilse null döndür
  if (ratio > 1) return null;
  
  // φe = arcsin(MR/mr)
  return Math.asin(ratio);
}

// Küçük salınımlar için periyot hesabı
export function calculatePeriod(
  params: {
    inertia: number;
    massM: number;
    massm: number;
  }
): number | null {
  const { inertia, massM, massm } = params;
  const R = PULLEY_RADIUS;
  const r = MASS_RADIUS;
  
  // z = m²r² - M²R²
  const z = Math.pow(massm * r, 2) - Math.pow(massM * R, 2);
  
  // Periyot hesaplanamıyorsa null döndür
  if (z <= 0) return null;
  
  // T = 2π√(I/g√z)
  const I = inertia + massm * r * r + massM * R * R;
  return 2 * Math.PI * Math.sqrt(I / (G * Math.sqrt(z)));
}

// Enerji hesaplamaları
export function calculateEnergies(
  phi: number,
  dphi: number,
  params: {
    inertia: number;
    massM: number;
    massm: number;
  }
): {
  potentialEnergy: number;
  kineticEnergy: number;
  totalEnergy: number;
} {
  const { inertia, massM, massm } = params;
  const R = PULLEY_RADIUS;
  const r = MASS_RADIUS;
  
  // Potansiyel enerji: EP = mgr(1-cos(φ)) - MgRφ
  const potentialEnergy = G * (
    massm * r * (1 - Math.cos(phi)) - 
    massM * R * phi
  );
  
  // Kinetik enerji: EC = ½I(dφ/dt)²
  const I = inertia + massm * r * r + massM * R * R;
  const kineticEnergy = 0.5 * I * dphi * dphi;
  
  // Toplam enerji
  const totalEnergy = potentialEnergy + kineticEnergy;
  
  return {
    potentialEnergy,
    kineticEnergy,
    totalEnergy
  };
}

// Çizim için konum hesaplamaları
export function calculatePositions(
  centerX: number,
  centerY: number,
  phi: number,
  scale: number
): {
  massM_pos: Point;
  massm_pos: Point;
  stringPath: string;
} {
  const R = PULLEY_RADIUS * scale;
  const r = MASS_RADIUS * scale;
  
  const massM_pos: Point = {
    x: centerX - R,
    y: centerY + R * phi
  };
  
  const massm_pos: Point = {
    x: centerX + r * Math.sin(phi),
    y: centerY + r * Math.cos(phi)
  };
  
  const stringPath = `
    M ${massM_pos.x} ${massM_pos.y}
    L ${centerX + R * Math.sin(phi)} ${centerY + R * (1 - Math.cos(phi))}
    A ${R} ${R} 0 0 1 ${centerX - R * Math.sin(phi)} ${centerY + R * (1 + Math.cos(phi))}
    L ${massm_pos.x} ${massm_pos.y}
  `;
  
  return { massM_pos, massm_pos, stringPath };
} 