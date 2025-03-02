import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Platform, useWindowDimensions } from 'react-native';
import Svg, { Circle, Line, Path, Text as SvgText } from 'react-native-svg';
import WeightedPulleyControls from './components/WeightedPulleyControls';
import { WeightedPulleyState, DEFAULT_STATE } from './types';
import {
  RAD,
  calculateRK4,
  calculateEnergies,
  calculateEquilibriumAngle,
  calculatePeriod,
  PULLEY_RADIUS,
  MASS_RADIUS,
  DT
} from './utils';

const WeightedPulleyExperiment: React.FC = () => {
  const { width, height } = useWindowDimensions();
  const [state, setState] = useState<WeightedPulleyState>(DEFAULT_STATE);
  const animationRef = useRef<number>();

  // Platform'a göre boyutları ayarla
  const getResponsiveDimensions = useCallback(() => {
    const isWeb = Platform.OS === 'web';
    
    // Web için sabit boyut
    const WEB_WIDTH = 420;
    const WEB_HEIGHT = 530;
    
    // Mobil için maksimum boyut
    const MOBILE_MAX_WIDTH = width * 0.9;
    const MOBILE_MAX_HEIGHT = height * 0.7;
    
    if (isWeb) {
      return {
        svgWidth: WEB_WIDTH,
        svgHeight: WEB_HEIGHT,
        scale: 100,
        padding: 20
      };
    } else {
      const svgSize = Math.min(MOBILE_MAX_WIDTH, MOBILE_MAX_HEIGHT);
      return {
        svgWidth: svgSize,
        svgHeight: svgSize * 1.2,
        scale: svgSize * 0.4,
        padding: 10
      };
    }
  }, [width, height]);

  const { svgWidth, svgHeight, scale, padding } = getResponsiveDimensions();
  const centerX = svgWidth / 2;
  const centerY = svgHeight / 4;

  const animate = useCallback(() => {
    if (!state.isRunning) return;

    // RK4 integrasyonu
    const { phi1, dphi1 } = calculateRK4(
      state.time,
      state.phi,
      state.dphi,
      {
        inertia: state.inertia,
        massM: state.massM / 1000,
        massm: state.massm / 1000
      }
    );

    // Enerjileri hesapla
    const energies = calculateEnergies(
      phi1,
      dphi1,
      {
        inertia: state.inertia,
        massM: state.massM / 1000,
        massm: state.massm / 1000
      }
    );

    // Periyot hesapla
    const period = calculatePeriod({
      inertia: state.inertia,
      massM: state.massM / 1000,
      massm: state.massm / 1000
    });

    setState(prev => ({
      ...prev,
      time: prev.time + DT,
      phi: phi1,
      dphi: dphi1,
      ...energies,
      period: period || 0
    }));

    animationRef.current = requestAnimationFrame(animate);
  }, [state]);

  useEffect(() => {
    if (state.isRunning) {
      animationRef.current = requestAnimationFrame(animate);
    } else if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [state.isRunning, animate]);

  const handleStart = () => {
    setState(prev => ({ ...prev, isRunning: !prev.isRunning }));
  };

  const handleReset = () => {
    setState(prev => ({
      ...prev,
      time: 0,
      isRunning: false,
      phi: prev.angle * RAD,
      dphi: 0,
      potentialEnergy: 0,
      kineticEnergy: 0,
      totalEnergy: 0
    }));
  };

  const handleInertiaChange = (inertia: number) => {
    setState(prev => ({ ...prev, inertia }));
    handleReset();
  };

  const handleMassMChange = (massM: number) => {
    setState(prev => ({ ...prev, massM }));
    handleReset();
  };

  const handleMassmChange = (massm: number) => {
    setState(prev => ({ ...prev, massm }));
    handleReset();
  };

  const handleAngleChange = (angle: number) => {
    setState(prev => ({ 
      ...prev, 
      angle,
      phi: angle * RAD
    }));
    handleReset();
  };

  // Kütle konumlarını hesapla
  const R = 80; // Makara yarıçapı (piksel)
  const r = 40; // Kütle yarıçapı (piksel)
  const L = 120 + (100 * PULLEY_RADIUS * state.phi);
  const Xf = centerX - R;

  // Bağlı kütle m (kırmızı) konumu
  const Xm = centerX + (r * Math.sin(state.phi));
  const Ym = centerY + (r * Math.cos(state.phi));

  // İp yolu
  const stringPath = `
    M ${Xf} ${centerY + L}
    L ${Xf} ${centerY}
    A ${R} ${R} 0 0 1 ${centerX + R * Math.sin(state.phi)} ${centerY + R * (1 - Math.cos(state.phi))}
    L ${Xm} ${Ym}
  `;

  // Denge açısı
  const equilibriumAngle = calculateEquilibriumAngle(state.massM / 1000, state.massm / 1000);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.leftPanel}>
          <WeightedPulleyControls
            state={state}
            onStart={handleStart}
            onReset={handleReset}
            onInertiaChange={handleInertiaChange}
            onMassMChange={handleMassMChange}
            onMassmChange={handleMassmChange}
            onAngleChange={handleAngleChange}
          />
        </View>

        <View style={styles.mainContent}>
          <Svg width={svgWidth} height={svgHeight} style={styles.svg}>
            {/* Arka plan */}
            <Circle
              cx={centerX}
              cy={centerY}
              r={98}
              fill="none"
              stroke="#333"
              strokeWidth="1"
              strokeDasharray="5,5"
            />

            {/* Açı ölçeği */}
            {Array.from({ length: 19 }, (_, i) => {
              const angle = (-80 + i * 10) * RAD;
              const x1 = centerX + (98 * Math.cos(angle));
              const y1 = centerY + (98 * Math.sin(angle));
              const x2 = centerX + (108 * Math.cos(angle));
              const y2 = centerY + (108 * Math.sin(angle));
              return (
                <Line
                  key={i}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke="#333"
                  strokeWidth="1"
                />
              );
            })}

            {/* Denge açısı */}
            {equilibriumAngle !== null && (
              <Line
                x1={centerX + (98 * Math.cos(Math.PI / 2 - equilibriumAngle))}
                y1={centerY + (98 * Math.sin(Math.PI / 2 - equilibriumAngle))}
                x2={centerX + (118 * Math.cos(Math.PI / 2 - equilibriumAngle))}
                y2={centerY + (118 * Math.sin(Math.PI / 2 - equilibriumAngle))}
                stroke="red"
                strokeWidth="2"
              />
            )}

            {/* Makara */}
            <Circle
              cx={centerX}
              cy={centerY}
              r={R}
              fill="rgba(0,255,255,0.3)"
              stroke="#DAA520"
              strokeWidth="2"
            />

            {/* Makara deseni */}
            {Array.from({ length: 3 }, (_, i) => {
              const startAngle = -state.phi + i * 2 * Math.PI / 3;
              const endAngle = startAngle + Math.PI / 3;
              const d = `
                M ${centerX} ${centerY}
                L ${centerX + R * Math.cos(startAngle)} ${centerY + R * Math.sin(startAngle)}
                A ${R} ${R} 0 0 1 ${centerX + R * Math.cos(endAngle)} ${centerY + R * Math.sin(endAngle)}
                Z
              `;
              return <Path key={i} d={d} fill="yellow" />;
            })}

            {/* İp */}
            <Path d={stringPath} stroke="#666" strokeWidth="1" fill="none" />

            {/* Kütleler */}
            <Circle
              cx={Xm}
              cy={Ym}
              r={10}
              fill="red"
              stroke="#333"
              strokeWidth="1"
            />
            <Circle
              cx={Xf}
              cy={centerY + L}
              r={15}
              fill="blue"
              stroke="#333"
              strokeWidth="1"
            />

            {/* Ölçüm değerleri */}
            <SvgText
              x={250}
              y={70}
              fill="black"
              fontSize={12}
              fontWeight="bold"
              fontFamily="Courier"
            >
              t = {state.time.toFixed(2)} s
            </SvgText>
            <SvgText
              x={250}
              y={90}
              fill="black"
              fontSize={12}
              fontWeight="bold"
              fontFamily="Courier"
            >
              φ = {((state.phi / Math.PI * 180) + 90).toFixed(1)}°
            </SvgText>
            {state.massM * PULLEY_RADIUS > state.massm * MASS_RADIUS ? (
              <SvgText
                x={230}
                y={110}
                fill="red"
                fontSize={12}
                fontWeight="bold"
                fontFamily="Courier"
              >
                Denge mümkün değil
              </SvgText>
            ) : equilibriumAngle !== null && (
              <SvgText
                x={250}
                y={110}
                fill="black"
                fontSize={12}
                fontWeight="bold"
                fontFamily="Courier"
              >
                φe = {(equilibriumAngle * 180 / Math.PI).toFixed(1)}°
              </SvgText>
            )}
            <SvgText
              x={250}
              y={130}
              fill="black"
              fontSize={12}
              fontWeight="bold"
              fontFamily="Courier"
            >
              Ep = {state.potentialEnergy.toFixed(6)} J
            </SvgText>
            <SvgText
              x={250}
              y={150}
              fill="black"
              fontSize={12}
              fontWeight="bold"
              fontFamily="Courier"
            >
              Ec = {state.kineticEnergy.toFixed(6)} J
            </SvgText>
            <SvgText
              x={250}
              y={170}
              fill="black"
              fontSize={12}
              fontWeight="bold"
              fontFamily="Courier"
            >
              Et = {state.totalEnergy.toExponential(3)} J
            </SvgText>
            {state.period > 0 && (
              <SvgText
                x={250}
                y={190}
                fill="black"
                fontSize={12}
                fontWeight="bold"
                fontFamily="Courier"
              >
                T = {state.period.toFixed(2)} s
              </SvgText>
            )}
          </Svg>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    padding: Platform.OS === 'web' ? 24 : 12,
    gap: Platform.OS === 'web' ? 24 : 12,
  },
  leftPanel: {
    width: Platform.OS === 'web' ? 300 : '35%',
    height: '100%',
  },
  mainContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  svg: {
    backgroundColor: '#fff',
    borderRadius: 12,
    ...Platform.select({
      web: {
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
      },
      default: {
        elevation: 4
      }
    })
  }
});

export default WeightedPulleyExperiment; 