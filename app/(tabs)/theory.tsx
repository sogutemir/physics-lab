import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Link } from 'expo-router';
import { ArrowRight, BookOpen } from 'lucide-react-native';
import { useLanguage } from '../../components/LanguageContext';

// Define theory topic types
type Category = 'mechanics' | 'waves' | 'electricity' | 'basics';

interface TheoryTopic {
  id: string;
  title: string;
  titleEn: string;
  category: Category;
  description: string;
  descriptionEn: string;
  imageUrl: string;
  route: string;
}

// Sample theory topics data
const theoryTopics: TheoryTopic[] = [
  {
    id: '1',
    title: 'Newton\'un Hareket Kanunları',
    titleEn: 'Newton\'s Laws of Motion',
    category: 'mechanics',
    description: 'Newton\'un üç hareket kanunu ve uygulamaları',
    descriptionEn: 'Newton\'s three laws of motion and their applications',
    imageUrl: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    route: '/theory/mechanics/newton-laws',
  },
  {
    id: '2',
    title: 'Momentum ve Korunumu',
    titleEn: 'Momentum and Conservation',
    category: 'mechanics',
    description: 'Momentum kavramı ve korunum yasaları',
    descriptionEn: 'Concept of momentum and conservation laws',
    imageUrl: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    route: '/theory/mechanics/momentum',
  },
  {
    id: '3',
    title: 'Enerji ve Korunumu',
    titleEn: 'Energy and Conservation',
    category: 'mechanics',
    description: 'Enerji türleri ve korunum yasaları',
    descriptionEn: 'Types of energy and conservation laws',
    imageUrl: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    route: '/theory/mechanics/energy',
  },
  {
    id: '4',
    title: 'Dalga Teorisi',
    titleEn: 'Wave Theory',
    category: 'waves',
    description: 'Dalgaların özellikleri ve davranışları',
    descriptionEn: 'Properties and behaviors of waves',
    imageUrl: 'https://images.unsplash.com/photo-1505672678657-cc7037095e60?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    route: '/theory/waves/wave-theory',
  },
  {
    id: '5',
    title: 'Elektromanyetik Dalgalar',
    titleEn: 'Electromagnetic Waves',
    category: 'waves',
    description: 'Elektromanyetik spektrum ve özellikleri',
    descriptionEn: 'Electromagnetic spectrum and its properties',
    imageUrl: 'https://images.unsplash.com/photo-1581093458791-9f3c3ae93ef1?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    route: '/theory/waves/electromagnetic-waves',
  },
  {
    id: '6',
    title: 'Elektrik Alanlar',
    titleEn: 'Electric Fields',
    category: 'electricity',
    description: 'Elektrik alan kavramı ve Gauss Yasası',
    descriptionEn: 'Concept of electric field and Gauss\'s Law',
    imageUrl: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    route: '/theory/electricity/electric-fields',
  },
  {
    id: '7',
    title: 'Manyetik Alanlar',
    titleEn: 'Magnetic Fields',
    category: 'electricity',
    description: 'Manyetik alan kavramı ve Ampere Yasası',
    descriptionEn: 'Concept of magnetic field and Ampere\'s Law',
    imageUrl: 'https://images.unsplash.com/photo-1527066579998-dbbae57f45ce?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    route: '/theory/electricity/magnetic-fields',
  },
  {
    id: '8',
    title: 'Vektörler ve Skalerler',
    titleEn: 'Vectors and Scalars',
    category: 'basics',
    description: 'Vektör ve skaler büyüklükler',
    descriptionEn: 'Vector and scalar quantities',
    imageUrl: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    route: '/theory/basics/vectors-scalars',
  },
];

// Category translations for display
const categoryTranslations: Record<Category, { tr: string, en: string }> = {
  mechanics: { tr: 'Mekanik', en: 'Mechanics' },
  waves: { tr: 'Dalga ve Optik', en: 'Waves and Optics' },
  electricity: { tr: 'Elektrik ve Manyetizma', en: 'Electricity and Magnetism' },
  basics: { tr: 'Temel Kavramlar', en: 'Basic Concepts' },
};

