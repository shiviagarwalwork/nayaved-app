/**
 * Daily Ritual Service
 *
 * Manages daily scan tracking, streaks, and scan history
 * to encourage users to scan daily as a "Body Weather Check"
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

// Storage keys
const STORAGE_KEYS = {
  SCAN_HISTORY: 'nayaved_scan_history',
  STREAK_DATA: 'nayaved_streak_data',
  LAST_SCAN_DATE: 'nayaved_last_scan_date',
  PROTOCOL_FEEDBACK: 'nayaved_protocol_feedback',
  OJAS_DATA: '@nayaved_ojas_data', // Must match OjasTrackerScreen key
  OJAS_CUMULATIVE: '@nayaved_ojas_cumulative', // Cumulative/lifetime Ojas score
};

// Types
export interface ScanResult {
  id: string;
  type: 'tongue' | 'eye' | 'skin' | 'nail' | 'pulse' | 'dosha';
  date: string; // ISO date string
  timestamp: number;
  summary: string;
  dominantDosha?: 'vata' | 'pitta' | 'kapha';
  metrics?: Record<string, number>; // e.g., { coating: 65, moisture: 40 }
  ojasContribution?: number;
}

export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastScanDate: string | null;
  totalScans: number;
  streakStartDate: string | null;
  milestones: {
    day3: boolean;
    day7: boolean;
    day14: boolean;
    day30: boolean;
  };
}

export interface ProtocolFeedback {
  date: string;
  protocol: string;
  tried: boolean;
  helpful: boolean | null;
}

export interface DailyComparison {
  hasYesterdayData: boolean;
  changes: {
    metric: string;
    yesterday: number;
    today: number;
    change: number; // percentage
    improved: boolean;
  }[];
  insight: string;
}

// Wisdom quotes from Charaka Samhita
export const DAILY_WISDOM = [
  { quote: "The body is the product of food. Disease is the product of food. The distinction between ease and disease arises from the distinction between wholesome and unwholesome food.", source: "Charaka Samhita, Sutrasthana 28.45" },
  { quote: "When diet is wrong, medicine is of no use. When diet is correct, medicine is of no need.", source: "Charaka Samhita" },
  { quote: "The wise should avoid factors that aggravate the doshas and adopt those that pacify them.", source: "Charaka Samhita, Sutrasthana 7.41" },
  { quote: "He who practices self-control, eats proper food, and exercises regularly has no fear of disease.", source: "Charaka Samhita, Sutrasthana 5.13" },
  { quote: "Sleep and waking at proper times bring happiness, nourishment, strength, virility, knowledge, and life.", source: "Charaka Samhita, Sutrasthana 21.36" },
  { quote: "One should wake up during Brahma Muhurta (before sunrise) for protecting one's health.", source: "Ashtanga Hridayam, Sutrasthana 2.1" },
  { quote: "The mind is the ruler of the senses. Control of mind brings control of body.", source: "Charaka Samhita, Sharirasthana 1.19" },
  { quote: "Ojas is the essence of all tissues. When it diminishes, the being falls.", source: "Charaka Samhita, Sutrasthana 17.74" },
  { quote: "Balance is the foundation of health. Imbalance is the root of disease.", source: "Charaka Samhita, Sutrasthana 9.4" },
  { quote: "The wise person observes their body daily, noting changes as the seasons change within.", source: "Charaka Samhita, Sutrasthana 6.3" },
  { quote: "Prevention is better than cure. Daily observation prevents illness from taking root.", source: "Charaka Samhita" },
  { quote: "As a tree is known by its leaves and flowers, so is health known by the state of tongue and eyes.", source: "Charaka Samhita, Vimanasthana 4.8" },
];

/**
 * Get today's date as YYYY-MM-DD string
 */
function getTodayString(): string {
  return new Date().toISOString().split('T')[0];
}

/**
 * Get yesterday's date as YYYY-MM-DD string
 */
function getYesterdayString(): string {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return yesterday.toISOString().split('T')[0];
}

/**
 * Calculate days between two dates
 */
function daysBetween(date1: string, date2: string): number {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  const diffTime = Math.abs(d2.getTime() - d1.getTime());
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Get streak data
 */
export async function getStreakData(): Promise<StreakData> {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.STREAK_DATA);
    if (data) {
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error getting streak data:', error);
  }

  return {
    currentStreak: 0,
    longestStreak: 0,
    lastScanDate: null,
    totalScans: 0,
    streakStartDate: null,
    milestones: {
      day3: false,
      day7: false,
      day14: false,
      day30: false,
    },
  };
}

/**
 * Update streak after a scan
 */
