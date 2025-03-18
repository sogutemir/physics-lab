import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, {
  Path,
  Circle,
  G,
  Line,
  Defs,
  LinearGradient,
  Stop,
} from 'react-native-svg';
import Animated, {
  useAnimatedProps,
  useSharedValue,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';

// Animated SVG bileşenleri için gerekli tanımlamalar
const AnimatedPath = Animated.createAnimatedComponent(Path);
const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const AnimatedLine = Animated.createAnimatedComponent(Line);

interface TransformerCoreProps {
  type: 'E' | 'U' | 'toroid';
  magneticFieldVisible: boolean;
  magneticFieldStrength: number;
  materialPermeability: number;
}

const TransformerCore: React.FC<TransformerCoreProps> = ({
  type,
  magneticFieldVisible,
  magneticFieldStrength,
  materialPermeability,
}) => {
  // Malzeme permeabilitesine göre renk belirleme
  const getCoreColor = () => {
    if (materialPermeability > 7000) return '#9ca3af'; // Açık gri
    if (materialPermeability > 4000) return '#6b7280'; // Orta gri
    return '#4b5563'; // Koyu gri
  };

  // Manyetik alan çizgilerinin animasyonu için
  const animatedOffset = useSharedValue(0);

  React.useEffect(() => {
    if (magneticFieldVisible) {
      animatedOffset.value = withRepeat(
        withTiming(15, { duration: 2000, easing: Easing.linear }),
        -1,
        false
      );
    } else {
      animatedOffset.value = 0;
    }
  }, [magneticFieldVisible]);

  // Manyetik alan çizgilerinin stilini belirleme
  const animatedMagneticFieldProps = useAnimatedProps(() => {
    return {
      strokeDashoffset: animatedOffset.value,
    };
  });

  // Manyetik alan gücüne göre opaklık belirleme
  const magneticFieldOpacity = Math.min(0.8, magneticFieldStrength * 0.005);

  // E tipi nüve render fonksiyonu
  const renderECore = () => (
    <G>
      {/* E-tipi transformatör nüvesi */}
      <Path
        d="M100,50 H300 V90 H220 V160 H300 V200 H100 V160 H180 V90 H100 Z"
        fill={getCoreColor()}
      />

      {/* Manyetik alan çizgileri */}
      {magneticFieldVisible && (
        <>
          <AnimatedLine
            x1="130"
            y1="60"
            x2="270"
            y2="60"
            stroke="#3b82f6"
            strokeWidth="1.5"
            strokeDasharray="5,5"
            opacity={magneticFieldOpacity}
            animatedProps={animatedMagneticFieldProps}
          />
          <AnimatedLine
            x1="130"
            y1="125"
            x2="270"
            y2="125"
            stroke="#3b82f6"
            strokeWidth="1.5"
            strokeDasharray="5,5"
            opacity={magneticFieldOpacity}
            animatedProps={animatedMagneticFieldProps}
            strokeDashoffset="5"
          />
          <AnimatedLine
            x1="130"
            y1="190"
            x2="270"
            y2="190"
            stroke="#3b82f6"
            strokeWidth="1.5"
            strokeDasharray="5,5"
            opacity={magneticFieldOpacity}
            animatedProps={animatedMagneticFieldProps}
            strokeDashoffset="10"
          />
        </>
      )}
    </G>
  );

  // U tipi nüve render fonksiyonu
  const renderUCore = () => (
    <G>
      {/* U-tipi transformatör nüvesi */}
      <Path
        d="M100,60 H200 V180 H100 V60 Z M300,60 H400 V180 H300 V60 Z"
        fill={getCoreColor()}
      />

      {/* Manyetik alan çizgileri */}
      {magneticFieldVisible && (
        <>
          <AnimatedLine
            x1="150"
            y1="90"
            x2="350"
            y2="90"
            stroke="#3b82f6"
            strokeWidth="1.5"
            strokeDasharray="5,5"
            opacity={magneticFieldOpacity}
            animatedProps={animatedMagneticFieldProps}
          />
          <AnimatedLine
            x1="150"
            y1="120"
            x2="350"
            y2="120"
            stroke="#3b82f6"
            strokeWidth="1.5"
            strokeDasharray="5,5"
            opacity={magneticFieldOpacity}
            animatedProps={animatedMagneticFieldProps}
            strokeDashoffset="5"
          />
          <AnimatedLine
            x1="150"
            y1="150"
            x2="350"
            y2="150"
            stroke="#3b82f6"
            strokeWidth="1.5"
            strokeDasharray="5,5"
            opacity={magneticFieldOpacity}
            animatedProps={animatedMagneticFieldProps}
            strokeDashoffset="10"
          />
        </>
      )}
    </G>
  );

  // Toroid nüve render fonksiyonu
  const renderToroidCore = () => (
    <G>
      {/* Toroid transformatör nüvesi */}
      <Circle cx="200" cy="120" r="80" fill={getCoreColor()} />
      <Circle cx="200" cy="120" r="40" fill="white" />

      {/* Manyetik alan çizgileri */}
      {magneticFieldVisible && (
        <>
          <AnimatedCircle
            cx="200"
            cy="120"
            r="50"
            stroke="#3b82f6"
            strokeWidth="1.5"
            strokeDasharray="5,5"
            fill="none"
            opacity={magneticFieldOpacity}
            animatedProps={animatedMagneticFieldProps}
          />
          <AnimatedCircle
            cx="200"
            cy="120"
            r="60"
            stroke="#3b82f6"
            strokeWidth="1.5"
            strokeDasharray="5,5"
            fill="none"
            opacity={magneticFieldOpacity}
            animatedProps={animatedMagneticFieldProps}
            strokeDashoffset="5"
          />
          <AnimatedCircle
            cx="200"
            cy="120"
            r="70"
            stroke="#3b82f6"
            strokeWidth="1.5"
            strokeDasharray="5,5"
            fill="none"
            opacity={magneticFieldOpacity}
            animatedProps={animatedMagneticFieldProps}
            strokeDashoffset="10"
          />
        </>
      )}
    </G>
  );

  return (
    <View style={styles.container}>
      <Svg width="400" height="240" viewBox="0 0 400 240">
        <Defs>
          <LinearGradient id="coreGradient" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor="#6b7280" stopOpacity="0.9" />
            <Stop offset="1" stopColor="#4b5563" stopOpacity="0.9" />
          </LinearGradient>
        </Defs>

        {type === 'E' && renderECore()}
        {type === 'U' && renderUCore()}
        {type === 'toroid' && renderToroidCore()}
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default TransformerCore;
