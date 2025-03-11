import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useLanguage } from '../../../../components/LanguageContext';

const InfoCard: React.FC = () => {
  const { t } = useLanguage();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>
          {t('Ohm Yasası Nedir?', "What is Ohm's Law?")}
        </Text>
        <Text style={styles.description}>
          {t(
            'Elektriksel devrelerin temel ilişkilerini açıklayan fizik kanunu',
            'The physics law that explains the fundamental relationships in electrical circuits'
          )}
        </Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.paragraph}>
          {t(
            'Ohm Yasası, bir elektrik devresinde akım (I), gerilim (V) ve direnç (R) arasındaki ilişkiyi açıklar. Bu yasaya göre, bir devrede, eğer direnç sabit kalırsa, akım, gerilim ile doğru orantılıdır.',
            "Ohm's Law explains the relationship between current (I), voltage (V), and resistance (R) in an electrical circuit. According to this law, if resistance remains constant, current is directly proportional to voltage."
          )}
        </Text>

        <View style={styles.formulaBox}>
          <Text style={styles.formulaText}>V = I × R</Text>
        </View>

        <View style={styles.definitionList}>
          <Text style={styles.definitionItem}>
            <Text style={styles.voltageText}>
              {t('V (Gerilim)', 'V (Voltage)')}:{' '}
            </Text>
            {t(
              'Elektrik potansiyel farkı. Birimi Volt (V)',
              'Electric potential difference. Unit is Volt (V)'
            )}
          </Text>

          <Text style={styles.definitionItem}>
            <Text style={styles.currentText}>
              {t('I (Akım)', 'I (Current)')}:{' '}
            </Text>
            {t(
              'Elektrik akış hızı. Birimi Amper (A)',
              'Rate of electric flow. Unit is Ampere (A)'
            )}
          </Text>

          <Text style={styles.definitionItem}>
            <Text style={styles.resistanceText}>
              {t('R (Direnç)', 'R (Resistance)')}:{' '}
            </Text>
            {t(
              'Elektrik akışına karşı direnç. Birimi Ohm (Ω)',
              'Resistance to electric flow. Unit is Ohm (Ω)'
            )}
          </Text>
        </View>

        <Text style={styles.paragraph}>
          {t(
            'Etkileşimli simülasyonu kullanarak, bir değeri değiştirdiğinizde diğer değerlerin nasıl etkilendiğini görebilirsiniz.',
            'Using the interactive simulation, you can see how changing one value affects the others.'
          )}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 16,
    overflow: 'hidden',
    marginVertical: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: '#666',
  },
  content: {
    padding: 16,
  },
  paragraph: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
    color: '#333',
  },
  formulaBox: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 16,
  },
  formulaText: {
    fontSize: 18,
    fontWeight: '600',
  },
  definitionList: {
    marginVertical: 16,
  },
  definitionItem: {
    fontSize: 14,
    marginBottom: 8,
    lineHeight: 20,
  },
  voltageText: {
    fontWeight: '600',
    color: '#3498db',
  },
  currentText: {
    fontWeight: '600',
    color: '#f39c12',
  },
  resistanceText: {
    fontWeight: '600',
    color: '#e74c3c',
  },
});

export default InfoCard;
