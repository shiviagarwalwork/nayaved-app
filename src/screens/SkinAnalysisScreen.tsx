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
import { getRecommendedProducts } from '../data/products';
import ProductCard from '../components/ProductCard';
import { ManuscriptColors } from '../components/ManuscriptConstants';
import { analyzeSkin as aiAnalyzeSkin, isApiConfigured, SkinAnalysisResult as AISkinResult } from '../services/aiService';

interface SkinMetrics {
  luminosity: number; // 0-100 (glow/radiance)
  texture: number; // 0-100 (smoothness)
  evenness: number; // 0-100 (color uniformity)
  moisture: number; // 0-100 (hydration)
  inflammation: number; // 0-100 (lower is better - redness)
}

interface SkinAnalysisResult {
  metrics: SkinMetrics;
  ojasContribution: number; // 0-30 points
  dominantDosha: 'Vata' | 'Pitta' | 'Kapha' | 'Balanced';
  recommendations: string[];
  date: string;
}

const STORAGE_KEY = 'skinAnalysis';

export default function SkinAnalysisScreen() {
  const navigation = useNavigation<any>();
  const [faceImage, setFaceImage] = useState<string | null>(null);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<SkinAnalysisResult | null>(null);
  const [previousImage, setPreviousImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [useAI, setUseAI] = useState(false);
  const [aiResult, setAiResult] = useState<AISkinResult | null>(null);

  React.useEffect(() => {
    loadPreviousAnalysis();
  }, []);

  const loadPreviousAnalysis = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        const data = JSON.parse(stored);
        setPreviousImage(data.imageUri);
      }
    } catch (error) {
      console.log('Error loading previous analysis:', error);
    }
  };

  const requestCameraPermission = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Camera Permission',
        'We need camera access to analyze your facial skin for Ojas assessment.',
        [{ text: 'OK' }]
      );
      return false;
    }
    return true;
  };

  const takeFacePhoto = async () => {
    const hasPermission = await requestCameraPermission();
    if (!hasPermission) return;

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [3, 4],
      quality: 0.9,
    });

    if (!result.canceled && result.assets[0]) {
      setFaceImage(result.assets[0].uri);
      setShowAnalysis(false);
    }
  };

  const pickFromGallery = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [3, 4],
      quality: 0.9,
    });

    if (!result.canceled && result.assets[0]) {
      setFaceImage(result.assets[0].uri);
      setShowAnalysis(false);
    }
  };

  const analyzeSkin = async () => {
    if (!faceImage) return;

    setIsAnalyzing(true);
    setAiResult(null);
    setUseAI(false);

    try {
      // Check if API is configured
      const apiConfigured = await isApiConfigured();

      if (apiConfigured) {
        // Use real AI analysis
        try {
          const aiAnalysis = await aiAnalyzeSkin(faceImage);
          setAiResult(aiAnalysis);
          setUseAI(true);

          // Convert AI result to our format
          const metrics: SkinMetrics = {
            luminosity: aiAnalysis.luminosity,
            texture: aiAnalysis.texture,
            evenness: aiAnalysis.toneEvenness,
            moisture: aiAnalysis.moisture,
            inflammation: aiAnalysis.inflammation,
          };

          const result: SkinAnalysisResult = {
            metrics,
            ojasContribution: aiAnalysis.ojasContribution,
            dominantDosha: aiAnalysis.doshaIndication.dominant,
            recommendations: aiAnalysis.recommendations,
            date: new Date().toISOString(),
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
    const metrics = generateMockSkinMetrics();
    const ojasContribution = calculateOjasFromSkin(metrics);
    const dominantDosha = determineDoshaFromSkin(metrics);
    const recommendations = getRecommendations(dominantDosha, metrics);

    const result: SkinAnalysisResult = {
      metrics,
      ojasContribution,
      dominantDosha,
      recommendations,
      date: new Date().toISOString(),
    };

    setAnalysisResult(result);
    setShowAnalysis(true);
    await saveAnalysis(result);
  };

  const generateMockSkinMetrics = (): SkinMetrics => {
    // Mock analysis - Real version would use AI vision
    return {
      luminosity: Math.floor(Math.random() * 40) + 50, // 50-90
      texture: Math.floor(Math.random() * 35) + 55, // 55-90
      evenness: Math.floor(Math.random() * 35) + 55, // 55-90
      moisture: Math.floor(Math.random() * 40) + 50, // 50-90
      inflammation: Math.floor(Math.random() * 30) + 10, // 10-40 (lower is better)
    };
  };

  const calculateOjasFromSkin = (metrics: SkinMetrics): number => {
    // Luminosity is most important for Ojas (the glow)
    const luminosityScore = (metrics.luminosity / 100) * 12;
    const textureScore = (metrics.texture / 100) * 6;
    const evennessScore = (metrics.evenness / 100) * 6;
    const moistureScore = (metrics.moisture / 100) * 4;
    const inflammationScore = ((100 - metrics.inflammation) / 100) * 2;

    const total = luminosityScore + textureScore + evennessScore + moistureScore + inflammationScore;
    return Math.round(total); // 0-30 points
  };

  const determineDoshaFromSkin = (metrics: SkinMetrics): 'Vata' | 'Pitta' | 'Kapha' | 'Balanced' => {
    // Vata skin: Dry, rough, low moisture, thin
    // Pitta skin: Inflamed, sensitive, redness, oily T-zone
    // Kapha skin: Oily, thick, smooth, good moisture

    let vataScore = 0;
    let pittaScore = 0;
    let kaphaScore = 0;

    // Moisture analysis
    if (metrics.moisture < 50) vataScore += 30;
    else if (metrics.moisture > 75) kaphaScore += 30;
    else pittaScore += 20;

    // Texture analysis
    if (metrics.texture < 60) vataScore += 25;
    else if (metrics.texture > 80) kaphaScore += 25;
    else pittaScore += 15;

    // Inflammation analysis
    if (metrics.inflammation > 35) pittaScore += 35;
    else if (metrics.inflammation < 20) {
      kaphaScore += 15;
      vataScore += 10;
    }

    // Luminosity
    if (metrics.luminosity > 75) kaphaScore += 20;
    else if (metrics.luminosity < 55) vataScore += 20;

    const maxScore = Math.max(vataScore, pittaScore, kaphaScore);
    if (maxScore - Math.min(vataScore, pittaScore, kaphaScore) < 15) return 'Balanced';
    if (vataScore === maxScore) return 'Vata';
    if (pittaScore === maxScore) return 'Pitta';
    return 'Kapha';
  };

  const getRecommendations = (dosha: string, metrics: SkinMetrics): string[] => {
    const recs: string[] = [];

    // Based on dosha
    if (dosha === 'Vata') {
      recs.push('Use nourishing oils: sesame, almond oil for face massage');
      recs.push('Eat healthy fats: ghee, avocado, nuts');
      recs.push('Stay hydrated with warm water');
      recs.push('Avoid harsh soaps and excessive cleansing');
    } else if (dosha === 'Pitta') {
      recs.push('Use cooling oils: coconut, sunflower oil');
      recs.push('Eat cooling foods: cucumber, cilantro, mint');
      recs.push('Avoid sun exposure and heat');
      recs.push('Apply aloe vera or rose water');
    } else if (dosha === 'Kapha') {
      recs.push('Use light, stimulating oils: jojoba, grapeseed');
      recs.push('Exfoliate regularly with gentle scrubs');
      recs.push('Eat warming spices: ginger, turmeric');
      recs.push('Dry brushing before shower');
    }

    // Based on specific metrics
    if (metrics.luminosity < 60) {
      recs.push('Build Ojas: Sleep 7-8 hours, reduce stress, practice meditation');
    }
    if (metrics.moisture < 60) {
      recs.push('Increase hydration: Drink more water, use facial oils');
    }
    if (metrics.inflammation > 30) {
      recs.push('Reduce inflammation: Turmeric milk, cooling diet, avoid spicy foods');
    }

    return recs;
  };

  const saveAnalysis = async (result: SkinAnalysisResult) => {
    try {
      const data = {
        ...result,
        imageUri: faceImage,
      };
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));

      // Also update Ojas tracker with skin contribution
      await updateOjasTracker(result.ojasContribution);
    } catch (error) {
      console.log('Error saving analysis:', error);
    }
  };

  const updateOjasTracker = async (skinOjas: number) => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const ojasKey = `@nayaved_ojas_data_${today}`;
      const stored = await AsyncStorage.getItem(ojasKey);

      if (stored) {
        const ojasData = JSON.parse(stored);
        // Add skin Ojas to existing habit score
        ojasData.score = Math.min(100, ojasData.score + skinOjas);
        ojasData.skinOjasContribution = skinOjas;
        await AsyncStorage.setItem(ojasKey, JSON.stringify(ojasData));
      }
    } catch (error) {
      console.log('Error updating Ojas tracker:', error);
    }
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
          <MaterialCommunityIcons name="shimmer" size={32} color="#FF9800" />
          <Text style={styles.title}> Facial Ojas Analysis</Text>
        </View>
        <Text style={styles.subtitle}>
          Twak Pariksha - Skin reveals your inner vitality
        </Text>
      </View>

      {/* Instructions */}
      <View style={styles.instructionsCard}>
        <View style={styles.instructionsTitleRow}>
          <Ionicons name="clipboard-outline" size={20} color="#3E2723" />
          <Text style={styles.instructionsTitle}> How to take a good selfie:</Text>
        </View>
        <View style={styles.instruction}>
          <Text style={styles.bulletPoint}>1.</Text>
          <Text style={styles.instructionText}>
            Do this in the morning after washing your face (no makeup)
          </Text>
        </View>
        <View style={styles.instruction}>
          <Text style={styles.bulletPoint}>2.</Text>
          <Text style={styles.instructionText}>
            Use natural daylight - stand near a window
          </Text>
        </View>
        <View style={styles.instruction}>
          <Text style={styles.bulletPoint}>3.</Text>
          <Text style={styles.instructionText}>
            Face the camera directly, neutral expression
          </Text>
        </View>
        <View style={styles.instruction}>
          <Text style={styles.bulletPoint}>4.</Text>
          <Text style={styles.instructionText}>
            Ensure your whole face is visible and in focus
          </Text>
        </View>
        <View style={styles.instruction}>
          <Text style={styles.bulletPoint}>5.</Text>
          <Text style={styles.instructionText}>
            Take weekly selfies to track Ojas glow changes
          </Text>
        </View>
      </View>

      {/* Camera Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.primaryButton} onPress={takeFacePhoto}>
          <View style={styles.buttonContent}>
            <Feather name="camera" size={20} color="#FFFFFF" />
            <Text style={styles.primaryButtonText}> Take Selfie</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.secondaryButton} onPress={pickFromGallery}>
          <View style={styles.buttonContent}>
            <Feather name="image" size={20} color="#FF9800" />
            <Text style={styles.secondaryButtonText}> Choose from Gallery</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Image Preview */}
      {faceImage && (
        <View style={styles.imageContainer}>
          <Text style={styles.sectionTitle}>Your Facial Photo</Text>
          <Image source={{ uri: faceImage as string }} style={styles.faceImage} />
          <TouchableOpacity
            style={[styles.analyzeButton, isAnalyzing && styles.analyzeButtonDisabled]}
            onPress={analyzeSkin}
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
                <Text style={styles.analyzeButtonText}> Analyze Ojas Glow</Text>
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
            <Text style={styles.analysisTitle}> Skin Analysis Results</Text>
          </View>
          <View style={[styles.disclaimerContainer, useAI && styles.aiDisclaimerContainer]}>
            <Ionicons name="information-circle" size={18} color={useAI ? '#4CAF50' : '#B87333'} />
            <Text style={[styles.disclaimer, useAI && styles.aiDisclaimer]}>
              {useAI
                ? 'AI-powered analysis based on Ayurvedic Twak Pariksha principles. For medical advice, consult a dermatologist or Ayurvedic practitioner.'
                : 'Demo mode - Backend connection required for AI analysis. For medical advice, consult a dermatologist or Ayurvedic practitioner.'}
            </Text>
          </View>

          {/* Ojas Contribution */}
          <View style={styles.ojasContributionCard}>
            <Text style={styles.ojasContributionLabel}>Ojas from Facial Glow</Text>
            <Text style={styles.ojasContributionValue}>
              +{analysisResult.ojasContribution}
            </Text>
            <Text style={styles.ojasContributionNote}>
              Added to your Ojas Tracker today!
            </Text>
          </View>

          {/* Skin Metrics */}
          <View style={styles.metricsCard}>
            <Text style={styles.metricsTitle}>Skin Health Metrics</Text>

            {/* Luminosity */}
            <View style={styles.metricRow}>
              <View style={styles.metricHeader}>
                <Text style={styles.metricLabel}>✨ Luminosity (Glow)</Text>
                <Text style={[styles.metricStatus, { color: getMetricColor(analysisResult.metrics.luminosity) }]}>
                  {getMetricLabel(analysisResult.metrics.luminosity)}
                </Text>
              </View>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    {
                      width: `${analysisResult.metrics.luminosity}%`,
                      backgroundColor: getMetricColor(analysisResult.metrics.luminosity),
                    },
                  ]}
                />
              </View>
              <Text style={styles.metricValue}>{analysisResult.metrics.luminosity}/100</Text>
            </View>

            {/* Texture */}
            <View style={styles.metricRow}>
              <View style={styles.metricHeader}>
                <Text style={styles.metricLabel}>🧴 Texture (Smoothness)</Text>
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

            {/* Evenness */}
            <View style={styles.metricRow}>
              <View style={styles.metricHeader}>
                <Text style={styles.metricLabel}>🎨 Tone Evenness</Text>
                <Text style={[styles.metricStatus, { color: getMetricColor(analysisResult.metrics.evenness) }]}>
                  {getMetricLabel(analysisResult.metrics.evenness)}
                </Text>
              </View>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    {
                      width: `${analysisResult.metrics.evenness}%`,
                      backgroundColor: getMetricColor(analysisResult.metrics.evenness),
                    },
                  ]}
                />
              </View>
              <Text style={styles.metricValue}>{analysisResult.metrics.evenness}/100</Text>
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

            {/* Inflammation */}
            <View style={styles.metricRow}>
              <View style={styles.metricHeader}>
                <Text style={styles.metricLabel}>🔴 Inflammation</Text>
                <Text style={[styles.metricStatus, { color: getMetricColor(analysisResult.metrics.inflammation, true) }]}>
                  {getMetricLabel(analysisResult.metrics.inflammation, true)}
                </Text>
              </View>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    {
                      width: `${analysisResult.metrics.inflammation}%`,
                      backgroundColor: analysisResult.metrics.inflammation > 50 ? '#F44336' : '#4CAF50',
                    },
                  ]}
                />
              </View>
              <Text style={styles.metricValue}>{analysisResult.metrics.inflammation}/100 (lower is better)</Text>
            </View>
          </View>

          {/* Dosha Indication */}
          <View style={styles.doshaCard}>
            <Text style={styles.doshaTitle}>Skin Type (Dosha)</Text>
            <Text style={styles.doshaValue}>{analysisResult.dominantDosha}</Text>
            <Text style={styles.doshaExplanation}>
              {analysisResult.dominantDosha === 'Vata' &&
                'Your skin shows Vata characteristics: dryness, thinness. Focus on nourishment and moisture.'}
              {analysisResult.dominantDosha === 'Pitta' &&
                'Your skin shows Pitta characteristics: sensitivity, inflammation. Focus on cooling and soothing.'}
              {analysisResult.dominantDosha === 'Kapha' &&
                'Your skin shows Kapha characteristics: thickness, oiliness. Focus on gentle cleansing and stimulation.'}
              {analysisResult.dominantDosha === 'Balanced' &&
                'Your skin appears balanced across all three doshas. Maintain your current routine!'}
            </Text>
          </View>

          {/* Recommendations */}
          <View style={styles.recommendationsCard}>
            <View style={styles.recommendationsTitleRow}>
              <Feather name="check-circle" size={18} color="#6B8E23" />
              <Text style={styles.recommendationsTitle}> Recommendations for Your Skin</Text>
            </View>
            {analysisResult.recommendations.map((rec, idx) => (
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
              These herbs & oils can help balance your {analysisResult.dominantDosha} skin type
            </Text>
            {getRecommendedProducts(analysisResult.dominantDosha.toLowerCase() as 'vata' | 'pitta' | 'kapha', 2).map((product) => (
              <ProductCard key={product.id} product={product} showFullDetails={false} />
            ))}
            <TouchableOpacity
              style={styles.shopMoreButton}
              onPress={() => navigation.navigate('Pharmacy')}
            >
              <Text style={styles.shopMoreText}>View All Products →</Text>
            </TouchableOpacity>
          </View>

          {/* Before/After Comparison */}
          {previousImage && (
            <View style={styles.comparisonSection}>
              <View style={styles.comparisonTitleRow}>
                <Ionicons name="trending-up" size={22} color="#6A1B9A" />
                <Text style={styles.comparisonTitle}> Track Your Progress</Text>
              </View>
              <View style={styles.comparisonImages}>
                <View style={styles.comparisonItem}>
                  <Text style={styles.comparisonLabel}>Previous</Text>
                  <Image source={{ uri: previousImage as string }} style={styles.comparisonImage} />
                </View>
                <Text style={styles.comparisonArrow}>→</Text>
                <View style={styles.comparisonItem}>
                  <Text style={styles.comparisonLabel}>Today</Text>
                  <Image source={{ uri: faceImage as string }} style={styles.comparisonImage} />
                </View>
              </View>
              <Text style={styles.comparisonNote}>
                Take weekly selfies to see your Ojas glow increase!
              </Text>
            </View>
          )}

          {/* Auto-saved indicator */}
          <View style={styles.autoSavedBadge}>
            <Feather name="check-circle" size={16} color="#6B8E23" />
            <Text style={styles.autoSavedText}>Auto-saved to My Plan</Text>
          </View>

          {/* Action Button */}
          <TouchableOpacity
            style={styles.ojasButton}
            onPress={() => navigation.navigate('Ojas' as never)}
          >
            <Text style={styles.ojasButtonText}>
              View Ojas Tracker →
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Educational Section */}
      <View style={styles.educationCard}>
        <View style={styles.educationTitleRow}>
          <MaterialCommunityIcons name="shimmer" size={20} color="#B87333" />
          <Text style={styles.educationTitle}> Skin & Ojas Connection</Text>
        </View>
        <Text style={styles.educationText}>
          In Ayurveda, healthy skin is a direct reflection of strong Ojas. When your Ojas
          is abundant, your skin glows with a natural radiance, feels smooth, and has even
          tone.
        </Text>
        <Text style={styles.educationText}>
          Dull, dry, or inflamed skin indicates depleted Ojas and imbalanced doshas. By
          tracking your facial glow over time, you can see how lifestyle changes affect
          your vitality.
        </Text>
        <Text style={styles.manuscriptQuote}>
          "The luster of the skin, the glow in the eyes, and the radiance of the face -
          these are signs of strong Ojas and balanced doshas."
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
    backgroundColor: '#FFF3E0',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#FFB74D',
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
    color: '#FF9800',
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
    backgroundColor: '#FFB74D',
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
    borderColor: '#FFB74D',
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#FF9800',
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
  faceImage: {
    width: '100%',
    height: 400,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 3,
    borderColor: '#FFB74D',
  },
  analyzeButton: {
    backgroundColor: '#FF9800',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
  },
  analyzeButtonDisabled: {
    backgroundColor: '#FFB74D',
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
    borderLeftColor: '#FFB74D',
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
  ojasContributionCard: {
    backgroundColor: '#FFD700',
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 3,
    borderColor: '#FFA500',
  },
  ojasContributionLabel: {
    fontSize: 14,
    color: '#3E2723',
    marginBottom: 8,
  },
  ojasContributionValue: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  ojasContributionNote: {
    fontSize: 13,
    color: '#5D4037',
    fontStyle: 'italic',
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
  doshaCard: {
    backgroundColor: '#E8F5E9',
    padding: 16,
    paddingBottom: 20,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#9EBF88',
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
    color: '#6B8E23',
    marginBottom: 12,
  },
  doshaExplanation: {
    fontSize: 14,
    color: '#5D4037',
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 8,
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
  comparisonSection: {
    backgroundColor: '#F3E5F5',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#CE93D8',
  },
  comparisonTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  comparisonTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#6A1B9A',
  },
  comparisonImages: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: 12,
  },
  comparisonItem: {
    alignItems: 'center',
  },
  comparisonLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6A1B9A',
    marginBottom: 8,
  },
  comparisonImage: {
    width: 120,
    height: 160,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#CE93D8',
  },
  comparisonArrow: {
    fontSize: 24,
    color: '#6A1B9A',
    fontWeight: 'bold',
  },
  comparisonNote: {
    fontSize: 13,
    color: '#6A1B9A',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  actionButtons: {
    marginBottom: 16,
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
  ojasButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFD700',
  },
  ojasButtonText: {
    color: '#FF9800',
    fontSize: 16,
    fontWeight: 'bold',
  },
  educationCard: {
    backgroundColor: '#FFF9E6',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#FFB74D',
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
    backgroundColor: '#FF8C42',
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
