import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Switch,
  ScrollView,
  useWindowDimensions,
  Platform,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useLanguage } from '../../../../../components/LanguageContext';

import TransformerCore from './TransformerCore';
import TransformerCoils from './TransformerCoils';
import Waveform from './Waveform';
import ParameterControl from './ParameterControl';
import MeterDisplay from './MeterDisplay';
import MaterialSelector from './MaterialSelector';
import CoreTypeSelector from './CoreTypeSelector';

import { calculateTransformerPerformance } from '../../utils/transformer/transformerCalculations';

// Çekirdek malzemeleri
const CORE_MATERIALS = [
  {
    id: 'silicon-steel',
    name: 'Silisyumlu Çelik',
    nameEN: 'Silicon Steel',
    permeability: 7000,
    color: 'gray-400',
  },
  {
    id: 'ferrite',
    name: 'Ferrit',
    nameEN: 'Ferrite',
    permeability: 3000,
    color: 'gray-600',
  },
  {
    id: 'powdered-iron',
    name: 'Demir Tozu',
    nameEN: 'Powdered Iron',
    permeability: 100,
    color: 'gray-500',
  },
  {
    id: 'air',
    name: 'Hava Nüveli',
    nameEN: 'Air Core',
    permeability: 1,
    color: 'transparent',
  },
];

// Çekirdek geometri seçenekleri
const CORE_TYPES = [
  {
    value: 'E' as const,
    label: 'E Nüve',
    labelEN: 'E Core',
    description: 'Klasik E şekilli nüve',
    descriptionEN: 'Classic E-shaped core',
  },
  {
    value: 'U' as const,
    label: 'U Nüve',
    labelEN: 'U Core',
    description: 'Basit U şekilli nüve',
    descriptionEN: 'Simple U-shaped core',
  },
  {
    value: 'toroid' as const,
    label: 'Toroid',
    labelEN: 'Toroid',
    description: 'Halka şeklinde nüve',
    descriptionEN: 'Ring-shaped core',
  },
];

interface TransformerSimulationProps {
  isRunning?: boolean;
}

