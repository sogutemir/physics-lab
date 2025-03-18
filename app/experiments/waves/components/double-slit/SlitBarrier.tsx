import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useLanguage } from '../../../../../components/LanguageContext';
import { wavelengthToRGB } from '../../utils/physics';

interface SlitBarrierProps {
  slitWidth: number; // mm cinsinden
  slitSeparation: number; // mm cinsinden
  wavelength: number; // nm cinsinden
  isActive: boolean;
}

const SlitBarrier: React.FC<SlitBarrierProps> = ({
  slitWidth,
  slitSeparation,
  wavelength,
  isActive,
}) => {
  const { t } = useLanguage();
  const color = wavelengthToRGB(wavelength);
  const totalHeight = 160; // piksel cinsinden yükseklik

  // Daha iyi görünürlük için ölçeklendirme faktörleri
  const separationPx = Math.min(80, slitSeparation * 10); // 10 ölçek faktörü
  const widthPx = Math.max(2, slitWidth * 5); // Minimum 2px genişlik, 5 ölçek faktörü

  // Yarıkların pozisyonlarını hesaplama
  const centerY = totalHeight / 2;
  const slit1Y = centerY - separationPx / 2 - widthPx / 2;
  const slit2Y = centerY + separationPx / 2 - widthPx / 2;

  return (
    <View style={styles.container}>
      <View style={styles.barrierContainer}>
        {/* Metal levha (Tamamen siyah) */}
        <View style={styles.metalPlate}>
          {/* Kenar gölgesi */}
          <View style={styles.plateShadow} />
        </View>

        {/* Çift yarık */}
        <View style={styles.barrier}>
          {/* Üst yarık */}
          <View
            style={[
              styles.slit,
              {
                top: slit1Y,
                height: widthPx,
                backgroundColor: isActive ? color : '#666',
                shadowColor: isActive ? color : 'transparent',
                opacity: isActive ? 1 : 0.5,
              },
            ]}
          />

          {/* Alt yarık */}
          <View
            style={[
              styles.slit,
              {
                top: slit2Y,
                height: widthPx,
                backgroundColor: isActive ? color : '#666',
                shadowColor: isActive ? color : 'transparent',
                opacity: isActive ? 1 : 0.5,
              },
            ]}
          />
        </View>
      </View>

      {/* Etiket */}
      <View style={styles.label}>
        <Text style={styles.labelText}>{t('Çift Yarık', 'Double Slit')}</Text>
        <Text style={styles.valueText}>{slitSeparation.toFixed(1)} mm</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 160,
    alignItems: 'center',
    justifyContent: 'center',
  },
  barrierContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  metalPlate: {
    height: 160,
    width: 40,
    backgroundColor: '#000', // Tamamen siyah
    borderRadius: 0,
    position: 'absolute',
  },
  plateShadow: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: 4,
    backgroundColor: '#111',
    opacity: 0.5,
  },
  barrier: {
    height: 160,
    width: 40,
    backgroundColor: 'transparent',
    borderRadius: 0,
    position: 'relative',
    zIndex: 10,
    overflow: 'hidden',
  },
  slit: {
    position: 'absolute',
    left: 0,
    right: 0,
    width: '100%',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
  },
  label: {
    position: 'absolute',
    bottom: -24,
    alignItems: 'center',
  },
  labelText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#4b5563',
  },
  valueText: {
    fontSize: 12,
    fontFamily: 'monospace',
    color: '#6b7280',
  },
});

export default SlitBarrier;
