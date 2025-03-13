import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Animated,
} from 'react-native';
import Svg, {
  Line,
  Circle,
  Path,
  G,
  Text as SvgText,
  Rect,
  Polygon,
  Ellipse,
  LinearGradient,
  Stop,
  Defs,
} from 'react-native-svg';
import { useLanguage } from '../../../../../components/LanguageContext';
import {
  ArrowDown,
  RotateCcw,
  Grid,
  Zap,
  Magnet,
  Eye,
  EyeOff,
  Plus,
  Minus,
} from 'lucide-react-native';
import { FieldType, MagneticSimulatorProps } from './types';

const MagneticSimulator: React.FC<MagneticSimulatorProps> = ({
  currentIntensity,
  wireDistance,
  coilTurns,
  fieldType,
  showFieldLines,
  animateField,
  onChangeFieldType,
  onToggleAnimation,
  onToggleFieldLines,
  onCoilTurnsChange,
}) => {
  const { language, t } = useLanguage();
  const [screenWidth, setScreenWidth] = useState(
    Dimensions.get('window').width
  );
  const animatedValue = useRef(new Animated.Value(0)).current;
  const svgWidth = screenWidth > 600 ? 500 : screenWidth - 40;
  const svgHeight = 400;
  const [animationPhase, setAnimationPhase] = useState(0);

  useEffect(() => {
    const updateLayout = () => {
      setScreenWidth(Dimensions.get('window').width);
    };

    Dimensions.addEventListener('change', updateLayout);
    return () => {
      const dimensionsHandler = Dimensions.addEventListener(
        'change',
        updateLayout
      );
      dimensionsHandler.remove();
    };
  }, []);

  useEffect(() => {
    let animationInterval: NodeJS.Timeout;

    if (animateField) {
      const animation = Animated.loop(
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        })
      );
      animation.start();

      animationInterval = setInterval(() => {
        setAnimationPhase((prev) => (prev + 0.02) % 1);
      }, 50);

      return () => {
        animation.stop();
        clearInterval(animationInterval);
      };
    } else {
      animatedValue.setValue(0);
      setAnimationPhase(0);
    }
  }, [animateField, animatedValue]);

  const renderStraightWireMagneticField = () => {
    const centerX = svgWidth / 2;
    const centerY = svgHeight / 2;
    const radius = Math.min(svgWidth, svgHeight) * 0.4;

    const normalizedCurrent = currentIntensity / 10;
    const normalizedDistance = wireDistance / 50;
    const fieldRadius =
      radius * normalizedCurrent * (1 - 0.3 * normalizedDistance);

    const lineCount = 16;
    const angleStep = (2 * Math.PI) / lineCount;

    return (
      <G>
        {/* Düz tel */}
        <Line
          x1={centerX}
          y1={centerY - radius}
          x2={centerX}
          y2={centerY + radius}
          stroke="#333"
          strokeWidth={6}
        />

        {/* Akım yönü oku */}
        <Polygon
          points={`${centerX},${centerY - radius - 20} ${centerX - 10},${
            centerY - radius - 10
          } ${centerX + 10},${centerY - radius - 10}`}
          fill="#1E90FF"
        />

        {/* Akım etiketi */}
        <SvgText
          x={centerX}
          y={centerY - radius - 30}
          textAnchor="middle"
          fill="#1E90FF"
          fontWeight="bold"
          fontSize="16"
        >
          I = {currentIntensity} A
        </SvgText>

        {/* Manyetik alan çizgileri */}
        {showFieldLines && (
          <>
            <Circle
              cx={centerX}
              cy={centerY}
              r={fieldRadius}
              fill="rgba(147, 112, 219, 0.15)"
            />
            {Array.from({ length: lineCount }).map((_, i) => {
              const angle =
                i * angleStep +
                (animateField ? animationPhase * Math.PI * 2 : 0);
              const x = centerX + Math.cos(angle) * fieldRadius;
              const y = centerY + Math.sin(angle) * fieldRadius;

              const arrowLength = 30;
              const arrowAngle = 0.3;
              const startX = x - (Math.cos(angle) * arrowLength) / 2;
              const startY = y - (Math.sin(angle) * arrowLength) / 2;
              const endX = x + (Math.cos(angle) * arrowLength) / 2;
              const endY = y + (Math.sin(angle) * arrowLength) / 2;

              return (
                <G
                  key={`field-line-${i}`}
                  stroke="rgba(147, 112, 219, 0.7)"
                  strokeWidth={2}
                >
                  <Line x1={startX} y1={startY} x2={endX} y2={endY} />
                  <Line
                    x1={endX}
                    y1={endY}
                    x2={endX - Math.cos(angle + arrowAngle) * 10}
                    y2={endY - Math.sin(angle + arrowAngle) * 10}
                  />
                  <Line
                    x1={endX}
                    y1={endY}
                    x2={endX - Math.cos(angle - arrowAngle) * 10}
                    y2={endY - Math.sin(angle - arrowAngle) * 10}
                  />
                </G>
              );
            })}
          </>
        )}

        {/* Test parçacığı */}
        <Circle
          cx={centerX + wireDistance * 4}
          cy={centerY}
          r={8}
          fill="#F95738"
        />
      </G>
    );
  };

  const renderCoilMagneticField = () => {
    const centerX = svgWidth / 2;
    const centerY = svgHeight / 2;
    const radius = Math.min(svgWidth, svgHeight) * 0.4;

    const coilWidth = radius * 0.4;
    const coilHeight = radius * 1.2;
    const turnSpacing = coilHeight / (coilTurns + 1);

    const fieldStrength = (currentIntensity * coilTurns) / 10;

    return (
      <G>
        {/* Bobin sarımları */}
        {Array.from({ length: coilTurns }).map((_, i) => (
          <Ellipse
            key={`turn-${i}`}
            cx={centerX}
            cy={centerY - coilHeight / 2 + (i + 1) * turnSpacing}
            rx={coilWidth / 2}
            ry={coilWidth / 6}
            stroke="#333"
            strokeWidth={3}
            fill="none"
          />
        ))}

        {/* Akım yönü ve etiketler */}
        <Polygon
          points={`${centerX},${centerY - coilHeight / 2 - 20} ${
            centerX - 10
          },${centerY - coilHeight / 2 - 10} ${centerX + 10},${
            centerY - coilHeight / 2 - 10
          }`}
          fill="#1E90FF"
        />

        <SvgText
          x={centerX}
          y={centerY - coilHeight / 2 - 30}
          textAnchor="middle"
          fill="#1E90FF"
          fontWeight="bold"
          fontSize="16"
        >
          I = {currentIntensity} A
        </SvgText>

        {/* Manyetik alan çizgileri */}
        {showFieldLines && (
          <>
            {/* İç alan çizgileri */}
            {Array.from({ length: 7 }).map((_, i) => {
              const x = centerX - coilWidth * 0.4 + (i * (coilWidth * 0.8)) / 6;
              return (
                <G
                  key={`inner-field-${i}`}
                  stroke="rgba(147, 112, 219, 0.7)"
                  strokeWidth={2}
                >
                  <Line
                    x1={x}
                    y1={centerY - coilHeight / 4}
                    x2={x}
                    y2={centerY + coilHeight / 4}
                  />
                  <Line
                    x1={x}
                    y1={centerY + coilHeight / 4}
                    x2={x - 5}
                    y2={centerY + coilHeight / 4 - 10}
                  />
                  <Line
                    x1={x}
                    y1={centerY + coilHeight / 4}
                    x2={x + 5}
                    y2={centerY + coilHeight / 4 - 10}
                  />
                </G>
              );
            })}

            {/* Dış alan göstergesi */}
            <Circle
              cx={centerX}
              cy={centerY}
              r={radius * 0.8}
              fill="none"
              stroke="rgba(147, 112, 219, 0.15)"
              strokeWidth={radius * 0.35 * fieldStrength}
            />
          </>
        )}
      </G>
    );
  };

  const renderBarMagnetField = () => {
    const centerX = svgWidth / 2;
    const centerY = svgHeight / 2;
    const radius = Math.min(svgWidth, svgHeight) * 0.4;

    const magnetWidth = radius * 0.8;
    const magnetHeight = radius * 0.3;

    return (
      <G>
        <Defs>
          <LinearGradient id="magnetGradient" x1="0" y1="0" x2="1" y2="0">
            <Stop offset="0" stopColor="#F95738" />
            <Stop offset="1" stopColor="#1E90FF" />
          </LinearGradient>
        </Defs>

        {/* Mıknatıs gövdesi */}
        <Rect
          x={centerX - magnetWidth / 2}
          y={centerY - magnetHeight / 2}
          width={magnetWidth}
          height={magnetHeight}
          fill="url(#magnetGradient)"
        />

        {/* Kutup etiketleri */}
        <SvgText
          x={centerX - magnetWidth / 4}
          y={centerY + 5}
          textAnchor="middle"
          fill="white"
          fontWeight="bold"
          fontSize="20"
        >
          N
        </SvgText>
        <SvgText
          x={centerX + magnetWidth / 4}
          y={centerY + 5}
          textAnchor="middle"
          fill="white"
          fontWeight="bold"
          fontSize="20"
        >
          S
        </SvgText>

        {/* Manyetik alan çizgileri */}
        {showFieldLines && (
          <>
            {Array.from({ length: 8 }).map((_, i) => {
              const offsetY = ((i - 4 + 0.5) * (magnetHeight * 1.5)) / 8;
              return (
                <Path
                  key={`field-line-${i}`}
                  d={`M ${centerX - magnetWidth / 2} ${
                    centerY + offsetY
                  } Q ${centerX} ${centerY + offsetY * 3} ${
                    centerX + magnetWidth / 2
                  } ${centerY + offsetY}`}
                  stroke="rgba(147, 112, 219, 0.7)"
                  strokeWidth={2}
                  fill="none"
                />
              );
            })}
          </>
        )}
      </G>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, fieldType === 'straight' && styles.activeTab]}
          onPress={() => onChangeFieldType('straight')}
        >
          <Zap
            size={16}
            color={fieldType === 'straight' ? '#3b82f6' : '#666'}
          />
          <Text
            style={[
              styles.tabText,
              fieldType === 'straight' && styles.activeTabText,
            ]}
          >
            {t('Düz Tel', 'Straight Wire')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, fieldType === 'coil' && styles.activeTab]}
          onPress={() => onChangeFieldType('coil')}
        >
          <Grid size={16} color={fieldType === 'coil' ? '#3b82f6' : '#666'} />
          <Text
            style={[
              styles.tabText,
              fieldType === 'coil' && styles.activeTabText,
            ]}
          >
            {t('Bobin', 'Coil')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, fieldType === 'bar' && styles.activeTab]}
          onPress={() => onChangeFieldType('bar')}
        >
          <Magnet size={16} color={fieldType === 'bar' ? '#3b82f6' : '#666'} />
          <Text
            style={[
              styles.tabText,
              fieldType === 'bar' && styles.activeTabText,
            ]}
          >
            {t('Çubuk Mıknatıs', 'Bar Magnet')}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.svgContainer}>
        <Svg width={svgWidth} height={svgHeight}>
          {fieldType === 'straight' && renderStraightWireMagneticField()}
          {fieldType === 'coil' && renderCoilMagneticField()}
          {fieldType === 'bar' && renderBarMagnetField()}
        </Svg>
      </View>

      <View style={styles.controlsContainer}>
        <TouchableOpacity
          style={styles.controlButton}
          onPress={onToggleAnimation}
        >
          <RotateCcw size={20} color={animateField ? '#3b82f6' : '#666'} />
          <Text style={styles.controlButtonText}>
            {animateField
              ? t('Animasyonu Durdur', 'Stop Animation')
              : t('Alanı Canlandır', 'Animate Field')}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.controlButton}
          onPress={onToggleFieldLines}
        >
          {showFieldLines ? (
            <Eye size={20} color="#3b82f6" />
          ) : (
            <EyeOff size={20} color="#666" />
          )}
          <Text style={styles.controlButtonText}>
            {showFieldLines
              ? t('Alan Çizgilerini Gizle', 'Hide Field Lines')
              : t('Alan Çizgilerini Göster', 'Show Field Lines')}
          </Text>
        </TouchableOpacity>

        {fieldType === 'coil' && (
          <View style={styles.coilControls}>
            <TouchableOpacity
              style={styles.coilButton}
              onPress={() => onCoilTurnsChange(Math.max(1, coilTurns - 1))}
            >
              <Minus size={16} color="#666" />
            </TouchableOpacity>
            <Text style={styles.coilTurnsText}>{coilTurns}</Text>
            <TouchableOpacity
              style={styles.coilButton}
              onPress={() => onCoilTurnsChange(Math.min(20, coilTurns + 1))}
            >
              <Plus size={16} color="#666" />
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    marginVertical: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#e5e7eb',
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    flex: 1,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderColor: '#3b82f6',
  },
  tabText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  activeTabText: {
    color: '#3b82f6',
    fontWeight: '500',
  },
  svgContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#f9fafb',
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: 16,
    borderTopWidth: 1,
    borderColor: '#e5e7eb',
  },
  controlButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
  },
  controlButtonText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#4b5563',
  },
  coilControls: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    padding: 4,
  },
  coilButton: {
    padding: 8,
    borderRadius: 4,
    backgroundColor: '#fff',
  },
  coilTurnsText: {
    marginHorizontal: 12,
    fontSize: 14,
    color: '#4b5563',
    fontWeight: '500',
  },
});

export default MagneticSimulator;
