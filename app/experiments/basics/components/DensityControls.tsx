import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { cn } from '../lib/utils';
import Slider from '@react-native-community/slider';

interface ObjectProps {
  id: number;
  density: number;
  color: string;
  position: number;
  size: number;
  shape: 'circle' | 'square' | 'triangle';
  label: string;
}

interface DensityControlsProps {
  liquidDensity: number;
  objects: ObjectProps[];
  onLiquidDensityChange: (value: number) => void;
  onObjectDensityChange: (id: number, value: number) => void;
}

// Hazır sıvı türleri ve yoğunlukları
const liquidPresets = [
  { name: 'Benzin', density: 750 },
  { name: 'Su', density: 1000 },
  { name: 'Deniz Suyu', density: 1025 },
  { name: 'Süt', density: 1030 },
  { name: 'Gliserin', density: 1260 },
  { name: 'Cıva', density: 13600 },
];

// Hazır malzeme türleri ve yoğunlukları
const materialPresets = [
  { name: 'Hava', density: 1.2 },
  { name: 'Köpük', density: 100 },
  { name: 'Mantar', density: 240 },
  { name: 'Buz', density: 920 },
  { name: 'Su', density: 1000 },
  { name: 'Ahşap', density: 700 },
  { name: 'Beton', density: 2400 },
  { name: 'Cam', density: 2500 },
  { name: 'Alüminyum', density: 2700 },
  { name: 'Demir', density: 7800 },
  { name: 'Bakır', density: 8960 },
  { name: 'Kurşun', density: 11300 },
  { name: 'Cıva', density: 13600 },
  { name: 'Altın', density: 19300 },
];

const DensityControls: React.FC<DensityControlsProps> = ({
  liquidDensity,
  objects,
  onLiquidDensityChange,
  onObjectDensityChange,
}) => {
  return (
    <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={{ padding: 16 }}
      showsVerticalScrollIndicator={false}
      bounces={false}
    >
      {/* Sıvı Yoğunluğu Kontrolleri */}
      <View style={{ marginBottom: 24 }}>
        <Text
          style={{
            fontSize: 18,
            fontWeight: '600',
            color: '#1e40af',
            marginBottom: 16,
          }}
        >
          Sıvı Yoğunluğu
        </Text>

        <View style={{ marginBottom: 16 }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginBottom: 8,
            }}
          >
            <Text style={{ fontSize: 14, color: '#64748b' }}>
              Yoğunluk: {liquidDensity} kg/m³
            </Text>
          </View>
          <Slider
            minimumValue={500}
            maximumValue={14000}
            step={25}
            value={liquidDensity}
            onValueChange={onLiquidDensityChange}
            minimumTrackTintColor="#3b82f6"
            maximumTrackTintColor="#e2e8f0"
            thumbTintColor="#3b82f6"
          />
        </View>

        <View
          style={{
            borderTopWidth: 1,
            borderTopColor: '#e2e8f0',
            paddingTop: 16,
          }}
        >
          <Text style={{ fontSize: 14, color: '#64748b', marginBottom: 8 }}>
            Hazır Sıvı Seçenekleri:
          </Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {liquidPresets.map((preset) => (
              <TouchableOpacity
                key={preset.name}
                onPress={() => onLiquidDensityChange(preset.density)}
                style={{
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                  borderRadius: 16,
                  backgroundColor:
                    liquidDensity === preset.density ? '#bfdbfe' : 'white',
                  borderWidth: 1,
                  borderColor: '#bfdbfe',
                }}
              >
                <Text
                  style={{
                    fontSize: 12,
                    color:
                      liquidDensity === preset.density ? '#1e40af' : '#64748b',
                    fontWeight:
                      liquidDensity === preset.density ? '600' : 'normal',
                  }}
                >
                  {preset.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>

      {/* Nesne Yoğunluğu Kontrolleri */}
      <View style={{ paddingBottom: 100 }}>
        <Text
          style={{
            fontSize: 18,
            fontWeight: '600',
            color: '#1e40af',
            marginBottom: 16,
          }}
        >
          Cisim Yoğunlukları
        </Text>

        <View style={{ gap: 24 }}>
          {objects.map((obj) => (
            <View key={obj.id} style={{ gap: 12 }}>
              <View
                style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}
              >
                <View
                  style={{
                    width: 12,
                    height: 12,
                    backgroundColor: obj.color,
                    borderRadius:
                      obj.shape === 'circle'
                        ? 6
                        : obj.shape === 'square'
                        ? 2
                        : 0,
                    transform: [
                      {
                        rotate: obj.shape === 'triangle' ? '180deg' : '0deg',
                      },
                    ],
                  }}
                />
                <Text
                  style={{ fontSize: 14, fontWeight: '500', color: obj.color }}
                >
                  Cisim {obj.id}
                </Text>
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginBottom: 4,
                }}
              >
                <Text style={{ fontSize: 14, color: '#64748b' }}>
                  Yoğunluk: {obj.density} kg/m³
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    color:
                      obj.density < liquidDensity
                        ? '#2563eb'
                        : obj.density > liquidDensity
                        ? '#dc2626'
                        : '#ca8a04',
                  }}
                >
                  {obj.density < liquidDensity
                    ? 'Yüzer'
                    : obj.density > liquidDensity
                    ? 'Batar'
                    : 'Askıda Kalır'}
                </Text>
              </View>

              <Slider
                minimumValue={10}
                maximumValue={20000}
                step={10}
                value={obj.density}
                onValueChange={(value) => onObjectDensityChange(obj.id, value)}
                minimumTrackTintColor="#3b82f6"
                maximumTrackTintColor="#e2e8f0"
                thumbTintColor="#3b82f6"
              />

              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 4 }}>
                {materialPresets.slice(0, 6).map((preset) => (
                  <TouchableOpacity
                    key={`${obj.id}-${preset.name}`}
                    onPress={() =>
                      onObjectDensityChange(obj.id, preset.density)
                    }
                    style={{
                      paddingHorizontal: 8,
                      paddingVertical: 4,
                      borderRadius: 12,
                      backgroundColor:
                        obj.density === preset.density ? '#f1f5f9' : 'white',
                      borderWidth: 1,
                      borderColor: '#e2e8f0',
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 12,
                        color:
                          obj.density === preset.density
                            ? '#0f172a'
                            : '#64748b',
                        fontWeight:
                          obj.density === preset.density ? '500' : 'normal',
                      }}
                    >
                      {preset.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {obj.id !== objects.length && (
                <View
                  style={{
                    height: 1,
                    backgroundColor: '#e2e8f0',
                    marginTop: 8,
                  }}
                />
              )}
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

export default DensityControls;
