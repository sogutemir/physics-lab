import { useState, useCallback, useEffect, useRef } from 'react';
import { Dimensions } from 'react-native';
import {
  Charge,
  calculateElectricField,
  calculateForceOnCharge,
  calculateFieldLine,
  calculatePotentialEnergy,
  calculateTotalPotentialEnergy,
  calculateElectricPotential,
} from './fieldCalculations';

interface UseElectricFieldProps {
  width: number;
  height: number;
}

interface UseElectricFieldReturn {
  charges: Charge[];
  fieldVectors: {
    x: number;
    y: number;
    magnitude: number;
    direction: number;
  }[];
  fieldLines: { points: { x: number; y: number }[] }[];
  addCharge: (x: number, y: number, value: number, isFixed?: boolean) => void;
  removeCharge: (id: string) => void;
  moveCharge: (id: string, x: number, y: number) => void;
  updateCharge: (id: string, value: number) => void;
  clearCharges: () => void;
  isRunning: boolean;
  startSimulation: () => void;
  pauseSimulation: () => void;
  resetSimulation: () => void;
  chargeInteractions: {
    charge1Id: string;
    charge2Id: string;
    distance: number;
    potentialEnergy: number;
    isRepulsive: boolean;
  }[];
  totalPotentialEnergy: number;
  measurePoint: { x: number; y: number } | null;
  setMeasurePoint: (point: { x: number; y: number } | null) => void;
  potentialAtPoint: number | null;
}

