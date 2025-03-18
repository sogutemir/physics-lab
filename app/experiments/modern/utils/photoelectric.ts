// Fiziksel sabitler
export const PLANCK_CONSTANT = 6.626e-34; // Planck sabiti (J·s)
export const ELECTRON_CHARGE = 1.602e-19; // Elektron yükü (C)
export const SPEED_OF_LIGHT = 3.0e8; // Işık hızı (m/s)

// Farklı metaller için iş fonksiyonları (eV cinsinden)
export const WORK_FUNCTIONS = {
  potassium: 2.3, // Potasyum
  sodium: 2.75, // Sodyum
  copper: 4.7, // Bakır
  zinc: 4.3, // Çinko
};

// Metal türlerinin Türkçe karşılıkları
export const METAL_NAMES_TR = {
  potassium: 'Potasyum',
  sodium: 'Sodyum',
  copper: 'Bakır',
  zinc: 'Çinko',
};

// Metal türlerinin İngilizce karşılıkları
export const METAL_NAMES_EN = {
  potassium: 'Potassium',
  sodium: 'Sodium',
  copper: 'Copper',
  zinc: 'Zinc',
};

export type MetalType = keyof typeof WORK_FUNCTIONS;

/**
 * Frekans değerini dalga boyu değerine dönüştürür
 * @param frequency Frekans (Hz)
 * @returns Dalga boyu (nm)
 */
export const frequencyToWavelength = (frequency: number): number => {
  return (SPEED_OF_LIGHT / frequency) * 1e9; // nm cinsinden
};

/**
 * Dalga boyu değerini frekans değerine dönüştürür
 * @param wavelength Dalga boyu (nm)
 * @returns Frekans (Hz)
 */
export const wavelengthToFrequency = (wavelength: number): number => {
  return SPEED_OF_LIGHT / (wavelength * 1e-9);
};

/**
 * Dalga boyunu görünür renk spektrumunda bir RGB değerine dönüştürür
 * @param wavelength Dalga boyu (nm)
 * @returns RGB renk kodu
 */
export const wavelengthToColor = (wavelength: number): string => {
  // Görünür spektrum dışındaki dalga boyları için varsayılan renkler
  if (wavelength < 380) return '#8F00FF'; // Mor ötesi
  if (wavelength > 780) return '#FF0000'; // Kızıl ötesi

  let r = 0,
    g = 0,
    b = 0;

  if (wavelength >= 380 && wavelength < 440) {
    r = ((wavelength - 380) / 60) * 255;
    g = 0;
    b = 255;
  } else if (wavelength >= 440 && wavelength < 490) {
    r = 0;
    g = ((wavelength - 440) / 50) * 255;
    b = 255;
  } else if (wavelength >= 490 && wavelength < 510) {
    r = 0;
    g = 255;
    b = 255 - ((wavelength - 490) / 20) * 255;
  } else if (wavelength >= 510 && wavelength < 580) {
    r = ((wavelength - 510) / 70) * 255;
    g = 255;
    b = 0;
  } else if (wavelength >= 580 && wavelength < 645) {
    r = 255;
    g = 255 - ((wavelength - 580) / 65) * 255;
    b = 0;
  } else {
    r = 255;
    g = 0;
    b = 0;
  }

  // RGB değerlerini 0-255 aralığına sınırla ve hex koduna dönüştür
  r = Math.floor(Math.max(0, Math.min(255, r)));
  g = Math.floor(Math.max(0, Math.min(255, g)));
  b = Math.floor(Math.max(0, Math.min(255, b)));

  return `rgb(${r}, ${g}, ${b})`;
};

/**
 * Işık frekansına, metal türüne ve durdurucu potansiyele göre elektron kinetik enerjisini hesaplar
 * @param frequency Işık frekansı (Hz)
 * @param metalType Metal türü
 * @param stoppingVoltage Durdurucu potansiyel (V)
 * @returns Elektron kinetik enerjisi (eV)
 */
