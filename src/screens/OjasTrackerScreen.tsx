import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Dimensions,
  Image,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialCommunityIcons, Ionicons, Feather } from '@expo/vector-icons';
import { ManuscriptColors, ManuscriptFonts } from '../components/ManuscriptConstants';
import ViewShot from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';

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
const CUMULATIVE_STORAGE_KEY = '@nayaved_ojas_cumulative';

// Scan contributions interface
interface ScanContributions {
  tongue: number;
  eye: number;
  skin: number;
  nail: number;
  pulse: number;
}

// Cumulative Ojas data
interface CumulativeOjasData {
  totalScore: number;
  streakDays: number;
  lastActiveDate: string;
  totalHabitsCompleted: number;
  totalScansCompleted: number;
}

export default function OjasTrackerScreen() {
  const [ojasScore, setOjasScore] = useState(0); // Cumulative total
  const [todayScore, setTodayScore] = useState(0); // Today's contribution
  const [habitScore, setHabitScore] = useState(0);
  const [skinOjasContribution, setSkinOjasContribution] = useState(0); // Keep for backwards compatibility
  const [scanContributions, setScanContributions] = useState<ScanContributions>({
    tongue: 0,
    eye: 0,
    skin: 0,
    nail: 0,
    pulse: 0,
  });
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
  const [streakDays, setStreakDays] = useState(0);
  const [showJourney, setShowJourney] = useState(false);
  const [showBuilders, setShowBuilders] = useState(false);
  const [showDepleters, setShowDepleters] = useState(false);
  const [showBreakdown, setShowBreakdown] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);

  const glowAnimation = useRef(new Animated.Value(0)).current;
  const pulseAnimation = useRef(new Animated.Value(1)).current;
  const shareCardRef = useRef<ViewShot>(null);

  // Define functions first (before useEffect hooks that use them)
  const startGlowAnimation = React.useCallback(() => {
    const intensity = getGlowIntensity(ojasScore); // Glow based on level

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
  }, [ojasScore, glowAnimation, pulseAnimation]);

  const loadCumulativeData = React.useCallback(async () => {
    try {
      const stored = await AsyncStorage.getItem(CUMULATIVE_STORAGE_KEY);
      if (stored) {
        const data: CumulativeOjasData = JSON.parse(stored);
        setOjasScore(data.totalScore);
        setStreakDays(data.streakDays);
      } else {
        // Initialize cumulative data from existing daily data (migration)
        const today = new Date().toISOString().split('T')[0];
        const todayData = await AsyncStorage.getItem(`${STORAGE_KEY}_${today}`);
        if (todayData) {
          const data = JSON.parse(todayData);
          const initialScore = data.score || 0;
          if (initialScore > 0) {
            // Initialize cumulative with today's score
            const cumulativeData: CumulativeOjasData = {
              totalScore: initialScore,
              streakDays: 1,
              lastActiveDate: today,
              totalHabitsCompleted: Object.values(data.habits || {}).filter(Boolean).length,
              totalScansCompleted: Object.values(data.scanContributions || {}).filter((v) => typeof v === 'number' && v > 0).length,
            };
            await AsyncStorage.setItem(CUMULATIVE_STORAGE_KEY, JSON.stringify(cumulativeData));
            setOjasScore(initialScore);
            setStreakDays(1);
            console.log('Initialized cumulative Ojas from daily data:', initialScore);
          }
        }
      }
    } catch (error) {
      console.log('Error loading cumulative data:', error);
    }
  }, []);

  const loadTodayData = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const stored = await AsyncStorage.getItem(`${STORAGE_KEY}_${today}`);
      if (stored) {
        const data: any = JSON.parse(stored);
        setHabits(data.habits || {});

        // Calculate habit score
        const habScore = calculateOjasScore(data.habits || {});
        setHabitScore(habScore);

        // Get scan contributions (with backwards compatibility for skinOjasContribution)
        const contributions: ScanContributions = {
          tongue: data.scanContributions?.tongue || 0,
          eye: data.scanContributions?.eye || 0,
          skin: data.scanContributions?.skin || data.skinOjasContribution || 0,
          nail: data.scanContributions?.nail || 0,
          pulse: data.scanContributions?.pulse || 0,
        };
        setScanContributions(contributions);
        setSkinOjasContribution(contributions.skin); // Keep for backwards compatibility

        // Total scan contribution
        const totalScanContribution = contributions.tongue + contributions.eye +
          contributions.skin + contributions.nail + contributions.pulse;

        // Today's score (for display)
        const todayTotal = habScore + totalScanContribution;
        setTodayScore(todayTotal);
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
          scores.push(0); // No activity on this day
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

  const getTotalScanContribution = () => {
    return scanContributions.tongue + scanContributions.eye +
      scanContributions.skin + scanContributions.nail + scanContributions.pulse;
  };

  const toggleHabit = async (habit: keyof HabitData) => {
    const wasChecked = habits[habit];
    const newHabits = { ...habits, [habit]: !wasChecked };
    setHabits(newHabits);

    const oldHabitScore = habitScore;
    const newHabitScore = calculateOjasScore(newHabits);
    setHabitScore(newHabitScore);

    const totalScanContribution = getTotalScanContribution();
    const newTodayScore = newHabitScore + totalScanContribution;
    setTodayScore(newTodayScore);

    // Calculate delta for cumulative score
    const delta = newHabitScore - oldHabitScore;
    const newCumulativeScore = ojasScore + delta;
    setOjasScore(newCumulativeScore);

    // Auto-save both daily and cumulative
    await saveTodayData(newTodayScore, newHabits);
    await saveCumulativeData(newCumulativeScore);
  };

  const saveTodayData = async (score: number, habitData: HabitData) => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const data: any = {
        score,
        date: today,
        habits: habitData,
        scanContributions: scanContributions, // Save all scan contributions
        skinOjasContribution: scanContributions.skin, // Keep for backwards compatibility
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

  const saveCumulativeData = async (newTotalScore: number) => {
    try {
      const today = new Date().toISOString().split('T')[0];

      // Load existing cumulative data
      const existingJson = await AsyncStorage.getItem(CUMULATIVE_STORAGE_KEY);
      let cumulativeData: CumulativeOjasData = existingJson
        ? JSON.parse(existingJson)
        : {
            totalScore: 0,
            streakDays: 0,
            lastActiveDate: '',
            totalHabitsCompleted: 0,
            totalScansCompleted: 0,
          };

      // Update streak if this is a new day
      if (cumulativeData.lastActiveDate !== today) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];

        if (cumulativeData.lastActiveDate === yesterdayStr) {
          // Consecutive day - increase streak
          cumulativeData.streakDays += 1;
        } else if (cumulativeData.lastActiveDate === '') {
          // First time - start streak
          cumulativeData.streakDays = 1;
        } else {
          // Streak broken - reset to 1
          cumulativeData.streakDays = 1;
        }
        cumulativeData.lastActiveDate = today;
      }

      // Update total score
      cumulativeData.totalScore = newTotalScore;

      // Count habits and scans
      const habitCount = Object.values(habits).filter(Boolean).length;
      const scanCount = Object.values(scanContributions).filter(v => v > 0).length;
      cumulativeData.totalHabitsCompleted = habitCount;
      cumulativeData.totalScansCompleted = scanCount;

      await AsyncStorage.setItem(CUMULATIVE_STORAGE_KEY, JSON.stringify(cumulativeData));
      setStreakDays(cumulativeData.streakDays);
    } catch (error) {
      console.log('Error saving cumulative data:', error);
    }
  };

  const getOjasLevel = (score: number): string => {
    // Cumulative milestones for lifetime Ojas (30-day journey)
    if (score >= 5001) return 'Enlightened';
    if (score >= 3001) return 'Glorious';
    if (score >= 1501) return 'Radiant';
    if (score >= 701) return 'Flourishing';
    if (score >= 301) return 'Growing';
    if (score >= 101) return 'Budding';
    return 'Emerging';
  };

  const getOjasColor = (score: number): string => {
    // Glow color intensifies as user progresses through levels (30-day journey)
    if (score >= 5001) return '#FFD700'; // Brightest Gold - Enlightened
    if (score >= 3001) return '#FFCC00'; // Bright Gold - Glorious
    if (score >= 1501) return '#FFB800'; // Gold - Radiant
    if (score >= 701) return '#FFA500'; // Orange-Gold - Flourishing
    if (score >= 301) return '#FFB347'; // Light Orange - Growing
    if (score >= 101) return '#FFCC66'; // Soft Yellow - Budding
    return '#E6C87A'; // Pale Yellow - Emerging
  };

  const getGlowIntensity = (score: number): number => {
    // Glow size/intensity increases with level (30-day journey)
    if (score >= 5001) return 1.0;  // Maximum glow
    if (score >= 3001) return 0.9;
    if (score >= 1501) return 0.8;
    if (score >= 701) return 0.65;
    if (score >= 301) return 0.5;
    if (score >= 101) return 0.35;
    return 0.25; // Subtle glow for beginners
  };

  const getOjasIcon = (score: number): string => {
    // Icons for 30-day journey levels
    if (score >= 5001) return 'star-four-points';
    if (score >= 3001) return 'star';
    if (score >= 1501) return 'star-half-full';
    if (score >= 701) return 'star-outline';
    if (score >= 301) return 'flower';
    if (score >= 101) return 'seed';
    return 'sprout';
  };

  const shareOjasScore = async () => {
    try {
      // Show logo for capture
      setIsCapturing(true);

      // Wait for re-render to complete
      await new Promise(resolve => setTimeout(resolve, 500));

      if (shareCardRef.current?.capture) {
        const uri = await shareCardRef.current.capture();

        // Hide logo after capture
        setIsCapturing(false);

        if (await Sharing.isAvailableAsync()) {
          await Sharing.shareAsync(uri, {
            mimeType: 'image/png',
            dialogTitle: 'Share Your Ojas Glow',
          });
        }
      } else {
        setIsCapturing(false);
      }
    } catch (error) {
      setIsCapturing(false);
      console.log('Error sharing:', error);
    }
  };

  const glowOpacity = glowAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0.2, 0.8],
  });

  const glowScale = glowAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.3],
  });

  // Load data on mount
  useEffect(() => {
    loadCumulativeData();
    loadTodayData();
    loadWeeklyData();
    startGlowAnimation();
  }, []);

  // Update glow intensity based on score
  useEffect(() => {
    startGlowAnimation();
  }, [ojasScore, startGlowAnimation]);

  // Reload data when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      loadCumulativeData();
      loadTodayData();
      loadWeeklyData();
    }, [loadCumulativeData])
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <ViewShot ref={shareCardRef} options={{ format: 'png', quality: 0.9 }}>
      <View style={styles.shareCardWrapper}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerIconRow}>
          <MaterialCommunityIcons name="shimmer" size={32} color="#E65100" />
          <Text style={styles.title}>Ojas Glow Tracker</Text>
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

        {/* Score Display - Three Box Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{ojasScore}</Text>
            <Text style={styles.statLabel}>Total Ojas</Text>
          </View>
          <View style={[styles.statBox, styles.statBoxCenter]}>
            <MaterialCommunityIcons name={getOjasIcon(ojasScore) as any} size={24} color="#4CAF50" />
            <Text style={styles.statLevelText}>{getOjasLevel(ojasScore)}</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValueGreen}>+{todayScore}</Text>
            <Text style={styles.statLabel}>Today</Text>
          </View>
        </View>
        {streakDays > 1 && (
          <View style={styles.streakBadge}>
            <MaterialCommunityIcons name="fire" size={14} color="#FF6B00" />
            <Text style={styles.streakText}>{streakDays} day streak</Text>
          </View>
        )}

      </View>

      {/* What is Ojas - for screenshot */}
      <View style={styles.shareEducationCard}>
        <Text style={styles.shareEducationTitle}>
          <MaterialCommunityIcons name="diamond-stone" size={14} color="#B87333" /> What is Ojas?
        </Text>
        <Text style={styles.shareEducationText}>
          Ojas is your vital essence - the reserve of immunity, strength, and radiance that makes your skin glow and presence magnetic. Strong Ojas means resilient & vibrant. Depleted means tired & anxious.
        </Text>
        <Text style={styles.shareEducationSource}>— Charaka Samhita</Text>
      </View>

      {/* Branding for social share - hidden on screen, visible in capture */}
      <View style={[styles.brandingFooter, !isCapturing && styles.brandingHidden]}>
        <Image
          source={require('../../assets/Nayaved.png')}
          style={styles.brandingLogo}
          resizeMode="contain"
        />
      </View>
      </View>
      </ViewShot>

      {/* Share Button */}
      <TouchableOpacity style={styles.shareButton} onPress={shareOjasScore}>
        <Feather name="share" size={18} color="#FFFFFF" />
        <Text style={styles.shareButtonText}>Share Your Glow</Text>
      </TouchableOpacity>

      {/* Ojas Breakdown - Collapsible */}
      <TouchableOpacity
        style={styles.breakdownHeader}
        onPress={() => setShowBreakdown(!showBreakdown)}
      >
        <View style={styles.breakdownTitleRow}>
          <Ionicons name="stats-chart" size={20} color="#3E2723" />
          <Text style={styles.breakdownTitle}> Ojas Score Breakdown</Text>
        </View>
        <MaterialCommunityIcons
          name={showBreakdown ? "chevron-up" : "chevron-down"}
          size={24}
          color="#3E2723"
        />
      </TouchableOpacity>

      {showBreakdown && (
        <View style={styles.breakdownContent}>
          <View style={styles.breakdownRow}>
            <View style={styles.breakdownLabelRow}>
              <MaterialCommunityIcons name="arm-flex" size={18} color="#5D4037" />
              <Text style={styles.breakdownLabel}> From Daily Habits:</Text>
            </View>
            <Text style={styles.breakdownValue}>{habitScore} pts</Text>
          </View>

          {/* Daily Scans Section */}
          <View style={styles.scanContributionsSection}>
            <Text style={styles.scanSectionTitle}>From Daily Scans:</Text>

            {/* Tongue */}
            <View style={scanContributions.tongue > 0 ? styles.scanRow : styles.scanRowEmpty}>
              <View style={styles.breakdownLabelRow}>
                <MaterialCommunityIcons name="account-voice" size={16} color={scanContributions.tongue > 0 ? "#4CD964" : "#9E9E9E"} />
                <Text style={scanContributions.tongue > 0 ? styles.scanLabel : styles.scanLabelEmpty}> Tongue</Text>
              </View>
              <Text style={scanContributions.tongue > 0 ? styles.scanValue : styles.scanValueEmpty}>
                {scanContributions.tongue > 0 ? `+${scanContributions.tongue}` : '—'}
              </Text>
            </View>

            {/* Eye */}
            <View style={scanContributions.eye > 0 ? styles.scanRow : styles.scanRowEmpty}>
              <View style={styles.breakdownLabelRow}>
                <Ionicons name="eye-outline" size={16} color={scanContributions.eye > 0 ? "#5AC8FA" : "#9E9E9E"} />
                <Text style={scanContributions.eye > 0 ? styles.scanLabel : styles.scanLabelEmpty}> Eyes</Text>
              </View>
              <Text style={scanContributions.eye > 0 ? styles.scanValue : styles.scanValueEmpty}>
                {scanContributions.eye > 0 ? `+${scanContributions.eye}` : '—'}
              </Text>
            </View>

            {/* Skin */}
            <View style={scanContributions.skin > 0 ? styles.scanRow : styles.scanRowEmpty}>
              <View style={styles.breakdownLabelRow}>
                <MaterialCommunityIcons name="face-woman-shimmer" size={16} color={scanContributions.skin > 0 ? "#FFCC00" : "#9E9E9E"} />
                <Text style={scanContributions.skin > 0 ? styles.scanLabel : styles.scanLabelEmpty}> Skin</Text>
              </View>
              <Text style={scanContributions.skin > 0 ? styles.scanValue : styles.scanValueEmpty}>
                {scanContributions.skin > 0 ? `+${scanContributions.skin}` : '—'}
              </Text>
            </View>

            {/* Nail */}
            <View style={scanContributions.nail > 0 ? styles.scanRow : styles.scanRowEmpty}>
              <View style={styles.breakdownLabelRow}>
                <MaterialCommunityIcons name="hand-back-right-outline" size={16} color={scanContributions.nail > 0 ? "#AF52DE" : "#9E9E9E"} />
                <Text style={scanContributions.nail > 0 ? styles.scanLabel : styles.scanLabelEmpty}> Nails</Text>
              </View>
              <Text style={scanContributions.nail > 0 ? styles.scanValue : styles.scanValueEmpty}>
                {scanContributions.nail > 0 ? `+${scanContributions.nail}` : '—'}
              </Text>
            </View>

            {/* Pulse */}
            <View style={scanContributions.pulse > 0 ? styles.scanRow : styles.scanRowEmpty}>
              <View style={styles.breakdownLabelRow}>
                <MaterialCommunityIcons name="heart-pulse" size={16} color={scanContributions.pulse > 0 ? "#FF6B9D" : "#9E9E9E"} />
                <Text style={scanContributions.pulse > 0 ? styles.scanLabel : styles.scanLabelEmpty}> Pulse</Text>
              </View>
              <Text style={scanContributions.pulse > 0 ? styles.scanValue : styles.scanValueEmpty}>
                {scanContributions.pulse > 0 ? `+${scanContributions.pulse}` : '—'}
              </Text>
            </View>

            <View style={styles.scanTotalRow}>
              <Text style={styles.scanTotalLabel}>Scan Total:</Text>
              <Text style={styles.scanTotalValue}>+{getTotalScanContribution()} pts</Text>
            </View>
          </View>

          <View style={styles.breakdownDivider} />
          <View style={styles.breakdownRow}>
            <Text style={styles.breakdownLabelTotal}>Today's Ojas:</Text>
            <Text style={styles.breakdownValueTotal}>{todayScore} pts</Text>
          </View>
          <View style={styles.breakdownRow}>
            <Text style={styles.cumulativeLabel}>Lifetime Total:</Text>
            <Text style={styles.cumulativeValue}>{ojasScore} pts</Text>
          </View>
        </View>
      )}

      {/* Save Message */}
      {showSaveMessage && (
        <View style={styles.saveMessage}>
          <View style={styles.saveMessageContent}>
            <Feather name="check" size={18} color="#FFFFFF" />
            <Text style={styles.saveMessageText}> Progress saved!</Text>
          </View>
        </View>
      )}

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
        <Text style={styles.sectionTitle}>7-Day Daily Ojas Earned</Text>
        <View style={styles.chart}>
          {weeklyScores.map((score, index) => {
            // Max possible daily score is ~150 (100 habits + up to 50 from scans/bonuses)
            const maxScore = 150;
            const barHeight = Math.min((score / maxScore) * 140, 140);
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

      {/* Ojas Builders - Collapsible */}
      <TouchableOpacity
        style={styles.buildersHeader}
        onPress={() => setShowBuilders(!showBuilders)}
      >
        <View style={styles.buildersTitleRow}>
          <MaterialCommunityIcons name="leaf" size={20} color="#2E7D32" />
          <Text style={styles.buildersTitle}> Ojas-Building Foods & Herbs</Text>
        </View>
        <MaterialCommunityIcons
          name={showBuilders ? "chevron-up" : "chevron-down"}
          size={24}
          color="#2E7D32"
        />
      </TouchableOpacity>

      {showBuilders && (
        <View style={styles.buildersContent}>
          <Text style={styles.builderItem}>• Ghee (clarified butter)</Text>
          <Text style={styles.builderItem}>• Raw milk (if digestion is strong)</Text>
          <Text style={styles.builderItem}>• Almonds (soaked overnight)</Text>
          <Text style={styles.builderItem}>• Dates and raisins</Text>
          <Text style={styles.builderItem}>• Sweet, ripe fruits</Text>
          <Text style={styles.builderItem}>• Ashwagandha, Shatavari herbs</Text>
          <Text style={styles.builderItem}>• Warm spices: cardamom, saffron</Text>
        </View>
      )}

      {/* Ojas Depleters - Collapsible */}
      <TouchableOpacity
        style={styles.depletersHeader}
        onPress={() => setShowDepleters(!showDepleters)}
      >
        <View style={styles.depletersTitleRow}>
          <Ionicons name="warning" size={20} color="#C62828" />
          <Text style={styles.depletersTitle}> Ojas Depleters to Avoid</Text>
        </View>
        <MaterialCommunityIcons
          name={showDepleters ? "chevron-up" : "chevron-down"}
          size={24}
          color="#C62828"
        />
      </TouchableOpacity>

      {showDepleters && (
        <View style={styles.depletersContent}>
          <Text style={styles.depleterItem}>• Chronic stress and overwork</Text>
          <Text style={styles.depleterItem}>• Poor sleep or irregular sleep</Text>
          <Text style={styles.depleterItem}>• Excessive screen time</Text>
          <Text style={styles.depleterItem}>• Processed, cold, stale foods</Text>
          <Text style={styles.depleterItem}>• Alcohol and stimulants</Text>
          <Text style={styles.depleterItem}>• Negative emotions: fear, anger, grief</Text>
        </View>
      )}

      {/* Collapsible Level Progression */}
      <TouchableOpacity
        style={styles.journeyHeader}
        onPress={() => setShowJourney(!showJourney)}
      >
        <View style={styles.journeyTitleRow}>
          <MaterialCommunityIcons name="trophy-outline" size={20} color="#B87333" />
          <Text style={styles.journeyTitle}> Your Ojas Journey</Text>
        </View>
        <MaterialCommunityIcons
          name={showJourney ? "chevron-up" : "chevron-down"}
          size={24}
          color="#B87333"
        />
      </TouchableOpacity>

      {showJourney && (
        <View style={styles.journeyContent}>
          {[
            { level: 'Emerging', min: 0, max: 100, icon: 'sprout', color: '#4CAF50' },
            { level: 'Budding', min: 101, max: 300, icon: 'seed', color: '#4CAF50' },
            { level: 'Growing', min: 301, max: 700, icon: 'flower', color: '#4CAF50' },
            { level: 'Flourishing', min: 701, max: 1500, icon: 'star-outline', color: '#FFA500' },
            { level: 'Radiant', min: 1501, max: 3000, icon: 'star-half-full', color: '#FFB800' },
            { level: 'Glorious', min: 3001, max: 5000, icon: 'star', color: '#FFCC00' },
            { level: 'Enlightened', min: 5001, max: null, icon: 'star-four-points', color: '#FFD700' },
          ].map((tier) => {
            const isCurrentLevel = ojasScore >= tier.min && (tier.max === null || ojasScore <= tier.max);
            const isCompleted = tier.max !== null && ojasScore > tier.max;
            const isLocked = ojasScore < tier.min;

            return (
              <View
                key={tier.level}
                style={[
                  styles.journeyRow,
                  isCurrentLevel && styles.journeyRowCurrent,
                ]}
              >
                <MaterialCommunityIcons
                  name={tier.icon as any}
                  size={18}
                  color={isLocked ? '#BDBDBD' : tier.color}
                />
                <Text style={[
                  styles.journeyLevel,
                  isLocked && styles.journeyLevelLocked,
                  isCurrentLevel && styles.journeyLevelCurrent,
                ]}>
                  {tier.level}
                </Text>
                <Text style={[
                  styles.journeyRange,
                  isLocked && styles.journeyRangeLocked,
                ]}>
                  {tier.max ? `${tier.min}-${tier.max}` : `${tier.min}+`}
                </Text>
                {isCompleted && <MaterialCommunityIcons name="check" size={16} color="#4CAF50" />}
                {isCurrentLevel && <Text style={styles.youBadge}>YOU</Text>}
              </View>
            );
          })}

          {/* Next Level Hint inside the journey table */}
          {ojasScore < 5001 && (
            <View style={styles.nextLevelHint}>
              <MaterialCommunityIcons name="arrow-up-circle" size={16} color="#4CAF50" />
              <Text style={styles.nextLevelText}>
                {ojasScore <= 100 && `${101 - ojasScore} pts to Budding`}
                {ojasScore >= 101 && ojasScore <= 300 && `${301 - ojasScore} pts to Growing`}
                {ojasScore >= 301 && ojasScore <= 700 && `${701 - ojasScore} pts to Flourishing`}
                {ojasScore >= 701 && ojasScore <= 1500 && `${1501 - ojasScore} pts to Radiant`}
                {ojasScore >= 1501 && ojasScore <= 3000 && `${3001 - ojasScore} pts to Glorious`}
                {ojasScore >= 3001 && ojasScore <= 5000 && `${5001 - ojasScore} pts to Enlightened`}
              </Text>
            </View>
          )}
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
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 8,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  statBoxCenter: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: '#E0E0E0',
    marginHorizontal: 8,
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#E65100',
  },
  statValueGreen: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  statLabel: {
    fontSize: 11,
    color: '#5D4037',
    textTransform: 'uppercase',
    marginTop: 2,
  },
  statLevelText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3E2723',
    marginTop: 4,
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF3E0',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 10,
  },
  streakText: {
    fontSize: 12,
    color: '#FF6B00',
    fontWeight: '600',
    marginLeft: 4,
  },
  shareEducationCard: {
    backgroundColor: '#FFF8E7',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 8,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#D4A574',
  },
  shareEducationTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#B87333',
    marginBottom: 4,
  },
  shareEducationText: {
    fontSize: 11,
    color: '#5D4037',
    lineHeight: 15,
  },
  shareEducationSource: {
    fontSize: 10,
    color: '#B87333',
    fontWeight: '600',
    fontStyle: 'italic',
    textAlign: 'right',
    marginTop: 2,
  },
  brandingFooter: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 8,
  },
  brandingHidden: {
    height: 0,
    overflow: 'hidden',
    opacity: 0,
  },
  brandingLogo: {
    width: 180,
    height: 120,
  },
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: ManuscriptColors.vermillion,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    marginTop: 8,
    marginBottom: 16,
    gap: 8,
  },
  shareButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
  shareCardWrapper: {
    backgroundColor: ManuscriptColors.palmLeaf,
    padding: 16,
    paddingBottom: 8,
    borderRadius: 16,
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
  breakdownHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFF8E7',
    padding: 14,
    borderRadius: 10,
    marginTop: 8,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#FFD700',
  },
  breakdownContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderTopWidth: 0,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    padding: 16,
    marginTop: -2,
    marginBottom: 20,
  },
  breakdownTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
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
  cumulativeLabel: {
    fontSize: 14,
    color: '#E65100',
    fontWeight: '600',
  },
  cumulativeValue: {
    fontSize: 16,
    color: '#E65100',
    fontWeight: 'bold',
  },
  scanContributionsSection: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
    marginBottom: 8,
  },
  scanSectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#5D4037',
    marginBottom: 8,
  },
  scanRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  scanRowEmpty: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
    opacity: 0.5,
  },
  scanLabel: {
    fontSize: 13,
    color: '#3E2723',
  },
  scanLabelEmpty: {
    fontSize: 13,
    color: '#9E9E9E',
  },
  scanValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#4CAF50',
  },
  scanValueEmpty: {
    fontSize: 13,
    color: '#9E9E9E',
  },
  scanTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  scanTotalLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#5D4037',
  },
  scanTotalValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FF9800',
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
  buildersHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#E8F5E9',
    padding: 14,
    borderRadius: 10,
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#4CAF50',
  },
  buildersContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderTopWidth: 0,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    padding: 12,
    marginTop: -2,
  },
  buildersTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
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
  depletersHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFEBEE',
    padding: 14,
    borderRadius: 10,
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#EF5350',
  },
  depletersContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderTopWidth: 0,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    padding: 12,
    marginTop: -2,
    marginBottom: 8,
  },
  depletersTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
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
  journeyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFF8E7',
    padding: 14,
    borderRadius: 10,
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#B87333',
  },
  journeyTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  journeyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#B87333',
  },
  journeyContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderTopWidth: 0,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    padding: 12,
    marginTop: -2,
  },
  journeyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 8,
    gap: 10,
  },
  journeyRowCurrent: {
    backgroundColor: '#FFF8E1',
    borderRadius: 6,
  },
  journeyLevel: {
    flex: 1,
    fontSize: 14,
    color: '#3E2723',
  },
  journeyLevelLocked: {
    color: '#9E9E9E',
  },
  journeyLevelCurrent: {
    fontWeight: 'bold',
    color: '#E65100',
  },
  journeyRange: {
    fontSize: 12,
    color: '#5D4037',
    width: 50,
    textAlign: 'right',
  },
  journeyRangeLocked: {
    color: '#BDBDBD',
  },
  youBadge: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#FFFFFF',
    backgroundColor: '#E65100',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    overflow: 'hidden',
  },
  nextLevelHint: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E8F5E9',
    padding: 10,
    borderRadius: 6,
    marginTop: 8,
    gap: 6,
  },
  nextLevelText: {
    fontSize: 13,
    color: '#2E7D32',
    fontWeight: '600',
  },
});
