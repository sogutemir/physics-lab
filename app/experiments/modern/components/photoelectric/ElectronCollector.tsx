import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { useLanguage } from '../../../../../components/LanguageContext';

interface ElectronCollectorProps {
  voltage: number;
  current: number;
}

const ElectronCollector: React.FC<ElectronCollectorProps> = ({
  voltage,
  current,
}) => {
  const { t } = useLanguage();
  const glowAnimation = useRef(new Animated.Value(0)).current;

  // Gerilim değerine göre renk tonu belirle (kırmızı = negatif, mavi = pozitif)
  const voltageColor =
    voltage < 0
      ? `rgba(255, 50, 50, ${Math.min(1, Math.abs(voltage) / 5)})`
      : `rgba(50, 50, 255, ${Math.min(1, Math.abs(voltage) / 5)})`;

  // Akım yoğunluğuna göre parlaklık efekti
  const glowIntensity = Math.min(1, current / 100);

  // Akım değerine bağlı olarak parlama animasyonu
  useEffect(() => {
    if (current > 0) {
      // Parlama animasyonu
      Animated.loop(
        Animated.sequence([
          Animated.timing(glowAnimation, {
            toValue: 1,
            duration: 1500,
            useNativeDriver: true,
          }),
          Animated.timing(glowAnimation, {
            toValue: 0.6,
            duration: 1500,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      // Animasyonu durdur
      glowAnimation.setValue(0);
    }

    return () => {
      // Bileşen kaldırıldığında animasyonu durdur
      glowAnimation.stopAnimation();
    };
  }, [current, glowAnimation]);

  const shadowRadius = glowAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [5, 15],
  });

  const shadowOpacity = glowAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0.2, 0.8],
  });

  return (
    <View style={styles.container}>
      {/* Toplayıcı plaka */}
      <Animated.View
        style={[
          styles.collector,
          {
            backgroundColor: voltageColor,
            shadowColor: current > 0 ? '#4d9fff' : 'transparent',
            shadowRadius: current > 0 ? 8 + glowIntensity * 12 : 0,
            shadowOpacity: current > 0 ? glowIntensity * 0.8 : 0,
            transform:
              current > 0
                ? [
                    {
                      scale: glowAnimation.interpolate({
                        inputRange: [0, 1],
                        outputRange: [1, 1.03],
                      }),
                    },
                  ]
                : undefined,
          },
        ]}
      >
        <Text style={styles.voltageText}>{voltage.toFixed(1)}V</Text>
      </Animated.View>

      {/* Akım göstergesi */}
      {current > 0 && (
        <Animated.View
          style={[
            styles.currentIndicator,
            {
              opacity: glowAnimation.interpolate({
                inputRange: [0, 1],
                outputRange: [0.8, 1],
              }),
            },
          ]}
        >
          <Text style={styles.currentText}>{current.toFixed(2)} μA</Text>
        </Animated.View>
      )}

      {/* Elektron etkisi - parlama halkası */}
      {current > 0 && (
        <Animated.View
          style={[
            styles.electronEffect,
            {
              opacity: glowAnimation.interpolate({
                inputRange: [0, 1],
                outputRange: [0.1, glowIntensity * 0.5],
              }),
              transform: [
                {
                  scale: glowAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.8, 1.2],
                  }),
                },
              ],
            },
          ]}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 256,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  collector: {
    width: 48,
    height: 192,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#ccc',
    shadowOffset: { width: 0, height: 0 },
    alignItems: 'center',
    justifyContent: 'center',
  },
  voltageText: {
    fontSize: 12,
    fontFamily: 'monospace',
    color: 'white',
    opacity: 0.8,
  },
  currentIndicator: {
    marginTop: 8,
    backgroundColor: '#222',
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  currentText: {
    fontSize: 12,
    fontFamily: 'monospace',
    color: 'white',
  },
  electronEffect: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#4d9fff',
    left: '50%',
    top: '50%',
    marginLeft: -40,
    marginTop: -40,
    opacity: 0.3,
  },
});

export default ElectronCollector;
