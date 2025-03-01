import { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Text, Dimensions, Animated, TouchableOpacity, Slider } from 'react-native';
import ExperimentLayout from '../../../components/ExperimentLayout';

const { width, height } = Dimensions.get('window');
const CANVAS_HEIGHT = 300;

export default function DoubleSlitExperiment() {
  const [isRunning, setIsRunning] = useState(false);
  const [wavelength, setWavelength] = useState(50); // in pixels
  const [slitDistance, setSlitDistance] = useState(100); // in pixels
  const [slitWidth, setSlitWidth] = useState(20); // in pixels
  const [intensity, setIntensity] = useState(new Array(width).fill(0));
  const [language, setLanguage] = useState<'tr' | 'en'>('tr');
  
  const animationRef = useRef<number | null>(null);
  const phaseRef = useRef(0);
  const canvasOpacity = useRef(new Animated.Value(0.7)).current;

  const toggleSimulation = () => {
    setIsRunning(!isRunning);
  };

  const resetSimulation = () => {
    setIsRunning(false);
    phaseRef.current = 0;
    setIntensity(new Array(width).fill(0));
    
    if (animationRef.current !== null) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
  };

  // Calculate interference pattern
  const calculateInterference = () => {
    if (!isRunning) return;

    // Increment phase for animation
    phaseRef.current = (phaseRef.current + 0.1) % (2 * Math.PI);
    
    // Calculate new intensity pattern
    const newIntensity = new Array(width).fill(0);
    
    // Screen position (bottom of canvas)
    const screenY = CANVAS_HEIGHT;
    
    // Source positions (two slits)
    const sourceY = 50;
    const sourceX1 = width / 2 - slitDistance / 2;
    const sourceX2 = width / 2 + slitDistance / 2;
    
    // Calculate intensity at each point on the screen
    for (let x = 0; x < width; x++) {
      // Distance from each slit to the screen point
      const d1 = Math.sqrt(Math.pow(x - sourceX1, 2) + Math.pow(screenY - sourceY, 2));
      const d2 = Math.sqrt(Math.pow(x - sourceX2, 2) + Math.pow(screenY - sourceY, 2));
      
      // Phase difference
      const phaseDiff = 2 * Math.PI * (d2 - d1) / wavelength;
      
      // Amplitude at this point (simplified interference equation)
      const amplitude = Math.cos(phaseDiff / 2);
      
      // Intensity is proportional to amplitude squared
      newIntensity[x] = Math.pow(amplitude, 2);
    }
    
    setIntensity(newIntensity);
    
    // Pulse the canvas opacity for visual effect
    Animated.sequence([
      Animated.timing(canvasOpacity, {
        toValue: 1,
        duration: 100,
        useNativeDriver: false,
      }),
      Animated.timing(canvasOpacity, {
        toValue: 0.7,
        duration: 300,
        useNativeDriver: false,
      }),
    ]).start();
    
    animationRef.current = requestAnimationFrame(calculateInterference);
  };

  useEffect(() => {
    if (isRunning) {
      animationRef.current = requestAnimationFrame(calculateInterference);
    } else if (animationRef.current !== null) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }

    return () => {
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isRunning, wavelength, slitDistance, slitWidth]);

  // Localized texts
  const sliderLabels = {
    wavelength: language === 'tr' ? `Dalga Boyu: ${wavelength.toFixed(0)} px` : `Wavelength: ${wavelength.toFixed(0)} px`,
    slitDistance: language === 'tr' ? `Yarıklar Arası Mesafe: ${slitDistance.toFixed(0)} px` : `Slit Distance: ${slitDistance.toFixed(0)} px`,
    slitWidth: language === 'tr' ? `Yarık Genişliği: ${slitWidth.toFixed(0)} px` : `Slit Width: ${slitWidth.toFixed(0)} px`,
  };

  return (
    <ExperimentLayout
      title="Çift Yarık Deneyi"
      titleEn="Double Slit Experiment"
      difficulty="Orta Seviye"
      difficultyEn="Intermediate"
      description="Çift yarık deneyi, ışığın dalga doğasını gösteren temel bir deneydir. Bu deneyde, ışık iki yakın yarıktan geçtiğinde, yarıkların arkasındaki ekranda bir girişim deseni oluşturur. Bu desen, ışığın dalga özelliğinin bir sonucudur. Deneyde dalga boyu, yarık genişliği ve yarıklar arası mesafeyi değiştirerek girişim deseninin nasıl değiştiğini gözlemleyebilirsiniz."
      descriptionEn="The double slit experiment is a fundamental experiment demonstrating the wave nature of light. In this experiment, when light passes through two closely spaced slits, an interference pattern forms on the screen behind the slits. This pattern is a result of the wave property of light. You can observe how the interference pattern changes by adjusting the wavelength, slit width, and distance between slits."
      isRunning={isRunning}
      onToggleSimulation={toggleSimulation}
      onReset={resetSimulation}
    >
      <View style={styles.experimentArea}>
        <Animated.View 
          style={[
            styles.canvas,
            { opacity: canvasOpacity }
          ]}
        >
          {/* Light source */}
          <View style={styles.lightSource} />
          
          {/* Barrier with slits */}
          <View style={styles.barrier}>
            <View 
              style={[
                styles.slit, 
                { 
                  left: width / 2 - slitDistance / 2 - slitWidth / 2,
                  width: slitWidth 
                }
              ]} 
            />
            <View 
              style={[
                styles.slit, 
                { 
                  left: width / 2 + slitDistance / 2 - slitWidth / 2,
                  width: slitWidth 
                }
              ]} 
            />
          </View>
          
          {/* Interference pattern visualization */}
          <View style={styles.patternContainer}>
            {intensity.map((value, index) => (
              <View 
                key={index}
                style={[
                  styles.intensityLine,
                  {
                    height: value * 100,
                    opacity: value,
                  }
                ]}
              />
            ))}
          </View>
        </Animated.View>

        <View style={styles.controlsPanel}>
          <View style={styles.sliderContainer}>
            <Text style={styles.sliderLabel}>{sliderLabels.wavelength}</Text>
            <Slider
              style={styles.slider}
              minimumValue={20}
              maximumValue={100}
              step={1}
              value={wavelength}
              onValueChange={setWavelength}
              minimumTrackTintColor="#3498db"
              maximumTrackTintColor="#bdc3c7"
              thumbTintColor="#3498db"
            />
          </View>
          
          <View style={styles.sliderContainer}>
            <Text style={styles.sliderLabel}>{sliderLabels.slitDistance}</Text>
            <Slider
              style={styles.slider}
              minimumValue={50}
              maximumValue={200}
              step={5}
              value={slitDistance}
              onValueChange={setSlitDistance}
              minimumTrackTintColor="#3498db"
              maximumTrackTintColor="#bdc3c7"
              thumbTintColor="#3498db"
            />
          </View>
          
          <View style={styles.sliderContainer}>
            <Text style={styles.sliderLabel}>{sliderLabels.slitWidth}</Text>
            <Slider
              style={styles.slider}
              minimumValue={5}
              maximumValue={50}
              step={1}
              value={slitWidth}
              onValueChange={setSlitWidth}
              minimumTrackTintColor="#3498db"
              maximumTrackTintColor="#bdc3c7"
              thumbTintColor="#3498db"
            />
          </View>
        </View>
      </View>
    </ExperimentLayout>
  );
}

