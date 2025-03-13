export type FieldType = 'straight-wire' | 'coil' | 'bar-magnet';

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
}

export interface ParameterControlsProps {
  title: string;
  currentIntensity: number;
  wireDistance: number;
  coilTurns: number;
  fieldType: FieldType;
  onUpdateCurrentIntensity: (value: number) => void;
  onUpdateWireDistance: (value: number) => void;
  onUpdateCoilTurns: (value: number) => void;
  onResetParameters: () => void;
  onChangeFieldType: (type: FieldType) => void;
}
