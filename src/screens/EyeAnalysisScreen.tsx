import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialCommunityIcons, Ionicons, Feather } from '@expo/vector-icons';
import { ManuscriptColors } from '../components/ManuscriptConstants';
import { analyzeEyes as aiAnalyzeEyes, isApiConfigured, EyeAnalysisResult as AIEyeResult } from '../services/aiService';

interface EyeMetrics {
  clarity: number; // 0-100 (clear vs cloudy)
  scleraWhiteness: number; // 0-100 (white vs yellow/red)
  moisture: number; // 0-100 (dry vs watery)
  redness: number; // 0-100 (lower is better)
  brightness: number; // 0-100 (sparkle/vitality)
}

interface EyeAnalysisResult {
  metrics: EyeMetrics;
  dominantDosha: 'Vata' | 'Pitta' | 'Kapha' | 'Balanced';
  health: string[];
  recommendations: string[];
}

export default function EyeAnalysisScreen() {
  const navigation = useNavigation();
  const [eyeImage, setEyeImage] = useState<string | null>(null);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<EyeAnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [useAI, setUseAI] = useState(false);
  const [aiResult, setAiResult] = useState<AIEyeResult | null>(null);

  const requestCameraPermission = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Camera Permission',
        'We need camera access for eye analysis.',
        [{ text: 'OK' }]
      );
      return false;
    }
    return true;
  };

  const takeEyePhoto = async () => {
    const hasPermission = await requestCameraPermission();
    if (!hasPermission) return;

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.9,
    });

    if (!result.canceled && result.assets[0]) {
      setEyeImage(result.assets[0].uri);
      setShowAnalysis(false);
    }
  };

  const pickFromGallery = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.9,
    });

    if (!result.canceled && result.assets[0]) {
      setEyeImage(result.assets[0].uri);
      setShowAnalysis(false);
    }
  };

  const analyzeEyes = async () => {
    if (!eyeImage) return;

    setIsAnalyzing(true);
    setAiResult(null);
    setUseAI(false);

    try {
      // Check if API is configured
      const apiConfigured = await isApiConfigured();

      if (apiConfigured) {
        // Use real AI analysis
        try {
          const aiAnalysis = await aiAnalyzeEyes(eyeImage);
          setAiResult(aiAnalysis);
          setUseAI(true);

          // Convert AI result to our format
          const metrics: EyeMetrics = {
            clarity: aiAnalysis.clarity,
            scleraWhiteness: aiAnalysis.scleraWhiteness,
            moisture: aiAnalysis.moisture,
            redness: aiAnalysis.redness,
            brightness: aiAnalysis.brightness,
          };

          const result: EyeAnalysisResult = {
            metrics,
            dominantDosha: aiAnalysis.doshaIndication.dominant,
            health: aiAnalysis.concerns.length > 0 ? aiAnalysis.concerns : ['Overall eye health appears good'],
            recommendations: aiAnalysis.recommendations,
          };

          setAnalysisResult(result);
          setShowAnalysis(true);
          await saveAnalysis(result);
        } catch (aiError: any) {
          Alert.alert('AI Analysis Error', aiError.message || 'Failed to analyze image. Please check your connection.');
          // Fall back to mock analysis
          await performMockAnalysis();
        }
      } else {
        // Use mock analysis (educational demo)
        await performMockAnalysis();
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to analyze image. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const performMockAnalysis = async () => {
    const metrics = generateMockEyeMetrics();
    const dominantDosha = determineDoshaFromEyes(metrics);
    const health = getHealthIndicators(metrics);
    const recommendations = getEyeRecommendations(dominantDosha, metrics);

    const result: EyeAnalysisResult = {
      metrics,
      dominantDosha,
      health,
      recommendations,
    };

    setAnalysisResult(result);
    setShowAnalysis(true);
    await saveAnalysis(result);
  };

  const saveAnalysis = async (result: EyeAnalysisResult) => {
    try {
      const eyeAnalysisData = {
        date: new Date().toISOString(),
        type: 'eye',
        ...result,
      };
      await AsyncStorage.setItem('eyeAnalysis', JSON.stringify(eyeAnalysisData));
    } catch (error) {
      console.log('Auto-save failed:', error);
    }
  };

  const generateMockEyeMetrics = (): EyeMetrics => {
    return {
      clarity: Math.floor(Math.random() * 30) + 65, // 65-95
      scleraWhiteness: Math.floor(Math.random() * 30) + 65, // 65-95
      moisture: Math.floor(Math.random() * 40) + 50, // 50-90
      redness: Math.floor(Math.random() * 30) + 10, // 10-40
      brightness: Math.floor(Math.random() * 35) + 60, // 60-95
    };
  };

  const determineDoshaFromEyes = (metrics: EyeMetrics): 'Vata' | 'Pitta' | 'Kapha' | 'Balanced' => {
    let vataScore = 0;
    let pittaScore = 0;
    let kaphaScore = 0;

    // Moisture analysis
    if (metrics.moisture < 55) vataScore += 30; // Dry = Vata
    else if (metrics.moisture > 75) kaphaScore += 30; // Watery = Kapha
    else pittaScore += 20;

    // Redness analysis
    if (metrics.redness > 30) pittaScore += 40; // Red/inflamed = Pitta
    else if (metrics.redness < 15) {
      kaphaScore += 15;
      vataScore += 10;
    }

    // Clarity
    if (metrics.clarity < 70) vataScore += 20;
    else if (metrics.clarity > 85) kaphaScore += 20;

    // Brightness/Vitality
    if (metrics.brightness > 80) kaphaScore += 15;
    else if (metrics.brightness < 65) vataScore += 15;

    const maxScore = Math.max(vataScore, pittaScore, kaphaScore);
    if (maxScore - Math.min(vataScore, pittaScore, kaphaScore) < 15) return 'Balanced';
    if (vataScore === maxScore) return 'Vata';
    if (pittaScore === maxScore) return 'Pitta';
    return 'Kapha';
  };

  const getHealthIndicators = (metrics: EyeMetrics): string[] => {
    const indicators: string[] = [];

    if (metrics.clarity > 85) {
      indicators.push('✓ Excellent eye clarity - good liver and blood health');
    } else if (metrics.clarity < 70) {
      indicators.push('⚠ Low clarity may indicate toxins (Ama) or liver congestion');
    }

    if (metrics.scleraWhiteness > 85) {
      indicators.push('✓ Clear white sclera - healthy liver function');
    } else if (metrics.scleraWhiteness < 70) {
      indicators.push('⚠ Yellowing may indicate liver/gallbladder issues - consult practitioner');
    }

    if (metrics.redness > 30) {
      indicators.push('⚠ Redness indicates Pitta aggravation or eye strain');
    } else {
      indicators.push('✓ Minimal redness - calm Pitta');
    }

    if (metrics.moisture < 55) {
      indicators.push('⚠ Dry eyes - Vata imbalance, increase lubrication');
    } else if (metrics.moisture > 75) {
      indicators.push('⚠ Excessive tearing - possible Kapha, allergies, or blockage');
    } else {
      indicators.push('✓ Good moisture balance');
    }

    if (metrics.brightness > 80) {
      indicators.push('✓ Bright, sparkling eyes - sign of strong Ojas and vitality');
    } else if (metrics.brightness < 65) {
      indicators.push('⚠ Dull eyes may indicate low energy, poor sleep, or depleted Ojas');
    }

    return indicators;
  };

  const getEyeRecommendations = (dosha: string, metrics: EyeMetrics): string[] => {
    const recs: string[] = [];

    // Dosha-specific
    if (dosha === 'Vata') {
      recs.push('Use warm sesame oil drops (Netra Tarpana) for lubrication');
      recs.push('Eat eye-nourishing foods: carrots, ghee, almonds');
      recs.push('Practice Trataka (candle gazing) for 5 minutes daily');
      recs.push('Get adequate sleep (7-8 hours)');
    } else if (dosha === 'Pitta') {
      recs.push('Use cooling rose water eye drops');
      recs.push('Avoid screen time, especially late at night');
      recs.push('Eat cooling foods: cucumber, fennel, coriander');
      recs.push('Apply cool compresses to closed eyes');
      recs.push('Avoid direct sun exposure - wear sunglasses');
    } else if (dosha === 'Kapha') {
      recs.push('Practice eye exercises: rotate, focus near/far');
      recs.push('Reduce dairy and heavy foods');
      recs.push('Use Triphala eye wash');
      recs.push('Get morning sunlight exposure');
    }

    // Metric-specific
    if (metrics.redness > 30) {
      recs.push('Reduce screen time and blue light exposure');
      recs.push('Use the 20-20-20 rule: Every 20 min, look 20 feet away for 20 sec');
    }

    if (metrics.moisture < 55) {
      recs.push('Increase omega-3 fats: fish oil, flaxseed, walnuts');
      recs.push('Stay hydrated - drink warm water throughout day');
    }

    if (metrics.brightness < 65) {
      recs.push('Improve sleep quality and duration');
      recs.push('Practice Palming: Rub palms, place over closed eyes for 2 min');
      recs.push('Take Triphala before bed to detoxify');
    }

    return recs;
  };

  const getMetricColor = (value: number, inverted = false): string => {
    if (inverted) value = 100 - value;
    if (value >= 75) return '#4CAF50';
    if (value >= 60) return '#8BC34A';
    if (value >= 45) return '#FFC107';
    if (value >= 30) return '#FF9800';
    return '#F44336';
  };

  const getMetricLabel = (value: number, inverted = false): string => {
    if (inverted) value = 100 - value;
    if (value >= 75) return 'Excellent';
    if (value >= 60) return 'Good';
    if (value >= 45) return 'Fair';
    if (value >= 30) return 'Low';
    return 'Poor';
  };


  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerIconRow}>
          <Ionicons name="eye" size={32} color="#1976D2" />
          <Text style={styles.title}> Eye Analysis</Text>
        </View>
        <Text style={styles.subtitle}>
          Netra Pariksha - Windows to your inner health
        </Text>
      </View>

      {/* Instructions */}
      <View style={styles.instructionsCard}>
        <View style={styles.instructionsTitleRow}>
          <Ionicons name="clipboard-outline" size={20} color="#3E2723" />
          <Text style={styles.instructionsTitle}> How to take an eye photo:</Text>
        </View>
        <View style={styles.instruction}>
          <Text style={styles.bulletPoint}>1.</Text>
          <Text style={styles.instructionText}>
            Take photo in bright natural light (near window)
          </Text>
        </View>
        <View style={styles.instruction}>
          <Text style={styles.bulletPoint}>2.</Text>
          <Text style={styles.instructionText}>
            Look directly at camera with eyes wide open
          </Text>
        </View>
        <View style={styles.instruction}>
          <Text style={styles.bulletPoint}>3.</Text>
          <Text style={styles.instructionText}>
            Get close enough to see eye details clearly
          </Text>
        </View>
        <View style={styles.instruction}>
          <Text style={styles.bulletPoint}>4.</Text>
          <Text style={styles.instructionText}>
            Avoid shadows on your face
          </Text>
        </View>
        <View style={styles.instruction}>
          <Text style={styles.bulletPoint}>5.</Text>
          <Text style={styles.instructionText}>
            Best time: Morning after washing face
          </Text>
        </View>
      </View>

      {/* Camera Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.primaryButton} onPress={takeEyePhoto}>
          <View style={styles.buttonContent}>
            <Feather name="camera" size={20} color="#FFFFFF" />
            <Text style={styles.primaryButtonText}> Take Photo</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.secondaryButton} onPress={pickFromGallery}>
          <View style={styles.buttonContent}>
            <Feather name="image" size={20} color="#1976D2" />
            <Text style={styles.secondaryButtonText}> Choose from Gallery</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Image Preview */}
      {eyeImage && (
        <View style={styles.imageContainer}>
          <Text style={styles.sectionTitle}>Your Eye Photo</Text>
          <Image source={{ uri: eyeImage }} style={styles.eyeImage} />
          <TouchableOpacity
            style={[styles.analyzeButton, isAnalyzing && styles.analyzeButtonDisabled]}
            onPress={analyzeEyes}
            disabled={isAnalyzing}
          >
            {isAnalyzing ? (
              <View style={styles.buttonContent}>
                <ActivityIndicator size="small" color="#FFFFFF" />
                <Text style={styles.analyzeButtonText}> Analyzing with AI...</Text>
              </View>
            ) : (
              <View style={styles.buttonContent}>
                <Feather name="search" size={18} color="#FFFFFF" />
                <Text style={styles.analyzeButtonText}> Analyze Eyes</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      )}

      {/* Analysis Results */}
      {showAnalysis && analysisResult && (
        <View style={styles.analysisSection}>
          <View style={styles.analysisTitleRow}>
            <Ionicons name="stats-chart" size={24} color="#3E2723" />
            <Text style={styles.analysisTitle}> Eye Analysis Results</Text>
          </View>
          <View style={[styles.disclaimerContainer, useAI && styles.aiDisclaimerContainer]}>
            <Ionicons name="information-circle" size={18} color={useAI ? '#4CAF50' : '#B87333'} />
            <Text style={[styles.disclaimer, useAI && styles.aiDisclaimer]}>
              {useAI
                ? 'AI-powered analysis based on Ayurvedic Netra Pariksha principles. For medical concerns, consult an eye doctor or Ayurvedic practitioner.'
                : 'Demo mode - Backend connection required for AI analysis. For medical concerns, consult an eye doctor or Ayurvedic practitioner.'}
            </Text>
          </View>

          {/* Eye Metrics */}
          <View style={styles.metricsCard}>
            <Text style={styles.metricsTitle}>Eye Health Metrics</Text>

            {/* Clarity */}
            <View style={styles.metricRow}>
              <View style={styles.metricHeader}>
                <Text style={styles.metricLabel}>✨ Clarity</Text>
                <Text style={[styles.metricStatus, { color: getMetricColor(analysisResult.metrics.clarity) }]}>
                  {getMetricLabel(analysisResult.metrics.clarity)}
                </Text>
              </View>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    {
                      width: `${analysisResult.metrics.clarity}%`,
                      backgroundColor: getMetricColor(analysisResult.metrics.clarity),
                    },
                  ]}
                />
              </View>
              <Text style={styles.metricValue}>{analysisResult.metrics.clarity}/100</Text>
            </View>

            {/* Sclera Whiteness */}
            <View style={styles.metricRow}>
              <View style={styles.metricHeader}>
                <Text style={styles.metricLabel}>⚪ Sclera Whiteness</Text>
                <Text style={[styles.metricStatus, { color: getMetricColor(analysisResult.metrics.scleraWhiteness) }]}>
                  {getMetricLabel(analysisResult.metrics.scleraWhiteness)}
                </Text>
              </View>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    {
                      width: `${analysisResult.metrics.scleraWhiteness}%`,
                      backgroundColor: getMetricColor(analysisResult.metrics.scleraWhiteness),
                    },
                  ]}
                />
              </View>
              <Text style={styles.metricValue}>{analysisResult.metrics.scleraWhiteness}/100</Text>
            </View>

            {/* Moisture */}
            <View style={styles.metricRow}>
              <View style={styles.metricHeader}>
                <Text style={styles.metricLabel}>💧 Moisture Level</Text>
                <Text style={[styles.metricStatus, { color: getMetricColor(analysisResult.metrics.moisture) }]}>
                  {getMetricLabel(analysisResult.metrics.moisture)}
                </Text>
              </View>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    {
                      width: `${analysisResult.metrics.moisture}%`,
                      backgroundColor: getMetricColor(analysisResult.metrics.moisture),
                    },
                  ]}
                />
              </View>
              <Text style={styles.metricValue}>{analysisResult.metrics.moisture}/100</Text>
            </View>

            {/* Redness */}
            <View style={styles.metricRow}>
              <View style={styles.metricHeader}>
                <Text style={styles.metricLabel}>🔴 Redness</Text>
                <Text style={[styles.metricStatus, { color: getMetricColor(analysisResult.metrics.redness, true) }]}>
                  {getMetricLabel(analysisResult.metrics.redness, true)}
                </Text>
              </View>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    {
                      width: `${analysisResult.metrics.redness}%`,
                      backgroundColor: analysisResult.metrics.redness > 50 ? '#F44336' : '#4CAF50',
                    },
                  ]}
                />
              </View>
              <Text style={styles.metricValue}>{analysisResult.metrics.redness}/100 (lower is better)</Text>
            </View>

            {/* Brightness */}
            <View style={styles.metricRow}>
              <View style={styles.metricHeader}>
                <Text style={styles.metricLabel}>✨ Brightness (Ojas)</Text>
                <Text style={[styles.metricStatus, { color: getMetricColor(analysisResult.metrics.brightness) }]}>
                  {getMetricLabel(analysisResult.metrics.brightness)}
                </Text>
              </View>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    {
                      width: `${analysisResult.metrics.brightness}%`,
                      backgroundColor: getMetricColor(analysisResult.metrics.brightness),
                    },
                  ]}
                />
              </View>
              <Text style={styles.metricValue}>{analysisResult.metrics.brightness}/100</Text>
            </View>
          </View>

          {/* Health Indicators */}
          <View style={styles.healthCard}>
            <View style={styles.sectionTitleRow}>
              <MaterialCommunityIcons name="hospital-box-outline" size={22} color="#2E7D32" />
              <Text style={styles.healthTitle}> Health Indicators</Text>
            </View>
            {analysisResult.health.map((indicator, idx) => (
              <View key={idx} style={styles.healthRow}>
                <Text style={styles.healthText}>{indicator}</Text>
              </View>
            ))}
          </View>

          {/* Dosha */}
          <View style={styles.doshaCard}>
            <Text style={styles.doshaTitle}>Eye Type (Dosha)</Text>
            <Text style={styles.doshaValue}>{analysisResult.dominantDosha}</Text>
            <Text style={styles.doshaExplanation}>
              {analysisResult.dominantDosha === 'Vata' &&
                'Your eyes show Vata characteristics: dryness, less luster. Tend to be smaller, grey/brown tones, prone to dryness.'}
              {analysisResult.dominantDosha === 'Pitta' &&
                'Your eyes show Pitta characteristics: sensitivity, inflammation. Tend to be sharp, penetrating gaze, prone to redness.'}
              {analysisResult.dominantDosha === 'Kapha' &&
                'Your eyes show Kapha characteristics: calm, moist. Tend to be large, clear, stable gaze, good natural lubrication.'}
              {analysisResult.dominantDosha === 'Balanced' &&
                'Your eyes appear balanced across doshas. Maintain your current eye care routine!'}
            </Text>
          </View>

          {/* Recommendations */}
          <View style={styles.recommendationsCard}>
            <View style={styles.recommendationsTitleRow}>
              <Feather name="check-circle" size={18} color="#6B8E23" />
              <Text style={styles.recommendationsTitle}> Eye Care Recommendations</Text>
            </View>
            {analysisResult.recommendations.map((rec, idx) => (
              <View key={idx} style={styles.recommendationRow}>
                <Text style={styles.recommendationBullet}>•</Text>
                <Text style={styles.recommendationText}>{rec}</Text>
              </View>
            ))}
          </View>

          {/* Auto-saved indicator */}
          <View style={styles.autoSavedBadge}>
            <Feather name="check-circle" size={16} color="#6B8E23" />
            <Text style={styles.autoSavedText}>Auto-saved to My Plan</Text>
          </View>

          {/* Action Button */}
          <TouchableOpacity
            style={styles.continueButton}
            onPress={() => navigation.navigate('Assessment' as never)}
          >
            <Text style={styles.continueButtonText}>
              Continue to Assessment →
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Educational Section */}
      <View style={styles.educationCard}>
        <View style={styles.educationTitleRow}>
          <Ionicons name="eye" size={20} color="#1976D2" />
          <Text style={styles.educationTitle}> Why Eye Diagnosis?</Text>
        </View>
        <Text style={styles.educationText}>
          In Ayurveda, the eyes are considered gateways to the mind and soul. Netra Pariksha
          (eye examination) reveals your mental state, liver health, and doshic balance.
        </Text>
        <Text style={styles.educationSubtitle}>The Three Eye Types:</Text>
        <Text style={styles.educationBullet}>
          • Vata Eyes: Small, dry, grey/brown, darting/nervous
        </Text>
        <Text style={styles.educationBullet}>
          • Pitta Eyes: Sharp, red-tinged, light-sensitive, intense gaze
        </Text>
        <Text style={styles.educationBullet}>
          • Kapha Eyes: Large, calm, white/blue, stable, well-lubricated
        </Text>
        <Text style={styles.manuscriptQuote}>
          "The eyes show the state of Alochaka Pitta (visual perception), Tarpaka Kapha
          (lubrication), and Prana Vata (nervous function). Bright, clear eyes indicate
          strong Ojas."
        </Text>
        <Text style={styles.manuscriptSource}>- Charaka Samhita</Text>
      </View>
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
    backgroundColor: '#E3F2FD',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#64B5F6',
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
    color: '#1976D2',
    marginRight: 8,
    minWidth: 20,
  },
  instructionText: {
    flex: 1,
    fontSize: 14,
    color: '#3E2723',
    lineHeight: 20,
  },
  buttonContainer: {
    gap: 12,
    marginBottom: 24,
  },
  primaryButton: {
    backgroundColor: '#64B5F6',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
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
    borderColor: '#64B5F6',
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#1976D2',
    fontSize: 16,
    fontWeight: '600',
  },
  imageContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3E2723',
    marginBottom: 12,
  },
  eyeImage: {
    width: '100%',
    height: 300,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 3,
    borderColor: '#64B5F6',
  },
  analyzeButton: {
    backgroundColor: '#1976D2',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
  },
  analyzeButtonDisabled: {
    backgroundColor: '#64B5F6',
  },
  aiDisclaimerContainer: {
    backgroundColor: '#E8F5E9',
    borderLeftColor: '#4CAF50',
  },
  aiDisclaimer: {
    color: '#2E7D32',
  },
  analyzeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  analysisSection: {
    marginBottom: 24,
  },
  analysisTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  analysisTitle: {
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
    borderLeftColor: '#64B5F6',
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
    marginBottom: 16,
  },
  metricRow: {
    marginBottom: 20,
  },
  metricHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  metricLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#3E2723',
  },
  metricStatus: {
    fontSize: 13,
    fontWeight: 'bold',
  },
  progressBar: {
    height: 10,
    backgroundColor: '#E0E0E0',
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: 6,
  },
  progressFill: {
    height: '100%',
    borderRadius: 5,
  },
  metricValue: {
    fontSize: 12,
    color: '#9E9E9E',
  },
  healthCard: {
    backgroundColor: '#E8F5E9',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#81C784',
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  healthTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  healthRow: {
    marginBottom: 10,
  },
  healthText: {
    fontSize: 14,
    color: '#3E2723',
    lineHeight: 20,
  },
  doshaCard: {
    backgroundColor: '#F3E5F5',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#BA68C8',
    alignItems: 'center',
  },
  doshaTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#3E2723',
    marginBottom: 8,
  },
  doshaValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#7B1FA2',
    marginBottom: 12,
  },
  doshaExplanation: {
    fontSize: 14,
    color: '#5D4037',
    textAlign: 'center',
    lineHeight: 20,
  },
  recommendationsCard: {
    backgroundColor: '#E8F5E9',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
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
    marginTop: 8,
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
  saveButton: {
    backgroundColor: '#9EBF88',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  continueButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#64B5F6',
  },
  continueButtonText: {
    color: '#1976D2',
    fontSize: 16,
    fontWeight: 'bold',
  },
  educationCard: {
    backgroundColor: '#FFF9E6',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#64B5F6',
  },
  educationTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  educationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1976D2',
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
  educationBullet: {
    fontSize: 13,
    color: '#5D4037',
    marginBottom: 5,
    paddingLeft: 8,
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
});
