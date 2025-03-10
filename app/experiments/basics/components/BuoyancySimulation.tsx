import React, { useRef } from 'react';
import { View, Text } from 'react-native';
import { useIsMobile } from '../hooks/use-mobile';
import { cn } from '../lib/utils';

interface ObjectProps {
  id: number;
  density: number;
  color: string;
  position: number;
  size: number;
  shape: 'circle' | 'square' | 'triangle';
  label: string;
}

interface BuoyancySimulationProps {
  objects: ObjectProps[];
  liquidColor: string;
  liquidDensity: number;
}

const BuoyancySimulation: React.FC<BuoyancySimulationProps> = ({
  objects,
  liquidColor,
  liquidDensity,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  // Yoğunluk karşılaştırmasına göre animasyon sınıfını hesapla
  const getAnimationClass = (objectDensity: number) => {
    if (objectDensity < liquidDensity) return 'animate-float';
    if (objectDensity > liquidDensity) return 'animate-sink';
    return '';
  };

  // Şekil türüne göre şekli oluştur
  const renderShape = (shape: string, color: string, size: number) => {
    const baseSize = isMobile ? 40 : 60;
    const shapeSize = baseSize * size;

    const commonStyles = {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
      transform: [{ scale: 1 }],
    };

    switch (shape) {
      case 'circle':
        return (
          <View
            style={{
              width: shapeSize,
              height: shapeSize,
              borderRadius: shapeSize / 2,
              backgroundColor: color,
              ...commonStyles,
            }}
          />
        );
      case 'square':
        return (
          <View
            style={{
              width: shapeSize,
              height: shapeSize,
              borderRadius: 8,
              backgroundColor: color,
              ...commonStyles,
            }}
          />
        );
      case 'triangle':
        return (
          <View
            style={{
              width: 0,
              height: 0,
              borderLeftWidth: shapeSize / 2,
              borderRightWidth: shapeSize / 2,
              borderBottomWidth: shapeSize,
              borderLeftColor: 'transparent',
              borderRightColor: 'transparent',
              borderBottomColor: color,
              ...commonStyles,
            }}
          />
        );
      default:
        return null;
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <View
        style={{
          flex: 1,
          backgroundColor: '#f0f9ff',
          borderRadius: 12,
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        {/* Sıvı konteyneri */}
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: liquidColor,
          }}
        >
          {/* Sıvı dalgaları */}
          <View className="liquid-wave" style={{ top: '0%' }} />
          <View className="liquid-wave" style={{ top: '10%' }} />
          <View className="liquid-wave" style={{ top: '20%' }} />
        </View>

        {/* Nesneler */}
        {objects.map((obj) => (
          <View
            key={obj.id}
            style={{
              position: 'absolute',
              left: `${20 + (obj.id - 1) * 30}%`,
              bottom: `${obj.position}%`,
              alignItems: 'center',
              zIndex: 10,
              transform: [
                {
                  translateY:
                    obj.density < liquidDensity
                      ? -20
                      : obj.density > liquidDensity
                      ? 20
                      : 0,
                },
              ],
            }}
            className={cn('object', getAnimationClass(obj.density))}
          >
            {renderShape(obj.shape, obj.color, obj.size)}
            <View
              style={{
                marginTop: 8,
                paddingHorizontal: 8,
                paddingVertical: 4,
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                borderRadius: 6,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.2,
                shadowRadius: 1.41,
                elevation: 2,
                backdropFilter: 'blur(4px)',
              }}
            >
              <Text
                style={{ fontSize: 12, color: '#1a1a1a', fontWeight: '500' }}
              >
                {obj.label}
              </Text>
            </View>
          </View>
        ))}

        {/* Su yüzeyi göstergesi */}
        <View
          style={{
            position: 'absolute',
            top: '70%',
            left: 0,
            right: 0,
            height: 2,
            backgroundColor: 'rgba(255, 255, 255, 0.5)',
            boxShadow: '0 0 10px rgba(255, 255, 255, 0.5)',
          }}
        />

        {/* Sıvı yoğunluğu göstergesi */}
        <View
          style={{
            position: 'absolute',
            top: 16,
            left: 16,
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            borderRadius: 8,
            paddingHorizontal: 12,
            paddingVertical: 4,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.2,
            shadowRadius: 1.41,
            elevation: 2,
            backdropFilter: 'blur(4px)',
          }}
        >
          <Text style={{ fontSize: 14, color: '#1a1a1a', fontWeight: '500' }}>
            Sıvı: {liquidDensity} kg/m³
          </Text>
        </View>
      </View>
    </View>
  );
};

export default BuoyancySimulation;
