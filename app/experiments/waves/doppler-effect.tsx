import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView, Platform, TouchableOpacity } from 'react-native';
import Svg, { Circle, Line, Path, Text as SvgText, Rect } from 'react-native-svg';
import Slider from '@react-native-community/slider';
import ExperimentLayout from '../../../components/ExperimentLayout';

// Tip tanımlamaları
interface Point {
  x: number;
  y: number;
}

interface WaveCircle {
  center: Point;
  radius: number;
  color: string;
}

interface DopplerEffectState {
  velocity: number;     // Kaynak hızı (50 ile 500 m/s arası)
  time: number;        // Geçen süre
  isRunning: boolean;  // Animasyon çalışıyor mu?
  sourcePositions: Point[]; // Kaynak pozisyonları
}

const { width, height } = Dimensions.get('window');
const PI = Math.PI;
const SOUND_SPEED = 340; // Ses hızı (m/s)
const INITIAL_X = 40;    // Başlangıç x pozisyonu
const DT = 0.1;          // Zaman adımı
const ANIMATION_INTERVAL = 50; // Animasyon aralığı (ms)
const WAVE_SCALE = 0.15; // Dalga çemberlerinin ölçeği

// Varsayılan durum
const DEFAULT_STATE: DopplerEffectState = {
  velocity: 100,
  time: 0,
  isRunning: false,
  sourcePositions: []
};