export async function updateStreak(): Promise<StreakData> {
  const today = getTodayString();
  const streakData = await getStreakData();

  // If already scanned today, don't update streak
  if (streakData.lastScanDate === today) {
    return streakData;
  }

  const yesterday = getYesterdayString();

  // Check if streak continues
  if (streakData.lastScanDate === yesterday) {
    // Streak continues
    streakData.currentStreak += 1;
  } else if (streakData.lastScanDate === null || daysBetween(streakData.lastScanDate, today) > 1) {
    // Streak broken or first scan
    streakData.currentStreak = 1;
    streakData.streakStartDate = today;
  }

  // Update longest streak
  if (streakData.currentStreak > streakData.longestStreak) {
    streakData.longestStreak = streakData.currentStreak;
  }

  // Update milestones
  if (streakData.currentStreak >= 3) streakData.milestones.day3 = true;
  if (streakData.currentStreak >= 7) streakData.milestones.day7 = true;
  if (streakData.currentStreak >= 14) streakData.milestones.day14 = true;
  if (streakData.currentStreak >= 30) streakData.milestones.day30 = true;

  // Update other fields
  streakData.lastScanDate = today;
  streakData.totalScans += 1;

  // Save
  await AsyncStorage.setItem(STORAGE_KEYS.STREAK_DATA, JSON.stringify(streakData));

  return streakData;
}

/**
 * Save a scan result
 */
export async function saveScanResult(result: Omit<ScanResult, 'id' | 'date' | 'timestamp'>): Promise<ScanResult> {
  const scanResult: ScanResult = {
    ...result,
    id: `${result.type}_${Date.now()}`,
    date: getTodayString(),
    timestamp: Date.now(),
  };

  try {
    // Get existing history
    const historyJson = await AsyncStorage.getItem(STORAGE_KEYS.SCAN_HISTORY);
    const history: ScanResult[] = historyJson ? JSON.parse(historyJson) : [];

    // Add new result
    history.unshift(scanResult);

    // Keep only last 90 days of history
    const ninetyDaysAgo = Date.now() - (90 * 24 * 60 * 60 * 1000);
    const filteredHistory = history.filter(s => s.timestamp > ninetyDaysAgo);

    // Save
    await AsyncStorage.setItem(STORAGE_KEYS.SCAN_HISTORY, JSON.stringify(filteredHistory));

    // Update streak
    await updateStreak();

    return scanResult;
  } catch (error) {
    console.error('Error saving scan result:', error);
    throw error;
  }
}

/**
 * Get scan history for a specific type
 */
export async function getScanHistory(type?: ScanResult['type'], limit = 30): Promise<ScanResult[]> {
  try {
    const historyJson = await AsyncStorage.getItem(STORAGE_KEYS.SCAN_HISTORY);
    if (!historyJson) return [];

    let history: ScanResult[] = JSON.parse(historyJson);

    if (type) {
      history = history.filter(s => s.type === type);
    }

    return history.slice(0, limit);
  } catch (error) {
    console.error('Error getting scan history:', error);
    return [];
  }
}

/**
 * Get yesterday's scan for comparison
 */
export async function getYesterdayScan(type: ScanResult['type']): Promise<ScanResult | null> {
  const yesterday = getYesterdayString();
  const history = await getScanHistory(type, 7);

  return history.find(s => s.date === yesterday) || null;
}

/**
 * Compare today's scan with yesterday
 */
export async function compareTodayWithYesterday(
  type: ScanResult['type'],
  todayMetrics: Record<string, number>
): Promise<DailyComparison> {
  const yesterdayScan = await getYesterdayScan(type);

  if (!yesterdayScan || !yesterdayScan.metrics) {
    return {
      hasYesterdayData: false,
      changes: [],
      insight: "This is your first scan of this type. Scan daily to see how your body changes!",
    };
  }

  const changes = Object.keys(todayMetrics).map(metric => {
    const yesterday = yesterdayScan.metrics![metric] || 0;
    const today = todayMetrics[metric];
    const change = yesterday > 0 ? ((today - yesterday) / yesterday) * 100 : 0;

    return {
      metric,
      yesterday,
      today,
      change: Math.round(change),
      improved: change > 0, // This is simplified; some metrics "improve" when they go down
    };
  });

  // Generate insight
  const significantChanges = changes.filter(c => Math.abs(c.change) >= 10);
  let insight = "";

  if (significantChanges.length === 0) {
    insight = "Your readings are stable from yesterday. Consistency is key!";
  } else {
    const topChange = significantChanges.sort((a, b) => Math.abs(b.change) - Math.abs(a.change))[0];
    const direction = topChange.change > 0 ? "increased" : "decreased";
    insight = `Your ${topChange.metric} has ${direction} by ${Math.abs(topChange.change)}% since yesterday.`;
  }

  return {
    hasYesterdayData: true,
    changes,
    insight,
  };
}

