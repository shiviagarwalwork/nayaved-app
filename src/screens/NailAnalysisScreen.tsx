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
import { analyzeNails as aiAnalyzeNails, isApiConfigured, NailAnalysisResult as AINailResult } from '../services/aiService';

interface NailMetrics {
  color: number; // 0-100 (healthy pink vs pale/dark)
  texture: number; // 0-100 (smooth vs ridged/brittle)
  strength: number; // 0-100 (strong vs weak/peeling)
  lunula: number; // 0-100 (visible moon vs absent)
  surface: number; // 0-100 (clear vs spots/lines)
}

interface NailAnalysisResult {
  metrics: NailMetrics;
  dominantDosha: 'Vata' | 'Pitta' | 'Kapha' | 'Balanced';
  deficiencies: string[];
  recommendations: string[];
}

export default function NailAnalysisScreen() {
  const navigation = useNavigation();
  const [nailImage, setNailImage] = useState<string | null>(null);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<NailAnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [useAI, setUseAI] = useState(false);
  const [aiResult, setAiResult] = useState<AINailResult | null>(null);

  const requestCameraPermission = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Camera Permission',
        'We need camera access for nail analysis.',
        [{ text: 'OK' }]
      );
      return false;
    }
    return true;
  };

  const takeNailPhoto = async () => {
    const hasPermission = await requestCameraPermission();
    if (!hasPermission) return;

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.9,
    });

    if (!result.canceled && result.assets[0]) {
      setNailImage(result.assets[0].uri);
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
      setNailImage(result.assets[0].uri);
      setShowAnalysis(false);
    }
  };

  const analyzeNails = async () => {
    if (!nailImage) return;

    setIsAnalyzing(true);
    setAiResult(null);
    setUseAI(false);

    try {
      // Check if API is configured
      const apiConfigured = await isApiConfigured();

      if (apiConfigured) {
        // Use real AI analysis
        try {
          const aiAnalysis = await aiAnalyzeNails(nailImage);
          setAiResult(aiAnalysis);
          setUseAI(true);

          // Convert AI result to our format
          const metrics: NailMetrics = {
            color: aiAnalysis.color,
            texture: aiAnalysis.texture,
            strength: aiAnalysis.strength,
            lunula: aiAnalysis.lunulaVisibility,
            surface: aiAnalysis.surfaceClarity,
          };

          // Build deficiencies from nutrient indicators
          const deficiencies: string[] = [];
          if (aiAnalysis.nutrientIndicators.iron.toLowerCase().includes('deficien')) {
            deficiencies.push(`Iron: ${aiAnalysis.nutrientIndicators.iron}`);
          }
          if (aiAnalysis.nutrientIndicators.bVitamins.toLowerCase().includes('deficien')) {
            deficiencies.push(`B-Vitamins: ${aiAnalysis.nutrientIndicators.bVitamins}`);
          }
          if (aiAnalysis.nutrientIndicators.calcium.toLowerCase().includes('deficien') || aiAnalysis.nutrientIndicators.calcium.toLowerCase().includes('brittle')) {
            deficiencies.push(`Calcium: ${aiAnalysis.nutrientIndicators.calcium}`);
          }
          if (aiAnalysis.nutrientIndicators.zinc.toLowerCase().includes('deficien') || aiAnalysis.nutrientIndicators.zinc.toLowerCase().includes('spot')) {
            deficiencies.push(`Zinc: ${aiAnalysis.nutrientIndicators.zinc}`);
          }
          if (deficiencies.length === 0) {
            deficiencies.push('Nails appear healthy with good mineral balance');
          }

          const result: NailAnalysisResult = {
            metrics,
            dominantDosha: aiAnalysis.doshaIndication.dominant,
            deficiencies: aiAnalysis.concerns.length > 0 ? aiAnalysis.concerns : deficiencies,
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
    const metrics = generateMockNailMetrics();
    const dominantDosha = determineDoshaFromNails(metrics);
    const deficiencies = getDeficiencies(metrics);
    const recommendations = getNailRecommendations(dominantDosha, metrics);

    const result: NailAnalysisResult = {
      metrics,
      dominantDosha,
      deficiencies,
      recommendations,
    };

    setAnalysisResult(result);
    setShowAnalysis(true);
    await saveAnalysis(result);
  };

  const saveAnalysis = async (result: NailAnalysisResult) => {
    try {
      const nailAnalysisData = {
        date: new Date().toISOString(),
        type: 'nail',
        ...result,
      };
      await AsyncStorage.setItem('nailAnalysis', JSON.stringify(nailAnalysisData));
    } catch (error) {
      console.log('Auto-save failed:', error);
    }
  };

  const generateMockNailMetrics = (): NailMetrics => {
    return {
      color: Math.floor(Math.random() * 30) + 65, // 65-95
      texture: Math.floor(Math.random() * 35) + 60, // 60-95
      strength: Math.floor(Math.random() * 35) + 60, // 60-95
      lunula: Math.floor(Math.random() * 40) + 50, // 50-90
      surface: Math.floor(Math.random() * 35) + 60, // 60-95
    };
  };

  const determineDoshaFromNails = (metrics: NailMetrics): 'Vata' | 'Pitta' | 'Kapha' | 'Balanced' => {
    let vataScore = 0;
    let pittaScore = 0;
    let kaphaScore = 0;

    // Color analysis
    if (metrics.color < 70) vataScore += 30; // Pale/dark = Vata
    else if (metrics.color > 80) kaphaScore += 20; // Healthy pink = Kapha
    else pittaScore += 20;

    // Texture
    if (metrics.texture < 70) vataScore += 35; // Rough/ridged = Vata
    else if (metrics.texture > 85) kaphaScore += 25; // Smooth = Kapha

    // Strength
    if (metrics.strength < 70) vataScore += 25; // Brittle/weak = Vata
    else if (metrics.strength > 85) kaphaScore += 30; // Strong/thick = Kapha
    else pittaScore += 20;

    // Lunula visibility
    if (metrics.lunula < 60) vataScore += 10;
    else if (metrics.lunula > 80) kaphaScore += 15;

    const maxScore = Math.max(vataScore, pittaScore, kaphaScore);
    if (maxScore - Math.min(vataScore, pittaScore, kaphaScore) < 15) return 'Balanced';
    if (vataScore === maxScore) return 'Vata';
    if (pittaScore === maxScore) return 'Pitta';
    return 'Kapha';
  };

  const getDeficiencies = (metrics: NailMetrics): string[] => {
    const deficiencies: string[] = [];

    if (metrics.color < 70) {
      deficiencies.push('⚠ Pale nails may indicate anemia or poor circulation (iron deficiency)');
    }

    if (metrics.texture < 70) {
      deficiencies.push('⚠ Ridged/rough nails suggest B-vitamin or protein deficiency');
    }

    if (metrics.strength < 70) {
      deficiencies.push('⚠ Brittle/peeling nails indicate biotin, calcium, or silica deficiency');
    }

    if (metrics.lunula < 60) {
      deficiencies.push('⚠ Missing moons (lunula) may indicate B12, folate, or thyroid issues');
    }

    if (metrics.surface < 70) {
      deficiencies.push('⚠ White spots indicate zinc or calcium deficiency');
    }

    if (deficiencies.length === 0) {
      deficiencies.push('✓ Nails appear healthy with good mineral balance');
    }

    return deficiencies;
  };

  const getNailRecommendations = (dosha: string, metrics: NailMetrics): string[] => {
    const recs: string[] = [];

    // Dosha-specific
    if (dosha === 'Vata') {
      recs.push('Increase nourishing fats: ghee, sesame oil, avocado');
      recs.push('Take biotin (5000mcg) and silica supplements');
      recs.push('Daily oil massage on hands and nails');
      recs.push('Eat protein-rich foods: almonds, lentils, quinoa');
      recs.push('Stay hydrated with warm water');
    } else if (dosha === 'Pitta') {
      recs.push('Reduce inflammation with cooling foods');
      recs.push('Apply coconut oil on nails before bed');
      recs.push('Eat iron-rich foods: spinach, beets, pomegranate');
      recs.push('Avoid excessive heat and harsh chemicals');
    } else if (dosha === 'Kapha') {
      recs.push('Maintain good circulation with exercise');
      recs.push('Eat mineral-rich foods: leafy greens, nuts, seeds');
      recs.push('Regular nail trimming and care');
      recs.push('Avoid excessive moisture on nails');
    }

    // Specific deficiencies
    if (metrics.color < 70) {
      recs.push('Take iron supplements (with vitamin C for absorption)');
      recs.push('Eat iron-rich: dark leafy greens, liver, blackstrap molasses');
    }

    if (metrics.texture < 70) {
      recs.push('Take B-complex vitamins daily');
      recs.push('Eat biotin-rich: eggs, sweet potatoes, almonds');
    }

    if (metrics.strength < 70) {
      recs.push('Take biotin (hair/skin/nails formula)');
      recs.push('Apply strengthening nail oil: horsetail, bamboo extract');
    }

    if (metrics.lunula < 60) {
      recs.push('Get B12 levels checked - consider supplementation');
      recs.push('Support thyroid: iodine-rich foods (seaweed, iodized salt)');
    }

    if (metrics.surface < 70) {
      recs.push('Take zinc (30mg) and calcium supplements');
      recs.push('Eat zinc-rich: pumpkin seeds, chickpeas, cashews');
    }

    return recs;
  };

  const getMetricColor = (value: number): string => {
    if (value >= 75) return '#4CAF50';
    if (value >= 60) return '#8BC34A';
    if (value >= 45) return '#FFC107';
    if (value >= 30) return '#FF9800';
    return '#F44336';
  };

  const getMetricLabel = (value: number): string => {
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
          <MaterialCommunityIcons name="hand-back-right" size={32} color="#7B1FA2" />
          <Text style={styles.title}> Nail Analysis</Text>
        </View>
        <Text style={styles.subtitle}>
          Nakha Pariksha - Your nails reveal mineral & nutrient status
        </Text>
      </View>

      {/* Instructions */}
      <View style={styles.instructionsCard}>
        <View style={styles.instructionsTitleRow}>
          <Ionicons name="clipboard-outline" size={20} color="#3E2723" />
          <Text style={styles.instructionsTitle}> How to photograph your nails:</Text>
        </View>
        <View style={styles.instruction}>
          <Text style={styles.bulletPoint}>1.</Text>
          <Text style={styles.instructionText}>
            Clean nails thoroughly (remove polish if present)
          </Text>
        </View>
        <View style={styles.instruction}>
          <Text style={styles.bulletPoint}>2.</Text>
          <Text style={styles.instructionText}>
            Use bright natural light from window
          </Text>
        </View>
        <View style={styles.instruction}>
          <Text style={styles.bulletPoint}>3.</Text>
          <Text style={styles.instructionText}>
            Place hand flat, nails facing camera
          </Text>
        </View>
        <View style={styles.instruction}>
          <Text style={styles.bulletPoint}>4.</Text>
          <Text style={styles.instructionText}>
            Get close enough to see nail details clearly
          </Text>
        </View>
        <View style={styles.instruction}>
          <Text style={styles.bulletPoint}>5.</Text>
          <Text style={styles.instructionText}>
            Focus on 3-4 fingernails in one shot
          </Text>
        </View>
      </View>

      {/* Camera Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.primaryButton} onPress={takeNailPhoto}>
          <View style={styles.buttonContent}>
            <Feather name="camera" size={20} color="#FFFFFF" />
            <Text style={styles.primaryButtonText}> Take Photo</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.secondaryButton} onPress={pickFromGallery}>
          <View style={styles.buttonContent}>
            <Feather name="image" size={20} color="#7B1FA2" />
            <Text style={styles.secondaryButtonText}> Choose from Gallery</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Image Preview */}
      {nailImage && (
        <View style={styles.imageContainer}>
          <Text style={styles.sectionTitle}>Your Nail Photo</Text>
          <Image source={{ uri: nailImage }} style={styles.nailImage} />
          <TouchableOpacity
            style={[styles.analyzeButton, isAnalyzing && styles.analyzeButtonDisabled]}
            onPress={analyzeNails}
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
                <Text style={styles.analyzeButtonText}> Analyze Nails</Text>
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
            <Text style={styles.analysisTitle}> Nail Analysis Results</Text>
          </View>
          <View style={[styles.disclaimerContainer, useAI && styles.aiDisclaimerContainer]}>
            <Ionicons name="information-circle" size={18} color={useAI ? '#4CAF50' : '#B87333'} />
            <Text style={[styles.disclaimer, useAI && styles.aiDisclaimer]}>
              {useAI
                ? 'AI-powered analysis based on Ayurvedic Nakha Pariksha principles. For medical concerns, consult a healthcare provider.'
                : 'Demo mode - Backend connection required for AI analysis. For medical concerns, consult a healthcare provider.'}
            </Text>
          </View>

          {/* Nail Metrics */}
          <View style={styles.metricsCard}>
            <Text style={styles.metricsTitle}>Nail Health Metrics</Text>

            {/* Color */}
            <View style={styles.metricRow}>
              <View style={styles.metricHeader}>
                <Text style={styles.metricLabel}>🎨 Color (Pink/Pale)</Text>
                <Text style={[styles.metricStatus, { color: getMetricColor(analysisResult.metrics.color) }]}>
                  {getMetricLabel(analysisResult.metrics.color)}
                </Text>
              </View>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    {
                      width: `${analysisResult.metrics.color}%`,
                      backgroundColor: getMetricColor(analysisResult.metrics.color),
                    },
                  ]}
                />
              </View>
              <Text style={styles.metricValue}>{analysisResult.metrics.color}/100</Text>
            </View>

            {/* Texture */}
            <View style={styles.metricRow}>
              <View style={styles.metricHeader}>
                <Text style={styles.metricLabel}>🧴 Texture (Smooth)</Text>
                <Text style={[styles.metricStatus, { color: getMetricColor(analysisResult.metrics.texture) }]}>
                  {getMetricLabel(analysisResult.metrics.texture)}
                </Text>
              </View>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    {
                      width: `${analysisResult.metrics.texture}%`,
                      backgroundColor: getMetricColor(analysisResult.metrics.texture),
                    },
                  ]}
                />
              </View>
              <Text style={styles.metricValue}>{analysisResult.metrics.texture}/100</Text>
            </View>

            {/* Strength */}
            <View style={styles.metricRow}>
              <View style={styles.metricHeader}>
                <Text style={styles.metricLabel}>💪 Strength</Text>
                <Text style={[styles.metricStatus, { color: getMetricColor(analysisResult.metrics.strength) }]}>
                  {getMetricLabel(analysisResult.metrics.strength)}
                </Text>
              </View>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    {
                      width: `${analysisResult.metrics.strength}%`,
                      backgroundColor: getMetricColor(analysisResult.metrics.strength),
                    },
                  ]}
                />
              </View>
              <Text style={styles.metricValue}>{analysisResult.metrics.strength}/100</Text>
            </View>

            {/* Lunula */}
            <View style={styles.metricRow}>
              <View style={styles.metricHeader}>
                <Text style={styles.metricLabel}>🌙 Lunula (Moons)</Text>
                <Text style={[styles.metricStatus, { color: getMetricColor(analysisResult.metrics.lunula) }]}>
                  {getMetricLabel(analysisResult.metrics.lunula)}
                </Text>
              </View>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    {
                      width: `${analysisResult.metrics.lunula}%`,
                      backgroundColor: getMetricColor(analysisResult.metrics.lunula),
                    },
                  ]}
                />
              </View>
              <Text style={styles.metricValue}>{analysisResult.metrics.lunula}/100</Text>
            </View>

            {/* Surface */}
            <View style={styles.metricRow}>
              <View style={styles.metricHeader}>
                <Text style={styles.metricLabel}>✨ Surface Clarity</Text>
                <Text style={[styles.metricStatus, { color: getMetricColor(analysisResult.metrics.surface) }]}>
                  {getMetricLabel(analysisResult.metrics.surface)}
                </Text>
              </View>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    {
                      width: `${analysisResult.metrics.surface}%`,
                      backgroundColor: getMetricColor(analysisResult.metrics.surface),
                    },
                  ]}
                />
              </View>
              <Text style={styles.metricValue}>{analysisResult.metrics.surface}/100</Text>
            </View>
          </View>

          {/* Deficiencies */}
          <View style={styles.deficiencyCard}>
            <View style={styles.sectionTitleRow}>
              <MaterialCommunityIcons name="test-tube" size={22} color="#E65100" />
              <Text style={styles.deficiencyTitle}> Mineral & Nutrient Status</Text>
            </View>
            {analysisResult.deficiencies.map((def, idx) => (
              <View key={idx} style={styles.deficiencyRow}>
                <Text style={styles.deficiencyText}>{def}</Text>
              </View>
            ))}
          </View>

          {/* Dosha */}
          <View style={styles.doshaCard}>
            <Text style={styles.doshaTitle}>Nail Type (Dosha)</Text>
            <Text style={styles.doshaValue}>{analysisResult.dominantDosha}</Text>
            <Text style={styles.doshaExplanation}>
              {analysisResult.dominantDosha === 'Vata' &&
                'Your nails show Vata characteristics: brittle, dry, ridged, prone to breaking. Indicates need for nourishment and minerals.'}
              {analysisResult.dominantDosha === 'Pitta' &&
                'Your nails show Pitta characteristics: soft, flexible, pinkish. May be prone to inflammation or discoloration.'}
              {analysisResult.dominantDosha === 'Kapha' &&
                'Your nails show Kapha characteristics: thick, strong, smooth, good natural strength and resilience.'}
              {analysisResult.dominantDosha === 'Balanced' &&
                'Your nails appear balanced with good health across all metrics!'}
            </Text>
          </View>

          {/* Recommendations */}
          <View style={styles.recommendationsCard}>
            <View style={styles.recommendationsTitleRow}>
              <Feather name="check-circle" size={18} color="#6B8E23" />
              <Text style={styles.recommendationsTitle}> Nail Health Recommendations</Text>
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
            style={styles.completeButton}
            onPress={() => navigation.navigate('Ojas' as never)}
          >
            <Text style={styles.completeButtonText}>
              View Ojas Tracker →
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Educational Section */}
      <View style={styles.educationCard}>
        <View style={styles.educationTitleRow}>
          <MaterialCommunityIcons name="hand-back-right" size={20} color="#7B1FA2" />
          <Text style={styles.educationTitle}> Why Nail Diagnosis?</Text>
        </View>
        <Text style={styles.educationText}>
          Nails are considered a by-product of Asthi Dhatu (bone tissue) in Ayurveda. Their
          appearance reflects your mineral absorption, circulation, and overall tissue health.
        </Text>
        <Text style={styles.educationSubtitle}>The Three Nail Types:</Text>
        <Text style={styles.educationBullet}>
          • Vata Nails: Dry, brittle, ridged, dark, prone to breaking
        </Text>
        <Text style={styles.educationBullet}>
          • Pitta Nails: Soft, pink/red, flexible, may show inflammation
        </Text>
        <Text style={styles.educationBullet}>
          • Kapha Nails: Thick, strong, smooth, white, good moisture
        </Text>
        <Text style={styles.manuscriptQuote}>
          "The nails reveal the state of Asthi Dhatu and Majja Dhatu (bone and marrow). Ridges
          show Vata disturbance, spots indicate poor mineral absorption, and pale color suggests
          weak blood formation."
        </Text>
        <Text style={styles.manuscriptSource}>- Ayurvedic Texts</Text>
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
    backgroundColor: '#F3E5F5',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#BA68C8',
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
    color: '#7B1FA2',
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
    backgroundColor: '#BA68C8',
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
    borderColor: '#BA68C8',
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#7B1FA2',
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
  nailImage: {
    width: '100%',
    height: 300,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 3,
    borderColor: '#BA68C8',
  },
  analyzeButton: {
    backgroundColor: '#7B1FA2',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
  },
  analyzeButtonDisabled: {
    backgroundColor: '#BA68C8',
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
    borderLeftColor: '#BA68C8',
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
  deficiencyCard: {
    backgroundColor: '#FFF3E0',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#FFB74D',
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  deficiencyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#E65100',
  },
  deficiencyRow: {
    marginBottom: 10,
  },
  deficiencyText: {
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
  completeButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#BA68C8',
  },
  completeButtonText: {
    color: '#7B1FA2',
    fontSize: 16,
    fontWeight: 'bold',
  },
  educationCard: {
    backgroundColor: '#FFF9E6',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#BA68C8',
  },
  educationTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  educationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#7B1FA2',
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
