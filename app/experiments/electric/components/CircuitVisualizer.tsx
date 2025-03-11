import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Platform } from 'react-native';
import Svg, { Path, Rect, G, Circle, Text as SvgText } from 'react-native-svg';
import { useLanguage } from '../../../../components/LanguageContext';
import { calculateFlowSpeed, calculateBrightness } from '../utils/ohmLaw';

interface CircuitVisualizerProps {
  voltage: number;
  current: number;
  resistance: number;
}

const CircuitVisualizer: React.FC<CircuitVisualizerProps> = ({
  voltage,
  current,
  resistance,
}) => {
  const { t } = useLanguage();
  const animatedValue = useRef(new Animated.Value(0)).current;

  // Akıma göre animasyon hızını hesapla
  const flowSpeed = calculateFlowSpeed(current);
  const brightness = calculateBrightness(voltage);

  // Akım değiştiğinde animasyon hızını güncelle
  useEffect(() => {
    if (current > 0) {
      // Mevcut animasyonu durdur
      animatedValue.stopAnimation();

      // Yeni animasyonu başlat
      Animated.loop(
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: flowSpeed * 1000, // Milisaniyeye çevir
          useNativeDriver: Platform.OS !== 'web', // Web'de native driver desteklenmiyor
        })
      ).start();
    } else {
      // Akım yoksa animasyonu durdur
      animatedValue.stopAnimation();
    }

    return () => {
      animatedValue.stopAnimation();
    };
  }, [current, flowSpeed, animatedValue]);

  // Akım akışına göre devre opaklığını ayarla
  const circuitOpacity = current > 0 ? 1 : 0.5;
  const resistorSize = 80 + resistance * 2;
  const resistorWidth = Math.min(Math.max(resistorSize, 80), 160);

  // Direnç zigzag desenini oluştur
  const createResistorPath = () => {
    const startX = -resistorWidth / 2;
    const endX = resistorWidth / 2;
    const segmentWidth = (endX - startX) / 10;

    let path = `M ${startX} 0 `;

    for (let i = 0; i < 9; i++) {
      const x = startX + i * segmentWidth;
      const y = i % 2 === 0 ? -10 : 10;
      path += `L ${x + segmentWidth} ${y} `;
    }

    path += `L ${endX} 0`;
    return path;
  };

  return (
    <View style={[styles.container, { opacity: circuitOpacity }]}>
      <Svg viewBox="0 0 500 200" style={styles.svg}>
        {/* Pil */}
        <G transform="translate(50, 100)">
          <Rect
            x={-15}
            y={-25}
            width={30}
            height={50}
            rx={2}
            fill={voltage > 0 ? '#3498db' : '#ccc'}
          />
          <Rect
            x={-5}
            y={-30}
            width={10}
            height={5}
            fill={voltage > 0 ? '#3498db' : '#ccc'}
          />
        </G>

        {/* Devre Kabloları */}
        <Path
          d="M 70 100 H 150 V 50 H 350 V 150 H 150 V 100 H 430"
          fill="none"
          stroke="#3498db"
          strokeWidth={3}
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Akım Akış Noktaları */}
        {current > 0 &&
          Array.from({ length: 10 }).map((_, i) => (
            <Circle
              key={i}
              cx={70 + ((i * 40) % 360)}
              cy={100}
              r={3}
              fill="#fff"
              opacity={0.8}
            />
          ))}

        {/* Direnç */}
        <G transform="translate(250, 50)">
          <Rect
            x={-resistorWidth / 2}
            y="-15"
            width={resistorWidth}
            height="30"
            rx="5"
            fill={current > 0 ? '#e74c3c' : '#ccc'}
            opacity={0.8}
          />

          {/* Direnç zigzag deseni */}
          <Path
            d={createResistorPath()}
            fill="none"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity={0.8}
          />

          <SvgText
            x="0"
            y="-25"
            textAnchor="middle"
            fill="#e74c3c"
            fontSize="12"
            fontWeight="500"
          >
            {resistance.toFixed(1)} Ω
          </SvgText>
        </G>

        {/* Akım Göstergesi */}
        <G transform="translate(430, 100)">
          <Circle
            cx="0"
            cy="0"
            r="15"
            fill={current > 0 ? '#f39c12' : '#ccc'}
          />
          <SvgText
            x="0"
            y="4"
            textAnchor="middle"
            fill="white"
            fontSize="12"
            fontWeight="bold"
          >
            I
          </SvgText>
        </G>

        {/* Parlaklık Göstergesi */}
        <Circle
          cx="390"
          cy="170"
          r={Math.max(5, brightness / 10)}
          fill="#f1c40f"
          opacity={brightness / 100}
        />
      </Svg>

      {/* Gerilim, Akım ve Direnç etiketleri */}
      <View style={styles.labelsContainer}>
        {voltage > 0 && (
          <View style={[styles.label, styles.voltageLabel]}>
            <Text style={styles.labelText}>{voltage.toFixed(1)}V</Text>
          </View>
        )}
        {current > 0 && (
          <View style={[styles.label, styles.currentLabel]}>
            <Text style={styles.labelText}>{current.toFixed(2)}A</Text>
          </View>
        )}
        {resistance > 0 && (
          <View style={[styles.label, styles.resistanceLabel]}>
            <Text style={styles.labelText}>{resistance.toFixed(1)}Ω</Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 250,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
  },
  svg: {
    width: '100%',
    height: '100%',
  },
  labelsContainer: {
    position: 'absolute',
    top: 8,
    left: 8,
    flexDirection: 'row',
  },
  label: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginRight: 4,
  },
  voltageLabel: {
    backgroundColor: 'rgba(52, 152, 219, 0.2)',
  },
  currentLabel: {
    backgroundColor: 'rgba(243, 156, 18, 0.2)',
  },
  resistanceLabel: {
    backgroundColor: 'rgba(231, 76, 60, 0.2)',
  },
  labelText: {
    fontSize: 12,
    fontWeight: '500',
  },
});

export default CircuitVisualizer;
