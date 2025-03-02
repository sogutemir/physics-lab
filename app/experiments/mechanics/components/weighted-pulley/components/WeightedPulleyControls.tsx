import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { WeightedPulleyControlsProps, INERTIA_OPTIONS } from '../types';
import Slider from '@react-native-community/slider';

const WeightedPulleyControls: React.FC<WeightedPulleyControlsProps> = ({
  state,
  onInertiaChange,
  onMassMChange,
  onMassmChange,
  onAngleChange
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.controlGroup}>
        <View style={styles.labelRow}>
          <Text style={styles.label}>Atalet Momenti</Text>
          <Text style={styles.value}>{state.inertia.toFixed(2)} kg.m²</Text>
        </View>
        <View style={styles.inertiaButtonsContainer}>
          {INERTIA_OPTIONS.map(option => (
            <View
              key={option.value}
              style={[
                styles.inertiaButton,
                state.inertia === option.value && styles.inertiaButtonActive
              ]}
              onTouchEnd={() => onInertiaChange(option.value)}
            >
              <Text style={[
                styles.inertiaButtonText,
                state.inertia === option.value && styles.inertiaButtonTextActive
              ]}>
                {option.label}
              </Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.controlGroup}>
        <View style={styles.labelRow}>
          <Text style={[styles.label, styles.labelBlue]}>Asılı Kütle (M)</Text>
          <Text style={styles.value}>{state.massM} g</Text>
        </View>
        <Slider
          value={state.massM}
          minimumValue={150}
          maximumValue={800}
          step={1}
          onValueChange={onMassMChange}
          minimumTrackTintColor="#2196F3"
          maximumTrackTintColor="#bdc3c7"
          thumbTintColor="#2196F3"
          style={styles.slider}
        />
      </View>

      <View style={styles.controlGroup}>
        <View style={styles.labelRow}>
          <Text style={[styles.label, styles.labelRed]}>Bağlı Kütle (m)</Text>
          <Text style={styles.value}>{state.massm} g</Text>
        </View>
        <Slider
          value={state.massm}
          minimumValue={100}
          maximumValue={1000}
          step={1}
          onValueChange={onMassmChange}
          minimumTrackTintColor="#DC143C"
          maximumTrackTintColor="#bdc3c7"
          thumbTintColor="#DC143C"
          style={styles.slider}
        />
      </View>

      <View style={styles.controlGroup}>
        <View style={styles.labelRow}>
          <Text style={styles.label}>Başlangıç Açısı</Text>
          <Text style={styles.value}>{state.angle}°</Text>
        </View>
        <Slider
          value={state.angle}
          minimumValue={0}
          maximumValue={90}
          step={1}
          onValueChange={onAngleChange}
          minimumTrackTintColor="#4CAF50"
          maximumTrackTintColor="#bdc3c7"
          thumbTintColor="#4CAF50"
          style={styles.slider}
        />
      </View>

      <View style={styles.measurementsContainer}>
        <View style={styles.measurementItem}>
          <Text style={styles.measurementLabel}>Zaman:</Text>
          <Text style={styles.measurementValue}>{state.time.toFixed(2)} s</Text>
        </View>
        <View style={styles.measurementItem}>
          <Text style={styles.measurementLabel}>Açı:</Text>
          <Text style={styles.measurementValue}>{((state.phi / Math.PI * 180) + 90).toFixed(1)}°</Text>
        </View>
        <View style={styles.measurementItem}>
          <Text style={styles.measurementLabel}>Potansiyel Enerji:</Text>
          <Text style={styles.measurementValue}>{state.potentialEnergy.toFixed(6)} J</Text>
        </View>
        <View style={styles.measurementItem}>
          <Text style={styles.measurementLabel}>Kinetik Enerji:</Text>
          <Text style={styles.measurementValue}>{state.kineticEnergy.toFixed(6)} J</Text>
        </View>
        <View style={styles.measurementItem}>
          <Text style={styles.measurementLabel}>Toplam Enerji:</Text>
          <Text style={styles.measurementValue}>{state.totalEnergy.toExponential(3)} J</Text>
        </View>
        {state.period > 0 && (
          <View style={styles.measurementItem}>
            <Text style={styles.measurementLabel}>Periyot:</Text>
            <Text style={styles.measurementValue}>{state.period.toFixed(2)} s</Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    ...Platform.select({
      web: {
        boxShadow: '0 4px 6px rgba(0,0,0,0.1), 0 1px 3px rgba(0,0,0,0.08)'
      },
      default: {
        elevation: 4
      }
    })
  },
  controlGroup: {
    marginBottom: 16,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  value: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  labelBlue: {
    color: '#2196F3',
  },
  labelRed: {
    color: '#DC143C',
  },
  slider: {
    width: '100%',
    height: 40,
  },
  inertiaButtonsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  inertiaButton: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#f5f5f5',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#bdc3c7',
    alignItems: 'center',
  },
  inertiaButtonActive: {
    backgroundColor: '#2196F3',
    borderColor: '#2196F3',
  },
  inertiaButtonText: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  inertiaButtonTextActive: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  measurementsContainer: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 12,
    marginTop: 16,
  },
  measurementItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  measurementLabel: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  measurementValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
});

export default WeightedPulleyControls; 