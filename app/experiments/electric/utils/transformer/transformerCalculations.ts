export interface TransformerParameters {
  primaryTurns: number;
  secondaryTurns: number;
  inputVoltage: number;
  inputFrequency: number;
  loadResistance: number;
  materialPermeability: number;
  coreType: 'E' | 'U' | 'toroid';
}

export interface TransformerResults {
  // Voltages and currents
  primaryVoltage: number;
  secondaryVoltage: number;
  primaryCurrent: number;
  secondaryCurrent: number;

  // Power calculations
  inputPower: number;
  outputPower: number;
  efficiency: number;

  // Losses
  copperLossPrimary: number;
  copperLossSecondary: number;
  coreLoss: number;

  // Field strength
  magneticFieldStrength: number;

  // Misc
  turnsRatio: number;
  loadedSecondaryVoltage: number;
  voltageRegulation: number;
}

// Core loss coefficients (approximate)
const HYSTERESIS_COEFFICIENT = 0.011;
const EDDY_CURRENT_COEFFICIENT = 0.0035;

// Winding resistance (approximate values in ohms per turn)
const PRIMARY_RESISTANCE_PER_TURN = 0.02;
const SECONDARY_RESISTANCE_PER_TURN = 0.015;

export function calculateTransformerPerformance(
  params: TransformerParameters
): TransformerResults {
  // Calculate turns ratio
  const turnsRatio = params.secondaryTurns / params.primaryTurns;

  // Calculate ideal secondary voltage (no load)
  const secondaryVoltage = params.inputVoltage * turnsRatio;

  // Calculate winding resistances
  const primaryResistance = params.primaryTurns * PRIMARY_RESISTANCE_PER_TURN;
  const secondaryResistance =
    params.secondaryTurns * SECONDARY_RESISTANCE_PER_TURN;

  // Calculate secondary current with load
  const secondaryCurrent =
    secondaryVoltage / (params.loadResistance + secondaryResistance);

  // Calculate loaded secondary voltage (with voltage drop)
  const loadedSecondaryVoltage = secondaryCurrent * params.loadResistance;

  // Calculate voltage regulation
  const voltageRegulation =
    ((secondaryVoltage - loadedSecondaryVoltage) / secondaryVoltage) * 100;

  // Calculate primary current (reflecting load + losses)
  const primaryCurrent = (secondaryCurrent / turnsRatio) * 1.1; // Adding 10% for core losses

  // Calculate copper losses
  const copperLossPrimary = primaryCurrent * primaryCurrent * primaryResistance;
  const copperLossSecondary =
    secondaryCurrent * secondaryCurrent * secondaryResistance;

  // Calculate core losses (simplified model)
  // Adjust coefficients based on core type
  let coreVolumeMultiplier = 1.0;
  if (params.coreType === 'E') coreVolumeMultiplier = 1.2;
  if (params.coreType === 'U') coreVolumeMultiplier = 1.0;
  if (params.coreType === 'toroid') coreVolumeMultiplier = 0.8;

  // Magnetic field strength is proportional to current and number of turns, inversely to permeability
  const magneticFieldStrength =
    (params.primaryTurns * primaryCurrent) /
    (Math.sqrt(params.materialPermeability) * 0.01);

  // Core loss calculation (simplified)
  const coreLoss =
    (HYSTERESIS_COEFFICIENT *
      Math.pow(params.inputFrequency, 1.6) *
      Math.pow(magneticFieldStrength, 2) +
      EDDY_CURRENT_COEFFICIENT *
        Math.pow(params.inputFrequency, 2) *
        Math.pow(magneticFieldStrength, 2)) *
    coreVolumeMultiplier *
    (10000 / params.materialPermeability);

  // Power calculations
  const inputPower = params.inputVoltage * primaryCurrent;
  const outputPower = loadedSecondaryVoltage * secondaryCurrent;

  // Calculate efficiency
  const totalLosses = copperLossPrimary + copperLossSecondary + coreLoss;
  const efficiency = (outputPower / (outputPower + totalLosses)) * 100;

  return {
    primaryVoltage: params.inputVoltage,
    secondaryVoltage: loadedSecondaryVoltage,
    primaryCurrent,
    secondaryCurrent,
    inputPower,
    outputPower,
    efficiency,
    copperLossPrimary,
    copperLossSecondary,
    coreLoss,
    magneticFieldStrength,
    turnsRatio,
    loadedSecondaryVoltage,
    voltageRegulation,
  };
}
