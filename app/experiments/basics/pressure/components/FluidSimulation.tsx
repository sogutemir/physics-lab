import React, { useEffect, useState } from 'react';
import { View, Text, Dimensions } from 'react-native';
import { Card } from '@/components/ui/card';
import {
  calculatePressure,
  calculateBuoyantForce,
  determineFloatStatus,
  calculateSubmergedPercentage,
  formatPressure,
  formatWithUnits,
} from '../utils/pressureCalculator';
import Animated, {
  useAnimatedStyle,
  withSpring,
  withRepeat,
} from 'react-native-reanimated';

interface FluidSimulationProps {
  fluidDensity: number;
  objectDensity: number;
  objectHeight: number;
  objectWidth: number;
  objectDepth: number;
  containerHeight: number;
}

const FluidSimulation: React.FC<FluidSimulationProps> = ({
  fluidDensity,
  objectDensity,
  objectHeight,
  objectWidth,
  objectDepth,
  containerHeight,
}) => {
  const [pressurePoints, setPressurePoints] = useState<
    Array<{ depth: number; pressure: number }>
  >([]);
  const screenWidth = Dimensions.get('window').width;

  const objectVolume = (objectWidth * objectHeight * objectDepth) / 1000000; // cm³ to m³
  const objectMass = objectDensity * objectVolume;
  const objectWeight = objectMass * 9.81; // N
  const buoyantForce = calculateBuoyantForce(fluidDensity, objectVolume);
  const floatStatus = determineFloatStatus(objectDensity, fluidDensity);
  const submergedPercentage = calculateSubmergedPercentage(
    objectDensity,
    fluidDensity
  );

  // Basınç noktalarını hesapla
  useEffect(() => {
    const points = [];
    const step = containerHeight / 10;

    for (let depth = 0; depth <= containerHeight; depth += step) {
      const pressure = calculatePressure(fluidDensity, depth / 100); // cm to m
      points.push({ depth, pressure });
    }

    setPressurePoints(points);
  }, [fluidDensity, containerHeight]);

  // Nesnenin konumunu hesapla
  const calculateObjectPosition = () => {
    if (floatStatus === 'float') {
      const submergedHeight = (submergedPercentage / 100) * objectHeight;
      return containerHeight - submergedHeight;
    } else if (floatStatus === 'neutral') {
      return (containerHeight - objectHeight) / 2;
    } else {
      return containerHeight - objectHeight;
    }
  };

  const objectPositionY = calculateObjectPosition();

  // Animasyon stilleri
  const waveAnimation = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: withRepeat(
            withSpring(10, { damping: 5, stiffness: 40 }),
            -1,
            true
          ),
        },
      ],
    };
  });

  const floatAnimation = useAnimatedStyle(() => {
    if (floatStatus === 'float') {
      return {
        transform: [
          {
            translateY: withRepeat(
              withSpring(-10, { damping: 10, stiffness: 40 }),
              -1,
              true
            ),
          },
        ],
      };
    }
    return {};
  });

  return (
    <Card style={{ overflow: 'hidden', padding: 16, backgroundColor: 'white' }}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginBottom: 16,
        }}
      >
        <Text style={{ fontSize: 16, fontWeight: '500' }}>
          Sıvı Basıncı Simülasyonu
        </Text>
        <View style={{ alignItems: 'flex-end' }}>
          <Text style={{ fontSize: 14, color: '#666' }}>
            Sıvı Yoğunluğu: {formatWithUnits(fluidDensity, 'kg/m³')}
          </Text>
          <Text style={{ fontSize: 14, color: '#666' }}>
            Cisim Yoğunluğu: {formatWithUnits(objectDensity, 'kg/m³')}
          </Text>
        </View>
      </View>

      <View
        style={{
          height: containerHeight,
          width: screenWidth - 64,
          backgroundColor: '#f0f9ff',
          borderRadius: 12,
          overflow: 'hidden',
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
            backgroundColor: '#61dafb',
          }}
        >
          {/* Sıvı dalgaları */}
          <Animated.View
            style={[
              {
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: 2,
                backgroundColor: 'rgba(255,255,255,0.3)',
              },
              waveAnimation,
            ]}
          />
          <Animated.View
            style={[
              {
                position: 'absolute',
                top: 10,
                left: 0,
                right: 0,
                height: 2,
                backgroundColor: 'rgba(255,255,255,0.2)',
              },
              waveAnimation,
            ]}
          />
        </View>

        {/* Nesne */}
        <Animated.View
          style={[
            {
              position: 'absolute',
              left: '50%',
              transform: [{ translateX: -objectWidth / 2 }],
              top: objectPositionY,
              width: objectWidth,
              height: objectHeight,
              backgroundColor: floatStatus === 'sink' ? '#d0d0d0' : '#f0f0f0',
              borderRadius: 8,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
              elevation: 5,
            },
            floatAnimation,
          ]}
        />

        {/* Basınç göstergeleri */}
        <View
          style={{
            position: 'absolute',
            right: 0,
            top: 0,
            bottom: 0,
            width: 20,
            justifyContent: 'space-between',
          }}
        >
          {pressurePoints.map((point, index) => (
            <View
              key={index}
              style={{ position: 'absolute', right: 0, top: point.depth }}
            >
              <View
                style={{
                  width: 8,
                  height: 1,
                  backgroundColor: 'rgba(0,0,0,0.3)',
                }}
              />
              {index % 2 === 0 && (
                <Text
                  style={{
                    position: 'absolute',
                    right: 12,
                    fontSize: 10,
                    color: 'rgba(0,0,0,0.5)',
                  }}
                >
                  {(containerHeight - point.depth).toFixed(0)}
                </Text>
              )}
            </View>
          ))}
        </View>
      </View>

      {/* Etki eden kuvvetler ve basınç bilgileri */}
      <View
        style={{
          marginTop: 16,
          padding: 12,
          backgroundColor: '#f8fafc',
          borderRadius: 8,
        }}
      >
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontSize: 14,
                fontWeight: '500',
                color: '#1e40af',
                marginBottom: 8,
              }}
            >
              Kuvvetler
            </Text>
            <Text style={{ fontSize: 12, color: '#64748b' }}>
              Ağırlık: {formatWithUnits(objectWeight, 'N')}
            </Text>
            <Text style={{ fontSize: 12, color: '#64748b' }}>
              Kaldırma Kuvveti: {formatWithUnits(buoyantForce, 'N')}
            </Text>
            <Text style={{ fontSize: 12, color: '#64748b' }}>
              Net Kuvvet: {formatWithUnits(objectWeight - buoyantForce, 'N')}
            </Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontSize: 14,
                fontWeight: '500',
                color: '#1e40af',
                marginBottom: 8,
              }}
            >
              Basınç Değerleri
            </Text>
            <Text style={{ fontSize: 12, color: '#64748b' }}>
              Yüzeyde: {formatPressure(calculatePressure(fluidDensity, 0))}
            </Text>
            <Text style={{ fontSize: 12, color: '#64748b' }}>
              Dipte:{' '}
              {formatPressure(
                calculatePressure(fluidDensity, containerHeight / 100)
              )}
            </Text>
            <Text style={{ fontSize: 12, color: '#64748b' }}>
              Cisim Seviyesinde:{' '}
              {formatPressure(
                calculatePressure(fluidDensity, objectPositionY / 100)
              )}
            </Text>
          </View>
        </View>
        <View
          style={{
            marginTop: 8,
            paddingTop: 8,
            borderTopWidth: 1,
            borderTopColor: '#e2e8f0',
          }}
        >
          <Text style={{ fontSize: 12, color: '#64748b', textAlign: 'center' }}>
            Durum:{' '}
            {floatStatus === 'float'
              ? 'Cisim Yüzüyor'
              : floatStatus === 'sink'
              ? 'Cisim Batıyor'
              : 'Cisim Askıda'}
            {floatStatus === 'float' &&
              ` (${submergedPercentage.toFixed(1)}% batık)`}
          </Text>
        </View>
      </View>
    </Card>
  );
};

export default FluidSimulation;