const styles = StyleSheet.create({
  experimentArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 10,
  },
  canvas: {
    width: '100%',
    height: CANVAS_HEIGHT,
    backgroundColor: '#1a1a2e',
    borderRadius: 10,
    overflow: 'hidden',
    position: 'relative',
  },
  lightSource: {
    position: 'absolute',
    top: 20,
    left: width / 2 - 10,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#f1c40f',
    shadowColor: '#f1c40f',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 5,
  },
  barrier: {
    position: 'absolute',
    top: 70,
    left: 0,
    right: 0,
    height: 10,
    backgroundColor: '#7f8c8d',
  },
  slit: {
    position: 'absolute',
    top: 0,
    height: 10,
    backgroundColor: 'transparent',
  },
  patternContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  intensityLine: {
    width: 1,
    backgroundColor: '#f1c40f',
    position: 'absolute',
    bottom: 0,
  },
  controlsPanel: {
    width: '100%',
    padding: 15,
    backgroundColor: 'white',
    borderRadius: 10,
    marginTop: 20,
  },
  sliderContainer: {
    marginBottom: 15,
  },
  sliderLabel: {
    fontSize: 14,
    color: '#2c3e50',
    marginBottom: 5,
  },
  slider: {
    width: '100%',
    height: 40,
  },
});