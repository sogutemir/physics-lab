import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Slider from '@react-native-community/slider';
import { FreeFallControlsProps } from './types';

export const FreeFallControls: React.FC<FreeFallControlsProps> = ({
  state,
  onStart,
  onReset,
  onVelocityChange,
  onAngleChange,
  onFrictionChange,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Deney Parametreleri</Text>
      </View>
      
      <View style={styles.sliderGroup}>
        <View style={styles.sliderContainer}>
          <View style={styles.labelRow}>
            <Text style={styles.label}>Başlangıç Hızı</Text>
            <Text style={styles.value}>{state.velocity.toFixed(1)} m/s</Text>
          </View>
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={500}
            step={5}
            value={state.velocity}
            onValueChange={onVelocityChange}
            minimumTrackTintColor="#3498db"
            maximumTrackTintColor="#bdc3c7"
            thumbTintColor="#2980b9"
          />
        </View>

        <View style={styles.sliderContainer}>
          <View style={styles.labelRow}>
            <Text style={styles.label}>Atış Açısı</Text>
            <Text style={styles.value}>{state.angle.toFixed(1)}°</Text>
          </View>
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={90}
            step={1}
            value={state.angle}
            onValueChange={onAngleChange}
            minimumTrackTintColor="#3498db"
            maximumTrackTintColor="#bdc3c7"
            thumbTintColor="#2980b9"
          />
        </View>

        <View style={styles.sliderContainer}>
          <View style={styles.labelRow}>
            <Text style={styles.label}>Sürtünme Katsayısı (β/m)</Text>
            <Text style={styles.value}>{state.frictionCoef.toFixed(4)}</Text>
          </View>
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={0.01}
            step={0.0001}
            value={state.frictionCoef}
            onValueChange={onFrictionChange}
            minimumTrackTintColor="#3498db"
            maximumTrackTintColor="#bdc3c7"
            thumbTintColor="#2980b9"
          />
        </View>
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>
          Sürtünme kuvveti, cismin hızının karesi ile orantılıdır ve hareket yönünün tersinedir.
        </Text>
      </View>

      <View style={styles.buttonGroup}>
        <TouchableOpacity
          style={[styles.button, styles.primaryButton, state.isRunning && styles.stopButton]}
          onPress={onStart}
        >
          <Text style={styles.buttonText}>
            {state.isRunning ? 'Durdur' : 'Başlat'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.secondaryButton]}
          onPress={onReset}
        >
          <Text style={styles.buttonText}>Sıfırla</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    paddingBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  sliderGroup: {
    marginBottom: 20,
  },
  sliderContainer: {
    marginBottom: 15,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  value: {
    fontSize: 14,
    color: '#7f8c8d',
    fontWeight: 'bold',
  },
  slider: {
    width: '100%',
    height: 40,
  },
  infoContainer: {
    backgroundColor: '#f8f9fa',
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
  },
  infoText: {
    fontSize: 12,
    color: '#7f8c8d',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
  },
  button: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    minWidth: 100,
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: '#3498db',
  },
  secondaryButton: {
    backgroundColor: '#2ecc71',
  },
  stopButton: {
    backgroundColor: '#e74c3c',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 