import React, { ReactNode, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  Pressable,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  ArrowLeft,
  Play,
  Pause,
  RotateCcw,
  Info,
  Languages,
  X,
} from 'lucide-react-native';
import { useLanguage } from './LanguageContext';

interface ExperimentLayoutProps {
  title: string;
  titleEn: string;
  difficulty: string;
  difficultyEn: string;
  description: string;
  descriptionEn: string;
  children: ReactNode;
  isRunning?: boolean;
  onToggleSimulation?: () => void;
  onReset?: () => void;
  hideControls?: boolean;
  hideDescription?: boolean;
}

export default function ExperimentLayout({
  title,
  titleEn,
  difficulty,
  difficultyEn,
  description,
  descriptionEn,
  children,
  isRunning,
  onToggleSimulation,
  onReset,
  hideControls = false,
  hideDescription = false,
}: ExperimentLayoutProps) {
  const router = useRouter();
  const { language, setLanguage, t } = useLanguage();
  const [infoModalVisible, setInfoModalVisible] = useState(false);

  const toggleLanguage = () => {
    setLanguage(language === 'tr' ? 'en' : 'tr');
  };

  // Localized texts
  const currentTitle = language === 'tr' ? title : titleEn;
  const currentDifficulty = language === 'tr' ? difficulty : difficultyEn;
  const currentDescription = language === 'tr' ? description : descriptionEn;

  const buttonTexts = {
    start: t('Başlat', 'Start'),
    stop: t('Durdur', 'Stop'),
    reset: t('Sıfırla', 'Reset'),
    info: t('Bilgi', 'Info'),
    about: t('Deney Hakkında', 'About Experiment'),
    close: t('Kapat', 'Close'),
    infoTitle: t('Deney Bilgisi', 'Experiment Information'),
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <ArrowLeft size={24} color="#2c3e50" />
        </TouchableOpacity>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{currentTitle}</Text>
          <Text
            style={[
              styles.difficulty,
              currentDifficulty === 'Başlangıç' ||
              currentDifficulty === 'Beginner'
                ? styles.beginnerDifficulty
                : currentDifficulty === 'Orta Seviye' ||
                  currentDifficulty === 'Intermediate'
                ? styles.intermediateDifficulty
                : styles.advancedDifficulty,
            ]}
          >
            {currentDifficulty}
          </Text>
        </View>
        <TouchableOpacity
          onPress={toggleLanguage}
          style={styles.languageButton}
        >
          <Languages size={24} color="#3498db" />
          <Text style={styles.languageText}>
            {language === 'tr' ? 'EN' : 'TR'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.experimentContainer}>{children}</View>

      {!hideControls && (
        <View style={styles.controlsContainer}>
          <TouchableOpacity
            style={styles.controlButton}
            onPress={onToggleSimulation}
          >
            {isRunning ? (
              <Pause size={24} color="#3498db" />
            ) : (
              <Play size={24} color="#3498db" />
            )}
            <Text style={styles.controlText}>
              {isRunning ? buttonTexts.stop : buttonTexts.start}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.controlButton} onPress={onReset}>
            <RotateCcw size={24} color="#3498db" />
            <Text style={styles.controlText}>{buttonTexts.reset}</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.controlButton} 
            onPress={() => setInfoModalVisible(true)}
          >
            <Info size={24} color="#3498db" />
            <Text style={styles.controlText}>{buttonTexts.info}</Text>
          </TouchableOpacity>
        </View>
      )}

      <Modal
        animationType="fade"
        transparent={true}
        visible={infoModalVisible}
        onRequestClose={() => setInfoModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{buttonTexts.infoTitle}</Text>
              <TouchableOpacity 
                onPress={() => setInfoModalVisible(false)}
                style={styles.closeButton}
              >
                <X size={24} color="#2c3e50" />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalContent}>
              <Text style={styles.modalText}>{currentDescription}</Text>
            </ScrollView>
            
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    backgroundColor: 'white',
  },
  backButton: {
    padding: 5,
  },
  titleContainer: {
    marginLeft: 10,
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  difficulty: {
    fontSize: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#f0f0f0',
    color: '#7f8c8d',
    alignSelf: 'flex-start',
    marginTop: 5,
  },
  beginnerDifficulty: {
    backgroundColor: '#e8f5e9',
    color: '#388e3c',
  },
  intermediateDifficulty: {
    backgroundColor: '#fff8e1',
    color: '#ffa000',
  },
  advancedDifficulty: {
    backgroundColor: '#ffebee',
    color: '#d32f2f',
  },
  languageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 5,
    marginLeft: 10,
  },
  languageText: {
    marginLeft: 5,
    fontSize: 14,
    fontWeight: 'bold',
    color: '#3498db',
  },
  experimentContainer: {
    flex: 6,
    backgroundColor: 'white',
    margin: 15,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 6,
    backgroundColor: 'white',
    borderRadius: 12,
    marginHorizontal: 15,
    marginVertical: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  controlButton: {
    alignItems: 'center',
    padding: 5,
  },
  controlText: {
    marginTop: 2,
    fontSize: 12,
    color: '#3498db',
  },
  descriptionContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    margin: 15,
    marginTop: 0,
    padding: 6,
    maxHeight: 60,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  descriptionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 5,
  },
  descriptionText: {
    fontSize: 12,
    color: '#7f8c8d',
    lineHeight: 16,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '85%',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    paddingBottom: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  closeButton: {
    padding: 5,
  },
  modalContent: {
    marginBottom: 20,
  },
  modalText: {
    fontSize: 14,
    color: '#2c3e50',
    lineHeight: 20,
  },
  closeModalButton: {
    backgroundColor: '#3498db',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  closeModalButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});