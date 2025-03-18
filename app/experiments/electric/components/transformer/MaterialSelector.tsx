import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useLanguage } from '../../../../../components/LanguageContext';

interface Material {
  id: string;
  name: string;
  nameEN: string;
  permeability: number;
  color: string;
}

interface MaterialSelectorProps {
  materials: Material[];
  selectedMaterial: string;
  onChange: (value: string) => void;
}

const MaterialSelector: React.FC<MaterialSelectorProps> = ({
  materials,
  selectedMaterial,
  onChange,
}) => {
  const { t } = useLanguage();

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{t('Nüve Malzemesi', 'Core Material')}</Text>
      <View style={styles.optionsContainer}>
        {materials.map((material) => (
          <TouchableOpacity
            key={material.id}
            style={styles.materialItem}
            onPress={() => onChange(material.id)}
          >
            <View
              style={[
                styles.radioButton,
                selectedMaterial === material.id && styles.radioButtonSelected,
              ]}
            >
              {selectedMaterial === material.id && (
                <View style={styles.radioInner} />
              )}
            </View>
            <View style={styles.materialInfo}>
              <Text style={styles.materialName}>
                {t(material.name, material.nameEN)}
              </Text>
              <Text style={styles.materialValue}>
                μᵣ = {material.permeability}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
    color: '#334155',
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  materialItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    width: '48%',
    marginBottom: 8,
  },
  radioButton: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: '#cbd5e1',
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },
  radioButtonSelected: {
    borderColor: '#3b82f6',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#3b82f6',
  },
  materialInfo: {
    flex: 1,
  },
  materialName: {
    fontSize: 12,
    fontWeight: '500',
    color: '#334155',
  },
  materialValue: {
    fontSize: 10,
    color: '#64748b',
  },
});

export default MaterialSelector;
