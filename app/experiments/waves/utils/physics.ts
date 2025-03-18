import { Dimensions } from 'react-native';

// Sabitler
export const SPEED_OF_LIGHT = 299792458; // m/s

// Dalga boyunu nanometreden frekansa dönüştürme
export const wavelengthToFrequency = (wavelength: number): number => {
  return SPEED_OF_LIGHT / (wavelength * 1e-9);
};

/**
 * Dalga boyundan RGB renk değerine dönüştürme
 * @param wavelength Dalga boyu (nm)
 * @returns RGB renk değeri
 */
export function wavelengthToRGB(wavelength: number): string {
  let r = 0,
    g = 0,
    b = 0;

  if (wavelength >= 380 && wavelength < 440) {
    r = (-1 * (wavelength - 440)) / (440 - 380);
    g = 0;
    b = 1;
  } else if (wavelength >= 440 && wavelength < 490) {
    r = 0;
    g = (wavelength - 440) / (490 - 440);
    b = 1;
  } else if (wavelength >= 490 && wavelength < 510) {
    r = 0;
    g = 1;
    b = (-1 * (wavelength - 510)) / (510 - 490);
  } else if (wavelength >= 510 && wavelength < 580) {
    r = (wavelength - 510) / (580 - 510);
    g = 1;
    b = 0;
  } else if (wavelength >= 580 && wavelength < 645) {
    r = 1;
    g = (-1 * (wavelength - 645)) / (645 - 580);
    b = 0;
  } else if (wavelength >= 645 && wavelength <= 780) {
    r = 1;
    g = 0;
    b = 0;
  }

  // Uç noktaları için yoğunluk düzeltmeleri
  let intensity = 1;
  if (wavelength >= 380 && wavelength < 420) {
    intensity = 0.3 + (0.7 * (wavelength - 380)) / (420 - 380);
  } else if (wavelength >= 645 && wavelength <= 780) {
    intensity = 0.3 + (0.7 * (780 - wavelength)) / (780 - 645);
  }

  r = Math.round(Math.min(255, Math.max(0, r * 255 * intensity)));
  g = Math.round(Math.min(255, Math.max(0, g * 255 * intensity)));
  b = Math.round(Math.min(255, Math.max(0, b * 255 * intensity)));

  return `rgb(${r}, ${g}, ${b})`;
}

// Young'ın çift yarık formülü kullanarak ekrandaki bir noktanın yoğunluğunu hesaplama
export const calculateIntensity = (
  x: number, // Ekrandaki pozisyon (merkeze göre)
  wavelength: number, // nm cinsinden
  slitSeparation: number, // mm cinsinden
  slitWidth: number, // mm cinsinden
  distanceToScreen: number // mm cinsinden
): number => {
  // Hesaplamalar için metreye çevirme
  const d = slitSeparation * 1e-3; // yarık ayrımı (metre)
  const a = slitWidth * 1e-3; // yarık genişliği (metre)
  const L = distanceToScreen * 1e-3; // ekrana olan mesafe (metre)
  const lambda = wavelength * 1e-9; // dalga boyu (metre)
  const xm = x * 1e-3; // ekrandaki pozisyon (metre)

  // Tek yarık kırınımı faktörü (sinc fonksiyonu)
  const beta = (Math.PI * a * xm) / (lambda * L);
  const singleSlitFactor = beta === 0 ? 1 : Math.sin(beta) / beta;

  // Çift yarık girişim faktörü
  const alpha = (Math.PI * d * xm) / (lambda * L);
  const doubleSlitFactor = Math.cos(alpha) ** 2;

  // Birleşik yoğunluk (normalleştirilmiş)
  const intensity = singleSlitFactor ** 2 * doubleSlitFactor;

  // 0 ile 1 arasında değer döndür
  return Math.max(0, Math.min(1, intensity));
};

/**
 * Ekran için girişim deseni oluşturma
 * @param screenHeight Ekran yüksekliği (piksel)
 * @param numPoints Nokta sayısı
 * @param wavelength Dalga boyu (nm)
 * @param slitSeparation Yarık ayrımı (mm)
 * @param slitWidth Yarık genişliği (mm)
 * @param distanceToScreen Ekrana uzaklık (mm)
 * @returns Yoğunluk değerleri dizisi (0-1 arası)
 */
