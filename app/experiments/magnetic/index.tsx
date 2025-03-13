import React from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import ExperimentLayout from '../../../components/ExperimentLayout';
import MagneticFieldExperiment from './components/MagneticFieldExperiment';

export default function MagneticExperimentPage() {
  return (
    <ExperimentLayout
      title="Manyetizma Deneyi"
      titleEn="Magnetism Experiment"
      difficulty="Orta Seviye"
      difficultyEn="Intermediate"
      description="Manyetik alanın özelliklerini ve etkilerini interaktif olarak keşfedin. Farklı manyetik alan kaynakları ile deneyler yapın ve manyetik alan çizgilerini gözlemleyin."
      descriptionEn="Interactively explore the properties and effects of magnetic fields. Experiment with different magnetic field sources and observe magnetic field lines."
      hideControls={true}
    >
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <View style={styles.container}>
          <View style={styles.infoSection}>
            <Text style={styles.sectionTitle}>Manyetik Alan Nedir?</Text>
            <Text style={styles.paragraph}>
              Manyetik alan, elektrik akımı veya manyetik malzemeler tarafından
              oluşturulan ve manyetik özelliklere sahip cisimlere kuvvet
              uygulayan bir alandır. Manyetik alanlar, elektrik akımı taşıyan
              teller, bobinler ve kalıcı mıknatıslar etrafında oluşur.
            </Text>

            <Text style={styles.subTitle}>Manyetik Alan Kaynakları:</Text>
            <Text style={styles.listItem}>
              • Düz Tel: Elektrik akımı taşıyan düz bir tel etrafında dairesel
              manyetik alan çizgileri oluşur.
            </Text>
            <Text style={styles.listItem}>
              • Bobin (Solenoid): Sarmal şeklinde sarılmış bir tel, içinde daha
              güçlü ve düzgün bir manyetik alan oluşturur.
            </Text>
            <Text style={styles.listItem}>
              • Çubuk Mıknatıs: Kalıcı mıknatıslar, kuzey ve güney kutupları
              arasında manyetik alan çizgileri oluşturur.
            </Text>
          </View>

          <MagneticFieldExperiment />

          <View style={styles.instructionsSection}>
            <Text style={styles.sectionTitle}>Deney Talimatları</Text>
            <Text style={styles.paragraph}>
              Bu interaktif simülasyonda farklı manyetik alan kaynaklarını
              inceleyebilir ve parametrelerini değiştirebilirsiniz:
            </Text>
            <Text style={styles.listItem}>
              1. Üstteki sekmelerden bir manyetik alan kaynağı seçin (Düz Tel,
              Bobin veya Çubuk Mıknatıs).
            </Text>
            <Text style={styles.listItem}>
              2. Akım şiddetini, tel mesafesini veya bobin sarım sayısını
              ayarlayın.
            </Text>
            <Text style={styles.listItem}>
              3. Manyetik alan çizgilerini göstermek veya gizlemek için ilgili
              düğmeyi kullanın.
            </Text>
            <Text style={styles.listItem}>
              4. Manyetik alanı canlandırmak için animasyon düğmesini kullanın.
            </Text>
            <Text style={styles.listItem}>
              5. Manyetik alan şiddetinin nasıl değiştiğini gözlemleyin.
            </Text>
          </View>

          <View style={styles.formulaSection}>
            <Text style={styles.sectionTitle}>Manyetik Alan Formülleri</Text>
            <Text style={styles.formula}>Düz Tel: B = μ₀I / 2πr</Text>
            <Text style={styles.formulaDescription}>
              Burada B manyetik alan şiddeti, μ₀ manyetik geçirgenlik sabiti, I
              akım şiddeti ve r telden olan uzaklıktır.
            </Text>

            <Text style={styles.formula}>Bobin: B = μ₀nI</Text>
            <Text style={styles.formulaDescription}>
              Burada n birim uzunluktaki sarım sayısıdır.
            </Text>

            <Text style={styles.formula}>Çubuk Mıknatıs: B ~ 1/r³</Text>
            <Text style={styles.formulaDescription}>
              Mıknatıstan uzaklaştıkça alan şiddeti küp oranında azalır.
            </Text>
          </View>
        </View>
      </ScrollView>
    </ExperimentLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  infoSection: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 12,
  },
  subTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginTop: 12,
    marginBottom: 8,
  },
  paragraph: {
    fontSize: 14,
    lineHeight: 22,
    color: '#4b5563',
    marginBottom: 12,
  },
  listItem: {
    fontSize: 14,
    lineHeight: 22,
    color: '#4b5563',
    marginBottom: 8,
    paddingLeft: 8,
  },
  instructionsSection: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  formulaSection: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  formula: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3b82f6',
    marginTop: 8,
    marginBottom: 4,
  },
  formulaDescription: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 12,
  },
});
