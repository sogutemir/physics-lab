import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import Slider from '@react-native-community/slider';
import { MomentBalanceControlsProps } from './types';

export const MomentBalanceControls: React.FC<MomentBalanceControlsProps> = ({
  state,
  onLeftWeightChange,
  onRightWeightChange,
  onLeftRatioChange,
  onRightRatioChange,
  onReset,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.controlsRow}>
        <View style={styles.controlColumn}>
          <Text style={styles.controlTitle}>Sol Ağırlık / Left Weight</Text>
          <View style={styles.sliderContainer}>
            <Text style={styles.sliderValue}>
              {state.leftWeight.toFixed(1)} N
            </Text>
            <Slider
              style={styles.slider}
              minimumValue={1}
              maximumValue={6}
              step={0.1}
              value={state.leftWeight}
              onValueChange={onLeftWeightChange}
              minimumTrackTintColor="#3498db"
              maximumTrackTintColor="#bdc3c7"
              thumbTintColor="#3498db"
            />
          </View>
        </View>

        <View style={styles.controlColumn}>
          <Text style={styles.controlTitle}>Sağ Ağırlık / Right Weight</Text>
          <View style={styles.sliderContainer}>
            <Text style={styles.sliderValue}>
              {state.rightWeight.toFixed(1)} N
            </Text>
            <Slider
              style={styles.slider}
              minimumValue={1}
              maximumValue={6}
              step={0.1}
              value={state.rightWeight}
              onValueChange={onRightWeightChange}
              minimumTrackTintColor="#e74c3c"
              maximumTrackTintColor="#bdc3c7"
              thumbTintColor="#e74c3c"
            />
          </View>
        </View>
      </View>

      <View style={styles.controlsRow}>
        <View style={styles.controlColumn}>
          <Text style={styles.controlTitle}>Sol Uzaklık / Left Distance</Text>
          <View style={styles.sliderContainer}>
            <Text style={styles.sliderValue}>
              {(state.leftRatio * 100).toFixed(0)}%
            </Text>
            <Slider
              style={styles.slider}
              minimumValue={0.1}
              maximumValue={1}
              step={0.01}
              value={state.leftRatio}
              onValueChange={onLeftRatioChange}
              minimumTrackTintColor="#3498db"
              maximumTrackTintColor="#bdc3c7"
              thumbTintColor="#3498db"
            />
          </View>
        </View>

        <View style={styles.controlColumn}>
          <Text style={styles.controlTitle}>Sağ Uzaklık / Right Distance</Text>
          <View style={styles.sliderContainer}>
            <Text style={styles.sliderValue}>
              {(state.rightRatio * 100).toFixed(0)}%
            </Text>
            <Slider
              style={styles.slider}
              minimumValue={0.1}
              maximumValue={1}
              step={0.01}
              value={state.rightRatio}
              onValueChange={onRightRatioChange}
              minimumTrackTintColor="#e74c3c"
              maximumTrackTintColor="#bdc3c7"
              thumbTintColor="#e74c3c"
            />
          </View>
        </View>
      </View>

      <View style={styles.metricsContainer}>
        <View style={styles.metricRow}>
          <Text style={styles.metricLabel}>Sol Moment / Left Moment:</Text>
          <Text style={styles.metricValue}>
            {state.momentLeft.toFixed(2)} N·m
          </Text>
        </View>
        <View style={styles.metricRow}>
          <Text style={styles.metricLabel}>Sağ Moment / Right Moment:</Text>
          <Text style={styles.metricValue}>
            {state.momentRight.toFixed(2)} N·m
          </Text>
        </View>
        <View style={styles.metricRow}>
          <Text style={styles.metricLabel}>Net Moment / Net Moment:</Text>
          <Text
            style={[
              styles.metricValue,
              state.momentNet > 0
                ? styles.positiveValue
                : state.momentNet < 0
                ? styles.negativeValue
                : styles.zeroValue,
            ]}
          >
            {state.momentNet.toFixed(2)} N·m
          </Text>
        </View>
        <View style={styles.metricRow}>
          <Text style={styles.metricLabel}>Açı / Angle:</Text>
          <Text style={styles.metricValue}>{state.angle.toFixed(1)}°</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f9f9f9',
    padding: Platform.OS === 'web' ? 15 : 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  controlsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  controlColumn: {
    flex: 1,
    marginHorizontal: 5,
  },
  controlTitle: {
    fontSize: Platform.OS === 'web' ? 14 : 12,
    fontWeight: '500',
    marginBottom: 5,
    color: '#2c3e50',
  },
  sliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  slider: {
    flex: 1,
    height: 40,
  },
  sliderValue: {
    width: 50,
    fontSize: Platform.OS === 'web' ? 14 : 12,
    textAlign: 'center',
    color: '#7f8c8d',
  },
  metricsContainer: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ecf0f1',
  },
  metricRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  metricLabel: {
    fontSize: Platform.OS === 'web' ? 14 : 12,
    color: '#7f8c8d',
  },
  metricValue: {
    fontSize: Platform.OS === 'web' ? 14 : 12,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  positiveValue: {
    color: '#27ae60',
  },
  negativeValue: {
    color: '#e74c3c',
  },
  zeroValue: {
    color: '#3498db',
  },
});
