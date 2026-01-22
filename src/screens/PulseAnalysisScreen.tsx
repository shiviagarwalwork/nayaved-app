import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { CameraView, Camera } from 'expo-camera';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialCommunityIcons, Ionicons, Feather } from '@expo/vector-icons';
import { getRecommendedProducts } from '../data/products';
import ProductCard from '../components/ProductCard';
import { ManuscriptColors } from '../components/ManuscriptConstants';

interface PulseData {
  heartRate: number;
  hrv: number; // Heart Rate Variability
  pulseStrength: number;
  regularity: number;
}

interface DoshaAnalysis {
  dominant: 'Vata' | 'Pitta' | 'Kapha' | 'Balanced';
  vataScore: number;
  pittaScore: number;
  kaphaScore: number;
  interpretation: string;
  recommendations: string[];
}

export default function PulseAnalysisScreen() {
  const navigation = useNavigation<any>();
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [pulseData, setPulseData] = useState<PulseData | null>(null);
  const [doshaAnalysis, setDoshaAnalysis] = useState<DoshaAnalysis | null>(null);
  const [countdown, setCountdown] = useState(0);

  const pulseAnimation = useRef(new Animated.Value(0)).current;
  const cameraRef = useRef<any>(null);
  const frameDataRef = useRef<number[]>([]);
  const analysisIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    requestCameraPermission();
    return () => {
      if (analysisIntervalRef.current) {
        clearInterval(analysisIntervalRef.current);
      }
    };
  }, []);

  const requestCameraPermission = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    setHasPermission(status === 'granted');
    if (status !== 'granted') {
      Alert.alert(
        'Camera Permission Required',
        'We need camera access to measure your pulse using PPG (Photoplethysmography).',
        [{ text: 'OK' }]
      );
    }
  };

  const startPulseAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnimation, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnimation, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const stopPulseAnimation = () => {
    pulseAnimation.setValue(0);
  };

  const startAnalysis = () => {
    setIsAnalyzing(true);
    setShowResults(false);
    frameDataRef.current = [];
    setCountdown(15);
    startPulseAnimation();

    // Countdown timer
    let timeLeft = 15;
    const countdownInterval = setInterval(() => {
      timeLeft -= 1;
      setCountdown(timeLeft);
      if (timeLeft <= 0) {
        clearInterval(countdownInterval);
      }
    }, 1000);

    // Simulate PPG analysis - In production, this would process camera frames
    // to detect red channel intensity changes from blood flow
    analysisIntervalRef.current = setInterval(() => {
      // Simulate frame data collection (0-255 red channel intensity)
      const simulatedIntensity = Math.random() * 20 + 120; // 120-140 range
      frameDataRef.current.push(simulatedIntensity);
    }, 33); // ~30 fps

    // Complete analysis after 15 seconds
    setTimeout(() => {
      completeAnalysis();
    }, 15000);
  };

  const completeAnalysis = async () => {
    if (analysisIntervalRef.current) {
      clearInterval(analysisIntervalRef.current);
    }
    stopPulseAnimation();

    // Analyze collected frame data to calculate pulse metrics
    // Note: This is a simplified simulation. Real PPG would use FFT and peak detection
    const mockPulseData = calculatePulseMetrics();
    const mockDoshaAnalysis = interpretPulseAsDosha(mockPulseData);

    setPulseData(mockPulseData);
    setDoshaAnalysis(mockDoshaAnalysis);
    setIsAnalyzing(false);
    setShowResults(true);

    // Auto-save to plan
    try {
      const pulseAnalysisData = {
        date: new Date().toISOString(),
        pulseData: {
          heartRate: mockPulseData.heartRate,
          hrv: mockPulseData.hrv,
          pulseStrength: mockPulseData.pulseStrength,
          regularity: mockPulseData.regularity,
        },
        doshaAnalysis: {
          dominant: mockDoshaAnalysis.dominant,
          vataScore: mockDoshaAnalysis.vataScore,
          pittaScore: mockDoshaAnalysis.pittaScore,
          kaphaScore: mockDoshaAnalysis.kaphaScore,
          interpretation: mockDoshaAnalysis.interpretation,
          recommendations: mockDoshaAnalysis.recommendations,
        },
      };
      await AsyncStorage.setItem('pulseAnalysis', JSON.stringify(pulseAnalysisData));
      await AsyncStorage.setItem('userSymptoms', JSON.stringify([`Pulse: ${mockDoshaAnalysis.dominant} dominant`]));
    } catch (error) {
      console.log('Auto-save failed:', error);
    }
  };

  const calculatePulseMetrics = (): PulseData => {
    // Mock calculation - Real implementation would use signal processing
    // to detect peaks in red channel intensity over time
    const heartRate = Math.floor(Math.random() * 30) + 60; // 60-90 bpm
    const hrv = Math.random() * 60 + 20; // 20-80 ms
    const pulseStrength = Math.random() * 0.5 + 0.5; // 0.5-1.0
    const regularity = Math.random() * 0.3 + 0.7; // 0.7-1.0

    return { heartRate, hrv, pulseStrength, regularity };
  };

  const interpretPulseAsDosha = (pulse: PulseData): DoshaAnalysis => {
    // Ayurvedic Nadi Pariksha interpretation
    // Vata: Fast, irregular, feeble (like a snake)
    // Pitta: Strong, regular, jumping (like a frog)
    // Kapha: Slow, steady, strong (like a swan)

    let vataScore = 0;
    let pittaScore = 0;
    let kaphaScore = 0;

    // Heart rate analysis
    if (pulse.heartRate > 80) vataScore += 30;
    else if (pulse.heartRate >= 70) pittaScore += 30;
    else kaphaScore += 30;

    // HRV analysis (high HRV = Vata, moderate = Pitta, low = Kapha)
    if (pulse.hrv > 60) vataScore += 25;
    else if (pulse.hrv > 35) pittaScore += 25;
    else kaphaScore += 25;

    // Regularity (irregular = Vata, regular = Pitta/Kapha)
    if (pulse.regularity < 0.8) vataScore += 25;
    else pittaScore += 15;
    kaphaScore += 10;

    // Strength (weak = Vata, strong = Pitta/Kapha)
    if (pulse.pulseStrength < 0.6) vataScore += 20;
    else if (pulse.pulseStrength > 0.85) kaphaScore += 20;
    else pittaScore += 20;

    // Normalize scores
    const total = vataScore + pittaScore + kaphaScore;
    vataScore = Math.round((vataScore / total) * 100);
    pittaScore = Math.round((pittaScore / total) * 100);
    kaphaScore = Math.round((kaphaScore / total) * 100);

    // Determine dominant dosha
    let dominant: 'Vata' | 'Pitta' | 'Kapha' | 'Balanced' = 'Balanced';
    const maxScore = Math.max(vataScore, pittaScore, kaphaScore);

    if (maxScore - Math.min(vataScore, pittaScore, kaphaScore) > 20) {
      if (vataScore === maxScore) dominant = 'Vata';
      else if (pittaScore === maxScore) dominant = 'Pitta';
      else dominant = 'Kapha';
    }

    const interpretations = {
      Vata: `Your pulse shows Vata characteristics - quick, light, and variable like a snake. Heart rate: ${pulse.heartRate} bpm (elevated). This indicates active Vata energy, possibly from stress, movement, or mental activity.`,
      Pitta: `Your pulse shows Pitta characteristics - strong, regular, and forceful like a frog. Heart rate: ${pulse.heartRate} bpm. This indicates balanced metabolic fire and good cardiovascular strength.`,
      Kapha: `Your pulse shows Kapha characteristics - slow, steady, and strong like a swan. Heart rate: ${pulse.heartRate} bpm (calm). This indicates grounded, stable energy and good endurance.`,
      Balanced: `Your pulse shows balanced characteristics across all three doshas. Heart rate: ${pulse.heartRate} bpm. This indicates good overall doshic harmony.`,
    };

    const recommendationsMap = {
      Vata: [
        'Practice grounding activities: yoga, meditation, nature walks',
        'Eat warm, cooked, nourishing foods (soups, stews, healthy fats)',
        'Maintain regular sleep schedule (in bed by 10pm)',
        'Oil massage (Abhyanga) with sesame oil',
        'Reduce caffeine, cold foods, and excessive screen time',
      ],
      Pitta: [
        'Practice cooling activities: swimming, moonlight walks',
        'Eat cooling foods: cucumber, coconut, cilantro, sweet fruits',
        'Avoid overworking and competitive stress',
        'Oil massage with coconut oil',
        'Take breaks from intense mental work',
      ],
      Kapha: [
        'Increase vigorous exercise and movement',
        'Eat light, warm, spicy foods (ginger, black pepper)',
        'Wake up early (before 6am) to avoid morning Kapha',
        'Dry brushing and stimulating massage',
        'Reduce dairy, sugar, and heavy foods',
      ],
      Balanced: [
        'Maintain your current healthy routines',
        'Continue balanced diet and lifestyle practices',
        'Monitor for seasonal dosha changes',
        'Keep up regular exercise and stress management',
      ],
    };

    return {
      dominant,
      vataScore,
      pittaScore,
      kaphaScore,
      interpretation: interpretations[dominant],
      recommendations: recommendationsMap[dominant],
    };
  };

  const resetAnalysis = () => {
    setShowResults(false);
    setPulseData(null);
    setDoshaAnalysis(null);
    frameDataRef.current = [];
  };

  if (hasPermission === null) {
    return (
      <View style={styles.container}>
        <Text>Requesting camera permission...</Text>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Camera permission denied</Text>
        <Text style={styles.text}>
          Please enable camera access in settings to use pulse analysis.
        </Text>
      </View>
    );
  }

  const pulseScale = pulseAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.1],
  });

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerIconRow}>
          <MaterialCommunityIcons name="heart-pulse" size={32} color="#D32F2F" />
          <Text style={styles.title}> Digital Nadi Pariksha</Text>
        </View>
        <Text style={styles.subtitle}>
          PPG Pulse Analysis - Ancient wisdom meets modern technology
        </Text>
      </View>

      {!showResults ? (
        <>
          {/* Instructions */}
          <View style={styles.instructionsCard}>
            <View style={styles.instructionsTitleRow}>
              <Ionicons name="clipboard-outline" size={20} color="#3E2723" />
              <Text style={styles.instructionsTitle}> How to measure your pulse:</Text>
            </View>
            <View style={styles.instruction}>
              <Text style={styles.bulletPoint}>1.</Text>
              <Text style={styles.instructionText}>
                Place your index finger gently over the rear camera
              </Text>
            </View>
            <View style={styles.instruction}>
              <Text style={styles.bulletPoint}>2.</Text>
              <Text style={styles.instructionText}>
                Cover the camera completely with your fingertip
              </Text>
            </View>
            <View style={styles.instruction}>
              <Text style={styles.bulletPoint}>3.</Text>
              <Text style={styles.instructionText}>
                Keep your finger still and apply gentle pressure
              </Text>
            </View>
            <View style={styles.instruction}>
              <Text style={styles.bulletPoint}>4.</Text>
              <Text style={styles.instructionText}>
                Hold steady for 15 seconds while the light is on
              </Text>
            </View>
            <View style={styles.instruction}>
              <Text style={styles.bulletPoint}>5.</Text>
              <Text style={styles.instructionText}>
                Best results: Sit quietly for 2 minutes before measuring
              </Text>
            </View>
          </View>

          {/* Camera Preview or Placeholder */}
          {!isAnalyzing ? (
            <View style={styles.cameraPlaceholder}>
              <Animated.View
                style={[
                  styles.fingerIcon,
                  { transform: [{ scale: pulseScale }] },
                ]}
              >
                <View style={styles.fingerIconCircle}>
                  <MaterialCommunityIcons name="hand-pointing-up" size={56} color="#FFFFFF" />
                </View>
              </Animated.View>
              <Text style={styles.placeholderText}>
                Place finger on camera to begin
              </Text>
            </View>
          ) : (
            <View style={styles.analyzingContainer}>
              <Animated.View
                style={[
                  styles.pulseCircle,
                  { transform: [{ scale: pulseScale }] },
                ]}
              >
                <MaterialCommunityIcons name="heart-pulse" size={48} color="#FFFFFF" />
              </Animated.View>
              <Text style={styles.analyzingText}>Analyzing pulse...</Text>
              <Text style={styles.countdownText}>{countdown}s remaining</Text>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    { width: `${((15 - countdown) / 15) * 100}%` },
                  ]}
                />
              </View>
            </View>
          )}

          {/* Start Button */}
          {!isAnalyzing && (
            <TouchableOpacity style={styles.startButton} onPress={startAnalysis}>
              <View style={styles.buttonContent}>
                <MaterialCommunityIcons name="heart-pulse" size={22} color="#FFFFFF" />
                <Text style={styles.startButtonText}> Start Pulse Analysis</Text>
              </View>
            </TouchableOpacity>
          )}

          {/* Educational Info */}
          <View style={styles.educationCard}>
            <View style={styles.educationTitleRow}>
              <MaterialCommunityIcons name="meditation" size={22} color="#B87333" />
              <Text style={styles.educationTitle}> What is Nadi Pariksha?</Text>
            </View>
            <Text style={styles.educationText}>
              Nadi Pariksha is the ancient Ayurvedic art of pulse diagnosis. Practiced
              for over 5,000 years, it reads the subtle rhythms of your pulse to reveal
              your doshic constitution and imbalances.
            </Text>
            <Text style={styles.educationSubtitle}>The Three Pulse Patterns:</Text>
            <View style={styles.pulsePatternsContainer}>
              <View style={styles.pulsePatternRow}>
                <View style={[styles.pulsePatternIcon, { backgroundColor: '#F3E5F5' }]}>
                  <MaterialCommunityIcons name="waves" size={18} color="#9C27B0" />
                </View>
                <Text style={styles.educationBullet}>Vata Pulse: Like a snake - fast, irregular, feeble</Text>
              </View>
              <View style={styles.pulsePatternRow}>
                <View style={[styles.pulsePatternIcon, { backgroundColor: '#FFEBEE' }]}>
                  <MaterialCommunityIcons name="arrow-up-bold" size={18} color="#D32F2F" />
                </View>
                <Text style={styles.educationBullet}>Pitta Pulse: Like a frog - strong, regular, jumping</Text>
              </View>
              <View style={styles.pulsePatternRow}>
                <View style={[styles.pulsePatternIcon, { backgroundColor: '#E8F5E9' }]}>
                  <MaterialCommunityIcons name="wave" size={18} color="#4CAF50" />
                </View>
                <Text style={styles.educationBullet}>Kapha Pulse: Like a swan - slow, steady, strong</Text>
              </View>
            </View>
            <Text style={styles.manuscriptQuote}>
              "The pulse reveals the state of all three doshas and the seven dhatus. A
              skilled practitioner can detect disease before symptoms appear."
            </Text>
            <Text style={styles.manuscriptSource}>- Charaka Samhita</Text>
          </View>
        </>
      ) : (
        <>
          {/* Results Section */}
          <View style={styles.resultsSection}>
            <View style={styles.resultsTitleRow}>
              <Ionicons name="stats-chart" size={24} color="#3E2723" />
              <Text style={styles.resultsTitle}> Your Pulse Analysis</Text>
            </View>
            <View style={styles.disclaimerContainer}>
              <Ionicons name="information-circle" size={18} color="#B87333" />
              <Text style={styles.disclaimer}>
                Educational demo - Results are simulated. Real PPG algorithm integration coming soon! For medical diagnosis, consult a qualified Ayurvedic practitioner.
              </Text>
            </View>

            {/* Pulse Metrics */}
            {pulseData && (
              <View style={styles.metricsCard}>
                <Text style={styles.metricsTitle}>Pulse Metrics</Text>
                <View style={styles.metricRow}>
                  <Text style={styles.metricLabel}>Heart Rate:</Text>
                  <Text style={styles.metricValue}>{pulseData.heartRate} bpm</Text>
                </View>
                <View style={styles.metricRow}>
                  <Text style={styles.metricLabel}>HRV (Variability):</Text>
                  <Text style={styles.metricValue}>{pulseData.hrv.toFixed(1)} ms</Text>
                </View>
                <View style={styles.metricRow}>
                  <Text style={styles.metricLabel}>Pulse Strength:</Text>
                  <Text style={styles.metricValue}>
                    {(pulseData.pulseStrength * 100).toFixed(0)}%
                  </Text>
                </View>
                <View style={styles.metricRow}>
                  <Text style={styles.metricLabel}>Regularity:</Text>
                  <Text style={styles.metricValue}>
                    {(pulseData.regularity * 100).toFixed(0)}%
                  </Text>
                </View>
              </View>
            )}

            {/* Dosha Analysis */}
            {doshaAnalysis && (
              <>
                <View style={styles.doshaCard}>
                  <Text style={styles.doshaTitle}>Dominant Dosha from Pulse</Text>
                  <Text style={styles.dominantDosha}>{doshaAnalysis.dominant}</Text>

                  <View style={styles.doshaScores}>
                    <View style={styles.doshaBar}>
                      <Text style={styles.doshaLabel}>Vata</Text>
                      <View style={styles.barBackground}>
                        <View
                          style={[
                            styles.barFill,
                            styles.vataBar,
                            { width: `${doshaAnalysis.vataScore}%` },
                          ]}
                        />
                      </View>
                      <Text style={styles.doshaScore}>{doshaAnalysis.vataScore}%</Text>
                    </View>

                    <View style={styles.doshaBar}>
                      <Text style={styles.doshaLabel}>Pitta</Text>
                      <View style={styles.barBackground}>
                        <View
                          style={[
                            styles.barFill,
                            styles.pittaBar,
                            { width: `${doshaAnalysis.pittaScore}%` },
                          ]}
                        />
                      </View>
                      <Text style={styles.doshaScore}>{doshaAnalysis.pittaScore}%</Text>
                    </View>

                    <View style={styles.doshaBar}>
                      <Text style={styles.doshaLabel}>Kapha</Text>
                      <View style={styles.barBackground}>
                        <View
                          style={[
                            styles.barFill,
                            styles.kaphaBar,
                            { width: `${doshaAnalysis.kaphaScore}%` },
                          ]}
                        />
                      </View>
                      <Text style={styles.doshaScore}>{doshaAnalysis.kaphaScore}%</Text>
                    </View>
                  </View>
                </View>

                {/* Interpretation */}
                <View style={styles.interpretationCard}>
                  <Text style={styles.interpretationTitle}>Interpretation</Text>
                  <Text style={styles.interpretationText}>
                    {doshaAnalysis.interpretation}
                  </Text>
                </View>

                {/* Recommendations */}
                <View style={styles.recommendationsCard}>
                  <View style={styles.recommendationsTitleRow}>
                    <Feather name="check-circle" size={18} color="#6B8E23" />
                    <Text style={styles.recommendationsTitle}>
                      {' '}Recommendations for {doshaAnalysis.dominant}
                    </Text>
                  </View>
                  {doshaAnalysis.recommendations.map((rec, idx) => (
                    <View key={idx} style={styles.recommendationRow}>
                      <Text style={styles.recommendationBullet}>•</Text>
                      <Text style={styles.recommendationText}>{rec}</Text>
                    </View>
                  ))}
                </View>

                {/* Product Recommendations */}
                <View style={styles.productRecommendationsSection}>
                  <View style={styles.productSectionTitleRow}>
                    <MaterialCommunityIcons name="leaf" size={22} color="#4CAF50" />
                    <Text style={styles.productSectionTitle}> Suggested Ayurvedic Products</Text>
                  </View>
                  <Text style={styles.productSectionSubtitle}>
                    These herbs & supplements can help balance your {doshaAnalysis.dominant} dosha
                  </Text>
                  {getRecommendedProducts(doshaAnalysis.dominant.toLowerCase() as 'vata' | 'pitta' | 'kapha', 2).map((product) => (
                    <ProductCard key={product.id} product={product} showFullDetails={false} />
                  ))}
                  <TouchableOpacity
                    style={styles.shopMoreButton}
                    onPress={() => navigation.navigate('Pharmacy')}
                  >
                    <Text style={styles.shopMoreText}>View All Products →</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}

            {/* Auto-saved indicator */}
            <View style={styles.autoSavedBadge}>
              <Feather name="check-circle" size={16} color="#6B8E23" />
              <Text style={styles.autoSavedText}>Auto-saved to My Plan</Text>
            </View>

            {/* Action Button */}
            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={resetAnalysis}
            >
              <View style={styles.buttonContent}>
                <Feather name="refresh-cw" size={18} color="#6B8E23" />
                <Text style={styles.secondaryButtonText}> Measure Again</Text>
              </View>
            </TouchableOpacity>
          </View>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: ManuscriptColors.palmLeaf,
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  headerIconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#3E2723',
  },
  subtitle: {
    fontSize: 14,
    color: '#5D4037',
    fontStyle: 'italic',
    textAlign: 'center',
  },
  instructionsCard: {
    backgroundColor: '#FFE8E8',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#FF6B6B',
  },
  instructionsTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  instructionsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#3E2723',
  },
  instruction: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  bulletPoint: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#D32F2F',
    marginRight: 8,
    minWidth: 20,
  },
  instructionText: {
    flex: 1,
    fontSize: 14,
    color: '#3E2723',
    lineHeight: 20,
  },
  cameraPlaceholder: {
    backgroundColor: '#1C1C1E',
    borderRadius: 16,
    height: 300,
    marginBottom: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FF6B6B',
  },
  fingerIcon: {
    marginBottom: 16,
  },
  fingerIconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#FF6B6B',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  analyzingContainer: {
    backgroundColor: '#1C1C1E',
    borderRadius: 16,
    height: 300,
    marginBottom: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FF6B6B',
  },
  pulseCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#FF6B6B',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  heartIcon: {
    fontSize: 60,
  },
  analyzingText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  countdownText: {
    color: '#FFB6B6',
    fontSize: 14,
    marginBottom: 20,
  },
  progressBar: {
    width: '80%',
    height: 6,
    backgroundColor: '#3E3E40',
    borderRadius: 3,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FF6B6B',
    borderRadius: 3,
  },
  startButton: {
    backgroundColor: '#FF6B6B',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 24,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  startButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  educationCard: {
    backgroundColor: '#FFF9E6',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#DAA520',
  },
  educationTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  educationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#B87333',
  },
  educationText: {
    fontSize: 14,
    color: '#5D4037',
    lineHeight: 21,
    marginBottom: 10,
  },
  educationSubtitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#3E2723',
    marginTop: 8,
    marginBottom: 6,
  },
  pulsePatternsContainer: {
    marginTop: 8,
    marginBottom: 8,
  },
  pulsePatternRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  pulsePatternIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  educationBullet: {
    fontSize: 13,
    color: '#5D4037',
    flex: 1,
  },
  manuscriptQuote: {
    fontSize: 13,
    color: '#5D4037',
    fontStyle: 'italic',
    marginTop: 12,
    marginBottom: 6,
    paddingLeft: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#D4A574',
  },
  manuscriptSource: {
    fontSize: 12,
    color: '#B87333',
    fontStyle: 'italic',
    textAlign: 'right',
  },
  resultsSection: {
    marginTop: 0,
  },
  resultsTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  resultsTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#3E2723',
  },
  disclaimerContainer: {
    backgroundColor: '#FFF9E6',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    borderLeftWidth: 3,
    borderLeftColor: '#DAA520',
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  disclaimer: {
    fontSize: 12,
    color: '#B87333',
    flex: 1,
    marginLeft: 8,
    lineHeight: 18,
  },
  metricsCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#D7CCC8',
  },
  metricsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3E2723',
    marginBottom: 12,
  },
  metricRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  metricLabel: {
    fontSize: 14,
    color: '#5D4037',
    fontWeight: '600',
  },
  metricValue: {
    fontSize: 14,
    color: '#FF6B6B',
    fontWeight: 'bold',
  },
  doshaCard: {
    backgroundColor: '#E8F5E9',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#9EBF88',
  },
  doshaTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#3E2723',
    marginBottom: 8,
  },
  dominantDosha: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#6B8E23',
    textAlign: 'center',
    marginBottom: 20,
  },
  doshaScores: {
    gap: 16,
  },
  doshaBar: {
    gap: 6,
  },
  doshaLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3E2723',
  },
  barBackground: {
    height: 24,
    backgroundColor: '#E0E0E0',
    borderRadius: 12,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 12,
  },
  vataBar: {
    backgroundColor: '#9C27B0',
  },
  pittaBar: {
    backgroundColor: '#FF6B6B',
  },
  kaphaBar: {
    backgroundColor: '#4CAF50',
  },
  doshaScore: {
    fontSize: 12,
    color: '#5D4037',
    textAlign: 'right',
  },
  interpretationCard: {
    backgroundColor: '#FFF9E6',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#DAA520',
  },
  interpretationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#B87333',
    marginBottom: 8,
  },
  interpretationText: {
    fontSize: 14,
    color: '#5D4037',
    lineHeight: 21,
  },
  recommendationsCard: {
    backgroundColor: '#E8F5E9',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    borderWidth: 2,
    borderColor: '#9EBF88',
  },
  recommendationsTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  recommendationsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#6B8E23',
  },
  recommendationRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  recommendationBullet: {
    fontSize: 16,
    color: '#6B8E23',
    marginRight: 8,
    fontWeight: 'bold',
  },
  recommendationText: {
    flex: 1,
    fontSize: 14,
    color: '#3E2723',
    lineHeight: 20,
  },
  actionButtons: {
    flexDirection: 'column',
    marginTop: 8,
    marginBottom: 24,
  },
  autoSavedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E8F5E9',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginBottom: 16,
    gap: 6,
  },
  autoSavedText: {
    color: '#6B8E23',
    fontSize: 14,
    fontWeight: '600',
  },
  primaryButton: {
    backgroundColor: '#9EBF88',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  secondaryButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#9EBF88',
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#6B8E23',
    fontSize: 16,
    fontWeight: '600',
  },
  errorText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#D32F2F',
    marginBottom: 12,
  },
  text: {
    fontSize: 14,
    color: '#5D4037',
    lineHeight: 20,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  productRecommendationsSection: {
    marginTop: 16,
  },
  productSectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  productSectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#3E2723',
  },
  productSectionSubtitle: {
    fontSize: 14,
    color: '#5D4037',
    marginBottom: 16,
    fontStyle: 'italic',
  },
  shopMoreButton: {
    backgroundColor: '#9EBF88',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  shopMoreText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
