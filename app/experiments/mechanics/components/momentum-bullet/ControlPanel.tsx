import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native';
import Slider from '@react-native-community/slider';
import { useLanguage } from '../../../../../components/LanguageContext';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import { CollisionMode } from '../../utils/momentum-bullet/physics';

interface ControlPanelProps {
  isRunning: boolean;
  timeScale: number;
  wallElasticity: number;
  projectilesCount: number;
  collisionMode: CollisionMode;
  onTimeScaleChange: (value: number) => void;
  onWallElasticityChange: (value: number) => void;
  onModeChange: (mode: CollisionMode) => void;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  onClear: () => void;
}

const ControlPanel = ({
  isRunning,
  timeScale,
  wallElasticity,
  projectilesCount,
  collisionMode,
  onTimeScaleChange,
  onWallElasticityChange,
  onModeChange,
  onStart,
  onPause,
  onReset,
  onClear,
}: ControlPanelProps) => {
  const { t } = useLanguage();

  return (
    <View style={styles.container}>
      <View style={styles.sliderContainer}>
        <View style={styles.sliderHeader}>
          <Text style={styles.sliderLabel}>
            {t('Simülasyon Hızı', 'Simulation Speed')}
          </Text>
          <Text style={styles.sliderValue}>{timeScale.toFixed(1)}x</Text>
        </View>
        <Slider
          style={styles.slider}
          minimumValue={0.1}
          maximumValue={3.0}
          step={0.1}
          value={timeScale}
          onValueChange={onTimeScaleChange}
          minimumTrackTintColor="#3b82f6"
          maximumTrackTintColor="#d1d5db"
          thumbTintColor="#3b82f6"
        />
      </View>

      <View style={styles.sliderContainer}>
        <View style={styles.sliderHeader}>
          <Text style={styles.sliderLabel}>
            {t('Duvar Esnekliği', 'Wall Elasticity')}
          </Text>
          <Text style={styles.sliderValue}>{wallElasticity.toFixed(2)}</Text>
        </View>
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={1}
          step={0.01}
          value={wallElasticity}
          onValueChange={onWallElasticityChange}
          minimumTrackTintColor="#3b82f6"
          maximumTrackTintColor="#d1d5db"
          thumbTintColor="#3b82f6"
        />
      </View>

      <View style={styles.separator} />

      <View style={styles.modeSelector}>
        <Text style={styles.modeTitle}>
          {t('Çarpışma Modu', 'Collision Mode')}:
        </Text>
        <View style={styles.modeButtons}>
          <TouchableOpacity
            style={[
              styles.modeButton,
              collisionMode === CollisionMode.BULLET && styles.activeMode,
            ]}
            onPress={() => onModeChange(CollisionMode.BULLET)}
            disabled={isRunning}
          >
            <Text
              style={[
                styles.modeButtonText,
                collisionMode === CollisionMode.BULLET && styles.activeModeText,
              ]}
            >
              {t('Mermi Modu', 'Bullet Mode')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.modeButton,
              collisionMode === CollisionMode.COLLISION && styles.activeMode,
            ]}
            onPress={() => onModeChange(CollisionMode.COLLISION)}
            disabled={isRunning}
          >
            <Text
              style={[
                styles.modeButtonText,
                collisionMode === CollisionMode.COLLISION &&
                  styles.activeModeText,
              ]}
            >
              {t('Çarpışma Modu', 'Collision Mode')}
            </Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.modeDescription}>
          {collisionMode === CollisionMode.BULLET
            ? t(
                'Mermi hedefin içine saplanır ve birlikte hareket ederler',
                'Projectile embeds in target and they move together'
              )
            : t(
                'Mermi hedeften sekip momentum aktarır',
                'Projectile bounces off target and transfers momentum'
              )}
        </Text>
      </View>

      <View style={styles.separator} />

      <View style={styles.buttonRow}>
        {!isRunning ? (
          <TouchableOpacity
            style={[
              styles.button,
              styles.primaryButton,
              projectilesCount === 0 && styles.disabledButton,
            ]}
            onPress={onStart}
            disabled={projectilesCount === 0}
          >
            <FontAwesome
              name="play"
              size={16}
              color="white"
              style={styles.buttonIcon}
            />
            <Text style={styles.buttonText}>{t('Başlat', 'Start')}</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.button, styles.secondaryButton]}
            onPress={onPause}
          >
            <FontAwesome
              name="pause"
              size={16}
              color="#4b5563"
              style={styles.buttonIcon}
            />
            <Text style={styles.secondaryButtonText}>
              {t('Duraklat', 'Pause')}
            </Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={[
            styles.button,
            styles.outlineButton,
            projectilesCount === 0 && styles.disabledButton,
          ]}
          onPress={onReset}
          disabled={projectilesCount === 0}
        >
          <MaterialIcons
            name="refresh"
            size={16}
            color="#4b5563"
            style={styles.buttonIcon}
          />
          <Text style={styles.outlineButtonText}>{t('Sıfırla', 'Reset')}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.button,
            styles.outlineButton,
            projectilesCount === 0 && styles.disabledButton,
          ]}
          onPress={onClear}
          disabled={projectilesCount === 0}
        >
          <MaterialIcons
            name="delete-outline"
            size={16}
            color="#4b5563"
            style={styles.buttonIcon}
          />
          <Text style={styles.outlineButtonText}>
            {t('Hepsini Temizle', 'Clear All')}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 8,
    backgroundColor: 'white',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
      web: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
    }),
  },
  sliderContainer: {
    marginBottom: 20,
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
  separator: {
    height: 1,
    backgroundColor: '#e5e7eb',
    marginVertical: 16,
  },
  buttonRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 8,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 6,
    flex: 1,
    minWidth: 100,
  },
  buttonIcon: {
    marginRight: 8,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '500',
    color: 'white',
  },
  primaryButton: {
    backgroundColor: '#3b82f6',
  },
  secondaryButton: {
    backgroundColor: '#f3f4f6',
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  secondaryButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4b5563',
  },
  outlineButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4b5563',
  },
  disabledButton: {
    opacity: 0.5,
  },
  modeSelector: {
    marginBottom: 16,
  },
  modeTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4b5563',
    marginBottom: 8,
  },
  modeButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  modeButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 4,
  },
  activeMode: {
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6',
  },
  modeButtonText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#4b5563',
  },
  activeModeText: {
    color: 'white',
  },
  modeDescription: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
    marginTop: 4,
  },
});

export default ControlPanel;
