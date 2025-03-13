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
import { ParameterControlsProps } from './types';

const ParameterControls: React.FC<ParameterControlsProps> = ({
  title,
  currentIntensity,
  wireDistance,
  coilTurns,
  fieldType,
  onUpdateCurrentIntensity,
  onUpdateWireDistance,
  onUpdateCoilTurns,
  onResetParameters,
  onChangeFieldType,
}) => {
  const { language, t } = useLanguage();
  const isEnglish = language === 'en';
  const [isExpanded, setIsExpanded] = useState(true);
  const [currentText, setCurrentText] = useState(currentIntensity.toString());
  const [distanceText, setDistanceText] = useState(wireDistance.toString());
  const [coilTurnsText, setCoilTurnsText] = useState(coilTurns.toString());

  const isMobile = Dimensions.get('window').width < 768;

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const handleCurrentChange = (value: number) => {
    onUpdateCurrentIntensity(value);
    setCurrentText(value.toString());
  };

  const handleDistanceChange = (value: number) => {
    onUpdateWireDistance(value);
    setDistanceText(value.toString());
  };

  const handleCoilTurnsChange = (value: number) => {
    onUpdateCoilTurns(value);
    setCoilTurnsText(value.toString());
  };

  const handleCurrentTextChange = (text: string) => {
    setCurrentText(text);
    const parsed = parseFloat(text);
    if (!isNaN(parsed) && parsed >= 0 && parsed <= 10) {
      onUpdateCurrentIntensity(parsed);
    }
  };

  const handleDistanceTextChange = (text: string) => {
    setDistanceText(text);
    const parsed = parseFloat(text);
    if (!isNaN(parsed) && parsed >= 1 && parsed <= 20) {
      onUpdateWireDistance(parsed);
    }
  };

  const handleCoilTurnsTextChange = (text: string) => {
    setCoilTurnsText(text);
    const parsed = parseInt(text, 10);
    if (!isNaN(parsed) && parsed >= 5 && parsed <= 50) {
      onUpdateCoilTurns(parsed);
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
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[
                styles.typeButton,
                fieldType === 'straight-wire' && styles.activeTypeButton,
              ]}
              onPress={() => onChangeFieldType('straight-wire')}
            >
              <Zap
                size={16}
                color={fieldType === 'straight-wire' ? '#fff' : '#666'}
              />
              <Text
                style={[
                  styles.typeButtonText,
                  fieldType === 'straight-wire' && styles.activeTypeButtonText,
                ]}
              >
                {t('Düz Tel', 'Straight Wire')}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.typeButton,
                fieldType === 'coil' && styles.activeTypeButton,
              ]}
              onPress={() => onChangeFieldType('coil')}
            >
              <RotateCw
                size={16}
                color={fieldType === 'coil' ? '#fff' : '#666'}
              />
              <Text
                style={[
                  styles.typeButtonText,
                  fieldType === 'coil' && styles.activeTypeButtonText,
                ]}
              >
                {t('Bobin', 'Coil')}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.typeButton,
                fieldType === 'bar-magnet' && styles.activeTypeButton,
              ]}
              onPress={() => onChangeFieldType('bar-magnet')}
            >
              <Magnet
                size={16}
                color={fieldType === 'bar-magnet' ? '#fff' : '#666'}
              />
              <Text
                style={[
                  styles.typeButtonText,
                  fieldType === 'bar-magnet' && styles.activeTypeButtonText,
                ]}
              >
                {t('Çubuk Mıknatıs', 'Bar Magnet')}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.controlGroup}>
            <View style={styles.labelRow}>
              <Text style={styles.parameterLabel}>
                {t('Akım Şiddeti', 'Current Intensity')}:
              </Text>
              <TextInput
                style={styles.valueInput}
                value={currentText}
                onChangeText={handleCurrentTextChange}
                keyboardType="numeric"
                maxLength={5}
              />
              <Text style={styles.unit}>A</Text>
            </View>
            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={10}
              step={0.1}
              value={currentIntensity}
              onValueChange={handleCurrentChange}
              minimumTrackTintColor="#3b82f6"
              maximumTrackTintColor="#e5e7eb"
              thumbTintColor="#3b82f6"
            />
          </View>

          {fieldType === 'straight-wire' && (
            <View style={styles.controlGroup}>
              <View style={styles.labelRow}>
                <Text style={styles.parameterLabel}>
                  {t('Telden Uzaklık', 'Distance from Wire')}:
                </Text>
                <TextInput
                  style={styles.valueInput}
                  value={distanceText}
                  onChangeText={handleDistanceTextChange}
                  keyboardType="numeric"
                  maxLength={5}
                />
                <Text style={styles.unit}>cm</Text>
              </View>
              <Slider
                style={styles.slider}
                minimumValue={1}
                maximumValue={20}
                step={0.5}
                value={wireDistance}
                onValueChange={handleDistanceChange}
                minimumTrackTintColor="#3b82f6"
                maximumTrackTintColor="#e5e7eb"
                thumbTintColor="#3b82f6"
              />
            </View>
          )}

          {fieldType === 'coil' && (
            <View style={styles.controlGroup}>
              <View style={styles.labelRow}>
                <Text style={styles.parameterLabel}>
                  {t('Sarım Sayısı', 'Number of Turns')}:
                </Text>
                <TextInput
                  style={styles.valueInput}
                  value={coilTurnsText}
                  onChangeText={handleCoilTurnsTextChange}
                  keyboardType="numeric"
                  maxLength={3}
                />
              </View>
              <Slider
                style={styles.slider}
                minimumValue={5}
                maximumValue={50}
                step={1}
                value={coilTurns}
                onValueChange={handleCoilTurnsChange}
                minimumTrackTintColor="#3b82f6"
                maximumTrackTintColor="#e5e7eb"
                thumbTintColor="#3b82f6"
              />
            </View>
          )}

          <TouchableOpacity
            style={styles.resetButton}
            onPress={onResetParameters}
          >
            <RefreshCw size={16} color="#fff" />
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
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  typeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
    flex: 1,
    marginHorizontal: 4,
  },
  activeTypeButton: {
    backgroundColor: '#3b82f6',
  },
  typeButtonText: {
    fontSize: 14,
    color: '#4b5563',
    marginLeft: 8,
  },
  activeTypeButtonText: {
    color: '#fff',
  },
  controlGroup: {
    marginBottom: 16,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  parameterLabel: {
    fontSize: 14,
    color: '#4b5563',
    flex: 1,
  },
  valueInput: {
    width: 50,
    height: 36,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 6,
    padding: 8,
    textAlign: 'center',
    marginHorizontal: 8,
  },
  unit: {
    fontSize: 14,
    color: '#6b7280',
    width: 30,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ef4444',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginTop: 8,
  },
  resetButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 8,
  },
});

export default ParameterControls;
