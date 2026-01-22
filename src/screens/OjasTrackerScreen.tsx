import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialCommunityIcons, Ionicons, Feather } from '@expo/vector-icons';
import { ManuscriptColors, ManuscriptFonts } from '../components/ManuscriptConstants';

const { width } = Dimensions.get('window');

interface HabitData {
  sleep: boolean; // Good sleep (7-8 hours)
  earlyRise: boolean; // Woke before 6am
  meditation: boolean; // Practiced meditation/pranayama
  exercise: boolean; // Physical movement
  warmFood: boolean; // Ate warm, cooked meals
  noScreens: boolean; // No screens 1hr before bed
  waterIntake: boolean; // Adequate hydration
  stressManagement: boolean; // Low stress day
}

interface OjasData {
  score: number;
  date: string;
  habits: HabitData;
}

const STORAGE_KEY = '@nayaved_ojas_data';

export default function OjasTrackerScreen() {
  const [ojasScore, setOjasScore] = useState(50);
  const [habitScore, setHabitScore] = useState(0);
  const [skinOjasContribution, setSkinOjasContribution] = useState(0);
  const [habits, setHabits] = useState<HabitData>({
    sleep: false,
    earlyRise: false,
    meditation: false,
    exercise: false,
    warmFood: false,
    noScreens: false,
    waterIntake: false,
    stressManagement: false,
  });
  const [weeklyScores, setWeeklyScores] = useState<number[]>([]);
  const [showSaveMessage, setShowSaveMessage] = useState(false);

  const glowAnimation = useRef(new Animated.Value(0)).current;
  const pulseAnimation = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    loadTodayData();
    loadWeeklyData();
    startGlowAnimation();
  }, []);

  useEffect(() => {
    // Update glow intensity based on score
    startGlowAnimation();
  }, [ojasScore]);

  // Reload data when screen comes into focus (e.g., after returning from skin analysis)
  useFocusEffect(
    React.useCallback(() => {
      loadTodayData();
      loadWeeklyData();
    }, [])
  );

  const startGlowAnimation = () => {
    const intensity = ojasScore / 100;

    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnimation, {
          toValue: intensity,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(glowAnimation, {
          toValue: intensity * 0.7,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnimation, {
          toValue: 1.05,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnimation, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const loadTodayData = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const stored = await AsyncStorage.getItem(`${STORAGE_KEY}_${today}`);
      if (stored) {
        const data: any = JSON.parse(stored);
        setHabits(data.habits);

        // Calculate habit score
        const habScore = calculateOjasScore(data.habits);
        setHabitScore(habScore);

        // Get skin contribution if exists
        const skinContribution = data.skinOjasContribution || 0;
        setSkinOjasContribution(skinContribution);

        // Total score
        setOjasScore(habScore + skinContribution);
      }
    } catch (error) {
      console.log('Error loading today data:', error);
    }
  };

  const loadWeeklyData = async () => {
    try {
      const scores: number[] = [];
      const today = new Date();

      for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];

        const stored = await AsyncStorage.getItem(`${STORAGE_KEY}_${dateStr}`);
        if (stored) {
          const data: OjasData = JSON.parse(stored);
          scores.push(data.score);
        } else {
          scores.push(50); // Default score if no data
        }
      }

      setWeeklyScores(scores);
    } catch (error) {
      console.log('Error loading weekly data:', error);
    }
  };

  const calculateOjasScore = (habitData: HabitData): number => {
    let score = 0;

    // Each habit contributes to Ojas
    if (habitData.sleep) score += 15; // Sleep is most important
    if (habitData.earlyRise) score += 12; // Brahma muhurta (pre-dawn)
    if (habitData.meditation) score += 13; // Mental clarity
    if (habitData.exercise) score += 12; // Physical vitality
    if (habitData.warmFood) score += 12; // Digestive fire
    if (habitData.noScreens) score += 10; // Sensory rest
    if (habitData.waterIntake) score += 10; // Hydration
    if (habitData.stressManagement) score += 16; // Emotional balance

    return score;
  };

  const toggleHabit = async (habit: keyof HabitData) => {
    const newHabits = { ...habits, [habit]: !habits[habit] };
    setHabits(newHabits);

    const newHabitScore = calculateOjasScore(newHabits);
    setHabitScore(newHabitScore);

    const totalScore = newHabitScore + skinOjasContribution;
    setOjasScore(totalScore);

    // Auto-save
    await saveTodayData(totalScore, newHabits);
  };

  const saveTodayData = async (score: number, habitData: HabitData) => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const data: any = {
        score,
        date: today,
        habits: habitData,
        skinOjasContribution: skinOjasContribution, // Preserve skin contribution
      };

      await AsyncStorage.setItem(`${STORAGE_KEY}_${today}`, JSON.stringify(data));

      // Reload weekly data to update chart
      await loadWeeklyData();

      // Show save confirmation
      setShowSaveMessage(true);
      setTimeout(() => setShowSaveMessage(false), 2000);
    } catch (error) {
      console.log('Error saving data:', error);
    }
  };

  const getOjasLevel = (score: number): string => {
    if (score >= 90) return 'Radiant';
    if (score >= 75) return 'Strong';
    if (score >= 60) return 'Balanced';
    if (score >= 45) return 'Moderate';
    if (score >= 30) return 'Low';
    return 'Depleted';
  };

  const getOjasColor = (score: number): string => {
    if (score >= 75) return '#FFD700'; // Gold
    if (score >= 60) return '#FFA500'; // Orange
    if (score >= 45) return '#FFD966'; // Yellow
    if (score >= 30) return '#E6B800'; // Dark yellow
    return '#CC9900'; // Darker
  };

  const getOjasIcon = (score: number): string => {
    if (score >= 90) return 'star-four-points';
    if (score >= 75) return 'star';
    if (score >= 60) return 'star-half-full';
    if (score >= 45) return 'star-outline';
    if (score >= 30) return 'weather-night';
    return 'moon-new';
  };

  const glowOpacity = glowAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0.2, 0.8],
  });

  const glowScale = glowAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.3],
  });

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerIconRow}>
          <MaterialCommunityIcons name="shimmer" size={32} color="#E65100" />
          <Text style={styles.title}> Ojas Glow Tracker</Text>
        </View>
        <Text style={styles.subtitle}>
          Track your vitality - the essence of life force
        </Text>
      </View>

      {/* Ojas Avatar with Glow */}
      <View style={styles.avatarSection}>
        <View style={styles.avatarContainer}>
          {/* Animated Glow Rings */}
          <Animated.View
            style={[
              styles.glowOuter,
              {
                opacity: glowOpacity,
                transform: [{ scale: glowScale }],
                backgroundColor: getOjasColor(ojasScore),
              },
            ]}
          />
          <Animated.View
            style={[
              styles.glowMiddle,
              {
                opacity: glowOpacity,
                transform: [{ scale: pulseAnimation }],
                backgroundColor: getOjasColor(ojasScore),
              },
            ]}
          />
          <Animated.View
            style={[
              styles.glowInner,
              {
                opacity: 0.9,
                backgroundColor: getOjasColor(ojasScore),
              },
            ]}
          />

          {/* Avatar */}
          <View style={styles.avatar}>
            <MaterialCommunityIcons name="meditation" size={56} color="#FFD700" />
          </View>
        </View>

        {/* Score Display */}
        <View style={styles.scoreContainer}>
          <Text style={styles.scoreLabel}>Ojas Level</Text>
          <Text style={styles.scoreValue}>{ojasScore}</Text>
          <View style={styles.scoreLevelRow}>
            <MaterialCommunityIcons name={getOjasIcon(ojasScore) as any} size={22} color="#E65100" />
            <Text style={styles.scoreLevel}> {getOjasLevel(ojasScore)}</Text>
          </View>
        </View>
      </View>

      {/* Ojas Breakdown */}
      <View style={styles.breakdownCard}>
        <View style={styles.breakdownTitleRow}>
          <Ionicons name="stats-chart" size={20} color="#3E2723" />
          <Text style={styles.breakdownTitle}> Ojas Score Breakdown</Text>
        </View>
        <View style={styles.breakdownRow}>
          <View style={styles.breakdownLabelRow}>
            <MaterialCommunityIcons name="arm-flex" size={18} color="#5D4037" />
            <Text style={styles.breakdownLabel}> From Daily Habits:</Text>
          </View>
          <Text style={styles.breakdownValue}>{habitScore} pts</Text>
        </View>
        {skinOjasContribution > 0 && (
          <View style={styles.breakdownRow}>
            <View style={styles.breakdownLabelRow}>
              <MaterialCommunityIcons name="shimmer" size={18} color="#FFB74D" />
              <Text style={styles.breakdownLabel}> From Facial Glow:</Text>
            </View>
            <Text style={styles.breakdownValueHighlight}>+{skinOjasContribution} pts</Text>
          </View>
        )}
        {skinOjasContribution === 0 && (
          <View style={styles.breakdownRowEmpty}>
            <View style={styles.breakdownLabelRow}>
              <MaterialCommunityIcons name="shimmer" size={18} color="#9E9E9E" />
              <Text style={styles.breakdownLabelEmpty}> Facial Glow Scan:</Text>
            </View>
            <Text style={styles.breakdownValueEmpty}>Not done today</Text>
          </View>
        )}
        <View style={styles.breakdownDivider} />
        <View style={styles.breakdownRow}>
          <Text style={styles.breakdownLabelTotal}>Total Ojas:</Text>
          <Text style={styles.breakdownValueTotal}>{ojasScore} pts</Text>
        </View>
      </View>

      {/* Save Message */}
      {showSaveMessage && (
        <View style={styles.saveMessage}>
          <View style={styles.saveMessageContent}>
            <Feather name="check" size={18} color="#FFFFFF" />
            <Text style={styles.saveMessageText}> Progress saved!</Text>
          </View>
        </View>
      )}

      {/* What is Ojas */}
      <View style={styles.educationCard}>
        <View style={styles.educationTitleRow}>
          <MaterialCommunityIcons name="diamond-stone" size={20} color="#B87333" />
          <Text style={styles.educationTitle}> What is Ojas?</Text>
        </View>
        <Text style={styles.educationText}>
          Ojas is the subtle essence of all bodily tissues - your vital reserve of
          immunity, strength, and radiance. It's what makes your skin glow, your eyes
          sparkle, and your presence magnetic.
        </Text>
        <Text style={styles.educationText}>
          When Ojas is strong, you feel resilient, joyful, and vibrant. When depleted,
          you feel tired, anxious, and prone to illness.
        </Text>
      </View>

      {/* Daily Habits Tracker */}
      <View style={styles.habitsSection}>
        <Text style={styles.sectionTitle}>Today's Ojas-Building Habits</Text>
        <Text style={styles.sectionSubtitle}>
          Check off what you've done today
        </Text>

        {/* Sleep */}
        <TouchableOpacity
          style={[styles.habitCard, habits.sleep && styles.habitCardChecked]}
          onPress={() => toggleHabit('sleep')}
        >
          <View style={styles.habitHeader}>
            <View style={[styles.habitIconContainer, { backgroundColor: '#E3F2FD' }]}>
              <Ionicons name="moon" size={24} color="#1976D2" />
            </View>
            <View style={styles.habitText}>
              <Text style={styles.habitTitle}>Quality Sleep (7-8 hours)</Text>
              <Text style={styles.habitPoints}>+15 Ojas</Text>
            </View>
            <View style={[styles.checkbox, habits.sleep && styles.checkboxChecked]}>
              {habits.sleep && <Text style={styles.checkmark}>✓</Text>}
            </View>
          </View>
          <Text style={styles.habitDescription}>
            Sleep is the foundation of Ojas. It rebuilds tissues and restores vitality.
          </Text>
        </TouchableOpacity>

        {/* Early Rise */}
        <TouchableOpacity
          style={[styles.habitCard, habits.earlyRise && styles.habitCardChecked]}
          onPress={() => toggleHabit('earlyRise')}
        >
          <View style={styles.habitHeader}>
            <View style={[styles.habitIconContainer, { backgroundColor: '#FFF3E0' }]}>
              <Ionicons name="sunny" size={24} color="#FF9800" />
            </View>
            <View style={styles.habitText}>
              <Text style={styles.habitTitle}>Woke Before 6am</Text>
              <Text style={styles.habitPoints}>+12 Ojas</Text>
            </View>
            <View style={[styles.checkbox, habits.earlyRise && styles.checkboxChecked]}>
              {habits.earlyRise && <Text style={styles.checkmark}>✓</Text>}
            </View>
          </View>
          <Text style={styles.habitDescription}>
            Brahma muhurta (pre-dawn) is the most sattvic time for spiritual practice.
          </Text>
        </TouchableOpacity>

        {/* Meditation */}
        <TouchableOpacity
          style={[styles.habitCard, habits.meditation && styles.habitCardChecked]}
          onPress={() => toggleHabit('meditation')}
        >
          <View style={styles.habitHeader}>
            <View style={[styles.habitIconContainer, { backgroundColor: '#F3E5F5' }]}>
              <MaterialCommunityIcons name="meditation" size={24} color="#9C27B0" />
            </View>
            <View style={styles.habitText}>
              <Text style={styles.habitTitle}>Meditation/Pranayama</Text>
              <Text style={styles.habitPoints}>+13 Ojas</Text>
            </View>
            <View style={[styles.checkbox, habits.meditation && styles.checkboxChecked]}>
              {habits.meditation && <Text style={styles.checkmark}>✓</Text>}
            </View>
          </View>
          <Text style={styles.habitDescription}>
            Calms the mind, reduces stress, and directly builds Ojas.
          </Text>
        </TouchableOpacity>

        {/* Exercise */}
        <TouchableOpacity
          style={[styles.habitCard, habits.exercise && styles.habitCardChecked]}
          onPress={() => toggleHabit('exercise')}
        >
          <View style={styles.habitHeader}>
            <View style={[styles.habitIconContainer, { backgroundColor: '#E8F5E9' }]}>
              <MaterialCommunityIcons name="run" size={24} color="#4CAF50" />
            </View>
            <View style={styles.habitText}>
              <Text style={styles.habitTitle}>Physical Exercise</Text>
              <Text style={styles.habitPoints}>+12 Ojas</Text>
            </View>
            <View style={[styles.checkbox, habits.exercise && styles.checkboxChecked]}>
              {habits.exercise && <Text style={styles.checkmark}>✓</Text>}
            </View>
          </View>
          <Text style={styles.habitDescription}>
            Moderate exercise (not excessive) strengthens all tissues and Agni.
          </Text>
        </TouchableOpacity>

        {/* Warm Food */}
        <TouchableOpacity
          style={[styles.habitCard, habits.warmFood && styles.habitCardChecked]}
          onPress={() => toggleHabit('warmFood')}
        >
          <View style={styles.habitHeader}>
            <View style={[styles.habitIconContainer, { backgroundColor: '#FFEBEE' }]}>
              <MaterialCommunityIcons name="food-variant" size={24} color="#D32F2F" />
            </View>
            <View style={styles.habitText}>
              <Text style={styles.habitTitle}>Warm, Cooked Meals</Text>
              <Text style={styles.habitPoints}>+12 Ojas</Text>
            </View>
            <View style={[styles.checkbox, habits.warmFood && styles.checkboxChecked]}>
              {habits.warmFood && <Text style={styles.checkmark}>✓</Text>}
            </View>
          </View>
          <Text style={styles.habitDescription}>
            Warm, nourishing foods support Agni and produce high-quality tissues.
          </Text>
        </TouchableOpacity>

        {/* No Screens */}
        <TouchableOpacity
          style={[styles.habitCard, habits.noScreens && styles.habitCardChecked]}
          onPress={() => toggleHabit('noScreens')}
        >
          <View style={styles.habitHeader}>
            <View style={[styles.habitIconContainer, { backgroundColor: '#E0E0E0' }]}>
              <MaterialCommunityIcons name="cellphone-off" size={24} color="#5D4037" />
            </View>
            <View style={styles.habitText}>
              <Text style={styles.habitTitle}>No Screens 1hr Before Bed</Text>
              <Text style={styles.habitPoints}>+10 Ojas</Text>
            </View>
            <View style={[styles.checkbox, habits.noScreens && styles.checkboxChecked]}>
              {habits.noScreens && <Text style={styles.checkmark}>✓</Text>}
            </View>
          </View>
          <Text style={styles.habitDescription}>
            Reduces sensory overload (atiyoga) and improves sleep quality.
          </Text>
        </TouchableOpacity>

        {/* Water */}
        <TouchableOpacity
          style={[styles.habitCard, habits.waterIntake && styles.habitCardChecked]}
          onPress={() => toggleHabit('waterIntake')}
        >
          <View style={styles.habitHeader}>
            <View style={[styles.habitIconContainer, { backgroundColor: '#E3F2FD' }]}>
              <Ionicons name="water" size={24} color="#2196F3" />
            </View>
            <View style={styles.habitText}>
              <Text style={styles.habitTitle}>Adequate Hydration</Text>
              <Text style={styles.habitPoints}>+10 Ojas</Text>
            </View>
            <View style={[styles.checkbox, habits.waterIntake && styles.checkboxChecked]}>
              {habits.waterIntake && <Text style={styles.checkmark}>✓</Text>}
            </View>
          </View>
          <Text style={styles.habitDescription}>
            Water supports all channels (srotas) and tissue health (dhatus).
          </Text>
        </TouchableOpacity>

        {/* Stress Management */}
        <TouchableOpacity
          style={[styles.habitCard, habits.stressManagement && styles.habitCardChecked]}
          onPress={() => toggleHabit('stressManagement')}
        >
          <View style={styles.habitHeader}>
            <View style={[styles.habitIconContainer, { backgroundColor: '#FFF3E0' }]}>
              <MaterialCommunityIcons name="spa" size={24} color="#FF9800" />
            </View>
            <View style={styles.habitText}>
              <Text style={styles.habitTitle}>Low Stress Day</Text>
              <Text style={styles.habitPoints}>+16 Ojas</Text>
            </View>
            <View style={[styles.checkbox, habits.stressManagement && styles.checkboxChecked]}>
              {habits.stressManagement && <Text style={styles.checkmark}>✓</Text>}
            </View>
          </View>
          <Text style={styles.habitDescription}>
            Chronic stress is the #1 Ojas depleter. Manage stress through rest and joy.
          </Text>
        </TouchableOpacity>
      </View>

      {/* Weekly Progress */}
      <View style={styles.progressSection}>
        <Text style={styles.sectionTitle}>7-Day Ojas Trend</Text>
        <View style={styles.chart}>
          {weeklyScores.map((score, index) => {
            const barHeight = (score / 100) * 150;
            const barColor = getOjasColor(score);
            const date = new Date();
            date.setDate(date.getDate() - (6 - index));
            const dayLabel = date.toLocaleDateString('en-US', { weekday: 'short' });

            return (
              <View key={index} style={styles.barContainer}>
                <View style={styles.barWrapper}>
                  <View
                    style={[
                      styles.bar,
                      {
                        height: barHeight,
                        backgroundColor: barColor,
                      },
                    ]}
                  />
                </View>
                <Text style={styles.barLabel}>{dayLabel}</Text>
                <Text style={styles.barScore}>{score}</Text>
              </View>
            );
          })}
        </View>
      </View>

      {/* Ojas Builders */}
      <View style={styles.buildersCard}>
        <View style={styles.buildersTitleRow}>
          <MaterialCommunityIcons name="leaf" size={20} color="#2E7D32" />
          <Text style={styles.buildersTitle}> Ojas-Building Foods & Herbs</Text>
        </View>
        <Text style={styles.builderItem}>• Ghee (clarified butter)</Text>
        <Text style={styles.builderItem}>• Raw milk (if digestion is strong)</Text>
        <Text style={styles.builderItem}>• Almonds (soaked overnight)</Text>
        <Text style={styles.builderItem}>• Dates and raisins</Text>
        <Text style={styles.builderItem}>• Sweet, ripe fruits</Text>
        <Text style={styles.builderItem}>• Ashwagandha, Shatavari herbs</Text>
        <Text style={styles.builderItem}>• Warm spices: cardamom, saffron</Text>
      </View>

      {/* Ojas Depleters */}
      <View style={styles.depletersCard}>
        <View style={styles.depletersTitleRow}>
          <Ionicons name="warning" size={20} color="#C62828" />
          <Text style={styles.depletersTitle}> Ojas Depleters to Avoid</Text>
        </View>
        <Text style={styles.depleterItem}>• Chronic stress and overwork</Text>
        <Text style={styles.depleterItem}>• Poor sleep or irregular sleep</Text>
        <Text style={styles.depleterItem}>• Excessive screen time</Text>
        <Text style={styles.depleterItem}>• Processed, cold, stale foods</Text>
        <Text style={styles.depleterItem}>• Alcohol and stimulants</Text>
        <Text style={styles.depleterItem}>• Negative emotions: fear, anger, grief</Text>
      </View>

      {/* Manuscript Quote */}
      <View style={styles.manuscriptCard}>
        <Text style={styles.manuscriptQuote}>
          "Ojas is the essence of all seven dhatus (tissues). When Ojas is abundant, one
          has strong immunity, clear senses, steady mind, and radiant complexion. When
          depleted, one becomes fearful, weak, worried, and prone to disease."
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
  avatarSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatarContainer: {
    width: 200,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  glowOuter: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    opacity: 0.3,
  },
  glowMiddle: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
    opacity: 0.5,
  },
  glowInner: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    opacity: 0.7,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFD700',
    zIndex: 10,
  },
  avatarEmoji: {
    fontSize: 60,
  },
  scoreContainer: {
    alignItems: 'center',
  },
  scoreLabel: {
    fontSize: 16,
    color: '#5D4037',
    marginBottom: 4,
  },
  scoreValue: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#E65100',
    marginBottom: 4,
  },
  scoreLevelRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scoreLevel: {
    fontSize: 20,
    fontWeight: '600',
    color: '#3E2723',
  },
  saveMessage: {
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    alignItems: 'center',
  },
  saveMessageContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  saveMessageText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  breakdownCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    borderWidth: 2,
    borderColor: '#FFD700',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  breakdownTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  breakdownTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#3E2723',
  },
  breakdownLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  breakdownLabel: {
    fontSize: 14,
    color: '#5D4037',
    fontWeight: '500',
  },
  breakdownValue: {
    fontSize: 16,
    color: '#6B8E23',
    fontWeight: 'bold',
  },
  breakdownValueHighlight: {
    fontSize: 16,
    color: '#FFB74D',
    fontWeight: 'bold',
  },
  breakdownRowEmpty: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    opacity: 0.5,
  },
  breakdownLabelEmpty: {
    fontSize: 14,
    color: '#9E9E9E',
    fontWeight: '500',
    fontStyle: 'italic',
  },
  breakdownValueEmpty: {
    fontSize: 14,
    color: '#9E9E9E',
    fontStyle: 'italic',
  },
  breakdownDivider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 12,
  },
  breakdownLabelTotal: {
    fontSize: 16,
    color: '#3E2723',
    fontWeight: 'bold',
  },
  breakdownValueTotal: {
    fontSize: 20,
    color: '#FFD700',
    fontWeight: 'bold',
  },
  educationCard: {
    backgroundColor: '#FFF9E6',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    borderWidth: 2,
    borderColor: '#FFD700',
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
    marginBottom: 8,
  },
  habitsSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#3E2723',
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#5D4037',
    marginBottom: 16,
  },
  habitCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#E0E0E0',
  },
  habitCardChecked: {
    borderColor: '#4CAF50',
    backgroundColor: '#F1F8F4',
  },
  habitHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  habitIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  habitText: {
    flex: 1,
  },
  habitTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3E2723',
    marginBottom: 2,
  },
  habitPoints: {
    fontSize: 12,
    color: '#FFD700',
    fontWeight: 'bold',
  },
  checkbox: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#D0D0D0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  habitDescription: {
    fontSize: 13,
    color: '#5D4037',
    lineHeight: 18,
    fontStyle: 'italic',
  },
  progressSection: {
    marginBottom: 24,
  },
  chart: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 200,
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#D7CCC8',
  },
  barContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  barWrapper: {
    height: 150,
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: 8,
  },
  bar: {
    width: 30,
    borderRadius: 4,
    minHeight: 10,
  },
  barLabel: {
    fontSize: 11,
    color: '#5D4037',
    marginTop: 4,
  },
  barScore: {
    fontSize: 10,
    color: '#9E9E9E',
    marginTop: 2,
  },
  buildersCard: {
    backgroundColor: '#E8F5E9',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#4CAF50',
  },
  buildersTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  buildersTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  builderItem: {
    fontSize: 14,
    color: '#3E2723',
    marginBottom: 6,
    paddingLeft: 8,
  },
  depletersCard: {
    backgroundColor: '#FFEBEE',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    borderWidth: 2,
    borderColor: '#EF5350',
  },
  depletersTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  depletersTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#C62828',
  },
  depleterItem: {
    fontSize: 14,
    color: '#3E2723',
    marginBottom: 6,
    paddingLeft: 8,
  },
  manuscriptCard: {
    backgroundColor: '#F5E6D3',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#D4A574',
  },
  manuscriptQuote: {
    fontSize: 13,
    color: '#5D4037',
    fontStyle: 'italic',
    lineHeight: 20,
    marginBottom: 8,
  },
  manuscriptSource: {
    fontSize: 12,
    color: '#B87333',
    fontStyle: 'italic',
    textAlign: 'right',
  },
});
