import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Platform,
  ScrollView,
} from 'react-native';
import Slider from '@react-native-community/slider';
import { Switch } from 'react-native';
import { TargetBox } from '../../utils/momentum-bullet/physics';
import { useLanguage } from '../../../../../components/LanguageContext';

interface ProjectileSettingsProps {
  canvasWidth: number;
  canvasHeight: number;
  onAddProjectile: (projectile: any) => void;
  onUpdateTargetBox: (updates: Partial<TargetBox>) => void;
  targetBox: TargetBox;
  disabled: boolean;
}

const ProjectileSettings = ({
  canvasWidth,
  canvasHeight,
  onAddProjectile,
  onUpdateTargetBox,
  targetBox,
  disabled,
}: ProjectileSettingsProps) => {
  const { t } = useLanguage();
  const [mass, setMass] = useState(5);
  const [velocity, setVelocity] = useState(30);

  // Hedef kutu sertliği için değişiklik işleyicisi
  const handleHardnessChange = (value: number) => {
    onUpdateTargetBox({ hardness: value });
  };

  // Hedef kutu kalınlığı için değişiklik işleyicisi
  const handleThicknessChange = (value: number) => {
    onUpdateTargetBox({ thickness: value });
  };

  // Sabit/hareketli hedef kutu için değişiklik işleyicisi
  const handleFixedToggle = (checked: boolean) => {
    onUpdateTargetBox({ isFixed: checked });
  };

  const handleAddProjectile = () => {
    // Hedef kutu merkezine doğru yön vektörünü hesapla
    const targetCenterX = targetBox.position.x + targetBox.width / 2;
    const targetCenterY = targetBox.position.y + targetBox.height / 2;

    // Ekranın solundan başlangıç konumu
    const startX = canvasWidth / 10;
    const startY = canvasHeight / 2;

    // Yön vektörünü hesapla
    const dx = targetCenterX - startX;
    const dy = targetCenterY - startY;

    // Yön vektörünü normalize et
    const length = Math.sqrt(dx * dx + dy * dy);
    const normalizedDx = dx / length;
    const normalizedDy = dy / length;

    // Hedef yönünde hızı belirle
    const initialVelocity = {
      x: velocity * normalizedDx,
      y: velocity * normalizedDy,
    };

    const projectile = {
      position: { x: startX, y: startY },
      velocity: initialVelocity,
      acceleration: { x: 0, y: 0 },
      mass: mass,
      radius: mass * 1.5,
      color: '#F472B6',
      elasticity: 0.8,
    };

    onAddProjectile(projectile);
  };

  return (
    <ScrollView style={styles.container}>
      {/* Mermi ayarları bölümü */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          {t('Mermi Ayarları', 'Projectile Settings')}
        </Text>

        {/* Kütle slider'ı */}
        <View style={styles.sliderContainer}>
          <View style={styles.sliderHeader}>
            <Text style={styles.sliderLabel}>
              {t('Mermi Kütlesi (kg)', 'Projectile Mass (kg)')}
            </Text>
            <Text style={styles.sliderValue}>{mass} kg</Text>
          </View>
          <Slider
            style={styles.slider}
            value={mass}
            minimumValue={1}
            maximumValue={10}
            step={0.1}
            onValueChange={(value) => setMass(value)}
            disabled={disabled}
            minimumTrackTintColor="#3b82f6"
            maximumTrackTintColor="#d1d5db"
            thumbTintColor="#3b82f6"
          />
        </View>

        {/* Hız slider'ı */}
        <View style={styles.sliderContainer}>
          <View style={styles.sliderHeader}>
            <Text style={styles.sliderLabel}>
              {t('Hız (m/s)', 'Velocity (m/s)')}
            </Text>
            <Text style={styles.sliderValue}>{velocity} m/s</Text>
          </View>
          <Slider
            style={styles.slider}
            value={velocity}
            minimumValue={1}
            maximumValue={80}
            step={1}
            onValueChange={(value) => setVelocity(value)}
            disabled={disabled}
            minimumTrackTintColor="#3b82f6"
            maximumTrackTintColor="#d1d5db"
            thumbTintColor="#3b82f6"
          />
        </View>

        {/* Mermi Ekle butonu */}
        <TouchableOpacity
          style={[
            styles.button,
            styles.primaryButton,
            disabled && styles.disabledButton,
          ]}
          onPress={handleAddProjectile}
          disabled={disabled}
        >
          <Text style={styles.buttonText}>
            {t('Mermi Ekle', 'Add Projectile')}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Hedef kutu ayarları bölümü */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          {t('Hedef Kutu Ayarları', 'Target Box Settings')}
        </Text>

        {/* Kutu kütlesi ayarı */}
        <View style={styles.sliderContainer}>
          <View style={styles.sliderHeader}>
            <Text style={styles.sliderLabel}>
              {t('Kutu Kütlesi (kg)', 'Box Mass (kg)')}
            </Text>
            <Text style={styles.sliderValue}>
              {targetBox.mass.toFixed(1)} kg
            </Text>
          </View>
          <Slider
            style={styles.slider}
            value={targetBox.mass}
            minimumValue={1}
            maximumValue={50}
            step={1}
            onValueChange={(value) => onUpdateTargetBox({ mass: value })}
            disabled={disabled}
            minimumTrackTintColor="#3b82f6"
            maximumTrackTintColor="#d1d5db"
            thumbTintColor="#3b82f6"
          />
        </View>

        {/* Kutu boyutu ayarları */}
        <View style={styles.row}>
          <View style={[styles.inputContainer, styles.halfWidth]}>
            <Text style={styles.inputLabel}>{t('Genişlik', 'Width')}</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={String(targetBox.width)}
              onChangeText={(text) => {
                const width = Number(text);
                if (!isNaN(width) && width >= 20 && width <= canvasWidth / 2) {
                  onUpdateTargetBox({ width });
                }
              }}
              editable={!disabled}
            />
          </View>
          <View style={[styles.inputContainer, styles.halfWidth]}>
            <Text style={styles.inputLabel}>{t('Yükseklik', 'Height')}</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={String(targetBox.height)}
              onChangeText={(text) => {
                const height = Number(text);
                if (
                  !isNaN(height) &&
                  height >= 20 &&
                  height <= canvasHeight / 2
                ) {
                  onUpdateTargetBox({ height });
                }
              }}
              editable={!disabled}
            />
          </View>
        </View>

        {/* Malzeme sertliği ayarı */}
        <View style={styles.sliderContainer}>
          <View style={styles.sliderHeader}>
            <Text style={styles.sliderLabel}>
              {t('Malzeme Sertliği', 'Material Hardness')}
            </Text>
            <Text style={styles.sliderValue}>
              {targetBox.hardness?.toFixed(1) || '8.0'}
            </Text>
          </View>
          <Slider
            style={styles.slider}
            value={targetBox.hardness || 8}
            minimumValue={1}
            maximumValue={20}
            step={0.5}
            onValueChange={handleHardnessChange}
            disabled={disabled}
            minimumTrackTintColor="#3b82f6"
            maximumTrackTintColor="#d1d5db"
            thumbTintColor="#3b82f6"
          />
          <Text style={styles.helperText}>
            {t(
              'Düşük değer = Kolay delinir, Yüksek değer = Zor delinir',
              'Low value = Easy to penetrate, High value = Hard to penetrate'
            )}
          </Text>
        </View>

        {/* Malzeme kalınlığı ayarı */}
        <View style={styles.sliderContainer}>
          <View style={styles.sliderHeader}>
            <Text style={styles.sliderLabel}>
              {t('Malzeme Kalınlığı (cm)', 'Material Thickness (cm)')}
            </Text>
            <Text style={styles.sliderValue}>
              {targetBox.thickness?.toFixed(1) || '5.0'} cm
            </Text>
          </View>
          <Slider
            style={styles.slider}
            value={targetBox.thickness || 5}
            minimumValue={1}
            maximumValue={20}
            step={0.5}
            onValueChange={handleThicknessChange}
            disabled={disabled}
            minimumTrackTintColor="#3b82f6"
            maximumTrackTintColor="#d1d5db"
            thumbTintColor="#3b82f6"
          />
          <Text style={styles.helperText}>
            {t(
              'Düşük değer = İnce malzeme, Yüksek değer = Kalın malzeme',
              'Low value = Thin material, High value = Thick material'
            )}
          </Text>
        </View>

        {/* Sabit/Hareketli geçişi */}
        <View style={styles.toggleContainer}>
          <Text style={styles.toggleLabel}>{t('Sabit Kutu', 'Fixed Box')}</Text>
          <Switch
            value={targetBox.isFixed}
            onValueChange={handleFixedToggle}
            disabled={disabled}
            trackColor={{ false: '#d1d5db', true: '#bfdbfe' }}
            thumbColor={targetBox.isFixed ? '#3b82f6' : '#f4f3f4'}
          />
        </View>

        {/* Kutu rengi seçimi */}
        <View style={styles.colorSection}>
          <Text style={styles.colorSectionLabel}>{t('Renk', 'Color')}</Text>
          <View style={styles.colorOptions}>
            {['#6B7280', '#EF4444', '#3B82F6', '#10B981', '#F59E0B'].map(
              (color) => (
                <TouchableOpacity
                  key={color}
                  style={[
                    styles.colorOption,
                    { backgroundColor: color },
                    targetBox.color === color && styles.selectedColor,
                  ]}
                  onPress={() => onUpdateTargetBox({ color })}
                  disabled={disabled}
                />
              )
            )}
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  section: {
    marginBottom: 20,
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 8,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
      web: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
    }),
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    color: '#111827',
  },
  sliderContainer: {
    marginBottom: 16,
  },
  sliderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sliderLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4b5563',
  },
  sliderValue: {
    fontSize: 14,
    color: '#6b7280',
  },
  slider: {
    width: '100%',
    height: 40,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButton: {
    backgroundColor: '#3b82f6',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  disabledButton: {
    opacity: 0.5,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  halfWidth: {
    width: '48%',
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4b5563',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
  },
  helperText: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    marginBottom: 16,
  },
  toggleLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4b5563',
  },
  colorSection: {
    marginBottom: 16,
  },
  colorSectionLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4b5563',
    marginBottom: 12,
  },
  colorOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  colorOption: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  selectedColor: {
    borderWidth: 2,
    borderColor: '#000',
  },
});

export default ProjectileSettings;
