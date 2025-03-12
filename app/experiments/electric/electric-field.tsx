import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { useLanguage } from '../../../components/LanguageContext';
import ElectricFieldSimulator from './components/electric-field/ElectricFieldSimulator';

const ElectricFieldExperiment: React.FC = () => {
  const { t } = useLanguage();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>
            {t('Elektrik Alanı Deneyi', 'Electric Field Experiment')}
          </Text>
          <Text style={styles.description}>
            {t(
              'Bu deney, elektrik yüklerinin oluşturduğu elektrik alanını ve yükler arasındaki etkileşimleri görselleştirir. Coulomb Yasası ve elektrik alan kavramlarını keşfedin.',
              "This experiment visualizes the electric field created by electric charges and the interactions between charges. Explore Coulomb's Law and the concept of electric fields."
            )}
          </Text>
        </View>

        <ElectricFieldSimulator />

        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>
            {t('Elektrik Alanı Hakkında', 'About Electric Fields')}
          </Text>
          <Text style={styles.infoText}>
            {t(
              'Elektrik alanı, bir elektrik yükünün etrafındaki bölgede başka bir elektrik yüküne uygulanacak kuvveti tanımlayan bir fiziksel alandır. Elektrik alanı, birim pozitif yüke etki eden kuvvet olarak tanımlanır.',
              'An electric field is a physical field that surrounds electrically charged particles and describes the force that would be exerted on other charged objects. The electric field is defined as the force per unit positive charge.'
            )}
          </Text>

          <Text style={styles.formulaTitle}>
            {t('Coulomb Yasası:', "Coulomb's Law:")}
          </Text>
          <Text style={styles.formula}>F = k × (q₁ × q₂) / r²</Text>
          <Text style={styles.formulaDescription}>
            {t(
              'Burada F kuvvet, k Coulomb sabiti (9 × 10⁹ N·m²/C²), q₁ ve q₂ yüklerin değerleri ve r aralarındaki mesafedir.',
              "Where F is the force, k is Coulomb's constant (9 × 10⁹ N·m²/C²), q₁ and q₂ are the charge values, and r is the distance between them."
            )}
          </Text>

          <Text style={styles.formulaTitle}>
            {t('Elektrik Alanı:', 'Electric Field:')}
          </Text>
          <Text style={styles.formula}>E = F / q = k × Q / r²</Text>
          <Text style={styles.formulaDescription}>
            {t(
              'Burada E elektrik alanı, F kuvvet, q test yükü, Q kaynak yükü ve r mesafedir.',
              'Where E is the electric field, F is the force, q is the test charge, Q is the source charge, and r is the distance.'
            )}
          </Text>

          <Text style={styles.formulaTitle}>
            {t('Elektrik Potansiyeli:', 'Electric Potential:')}
          </Text>
          <Text style={styles.formula}>V = k × Q / r</Text>
          <Text style={styles.formulaDescription}>
            {t(
              'Burada V elektrik potansiyeli, k Coulomb sabiti, Q yük değeri ve r mesafedir.',
              "Where V is the electric potential, k is Coulomb's constant, Q is the charge value, and r is the distance."
            )}
          </Text>

          <Text style={styles.formulaTitle}>
            {t('Potansiyel Enerji:', 'Potential Energy:')}
          </Text>
          <Text style={styles.formula}>U = k × (q₁ × q₂) / r</Text>
          <Text style={styles.formulaDescription}>
            {t(
              'Burada U potansiyel enerji, k Coulomb sabiti, q₁ ve q₂ yük değerleri ve r aralarındaki mesafedir.',
              "Where U is the potential energy, k is Coulomb's constant, q₁ and q₂ are the charge values, and r is the distance between them."
            )}
          </Text>
        </View>

        <View style={styles.instructionsSection}>
          <Text style={styles.sectionTitle}>
            {t('Deney Talimatları', 'Experiment Instructions')}
          </Text>
          <Text style={styles.instructionText}>
            {t(
              '1. Pozitif veya negatif yükler ekleyin.',
              '1. Add positive or negative charges.'
            )}
          </Text>
          <Text style={styles.instructionText}>
            {t(
              '2. Yükleri sürükleyerek hareket ettirin ve elektrik alanının nasıl değiştiğini gözlemleyin.',
              '2. Drag charges to move them and observe how the electric field changes.'
            )}
          </Text>
          <Text style={styles.instructionText}>
            {t(
              '3. Simülasyonu başlatarak sabit olmayan yüklerin birbirlerini nasıl etkilediğini gözlemleyin.',
              '3. Start the simulation to observe how non-fixed charges affect each other.'
            )}
          </Text>
          <Text style={styles.instructionText}>
            {t(
              '4. Yük değerini değiştirerek farklı büyüklükteki yüklerin etkilerini inceleyin.',
              '4. Change the charge value to examine the effects of charges with different magnitudes.'
            )}
          </Text>
          <Text style={styles.instructionText}>
            {t(
              '5. Boş alana tıklayarak ölçüm noktası yerleştirin ve o konumdaki elektrik potansiyelini ölçün.',
              '5. Click on an empty area to place a measurement point and measure the electric potential at that location.'
            )}
          </Text>
          <Text style={styles.instructionText}>
            {t(
              '6. Yükler arasındaki etkileşimi ve potansiyel enerji değerlerini ölçüm panelinden takip edin.',
              '6. Monitor the interaction between charges and potential energy values from the measurement panel.'
            )}
          </Text>
        </View>

        <View style={styles.featuresSection}>
          <Text style={styles.sectionTitle}>
            {t('Yeni Özellikler', 'New Features')}
          </Text>
          <View style={styles.featureItem}>
            <Text style={styles.featureTitle}>
              {t('Potansiyel Enerji Ölçümü', 'Potential Energy Measurement')}
            </Text>
            <Text style={styles.featureText}>
              {t(
                'Yükler arasındaki potansiyel enerji değerlerini hesaplayarak görebilirsiniz. Aynı işaretli yükler arasında pozitif potansiyel enerji (itme), zıt işaretli yükler arasında negatif potansiyel enerji (çekme) gözlemleyebilirsiniz.',
                'You can view the calculated potential energy values between charges. Observe positive potential energy (repulsion) between same-sign charges, and negative potential energy (attraction) between opposite-sign charges.'
              )}
            </Text>
          </View>
          <View style={styles.featureItem}>
            <Text style={styles.featureTitle}>
              {t(
                'Elektrik Potansiyeli Ölçümü',
                'Electric Potential Measurement'
              )}
            </Text>
            <Text style={styles.featureText}>
              {t(
                'Artık herhangi bir noktadaki elektrik potansiyelini ölçebilirsiniz. İstediğiniz noktaya tıklayarak o konumdaki toplam elektrik potansiyelini Volt cinsinden görebilirsiniz.',
                'You can now measure the electric potential at any point. Simply click on any location to see the total electric potential at that point in Volts.'
              )}
            </Text>
          </View>
          <View style={styles.featureItem}>
            <Text style={styles.featureTitle}>
              {t('İnteraktif Görselleştirme', 'Interactive Visualization')}
            </Text>
            <Text style={styles.featureText}>
              {t(
                'Yükler arasındaki etkileşim çizgileri, etkileşimin tipini (çekme veya itme) göstermek için renk kodlu olarak gösterilmektedir. Bu görselleştirme, elektrik alanını daha iyi anlamanıza yardımcı olur.',
                'Interaction lines between charges are color-coded to indicate the type of interaction (attraction or repulsion). This visualization helps you better understand the electric field.'
              )}
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    padding: 16,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: '#34495e',
    lineHeight: 22,
  },
  infoSection: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginTop: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  instructionsSection: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  featuresSection: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 15,
    color: '#34495e',
    lineHeight: 22,
    marginBottom: 16,
  },
  formulaTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginTop: 12,
    marginBottom: 4,
  },
  formula: {
    fontSize: 18,
    fontWeight: '500',
    color: '#3498db',
    textAlign: 'center',
    marginVertical: 8,
    fontFamily: 'monospace',
  },
  formulaDescription: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 16,
    lineHeight: 20,
  },
  instructionText: {
    fontSize: 15,
    color: '#34495e',
    marginBottom: 8,
    lineHeight: 22,
  },
  featureItem: {
    marginBottom: 16,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 6,
  },
  featureText: {
    fontSize: 14,
    color: '#34495e',
    lineHeight: 20,
  },
});

export default ElectricFieldExperiment;
