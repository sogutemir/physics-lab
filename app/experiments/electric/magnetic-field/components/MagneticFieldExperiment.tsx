import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import MagneticSimulator from './MagneticSimulator';
import ParameterControls from './ParameterControls';
import { useLanguage } from '../../../../../components/LanguageContext';
import { FieldType } from './types';

const MagneticFieldExperiment = () => {
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
  const updateCurrentIntensity = (value: number) => {
    setCurrentIntensity(value);
  };

  const updateWireDistance = (value: number) => {
    setWireDistance(value);
  };

  const updateCoilTurns = (value: number) => {
    setCoilTurns(value);
  };

  const toggleAnimation = () => {
    setAnimateField(!animateField);
  };

  const toggleFieldLines = () => {
    setShowFieldLines(!showFieldLines);
  };

  const changeFieldType = (type: FieldType) => {
    setFieldType(type);
  };

  const resetParameters = () => {
    setCurrentIntensity(5);
    setWireDistance(30);
    setCoilTurns(10);
    setAnimateField(false);
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
        onChangeFieldType={changeFieldType}
        onToggleAnimation={toggleAnimation}
        onToggleFieldLines={toggleFieldLines}
      />
      <ParameterControls
        title={t('Manyetik Alan Parametreleri', 'Magnetic Field Parameters')}
        currentIntensity={currentIntensity}
        wireDistance={wireDistance}
        coilTurns={coilTurns}
        fieldType={fieldType}
        onUpdateCurrentIntensity={updateCurrentIntensity}
        onUpdateWireDistance={updateWireDistance}
        onUpdateCoilTurns={updateCoilTurns}
        onResetParameters={resetParameters}
        onChangeFieldType={changeFieldType}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
});

export default MagneticFieldExperiment;
