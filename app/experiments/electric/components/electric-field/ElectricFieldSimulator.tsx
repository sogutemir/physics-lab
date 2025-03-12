import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Platform,
  TouchableOpacity,
  PanResponder,
} from 'react-native';
import Svg, { Circle, Line, Path, G, Text as SvgText } from 'react-native-svg';
import { useElectricField } from '../../utils/electric-field/useElectricField';
import { useLanguage } from '../../../../../components/LanguageContext';
import ChargeControl from './ChargeControl';

const ElectricFieldSimulator: React.FC = () => {
  const { t } = useLanguage();
  const isWeb = Platform.OS === 'web';
  const screenWidth = Dimensions.get('window').width;
  const screenHeight = Dimensions.get('window').height;

  // Canvas boyutlarını belirle (platform bazlı)
  const canvasWidth = isWeb
    ? Math.min(screenWidth - 40, 800)
    : screenWidth - 40;
  const canvasHeight = isWeb ? 500 : Math.min(screenHeight * 0.4, 400);

  // Elektrik alanı hook'unu kullan
  const electricField = useElectricField({
    width: canvasWidth,
    height: canvasHeight,
  });

  // Seçili yük
  const [selectedCharge, setSelectedCharge] = useState<string | null>(null);

  // Bilgi gösterimi kontrolü
  const [showInfo, setShowInfo] = useState(true);

  // Canvas üzerinde panResponse oluşturma
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt, gestureState) => {
        const { locationX, locationY } = evt.nativeEvent;

        // Kullanıcı bir yüke tıkladı mı kontrol et
        const clickedCharge = electricField.charges.find((charge) => {
          const distance = Math.sqrt(
            Math.pow(charge.x - locationX, 2) +
              Math.pow(charge.y - locationY, 2)
          );
          return distance < 25; // Yük yarıçapı
        });

        if (clickedCharge) {
          setSelectedCharge(clickedCharge.id);
        } else {
          setSelectedCharge(null);
        }
      },
      onPanResponderMove: (evt, gestureState) => {
        if (selectedCharge) {
          const { locationX, locationY } = evt.nativeEvent;
          electricField.moveCharge(selectedCharge, locationX, locationY);
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

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.canvasContainer,
          { width: canvasWidth, height: canvasHeight },
        ]}
        {...panResponder.panHandlers}
      >
        <Svg width="100%" height="100%">
          {/* Alan çizgileri */}
          {electricField.charges.length > 0 && renderFieldLines()}

          {/* Alan vektörleri */}
          {electricField.charges.length > 0 && renderFieldVectors()}

          {/* Yükler */}
          {renderCharges()}
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

      <ChargeControl
        onAddPositiveCharge={(value: number) => {
          const x = Math.random() * (canvasWidth - 50) + 25;
          const y = Math.random() * (canvasHeight - 50) + 25;
          electricField.addCharge(x, y, value);
        }}
        onAddNegativeCharge={(value: number) => {
          const x = Math.random() * (canvasWidth - 50) + 25;
          const y = Math.random() * (canvasHeight - 50) + 25;
          electricField.addCharge(x, y, -value);
        }}
        onClearCharges={electricField.clearCharges}
        onPlay={electricField.startSimulation}
        onPause={electricField.pauseSimulation}
        isRunning={electricField.isRunning}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginBottom: 20,
  },
  canvasContainer: {
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    overflow: 'hidden',
    marginVertical: 16,
    position: 'relative',
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
});

export default ElectricFieldSimulator;
