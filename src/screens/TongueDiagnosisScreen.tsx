/**
 * ============================================================
 * Tongue Diagnosis Screen (Jihva Pariksha)
 * ============================================================
 *
 * This screen implements the ancient Ayurvedic practice of
 * tongue diagnosis using AI-powered image analysis.
 *
 * FEATURES:
 * - Camera/gallery image capture for tongue photos
 * - AI analysis via Claude API (when backend available)
 * - Educational fallback when AI unavailable
 * - Dosha indication with percentage scores
 * - Personalized Ayurvedic recommendations
 * - Results saved to AsyncStorage for "My Plan" screen
 *
 * ERROR HANDLING:
 * - Gracefully falls back to educational guide on API errors
 * - Only shows alert for usage limit errors (prompts upgrade)
 * - Null checks prevent crashes from missing data fields
 *
 * @author NayaVed Team
 */

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
import { analyzeTongue as aiAnalyzeTongue, isApiConfigured, TongueAnalysisResult } from '../services/aiService';
import { saveScanResult, saveScanOjasContribution, calculateScanOjasContribution } from '../services/dailyRitualService';
import PremiumLock from '../components/PremiumLock';
import { getRecommendedProducts } from '../data/products';
import ProductCard from '../components/ProductCard';

export default function TongueDiagnosisScreen() {
  const navigation = useNavigation();

  // ============================================================
  // STATE MANAGEMENT
  // ============================================================
  const [tongueImage, setTongueImage] = useState<string | null>(null);  // Captured image URI
  const [showAnalysis, setShowAnalysis] = useState(false);              // Show results section
  const [isAnalyzing, setIsAnalyzing] = useState(false);                // Loading state
  const [aiResult, setAiResult] = useState<TongueAnalysisResult | null>(null);  // AI analysis result
  const [useAI, setUseAI] = useState(false);                            // Whether AI was used (vs educational fallback)

  const requestCameraPermission = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Camera Permission',
        'We need camera access to take a photo of your tongue for analysis.',
        [{ text: 'OK' }]
      );
      return false;
    }
    return true;
  };

  const takeTonguePhoto = async () => {
    const hasPermission = await requestCameraPermission();
    if (!hasPermission) return;

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setTongueImage(result.assets[0].uri);
      setShowAnalysis(false);
      setAiResult(null);
    }
  };

  const pickFromGallery = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setTongueImage(result.assets[0].uri);
      setShowAnalysis(false);
      setAiResult(null);
    }
  };

  const analyzeTongue = async () => {
    if (!tongueImage) return;

    setIsAnalyzing(true);

    try {
      // Check if AI is configured
      const apiConfigured = await isApiConfigured();

      if (apiConfigured) {
        // Use AI analysis
        const result = await aiAnalyzeTongue(tongueImage);
        setAiResult(result);
        setUseAI(true);

        // Save AI result
        const tongueAnalysisData = {
          date: new Date().toISOString(),
          type: 'tongue',
          aiPowered: true,
          coating: result.coating,
          tongueColor: result.tongueColor,
          shape: result.shape,
          moisture: result.moisture,
          doshaIndication: result.doshaIndication,
          recommendations: result.recommendations,
        };
        await AsyncStorage.setItem('tongueAnalysis', JSON.stringify(tongueAnalysisData));

        // Save to daily ritual service for streak tracking
        await saveScanResult({
          type: 'tongue',
          summary: `${result.doshaIndication?.dominant || 'Unknown'} dominant - ${result.tongueColor || 'analyzed'}`,
          dominantDosha: result.doshaIndication?.dominant?.toLowerCase() as 'vata' | 'pitta' | 'kapha',
          metrics: {
            coating: result.coating?.thickness === 'thick' ? 70 : result.coating?.thickness === 'thin' ? 30 : 50,
            moisture: result.moisture === 'dry' ? 30 : result.moisture === 'wet' ? 70 : 50,
          },
        });

        // Save Ojas contribution (healthier tongue = higher score)
        const healthScore = result.moisture === 'normal' ? 80 : result.moisture === 'dry' ? 40 : 60;
        const ojasContribution = calculateScanOjasContribution('tongue', healthScore);
        await saveScanOjasContribution('tongue', ojasContribution);
      } else {
        // Use educational fallback
        setUseAI(false);
        const tongueAnalysisData = {
          date: new Date().toISOString(),
          type: 'tongue',
          aiPowered: false,
          analysis: getEducationalAnalysis(),
          recommendations: [
            'Monitor tongue daily in the morning',
            'Scrape tongue with copper scraper',
            'Observe changes after dietary modifications',
            'Take Triphala for detoxification',
          ],
        };
        await AsyncStorage.setItem('tongueAnalysis', JSON.stringify(tongueAnalysisData));

        // Save to daily ritual service for streak tracking (educational mode)
        await saveScanResult({
          type: 'tongue',
          summary: 'Educational tongue analysis completed',
        });

        // Save Ojas contribution (base score for completing scan)
        const ojasContribution = calculateScanOjasContribution('tongue', 50);
        await saveScanOjasContribution('tongue', ojasContribution);
      }

      setShowAnalysis(true);
    } catch (error: any) {
      console.log('Tongue analysis error:', error.message);

      // Check if it's a usage limit error - navigate to paywall
      if (error.code === 'USAGE_LIMIT') {
        setIsAnalyzing(false);
        Alert.alert(
          'Free Scans Used',
          'Upgrade to Premium for unlimited AI-powered tongue analysis with personalized recommendations!',
          [
            { text: 'Maybe Later', style: 'cancel' },
            { text: 'Upgrade Now', onPress: () => navigation.navigate('Paywall' as never) }
          ]
        );
        return; // Don't show demo results - they're confusing
      }

      // For network errors, show a helpful message
      Alert.alert(
        'Connection Issue',
        'Unable to connect to AI service. Please check your internet connection and try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getEducationalAnalysis = () => {
    return {
      coating: {
        observation: 'Light coating present',
        meaning: 'A thin white coating is normal. Thick coating indicates Ama (toxins) or weak Agni (digestive fire)',
        recommendation: 'For thick coating: Try fasting, drink warm water with lemon, take Triphala before bed.',
      },
      color: {
        observation: 'Pink to light red tone',
        meaning: 'Healthy pink = balanced. Pale = Vata/anemia. Dark red = Pitta/inflammation. Purple/blue = poor circulation',
        recommendation: 'Monitor changes daily. Sudden color changes may indicate dosha shifts.',
      },
      shape: {
        observation: 'Observe edges and surface',
        meaning: 'Teeth marks = Spleen Qi deficiency or malabsorption. Swollen = Kapha excess. Thin = Vata',
        recommendation: 'If swollen: reduce dairy/sugar. If thin: increase nourishing foods, ghee.',
      },
      moisture: {
        observation: 'Check moisture level',
        meaning: 'Too dry = Vata imbalance, dehydration. Too wet/slimy = Kapha excess, weak digestion',
        recommendation: 'Dry: increase water, healthy fats. Wet: warming spices, reduce cold/heavy foods.',
      },
    };
  };

  const getDoshaColor = (dosha: string) => {
    switch (dosha?.toLowerCase()) {
      case 'vata': return '#60A5FA';
      case 'pitta': return '#EF4444';
      case 'kapha': return '#10B981';
      default: return ManuscriptColors.inkBrown;
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerIconRow}>
          <MaterialCommunityIcons name="account-voice" size={32} color="#6B8E23" />
          <Text style={styles.title}> Tongue Analysis</Text>
        </View>
        <Text style={styles.subtitle}>
          Jihva Pariksha - Ancient Ayurvedic wellness practice
        </Text>
      </View>

      {/* Instructions */}
      <View style={styles.instructionsCard}>
        <View style={styles.instructionsTitleRow}>
          <Ionicons name="clipboard-outline" size={20} color="#3E2723" />
          <Text style={styles.instructionsTitle}> How to take a good photo:</Text>
        </View>
        <View style={styles.instruction}>
          <Text style={styles.bulletPoint}>1.</Text>
          <Text style={styles.instructionText}>
            Do this in the morning before eating or drinking
          </Text>
        </View>
        <View style={styles.instruction}>
          <Text style={styles.bulletPoint}>2.</Text>
          <Text style={styles.instructionText}>
            Stand in natural light (near a window)
          </Text>
        </View>
        <View style={styles.instruction}>
          <Text style={styles.bulletPoint}>3.</Text>
          <Text style={styles.instructionText}>
            Stick your tongue out fully
          </Text>
        </View>
        <View style={styles.instruction}>
          <Text style={styles.bulletPoint}>4.</Text>
          <Text style={styles.instructionText}>
            Hold camera 6-8 inches away
          </Text>
        </View>
        <View style={styles.instruction}>
          <Text style={styles.bulletPoint}>5.</Text>
          <Text style={styles.instructionText}>
            Make sure tongue fills most of the frame
          </Text>
        </View>
      </View>

      {/* Camera Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.primaryButton} onPress={takeTonguePhoto}>
          <View style={styles.buttonContent}>
            <Feather name="camera" size={20} color="#FFFFFF" />
            <Text style={styles.primaryButtonText}> Take Photo</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.secondaryButton} onPress={pickFromGallery}>
          <View style={styles.buttonContent}>
            <Feather name="image" size={20} color="#6B8E23" />
            <Text style={styles.secondaryButtonText}> Choose from Gallery</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Image Preview */}
      {tongueImage && (
        <View style={styles.imageContainer}>
          <Text style={styles.sectionTitle}>Your Tongue Photo</Text>
          <Image source={{ uri: tongueImage }} style={styles.tongueImage} />
          <TouchableOpacity
            style={[styles.analyzeButton, isAnalyzing && styles.analyzeButtonDisabled]}
            onPress={analyzeTongue}
            disabled={isAnalyzing}
          >
            {isAnalyzing ? (
              <View style={styles.buttonContent}>
                <ActivityIndicator size="small" color="#FFFFFF" />
                <Text style={styles.analyzeButtonText}> Analyzing with AI...</Text>
              </View>
            ) : (
              <View style={styles.buttonContent}>
                <MaterialCommunityIcons name="brain" size={18} color="#FFFFFF" />
                <Text style={styles.analyzeButtonText}> Analyze with AI</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      )}

      {/* AI Analysis Results */}
      {showAnalysis && tongueImage && useAI && aiResult && (
        <View style={styles.analysisSection}>
          <View style={styles.analysisTitleRow}>
            <MaterialCommunityIcons name="brain" size={24} color={ManuscriptColors.vermillion} />
            <Text style={styles.analysisTitle}> AI Tongue Analysis</Text>
          </View>

          <View style={[styles.disclaimerContainer, styles.aiDisclaimerContainer]}>
            <Ionicons name="information-circle" size={18} color="#4CAF50" />
            <Text style={styles.disclaimerAI}>
              For educational purposes only. AI-powered insights based on Ayurvedic Jihva Pariksha principles. Not a substitute for medical advice. Consult a qualified healthcare provider for any health concerns.
            </Text>
          </View>

          {/* Dosha Indication */}
          {aiResult.doshaIndication && (
            <View style={[styles.doshaCard, { borderColor: getDoshaColor(aiResult.doshaIndication.dominant) }]}>
              <Text style={styles.doshaTitle}>Dominant Dosha Indication</Text>
              <View style={styles.doshaScoresRow}>
                <View style={styles.doshaScore}>
                  <Text style={[styles.doshaName, { color: '#60A5FA' }]}>Vata</Text>
                  <Text style={styles.doshaPercent}>{aiResult.doshaIndication.vataScore || 0}%</Text>
                </View>
                <View style={styles.doshaScore}>
                  <Text style={[styles.doshaName, { color: '#EF4444' }]}>Pitta</Text>
                  <Text style={styles.doshaPercent}>{aiResult.doshaIndication.pittaScore || 0}%</Text>
                </View>
                <View style={styles.doshaScore}>
                  <Text style={[styles.doshaName, { color: '#10B981' }]}>Kapha</Text>
                  <Text style={styles.doshaPercent}>{aiResult.doshaIndication.kaphaScore || 0}%</Text>
                </View>
              </View>
              <Text style={[styles.dominantDosha, { color: getDoshaColor(aiResult.doshaIndication.dominant) }]}>
                {aiResult.doshaIndication.dominant || 'Unknown'} Dominant
              </Text>
            </View>
          )}

          {/* Coating Analysis */}
          {aiResult.coating && (
            <View style={styles.analysisCard}>
              <Text style={styles.analysisCategory}>Coating</Text>
              <View style={styles.analysisDetail}>
                <Text style={styles.detailLabel}>Color:</Text>
                <Text style={styles.detailValue}>{aiResult.coating.color || 'Not detected'}</Text>
              </View>
              <View style={styles.analysisDetail}>
                <Text style={styles.detailLabel}>Thickness:</Text>
                <Text style={styles.detailValue}>{aiResult.coating.thickness || 'Not detected'}</Text>
              </View>
              {aiResult.coating.description && (
                <Text style={styles.detailDescription}>{aiResult.coating.description}</Text>
              )}
            </View>
          )}

          {/* Other observations */}
          <View style={styles.analysisCard}>
            <Text style={styles.analysisCategory}>Observations</Text>
            <View style={styles.analysisDetail}>
              <Text style={styles.detailLabel}>Tongue Color:</Text>
              <Text style={styles.detailValue}>{aiResult.tongueColor}</Text>
            </View>
            <View style={styles.analysisDetail}>
              <Text style={styles.detailLabel}>Shape:</Text>
              <Text style={styles.detailValue}>{aiResult.shape}</Text>
            </View>
            <View style={styles.analysisDetail}>
              <Text style={styles.detailLabel}>Moisture:</Text>
              <Text style={styles.detailValue}>{aiResult.moisture}</Text>
            </View>
            {aiResult.cracks && aiResult.cracks.length > 0 && (
              <View style={styles.analysisDetail}>
                <Text style={styles.detailLabel}>Cracks:</Text>
                <Text style={styles.detailValue}>{aiResult.cracks.join(', ')}</Text>
              </View>
            )}
          </View>

          {/* Health Indicators */}
          {aiResult.healthIndicators && aiResult.healthIndicators.length > 0 && (
            <View style={styles.analysisCard}>
              <Text style={styles.analysisCategory}>Health Indicators</Text>
              {aiResult.healthIndicators.map((indicator, idx) => (
                <View key={idx} style={styles.indicatorRow}>
                  <Feather name="alert-circle" size={14} color={ManuscriptColors.vermillion} />
                  <Text style={styles.indicatorText}>{indicator}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Premium Content - LOCKED for free users (Curiosity Gap) */}
          {(aiResult.recommendations?.length > 0 || aiResult.ayurvedicInterpretation) && (
            <PremiumLock
              contentType="protocols"
              itemCount={aiResult.recommendations?.length || 0}
              description="Get personalized recommendations and detailed Ayurvedic interpretation"
            >
              {/* Recommendations */}
              {aiResult.recommendations && aiResult.recommendations.length > 0 && (
                <View style={styles.recommendationsCard}>
                  <Text style={styles.recommendationsTitle}>Recommendations</Text>
                  {aiResult.recommendations.map((rec, idx) => (
                    <View key={idx} style={styles.recommendationRow}>
                      <Feather name="check" size={14} color="#4CAF50" />
                      <Text style={styles.recommendationText}>{rec}</Text>
                    </View>
                  ))}
                </View>
              )}

              {/* Ayurvedic Interpretation */}
              {aiResult.ayurvedicInterpretation && (
                <View style={styles.interpretationCard}>
                  <Text style={styles.interpretationTitle}>Ayurvedic Interpretation</Text>
                  <Text style={styles.interpretationText}>{aiResult.ayurvedicInterpretation}</Text>
                </View>
              )}
            </PremiumLock>
          )}

          {/* Auto-saved indicator */}
          <View style={styles.autoSavedBadge}>
            <Feather name="check-circle" size={16} color="#6B8E23" />
            <Text style={styles.autoSavedText}>Saved to My Plan</Text>
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

      {/* Educational Analysis (Fallback) */}
      {showAnalysis && tongueImage && !useAI && (
        <View style={styles.analysisSection}>
          <View style={styles.analysisTitleRow}>
            <Ionicons name="stats-chart" size={24} color="#3E2723" />
            <Text style={styles.analysisTitle}> Tongue Analysis Guide</Text>
          </View>
          <View style={styles.disclaimerContainer}>
            <Ionicons name="information-circle" size={18} color="#B87333" />
            <Text style={styles.disclaimer}>
              For educational purposes only. Based on Ayurvedic Jihva Pariksha principles. Not a substitute for medical advice. Consult a qualified healthcare provider for any health concerns.
            </Text>
          </View>

          {Object.entries(getEducationalAnalysis()).map(([key, data]) => (
            <View key={key} style={styles.analysisCard}>
              <Text style={styles.analysisCategory}>
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </Text>
              <View style={styles.analysisRow}>
                <Text style={styles.analysisLabel}>Observation:</Text>
                <Text style={styles.analysisText}>{data.observation}</Text>
              </View>
              <View style={styles.analysisRow}>
                <Text style={styles.analysisLabel}>Meaning:</Text>
                <Text style={styles.analysisText}>{data.meaning}</Text>
              </View>
              <View style={[styles.analysisRow, styles.recommendationRow]}>
                <Text style={styles.analysisLabel}>What to do:</Text>
                <Text style={[styles.analysisText, styles.recommendationTextOld]}>
                  {data.recommendation}
                </Text>
              </View>
            </View>
          ))}

          <View style={styles.autoSavedBadge}>
            <Feather name="check-circle" size={16} color="#6B8E23" />
            <Text style={styles.autoSavedText}>Auto-saved to My Plan</Text>
          </View>
        </View>
      )}

      {/* Educational Section */}
      <View style={styles.educationCard}>
        <View style={styles.educationTitleRow}>
          <MaterialCommunityIcons name="meditation" size={20} color="#B87333" />
          <Text style={styles.educationTitle}> Why Tongue Analysis?</Text>
        </View>
        <Text style={styles.educationText}>
          In Ayurveda, the tongue is a map of your internal organs. Practitioners have
          used Jihva Pariksha (tongue examination) for 5,000 years to:
        </Text>
        <Text style={styles.educationBullet}>
          • See digestive health (Agni strength)
        </Text>
        <Text style={styles.educationBullet}>• Detect toxin accumulation (Ama)</Text>
        <Text style={styles.educationBullet}>• Identify dosha imbalances</Text>
        <Text style={styles.educationBullet}>
          • Monitor organ health (different tongue areas = different organs)
        </Text>
        <Text style={styles.manuscriptQuote}>
          "The tongue reveals the state of Rasa Dhatu (plasma/lymph), the coating
          indicates Ama (toxins), and the color shows which dosha is disturbed."
        </Text>
        <Text style={styles.manuscriptSource}>- Charaka Samhita</Text>
      </View>

      {/* Product Recommendations - shown after educational section */}
      {aiResult && aiResult.doshaIndication && (
        <View style={styles.productRecommendationsSection}>
          <View style={styles.productSectionTitleRow}>
            <MaterialCommunityIcons name="leaf" size={22} color="#4CAF50" />
            <Text style={styles.productSectionTitle}> Suggested Ayurvedic Products</Text>
          </View>
          <Text style={styles.productSectionSubtitle}>
            These herbs can help balance your {aiResult.doshaIndication.dominant} constitution
          </Text>
          {getRecommendedProducts(aiResult.doshaIndication.dominant.toLowerCase() as 'vata' | 'pitta' | 'kapha', 3).map((product) => (
            <ProductCard key={product.id} product={product} showFullDetails={false} />
          ))}
          <TouchableOpacity
            style={styles.shopMoreButton}
            onPress={() => navigation.navigate('Pharmacy' as never)}
          >
            <Text style={styles.shopMoreText}>View All Products →</Text>
          </TouchableOpacity>
        </View>
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
    backgroundColor: '#E8F5E9',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#9EBF88',
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
    color: '#6B8E23',
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
    backgroundColor: '#9EBF88',
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
    borderColor: '#9EBF88',
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#6B8E23',
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
  tongueImage: {
    width: '100%',
    height: 300,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 3,
    borderColor: '#9EBF88',
  },
  analyzeButton: {
    backgroundColor: ManuscriptColors.vermillion,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
  },
  analyzeButtonDisabled: {
    opacity: 0.7,
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
    marginLeft: 8,
  },
  aiPoweredBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    marginBottom: 16,
    alignSelf: 'flex-start',
    gap: 6,
  },
  aiPoweredText: {
    color: '#4CAF50',
    fontSize: 13,
    fontWeight: '600',
  },
  doshaCard: {
    backgroundColor: ManuscriptColors.parchment,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 2,
  },
  doshaTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: ManuscriptColors.inkBlack,
    marginBottom: 12,
    textAlign: 'center',
  },
  doshaScoresRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 12,
  },
  doshaScore: {
    alignItems: 'center',
  },
  doshaName: {
    fontSize: 14,
    fontWeight: '600',
  },
  doshaPercent: {
    fontSize: 18,
    fontWeight: 'bold',
    color: ManuscriptColors.inkBlack,
  },
  dominantDosha: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  analysisCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#D7CCC8',
  },
  analysisCategory: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#9EBF88',
    marginBottom: 10,
    textTransform: 'capitalize',
  },
  analysisDetail: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: ManuscriptColors.inkBrown,
    width: 100,
  },
  detailValue: {
    fontSize: 14,
    color: ManuscriptColors.inkBlack,
    flex: 1,
  },
  detailDescription: {
    fontSize: 14,
    color: ManuscriptColors.fadedInk,
    marginTop: 8,
    lineHeight: 20,
  },
  indicatorRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
    gap: 8,
  },
  indicatorText: {
    fontSize: 14,
    color: ManuscriptColors.inkBrown,
    flex: 1,
  },
  recommendationsCard: {
    backgroundColor: '#E8F5E9',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#81C784',
  },
  recommendationsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 12,
  },
  recommendationRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
    gap: 8,
  },
  recommendationText: {
    fontSize: 14,
    color: ManuscriptColors.inkBrown,
    flex: 1,
  },
  interpretationCard: {
    backgroundColor: ManuscriptColors.oldPaper,
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: ManuscriptColors.goldLeaf,
  },
  interpretationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: ManuscriptColors.copperBrown,
    marginBottom: 10,
  },
  interpretationText: {
    fontSize: 14,
    color: ManuscriptColors.inkBrown,
    lineHeight: 22,
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
  disclaimerAI: {
    fontSize: 12,
    color: '#2E7D32',
    flex: 1,
    marginLeft: 8,
    lineHeight: 18,
  },
  aiDisclaimerContainer: {
    backgroundColor: '#E8F5E9',
    borderLeftColor: '#4CAF50',
  },
  analysisRow: {
    marginBottom: 8,
  },
  analysisLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#5D4037',
    marginBottom: 3,
  },
  analysisText: {
    fontSize: 14,
    color: '#3E2723',
    lineHeight: 20,
  },
  recommendationTextOld: {
    fontWeight: '600',
    color: '#6B8E23',
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
  ojasButton: {
    backgroundColor: '#FFF8E7',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 25,
    marginTop: 12,
    borderWidth: 2,
    borderColor: '#FFD700',
    alignItems: 'center',
  },
  ojasButtonText: {
    color: '#E65100',
    fontSize: 16,
    fontWeight: '600',
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
  productRecommendationsSection: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginTop: 16,
    borderWidth: 2,
    borderColor: '#4CAF50',
  },
  productSectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  productSectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  productSectionSubtitle: {
    fontSize: 13,
    color: '#5D4037',
    marginBottom: 12,
  },
  shopMoreButton: {
    backgroundColor: '#E8F5E9',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignItems: 'center',
    marginTop: 12,
  },
  shopMoreText: {
    color: '#2E7D32',
    fontSize: 14,
    fontWeight: '600',
  },
});
