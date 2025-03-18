import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useLanguage } from '../../../../../components/LanguageContext';
import { wavelengthToRGB } from '../../utils/physics';

interface SlitBarrierProps {
  slitWidth: number;
  slitSeparation: number;
  wavelength: number;
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

  // Yarık yüksekliği (piksel cinsinden)
  const slitHeightPx = Math.max(4, Math.min(15, slitWidth * 12));

  // Yarıklar arası mesafe (piksel cinsinden)
  const separationPx = Math.min(60, Math.max(10, slitSeparation * 20));

  return (
    <View style={styles.container}>
      {/* Bariyer plaka */}
      <View style={styles.barrier}>
        {/* Plaka çerçevesi */}
        <View style={styles.plateFrame}>
          {/* Metal vidalar - daha az ve daha küçük */}
          <View style={[styles.screw, { top: 8, left: 8 }]} />
          <View style={[styles.screw, { top: 8, right: 8 }]} />
          <View style={[styles.screw, { bottom: 8, left: 8 }]} />
          <View style={[styles.screw, { bottom: 8, right: 8 }]} />

          {/* Metal plaka */}
          <View style={styles.plate}>
            {/* Üst yarık */}
            <View
              style={[
                styles.slit,
                {
                  top: 45 - separationPx / 2 - slitHeightPx / 2,
                  height: slitHeightPx,
                  borderColor: isActive ? color : '#94a3b8',
                  borderTopWidth: Math.max(1, Math.min(2, slitWidth * 2)),
                  borderBottomWidth: Math.max(1, Math.min(2, slitWidth * 2)),
                },
              ]}
            />

            {/* Alt yarık */}
            <View
              style={[
                styles.slit,
                {
                  top: 45 + separationPx / 2 - slitHeightPx / 2,
                  height: slitHeightPx,
                  borderColor: isActive ? color : '#94a3b8',
                  borderTopWidth: Math.max(1, Math.min(2, slitWidth * 2)),
                  borderBottomWidth: Math.max(1, Math.min(2, slitWidth * 2)),
                },
              ]}
            />
          </View>
        </View>
      </View>

      {/* Etiket - daha kompakt */}
      <View style={styles.label}>
        <Text style={styles.labelText}>{t('Çift Yarık', 'Double Slit')}</Text>
        <Text style={styles.valueText}>{slitSeparation.toFixed(1)} mm</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 120, // Daha kısa
    justifyContent: 'center',
    alignItems: 'center',
  },
  barrier: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 36, // Daha ince
    height: 90, // Daha kısa
  },
  plateFrame: {
    width: '100%',
    height: '100%',
    backgroundColor: '#cbd5e1',
    borderRadius: 3,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
  },
  plate: {
    width: '85%',
    height: '92%',
    backgroundColor: '#0f172a',
    borderRadius: 2,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  slit: {
    position: 'absolute',
    width: '100%',
    left: 0,
    backgroundColor: 'transparent',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#3b82f6',
  },
  screw: {
    position: 'absolute',
    width: 4, // Daha küçük
    height: 4, // Daha küçük
    borderRadius: 2, // Daha küçük
    backgroundColor: '#64748b',
  },
  label: {
    position: 'absolute',
    bottom: -18, // Daha yakın
    alignItems: 'center',
  },
  labelText: {
    fontSize: 10, // Daha küçük
    fontWeight: '500',
    color: '#4b5563',
  },
  valueText: {
    fontSize: 10, // Daha küçük
    fontFamily: 'monospace',
    color: '#6b7280',
  },
});

export default SlitBarrier;
