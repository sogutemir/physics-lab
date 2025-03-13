import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import MagneticSimulator from './MagneticSimulator';
import ParameterControls from './ParameterControls';
import { useLanguage } from '../../../../../components/LanguageContext';
import { FieldType } from './types';

const MagneticFieldExperiment: React.FC = () => {
  const { language, t } = useLanguage();
  const isEnglish = language === 'en';

  // State değişkenleri
  const [currentIntensity, setCurrentIntensity] = useState(5);
  const [wireDistance, setWireDistance] = useState(30);
  const [coilTurns, setCoilTurns] = useState(10);
  const [fieldType, setFieldType] = useState<FieldType>('straight');
  const [animateField, setAnimateField] = useState(false);
  const [showFieldLines, setShowFieldLines] = useState(true);

  // Durum güncelleme işlevleri
  const handleCurrentIntensityChange = (value: number) => {
    setCurrentIntensity(value);
  };

  const handleWireDistanceChange = (value: number) => {
    setWireDistance(value);
  };

  const handleCoilTurnsChange = (value: number) => {
    setCoilTurns(value);
  };

  const handleFieldTypeChange = (type: FieldType) => {
    setFieldType(type);
  };

  const handleToggleAnimation = () => {
    setAnimateField(!animateField);
  };

  const handleToggleFieldLines = () => {
    setShowFieldLines(!showFieldLines);
  };

  const handleReset = () => {
    setCurrentIntensity(5);
    setWireDistance(30);
    setCoilTurns(10);
    setFieldType('straight');
    setAnimateField(false);
    setShowFieldLines(true);
  };

  return (
    <View style={styles.container}>
      <MagneticSimulator
        currentIntensity={currentIntensity}
        wireDistance={wireDistance}
        coilTurns={coilTurns}
        fieldType={fieldType}
        showFieldLines={showFieldLines}
        animateField={animateField}
        onChangeFieldType={handleFieldTypeChange}
        onToggleAnimation={handleToggleAnimation}
        onToggleFieldLines={handleToggleFieldLines}
        onCoilTurnsChange={handleCoilTurnsChange}
      />
      <ParameterControls
        title={t('Manyetik Alan Parametreleri', 'Magnetic Field Parameters')}
        currentIntensity={currentIntensity}
        wireDistance={wireDistance}
        coilTurns={coilTurns}
        fieldType={fieldType}
        onCurrentIntensityChange={handleCurrentIntensityChange}
        onWireDistanceChange={handleWireDistanceChange}
        onCoilTurnsChange={handleCoilTurnsChange}
        onFieldTypeChange={handleFieldTypeChange}
        onReset={handleReset}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    padding: 16,
  },
});

export default MagneticFieldExperiment;
