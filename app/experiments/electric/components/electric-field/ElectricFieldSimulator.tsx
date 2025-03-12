import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Platform,
  TouchableOpacity,
  PanResponder,
  ScrollView,
} from 'react-native';
import Svg, { Circle, Line, Path, G, Text as SvgText } from 'react-native-svg';
import { useElectricField } from '../../utils/electric-field/useElectricField';
import { useLanguage } from '../../../../../components/LanguageContext';
import ChargeControl from './ChargeControl';

// Web için event tipleri
interface WebNativeEvent {
  pageX: number;
  pageY: number;
  locationX?: number;
  locationY?: number;
  // Web için özel
  offsetX?: number;
  offsetY?: number;
}

const ElectricFieldSimulator: React.FC = () => {
  const { t } = useLanguage();
  const isWeb = Platform.OS === 'web';
  const screenWidth = Dimensions.get('window').width;
  const screenHeight = Dimensions.get('window').height;

  // Ekran genişliğine göre canvas boyutları
  const canvasWidth = isWeb
    ? Math.min(screenWidth * 0.9, 800)
    : screenWidth - 32;
  const canvasHeight = isWeb
    ? Math.min(screenHeight * 0.5, 500)
    : Math.min(screenHeight * 0.4, 400);

  // Pencerenin yeniden boyutlandırılmasını izleyelim (web için)
  const [dimensions, setDimensions] = useState({
    width: canvasWidth,
    height: canvasHeight,
  });

  useEffect(() => {
    if (isWeb) {
      const handleResize = () => {
        const newWidth = Math.min(Dimensions.get('window').width * 0.9, 800);
        const newHeight = Math.min(Dimensions.get('window').height * 0.5, 500);
        setDimensions({ width: newWidth, height: newHeight });
      };

      // Pencere boyutunu dinle
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, [isWeb]);

  // Elektrik alanı hook'unu kullan
  const electricField = useElectricField({
    width: dimensions.width,
    height: dimensions.height,
  });

  // Seçili yük
  const [selectedCharge, setSelectedCharge] = useState<string | null>(null);

  // Bilgi gösterimi kontrolü
  const [showInfo, setShowInfo] = useState(true);

  // Potansiyel enerji gösterimi kontrolü
  const [showEnergyInfo, setShowEnergyInfo] = useState(true);

  // Canvas üzerinde panResponse oluşturma - dokunma parçacıkları taşıma sorununu çözmek için güncellendi
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt, gestureState) => {
        const { locationX, locationY } = evt.nativeEvent;

        // Kullanıcı bir yüke tıkladı mı kontrol et
        const clickedCharge = electricField.charges.find((charge) => {
          const distance = Math.sqrt(
            Math.pow(charge.x - locationX, 2) +
              Math.pow(charge.y - locationY, 2)
          );
          // Yük yarıçapını büyütelim ki daha kolay tıklanabilsin
          const chargeRadius = 20 + Math.min(Math.abs(charge.value) * 3, 15);
          return distance < chargeRadius;
        });

        if (clickedCharge) {
          setSelectedCharge(clickedCharge.id);

          // Ölçüm noktasını temizle
          if (electricField.measurePoint) {
            electricField.setMeasurePoint(null);
          }
        } else {
          setSelectedCharge(null);

          // Ölçüm noktasını ayarla
          electricField.setMeasurePoint({ x: locationX, y: locationY });
        }
      },
      onPanResponderMove: (evt, gestureState) => {
        if (selectedCharge) {
          // Web ve mobil için konum hesaplama
          let locationX = 0;
          let locationY = 0;

          if (isWeb) {
            // Web için
            const nativeEvent = evt.nativeEvent as unknown as WebNativeEvent;
            locationX = nativeEvent.offsetX ?? nativeEvent.locationX ?? 0;
            locationY = nativeEvent.offsetY ?? nativeEvent.locationY ?? 0;
          } else {
            // Mobil için
            locationX = evt.nativeEvent.locationX;
            locationY = evt.nativeEvent.locationY;
          }

          // Sınırları kontrol et
          const boundedX = Math.max(
            20,
            Math.min(dimensions.width - 20, locationX)
          );
          const boundedY = Math.max(
            20,
            Math.min(dimensions.height - 20, locationY)
          );

          // Yükü güncelle
          electricField.moveCharge(selectedCharge, boundedX, boundedY);
        }
      },
      onPanResponderRelease: () => {
        setSelectedCharge(null);
      },
    })
  ).current;

  // SVG'de elektrik alan vektörlerini çiz
  const renderFieldVectors = () => {
    return electricField.fieldVectors.map((vector, index) => {
      // Vektör uzunluğunu skala (çizim için)
      const scaledMagnitude = Math.min(Math.log(vector.magnitude + 1) * 5, 20);

      // Son noktayı hesapla
      const endX = vector.x + Math.cos(vector.direction) * scaledMagnitude;
      const endY = vector.y + Math.sin(vector.direction) * scaledMagnitude;

      // Ok başı büyüklüğü
      const arrowSize = 5;

      // Ok yönü açısı
      const angle = vector.direction;

      // Ok başı koordinatları
      const arrowX1 = endX - arrowSize * Math.cos(angle - Math.PI / 6);
      const arrowY1 = endY - arrowSize * Math.sin(angle - Math.PI / 6);
      const arrowX2 = endX - arrowSize * Math.cos(angle + Math.PI / 6);
      const arrowY2 = endY - arrowSize * Math.sin(angle + Math.PI / 6);

      return (
        <G key={`vector-${index}`}>
          <Line
            x1={vector.x}
            y1={vector.y}
            x2={endX}
            y2={endY}
            stroke="#999"
            strokeWidth={1}
          />
          <Line
            x1={endX}
            y1={endY}
            x2={arrowX1}
            y2={arrowY1}
            stroke="#999"
            strokeWidth={1}
          />
          <Line
            x1={endX}
            y1={endY}
            x2={arrowX2}
            y2={arrowY2}
            stroke="#999"
            strokeWidth={1}
          />
        </G>
      );
    });
  };

  // SVG'de elektrik alan çizgilerini çiz
  const renderFieldLines = () => {
    return electricField.fieldLines.map((line, index) => {
      // Path string oluştur
      let pathString = '';

      if (line.points.length > 0) {
        pathString = `M ${line.points[0].x} ${line.points[0].y}`;

        for (let i = 1; i < line.points.length; i++) {
          pathString += ` L ${line.points[i].x} ${line.points[i].y}`;
        }
      }

      return (
        <Path
          key={`line-${index}`}
          d={pathString}
          stroke="rgba(120, 120, 200, 0.6)"
          strokeWidth={1}
          fill="none"
        />
      );
    });
  };

  // SVG'de yükleri çiz
  const renderCharges = () => {
    return electricField.charges.map((charge) => {
      const chargeRadius = 12 + Math.min(Math.abs(charge.value) * 3, 10);
      const isSelected = selectedCharge === charge.id;

      return (
        <G key={charge.id}>
          <Circle
            cx={charge.x}
            cy={charge.y}
            r={chargeRadius}
            fill={charge.color}
            stroke={isSelected ? '#ffcc00' : charge.isFixed ? '#444' : 'none'}
            strokeWidth={isSelected ? 2 : charge.isFixed ? 1 : 0}
            opacity={0.8}
          />
          <SvgText
            x={charge.x}
            y={charge.y + 5}
            textAnchor="middle"
            fill="#fff"
            fontSize={12}
            fontWeight="bold"
          >
            {charge.value > 0 ? '+' : '-'}
          </SvgText>
        </G>
      );
    });
  };

  // Yükler arasındaki etkileşim çizgilerini çiz
  const renderInteractionLines = () => {
    if (electricField.charges.length < 2) return null;

    return electricField.chargeInteractions.map((interaction, index) => {
      const charge1 = electricField.charges.find(
        (c) => c.id === interaction.charge1Id
      );
      const charge2 = electricField.charges.find(
        (c) => c.id === interaction.charge2Id
      );

      if (!charge1 || !charge2) return null;

      // İtme/çekme etkileşimi için farklı çizgi stilleri
      const strokeColor = interaction.isRepulsive
        ? 'rgba(255, 100, 100, 0.5)' // Kırmızı: İtme
        : 'rgba(100, 100, 255, 0.5)'; // Mavi: Çekme

      const strokeDash = interaction.isRepulsive ? 'none' : '5,5';

      return (
        <Line
          key={`interaction-${index}`}
          x1={charge1.x}
          y1={charge1.y}
          x2={charge2.x}
          y2={charge2.y}
          stroke={strokeColor}
          strokeWidth={2}
          strokeDasharray={strokeDash}
          strokeOpacity={0.7}
        />
      );
    });
  };

  // Ölçüm noktasını çiz
  const renderMeasurePoint = () => {
    if (!electricField.measurePoint) return null;

    return (
      <G>
        <Circle
          cx={electricField.measurePoint.x}
          cy={electricField.measurePoint.y}
          r={6}
          fill="rgba(255, 204, 0, 0.7)"
          stroke="#ffcc00"
          strokeWidth={1}
        />
        <Circle
          cx={electricField.measurePoint.x}
          cy={electricField.measurePoint.y}
          r={2}
          fill="#ffcc00"
        />
      </G>
    );
  };

  return (
    <View style={styles.container}>
      {/* Canvas Alanı */}
      <View
        style={[
          styles.canvasContainer,
          { width: dimensions.width, height: dimensions.height },
        ]}
        {...panResponder.panHandlers}
      >
        <Svg width="100%" height="100%">
          {/* Yükler arası etkileşim çizgileri */}
          {electricField.charges.length >= 2 && renderInteractionLines()}

          {/* Alan çizgileri */}
          {electricField.charges.length > 0 && renderFieldLines()}

          {/* Alan vektörleri */}
          {electricField.charges.length > 0 && renderFieldVectors()}

          {/* Yükler */}
          {renderCharges()}

          {/* Ölçüm noktası */}
          {renderMeasurePoint()}
        </Svg>

        {/* Bilgi gösterimi */}
        {showInfo && electricField.charges.length === 0 && (
          <View style={styles.infoOverlay}>
            <Text style={styles.infoText}>
              {t(
                'Elektrik alanını görmek için kontrol panelini kullanarak yük ekleyin.',
                'Add charges using the control panel to visualize the electric field.'
              )}
            </Text>
          </View>
        )}
      </View>

      {/* Yardım metni */}
      <Text style={styles.dragHelpText}>
        {t(
          'Yükleri sürükleyip bırakarak hareket ettirebilirsiniz. Boş bir alana tıklayarak ölçüm noktası yerleştirebilirsiniz.',
          'Drag and drop charges to move them. Click on an empty area to place a measurement point.'
        )}
      </Text>

      {/* Kontrol ve ölçüm panelleri - yerleşim düzeltildi */}
      <View
        style={
          isWeb ? styles.controlsRowContainer : styles.controlsColumnContainer
        }
      >
        <ChargeControl
          onAddPositiveCharge={(value: number) => {
            const x = Math.random() * (dimensions.width - 50) + 25;
            const y = Math.random() * (dimensions.height - 50) + 25;
            electricField.addCharge(x, y, value);
          }}
          onAddNegativeCharge={(value: number) => {
            const x = Math.random() * (dimensions.width - 50) + 25;
            const y = Math.random() * (dimensions.height - 50) + 25;
            electricField.addCharge(x, y, -value);
          }}
          onClearCharges={electricField.clearCharges}
          onPlay={electricField.startSimulation}
          onPause={electricField.pauseSimulation}
          isRunning={electricField.isRunning}
        />

        {/* Potansiyel Enerji Ölçüm Paneli */}
        {electricField.charges.length >= 2 && (
          <View style={styles.measurementPanel}>
            <View style={styles.measPanelHeader}>
              <Text style={styles.measPanelTitle}>
                {t(
                  'Potansiyel Enerji Ölçümleri',
                  'Potential Energy Measurements'
                )}
              </Text>
              <TouchableOpacity
                onPress={() => setShowEnergyInfo(!showEnergyInfo)}
              >
                <Text style={styles.measPanelToggle}>
                  {showEnergyInfo ? t('Gizle', 'Hide') : t('Göster', 'Show')}
                </Text>
              </TouchableOpacity>
            </View>

            {showEnergyInfo && (
              <View style={styles.measPanelContent}>
                <View style={styles.measRow}>
                  <Text style={styles.measLabel}>
                    {t('Toplam Potansiyel Enerji:', 'Total Potential Energy:')}
                  </Text>
                  <Text style={styles.measValue}>
                    {electricField.totalPotentialEnergy.toExponential(3)} J
                  </Text>
                </View>

                {electricField.measurePoint &&
                  electricField.potentialAtPoint !== null && (
                    <View style={styles.measRow}>
                      <Text style={styles.measLabel}>
                        {t(
                          'İşaretçi Konumundaki Potansiyel:',
                          'Potential at Pointer:'
                        )}
                      </Text>
                      <Text style={styles.measValue}>
                        {electricField.potentialAtPoint.toExponential(3)} V
                      </Text>
                    </View>
                  )}

                <Text style={styles.measSectionTitle}>
                  {t('Yükler Arası Etkileşimler:', 'Charge Interactions:')}
                </Text>

                <ScrollView style={styles.interactionsContainer}>
                  {electricField.chargeInteractions.map(
                    (interaction, index) => {
                      const charge1 = electricField.charges.find(
                        (c) => c.id === interaction.charge1Id
                      );
                      const charge2 = electricField.charges.find(
                        (c) => c.id === interaction.charge2Id
                      );

                      if (!charge1 || !charge2) return null;

                      const interactionType = interaction.isRepulsive
                        ? t('İtme', 'Repulsion')
                        : t('Çekme', 'Attraction');

                      return (
                        <View
                          key={`interaction-info-${index}`}
                          style={styles.interactionItem}
                        >
                          <View style={styles.interactionHeader}>
                            <Text style={styles.interactionLabel}>
                              {charge1.value > 0 ? '+' : '-'}
                              {Math.abs(charge1.value).toFixed(1)} ↔{' '}
                              {charge2.value > 0 ? '+' : '-'}
                              {Math.abs(charge2.value).toFixed(1)}
                            </Text>
                            <Text
                              style={[
                                styles.interactionType,
                                {
                                  color: interaction.isRepulsive
                                    ? '#e74c3c'
                                    : '#3498db',
                                },
                              ]}
                            >
                              {interactionType}
                            </Text>
                          </View>
                          <View style={styles.interactionDetails}>
                            <Text style={styles.interactionDetail}>
                              {t('Mesafe:', 'Distance:')}{' '}
                              {interaction.distance.toFixed(0)} px
                            </Text>
                            <Text style={styles.interactionDetail}>
                              {t('Enerji:', 'Energy:')}{' '}
                              {interaction.potentialEnergy.toExponential(2)} J
                            </Text>
                          </View>
                        </View>
                      );
                    }
                  )}
                </ScrollView>

                <Text style={styles.measHelp}>
                  {t(
                    'İpucu: Yükler arasındaki çizgiler etkileşim tipini gösterir. Düz çizgi itme kuvvetini, kesikli çizgi çekme kuvvetini belirtir.',
                    'Tip: Lines between charges indicate interaction type. Solid lines for repulsion, dashed lines for attraction.'
                  )}
                </Text>
              </View>
            )}
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 16,
    width: '100%',
  },
  canvasContainer: {
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    overflow: 'hidden',
    marginVertical: 16,
    position: 'relative',
    alignSelf: 'center',
  },
  infoOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    padding: 20,
  },
  infoText: {
    textAlign: 'center',
    color: '#555',
    fontSize: 14,
  },
  controlsRowContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'center',
    flexWrap: 'wrap',
    width: '100%',
    gap: 16,
  },
  controlsColumnContainer: {
    flexDirection: 'column',
    alignItems: 'stretch',
    width: '100%',
    gap: 16,
  },
  measurementPanel: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    flex: 1,
    minWidth: 320,
    maxWidth: Platform.OS === 'web' ? undefined : '100%',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
      web: {
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      },
    }),
  },
  measPanelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  measPanelTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
  },
  measPanelToggle: {
    fontSize: 14,
    color: '#3498db',
  },
  measPanelContent: {
    paddingTop: 8,
  },
  measRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  measLabel: {
    fontSize: 14,
    color: '#555',
    flex: 1,
    marginRight: 8,
  },
  measValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#2c3e50',
    fontFamily: Platform.OS === 'web' ? 'monospace' : undefined,
    textAlign: 'right',
  },
  measSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginTop: 10,
    marginBottom: 8,
  },
  interactionsContainer: {
    maxHeight: 150,
    marginBottom: 8,
  },
  interactionItem: {
    backgroundColor: '#f8f9fa',
    borderRadius: 6,
    padding: 8,
    marginBottom: 6,
  },
  interactionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  interactionLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#2c3e50',
  },
  interactionType: {
    fontSize: 12,
    fontWeight: '500',
  },
  interactionDetails: {
    flexDirection: Platform.OS === 'web' ? 'row' : 'column',
    justifyContent: 'space-between',
  },
  interactionDetail: {
    fontSize: 12,
    color: '#555',
  },
  measHelp: {
    fontSize: 12,
    fontStyle: 'italic',
    color: '#7f8c8d',
    marginTop: 8,
  },
  dragHelpText: {
    fontSize: 12,
    color: '#7f8c8d',
    marginBottom: 10,
    textAlign: 'center',
  },
});

export default ElectricFieldSimulator;
