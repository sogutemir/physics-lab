/**
 * Elektrik Alanı Simülasyonu için hesaplamalar
 * Coulomb Yasası: F = k * q1 * q2 / r^2
 * Elektrik Alanı: E = F / q = k * q / r^2
 */

// Coulomb sabiti (basitleştirilmiş değer, skala için)
export const COULOMB_CONSTANT = 9e9; // N·m²/C²

// Yükler için arayüz
export interface Charge {
  id: string;
  x: number;
  y: number;
  value: number; // Coulomb cinsinden (pozitif veya negatif)
  isFixed?: boolean;
  color?: string;
}

// Elektrik alan vektörü
export interface ElectricFieldVector {
  x: number;
  y: number;
  magnitude: number;
  direction: number; // radyan cinsinden
}

// İki nokta arasındaki mesafeyi hesapla
export const calculateDistance = (
  x1: number,
  y1: number,
  x2: number,
  y2: number
): number => {
  const dx = x2 - x1;
  const dy = y2 - y1;
  return Math.sqrt(dx * dx + dy * dy);
};

// Belirli bir noktadaki elektrik alanını hesapla
export const calculateElectricField = (
  x: number,
  y: number,
  charges: Charge[]
): ElectricFieldVector => {
  let totalEx = 0;
  let totalEy = 0;

  charges.forEach((charge) => {
    const r = calculateDistance(x, y, charge.x, charge.y);

    // Çok yakın bir noktada ise sonsuz değerleri önle
    if (r < 0.1) return;

    // Elektrik alan şiddeti: E = k * q / r^2
    const forceMagnitude =
      (COULOMB_CONSTANT * Math.abs(charge.value)) / (r * r);

    // Yönleri hesapla (normalize edilmiş vektör)
    const dx = x - charge.x;
    const dy = y - charge.y;
    const directionX = dx / r;
    const directionY = dy / r;

    // Yükün işaretini hesaba kat (pozitif yük itme, negatif yük çekme)
    const sign = Math.sign(charge.value);

    // x ve y bileşenlerine ekle
    totalEx += forceMagnitude * directionX * sign;
    totalEy += forceMagnitude * directionY * sign;
  });

  // Toplam kuvvet vektörünün büyüklüğü ve yönü
  const magnitude = Math.sqrt(totalEx * totalEx + totalEy * totalEy);
  const direction = Math.atan2(totalEy, totalEx);

  return {
    x: totalEx,
    y: totalEy,
    magnitude,
    direction,
  };
};

// Yükler arasındaki etkileşim kuvvetini hesapla
export const calculateForceOnCharge = (
  charge: Charge,
  otherCharges: Charge[]
): { forceX: number; forceY: number } => {
  let totalForceX = 0;
  let totalForceY = 0;

  otherCharges.forEach((otherCharge) => {
    if (otherCharge.id === charge.id) return; // Kendi kendine etki etmez

    const r = calculateDistance(
      charge.x,
      charge.y,
      otherCharge.x,
      otherCharge.y
    );

    // Çok yakın bir noktada ise çok büyük kuvvetleri önle
    if (r < 5) return;

    // Coulomb yasası: F = k * q1 * q2 / r^2
    const forceMagnitude =
      (COULOMB_CONSTANT *
        Math.abs(charge.value) *
        Math.abs(otherCharge.value)) /
      (r * r);

    // Yönleri hesapla
    const dx = otherCharge.x - charge.x;
    const dy = otherCharge.y - charge.y;
    const directionX = dx / r;
    const directionY = dy / r;

    // Yüklerin işaretlerini hesaba kat (aynı işaretli yükler iter, farklı işaretli yükler çeker)
    const sign =
      Math.sign(charge.value) === Math.sign(otherCharge.value) ? -1 : 1;

    // x ve y bileşenlerine ekle
    totalForceX += forceMagnitude * directionX * sign;
    totalForceY += forceMagnitude * directionY * sign;
  });

  return { forceX: totalForceX, forceY: totalForceY };
};

// Elektrik alan çizgilerinin hesaplanması
export const calculateFieldLine = (
  startX: number,
  startY: number,
  charges: Charge[],
  maxPoints: number = 100,
  stepSize: number = 5,
  direction: number = 1 // 1: pozitif yükten başla, -1: negatif yükten başla
): { x: number; y: number }[] => {
  const points: { x: number; y: number }[] = [{ x: startX, y: startY }];
  let x = startX;
  let y = startY;

  for (let i = 0; i < maxPoints; i++) {
    const field = calculateElectricField(x, y, charges);

    // Çok zayıf alan varsa veya sınırlara geldiyse durdur
    if (field.magnitude < 0.1 || x < 0 || x > 1000 || y < 0 || y > 1000) {
      break;
    }

    // Yönlendirme faktörü (pozitif veya negatif yükten başlama)
    const dirFactor = direction;

    // Bir sonraki adım
    x += (field.x / field.magnitude) * stepSize * dirFactor;
    y += (field.y / field.magnitude) * stepSize * dirFactor;

    points.push({ x, y });
  }

  return points;
};

// İki yük arasındaki potansiyel enerjiyi hesapla (J)
export const calculatePotentialEnergy = (
  charge1: Charge,
  charge2: Charge
): number => {
  const distance = calculateDistance(
    charge1.x,
    charge1.y,
    charge2.x,
    charge2.y
  );

  // Çok yakın bir noktada ise aşırı büyük değerleri önle
  if (distance < 1) return 0;

  // Potansiyel enerji = k * q1 * q2 / r
  return (COULOMB_CONSTANT * charge1.value * charge2.value) / distance;
};

// Sistemdeki toplam potansiyel enerjiyi hesapla
export const calculateTotalPotentialEnergy = (charges: Charge[]): number => {
  let totalEnergy = 0;

  // Her çift yük için potansiyel enerjiyi hesapla ve topla
  for (let i = 0; i < charges.length; i++) {
    for (let j = i + 1; j < charges.length; j++) {
      totalEnergy += calculatePotentialEnergy(charges[i], charges[j]);
    }
  }

  return totalEnergy;
};

// Belli bir noktadaki elektrik potansiyelini hesapla (V)
export const calculateElectricPotential = (
  x: number,
  y: number,
  charges: Charge[]
): number => {
  let potential = 0;

  charges.forEach((charge) => {
    const distance = calculateDistance(x, y, charge.x, charge.y);

    // Çok yakın bir noktada ise sonsuz değerleri önle
    if (distance < 0.1) return;

    // Elektrik potansiyeli: V = k * q / r
    potential += (COULOMB_CONSTANT * charge.value) / distance;
  });

  return potential;
};
