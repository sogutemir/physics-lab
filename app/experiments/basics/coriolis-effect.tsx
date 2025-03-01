import React, { useCallback, useEffect, useRef, useState, useMemo } from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView, Platform, TouchableOpacity } from 'react-native';
import Svg, { Circle, Line, Path, G, Text as SvgText } from 'react-native-svg';
import Slider from '@react-native-community/slider';
import ExperimentLayout from '../../../components/ExperimentLayout';

// Tip tanımlamaları
interface Point {
  x: number;
  y: number;
}

interface Vector {
  start: Point;
  end: Point;
  color: string;
}

interface CoriolisEffectState {
  x0: number;          // Başlangıç x pozisyonu (-1.0 ile 0.95 arası)
  velocity: number;    // Doğrusal hız (0.1 ile 2.5 arası)
  angularVelocity: number; // Açısal hız (0.5 ile 5.0 arası)
  time: number;        // Geçen süre
  isRunning: boolean;  // Animasyon çalışıyor mu?
  trajectory: Point[]; // Hareket yörüngesi
}

const { width, height } = Dimensions.get('window');
const PI = Math.PI;
const DT = 0.02; // Zaman adımı
const ARROW_SIZE = 10; // Ok başı boyutu
const ARROW_ANGLE = PI / 8; // Ok başı açısı

// Varsayılan durum
const DEFAULT_STATE: CoriolisEffectState = {
  x0: -0.5,
  velocity: 0.2,
  angularVelocity: 3.0,
  time: 0,
  isRunning: false,
  trajectory: []
};