export default function TheoryScreen() {
  const { language, t } = useLanguage();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('Fizik Teorisi', 'Physics Theory')}</Text>
        <Text style={styles.subtitle}>
          {t('Deneylerin arkasındaki temel fizik kavramlarını öğrenin', 'Learn the fundamental physics concepts behind the experiments')}
        </Text>
      </View>

      <View style={styles.featuredSection}>
        <Text style={styles.sectionTitle}>{t('Öne Çıkan Konular', 'Featured Topics')}</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.featuredContainer}>
          {theoryTopics.slice(0, 3).map((topic) => (
            <Link key={topic.id} href={topic.route} asChild>
              <TouchableOpacity style={styles.featuredCard}>
                <Image source={{ uri: topic.imageUrl }} style={styles.featuredImage} />
                <View style={styles.featuredContent}>
                  <Text style={styles.featuredTitle}>{language === 'tr' ? topic.title : topic.titleEn}</Text>
                  <Text style={styles.featuredCategory}>
                    {language === 'tr' ? categoryTranslations[topic.category].tr : categoryTranslations[topic.category].en}
                  </Text>
                </View>
              </TouchableOpacity>
            </Link>
          ))}
        </ScrollView>
      </View>

      <View style={styles.categoriesSection}>
        <Text style={styles.sectionTitle}>{t('Kategoriler', 'Categories')}</Text>
        <View style={styles.categoriesGrid}>
          {(Object.keys(categoryTranslations) as Category[]).map((category) => (
            <Link key={category} href={`/theory?category=${category}`} asChild>
              <TouchableOpacity style={styles.categoryCard}>
                <Text style={styles.categoryTitle}>
                  {language === 'tr' ? categoryTranslations[category].tr : categoryTranslations[category].en}
                </Text>
                <Text style={styles.categoryCount}>
                  {theoryTopics.filter(topic => topic.category === category).length} {t('konu', 'topics')}
                </Text>
              </TouchableOpacity>
            </Link>
          ))}
        </View>
      </View>

      <View style={styles.allTopicsSection}>
        <Text style={styles.sectionTitle}>{t('Tüm Konular', 'All Topics')}</Text>
        {theoryTopics.map((topic) => (
          <Link key={topic.id} href={topic.route} asChild>
            <TouchableOpacity style={styles.topicCard}>
              <View style={styles.topicContent}>
                <View style={styles.topicIconContainer}>
                  <BookOpen size={24} color="#3498db" />
                </View>
                <View style={styles.topicInfo}>
                  <Text style={styles.topicTitle}>{language === 'tr' ? topic.title : topic.titleEn}</Text>
                  <Text style={styles.topicCategory}>
                    {language === 'tr' ? categoryTranslations[topic.category].tr : categoryTranslations[topic.category].en}
                  </Text>
                  <Text style={styles.topicDescription}>{language === 'tr' ? topic.description : topic.descriptionEn}</Text>
                </View>
              </View>
              <View style={styles.topicAction}>
                <ArrowRight size={20} color="#3498db" />
              </View>
            </TouchableOpacity>
          </Link>
        ))}
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
    paddingTop: 20,
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
  featuredSection: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#2c3e50',
  },
  featuredContainer: {
    marginHorizontal: -5,
  },
  featuredCard: {
    width: 280,
    height: 180,
    marginHorizontal: 8,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  featuredImage: {
    width: '100%',
    height: 120,
    resizeMode: 'cover',
  },
  featuredContent: {
    padding: 12,
  },
  featuredTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  featuredCategory: {
    fontSize: 14,
    color: '#7f8c8d',
    marginTop: 2,
  },
  categoriesSection: {
    padding: 20,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryCard: {
    width: '48%',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
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
  allTopicsSection: {
    padding: 20,
  },
  topicCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  topicContent: {
    flexDirection: 'row',
    flex: 1,
  },
  topicIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ecf0f1',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  topicInfo: {
    flex: 1,
  },
  topicTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  topicCategory: {
    fontSize: 12,
    color: '#7f8c8d',
    marginTop: 2,
  },
  topicDescription: {
    fontSize: 14,
    color: '#7f8c8d',
    marginTop: 5,
  },
  topicAction: {
    marginLeft: 10,
  },
});