import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, {
  Rect,
  Line,
  Path,
  Circle,
  Text as SvgText,
  G,
  Defs,
  Marker,
  Polygon,
} from 'react-native-svg';
import { CircuitValues } from '../utils/types';
import { useLanguage } from '../../../../../components/LanguageContext';

interface RlcCircuitDiagramProps {
  values: CircuitValues;
}

const RlcCircuitDiagram: React.FC<RlcCircuitDiagramProps> = ({ values }) => {
  const { t } = useLanguage();
  const { VR, VC, VL, current } = values;

  return (
    <View style={styles.container}>
      <Svg viewBox="0 0 400 300" style={styles.svg}>
        {/* Devre çerçevesi */}
        <Rect
          x="20"
          y="50"
          width="360"
          height="200"
          fill="none"
          stroke="#333"
          strokeWidth="2"
          rx="5"
        />

        {/* Direnç */}
        <Rect
          x="50"
          y="80"
          width="60"
          height="20"
          fill="#ff8566"
          stroke="#000"
          strokeWidth="1"
          rx="2"
        />
        <SvgText
          x="80"
          y="70"
          fontSize="14"
          textAnchor="middle"
          fill="#ff8566"
          fontWeight="bold"
        >
          R
        </SvgText>
        <SvgText x="80" y="115" fontSize="12" textAnchor="middle">
          {(VR * 0.7071).toFixed(1)} V
        </SvgText>

        {/* Kondansatör */}
        <Line
          x1="150"
          y1="70"
          x2="150"
          y2="110"
          stroke="#6666ff"
          strokeWidth="2"
        />
        <Line
          x1="160"
          y1="70"
          x2="160"
          y2="110"
          stroke="#6666ff"
          strokeWidth="2"
        />
        <SvgText
          x="155"
          y="60"
          fontSize="14"
          textAnchor="middle"
          fill="#6666ff"
          fontWeight="bold"
        >
          C
        </SvgText>
        <SvgText x="155" y="130" fontSize="12" textAnchor="middle">
          {(VC * 0.7071).toFixed(1)} V
        </SvgText>

        {/* Bobin */}
        <Path
          d="M230,90 Q240,80 250,90 Q260,100 270,90 Q280,80 290,90"
          fill="none"
          stroke="#00e600"
          strokeWidth="2"
        />
        <SvgText
          x="260"
          y="70"
          fontSize="14"
          textAnchor="middle"
          fill="#00e600"
          fontWeight="bold"
        >
          L
        </SvgText>
        <SvgText x="260" y="115" fontSize="12" textAnchor="middle">
          {(VL * 0.7071).toFixed(1)} V
        </SvgText>

        {/* Gerilim kaynağı */}
        <Circle
          cx="200"
          cy="210"
          r="20"
          fill="white"
          stroke="#999900"
          strokeWidth="1.5"
        />
        <Path
          d="M200,200 L200,220 M193,205 L207,215"
          stroke="#999900"
          strokeWidth="1.5"
        />
        <SvgText
          x="200"
          y="245"
          fontSize="14"
          textAnchor="middle"
          fill="#999900"
          fontWeight="bold"
        >
          V
        </SvgText>

        {/* Akım göstergesi */}
        <Path
          d="M320,150 L340,150"
          stroke="#333"
          strokeWidth="1.5"
          markerEnd="url(#arrowhead)"
        />
        <SvgText
          x="330"
          y="145"
          fontSize="14"
          textAnchor="middle"
          fontWeight="bold"
        >
          I = {(current * 0.7071).toFixed(2)} A
        </SvgText>

        {/* Ok işaretçisi tanımı */}
        <Defs>
          <Marker
            id="arrowhead"
            markerWidth="10"
            markerHeight="7"
            refX="9"
            refY="3.5"
            orient="auto"
          >
            <Polygon points="0 0, 10 3.5, 0 7" fill="#333" />
          </Marker>
        </Defs>

        {/* Bağlantı kabloları */}
        <Line x1="20" y1="90" x2="50" y2="90" stroke="#333" strokeWidth="1.5" />
        <Line
          x1="110"
          y1="90"
          x2="150"
          y2="90"
          stroke="#333"
          strokeWidth="1.5"
        />
        <Line
          x1="160"
          y1="90"
          x2="230"
          y2="90"
          stroke="#333"
          strokeWidth="1.5"
        />
        <Line
          x1="290"
          y1="90"
          x2="380"
          y2="90"
          stroke="#333"
          strokeWidth="1.5"
        />
        <Line
          x1="380"
          y1="90"
          x2="380"
          y2="210"
          stroke="#333"
          strokeWidth="1.5"
        />
        <Line
          x1="380"
          y1="210"
          x2="220"
          y2="210"
          stroke="#333"
          strokeWidth="1.5"
        />
        <Line
          x1="180"
          y1="210"
          x2="20"
          y2="210"
          stroke="#333"
          strokeWidth="1.5"
        />
        <Line
          x1="20"
          y1="210"
          x2="20"
          y2="90"
          stroke="#333"
          strokeWidth="1.5"
        />
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    maxWidth: 400,
    aspectRatio: 4 / 3,
    alignSelf: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  svg: {
    width: '100%',
    height: '100%',
  },
});

export default RlcCircuitDiagram;
