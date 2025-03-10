import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Card } from '@/components/ui/card';
import { CustomSlider as Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { formatWithUnits } from '../utils/pressureCalculator';

interface SimulationControlsProps {
  fluidDensity: number;
  setFluidDensity: (value: number) => void;
  objectDensity: number;
  setObjectDensity: (value: number) => void;
  objectHeight: number;
  setObjectHeight: (value: number) => void;
  objectWidth: number;
  setObjectWidth: (value: number) => void;
  objectDepth: number;
  setObjectDepth: (value: number) => void;
  containerHeight: number;
  setContainerHeight: (value: number) => void;
  resetToDefaults: () => void;
}

const SimulationControls: React.FC<SimulationControlsProps> = ({
  fluidDensity,
  setFluidDensity,
  objectDensity,
  setObjectDensity,
  objectHeight,
  setObjectHeight,
  objectWidth,
  setObjectWidth,
  objectDepth,
  setObjectDepth,
  containerHeight,
  setContainerHeight,
  resetToDefaults,
}) => {
  return (
    <Card style={{ padding: 16, backgroundColor: 'white' }}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 16,
        }}
      >
        <Text style={{ fontSize: 16, fontWeight: '500' }}>
          Simülasyon Parametreleri
        </Text>
        <Button onPress={resetToDefaults} variant="outline" size="sm">
          Sıfırla
        </Button>
      </View>

      <View style={{ gap: 20 }}>
        {/* Nesne Yoğunluğu */}
        <View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginBottom: 8,
            }}
          >
            <Text style={{ fontSize: 12, color: '#666' }}>Nesne Yoğunluğu</Text>
            <Text style={{ fontSize: 12, fontWeight: '500' }}>
              {formatWithUnits(objectDensity, 'kg/m³')}
            </Text>
          </View>
          <Slider
            value={objectDensity}
            min={100}
            max={12000}
            step={50}
            onValueChange={setObjectDensity}
          />
        </View>

        {/* Nesne Boyutları */}
        <View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginBottom: 8,
            }}
          >
            <Text style={{ fontSize: 12, color: '#666' }}>
              Nesne Yüksekliği
            </Text>
            <Text style={{ fontSize: 12, fontWeight: '500' }}>
              {formatWithUnits(objectHeight, 'cm')}
            </Text>
          </View>
          <Slider
            value={objectHeight}
            min={10}
            max={100}
            step={1}
            onValueChange={setObjectHeight}
          />
        </View>

        <View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginBottom: 8,
            }}
          >
            <Text style={{ fontSize: 12, color: '#666' }}>Nesne Genişliği</Text>
            <Text style={{ fontSize: 12, fontWeight: '500' }}>
              {formatWithUnits(objectWidth, 'cm')}
            </Text>
          </View>
          <Slider
            value={objectWidth}
            min={20}
            max={150}
            step={5}
            onValueChange={setObjectWidth}
          />
        </View>

        <View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginBottom: 8,
            }}
          >
            <Text style={{ fontSize: 12, color: '#666' }}>Nesne Derinliği</Text>
            <Text style={{ fontSize: 12, fontWeight: '500' }}>
              {formatWithUnits(objectDepth, 'cm')}
            </Text>
          </View>
          <Slider
            value={objectDepth}
            min={5}
            max={50}
            step={1}
            onValueChange={setObjectDepth}
          />
        </View>

        {/* Sıvı Yoğunluğu */}
        <View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginBottom: 8,
            }}
          >
            <Text style={{ fontSize: 12, color: '#666' }}>Sıvı Yoğunluğu</Text>
            <Text style={{ fontSize: 12, fontWeight: '500' }}>
              {formatWithUnits(fluidDensity, 'kg/m³')}
            </Text>
          </View>
          <Slider
            value={fluidDensity}
            min={800}
            max={14000}
            step={50}
            onValueChange={setFluidDensity}
          />
        </View>

        {/* Hazır Sıvı Seçenekleri */}
        <View
          style={{ backgroundColor: '#f5f5f5', padding: 12, borderRadius: 8 }}
        >
          <Text style={{ fontSize: 14, fontWeight: '500', marginBottom: 8 }}>
            Hazır Sıvı Seçenekleri
          </Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            <TouchableOpacity
              style={{ backgroundColor: 'white', padding: 8, borderRadius: 6 }}
              onPress={() => setFluidDensity(1000)}
            >
              <Text style={{ fontSize: 12 }}>Tatlı Su</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ backgroundColor: 'white', padding: 8, borderRadius: 6 }}
              onPress={() => setFluidDensity(1025)}
            >
              <Text style={{ fontSize: 12 }}>Tuzlu Su</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ backgroundColor: 'white', padding: 8, borderRadius: 6 }}
              onPress={() => setFluidDensity(790)}
            >
              <Text style={{ fontSize: 12 }}>Alkol</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ backgroundColor: 'white', padding: 8, borderRadius: 6 }}
              onPress={() => setFluidDensity(13600)}
            >
              <Text style={{ fontSize: 12 }}>Cıva</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Card>
  );
};

export default SimulationControls;
