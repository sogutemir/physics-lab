import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useLanguage } from '../../../../../components/LanguageContext';

interface InfoPanelProps {
  style?: object;
}

const DoubleSlitInfoPanel: React.FC<InfoPanelProps> = ({ style = {} }) => {
  const [activeTab, setActiveTab] = useState<'experiment' | 'theory'>(
    'experiment'
  );
  const { t } = useLanguage();

  return (
    <View style={[styles.container, style]}>
      <View style={styles.tabContainer}>
        <TouchableOpacity
          onPress={() => setActiveTab('experiment')}
          style={[styles.tab, activeTab === 'experiment' && styles.activeTab]}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'experiment' && styles.activeTabText,
            ]}
          >
            {t('Deney', 'The Experiment')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setActiveTab('theory')}
          style={[styles.tab, activeTab === 'theory' && styles.activeTab]}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'theory' && styles.activeTabText,
            ]}
          >
            {t('Dalga Teorisi', 'Wave Theory')}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.contentContainer}>
        {activeTab === 'experiment' ? (
          <View>
            <Text style={styles.title}>
              {t('Çift Yarık Deneyi', 'Double-Slit Experiment')}
            </Text>
            <Text style={styles.paragraph}>
              {t(
                'Bu ünlü deney, ilk olarak 1801 yılında Thomas Young tarafından gerçekleştirilmiştir ve ışığın dalga doğasını göstermektedir. Işık iki dar yarıktan geçtiğinde, arkasındaki ekranda bir girişim deseni oluşur.',
                'This famous experiment, first performed by Thomas Young in 1801, demonstrates the wave nature of light. When light passes through two narrow slits, an interference pattern appears on the screen behind.'
              )}
            </Text>
            <Text style={styles.paragraph}>
              {t(
                'Aydınlık ve karanlık bantlardan oluşan bu desen, ışık sadece parçacıklar olarak davransaydı açıklanamaz ve ışığın dalga benzeri özelliklere sahip olduğunu kanıtlar. Aynı deney elektronlar ve diğer parçacıklarla da gerçekleştirilmiş, onların da dalga benzeri davranış sergilediğini göstermiştir.',
                'This pattern of bright and dark bands cannot be explained if light behaves solely as particles, proving that light has wave-like properties. The same experiment has been performed with electrons and other particles, showing they also exhibit wave-like behavior.'
              )}
            </Text>
            <View style={styles.tip}>
              <Text style={styles.tipText}>
                {t(
                  'Yarık genişliğini ve ayrımını değiştirerek girişim desenini nasıl etkilediğini gözlemleyin.',
                  'Try adjusting the slit width and separation to see how they affect the interference pattern.'
                )}
              </Text>
            </View>
          </View>
        ) : (
          <View>
            <Text style={styles.title}>
              {t('Dalga Girişimi Teorisi', 'Wave Interference Theory')}
            </Text>
            <Text style={styles.paragraph}>
              {t(
                'İki kaynaktan gelen dalgalar üst üste bindiğinde, birbirleriyle girişim yaparlar. İki tepe veya iki çukur karşılaşırsa (aynı fazda), yapıcı girişim oluşturarak daha aydınlık bir alan yaratırlar. Bir tepe ile bir çukur karşılaşırsa (ters fazda), yıkıcı girişim oluşturarak birbirlerini iptal ederler ve karanlık bir alan oluştururlar.',
                'When waves from two sources overlap, they interfere with each other. If two crests or two troughs meet (in-phase), they create constructive interference, resulting in a brighter area. If a crest meets a trough (out-of-phase), they cancel out in destructive interference, creating a dark area.'
              )}
            </Text>
            <Text style={styles.paragraph}>
              {t(
                'Desen, dalga boyu (λ), yarık ayrımı (d) ve ekrana olan mesafeye (L) bağlıdır. Aydınlık saçakların konumları şu formülle verilir:',
                'The pattern depends on the wavelength (λ), slit separation (d), and distance to the screen (L). The positions of bright fringes are given by:'
              )}
            </Text>
            <View style={styles.formula}>
              <Text style={styles.formulaText}>d sin θ = m·λ</Text>
              <Text style={styles.formulaText}>
                {t('burada m = 0, ±1, ±2, ...', 'where m = 0, ±1, ±2, ...')}
              </Text>
            </View>
            <View style={styles.tip}>
              <Text style={styles.tipText}>
                {t(
                  'Desenin nasıl değiştiğini görmek için dalga boyunu değiştirin.',
                  'Try changing the wavelength to see how the pattern changes.'
                )}
              </Text>
            </View>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  tab: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#3b82f6',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748b',
  },
  activeTabText: {
    color: '#3b82f6',
  },
  contentContainer: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 12,
  },
  paragraph: {
    fontSize: 14,
    lineHeight: 22,
    color: '#475569',
    marginBottom: 12,
  },
  formula: {
    backgroundColor: '#f8fafc',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 8,
  },
  formulaText: {
    fontFamily: 'monospace',
    fontSize: 14,
    color: '#1e293b',
  },
  tip: {
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  tipText: {
    fontSize: 12,
    color: '#64748b',
  },
});

export default DoubleSlitInfoPanel;
