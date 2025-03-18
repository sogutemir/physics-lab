import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import Svg, { Path, Line, Text as SvgText } from 'react-native-svg';

interface WaveformProps {
  width: number;
  height: number;
  amplitude: number;
  frequency: number;
  phaseShift?: number;
  color?: string;
  animated?: boolean;
}

const Waveform: React.FC<WaveformProps> = ({
  width,
  height,
  amplitude,
  frequency = 1,
  phaseShift = 0,
  color = '#3b82f6',
  animated = true,
}) => {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    let animation: Animated.CompositeAnimation | null = null;

    if (animated) {
      // Sonsuz animasyon oluştur
      animation = Animated.loop(
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 2000 / frequency, // Frekansa bağlı olarak hızı ayarla
          useNativeDriver: true,
        })
      );

      animation.start();
    } else {
      // Animasyon durdurulduğunda değeri sıfırla
      animatedValue.setValue(0);
    }

    return () => {
      if (animation) {
        animation.stop();
      }
    };
  }, [animated, frequency, animatedValue]);

  // Dalga genliğini ölçeklendirme (maksimum yüksekliğin %80'i kullan)
  const maxAmplitude = height * 0.4;
  const scaledAmplitude = Math.min(Math.abs(amplitude) / 240, 1) * maxAmplitude;

  // SVG orta noktası
  const centerY = height / 2;

  // Dalga yolu oluştur
  const generatePath = () => {
    const segments = 100;
    const step = width / segments;

    let path = `M 0 ${centerY}`;

    for (let i = 0; i <= segments; i++) {
      const x = i * step;
      const y = centerY - Math.sin(i * 0.2 + phaseShift) * scaledAmplitude;
      path += ` L ${x} ${y}`;
    }

    return path;
  };

  // Izgara çizgileri oluştur
  const generateGridLines = () => {
    const lines = [];
    const verticalCount = 4;
    const horizontalCount = 4;

    // Dikey çizgiler
    for (let i = 1; i < verticalCount; i++) {
      const x = (width / verticalCount) * i;
      lines.push(
        <Line
          key={`v-${i}`}
          x1={x}
          y1={0}
          x2={x}
          y2={height}
          stroke="#e2e8f0"
          strokeWidth="1"
        />
      );
    }

    // Yatay çizgiler
    for (let i = 1; i < horizontalCount; i++) {
      const y = (height / horizontalCount) * i;
      lines.push(
        <Line
          key={`h-${i}`}
          x1={0}
          y1={y}
          x2={width}
          y2={y}
          stroke="#e2e8f0"
          strokeWidth="1"
        />
      );
    }

    return lines;
  };

  return (
    <View style={[styles.container, { width, height }]}>
      <Svg width={width} height={height}>
        {/* Izgara çizgileri */}
        <Line
          x1={0}
          y1={centerY}
          x2={width}
          y2={centerY}
          stroke="#cbd5e1"
          strokeWidth="1"
        />
        {generateGridLines()}

        {/* Dalga formu */}
        <Path
          d={generatePath()}
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeOpacity={0.8}
          strokeLinecap="round"
        />

        {/* Değer göstergesi */}
        <SvgText x="10" y="16" fontSize="10" fill="#64748b">
          {amplitude.toFixed(1)}V
        </SvgText>
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    overflow: 'hidden',
  },
});

export default Waveform;
