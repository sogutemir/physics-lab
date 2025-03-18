import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native';
import { Link } from 'expo-router';
import { ArrowRight, Beaker } from 'lucide-react-native';
import { useLanguage } from '../../components/LanguageContext';
import { experiments, Experiment } from './experiments';

export default function HomeScreen() {
  const { t } = useLanguage();

  // Kategori bazında deney sayılarını hesaplama
  const experimentCounts = {
    mechanics: experiments.filter(
      (exp: Experiment) => exp.category === 'mechanics'
    ).length,
    waves: experiments.filter((exp: Experiment) => exp.category === 'waves')
      .length,
    electricity: experiments.filter(
      (exp: Experiment) => exp.category === 'electricity'
    ).length,
    basics: experiments.filter((exp: Experiment) => exp.category === 'basics')
      .length,
    modern: experiments.filter((exp: Experiment) => exp.category === 'modern')
      .length,
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>
          {t('Sanal Fizik Laboratuvarı', 'Virtual Physics Laboratory')}
        </Text>
        <Text style={styles.subtitle}>
          {t(
            'Fizik deneylerini keşfedin ve öğrenin',
            'Discover and learn physics experiments'
          )}
        </Text>
      </View>

      <Image
        source={{
          uri: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
        }}
        style={styles.heroImage}
      />

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          {t('Popüler Deneyler', 'Popular Experiments')}
        </Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.cardsContainer}
        >
          <Link href="/experiments/mechanics/pendulum" asChild>
            <TouchableOpacity style={styles.card}>
              <View style={styles.cardIconContainer}>
                <Beaker size={24} color="#3498db" />
              </View>
              <Text style={styles.cardTitle}>
                {t('Basit Sarkaç', 'Simple Pendulum')}
              </Text>
              <Text style={styles.cardDifficulty}>
                {t('Başlangıç', 'Beginner')}
              </Text>
              <View style={styles.cardFooter}>
                <Text style={styles.cardAction}>
                  {t('Deneyi Başlat', 'Start Experiment')}
                </Text>
                <ArrowRight size={16} color="#3498db" />
              </View>
            </TouchableOpacity>
          </Link>

          <Link href="/experiments/mechanics/spring-mass" asChild>
            <TouchableOpacity style={styles.card}>
              <View style={styles.cardIconContainer}>
                <Beaker size={24} color="#3498db" />
              </View>
              <Text style={styles.cardTitle}>
                {t('Yay-Kütle Sistemi', 'Spring-Mass System')}
              </Text>
              <Text style={styles.cardDifficulty}>
                {t('Başlangıç', 'Beginner')}
              </Text>
              <View style={styles.cardFooter}>
                <Text style={styles.cardAction}>
                  {t('Deneyi Başlat', 'Start Experiment')}
                </Text>
                <ArrowRight size={16} color="#3498db" />
              </View>
            </TouchableOpacity>
          </Link>

          <Link href="/experiments/waves/double-slit" asChild>
            <TouchableOpacity style={styles.card}>
              <View style={styles.cardIconContainer}>
                <Beaker size={24} color="#3498db" />
              </View>
              <Text style={styles.cardTitle}>
                {t('Çift Yarık Deneyi', 'Double Slit Experiment')}
              </Text>
              <Text style={styles.cardDifficulty}>
                {t('Orta Seviye', 'Intermediate')}
              </Text>
              <View style={styles.cardFooter}>
                <Text style={styles.cardAction}>
                  {t('Deneyi Başlat', 'Start Experiment')}
                </Text>
                <ArrowRight size={16} color="#3498db" />
              </View>
            </TouchableOpacity>
          </Link>

          <Link href="/experiments/waves/doppler-effect" asChild>
            <TouchableOpacity style={styles.card}>
              <View style={styles.cardIconContainer}>
                <Beaker size={24} color="#3498db" />
              </View>
              <Text style={styles.cardTitle}>
                {t('Doppler Etkisi', 'Doppler Effect')}
              </Text>
              <Text style={styles.cardDifficulty}>
                {t('Orta Seviye', 'Intermediate')}
              </Text>
              <View style={styles.cardFooter}>
                <Text style={styles.cardAction}>
                  {t('Deneyi Başlat', 'Start Experiment')}
                </Text>
                <ArrowRight size={16} color="#3498db" />
              </View>
            </TouchableOpacity>
          </Link>

          <Link href="/experiments/modern/photoelectric" asChild>
            <TouchableOpacity style={styles.card}>
              <View style={styles.cardIconContainer}>
                <Beaker size={24} color="#3498db" />
              </View>
              <Text style={styles.cardTitle}>
                {t('Fotoelektrik Olay', 'Photoelectric Effect')}
              </Text>
              <Text style={styles.cardDifficulty}>
                {t('Orta Seviye', 'Intermediate')}
              </Text>
              <View style={styles.cardFooter}>
                <Text style={styles.cardAction}>
                  {t('Deneyi Başlat', 'Start Experiment')}
                </Text>
                <ArrowRight size={16} color="#3498db" />
              </View>
            </TouchableOpacity>
          </Link>

          <Link href="/experiments/basics/coriolis-effect" asChild>
            <TouchableOpacity style={styles.card}>
              <View style={styles.cardIconContainer}>
                <Beaker size={24} color="#3498db" />
              </View>
              <Text style={styles.cardTitle}>
                {t('Coriolis Etkisi', 'Coriolis Effect')}
              </Text>
              <Text style={styles.cardDifficulty}>
                {t('İleri Seviye', 'Advanced')}
              </Text>
              <View style={styles.cardFooter}>
                <Text style={styles.cardAction}>
                  {t('Deneyi Başlat', 'Start Experiment')}
                </Text>
                <ArrowRight size={16} color="#3498db" />
              </View>
            </TouchableOpacity>
          </Link>
        </ScrollView>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          {t('Deney Kategorileri', 'Experiment Categories')}
        </Text>
        <View style={styles.categoriesContainer}>
          <Link
            href={{
              pathname: '/(tabs)/experiments',
              params: { selectedCategory: 'mechanics' },
            }}
            asChild
          >
            <TouchableOpacity style={styles.categoryCard}>
              <Text style={styles.categoryTitle}>
                {t('Mekanik', 'Mechanics')}
              </Text>
              <Text style={styles.categoryCount}>
                {t(
                  `${experimentCounts.mechanics} deney`,
                  `${experimentCounts.mechanics} experiments`
                )}
              </Text>
            </TouchableOpacity>
          </Link>

          <Link
            href={{
              pathname: '/(tabs)/experiments',
              params: { selectedCategory: 'waves' },
            }}
            asChild
          >
            <TouchableOpacity style={styles.categoryCard}>
              <Text style={styles.categoryTitle}>
                {t('Dalga ve Optik', 'Waves and Optics')}
              </Text>
              <Text style={styles.categoryCount}>
                {t(
                  `${experimentCounts.waves} deney`,
                  `${experimentCounts.waves} experiments`
                )}
              </Text>
            </TouchableOpacity>
          </Link>

          <Link
            href={{
              pathname: '/(tabs)/experiments',
              params: { selectedCategory: 'electricity' },
            }}
            asChild
          >
            <TouchableOpacity style={styles.categoryCard}>
              <Text style={styles.categoryTitle}>
                {t('Elektrik ve Manyetizma', 'Electricity and Magnetism')}
              </Text>
              <Text style={styles.categoryCount}>
                {t(
                  `${experimentCounts.electricity} deney`,
                  `${experimentCounts.electricity} experiments`
                )}
              </Text>
            </TouchableOpacity>
          </Link>

          <Link
            href={{
              pathname: '/(tabs)/experiments',
              params: { selectedCategory: 'basics' },
            }}
            asChild
          >
            <TouchableOpacity style={styles.categoryCard}>
              <Text style={styles.categoryTitle}>
                {t('Temel Kavramlar', 'Basic Concepts')}
              </Text>
              <Text style={styles.categoryCount}>
                {t(
                  `${experimentCounts.basics} deney`,
                  `${experimentCounts.basics} experiments`
                )}
              </Text>
            </TouchableOpacity>
          </Link>

          <Link
            href={{
              pathname: '/(tabs)/experiments',
              params: { selectedCategory: 'modern' },
            }}
            asChild
          >
            <TouchableOpacity style={styles.categoryCard}>
              <Text style={styles.categoryTitle}>
                {t('Modern Fizik', 'Modern Physics')}
              </Text>
              <Text style={styles.categoryCount}>
                {t(
                  `${experimentCounts.modern} deney`,
                  `${experimentCounts.modern} experiments`
                )}
              </Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>

      <View style={styles.infoSection}>
        <Text style={styles.infoTitle}>
          {t(
            'Sanal Fizik Laboratuvarı Hakkında',
            'About Virtual Physics Laboratory'
          )}
        </Text>
        <Text style={styles.infoText}>
          {t(
            'Bu uygulama, fizik deneylerini sanal ortamda simüle eden interaktif bir eğitim platformudur. Kayıt gerektirmeden anında erişim sağlayabilir, gerçek zamanlı simülasyonlar ve animasyonlar ile fizik kavramlarını pratik yaparak öğrenebilirsiniz.',
            'This application is an interactive educational platform that simulates physics experiments in a virtual environment. You can access it instantly without registration and learn physics concepts by practicing with real-time simulations and animations.'
          )}
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  header: {
    padding: 20,
    paddingTop: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  subtitle: {
    fontSize: 16,
    color: '#7f8c8d',
    marginTop: 5,
  },
  heroImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#2c3e50',
  },
  cardsContainer: {
    flexDirection: 'row',
    marginHorizontal: -5,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    marginHorizontal: 8,
    width: 200,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ecf0f1',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  cardDifficulty: {
    fontSize: 14,
    color: '#7f8c8d',
    marginTop: 5,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  cardAction: {
    fontSize: 14,
    color: '#3498db',
    fontWeight: '500',
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    width: '48%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  categoryCount: {
    fontSize: 14,
    color: '#7f8c8d',
    marginTop: 5,
  },
  infoSection: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 10,
  },
  infoText: {
    fontSize: 14,
    color: '#7f8c8d',
    lineHeight: 22,
  },
});
