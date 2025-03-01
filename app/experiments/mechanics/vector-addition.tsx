import React, { useState, useCallback, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView, Platform, GestureResponderEvent, TouchableOpacity } from 'react-native';
import Svg, { Circle, Line, Path, Text as SvgText } from 'react-native-svg';
import Slider from '@react-native-community/slider';
import { Switch } from 'react-native';
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

interface VectorState {
  vectors: Vector[];
  basePoint: Point;
  resultant?: Vector;
  isRunning: boolean;
  numberOfVectors: 2 | 3 | 4 | 5;
  stage: 0 | 1 | 2 | 3; // 0: başlangıç, 1: animasyon, 2: sonuç gösterme, 3: düzenleme
  exception?: number; // Animasyon sırasında hareket eden vektörün indeksi
}

const { width, height } = Dimensions.get('window');
const ARROW_SIZE = 10;
const ARROW_ANGLE = Math.PI / 8;

// Vektör renkleri
const vectorColor = [
  "rgba(255,0,0,0.8)",   // Kırmızı
  "rgba(0,0,255,0.8)",   // Mavi
  "rgba(0,170,0,0.8)",   // Yeşil
  "rgba(100,100,100,0.8)", // Gri
  "rgba(255,0,255,0.8)"  // Mor
];

export default function VectorAdditionExperiment() {
  const canvasSize = Platform.OS === 'web' 
    ? Math.min(width - 40, 600) 
    : Math.min(width - 32, height * 0.5);
  
  const initialBasePoint = { 
    x: canvasSize / 2, 
    y: canvasSize / 2 
  };

  // ScrollView referansı
  const scrollViewRef = useRef<ScrollView>(null);

  // State
  const [state, setState] = useState<VectorState>({
    vectors: [],
    basePoint: initialBasePoint,
    isRunning: false,
    numberOfVectors: 3,
    stage: 0
  });

  // Dokunma/fare olayları için state
  const [touchState, setTouchState] = useState({
    isDragging: false,
    vectorIndex: -1,
    isBase: false,
    lastX: 0,
    lastY: 0
  });

  // Animasyon referansı
  const animationRef = useRef<number>();

  // Başlangıç vektörlerini oluştur
  const createInitialVectors = useCallback((
    numberOfVectors: number,
    basePoint: Point,
    radius: number = canvasSize / 4
  ): Vector[] => {
    const vectors: Vector[] = [];
    const sector = (2 * Math.PI) / numberOfVectors;

    for (let i = 0; i < numberOfVectors; i++) {
      const r = radius + (radius * 0.2 - radius * 0.05 * i) * Math.random();
      const theta = sector * (Math.random() + i / 2);
      vectors.push({
        start: { ...basePoint },
        end: {
          x: basePoint.x + r * Math.cos(theta),
          y: basePoint.y + r * Math.sin(theta)
        },
        color: vectorColor[i]
      });
    }

    return vectors;
  }, [canvasSize]);

  // Bileşke vektörü hesapla
  const calculateResultant = useCallback((vectors: Vector[]): Vector => {
    const start = vectors[0].start;
    const dx = vectors.reduce((sum, v) => sum + (v.end.x - v.start.x), 0);
    const dy = vectors.reduce((sum, v) => sum + (v.end.y - v.start.y), 0);

    return {
      start,
      end: { x: start.x + dx, y: start.y + dy },
      color: 'black'
    };
  }, []);

  // Ok başı için path oluştur
  const createArrowHeadPath = useCallback((vector: Vector): string => {
    const { start, end } = vector;
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance < 1) return '';
    
    const theta = Math.atan2(dy, dx);
    
    // Ok başı boyutları
    const arrowHeadLength = Math.min(15, distance / 3);
    const arrowHeadWidth = arrowHeadLength * 0.5;
    
    // Ok başı noktaları
    const tipX = end.x;
    const tipY = end.y;
    const baseX = tipX - arrowHeadLength * Math.cos(theta);
    const baseY = tipY - arrowHeadLength * Math.sin(theta);
    
    // Ok başı kenarları
    const leftX = baseX - arrowHeadWidth * Math.sin(theta);
    const leftY = baseY + arrowHeadWidth * Math.cos(theta);
    const rightX = baseX + arrowHeadWidth * Math.sin(theta);
    const rightY = baseY - arrowHeadWidth * Math.cos(theta);
    
    return `M ${tipX} ${tipY} L ${leftX} ${leftY} L ${rightX} ${rightY} Z`;
  }, []);

  // Web için mouse olayları
  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (state.stage === 1) return;
    
    // getBoundingClientRect hatası için düzeltme
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Merkez noktası kontrolü
    if (Math.abs(x - state.basePoint.x) < 15 && Math.abs(y - state.basePoint.y) < 15) {
      setTouchState({
        isDragging: true,
        isBase: true,
        vectorIndex: -1,
        lastX: x,
        lastY: y
      });
      return;
    }

    // Vektör ucu kontrolü
    state.vectors.forEach((vector, index) => {
      if (Math.abs(x - vector.end.x) < 15 && Math.abs(y - vector.end.y) < 15) {
        setTouchState({
          isDragging: true,
          isBase: false,
          vectorIndex: index,
          lastX: x,
          lastY: y
        });
      }
    });
  }, [state.stage, state.basePoint, state.vectors]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!touchState.isDragging) return;

    // SVG konteynerin pozisyonunu al
    const svgElement = document.querySelector('.svg-container') as HTMLElement;
    if (!svgElement) return;
    
    const rect = svgElement.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const dx = x - touchState.lastX;
    const dy = y - touchState.lastY;

    setState(prev => {
      if (touchState.isBase) {
        // Merkez noktası sürükleniyor
        const newBasePoint = { x: prev.basePoint.x + dx, y: prev.basePoint.y + dy };
        const newVectors = prev.vectors.map(v => ({
          ...v,
          start: { x: v.start.x + dx, y: v.start.y + dy },
          end: { x: v.end.x + dx, y: v.end.y + dy }
        }));
        return {
          ...prev,
          basePoint: newBasePoint,
          vectors: newVectors,
          resultant: prev.resultant ? {
            ...prev.resultant,
            start: { x: prev.resultant.start.x + dx, y: prev.resultant.start.y + dy },
            end: { x: prev.resultant.end.x + dx, y: prev.resultant.end.y + dy }
          } : undefined
        };
      } else {
        // Vektör ucu sürükleniyor
        const newVectors = [...prev.vectors];
        newVectors[touchState.vectorIndex] = {
          ...newVectors[touchState.vectorIndex],
          end: { x: newVectors[touchState.vectorIndex].end.x + dx, y: newVectors[touchState.vectorIndex].end.y + dy }
        };
        return { ...prev, vectors: newVectors };
      }
    });

    setTouchState(prev => ({
      ...prev,
      lastX: x,
      lastY: y
    }));
  }, [touchState]);

  const handleMouseUp = useCallback(() => {
    setTouchState(prev => ({
      ...prev,
      isDragging: false
    }));
  }, []);

  // ScrollView'ı kilitle/serbest bırak
  useEffect(() => {
    if (Platform.OS !== 'web' && scrollViewRef.current) {
      if (touchState.isDragging) {
        // Sürükleme sırasında ScrollView'ı kilitle
        scrollViewRef.current.setNativeProps({
          scrollEnabled: false
        });
      } else {
        // Sürükleme bittiğinde ScrollView'ı serbest bırak
        scrollViewRef.current.setNativeProps({
          scrollEnabled: true
        });
      }
    }
  }, [touchState.isDragging]);

  // Dokunma/fare olayları
  const handleTouchStart = useCallback((e: GestureResponderEvent) => {
    if (state.stage === 1) return;

    // Scroll'u engelle
    if (Platform.OS !== 'web' && scrollViewRef.current) {
      scrollViewRef.current.setNativeProps({
        scrollEnabled: false
      });
    }
    
    const touch = e.nativeEvent.touches ? e.nativeEvent.touches[0] : e.nativeEvent;
    const x = touch.locationX;
    const y = touch.locationY;

    // Merkez noktası kontrolü
    if (Math.abs(x - state.basePoint.x) < 15 && Math.abs(y - state.basePoint.y) < 15) {
      setTouchState({
        isDragging: true,
        isBase: true,
        vectorIndex: -1,
        lastX: x,
        lastY: y
      });
      return;
    }

    // Vektör ucu kontrolü
    state.vectors.forEach((vector, index) => {
      if (Math.abs(x - vector.end.x) < 15 && Math.abs(y - vector.end.y) < 15) {
        setTouchState({
          isDragging: true,
          isBase: false,
          vectorIndex: index,
          lastX: x,
          lastY: y
        });
      }
    });
  }, [state.stage, state.basePoint, state.vectors]);

  const handleTouchMove = useCallback((e: GestureResponderEvent) => {
    if (!touchState.isDragging) return;

    // Scroll'u engelle
    if (Platform.OS !== 'web' && scrollViewRef.current) {
      scrollViewRef.current.setNativeProps({
        scrollEnabled: false
      });
    }
    
    const touch = e.nativeEvent.touches ? e.nativeEvent.touches[0] : e.nativeEvent;
    const x = touch.locationX;
    const y = touch.locationY;
    const dx = x - touchState.lastX;
    const dy = y - touchState.lastY;

    setState(prev => {
      if (touchState.isBase) {
        // Merkez noktası sürükleniyor
        const newBasePoint = { x: prev.basePoint.x + dx, y: prev.basePoint.y + dy };
        const newVectors = prev.vectors.map(v => ({
          ...v,
          start: { x: v.start.x + dx, y: v.start.y + dy },
          end: { x: v.end.x + dx, y: v.end.y + dy }
        }));
        return {
          ...prev,
          basePoint: newBasePoint,
          vectors: newVectors,
          resultant: prev.resultant ? {
            ...prev.resultant,
            start: { x: prev.resultant.start.x + dx, y: prev.resultant.start.y + dy },
            end: { x: prev.resultant.end.x + dx, y: prev.resultant.end.y + dy }
          } : undefined
        };
      } else {
        // Vektör ucu sürükleniyor
        const newVectors = [...prev.vectors];
        newVectors[touchState.vectorIndex] = {
          ...newVectors[touchState.vectorIndex],
          end: { x: newVectors[touchState.vectorIndex].end.x + dx, y: newVectors[touchState.vectorIndex].end.y + dy }
        };
        return { ...prev, vectors: newVectors };
      }
    });

    setTouchState(prev => ({
      ...prev,
      lastX: x,
      lastY: y
    }));
  }, [touchState]);

  const handleTouchEnd = useCallback(() => {
    // Scroll'u serbest bırak
    if (Platform.OS !== 'web' && scrollViewRef.current) {
      scrollViewRef.current.setNativeProps({
        scrollEnabled: true
      });
    }
    
    setTouchState(prev => ({
      ...prev,
      isDragging: false
    }));
  }, []);

  // Web için mouse olaylarını document'a ekle/kaldır
  useEffect(() => {
    if (Platform.OS === 'web' && touchState.isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [touchState.isDragging, handleMouseMove, handleMouseUp]);

  // Vektör sayısını değiştir
  const handleVectorCountChange = useCallback((value: string) => {
    const count = parseInt(value);
    setState(prev => ({
      ...prev,
      numberOfVectors: count as 2 | 3 | 4 | 5,
      vectors: createInitialVectors(count, prev.basePoint),
      stage: 0,
      resultant: undefined,
      isRunning: false
    }));
  }, [createInitialVectors]);

  // Animasyonu başlat
  const startAnimation = useCallback(() => {
    setState(prev => ({ ...prev, isRunning: true, stage: 1 }));
    
    // Vektörleri uç uca eklemek için başlangıç pozisyonlarını hesapla
    let currentEnd = { ...state.basePoint };
    const vectorPositions: Vector[] = state.vectors.map((vector) => {
      const dx = vector.end.x - vector.start.x;
      const dy = vector.end.y - vector.start.y;
      
      const newVector = {
        ...vector,
        start: { ...currentEnd },
        end: {
          x: currentEnd.x + dx,
          y: currentEnd.y + dy
        }
      };
      
      currentEnd = { ...newVector.end };
      return newVector;
    });

    // Bileşke vektörü hesapla
    const resultant: Vector = {
      start: state.basePoint,
      end: vectorPositions[vectorPositions.length - 1].end,
      color: 'black'
    };

    // Animasyon adımları
    let currentStep = 0;
    const totalSteps = 60; // 1 saniye (60 frame)
    const animateStep = () => {
      if (currentStep >= totalSteps) {
        setState(prev => ({ ...prev, stage: 2, resultant }));
        return;
      }

      const progress = currentStep / totalSteps;
      
      // Her vektörün yeni pozisyonunu hesapla
      const animatedVectors = state.vectors.map((vector, index) => {
        const targetVector = vectorPositions[index];
        const startDiff = {
          x: targetVector.start.x - vector.start.x,
          y: targetVector.start.y - vector.start.y
        };
        const endDiff = {
          x: targetVector.end.x - vector.end.x,
          y: targetVector.end.y - vector.end.y
        };

        return {
          ...vector,
          start: {
            x: vector.start.x + startDiff.x * progress,
            y: vector.start.y + startDiff.y * progress
          },
          end: {
            x: vector.end.x + endDiff.x * progress,
            y: vector.end.y + endDiff.y * progress
          }
        };
      });

      setState(prev => ({
        ...prev,
        vectors: animatedVectors,
        resultant: progress > 0.8 ? {
          ...resultant,
          end: {
            x: resultant.start.x + (resultant.end.x - resultant.start.x) * ((progress - 0.8) * 5),
            y: resultant.start.y + (resultant.end.y - resultant.start.y) * ((progress - 0.8) * 5)
          }
        } : undefined
      }));

      currentStep++;
      animationRef.current = requestAnimationFrame(animateStep);
    };

    animationRef.current = requestAnimationFrame(animateStep);
  }, [state.vectors, state.basePoint]);

  // Vektörleri sıfırla
  const resetVectors = useCallback(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    
    setState(prev => ({
      ...prev,
      vectors: createInitialVectors(prev.numberOfVectors, prev.basePoint),
      stage: 0,
      resultant: undefined,
      isRunning: false
    }));
  }, [createInitialVectors]);

  // Simülasyonu başlat/durdur
  const toggleSimulation = useCallback(() => {
    if (state.isRunning) {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      setState(prev => ({ ...prev, isRunning: false }));
    } else {
      startAnimation();
    }
  }, [state.isRunning, startAnimation]);

  // Başlangıçta vektörleri oluştur
  useEffect(() => {
    setState(prev => ({
      ...prev,
      vectors: createInitialVectors(prev.numberOfVectors, prev.basePoint)
    }));
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [createInitialVectors]);

  // Grid çizgileri için path oluştur
  const createGridPath = useCallback(() => {
    let path = '';
    
    // Küçük grid çizgileri
    for (let i = 0; i <= canvasSize; i += 10) {
      path += `M ${i} 0 L ${i} ${canvasSize} `;
      path += `M 0 ${i} L ${canvasSize} ${i} `;
    }
    
    return path;
  }, [canvasSize]);

  // Büyük grid çizgileri için path oluştur
  const createLargeGridPath = useCallback(() => {
    let path = '';
    
    // Büyük grid çizgileri
    for (let i = 0; i <= canvasSize; i += 100) {
      path += `M ${i} 0 L ${i} ${canvasSize} `;
      path += `M 0 ${i} L ${canvasSize} ${i} `;
    }
    
    return path;
  }, [canvasSize]);

  return (
    <ExperimentLayout
      title="Vektör Toplama"
      titleEn="Vector Addition"
      difficulty="Orta Seviye"
      difficultyEn="Intermediate"
      description="Bu deneyde, vektörlerin toplanmasını ve bileşke vektörün oluşumunu gözlemleyebilirsiniz. Vektörlerin uçlarını sürükleyerek yönlerini ve büyüklüklerini değiştirebilirsiniz."
      descriptionEn="In this experiment, you can observe the addition of vectors and the formation of the resultant vector. You can change the direction and magnitude of vectors by dragging their endpoints."
      isRunning={state.isRunning}
      onToggleSimulation={toggleSimulation}
      onReset={resetVectors}
    >
      <ScrollView 
        ref={scrollViewRef}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
        scrollEnabled={!touchState.isDragging}
      >
        {state.stage === 0 && (
          <View style={styles.instructionContainer}>
            <Text style={styles.instruction}>
              Her bir okun ucunu sürükleyerek vektörleri değiştirebilirsiniz.
            </Text>
            <Text style={styles.instruction}>
              Merkez daireyi sürükleyerek tüm sistemi hareket ettirebilirsiniz.
            </Text>
          </View>
        )}
        
        {state.stage === 1 && (
          <View style={styles.instructionContainer}>
            <Text style={styles.instruction}>
              Vektörler toplanıyor...
            </Text>
          </View>
        )}
        
        {state.stage === 2 && (
          <View style={styles.instructionContainer}>
            <Text style={styles.instruction}>
              İçi boş ok bileşke vektörü gösterir.
            </Text>
          </View>
        )}

        <View style={styles.canvasContainer}>
          <View 
            style={styles.svgContainer}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onTouchCancel={handleTouchEnd}
          >
            {Platform.OS === 'web' && (
              <div 
                className="svg-container"
                style={{ 
                  position: 'absolute', 
                  width: '100%', 
                  height: '100%', 
                  zIndex: 10,
                  cursor: touchState.isDragging ? 'grabbing' : 'grab'
                }}
                onMouseDown={handleMouseDown}
              />
            )}
            <Svg
              width={canvasSize}
              height={canvasSize}
              style={styles.svg}
            >
              {/* Arka plan */}
              <Path
                d={`M 0 0 H ${canvasSize} V ${canvasSize} H 0 Z`}
                fill="white"
              />
              
              {/* Grid çizgileri */}
              <Path
                d={createGridPath()}
                stroke="rgb(200, 200, 255)"
                strokeWidth={1}
              />
              
              <Path
                d={createLargeGridPath()}
                stroke="rgb(155, 155, 255)"
                strokeWidth={1}
              />
              
              {/* Merkez noktası */}
              <Circle
                cx={state.basePoint.x}
                cy={state.basePoint.y}
                r={15}
                fill="#81DAF5"
              />
              
              {/* Vektörler */}
              {state.vectors.map((vector, index) => (
                <React.Fragment key={index}>
                  {/* Vektör gövdesi */}
                  <Line
                    x1={vector.start.x}
                    y1={vector.start.y}
                    x2={vector.end.x}
                    y2={vector.end.y}
                    stroke={vector.color}
                    strokeWidth={2}
                  />
                  
                  {/* Vektör ok başı */}
                  <Path
                    d={createArrowHeadPath(vector)}
                    fill={vector.color}
                    stroke={vector.color}
                    strokeWidth={2}
                  />
                </React.Fragment>
              ))}
              
              {/* Bileşke vektör */}
              {state.resultant && state.stage === 2 && (
                <>
                  <Line
                    x1={state.resultant.start.x}
                    y1={state.resultant.start.y}
                    x2={state.resultant.end.x}
                    y2={state.resultant.end.y}
                    stroke="black"
                    strokeWidth={4}
                    strokeDasharray="5,5"
                  />
                  
                  <Path
                    d={createArrowHeadPath(state.resultant)}
                    fill="black"
                    stroke="black"
                    strokeWidth={2}
                  />
                </>
              )}
            </Svg>
          </View>
        </View>

        <View style={styles.controlsContainer}>
          <View style={styles.controlGroup}>
            <Text style={styles.label}>Vektör Sayısı:</Text>
            <View style={styles.segmentedButtonsContainer}>
              {[2, 3, 4, 5].map((num) => (
                <TouchableOpacity
                  key={num}
                  style={[
                    styles.segmentedButton,
                    state.numberOfVectors === num && styles.segmentedButtonActive,
                    state.stage !== 0 && styles.segmentedButtonDisabled
                  ]}
                  onPress={() => state.stage === 0 && handleVectorCountChange(num.toString())}
                  disabled={state.stage !== 0}
                >
                  <Text style={[
                    styles.segmentedButtonText,
                    state.numberOfVectors === num && styles.segmentedButtonTextActive,
                    state.stage !== 0 && styles.segmentedButtonTextDisabled
                  ]}>
                    {num}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
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
  svgContainer: {
    width: '100%',
    height: '100%',
    backgroundColor: 'white',
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
  segmentedButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  segmentedButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 2,
  },
  segmentedButtonActive: {
    backgroundColor: '#3498db',
    borderColor: '#2980b9',
  },
  segmentedButtonDisabled: {
    opacity: 0.5,
  },
  segmentedButtonText: {
    fontSize: 14,
    color: '#333',
  },
  segmentedButtonTextActive: {
    color: 'white',
    fontWeight: 'bold',
  },
  segmentedButtonTextDisabled: {
    color: '#999',
  },
}); 