export default function CoriolisEffectExperiment() {
  // Boyutları hesapla
  const canvasSize = Platform.OS === 'web' 
    ? Math.min(width - 40, 600) 
    : Math.min(width - 32, height * 0.5);
  
  const RADIUS = canvasSize / 3; // Dönme dairesi yarıçapı
  
  // Merkez noktası
  const center: Point = useMemo(() => ({
    x: canvasSize / 2,
    y: canvasSize / 2
  }), [canvasSize]);

  // State
  const [state, setState] = useState<CoriolisEffectState>(DEFAULT_STATE);
  
  // Animasyon referansı
  const animationRef = useRef<number>();
  const stateRef = useRef(state);

  // State'i ref'te güncelle
  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  // Pozisyon hesapla
  const calculatePosition = useCallback((
    x0: number,
    velocity: number,
    angularVelocity: number,
    time: number
  ): Point => {
    const x = x0 + velocity * time;
    const cos = Math.cos(angularVelocity * time);
    const sin = Math.sin(angularVelocity * time);
    
    return {
      x: center.x + (x * cos * RADIUS),
      y: center.y - (x * sin * RADIUS)
    };
  }, [center, RADIUS]);

  // Hız vektörü hesapla
  const calculateVelocityVector = useCallback((
    position: Point,
    x: number,
    velocity: number,
    angularVelocity: number,
    time: number,
    scale: number = 15
  ): Vector => {
    const cos = Math.cos(angularVelocity * time);
    const sin = Math.sin(angularVelocity * time);
    
    const vx = scale * (velocity * cos - x * angularVelocity * sin);
    const vy = scale * (velocity * sin + x * angularVelocity * cos);
    
    return {
      start: position,
      end: {
        x: position.x + vx,
        y: position.y - vy
      },
      color: 'black'
    };
  }, []);

  // Coriolis vektörü hesapla
  const calculateCoriolisVector = useCallback((
    position: Point,
    x: number,
    velocity: number,
    angularVelocity: number,
    time: number,
    scale: number = 20
  ): Vector => {
    const cos = Math.cos(angularVelocity * time);
    const sin = Math.sin(angularVelocity * time);
    const K = scale / angularVelocity;
    
    const ax = -K * angularVelocity * (velocity * sin + x * angularVelocity * cos);
    const ay = K * angularVelocity * (velocity * cos - x * angularVelocity * sin);
    
    return {
      start: position,
      end: {
        x: position.x + ax,
        y: position.y - ay
      },
      color: 'green'
    };
  }, []);

  // Merkezcil vektör hesapla
  const calculateCentripetalVector = useCallback((
    position: Point,
    x: number,
    angularVelocity: number,
    time: number,
    scale: number = 20
  ): Vector => {
    const cos = Math.cos(angularVelocity * time);
    const sin = Math.sin(angularVelocity * time);
    const K = scale / angularVelocity;
    
    const ax = K * angularVelocity * angularVelocity * x * cos;
    const ay = K * angularVelocity * angularVelocity * x * sin;
    
    return {
      start: position,
      end: {
        x: position.x + ax,
        y: position.y - ay
      },
      color: 'blue'
    };
  }, []);

  // Vektör çizimi için path oluştur
  const createVectorPath = useCallback((vector: Vector): string => {
    const { start, end } = vector;
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const angle = Math.atan2(dy, dx);
    const length = Math.sqrt(dx * dx + dy * dy);
    
    let path = `M ${start.x} ${start.y} L ${end.x} ${end.y}`;
    
    if (length >= ARROW_SIZE) {
      // Ok başını ekle
      path += ` M ${end.x} ${end.y} L ${end.x - ARROW_SIZE * Math.cos(angle - ARROW_ANGLE)} ${end.y - ARROW_SIZE * Math.sin(angle - ARROW_ANGLE)}`;
      path += ` M ${end.x} ${end.y} L ${end.x - ARROW_SIZE * Math.cos(angle + ARROW_ANGLE)} ${end.y - ARROW_SIZE * Math.sin(angle + ARROW_ANGLE)}`;
    }
    
    return path;
  }, []);

  // Animasyon adımı
  const animate = useCallback(() => {
    if (!stateRef.current.isRunning) {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = undefined;
      }
      return;
    }

    setState(prev => {
      const newTime = prev.time + DT;
      const x = prev.x0 + prev.velocity * newTime;
      
      // Hareket sınırlarını kontrol et
      if (x >= 0.99) {
        return { ...prev, isRunning: false };
      }

      const newPosition = calculatePosition(
        prev.x0,
        prev.velocity,
        prev.angularVelocity,
        newTime
      );

      return {
        ...prev,
        time: newTime,
        trajectory: [...prev.trajectory, newPosition]
      };
    });

    animationRef.current = requestAnimationFrame(animate);
  }, [calculatePosition]);

  // Animasyonu başlat/durdur
  useEffect(() => {
    if (state.isRunning && !animationRef.current) {
      animate();
    }
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = undefined;
      }
    };
  }, [state.isRunning, animate]);

  // Simülasyonu başlat/durdur
  const toggleSimulation = useCallback(() => {
    setState(prev => ({ ...prev, isRunning: !prev.isRunning }));
  }, []);

  // Simülasyonu sıfırla
  const resetSimulation = useCallback(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = undefined;
    }
    setState({
      ...DEFAULT_STATE,
      trajectory: []
    });
  }, []);

  // Parametre değişimi
  const handleParameterChange = useCallback((parameter: 'x0' | 'velocity' | 'angularVelocity', value: number) => {
    setState(prev => ({ ...prev, [parameter]: value }));
  }, []);

  // Mevcut pozisyonu hesapla
  const currentPosition = calculatePosition(
    state.x0,
    state.velocity,
    state.angularVelocity,
    state.time
  );

  // Vektörleri hesapla
  const x = state.x0 + state.velocity * state.time;
  
  const velocityVector = calculateVelocityVector(
    currentPosition,
    x,
    state.velocity,
    state.angularVelocity,
    state.time
  );
  
  const coriolisVector = calculateCoriolisVector(
    currentPosition,
    x,
    state.velocity,
    state.angularVelocity,
    state.time
  );
  
  const centripetalVector = calculateCentripetalVector(
    currentPosition,
    x,
    state.angularVelocity,
    state.time
  );

  return (
    <ExperimentLayout
      title="Coriolis Etkisi"
      titleEn="Coriolis Effect"
      difficulty="İleri Seviye"
      difficultyEn="Advanced"
      description="Bu deneyde, dönen bir referans çerçevesinde hareket eden bir cismin Coriolis etkisini gözlemleyebilirsiniz."
      descriptionEn="In this experiment, you can observe the Coriolis effect on an object moving in a rotating reference frame."
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
            Coriolis etkisi, dönen bir referans çerçevesinde hareket eden bir cismin, dönme nedeniyle görünüşte sapma göstermesidir.
          </Text>
          <Text style={styles.instruction}>
            Parametreleri değiştirerek Coriolis etkisinin büyüklüğünü ve yönünü gözlemleyebilirsiniz.
          </Text>
        </View>

        <View style={styles.canvasContainer}>
          <Svg
            width={canvasSize}
            height={canvasSize}
            style={styles.svg}
          >
            {/* Arka plan */}
            <Circle
              cx={center.x}
              cy={center.y}
              r={canvasSize / 2}
              fill="silver"
            />
            
            {/* Dönme dairesi */}
            <Circle
              cx={center.x}
              cy={center.y}
              r={RADIUS}
              fill="yellow"
              stroke="black"
              strokeWidth={2}
            />
            
            {/* Sabit eksenler */}
            <Path
              d={`M ${center.x - RADIUS - 20} ${center.y} L ${center.x + RADIUS + 20} ${center.y}`}
              stroke="blue"
              strokeWidth={1}
            />
            <Path
              d={`M ${center.x} ${center.y + RADIUS + 20} L ${center.x} ${center.y - RADIUS - 20}`}
              stroke="blue"
              strokeWidth={1}
            />
            
            {/* Dönen eksenler */}
            {(() => {
              const cos = Math.cos(state.angularVelocity * state.time);
              const sin = Math.sin(state.angularVelocity * state.time);
              
              return (
                <>
                  <Path
                    d={`M ${center.x - RADIUS * cos} ${center.y + RADIUS * sin} L ${center.x + RADIUS * cos} ${center.y - RADIUS * sin}`}
                    stroke="gray"
                    strokeWidth={1}
                  />
                  <Path
                    d={`M ${center.x + RADIUS * sin} ${center.y + RADIUS * cos} L ${center.x - RADIUS * sin} ${center.y - RADIUS * cos}`}
                    stroke="gray"
                    strokeWidth={1}
                  />
                </>
              );
            })()}
            
            {/* Yörünge */}
            {state.trajectory.length > 1 && (
              <Path
                d={state.trajectory.map((point, i) => 
                  i === 0 ? `M ${point.x} ${point.y}` : `L ${point.x} ${point.y}`
                ).join(' ')}
                stroke="red"
                strokeWidth={1.5}
                fill="none"
              />
            )}
            
            {/* Vektörler */}
            <Path
              d={createVectorPath(velocityVector)}
              stroke="black"
              strokeWidth={1.5}
              fill="none"
            />
            
            <Path
              d={createVectorPath(coriolisVector)}
              stroke="green"
              strokeWidth={1.5}
              fill="none"
            />
            
            <Path
              d={createVectorPath(centripetalVector)}
              stroke="blue"
              strokeWidth={1.5}
              fill="none"
            />
            
            {/* Zaman göstergesi */}
            <G transform={`translate(${canvasSize - 120}, 40)`}>
              <SvgText
                fill="red"
                fontSize={14}
                fontWeight="bold"
              >
                t = {state.time.toFixed(2)}
              </SvgText>
            </G>
          </Svg>
        </View>

        <View style={styles.controlsContainer}>
          <View style={styles.controlGroup}>
            <Text style={styles.label}>Başlangıç Pozisyonu (x₀): {state.x0.toFixed(2)}</Text>
            <Slider
              style={styles.slider}
              value={state.x0}
              minimumValue={-1.0}
              maximumValue={0.95}
              step={0.05}
              onValueChange={(value) => handleParameterChange('x0', value)}
              disabled={state.isRunning}
            />
          </View>
          
          <View style={styles.controlGroup}>
            <Text style={styles.label}>Doğrusal Hız (v): {state.velocity.toFixed(2)}</Text>
            <Slider
              style={styles.slider}
              value={state.velocity}
              minimumValue={0.1}
              maximumValue={2.5}
              step={0.1}
              onValueChange={(value) => handleParameterChange('velocity', value)}
              disabled={state.isRunning}
            />
          </View>
          
          <View style={styles.controlGroup}>
            <Text style={styles.label}>Açısal Hız (ω): {state.angularVelocity.toFixed(1)}</Text>
            <Slider
              style={styles.slider}
              value={state.angularVelocity}
              minimumValue={0.5}
              maximumValue={5.0}
              step={0.5}
              onValueChange={(value) => handleParameterChange('angularVelocity', value)}
              disabled={state.isRunning}
            />
          </View>
          
          <View style={styles.infoContainer}>
            <Text style={styles.infoText}>
              Coriolis etkisi, dönen bir referans çerçevesinde hareket eden bir cismin, dönme nedeniyle görünüşte sapma göstermesidir.
            </Text>
            <Text style={styles.infoText}>
              Siyah vektör: Hız vektörü
            </Text>
            <Text style={styles.infoText}>
              Yeşil vektör: Coriolis kuvveti
            </Text>
            <Text style={styles.infoText}>
              Mavi vektör: Merkezcil kuvvet
            </Text>
            <Text style={styles.infoText}>
              Coriolis etkisi, Dünya'nın dönüşü nedeniyle rüzgarların, okyanus akıntılarının ve füzelerin yörüngelerinin sapmasına neden olur.
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