export const calculateKineticEnergy = (
  frequency: number,
  metalType: MetalType,
  stoppingVoltage: number = 0
): number => {
  // E = hf - Φ - eV₀
  const workFunction = WORK_FUNCTIONS[metalType];
  const photonEnergy = (PLANCK_CONSTANT * frequency) / ELECTRON_CHARGE; // eV cinsinden
  const kineticEnergy = photonEnergy - workFunction - stoppingVoltage;

  return Math.max(0, kineticEnergy); // Negatif değerler için 0 döndür
};

/**
 * Eşik frekansını hesaplar (elektron koparmak için gereken minimum frekans)
 * @param metalType Metal türü
 * @returns Eşik frekansı (Hz)
 */
export const calculateThresholdFrequency = (metalType: MetalType): number => {
  // f₀ = Φ / h
  const workFunction = WORK_FUNCTIONS[metalType];
  return (workFunction * ELECTRON_CHARGE) / PLANCK_CONSTANT;
};

/**
 * Verilen parametrelere göre elektron akımını hesaplar
 * @param frequency Işık frekansı (Hz)
 * @param intensity Işık şiddeti (keyfi birim, 0-100 arası)
 * @param metalType Metal türü
 * @param stoppingVoltage Durdurucu potansiyel (V)
 * @param temperature Sıcaklık (Kelvin) - opsiyonel
 * @returns Elektron akımı (keyfi birim)
 */
export const calculateCurrent = (
  frequency: number,
  intensity: number,
  metalType: MetalType,
  stoppingVoltage: number,
  temperature: number = 300
): number => {
  // Eşik frekansını kontrol et
  const thresholdFrequency = calculateThresholdFrequency(metalType);
  if (frequency < thresholdFrequency) return 0;

  // Kinetik enerjiyi hesapla
  const kineticEnergy = calculateKineticEnergy(
    frequency,
    metalType,
    stoppingVoltage
  );
  if (kineticEnergy <= 0) return 0;

  // Sıcaklık etkisi (termal etki)
  const temperatureFactor = 1 + (temperature - 300) / 1000;

  // Akım hesabı: I ∝ Işık şiddeti * Kinetik enerji * Sıcaklık faktörü
  return intensity * Math.sqrt(kineticEnergy) * temperatureFactor;
};

/**
 * I-V eğrisi için veri noktaları oluşturur
 * @param frequency Işık frekansı (Hz)
 * @param intensity Işık şiddeti
 * @param metalType Metal türü
 * @param maxVoltage Maksimum gerilim değeri
 * @param pointCount Veri noktası sayısı
 * @returns I-V eğrisi veri noktaları
 */
export const generateIVCurveData = (
  frequency: number,
  intensity: number,
  metalType: MetalType,
  temperature: number = 300,
  maxVoltage: number = 5,
  pointCount: number = 100
) => {
  const data = [];
  const voltageStep = maxVoltage / pointCount;

  for (let i = 0; i <= pointCount; i++) {
    const voltage = i * voltageStep;
    const current = calculateCurrent(
      frequency,
      intensity,
      metalType,
      voltage,
      temperature
    );
    data.push({
      voltage,
      current,
    });
  }

  return data;
};

/**
 * E-f eğrisi için veri noktaları oluşturur (maksimum kinetik enerji vs frekans)
 * @param minFrequency Minimum frekans (Hz)
 * @param maxFrequency Maksimum frekans (Hz)
 * @param metalType Metal türü
 * @param pointCount Veri noktası sayısı
 * @returns E-f eğrisi veri noktaları
 */
export const generateEnergyFrequencyData = (
  minFrequency: number,
  maxFrequency: number,
  metalType: MetalType,
  pointCount: number = 100
) => {
  const data = [];
  const frequencyStep = (maxFrequency - minFrequency) / pointCount;

  for (let i = 0; i <= pointCount; i++) {
    const frequency = minFrequency + i * frequencyStep;
    const kineticEnergy = calculateKineticEnergy(frequency, metalType);
    data.push({
      frequency,
      kineticEnergy,
    });
  }

  return data;
};
