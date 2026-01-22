import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialCommunityIcons, Ionicons, Feather } from '@expo/vector-icons';
import { ManuscriptColors, ManuscriptFonts } from '../components/ManuscriptConstants';
import { getRoutineForDosha, DoshaRoutine } from '../data/dailyRoutines';

interface UserData {
  dominantDosha: string | null;
  doshaScores: { vata: number; pitta: number; kapha: number } | null;
  pulseAnalysis: any | null;
  skinAnalysis: any | null;
  eyeAnalysis: any | null;
  nailAnalysis: any | null;
  tongueAnalysis: any | null;
}

export default function PlanScreen() {
  const navigation = useNavigation<any>();
  const [userData, setUserData] = useState<UserData>({
    dominantDosha: null,
    doshaScores: null,
    pulseAnalysis: null,
    skinAnalysis: null,
    eyeAnalysis: null,
    nailAnalysis: null,
    tongueAnalysis: null,
  });
  const [activeTab, setActiveTab] = useState<'morning' | 'midday' | 'evening' | 'diet' | 'herbs'>('morning');
  const [routine, setRoutine] = useState<DoshaRoutine | null>(null);

  useFocusEffect(
    useCallback(() => {
      loadUserData();
    }, [])
  );

  const loadUserData = async () => {
    try {
      const [doshaResult, pulseData, skinData, eyeData, nailData, tongueData] = await Promise.all([
        AsyncStorage.getItem('doshaResult'),
        AsyncStorage.getItem('pulseAnalysis'),
        AsyncStorage.getItem('skinAnalysis'),
        AsyncStorage.getItem('eyeAnalysis'),
        AsyncStorage.getItem('nailAnalysis'),
        AsyncStorage.getItem('tongueAnalysis'),
      ]);

      let dominantDosha: string | null = null;
      let doshaScores: { vata: number; pitta: number; kapha: number } | null = null;

      // First check dosha assessment result
      if (doshaResult) {
        const parsed = JSON.parse(doshaResult);
        dominantDosha = parsed.dominant;
        doshaScores = { vata: parsed.vata, pitta: parsed.pitta, kapha: parsed.kapha };
      }

      // If no assessment, check pulse analysis
      if (!dominantDosha && pulseData) {
        const parsed = JSON.parse(pulseData);
        if (parsed.doshaAnalysis?.dominant) {
          dominantDosha = parsed.doshaAnalysis.dominant;
          doshaScores = {
            vata: parsed.doshaAnalysis.vataScore,
            pitta: parsed.doshaAnalysis.pittaScore,
            kapha: parsed.doshaAnalysis.kaphaScore,
          };
        }
      }

      // Check other analyses for dosha info
      if (!dominantDosha) {
        if (skinData) {
          const parsed = JSON.parse(skinData);
          if (parsed.dominantDosha) dominantDosha = parsed.dominantDosha;
        }
        if (!dominantDosha && eyeData) {
          const parsed = JSON.parse(eyeData);
          if (parsed.dominantDosha) dominantDosha = parsed.dominantDosha;
        }
        if (!dominantDosha && nailData) {
          const parsed = JSON.parse(nailData);
          if (parsed.dominantDosha) dominantDosha = parsed.dominantDosha;
        }
        if (!dominantDosha && tongueData) {
          const parsed = JSON.parse(tongueData);
          if (parsed.doshaIndication?.dominant) dominantDosha = parsed.doshaIndication.dominant;
        }
      }

      setUserData({
        dominantDosha,
        doshaScores,
        pulseAnalysis: pulseData ? JSON.parse(pulseData) : null,
        skinAnalysis: skinData ? JSON.parse(skinData) : null,
        eyeAnalysis: eyeData ? JSON.parse(eyeData) : null,
        nailAnalysis: nailData ? JSON.parse(nailData) : null,
        tongueAnalysis: tongueData ? JSON.parse(tongueData) : null,
      });

      if (dominantDosha) {
        const doshaRoutine = getRoutineForDosha(dominantDosha);
        if (doshaRoutine) setRoutine(doshaRoutine);
      }
    } catch (error) {
      console.log('Error loading user data:', error);
    }
  };

  const getDoshaColor = (dosha: string) => {
    switch (dosha?.toLowerCase()) {
      case 'vata': return '#60A5FA';
      case 'pitta': return '#EF4444';
      case 'kapha': return '#10B981';
      default: return ManuscriptColors.inkBrown;
    }
  };

  const getDoshaIcon = (dosha: string) => {
    switch (dosha?.toLowerCase()) {
      case 'vata': return 'weather-windy';
      case 'pitta': return 'fire';
      case 'kapha': return 'leaf';
      default: return 'help-circle';
    }
  };

  // No dosha data - prompt to take assessment
  if (!userData.dominantDosha) {
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <View style={styles.emptyState}>
          <View style={styles.emptyIconContainer}>
            <MaterialCommunityIcons name="clipboard-text-outline" size={48} color={ManuscriptColors.copperBrown} />
          </View>
          <Text style={styles.emptyTitle}>No Personalized Plan Yet</Text>
          <Text style={styles.emptyText}>
            Take the Dosha Assessment or complete a diagnostic scan to get your personalized daily routine based on ancient Ayurvedic wisdom.
          </Text>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => navigation.navigate('Home', { screen: 'Assessment' })}
          >
            <Text style={styles.primaryButtonText}>Take Dosha Assessment</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }

  if (!routine) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading your personalized plan...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header with Dosha Info */}
      <View style={styles.header}>
        <View style={[styles.doshaIconContainer, { backgroundColor: getDoshaColor(userData.dominantDosha) }]}>
          <MaterialCommunityIcons name={getDoshaIcon(userData.dominantDosha) as any} size={32} color="#FFFFFF" />
        </View>
        <View style={styles.headerText}>
          <Text style={styles.title}>Your {userData.dominantDosha} Daily Plan</Text>
          <Text style={styles.subtitle}>Personalized Ayurvedic routine</Text>
        </View>
      </View>

      {/* Dosha Overview */}
      <View style={[styles.overviewCard, { borderColor: getDoshaColor(userData.dominantDosha) }]}>
        <Text style={styles.overviewText}>{routine.overview}</Text>
      </View>

      {/* Dosha Scores if available */}
      {userData.doshaScores && (
        <View style={styles.doshaScoresCard}>
          <Text style={styles.scoresTitle}>Your Constitution</Text>
          <View style={styles.scoresRow}>
            <View style={styles.scoreItem}>
              <View style={[styles.scoreCircle, { backgroundColor: '#60A5FA' }]}>
                <Text style={styles.scoreValue}>{userData.doshaScores.vata}%</Text>
              </View>
              <Text style={styles.scoreLabel}>Vata</Text>
            </View>
            <View style={styles.scoreItem}>
              <View style={[styles.scoreCircle, { backgroundColor: '#EF4444' }]}>
                <Text style={styles.scoreValue}>{userData.doshaScores.pitta}%</Text>
              </View>
              <Text style={styles.scoreLabel}>Pitta</Text>
            </View>
            <View style={styles.scoreItem}>
              <View style={[styles.scoreCircle, { backgroundColor: '#10B981' }]}>
                <Text style={styles.scoreValue}>{userData.doshaScores.kapha}%</Text>
              </View>
              <Text style={styles.scoreLabel}>Kapha</Text>
            </View>
          </View>
        </View>
      )}

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {[
            { key: 'morning', label: 'Morning', icon: 'sunrise' },
            { key: 'midday', label: 'Midday', icon: 'sun' },
            { key: 'evening', label: 'Evening', icon: 'sunset' },
            { key: 'diet', label: 'Diet', icon: 'food-apple' },
            { key: 'herbs', label: 'Herbs', icon: 'leaf' },
          ].map((tab) => (
            <TouchableOpacity
              key={tab.key}
              style={[styles.tab, activeTab === tab.key && styles.tabActive]}
              onPress={() => setActiveTab(tab.key as any)}
            >
              {tab.icon === 'food-apple' || tab.icon === 'leaf' ? (
                <MaterialCommunityIcons
                  name={tab.icon as any}
                  size={18}
                  color={activeTab === tab.key ? '#FFFFFF' : ManuscriptColors.inkBrown}
                />
              ) : (
                <Feather
                  name={tab.icon as any}
                  size={18}
                  color={activeTab === tab.key ? '#FFFFFF' : ManuscriptColors.inkBrown}
                />
              )}
              <Text style={[styles.tabText, activeTab === tab.key && styles.tabTextActive]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Morning Routine */}
      {activeTab === 'morning' && (
        <View style={styles.routineSection}>
          <Text style={styles.sectionTitle}>Morning Routine (Before 10 AM)</Text>
          {routine.morningRoutine.map((slot, idx) => (
            <View key={idx} style={styles.timeSlotCard}>
              <View style={styles.timeSlotHeader}>
                <Text style={[styles.time, { color: getDoshaColor(userData.dominantDosha!) }]}>{slot.time}</Text>
                <Text style={styles.activity}>{slot.activity}</Text>
              </View>
              <Text style={styles.description}>{slot.description}</Text>
              {slot.tips && slot.tips.length > 0 && (
                <View style={styles.tipsContainer}>
                  {slot.tips.map((tip, tipIdx) => (
                    <View key={tipIdx} style={styles.tipRow}>
                      <Feather name="check" size={14} color={getDoshaColor(userData.dominantDosha!)} />
                      <Text style={styles.tipText}>{tip}</Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
          ))}
        </View>
      )}

      {/* Midday Routine */}
      {activeTab === 'midday' && (
        <View style={styles.routineSection}>
          <Text style={styles.sectionTitle}>Midday Routine (10 AM - 6 PM)</Text>
          {routine.middayRoutine.map((slot, idx) => (
            <View key={idx} style={styles.timeSlotCard}>
              <View style={styles.timeSlotHeader}>
                <Text style={[styles.time, { color: getDoshaColor(userData.dominantDosha!) }]}>{slot.time}</Text>
                <Text style={styles.activity}>{slot.activity}</Text>
              </View>
              <Text style={styles.description}>{slot.description}</Text>
              {slot.tips && slot.tips.length > 0 && (
                <View style={styles.tipsContainer}>
                  {slot.tips.map((tip, tipIdx) => (
                    <View key={tipIdx} style={styles.tipRow}>
                      <Feather name="check" size={14} color={getDoshaColor(userData.dominantDosha!)} />
                      <Text style={styles.tipText}>{tip}</Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
          ))}
        </View>
      )}

      {/* Evening Routine */}
      {activeTab === 'evening' && (
        <View style={styles.routineSection}>
          <Text style={styles.sectionTitle}>Evening Routine (After 6 PM)</Text>
          {routine.eveningRoutine.map((slot, idx) => (
            <View key={idx} style={styles.timeSlotCard}>
              <View style={styles.timeSlotHeader}>
                <Text style={[styles.time, { color: getDoshaColor(userData.dominantDosha!) }]}>{slot.time}</Text>
                <Text style={styles.activity}>{slot.activity}</Text>
              </View>
              <Text style={styles.description}>{slot.description}</Text>
              {slot.tips && slot.tips.length > 0 && (
                <View style={styles.tipsContainer}>
                  {slot.tips.map((tip, tipIdx) => (
                    <View key={tipIdx} style={styles.tipRow}>
                      <Feather name="check" size={14} color={getDoshaColor(userData.dominantDosha!)} />
                      <Text style={styles.tipText}>{tip}</Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
          ))}
        </View>
      )}

      {/* Diet Tab */}
      {activeTab === 'diet' && (
        <View style={styles.routineSection}>
          <Text style={styles.sectionTitle}>Diet for {userData.dominantDosha}</Text>

          {/* Foods to Favor & Reduce */}
          <View style={styles.foodGuideContainer}>
            {/* Foods to Favor */}
            <View style={[styles.foodGuideCard, { backgroundColor: '#E8F5E9', borderColor: '#81C784' }]}>
              <View style={styles.foodGuideHeader}>
                <Feather name="check-circle" size={20} color="#2E7D32" />
                <Text style={[styles.foodGuideTitle, { color: '#2E7D32' }]}>Foods to Favor</Text>
              </View>
              {routine.foodGuide.favor.map((food, idx) => (
                <View key={idx} style={styles.foodGuideRow}>
                  <Feather name="check" size={14} color="#4CAF50" />
                  <Text style={styles.foodGuideText}>{food}</Text>
                </View>
              ))}
            </View>

            {/* Foods to Reduce */}
            <View style={[styles.foodGuideCard, { backgroundColor: '#FFEBEE', borderColor: '#EF9A9A' }]}>
              <View style={styles.foodGuideHeader}>
                <Feather name="x-circle" size={20} color="#C62828" />
                <Text style={[styles.foodGuideTitle, { color: '#C62828' }]}>Foods to Reduce</Text>
              </View>
              {routine.foodGuide.reduce.map((food, idx) => (
                <View key={idx} style={styles.foodGuideRow}>
                  <Feather name="x" size={14} color="#EF5350" />
                  <Text style={styles.foodGuideText}>{food}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Best Spices */}
          <View style={styles.spicesCard}>
            <View style={styles.spicesHeader}>
              <MaterialCommunityIcons name="shimmer" size={20} color={getDoshaColor(userData.dominantDosha!)} />
              <Text style={styles.spicesTitle}>Best Spices for {userData.dominantDosha}</Text>
            </View>
            <View style={styles.spicesContainer}>
              {routine.foodGuide.spices.map((spice, idx) => (
                <View key={idx} style={[styles.spiceChip, { backgroundColor: getDoshaColor(userData.dominantDosha!) + '20' }]}>
                  <Text style={[styles.spiceText, { color: getDoshaColor(userData.dominantDosha!) }]}>{spice}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Meal-by-Meal Guide */}
          <Text style={[styles.sectionTitle, { marginTop: 20 }]}>Meal-by-Meal Guide</Text>

          {routine.meals.map((meal, idx) => (
            <View key={idx} style={styles.mealCard}>
              <View style={styles.mealHeader}>
                <MaterialCommunityIcons
                  name={meal.meal === 'Breakfast' ? 'food-croissant' : meal.meal === 'Lunch' ? 'food' : 'food-variant'}
                  size={24}
                  color={getDoshaColor(userData.dominantDosha!)}
                />
                <View style={styles.mealHeaderText}>
                  <Text style={styles.mealTitle}>{meal.meal}</Text>
                  <Text style={styles.mealTime}>{meal.time}</Text>
                </View>
              </View>

              <Text style={styles.dietSubheading}>Recommended:</Text>
              {meal.recommendations.map((rec, recIdx) => (
                <View key={recIdx} style={styles.dietRow}>
                  <Feather name="check-circle" size={14} color="#10B981" />
                  <Text style={styles.dietText}>{rec}</Text>
                </View>
              ))}

              <Text style={[styles.dietSubheading, { color: '#EF4444', marginTop: 12 }]}>Avoid:</Text>
              {meal.avoid.map((item, avoidIdx) => (
                <View key={avoidIdx} style={styles.dietRow}>
                  <Feather name="x-circle" size={14} color="#EF4444" />
                  <Text style={styles.dietText}>{item}</Text>
                </View>
              ))}
            </View>
          ))}

          {/* Exercise Section */}
          <View style={styles.exerciseCard}>
            <View style={styles.exerciseHeader}>
              <MaterialCommunityIcons name="run" size={24} color={getDoshaColor(userData.dominantDosha!)} />
              <Text style={styles.exerciseTitle}>Exercise for {userData.dominantDosha}</Text>
            </View>
            <Text style={styles.exerciseType}>{routine.exercise.type}</Text>
            <Text style={styles.exerciseDetail}>Duration: {routine.exercise.duration}</Text>
            <Text style={styles.exerciseDetail}>Best Time: {routine.exercise.bestTime}</Text>

            <Text style={styles.dietSubheading}>Recommended Activities:</Text>
            {routine.exercise.activities.map((activity, idx) => (
              <View key={idx} style={styles.dietRow}>
                <Feather name="check" size={14} color="#10B981" />
                <Text style={styles.dietText}>{activity}</Text>
              </View>
            ))}

            <Text style={[styles.dietSubheading, { color: '#EF4444', marginTop: 8 }]}>Avoid:</Text>
            {routine.exercise.avoid.map((item, idx) => (
              <View key={idx} style={styles.dietRow}>
                <Feather name="x" size={14} color="#EF4444" />
                <Text style={styles.dietText}>{item}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Herbs Tab */}
      {activeTab === 'herbs' && (
        <View style={styles.routineSection}>
          <Text style={styles.sectionTitle}>Herbs for {userData.dominantDosha}</Text>

          {routine.herbs.map((herb, idx) => (
            <View key={idx} style={styles.herbCard}>
              <View style={styles.herbHeader}>
                <MaterialCommunityIcons name="leaf" size={24} color={getDoshaColor(userData.dominantDosha!)} />
                <Text style={styles.herbName}>{herb.herb}</Text>
              </View>
              <View style={styles.herbDetails}>
                <View style={styles.herbRow}>
                  <Text style={styles.herbLabel}>Dosage:</Text>
                  <Text style={styles.herbValue}>{herb.dosage}</Text>
                </View>
                <View style={styles.herbRow}>
                  <Text style={styles.herbLabel}>When:</Text>
                  <Text style={styles.herbValue}>{herb.timing}</Text>
                </View>
                <View style={styles.herbRow}>
                  <Text style={styles.herbLabel}>Benefit:</Text>
                  <Text style={styles.herbValue}>{herb.benefit}</Text>
                </View>
              </View>
            </View>
          ))}

          {/* Self-Care Section */}
          <View style={styles.selfCareCard}>
            <Text style={styles.selfCareTitle}>Self-Care Essentials</Text>
            {routine.selfCare.map((item, idx) => (
              <View key={idx} style={styles.selfCareRow}>
                <Feather name="heart" size={14} color={getDoshaColor(userData.dominantDosha!)} />
                <Text style={styles.selfCareText}>{item}</Text>
              </View>
            ))}
          </View>

          {/* Things to Avoid */}
          <View style={styles.avoidCard}>
            <Text style={styles.avoidTitle}>Things to Avoid</Text>
            {routine.avoid.map((item, idx) => (
              <View key={idx} style={styles.avoidRow}>
                <Feather name="alert-circle" size={14} color="#EF4444" />
                <Text style={styles.avoidText}>{item}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Scan-Based Recommendations */}
      {(userData.pulseAnalysis || userData.skinAnalysis || userData.eyeAnalysis || userData.nailAnalysis || userData.tongueAnalysis) && (
        <View style={styles.scanSection}>
          <Text style={styles.sectionTitle}>Based on Your Scans</Text>

          {userData.pulseAnalysis?.doshaAnalysis?.recommendations && (
            <View style={styles.scanCard}>
              <View style={styles.scanHeader}>
                <MaterialCommunityIcons name="heart-pulse" size={20} color="#D32F2F" />
                <Text style={styles.scanTitle}>From Pulse Analysis</Text>
              </View>
              {userData.pulseAnalysis.doshaAnalysis.recommendations.slice(0, 3).map((rec: string, idx: number) => (
                <View key={idx} style={styles.scanRecRow}>
                  <Feather name="arrow-right" size={14} color={ManuscriptColors.inkBrown} />
                  <Text style={styles.scanRecText}>{rec}</Text>
                </View>
              ))}
            </View>
          )}

          {userData.skinAnalysis?.recommendations && (
            <View style={styles.scanCard}>
              <View style={styles.scanHeader}>
                <MaterialCommunityIcons name="face-woman-shimmer" size={20} color="#FF9800" />
                <Text style={styles.scanTitle}>From Skin Analysis</Text>
              </View>
              {userData.skinAnalysis.recommendations.slice(0, 3).map((rec: string, idx: number) => (
                <View key={idx} style={styles.scanRecRow}>
                  <Feather name="arrow-right" size={14} color={ManuscriptColors.inkBrown} />
                  <Text style={styles.scanRecText}>{rec}</Text>
                </View>
              ))}
            </View>
          )}

          {userData.eyeAnalysis?.recommendations && (
            <View style={styles.scanCard}>
              <View style={styles.scanHeader}>
                <Ionicons name="eye-outline" size={20} color="#1976D2" />
                <Text style={styles.scanTitle}>From Eye Analysis</Text>
              </View>
              {userData.eyeAnalysis.recommendations.slice(0, 3).map((rec: string, idx: number) => (
                <View key={idx} style={styles.scanRecRow}>
                  <Feather name="arrow-right" size={14} color={ManuscriptColors.inkBrown} />
                  <Text style={styles.scanRecText}>{rec}</Text>
                </View>
              ))}
            </View>
          )}

          {userData.nailAnalysis?.recommendations && (
            <View style={styles.scanCard}>
              <View style={styles.scanHeader}>
                <MaterialCommunityIcons name="hand-back-left-outline" size={20} color="#795548" />
                <Text style={styles.scanTitle}>From Nail Analysis</Text>
              </View>
              {userData.nailAnalysis.recommendations.slice(0, 3).map((rec: string, idx: number) => (
                <View key={idx} style={styles.scanRecRow}>
                  <Feather name="arrow-right" size={14} color={ManuscriptColors.inkBrown} />
                  <Text style={styles.scanRecText}>{rec}</Text>
                </View>
              ))}
            </View>
          )}

          {userData.tongueAnalysis?.recommendations && (
            <View style={styles.scanCard}>
              <View style={styles.scanHeader}>
                <MaterialCommunityIcons name="emoticon-tongue-outline" size={20} color="#E91E63" />
                <Text style={styles.scanTitle}>From Tongue Analysis</Text>
              </View>
              {userData.tongueAnalysis.recommendations.slice(0, 3).map((rec: string, idx: number) => (
                <View key={idx} style={styles.scanRecRow}>
                  <Feather name="arrow-right" size={14} color={ManuscriptColors.inkBrown} />
                  <Text style={styles.scanRecText}>{rec}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      )}

      <View style={styles.bottomPadding} />
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
  },
  loadingText: {
    textAlign: 'center',
    marginTop: 100,
    color: ManuscriptColors.fadedInk,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  doshaIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: ManuscriptColors.inkBlack,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: ManuscriptColors.fadedInk,
    fontStyle: 'italic',
  },
  overviewCard: {
    backgroundColor: ManuscriptColors.parchment,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 2,
    borderLeftWidth: 4,
  },
  overviewText: {
    fontSize: 14,
    color: ManuscriptColors.inkBrown,
    lineHeight: 22,
  },
  doshaScoresCard: {
    backgroundColor: ManuscriptColors.parchment,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: ManuscriptColors.copperBrown,
  },
  scoresTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: ManuscriptColors.inkBlack,
    marginBottom: 12,
    textAlign: 'center',
  },
  scoresRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  scoreItem: {
    alignItems: 'center',
  },
  scoreCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  scoreValue: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  scoreLabel: {
    fontSize: 13,
    color: ManuscriptColors.inkBrown,
    fontWeight: '500',
  },
  tabContainer: {
    marginBottom: 16,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: ManuscriptColors.parchment,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: ManuscriptColors.copperBrown,
  },
  tabActive: {
    backgroundColor: ManuscriptColors.vermillion,
    borderColor: ManuscriptColors.vermillion,
  },
  tabText: {
    marginLeft: 6,
    fontSize: 14,
    fontWeight: '600',
    color: ManuscriptColors.inkBrown,
  },
  tabTextActive: {
    color: '#FFFFFF',
  },
  routineSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: ManuscriptColors.inkBlack,
    marginBottom: 16,
  },
  timeSlotCard: {
    backgroundColor: ManuscriptColors.parchment,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: ManuscriptColors.copperBrown,
  },
  timeSlotHeader: {
    marginBottom: 8,
  },
  time: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  activity: {
    fontSize: 16,
    fontWeight: '600',
    color: ManuscriptColors.inkBlack,
  },
  description: {
    fontSize: 14,
    color: ManuscriptColors.inkBrown,
    marginBottom: 8,
  },
  tipsContainer: {
    backgroundColor: ManuscriptColors.oldPaper,
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
  },
  tipRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  tipText: {
    fontSize: 13,
    color: ManuscriptColors.inkBrown,
    marginLeft: 8,
    flex: 1,
  },
  mealCard: {
    backgroundColor: ManuscriptColors.parchment,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: ManuscriptColors.copperBrown,
  },
  mealHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  mealHeaderText: {
    marginLeft: 12,
  },
  mealTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: ManuscriptColors.inkBlack,
  },
  mealTime: {
    fontSize: 13,
    color: ManuscriptColors.fadedInk,
  },
  dietSubheading: {
    fontSize: 14,
    fontWeight: '600',
    color: '#10B981',
    marginBottom: 8,
  },
  dietRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  dietText: {
    fontSize: 13,
    color: ManuscriptColors.inkBrown,
    marginLeft: 8,
    flex: 1,
  },
  exerciseCard: {
    backgroundColor: ManuscriptColors.parchment,
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
    borderWidth: 1,
    borderColor: ManuscriptColors.copperBrown,
  },
  exerciseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  exerciseTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: ManuscriptColors.inkBlack,
    marginLeft: 12,
  },
  exerciseType: {
    fontSize: 16,
    fontWeight: '600',
    color: ManuscriptColors.inkBrown,
    marginBottom: 4,
  },
  exerciseDetail: {
    fontSize: 13,
    color: ManuscriptColors.fadedInk,
    marginBottom: 2,
  },
  herbCard: {
    backgroundColor: ManuscriptColors.parchment,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: ManuscriptColors.copperBrown,
  },
  herbHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  herbName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: ManuscriptColors.inkBlack,
    marginLeft: 12,
  },
  herbDetails: {
    backgroundColor: ManuscriptColors.oldPaper,
    borderRadius: 8,
    padding: 12,
  },
  herbRow: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  herbLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: ManuscriptColors.inkBrown,
    width: 60,
  },
  herbValue: {
    fontSize: 13,
    color: ManuscriptColors.inkBrown,
    flex: 1,
  },
  selfCareCard: {
    backgroundColor: '#E8F5E9',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#81C784',
  },
  selfCareTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 12,
  },
  selfCareRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  selfCareText: {
    fontSize: 13,
    color: ManuscriptColors.inkBrown,
    marginLeft: 10,
    flex: 1,
  },
  avoidCard: {
    backgroundColor: '#FFEBEE',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#EF9A9A',
  },
  avoidTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#C62828',
    marginBottom: 12,
  },
  avoidRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  avoidText: {
    fontSize: 13,
    color: ManuscriptColors.inkBrown,
    marginLeft: 10,
    flex: 1,
  },
  scanSection: {
    marginTop: 8,
  },
  scanCard: {
    backgroundColor: ManuscriptColors.parchment,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: ManuscriptColors.copperBrown,
  },
  scanHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  scanTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: ManuscriptColors.inkBlack,
    marginLeft: 10,
  },
  scanRecRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  scanRecText: {
    fontSize: 13,
    color: ManuscriptColors.inkBrown,
    marginLeft: 8,
    flex: 1,
  },
  bottomPadding: {
    height: 32,
  },
  foodGuideContainer: {
    marginBottom: 16,
  },
  foodGuideCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
  },
  foodGuideHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  foodGuideTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  foodGuideRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  foodGuideText: {
    fontSize: 14,
    color: ManuscriptColors.inkBrown,
    marginLeft: 10,
    flex: 1,
  },
  spicesCard: {
    backgroundColor: ManuscriptColors.parchment,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: ManuscriptColors.copperBrown,
  },
  spicesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  spicesTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: ManuscriptColors.inkBlack,
    marginLeft: 10,
  },
  spicesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  spiceChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  spiceText: {
    fontSize: 13,
    fontWeight: '600',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  emptyIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: ManuscriptColors.parchment,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 2,
    borderColor: ManuscriptColors.copperBrown,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: ManuscriptColors.inkBlack,
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 16,
    color: ManuscriptColors.inkBrown,
    textAlign: 'center',
    marginBottom: 24,
    paddingHorizontal: 40,
    lineHeight: 24,
  },
  primaryButton: {
    backgroundColor: ManuscriptColors.vermillion,
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 12,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