const TransformerSimulation: React.FC<TransformerSimulationProps> = ({
  isRunning = true,
}) => {
  const { t } = useLanguage();
  const { width: screenWidth } = useWindowDimensions();
  const isMobile = Platform.OS !== 'web' || screenWidth < 768;

  // Transformatör parametreleri
  const [primaryTurns, setPrimaryTurns] = useState(100);
  const [secondaryTurns, setSecondaryTurns] = useState(200);
  const [inputVoltage, setInputVoltage] = useState(120);
  const [inputFrequency, setInputFrequency] = useState(60);
  const [loadResistance, setLoadResistance] = useState(1000);
  const [materialId, setMaterialId] = useState('silicon-steel');
  const [coreType, setCoreType] = useState<'E' | 'U' | 'toroid'>('E');
  const [showMagneticField, setShowMagneticField] = useState(true);

  // Malzeme özelliklerini bul
  const selectedMaterial = CORE_MATERIALS.find((m) => m.id === materialId);
  const materialPermeability = selectedMaterial?.permeability || 1;

  // Transformatör performansını hesapla
  const results = calculateTransformerPerformance({
    primaryTurns,
    secondaryTurns,
    inputVoltage,
    inputFrequency,
    loadResistance,
    materialPermeability,
    coreType,
  });

  // Dalga genişliği
  const waveformWidth = isMobile ? screenWidth - 40 : 250;

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>
        {t('Transformatör Simülasyonu', 'Transformer Simulation')}
      </Text>

      <ScrollView>
        <View style={isMobile ? styles.mobileLayout : styles.desktopLayout}>
          {/* Kontrol Paneli */}
          <View
            style={[
              styles.panel,
              isMobile ? styles.fullWidth : styles.sidePanel,
            ]}
          >
            <Text style={styles.panelTitle}>
              {t('Parametre Kontrolleri', 'Parameter Controls')}
            </Text>

            <ParameterControl
              label="Primer Sarım Sayısı (N₁)"
              labelEN="Primary Turns (N₁)"
              value={primaryTurns}
              onChange={setPrimaryTurns}
              min={10}
              max={500}
              step={10}
              unit={t('sarım', 'turns')}
            />

            <ParameterControl
              label="Sekonder Sarım Sayısı (N₂)"
              labelEN="Secondary Turns (N₂)"
              value={secondaryTurns}
              onChange={setSecondaryTurns}
              min={10}
              max={500}
              step={10}
              unit={t('sarım', 'turns')}
              helperText={`${t('Dönüştürme oranı', 'Turns ratio')}: ${(
                secondaryTurns / primaryTurns
              ).toFixed(2)}`}
            />

            <ParameterControl
              label="Giriş Voltajı (V₁)"
              labelEN="Input Voltage (V₁)"
              value={inputVoltage}
              onChange={setInputVoltage}
              min={1}
              max={240}
              unit="V"
            />

            <ParameterControl
              label="Frekans"
              labelEN="Frequency"
              value={inputFrequency}
              onChange={setInputFrequency}
              min={1}
              max={400}
              unit="Hz"
            />

            <ParameterControl
              label="Yük Direnci"
              labelEN="Load Resistance"
              value={loadResistance}
              onChange={setLoadResistance}
              min={1}
              max={2000}
              step={10}
              unit="Ω"
            />

            <View style={styles.divider} />

            <CoreTypeSelector
              options={CORE_TYPES}
              value={coreType}
              onChange={setCoreType}
            />

            <MaterialSelector
              materials={CORE_MATERIALS}
              selectedMaterial={materialId}
              onChange={setMaterialId}
            />

            <View style={styles.switchContainer}>
              <Text style={styles.switchLabel}>
                {t('Manyetik Alan Görünümü', 'Magnetic Field View')}
              </Text>
              <Switch
                value={showMagneticField}
                onValueChange={setShowMagneticField}
                trackColor={{ false: '#d1d5db', true: '#bfdbfe' }}
                thumbColor={showMagneticField ? '#3b82f6' : '#9ca3af'}
              />
            </View>
          </View>

          {/* Görselleştirme ve Ölçümler */}
          <View
            style={[
              styles.panel,
              isMobile ? styles.fullWidth : styles.mainPanel,
            ]}
          >
            {/* Transformatör Görünümü */}
            <View style={styles.transformerView}>
              <View style={styles.svgContainer}>
                <TransformerCore
                  type={coreType}
                  magneticFieldVisible={showMagneticField && isRunning}
                  magneticFieldStrength={
                    isRunning ? results.magneticFieldStrength : 0
                  }
                  materialPermeability={materialPermeability}
                />
                <TransformerCoils
                  coreType={coreType}
                  primaryTurns={primaryTurns}
                  secondaryTurns={secondaryTurns}
                  primaryCurrent={isRunning ? results.primaryCurrent : 0}
                />
              </View>
            </View>

            {/* Dalga Formları */}
            <View style={styles.waveformsContainer}>
              <View style={styles.waveformBox}>
                <Text style={styles.waveformTitle}>
                  {t('Primer Dalga Formu', 'Primary Waveform')}
                </Text>
                <Waveform
                  amplitude={inputVoltage}
                  frequency={inputFrequency / 60}
                  width={waveformWidth}
                  height={120}
                  color="#ef4444"
                  animated={isRunning}
                />
              </View>

              <View style={styles.waveformBox}>
                <Text style={styles.waveformTitle}>
                  {t('Sekonder Dalga Formu', 'Secondary Waveform')}
                </Text>
                <Waveform
                  amplitude={results.secondaryVoltage}
                  frequency={inputFrequency / 60}
                  phaseShift={Math.PI}
                  width={waveformWidth}
                  height={120}
                  color="#3b82f6"
                  animated={isRunning}
                />
              </View>
            </View>

            {/* Ölçüm Göstergeleri */}
            <Text style={styles.metersTitle}>
              {t('Ölçümler', 'Measurements')}
            </Text>
            <View style={styles.metersGrid}>
              <MeterDisplay
                label="Primer Voltaj"
                labelEN="Primary Voltage"
                value={results.primaryVoltage}
                unit="V"
                icon={<Feather name="zap" size={16} color="#94a3b8" />}
              />
              <MeterDisplay
                label="Sekonder Voltaj"
                labelEN="Secondary Voltage"
                value={results.secondaryVoltage}
                unit="V"
                icon={<Feather name="zap" size={16} color="#94a3b8" />}
              />
              <MeterDisplay
                label="Primer Akım"
                labelEN="Primary Current"
                value={isRunning ? results.primaryCurrent : 0}
                unit="A"
                precision={3}
                icon={<Feather name="activity" size={16} color="#94a3b8" />}
              />
              <MeterDisplay
                label="Sekonder Akım"
                labelEN="Secondary Current"
                value={isRunning ? results.secondaryCurrent : 0}
                unit="A"
                precision={3}
                icon={<Feather name="activity" size={16} color="#94a3b8" />}
              />
            </View>

            <View style={styles.metersGrid}>
              <MeterDisplay
                label="Verimlilik"
                labelEN="Efficiency"
                value={isRunning ? results.efficiency : 0}
                unit="%"
                icon={<Feather name="percent" size={16} color="#94a3b8" />}
              />
              <MeterDisplay
                label="Giriş Gücü"
                labelEN="Input Power"
                value={isRunning ? results.inputPower : 0}
                unit="W"
                icon={<Feather name="zap-off" size={16} color="#94a3b8" />}
              />
              <MeterDisplay
                label="Çıkış Gücü"
                labelEN="Output Power"
                value={isRunning ? results.outputPower : 0}
                unit="W"
                icon={<Feather name="zap-off" size={16} color="#94a3b8" />}
              />
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 16,
    textAlign: 'center',
  },
  desktopLayout: {
    flexDirection: 'row',
    gap: 16,
  },
  mobileLayout: {
    flexDirection: 'column',
    gap: 16,
  },
  panel: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sidePanel: {
    flex: 1,
    maxWidth: 350,
  },
  mainPanel: {
    flex: 2,
  },
  fullWidth: {
    width: '100%',
  },
  panelTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 16,
  },
  divider: {
    height: 1,
    backgroundColor: '#e2e8f0',
    marginVertical: 16,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  switchLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#334155',
  },
  transformerView: {
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    height: 280,
    alignItems: 'center',
    justifyContent: 'center',
  },
  svgContainer: {
    width: '100%',
    height: '100%',
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  overlaySvg: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  waveformsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 16,
  },
  waveformBox: {
    flex: 1,
    minWidth: 250,
  },
  waveformTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#334155',
    marginBottom: 8,
  },
  metersTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 12,
  },
  metersGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
  },
});

export default TransformerSimulation;