export default function DopplerEffectExperiment() {
  // Boyutları hesapla
  const canvasSize = Platform.OS === 'web' 
    ? Math.min(width - 40, 600) 
    : Math.min(width - 32, height * 0.5);
  
  const Y_POSITION = canvasSize / 2; // Sabit y pozisyonu
  
  // Gözlemci pozisyonu
  const observerPosition: Point = {
    x: canvasSize * 0.75,
    y: Y_POSITION
  };

  // State
  const [state, setState] = useState<DopplerEffectState>(DEFAULT_STATE);
  
  // Animasyon referansı
  const animationRef = useRef<NodeJS.Timeout>();

  // Kaynak pozisyonunu hesapla
  const calculateSourcePosition = useCallback((
    time: number,
    velocity: number
  ): Point => {
    // Hareketi yavaşlatmak için velocity'yi ölçeklendiriyoruz
    const scaledVelocity = velocity * 0.2;
    return {
      x: INITIAL_X + (scaledVelocity * time),
      y: Y_POSITION
    };
  }, [Y_POSITION]);

  // Dalga yarıçapını hesapla
  const calculateWaveRadius = useCallback((
    time: number,
    emissionTime: number
  ): number => {
    // Dalga yayılma hızını yavaşlatıyoruz
    return SOUND_SPEED * (time - emissionTime) * WAVE_SCALE;
  }, []);

  // Dalga çemberi oluştur
  const createWaveCircle = useCallback((
    center: Point,
    radius: number,
    isRed: boolean
  ): WaveCircle => {
    return {
      center,
      radius,
      color: isRed ? 'red' : 'blue'
    };
  }, []);

  // Frekans oranını hesapla
  const calculateFrequencyRatio = useCallback((
    sourceVelocity: number,
    observerPosition: Point,
    sourcePosition: Point
  ): number => {
    const dx = observerPosition.x - sourcePosition.x;
    const dy = observerPosition.y - sourcePosition.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const cosTheta = dx / distance;
    
    // f' = f * (1 - v*cos(θ)/c)
    return 1 - (sourceVelocity * cosTheta) / SOUND_SPEED;
  }, []);

  // Animasyon adımı
  const animate = useCallback(() => {
    if (!state.isRunning) return;

    setState(prev => {
      const newTime = prev.time + DT;
      const newPosition = calculateSourcePosition(newTime, prev.velocity);
      
      // Hareket sınırlarını kontrol et
      if (newPosition.x > canvasSize - 30) {
        return { ...prev, isRunning: false };
      }

      return {
        ...prev,
        time: newTime,
        sourcePositions: [...prev.sourcePositions, newPosition]
      };
    });

    // requestAnimationFrame yerine setTimeout kullanıyoruz
    animationRef.current = setTimeout(animate, ANIMATION_INTERVAL);
  }, [state.isRunning, canvasSize, calculateSourcePosition]);

  // Animasyonu başlat/durdur
  useEffect(() => {
    if (state.isRunning) {
      animationRef.current = setTimeout(animate, ANIMATION_INTERVAL);
    } else if (animationRef.current) {
      clearTimeout(animationRef.current);
    }

    return () => {
      if (animationRef.current) {
        clearTimeout(animationRef.current);
      }
    };
  }, [state.isRunning, animate]);

  // Simülasyonu başlat/durdur
  const toggleSimulation = useCallback(() => {
    setState(prev => ({ ...prev, isRunning: !prev.isRunning }));
  }, []);

  // Simülasyonu sıfırla
  const resetSimulation = useCallback(() => {
    setState(DEFAULT_STATE);
  }, []);

  // Hız değişimi
  const handleVelocityChange = useCallback((value: number) => {
    setState(prev => ({ 
      ...DEFAULT_STATE,
      velocity: value
    }));
  }, []);

  // Mevcut kaynak pozisyonunu hesapla
  const currentPosition = calculateSourcePosition(state.time, state.velocity);
  
  // Frekans oranını hesapla
  const frequencyRatio = calculateFrequencyRatio(
    state.velocity,
    observerPosition,
    currentPosition
  );

  return (
    <ExperimentLayout
      title="Doppler Etkisi"
      titleEn="Doppler Effect"
      difficulty="Orta Seviye"
      difficultyEn="Intermediate"
      description="Bu deneyde, hareketli bir ses kaynağının Doppler etkisini gözlemleyebilirsiniz. Kaynak hızını değiştirerek frekans değişimini inceleyebilirsiniz."
      descriptionEn="In this experiment, you can observe the Doppler effect of a moving sound source. You can examine the frequency shift by changing the source velocity."
      isRunning={state.isRunning}
      onToggleSimulation={toggleSimulation}
      onReset={resetSimulation}
    >
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.instructionContainer}>
          <Text style={styles.instruction}>
            Doppler etkisi, hareketli bir ses kaynağının gözlemciye yaklaşırken veya uzaklaşırken algılanan frekansın değişmesidir.
          </Text>
          <Text style={styles.instruction}>
            Kaynak hızını değiştirerek frekans değişimini gözlemleyebilirsiniz.
          </Text>
        </View>

        <View style={styles.canvasContainer}>
          <Svg
            width={canvasSize}
            height={canvasSize}
            style={styles.svg}
          >
            {/* Arka plan */}
            <Rect
              x={0}
              y={0}
              width={canvasSize}
              height={canvasSize}
              fill="silver"
            />
            
            {/* Çalışma alanı */}
            <Rect
              x={20}
              y={20}
              width={canvasSize - 40}
              height={canvasSize - 40}
              fill="rgb(230,250,230)"
            />
            
            {/* Dalga çemberleri */}
            {state.sourcePositions.map((pos, index) => {
              const radius = calculateWaveRadius(state.time, index * DT);
              const circle = createWaveCircle(pos, radius / 3, index % 3 === 0);
              return (
                <Circle
                  key={`wave-${index}`}
                  cx={circle.center.x}
                  cy={circle.center.y}
                  r={circle.radius}
                  stroke={circle.color}
                  fill="none"
                />
              );
            })}
            
            {/* Kaynak pozisyonları */}
            {state.sourcePositions.map((pos, index) => {
              const circle = createWaveCircle(pos, 2, index % 3 === 0);
              return (
                <Circle
                  key={`source-${index}`}
                  cx={circle.center.x}
                  cy={circle.center.y}
                  r={circle.radius}
                  fill={circle.color}
                />
              );
            })}
            
            {/* Mevcut kaynak */}
            <Circle
              cx={currentPosition.x}
              cy={currentPosition.y}
              r={4}
              fill="red"
            />
            
            {/* Gözlemci */}
            <Rect
              x={observerPosition.x}
              y={observerPosition.y + 12}
              width={5}
              height={8}
              fill="green"
            />
            
            {/* Frekans oranı */}
            <SvgText
              x={30}
              y={40}
              fill="black"
              fontSize={12}
              fontWeight="bold"
            >
              f&apos;/f = {frequencyRatio.toFixed(3)}
            </SvgText>
            
            {/* 3D çerçeve */}
            <Path
              d={`
                M 20 21 L ${canvasSize - 20} 21
                M 20 20 L 20 ${canvasSize - 20}
                M 21 20 L 21 ${canvasSize - 21}
                M 20 20 L ${canvasSize - 20} 20
              `}
              stroke="rgb(130,130,130)"
              strokeWidth={1}
            />
            <Path
              d={`
                M 20 ${canvasSize - 20} L ${canvasSize - 20} ${canvasSize - 20}
                M ${canvasSize - 20} 21 L ${canvasSize - 20} ${canvasSize - 20}
                M 21 ${canvasSize - 21} L ${canvasSize - 20} ${canvasSize - 21}
                M ${canvasSize - 21} 22 L ${canvasSize - 21} ${canvasSize - 20}
              `}
              stroke="rgb(230,230,230)"
              strokeWidth={1}
            />
            
            {/* Kenar dolguları */}
            <Rect x={0} y={0} width={canvasSize} height={20} fill="silver" />
            <Rect x={0} y={0} width={20} height={canvasSize} fill="silver" />
            <Rect x={0} y={canvasSize - 20} width={canvasSize} height={20} fill="silver" />
            <Rect x={canvasSize - 20} y={0} width={20} height={canvasSize} fill="silver" />
          </Svg>
        </View>

        <View style={styles.controlsContainer}>
          <View style={styles.controlGroup}>
            <Text style={styles.label}>Kaynak Hızı: {state.velocity} m/s</Text>
            <Slider
              style={styles.slider}
              value={state.velocity}
              minimumValue={50}
              maximumValue={500}
              step={5}
              onValueChange={handleVelocityChange}
              disabled={state.isRunning}
            />
          </View>
          
          <View style={styles.infoContainer}>
            <Text style={styles.infoText}>
              Doppler etkisi, hareketli bir kaynaktan yayılan dalgaların, kaynağın hareketine bağlı olarak gözlemci tarafından farklı frekanslarda algılanması olayıdır.
            </Text>
            <Text style={styles.infoText}>
              Kaynak gözlemciye yaklaşırken, algılanan frekans artar (f&apos; &gt; f).
            </Text>
            <Text style={styles.infoText}>
              Kaynak gözlemciden uzaklaşırken, algılanan frekans azalır (f&apos; &lt; f).
            </Text>
            <Text style={styles.infoText}>
              Frekans değişimi, kaynağın hızına ve hareket yönüne bağlıdır.
            </Text>
          </View>
        </View>
      </ScrollView>
    </ExperimentLayout>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingBottom: Platform.OS === 'web' ? 50 : 200,
    padding: 16,
  },
  instructionContainer: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#f9f9f9',
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  instruction: {
    fontSize: 16,
    color: '#444',
    textAlign: 'center',
    marginBottom: 8,
  },
  canvasContainer: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  svg: {
    width: '100%',
    height: '100%',
  },
  controlsContainer: {
    width: '100%',
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 16,
  },
  controlGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 8,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  infoContainer: {
    padding: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    marginTop: 16,
  },
  infoText: {
    fontSize: 14,
    color: '#555',
    marginBottom: 8,
    lineHeight: 20,
  },
}); 