import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Platform,
  Animated,
  Pressable,
} from 'react-native';
import Svg, {
  Line,
  Circle,
  Path,
  G,
  Text as SvgText,
  Ellipse,
  Defs,
  RadialGradient,
  Stop,
  Rect,
  LinearGradient,
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
} from 'lucide-react-native';
import { FieldType, MagneticSimulatorProps } from './types';
import Slider from '@react-native-community/slider';

// Tab bileşeni
interface TabProps {
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onPress: () => void;
}

const Tab: React.FC<TabProps> = ({ icon, label, isActive, onPress }) => (
  <Pressable
    style={[styles.tab, isActive && styles.activeTab]}
    onPress={onPress}
  >
    {icon}
    <Text style={[styles.tabText, isActive && styles.activeTabText]}>
      {label}
    </Text>
  </Pressable>
);

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
}) => {
  const { language, t } = useLanguage();
  const isEnglish = language === 'en';
  const [screenWidth, setScreenWidth] = useState(
    Dimensions.get('window').width
  );
  const animatedValue = useRef(new Animated.Value(0)).current;
  const svgWidth = screenWidth > 600 ? 500 : screenWidth - 40;
  const svgHeight = 400;
  const [particlePosition, setParticlePosition] = useState({
    x: svgWidth / 2,
    y: svgHeight / 2,
  });
  const [magneticFieldStrength, setMagneticFieldStrength] = useState(0);

  useEffect(() => {
    const updateLayout = () => {
      setScreenWidth(Dimensions.get('window').width);
    };

    Dimensions.addEventListener('change', updateLayout);

    return () => {
      // React Native yeni sürümlerinde temizlik için
      const dimensionsHandler = Dimensions.addEventListener(
        'change',
        updateLayout
      );
      dimensionsHandler.remove();
    };
  }, []);

  useEffect(() => {
    if (animateField) {
      const animation = Animated.loop(
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        })
      );
      animation.start();

      return () => {
        animation.stop();
      };
    } else {
      animatedValue.setValue(0);
    }
  }, [animateField, animatedValue]);

  useEffect(() => {
    // Manyetik alan gücünü hesapla
    let strength = 0;
    if (fieldType === 'straight-wire') {
      // Düz tel için Biot-Savart yasası ile hesaplama
      strength = (2e-7 * currentIntensity) / (wireDistance / 100);
    } else if (fieldType === 'coil') {
      // Bobin için hesaplama
      strength = (4e-7 * Math.PI * coilTurns * currentIntensity) / 0.1;
    } else {
      // Çubuk mıknatıs için basitleştirilmiş hesaplama
      strength = 0.1 * currentIntensity * 5;
    }
    setMagneticFieldStrength(strength);
  }, [currentIntensity, wireDistance, coilTurns, fieldType]);

  // Alan çizgilerini oluştur
  const renderFieldLines = () => {
    if (!showFieldLines) return null;

    const lines = [];
    const spacing = 20;
    const centerX = svgWidth / 2;
    const centerY = svgHeight / 2;

    if (fieldType === 'straight-wire') {
      // Düz tel için alan çizgileri - konsantrik daireler
      for (let r = 20; r < Math.min(svgWidth, svgHeight) / 2; r += spacing) {
        lines.push(
          <Circle
            key={`field-line-${r}`}
            cx={centerX}
            cy={centerY}
            r={r}
            stroke="#3b82f6"
            strokeWidth={1}
            fill="none"
            strokeDasharray={animateField ? '5,5' : 'none'}
          />
        );
      }
    } else if (fieldType === 'coil') {
      // Bobin için alan çizgileri - eliptik çizgiler
      for (let r = 30; r < Math.min(svgWidth, svgHeight) / 2; r += spacing) {
        lines.push(
          <Path
            key={`field-line-${r}`}
            d={`M ${centerX - r * 1.5} ${centerY} A ${r * 1.5} ${r} 0 0 1 ${
              centerX + r * 1.5
            } ${centerY} A ${r * 1.5} ${r} 0 0 1 ${
              centerX - r * 1.5
            } ${centerY}`}
            stroke="#3b82f6"
            strokeWidth={1}
            fill="none"
            strokeDasharray={animateField ? '5,5' : 'none'}
          />
        );
      }
    } else if (fieldType === 'bar-magnet') {
      // Çubuk mıknatıs için alan çizgileri
      for (let i = -3; i <= 3; i++) {
        if (i === 0) continue; // Ortadaki çizgiyi atla
        const offsetY = i * spacing;

        lines.push(
          <Path
            key={`field-line-${i}`}
            d={`M ${centerX - 100} ${centerY + offsetY} C ${centerX - 50} ${
              centerY + offsetY * 0.5
            }, ${centerX + 50} ${centerY + offsetY * 0.5}, ${centerX + 100} ${
              centerY + offsetY
            }`}
            stroke="#3b82f6"
            strokeWidth={1}
            fill="none"
            strokeDasharray={animateField ? '5,5' : 'none'}
          />
        );
      }
    }

    return <G>{lines}</G>;
  };

  const renderStraightWire = () => (
    <G>
      <Circle cx={svgWidth / 2} cy={svgHeight / 2} r={8} fill="#666" />
      <Circle cx={svgWidth / 2} cy={svgHeight / 2} r={4} fill="#333" />
      <SvgText
        x={`${svgWidth / 2 + 15}`}
        y={`${svgHeight / 2 - 15}`}
        fill="#333"
        fontSize="12"
        textAnchor="middle"
      >
        {t('Akım', 'Current')}
      </SvgText>
      <Circle cx={svgWidth / 2} cy={svgHeight / 2} r={2} fill="#fff" />
    </G>
  );

  const renderCoil = () => (
    <G>
      <Circle
        cx={svgWidth / 2}
        cy={svgHeight / 2}
        r={50}
        stroke="#666"
        strokeWidth={10}
        fill="none"
      />
      <SvgText
        x={`${svgWidth / 2}`}
        y={`${svgHeight / 2}`}
        fill="#333"
        fontSize="12"
        textAnchor="middle"
      >
        {`${coilTurns} ${t('sarım', 'turns')}`}
      </SvgText>
      {/* Akım yönünü göster */}
      <Circle cx={svgWidth / 2 + 50} cy={svgHeight / 2} r={5} fill="#333" />
      <Circle cx={svgWidth / 2 - 50} cy={svgHeight / 2} r={5} fill="#333" />
    </G>
  );

  const renderBarMagnet = () => (
    <G>
      <Rect
        x={svgWidth / 2 - 75}
        y={svgHeight / 2 - 25}
        width={150}
        height={50}
        fill="url(#magnetGradient)"
        rx={5}
        ry={5}
        stroke="#333"
        strokeWidth={1}
      />
      <SvgText
        x={`${svgWidth / 2 - 50}`}
        y={`${svgHeight / 2 + 5}`}
        fill="#fff"
        fontSize="16"
        fontWeight="bold"
        textAnchor="middle"
      >
        N
      </SvgText>
      <SvgText
        x={`${svgWidth / 2 + 50}`}
        y={`${svgHeight / 2 + 5}`}
        fill="#fff"
        fontSize="16"
        fontWeight="bold"
        textAnchor="middle"
      >
        S
      </SvgText>
    </G>
  );

  const renderParticle = () => (
    <Circle
      cx={particlePosition.x}
      cy={particlePosition.y}
      r={10}
      fill="yellow"
      stroke="#333"
      strokeWidth={1}
    />
  );

  return (
    <View style={styles.container}>
      <View style={styles.tabContainer}>
        <Tab
          icon={
            <Zap
              size={16}
              color={fieldType === 'straight-wire' ? '#3b82f6' : '#666'}
            />
          }
          label={t('Düz Tel', 'Straight Wire')}
          isActive={fieldType === 'straight-wire'}
          onPress={() => onChangeFieldType('straight-wire')}
        />
        <Tab
          icon={
            <RotateCcw
              size={16}
              color={fieldType === 'coil' ? '#3b82f6' : '#666'}
            />
          }
          label={t('Bobin', 'Coil')}
          isActive={fieldType === 'coil'}
          onPress={() => onChangeFieldType('coil')}
        />
        <Tab
          icon={
            <Magnet
              size={16}
              color={fieldType === 'bar-magnet' ? '#3b82f6' : '#666'}
            />
          }
          label={t('Çubuk Mıknatıs', 'Bar Magnet')}
          isActive={fieldType === 'bar-magnet'}
          onPress={() => onChangeFieldType('bar-magnet')}
        />
      </View>

      <View style={styles.svgContainer}>
        <Svg
          width={svgWidth}
          height={svgHeight}
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        >
          <Defs>
            <LinearGradient id="magnetGradient" x1="0" y1="0" x2="1" y2="0">
              <Stop offset="0" stopColor="#3b82f6" />
              <Stop offset="1" stopColor="#ef4444" />
            </LinearGradient>
          </Defs>
          {renderFieldLines()}
          {fieldType === 'straight-wire' && renderStraightWire()}
          {fieldType === 'coil' && renderCoil()}
          {fieldType === 'bar-magnet' && renderBarMagnet()}
          {renderParticle()}
        </Svg>
      </View>

      <View style={styles.controlsContainer}>
        <Pressable style={styles.controlButton} onPress={onToggleAnimation}>
          <RotateCcw size={20} color={animateField ? '#3b82f6' : '#666'} />
          <Text style={styles.controlButtonText}>
            {animateField
              ? t('Animasyonu Durdur', 'Stop Animation')
              : t('Alanı Canlandır', 'Animate Field')}
          </Text>
        </Pressable>

        <Pressable style={styles.controlButton} onPress={onToggleFieldLines}>
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
        </Pressable>
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.infoTitle}>
          {t('Manyetik Alan Şiddeti', 'Magnetic Field Strength')}
        </Text>
        <Text style={styles.infoValue}>
          {magneticFieldStrength.toExponential(2)} Tesla
        </Text>
        <Text style={styles.infoDescription}>
          {t(
            `Bu değer, referans noktasındaki manyetik alan şiddetini temsil eder. Gerçek alan şiddeti, ${
              fieldType === 'straight-wire'
                ? 'telin'
                : fieldType === 'coil'
                ? 'bobinin'
                : 'mıknatısın'
            } etrafındaki farklı konumlarda değişiklik gösterir.`,
            `This value represents the magnetic field strength at a reference point. The actual field strength varies at different locations around the ${
              fieldType === 'straight-wire'
                ? 'wire'
                : fieldType === 'coil'
                ? 'coil'
                : 'magnet'
            }.`
          )}
        </Text>
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
  infoContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderColor: '#e5e7eb',
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#3b82f6',
    marginBottom: 8,
  },
  infoDescription: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
  },
});

export default MagneticSimulator;