export function generateInterferencePattern(
  screenHeight: number,
  numPoints: number,
  wavelength: number,
  slitSeparation: number,
  slitWidth: number,
  distanceToScreen: number
): number[] {
  // Dalga boyunu mm'ye çevirme (nm -> mm)
  const wavelengthMm = wavelength / 1000000;

  // Girişim periyodu (mm)
  const period = calculatePeriod(wavelength, slitSeparation, distanceToScreen);

  // Ekran merkezinden yarıçap (mm)
  const screenHeightMm = screenHeight / 10; // Ölçek: 10 piksel = 1 mm
  const points: number[] = [];

  // Merkezdeki ana maksimum
  const centralMaxPos = screenHeightMm / 2;

  // Her nokta için yoğunluk hesaplama
  for (let i = 0; i < numPoints; i++) {
    // Noktanın ekran merkezinden uzaklığı
    const y = (i / (numPoints - 1)) * screenHeightMm;
    const distFromCenter = Math.abs(y - centralMaxPos);

    // Çift yarık için girişim denklemi
    // Yol farkı (yolFarki) = d * sin(θ), burada sin(θ) ≈ y / D (küçük açılar için)
    const pathDiff = slitSeparation * (distFromCenter / distanceToScreen);

    // Faz farkı = 2π * yolFarki / λ
    const phaseDiff = (2 * Math.PI * pathDiff) / wavelengthMm;

    // Young çift yarık deneyindeki yoğunluk formülü
    // I = I₀ * (cos(α))² burada α = phaseDiff/2
    // Ayrıca, tek yarık difraksiyon etkisini de hesaba katabiliriz
    const singleSlitFactor =
      slitWidth > 0
        ? Math.pow(
            Math.sin(
              (Math.PI *
                slitWidth *
                Math.sin(distFromCenter / distanceToScreen)) /
                wavelengthMm
            ) /
              ((Math.PI *
                slitWidth *
                Math.sin(distFromCenter / distanceToScreen)) /
                wavelengthMm),
            2
          )
        : 1;

    const intensity = Math.pow(Math.cos(phaseDiff / 2), 2) * singleSlitFactor;

    // Periyodikliği vurgulamak için modülasyon ekleme
    const modulatedIntensity = Math.min(
      0.9,
      intensity * (1 - 0.3 * Math.sin(distFromCenter / (period / 4)))
    );

    points.push(modulatedIntensity);
  }

  return points;
}

/**
 * Girişim deseninin periyodunu hesaplama
 * @param wavelength Dalga boyu (nm)
 * @param slitSeparation Yarık ayrımı (mm)
 * @param distanceToScreen Ekrana uzaklık (mm)
 * @returns Periyot (mm)
 */
export function calculatePeriod(
  wavelength: number,
  slitSeparation: number,
  distanceToScreen: number
): number {
  // Dalga boyunu mm'ye çevirme (nm -> mm)
  const wavelengthMm = wavelength / 1000000;

  // Periyot hesaplama formülü: P = (λ * D) / d
  // λ: dalga boyu, D: ekrana uzaklık, d: yarık ayrımı
  return (wavelengthMm * distanceToScreen) / slitSeparation;
}

// İki yarık arasında yol farkını hesaplama
export const calculatePathDifference = (
  x: number, // ekrandaki pozisyon (mm cinsinden)
  slitSeparation: number, // mm cinsinden
  distanceToScreen: number // mm cinsinden
): number => {
  // d * sin(theta) formülü, küçük açılar için sin(theta) ≈ x/L yaklaşımı
  return (slitSeparation * x) / distanceToScreen;
};

/**
 * Ekran layout parametrelerini al
 */
export function getScreenLayoutParams() {
  const { width } = Dimensions.get('window');

  return {
    sourceX: width * 0.15,
    barrierX: width * 0.5,
    screenX: width * 0.85,
  };
}
