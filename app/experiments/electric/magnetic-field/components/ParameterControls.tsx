import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Platform,
  Dimensions,
} from 'react-native';
import {
  ChevronDown,
  ChevronUp,
  Sliders,
  Plus,
  Minus,
  RefreshCw,
  Zap,
  RotateCw,
  Magnet,
} from 'lucide-react-native';
import Slider from '@react-native-community/slider';
import { useLanguage } from '../../../../../components/LanguageContext';
import { FieldType, ParameterControlsProps } from './types';

const ParameterControls: React.FC<ParameterControlsProps> = ({
  title,
  currentIntensity,
  wireDistance,
  coilTurns,
  fieldType,
  onCurrentIntensityChange,
  onWireDistanceChange,
  onCoilTurnsChange,
  onFieldTypeChange,
  onReset,
}) => {
  const { language, t } = useLanguage();
  const [isExpanded, setIsExpanded] = useState(true);
  const [currentText, setCurrentText] = useState(currentIntensity.toString());
  const [distanceText, setDistanceText] = useState(wireDistance.toString());
  const [coilTurnsText, setCoilTurnsText] = useState(coilTurns.toString());

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const handleCurrentChange = (value: number) => {
    onCurrentIntensityChange(value);
    setCurrentText(value.toString());
  };

  const handleDistanceChange = (value: number) => {
    onWireDistanceChange(value);
    setDistanceText(value.toString());
  };

  const handleCoilTurnsChange = (value: number) => {
    onCoilTurnsChange(value);
    setCoilTurnsText(value.toString());
  };

  const handleCurrentTextChange = (text: string) => {
    setCurrentText(text);
    const parsed = parseFloat(text);
    if (!isNaN(parsed) && parsed >= 0 && parsed <= 10) {
      onCurrentIntensityChange(parsed);
    }
  };

  const handleDistanceTextChange = (text: string) => {
    setDistanceText(text);
    const parsed = parseFloat(text);
    if (!isNaN(parsed) && parsed >= 10 && parsed <= 50) {
      onWireDistanceChange(parsed);
    }
  };

  const handleCoilTurnsTextChange = (text: string) => {
    setCoilTurnsText(text);
    const parsed = parseInt(text, 10);
    if (!isNaN(parsed) && parsed >= 1 && parsed <= 20) {
      onCoilTurnsChange(parsed);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.header}
        onPress={toggleExpanded}
        activeOpacity={0.7}
      >
        <View style={styles.headerContent}>
          <View style={styles.iconContainer}>
            <Sliders size={16} color="#3498db" />
          </View>
          <Text style={styles.headerText}>{title}</Text>
        </View>
        <TouchableOpacity
          onPress={toggleExpanded}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          {isExpanded ? (
            <ChevronUp size={20} color="#666" />
          ) : (
            <ChevronDown size={20} color="#666" />
          )}
        </TouchableOpacity>
      </TouchableOpacity>

      {isExpanded && (
        <View style={styles.content}>
          <View style={styles.section}>
            <Text style={styles.label}>
              {t('Akım Şiddeti', 'Current Intensity')}
            </Text>
            <View style={styles.sliderContainer}>
              <Slider
                style={styles.slider}
                minimumValue={0}
                maximumValue={10}
                step={0.1}
                value={currentIntensity}
                onValueChange={handleCurrentChange}
                minimumTrackTintColor="#3b82f6"
                maximumTrackTintColor="#e5e7eb"
              />
              <Text style={styles.value}>{currentIntensity.toFixed(1)} A</Text>
            </View>
          </View>

          {fieldType === 'coil' && (
            <View style={styles.section}>
              <Text style={styles.label}>
                {t('Bobin Sarım Sayısı', 'Coil Turns')}
              </Text>
              <View style={styles.coilControls}>
                <TouchableOpacity
                  style={styles.coilButton}
                  onPress={() =>
                    handleCoilTurnsChange(Math.max(1, coilTurns - 1))
                  }
                >
                  <Minus size={16} color="#666" />
                </TouchableOpacity>
                <Text style={styles.coilTurnsText}>{coilTurns}</Text>
                <TouchableOpacity
                  style={styles.coilButton}
                  onPress={() =>
                    handleCoilTurnsChange(Math.min(20, coilTurns + 1))
                  }
                >
                  <Plus size={16} color="#666" />
                </TouchableOpacity>
              </View>
            </View>
          )}

          <View style={styles.section}>
            <Text style={styles.label}>
              {t('Tel Mesafesi', 'Wire Distance')}
            </Text>
            <View style={styles.sliderContainer}>
              <Slider
                style={styles.slider}
                minimumValue={10}
                maximumValue={50}
                step={1}
                value={wireDistance}
                onValueChange={handleDistanceChange}
                minimumTrackTintColor="#3b82f6"
                maximumTrackTintColor="#e5e7eb"
              />
              <Text style={styles.value}>{wireDistance} cm</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.resetButton} onPress={onReset}>
            <Text style={styles.resetButtonText}>
              {t('Parametreleri Sıfırla', 'Reset Parameters')}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: 'rgba(240, 240, 240, 0.5)',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(52, 152, 219, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  headerText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  content: {
    padding: 16,
  },
  section: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: '#4b5563',
    marginBottom: 8,
  },
  sliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  slider: {
    flex: 1,
    marginRight: 12,
  },
  value: {
    fontSize: 14,
    color: '#3b82f6',
    fontWeight: '500',
    minWidth: 40,
    textAlign: 'right',
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
  resetButton: {
    backgroundColor: '#f3f4f6',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  resetButtonText: {
    color: '#4b5563',
    fontSize: 14,
    fontWeight: '500',
  },
});

export default ParameterControls;