/**
 * Check if user scanned today
 */
export async function hasScannedToday(type?: ScanResult['type']): Promise<boolean> {
  const today = getTodayString();
  const history = await getScanHistory(type, 10);

  return history.some(s => s.date === today);
}

/**
 * Get daily wisdom quote
 */
export function getDailyWisdom(): { quote: string; source: string } {
  // Use day of year to rotate quotes
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - start.getTime();
  const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));

  return DAILY_WISDOM[dayOfYear % DAILY_WISDOM.length];
}

/**
 * Save protocol feedback
 */
export async function saveProtocolFeedback(feedback: ProtocolFeedback): Promise<void> {
  try {
    const existingJson = await AsyncStorage.getItem(STORAGE_KEYS.PROTOCOL_FEEDBACK);
    const existing: ProtocolFeedback[] = existingJson ? JSON.parse(existingJson) : [];

    existing.unshift(feedback);

    // Keep last 30 feedback entries
    const trimmed = existing.slice(0, 30);

    await AsyncStorage.setItem(STORAGE_KEYS.PROTOCOL_FEEDBACK, JSON.stringify(trimmed));
  } catch (error) {
    console.error('Error saving protocol feedback:', error);
  }
}

/**
 * Get pending protocol feedback (yesterday's protocol that hasn't been reviewed)
 */
export async function getPendingProtocolFeedback(): Promise<ProtocolFeedback | null> {
  try {
    const yesterday = getYesterdayString();
    const feedbackJson = await AsyncStorage.getItem(STORAGE_KEYS.PROTOCOL_FEEDBACK);

    if (!feedbackJson) return null;

    const feedback: ProtocolFeedback[] = JSON.parse(feedbackJson);
    const yesterdayFeedback = feedback.find(f => f.date === yesterday && f.helpful === null);

    return yesterdayFeedback || null;
  } catch (error) {
    console.error('Error getting pending feedback:', error);
    return null;
  }
}

/**
 * Get streak milestone message
 */
export function getStreakMessage(streak: number): string | null {
  if (streak === 3) return "3-day streak! You've unlocked your 3-day trend view.";
  if (streak === 7) return "1 week streak! Weekly pattern analysis unlocked.";
  if (streak === 14) return "2 week streak! Your body's rhythm is becoming clear.";
  if (streak === 30) return "30-day streak! Monthly vitality report unlocked!";
  if (streak > 0 && streak % 10 === 0) return `${streak}-day streak! Your dedication is building Ojas.`;
  return null;
}

/**
 * Get body weather summary based on recent scans
 */
export async function getBodyWeather(): Promise<{
  summary: string;
  emoji: string;
  dominantDosha: 'vata' | 'pitta' | 'kapha' | 'balanced';
  advice: string;
}> {
  const recentScans = await getScanHistory(undefined, 5);

  if (recentScans.length === 0) {
    return {
      summary: "Unknown - scan to see your body weather",
      emoji: "🌫️",
      dominantDosha: 'balanced',
      advice: "Start your daily scan ritual to discover your body's patterns.",
    };
  }

  // Count dosha occurrences
  const doshaCounts = { vata: 0, pitta: 0, kapha: 0 };
  recentScans.forEach(scan => {
    if (scan.dominantDosha) {
      doshaCounts[scan.dominantDosha]++;
    }
  });

  const maxDosha = Object.entries(doshaCounts).sort((a, b) => b[1] - a[1])[0];

  const weatherMap = {
    vata: { summary: "Windy & Variable", emoji: "💨", advice: "Stay grounded. Warm foods and oils today." },
    pitta: { summary: "Hot & Intense", emoji: "🔥", advice: "Cool down. Avoid spicy foods and midday sun." },
    kapha: { summary: "Cloudy & Heavy", emoji: "☁️", advice: "Get moving. Light foods and exercise help." },
  };

  if (maxDosha[1] === 0) {
    return {
      summary: "Balanced",
      emoji: "☀️",
      dominantDosha: 'balanced',
      advice: "Your doshas are in harmony. Maintain your routine!",
    };
  }

  const dosha = maxDosha[0] as 'vata' | 'pitta' | 'kapha';
  return {
    ...weatherMap[dosha],
    dominantDosha: dosha,
  };
}

/**
 * Save scan Ojas contribution
 * Each scan type can contribute bonus points to the daily Ojas score
 * Also updates the cumulative/lifetime Ojas score
 */
