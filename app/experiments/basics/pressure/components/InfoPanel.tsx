import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Card } from '@/components/ui/card';

const InfoPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    'pressure' | 'buoyancy' | 'formulas'
  >('pressure');

  const renderContent = () => {
    switch (activeTab) {
      case 'pressure':
        return (
          <View style={{ gap: 16 }}>
            <Text style={{ fontSize: 14 }}>
              Sıvı basıncı, bir sıvının içine batırılmış bir nesneye, sıvının
              ağırlığından dolayı uyguladığı kuvvettir.
            </Text>

            <View style={{ gap: 8 }}>
              <Text style={{ fontSize: 14, fontWeight: '500' }}>
                Temel İlkeler:
              </Text>
              <View style={{ paddingLeft: 16 }}>
                <Text style={{ fontSize: 14 }}>• Basınç derinlikle artar</Text>
                <Text style={{ fontSize: 14 }}>
                  • Basınç her yönde eşit etkir
                </Text>
                <Text style={{ fontSize: 14 }}>
                  • Basınç sıvı yoğunluğuna bağlıdır
                </Text>
                <Text style={{ fontSize: 14 }}>
                  • Basınç kabın şeklinden bağımsızdır
                </Text>
              </View>
            </View>

            <View>
              <Text
                style={{ fontSize: 14, fontWeight: '500', marginBottom: 8 }}
              >
                Uygulamalar:
              </Text>
              <Text style={{ fontSize: 12, color: '#666' }}>
                Sıvı basıncını anlamak; barajların, denizaltıların, dalış
                ekipmanlarının, hidrolik sistemlerin tasarımında ve hatta insan
                vücudundaki kan basıncını anlamada çok önemlidir.
              </Text>
            </View>
          </View>
        );

      case 'buoyancy':
        return (
          <View style={{ gap: 16 }}>
            <Text style={{ fontSize: 14 }}>
              Kaldırma kuvveti, bir sıvının içine batırılmış bir cisme, cismin
              ağırlığına karşı uyguladığı yukarı yönlü kuvvettir.
            </Text>

            <View style={{ gap: 8 }}>
              <Text style={{ fontSize: 14, fontWeight: '500' }}>
                Arşimet Prensibi:
              </Text>
              <View
                style={{
                  backgroundColor: 'rgba(0,0,0,0.05)',
                  padding: 12,
                  borderRadius: 8,
                }}
              >
                <Text style={{ fontSize: 14 }}>
                  "Bir sıvıya tamamen veya kısmen batırılmış bir cisme, cismin
                  yer değiştirdiği sıvının ağırlığına eşit büyüklükte yukarı
                  yönlü bir kuvvet etki eder."
                </Text>
              </View>
            </View>

            <View style={{ gap: 8 }}>
              <Text style={{ fontSize: 14, fontWeight: '500' }}>
                Cisim Davranışı:
              </Text>
              <View style={{ paddingLeft: 16 }}>
                <Text style={{ fontSize: 14 }}>
                  • Yüzme: cisim yoğunluğu {'<'} sıvı yoğunluğu
                </Text>
                <Text style={{ fontSize: 14 }}>
                  • Batma: cisim yoğunluğu {'>'} sıvı yoğunluğu
                </Text>
                <Text style={{ fontSize: 14 }}>
                  • Askıda kalma: yoğunluklar eşit
                </Text>
              </View>
            </View>
          </View>
        );

      case 'formulas':
        return (
          <View style={{ gap: 16 }}>
            <View style={{ gap: 8 }}>
              <Text style={{ fontSize: 14, fontWeight: '500' }}>
                Derinlikteki Basınç:
              </Text>
              <View
                style={{
                  backgroundColor: '#f5f5f5',
                  padding: 12,
                  borderRadius: 8,
                  alignItems: 'center',
                }}
              >
                <Text style={{ fontSize: 16, fontWeight: '500' }}>
                  P = ρ × g × h
                </Text>
              </View>
              <Text style={{ fontSize: 12, color: '#666' }}>
                P: basınç (Pa), ρ: sıvı yoğunluğu (kg/m³), g: yerçekimi ivmesi
                (9.8 m/s²), h: derinlik (m)
              </Text>
            </View>

            <View style={{ gap: 8 }}>
              <Text style={{ fontSize: 14, fontWeight: '500' }}>
                Kaldırma Kuvveti:
              </Text>
              <View
                style={{
                  backgroundColor: '#f5f5f5',
                  padding: 12,
                  borderRadius: 8,
                  alignItems: 'center',
                }}
              >
                <Text style={{ fontSize: 16, fontWeight: '500' }}>
                  F = ρ × g × V
                </Text>
              </View>
              <Text style={{ fontSize: 12, color: '#666' }}>
                F: kaldırma kuvveti (N), ρ: sıvı yoğunluğu (kg/m³), g: yerçekimi
                ivmesi (9.8 m/s²), V: batan hacim (m³)
              </Text>
            </View>

            <View style={{ gap: 8 }}>
              <Text style={{ fontSize: 14, fontWeight: '500' }}>
                Batan Kısım Yüzdesi:
              </Text>
              <View
                style={{
                  backgroundColor: '#f5f5f5',
                  padding: 12,
                  borderRadius: 8,
                  alignItems: 'center',
                }}
              >
                <Text style={{ fontSize: 16, fontWeight: '500' }}>
                  % batan = (ρ1 / ρ2) × 100%
                </Text>
              </View>
              <Text style={{ fontSize: 12, color: '#666' }}>
                Bu formül cisim yüzdüğünde geçerlidir (ρ1 {'<'} ρ2).
              </Text>
            </View>
          </View>
        );
    }
  };

  return (
    <Card style={{ padding: 16, backgroundColor: 'white' }}>
      <Text style={{ fontSize: 16, fontWeight: '500', marginBottom: 16 }}>
        Sıvı Basıncı Fiziği
      </Text>

      <View style={{ flexDirection: 'row', marginBottom: 16 }}>
        <TouchableOpacity
          style={{
            flex: 1,
            padding: 8,
            alignItems: 'center',
            backgroundColor:
              activeTab === 'pressure' ? '#f0f0f0' : 'transparent',
            borderRadius: 8,
          }}
          onPress={() => setActiveTab('pressure')}
        >
          <Text>Basınç</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            flex: 1,
            padding: 8,
            alignItems: 'center',
            backgroundColor:
              activeTab === 'buoyancy' ? '#f0f0f0' : 'transparent',
            borderRadius: 8,
          }}
          onPress={() => setActiveTab('buoyancy')}
        >
          <Text>Kaldırma Kuvveti</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            flex: 1,
            padding: 8,
            alignItems: 'center',
            backgroundColor:
              activeTab === 'formulas' ? '#f0f0f0' : 'transparent',
            borderRadius: 8,
          }}
          onPress={() => setActiveTab('formulas')}
        >
          <Text>Formüller</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={{ maxHeight: 300 }}>{renderContent()}</ScrollView>
    </Card>
  );
};

export default InfoPanel;
