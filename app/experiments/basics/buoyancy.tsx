import { useState, useEffect } from 'react';
import ExperimentLayout from '../../../components/ExperimentLayout';
import BuoyancySimulation from './components/BuoyancySimulation';
import DensityControls from './components/DensityControls';
import { View } from 'react-native';
import './styles/buoyancy.css';

// Su yoğunluğu 1000 kg/m³
const WATER_DENSITY = 1000;

interface ObjectState {
  id: number;
  density: number;
  color: string;
  position: number;
  size: number;
  shape: 'circle' | 'square' | 'triangle';
  label: string;
}

export default function BuoyancyExperiment() {
  const [isRunning, setIsRunning] = useState(false);
  const [liquidDensity, setLiquidDensity] = useState(WATER_DENSITY);
  const [liquidColor, setLiquidColor] = useState('rgba(173, 216, 230, 0.8)');
  const [objects, setObjects] = useState<ObjectState[]>([
    {
      id: 1,
      density: 900,
      color: '#FF6B6B',
      position: 0,
      size: 0.8,
      shape: 'circle',
      label: 'Mantar (900 kg/m³)',
    },
    {
      id: 2,
      density: 1000,
      color: '#4ECDC4',
      position: 0,
      size: 1,
      shape: 'square',
      label: 'Tahta (1000 kg/m³)',
    },
    {
      id: 3,
      density: 7800,
      color: '#45B7D1',
      position: 0,
      size: 0.6,
      shape: 'triangle',
      label: 'Demir (7800 kg/m³)',
    },
  ]);

  // Nesne pozisyonlarını yoğunluk karşılaştırmasına göre güncelle
  useEffect(() => {
    if (!isRunning) return;

    const calculatePositions = () => {
      const updatedObjects = objects.map((obj) => {
        const newObj = { ...obj };
        if (obj.density < liquidDensity) {
          newObj.position = 80; // Yüzer
        } else if (obj.density > liquidDensity) {
          newObj.position = 20; // Batar
        } else {
          newObj.position = 50; // Askıda kalır
        }
        return newObj;
      });

      setObjects(updatedObjects);
    };

    const timer = setTimeout(calculatePositions, 100);
    return () => clearTimeout(timer);
  }, [liquidDensity, objects, isRunning]);

  // Sıvı yoğunluğu değişikliğini işle
  const handleLiquidDensityChange = (value: number) => {
    setLiquidDensity(value);
    const opacity = Math.min(0.2 + (value / 5000) * 0.8, 0.9);
    const blue = Math.max(255 - (value / 5000) * 80, 175);
    setLiquidColor(`rgba(173, 216, ${blue}, ${opacity})`);
  };

  // Nesne yoğunluğu değişikliğini işle
  const handleObjectDensityChange = (id: number, value: number) => {
    setObjects((prev) =>
      prev.map((obj) =>
        obj.id === id
          ? {
              ...obj,
              density: value,
              label: `${getLabelByDensity(value)} (${value} kg/m³)`,
            }
          : obj
      )
    );
  };

  // Yoğunluğa göre etiket al
  const getLabelByDensity = (density: number): string => {
    if (density < 300) return 'Köpük';
    if (density < 700) return 'Mantar';
    if (density < 1000) return 'Tahta';
    if (density < 2000) return 'Kum';
    if (density < 3000) return 'Beton';
    if (density < 5000) return 'Cam';
    if (density < 8000) return 'Demir';
    if (density < 12000) return 'Kurşun';
    return 'Altın';
  };

  // Simülasyonu sıfırla
  const handleReset = () => {
    setIsRunning(false);
    setLiquidDensity(WATER_DENSITY);
    setObjects((prev) => prev.map((obj) => ({ ...obj, position: 0 })));
  };

  return (
    <ExperimentLayout
      title="Kaldırma Kuvveti Deneyi"
      titleEn="Buoyancy Experiment"
      difficulty="Başlangıç"
      difficultyEn="Beginner"
      description="Bu deneyde, Arşimet prensibini ve kaldırma kuvvetini gözlemleyeceğiz. Farklı yoğunluktaki cisimlerin sıvı içerisindeki davranışlarını inceleyeceğiz."
      descriptionEn="In this experiment, we will observe Archimedes' principle and buoyant force. We will examine the behavior of objects with different densities in a liquid."
      isRunning={isRunning}
      onToggleSimulation={() => setIsRunning(!isRunning)}
      onReset={handleReset}
    >
      <View style={{ flex: 1, backgroundColor: '#F8FAFC' }}>
        <View style={{ flex: 1, padding: 16, gap: 16 }}>
          <View
            style={{
              flex: 2,
              backgroundColor: 'white',
              borderRadius: 12,
              overflow: 'hidden',
              elevation: 2,
            }}
          >
            <BuoyancySimulation
              objects={objects}
              liquidColor={liquidColor}
              liquidDensity={liquidDensity}
            />
          </View>
          <View
            style={{
              flex: 1,
              backgroundColor: 'white',
              borderRadius: 12,
              overflow: 'hidden',
              elevation: 2,
            }}
          >
            <DensityControls
              liquidDensity={liquidDensity}
              objects={objects}
              onLiquidDensityChange={handleLiquidDensityChange}
              onObjectDensityChange={handleObjectDensityChange}
            />
          </View>
        </View>
      </View>
    </ExperimentLayout>
  );
}
