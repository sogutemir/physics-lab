import { RlcState, CircuitValues } from './types';

export const calculateCircuitValues = (state: RlcState): CircuitValues => {
  const { voltage, frequency, resistance, capacitance, inductance } = state;
  const omega = frequency;
  const XL = Math.round(10.0 * omega * inductance * 0.001) / 10.0; // mH to H
  const XC = Math.round(10.0 / (omega * capacitance * 1e-6)) / 10.0; // μF to F
  const Z = Math.sqrt(resistance * resistance + (XL - XC) * (XL - XC));
  const phase = Math.atan2(XL - XC, resistance);
  const current = voltage / Z;
  const VR = current * resistance;
  const VC = current * XC;
  const VL = current * XL;

  return { omega, XL, XC, Z, phase, current, VR, VC, VL };
};

export const calculateResonanceFrequency = (
  inductance: number,
  capacitance: number
): number => {
  const L = inductance * 0.001; // mH to H
  const C = capacitance * 1e-6; // μF to F
  return 1.0 / (2 * Math.PI * Math.sqrt(L * C));
};