export const useElectricField = ({
  width,
  height,
}: UseElectricFieldProps): UseElectricFieldReturn => {
  // Yük listesi
  const [charges, setCharges] = useState<Charge[]>([]);

  // Elektrik alan vektörleri
  const [fieldVectors, setFieldVectors] = useState<
    { x: number; y: number; magnitude: number; direction: number }[]
  >([]);

  // Elektrik alan çizgileri
  const [fieldLines, setFieldLines] = useState<
    { points: { x: number; y: number }[] }[]
  >([]);

  // Simulasyon durumu
  const [isRunning, setIsRunning] = useState<boolean>(false);

  // Animasyon frame ID
  const animationFrameId = useRef<number | null>(null);

  // Ölçüm noktası
  const [measurePoint, setMeasurePoint] = useState<{
    x: number;
    y: number;
  } | null>(null);

  // Ölçüm noktasındaki potansiyel
  const [potentialAtPoint, setPotentialAtPoint] = useState<number | null>(null);

  // Yükler arası etkileşimler
  const [chargeInteractions, setChargeInteractions] = useState<
    {
      charge1Id: string;
      charge2Id: string;
      distance: number;
      potentialEnergy: number;
      isRepulsive: boolean;
    }[]
  >([]);

  // Sistemin toplam potansiyel enerjisi
  const [totalPotentialEnergy, setTotalPotentialEnergy] = useState<number>(0);

  // Yeni bir yük ekle
  const addCharge = useCallback(
    (x: number, y: number, value: number, isFixed = false) => {
      const newCharge: Charge = {
        id: `charge-${Date.now()}-${Math.random()}`,
        x,
        y,
        value,
        isFixed,
        color: value > 0 ? '#e74c3c' : '#3498db', // Kırmızı: pozitif, Mavi: negatif
      };

      setCharges((prevCharges) => [...prevCharges, newCharge]);
    },
    []
  );

  // Bir yükü kaldır
  const removeCharge = useCallback((id: string) => {
    setCharges((prevCharges) =>
      prevCharges.filter((charge) => charge.id !== id)
    );
  }, []);

  // Bir yükü taşı
  const moveCharge = useCallback((id: string, x: number, y: number) => {
    setCharges((prevCharges) =>
      prevCharges.map((charge) =>
        charge.id === id ? { ...charge, x, y } : charge
      )
    );
  }, []);

  // Bir yükün değerini güncelle
  const updateCharge = useCallback((id: string, value: number) => {
    setCharges((prevCharges) =>
      prevCharges.map((charge) =>
        charge.id === id
          ? {
              ...charge,
              value,
              color: value > 0 ? '#e74c3c' : '#3498db',
            }
          : charge
      )
    );
  }, []);

  // Tüm yükleri temizle
  const clearCharges = useCallback(() => {
    setCharges([]);
  }, []);

  // Simülasyonu başlat
  const startSimulation = useCallback(() => {
    setIsRunning(true);
  }, []);

  // Simülasyonu durdur
  const pauseSimulation = useCallback(() => {
    setIsRunning(false);
    if (animationFrameId.current !== null) {
      cancelAnimationFrame(animationFrameId.current);
      animationFrameId.current = null;
    }
  }, []);

  // Simülasyonu sıfırla
  const resetSimulation = useCallback(() => {
    pauseSimulation();
    clearCharges();
  }, [pauseSimulation, clearCharges]);

  // Elektrik alan vektörlerini hesapla
  const calculateFieldVectors = useCallback(() => {
    if (charges.length === 0) {
      setFieldVectors([]);
      return;
    }

    const gridSize = Math.min(width, height) / 10;
    const vectors: {
      x: number;
      y: number;
      magnitude: number;
      direction: number;
    }[] = [];

    for (let i = gridSize / 2; i < width; i += gridSize) {
      for (let j = gridSize / 2; j < height; j += gridSize) {
        const field = calculateElectricField(i, j, charges);

        // Çok zayıf alanları gösterme
        if (field.magnitude > 0.2) {
          vectors.push({
            x: i,
            y: j,
            magnitude: field.magnitude,
            direction: field.direction,
          });
        }
      }
    }

    setFieldVectors(vectors);
  }, [charges, width, height]);

  // Elektrik alan çizgilerini hesapla
  const calculateFieldLines = useCallback(() => {
    if (charges.length === 0) {
      setFieldLines([]);
      return;
    }

    const lines: { points: { x: number; y: number }[] }[] = [];

    // Pozitif yüklerden başlayan çizgiler
    charges
      .filter((charge) => charge.value > 0)
      .forEach((charge) => {
        // Yükün etrafında 8 farklı yönde çizgi başlat
        for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / 4) {
          const startX = charge.x + 20 * Math.cos(angle);
          const startY = charge.y + 20 * Math.sin(angle);
          const line = calculateFieldLine(startX, startY, charges, 150, 5, 1);
          lines.push({ points: line });
        }
      });

    // Negatif yükler için de ayrı çizgiler eklenebilir
    charges
      .filter((charge) => charge.value < 0)
      .forEach((charge) => {
        for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / 4) {
          const startX = charge.x + 20 * Math.cos(angle);
          const startY = charge.y + 20 * Math.sin(angle);
          const line = calculateFieldLine(startX, startY, charges, 150, 5, -1);
          lines.push({ points: line });
        }
      });

    setFieldLines(lines);
  }, [charges]);

  // Etkileşimleri hesapla
  const calculateInteractions = useCallback(() => {
    if (charges.length < 2) {
      setChargeInteractions([]);
      setTotalPotentialEnergy(0);
      return;
    }

    const interactions = [];

    for (let i = 0; i < charges.length; i++) {
      for (let j = i + 1; j < charges.length; j++) {
        const charge1 = charges[i];
        const charge2 = charges[j];
        const distance = Math.sqrt(
          Math.pow(charge1.x - charge2.x, 2) +
            Math.pow(charge1.y - charge2.y, 2)
        );

        const energy = calculatePotentialEnergy(charge1, charge2);

        // Aynı işaretli yükler birbirini iter, zıt işaretli yükler çeker
        const isRepulsive =
          Math.sign(charge1.value) === Math.sign(charge2.value);

        interactions.push({
          charge1Id: charge1.id,
          charge2Id: charge2.id,
          distance,
          potentialEnergy: energy,
          isRepulsive,
        });
      }
    }

    setChargeInteractions(interactions);

    // Toplam potansiyel enerjiyi hesapla
    const totalEnergy = calculateTotalPotentialEnergy(charges);
    setTotalPotentialEnergy(totalEnergy);
  }, [charges]);

  // Yüklerin hareketi güncelleme fonksiyonu
  const updateChargesPosition = useCallback(() => {
    if (!isRunning) return;

    setCharges((prevCharges) => {
      return prevCharges.map((charge) => {
        if (charge.isFixed) return charge;

        // Diğer tüm yüklerin bu yük üzerindeki kuvvetini hesapla
        const { forceX, forceY } = calculateForceOnCharge(
          charge,
          prevCharges.filter((c) => c.id !== charge.id)
        );

        // Yük değerine bağlı olarak hareket faktörü (daha büyük yükler daha yavaş hareket eder)
        const moveFactor = 0.05 / Math.abs(charge.value);

        // Yeni pozisyon
        let newX = charge.x + forceX * moveFactor;
        let newY = charge.y + forceY * moveFactor;

        // Sınırları kontrol et
        newX = Math.max(20, Math.min(width - 20, newX));
        newY = Math.max(20, Math.min(height - 20, newY));

        return { ...charge, x: newX, y: newY };
      });
    });

    // Bir sonraki animasyon frame'i planlayın
    animationFrameId.current = requestAnimationFrame(updateChargesPosition);
  }, [isRunning, width, height]);

  // Ölçüm noktasındaki elektrik potansiyelini hesapla
  useEffect(() => {
    if (!measurePoint || charges.length === 0) {
      setPotentialAtPoint(null);
      return;
    }

    const potential = calculateElectricPotential(
      measurePoint.x,
      measurePoint.y,
      charges
    );

    setPotentialAtPoint(potential);
  }, [measurePoint, charges]);

  // Yükler değiştiğinde alan vektörlerini, çizgilerini ve etkileşimleri güncelle
  useEffect(() => {
    calculateFieldVectors();
    calculateFieldLines();
    calculateInteractions();
  }, [
    charges,
    calculateFieldVectors,
    calculateFieldLines,
    calculateInteractions,
  ]);

  // Simülasyon durumu değiştiğinde animasyonu güncelle
  useEffect(() => {
    if (isRunning) {
      animationFrameId.current = requestAnimationFrame(updateChargesPosition);
    } else if (animationFrameId.current !== null) {
      cancelAnimationFrame(animationFrameId.current);
      animationFrameId.current = null;
    }

    return () => {
      if (animationFrameId.current !== null) {
        cancelAnimationFrame(animationFrameId.current);
        animationFrameId.current = null;
      }
    };
  }, [isRunning, updateChargesPosition]);

  // Örnek yükler ekle (başlangıç için)
  useEffect(() => {
    // İlk yüklemelerde iki yük ekle
    addCharge(width * 0.3, height * 0.5, 1, true); // Pozitif yük
    addCharge(width * 0.7, height * 0.5, -1, true); // Negatif yük

    return () => {
      pauseSimulation();
    };
  }, []);

  return {
    charges,
    fieldVectors,
    fieldLines,
    addCharge,
    removeCharge,
    moveCharge,
    updateCharge,
    clearCharges,
    isRunning,
    startSimulation,
    pauseSimulation,
    resetSimulation,
    chargeInteractions,
    totalPotentialEnergy,
    measurePoint,
    setMeasurePoint,
    potentialAtPoint,
  };
};
