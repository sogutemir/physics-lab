export type FieldType = 'straight' | 'coil' | 'bar';

export interface MagneticSimulatorProps {
  currentIntensity: number;
  wireDistance: number;
  coilTurns: number;
  fieldType: FieldType;
  showFieldLines: boolean;
  animateField: boolean;
  onChangeFieldType: (type: FieldType) => void;
  onToggleAnimation: () => void;
  onToggleFieldLines: () => void;
  onCoilTurnsChange: (turns: number) => void;
}

export interface ParameterControlsProps {
  title: string;
  currentIntensity: number;
  wireDistance: number;
  coilTurns: number;
  fieldType: FieldType;
  onCurrentIntensityChange: (value: number) => void;
  onWireDistanceChange: (value: number) => void;
  onCoilTurnsChange: (value: number) => void;
  onFieldTypeChange: (type: FieldType) => void;
  onReset: () => void;
}