export async function saveScanOjasContribution(
  scanType: 'tongue' | 'eye' | 'skin' | 'nail' | 'pulse',
  contribution: number
): Promise<void> {
  try {
    const today = getTodayString();
    const storageKey = `${STORAGE_KEYS.OJAS_DATA}_${today}`;

    // Load existing Ojas data for today
    const existingJson = await AsyncStorage.getItem(storageKey);
    let ojasData: any = existingJson ? JSON.parse(existingJson) : {
      score: 0,
      date: today,
      habits: {},
      scanContributions: { tongue: 0, eye: 0, skin: 0, nail: 0, pulse: 0 },
    };

    // Ensure scanContributions exists (backwards compatibility)
    if (!ojasData.scanContributions) {
      ojasData.scanContributions = {
        tongue: 0,
        eye: 0,
        skin: ojasData.skinOjasContribution || 0,
        nail: 0,
        pulse: 0
      };
    }

    // Calculate delta for cumulative score (only add if this scan wasn't already done today)
    const previousContribution = ojasData.scanContributions[scanType] || 0;
    const delta = contribution - previousContribution;

    // Update the specific scan contribution
    ojasData.scanContributions[scanType] = contribution;

    // Keep skinOjasContribution for backwards compatibility
    if (scanType === 'skin') {
      ojasData.skinOjasContribution = contribution;
    }

    // Recalculate total score
    const habitScore = calculateHabitScore(ojasData.habits || {});
    const totalScanContribution =
      ojasData.scanContributions.tongue +
      ojasData.scanContributions.eye +
      ojasData.scanContributions.skin +
      ojasData.scanContributions.nail +
      ojasData.scanContributions.pulse;

    ojasData.score = habitScore + totalScanContribution;

    // Save daily data
    await AsyncStorage.setItem(storageKey, JSON.stringify(ojasData));

    // Update cumulative score if there's a delta
    if (delta > 0) {
      await updateCumulativeOjas(delta);
    }

    console.log(`Saved ${scanType} Ojas contribution: +${contribution} pts (delta: +${delta})`);
  } catch (error) {
    console.error('Error saving scan Ojas contribution:', error);
  }
}

/**
 * Update the cumulative/lifetime Ojas score
 */
async function updateCumulativeOjas(delta: number): Promise<void> {
  try {
    const existingJson = await AsyncStorage.getItem(STORAGE_KEYS.OJAS_CUMULATIVE);
    let cumulativeData = existingJson ? JSON.parse(existingJson) : {
      totalScore: 0,
      streakDays: 0,
      lastActiveDate: '',
      totalHabitsCompleted: 0,
      totalScansCompleted: 0,
    };

    // Add delta to total score
    cumulativeData.totalScore += delta;

    // Update last active date and streak
    const today = getTodayString();
    if (cumulativeData.lastActiveDate !== today) {
      const yesterday = getYesterdayString();
      if (cumulativeData.lastActiveDate === yesterday) {
        cumulativeData.streakDays += 1;
      } else if (cumulativeData.lastActiveDate === '') {
        cumulativeData.streakDays = 1;
      } else {
        cumulativeData.streakDays = 1;
      }
      cumulativeData.lastActiveDate = today;
    }

    await AsyncStorage.setItem(STORAGE_KEYS.OJAS_CUMULATIVE, JSON.stringify(cumulativeData));
    console.log(`Updated cumulative Ojas: +${delta} (total: ${cumulativeData.totalScore})`);
  } catch (error) {
    console.error('Error updating cumulative Ojas:', error);
  }
}

/**
 * Calculate habit score (same formula as OjasTrackerScreen)
 */
function calculateHabitScore(habits: Record<string, boolean>): number {
  let score = 0;
  if (habits.sleep) score += 15;
  if (habits.earlyRise) score += 12;
  if (habits.meditation) score += 13;
  if (habits.exercise) score += 12;
  if (habits.warmFood) score += 12;
  if (habits.noScreens) score += 10;
  if (habits.waterIntake) score += 10;
  if (habits.stressManagement) score += 16;
  return score;
}

/**
 * Calculate Ojas contribution based on scan health indicators
 * Returns 0-5 points based on overall health shown in scan
 */
export function calculateScanOjasContribution(
  scanType: 'tongue' | 'eye' | 'skin' | 'nail' | 'pulse',
  healthScore: number // 0-100 representing overall health from scan
): number {
  // Base contribution is 5 points for completing a scan
  // Scaled by health score: healthier readings = more Ojas
  const baseContribution = 3;
  const bonusContribution = Math.round((healthScore / 100) * 2); // 0-2 bonus
  return baseContribution + bonusContribution; // 3-5 points total
}
