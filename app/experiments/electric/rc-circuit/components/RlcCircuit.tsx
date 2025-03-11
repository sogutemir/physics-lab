import React, { useState, useEffect } from 'react';
import { View, StyleSheet, useWindowDimensions } from 'react-native';
import { RlcState, CircuitValues } from '../utils/types';
import {
  calculateCircuitValues,
  calculateResonanceFrequency,
} from '../utils/rlcCalculations';
import { useLanguage } from '../../../../../components/LanguageContext';
import { ScrollView } from 'react-native-gesture-handler';
import { Button } from '../../../../../components/ui/button';
import RlcControls from './RlcControls';
import RlcCircuitDiagram from './RlcCircuitDiagram';
import CircuitValuesDisplay from './CircuitValuesDisplay';

const RlcCircuit: React.FC = () => {
  const { t } = useLanguage();
  const { width } = useWindowDimensions();
  const isMobile = width < 768;

  const [state, setState] = useState<RlcState>({
    voltage: 10,
    frequency: 50,
    resistance: 100,
    capacitance: 100,
    inductance: 100,
    time: 0,
    isRunning: false,
  });

  const [values, setValues] = useState<CircuitValues>(() =>
    calculateCircuitValues(state)
  );

  const [resonanceFrequency, setResonanceFrequency] = useState<number>(0);

  useEffect(() => {
    setValues(calculateCircuitValues(state));
    setResonanceFrequency(
      calculateResonanceFrequency(state.inductance, state.capacitance)
    );
  }, [
    state.voltage,
    state.frequency,
    state.resistance,
    state.capacitance,
    state.inductance,
  ]);

  useEffect(() => {
    let animationFrame: number;

    const updateTime = () => {
      if (state.isRunning) {
        setState((prevState) => ({
          ...prevState,
          time: prevState.time + 0.05,
        }));
        animationFrame = requestAnimationFrame(updateTime);
      }
    };

    if (state.isRunning) {
      animationFrame = requestAnimationFrame(updateTime);
    }

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [state.isRunning]);

  const handleStartStop = () => {
    setState((prevState) => ({
      ...prevState,
      isRunning: !prevState.isRunning,
    }));
  };

  const handleReset = () => {
    setState((prevState) => ({
      ...prevState,
      time: 0,
      isRunning: false,
    }));
  };

  const handleResonance = () => {
    setState((prevState) => ({
      ...prevState,
      frequency: resonanceFrequency,
    }));
  };

  const handleVoltageChange = (value: number) => {
    setState((prevState) => ({ ...prevState, voltage: value }));
  };

  const handleFrequencyChange = (value: number) => {
    setState((prevState) => ({ ...prevState, frequency: value }));
  };

  const handleResistanceChange = (value: number) => {
    setState((prevState) => ({ ...prevState, resistance: value }));
  };

  const handleCapacitanceChange = (value: number) => {
    setState((prevState) => ({ ...prevState, capacitance: value }));
  };

  const handleInductanceChange = (value: number) => {
    setState((prevState) => ({ ...prevState, inductance: value }));
  };

  return (
    <ScrollView style={styles.container}>
      {isMobile ? (
        <View style={styles.mobileLayout}>
          <RlcCircuitDiagram values={values} />

          <CircuitValuesDisplay values={values} resistance={state.resistance} />

          <RlcControls
            state={state}
            onStartStop={handleStartStop}
            onReset={handleReset}
            onResonance={handleResonance}
            onVoltageChange={handleVoltageChange}
            onFrequencyChange={handleFrequencyChange}
            onResistanceChange={handleResistanceChange}
            onCapacitanceChange={handleCapacitanceChange}
            onInductanceChange={handleInductanceChange}
            resonanceFrequency={resonanceFrequency}
          />
        </View>
      ) : (
        <View style={styles.desktopLayout}>
          <View style={styles.leftPanel}>
            <RlcCircuitDiagram values={values} />
            <CircuitValuesDisplay
              values={values}
              resistance={state.resistance}
            />
          </View>

          <View style={styles.rightPanel}>
            <RlcControls
              state={state}
              onStartStop={handleStartStop}
              onReset={handleReset}
              onResonance={handleResonance}
              onVoltageChange={handleVoltageChange}
              onFrequencyChange={handleFrequencyChange}
              onResistanceChange={handleResistanceChange}
              onCapacitanceChange={handleCapacitanceChange}
              onInductanceChange={handleInductanceChange}
              resonanceFrequency={resonanceFrequency}
            />
          </View>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  mobileLayout: {
    padding: 16,
    gap: 16,
  },
  desktopLayout: {
    flexDirection: 'row',
    padding: 24,
    gap: 24,
  },
  leftPanel: {
    flex: 3,
    gap: 16,
  },
  rightPanel: {
    flex: 2,
  },
});

export default RlcCircuit;
