/**
 * ============================================================
 * Notification Service
 * ============================================================
 *
 * Handles push notifications for:
 * - Daily ritual reminders (morning body weather check)
 * - Streak maintenance reminders
 * - Daily wisdom quotes (Charaka Samhita)
 *
 * SETUP REQUIRED:
 * Add to app.json under "expo" key:
 *    "plugins": [
 *      [
 *        "expo-notifications",
 *        {
 *          "icon": "./assets/notification-icon.png",
 *          "color": "#E34234"
 *        }
 *      ]
 *    ]
 *
 * @author NayaVed Team
 */

import * as Notifications from 'expo-notifications';
import { SchedulableTriggerInputTypes } from 'expo-notifications';
import * as Device from 'expo-device';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

// Daily wisdom quotes from Charaka Samhita
const DAILY_WISDOM_QUOTES = [
  {
    quote: "The wise person should act today as if tomorrow may never come.",
    source: "Charaka Samhita, Sutrasthana",
    topic: "mindfulness",
  },
  {
    quote: "When diet is wrong, medicine is of no use. When diet is correct, medicine is of no need.",
    source: "Ayurvedic Proverb",
    topic: "nutrition",
  },
  {
    quote: "Early rising leads to happiness, health and longevity.",
    source: "Charaka Samhita, Sutrasthana 5",
    topic: "dinacharya",
  },
  {
    quote: "The body's intelligence is greater than all medical wisdom.",
    source: "Ayurvedic Teaching",
    topic: "self-healing",
  },
  {
    quote: "What we eat becomes our mind. Food is the medicine of the soul.",
    source: "Charaka Samhita",
    topic: "sattvic diet",
  },
  {
    quote: "Sleep at proper time promotes growth, nourishment, strength, and immunity.",
    source: "Charaka Samhita, Sutrasthana 21",
    topic: "sleep",
  },
  {
    quote: "The senses should be controlled like horses by a skilled charioteer.",
    source: "Charaka Samhita, Sharir 1",
    topic: "indriya control",
  },
  {
    quote: "Balance is the key to all good things - in food, in exercise, in rest.",
    source: "Ayurvedic Teaching",
    topic: "balance",
  },
  {
    quote: "One who regularly performs Abhyanga (oil massage) is not overcome by old age.",
    source: "Charaka Samhita, Sutrasthana 5",
    topic: "self-care",
  },
  {
    quote: "Ojas is the essence of all tissues - protect it through right living.",
    source: "Charaka Samhita, Sutrasthana 17",
    topic: "ojas",
  },
  {
    quote: "The person who knows his own constitution can prevent most diseases.",
    source: "Ayurvedic Teaching",
    topic: "prakriti",
  },
  {
    quote: "Treat the cause, not just the symptoms.",
    source: "Charaka Samhita",
    topic: "root cause",
  },
  {
    quote: "Agni (digestive fire) is the root of life - when it dies, we die.",
    source: "Charaka Samhita, Chikitsasthana 15",
    topic: "digestion",
  },
  {
    quote: "The tongue reveals what the mind conceals.",
    source: "Ayurvedic Diagnostic Teaching",
    topic: "jihva pariksha",
  },
  {
    quote: "Regular routine (dinacharya) is the foundation of health.",
    source: "Charaka Samhita, Sutrasthana 5",
    topic: "routine",
  },
  {
    quote: "Happiness comes from within - external things provide only temporary pleasure.",
    source: "Charaka Samhita, Sharir 1",
    topic: "mental health",
  },
  {
    quote: "The eyes are the windows to the mind and the liver.",
    source: "Ayurvedic Teaching",
    topic: "netra pariksha",
  },
  {
    quote: "Prevention is better than cure - this is the essence of Ayurveda.",
    source: "Charaka Samhita",
    topic: "prevention",
  },
  {
    quote: "Stress is the mother of all diseases.",
    source: "Ayurvedic Teaching",
    topic: "stress",
  },
  {
    quote: "Your morning routine sets the tone for the entire day.",
    source: "Charaka Samhita, Sutrasthana 5",
    topic: "morning ritual",
  },
  {
    quote: "Nature has provided a remedy for every disease.",
    source: "Charaka Samhita",
    topic: "natural healing",
  },
  {
    quote: "The mind controls the body, but the body also influences the mind.",
    source: "Charaka Samhita, Sharir",
    topic: "mind-body",
  },
  {
    quote: "Proper breathing is the bridge between body and mind.",
    source: "Ayurvedic Teaching",
    topic: "pranayama",
  },
  {
    quote: "Clean food, pure water, fresh air - these are the three pillars of health.",
    source: "Ayurvedic Teaching",
    topic: "fundamentals",
  },
  {
    quote: "Self-knowledge is the beginning of wisdom and healing.",
    source: "Charaka Samhita, Sutrasthana 1",
    topic: "self-awareness",
  },
  {
    quote: "Walk in nature daily - it balances all three doshas.",
    source: "Ayurvedic Teaching",
    topic: "nature",
  },
  {
    quote: "Gratitude is medicine for the mind.",
    source: "Ayurvedic Teaching",
    topic: "gratitude",
  },
  {
    quote: "Eat when hungry, sleep when tired - follow nature's rhythm.",
    source: "Charaka Samhita",
    topic: "natural rhythm",
  },
  {
    quote: "The healthy person is established in the self - physically, mentally, spiritually.",
    source: "Charaka Samhita, Sutrasthana 1",
    topic: "wholeness",
  },
  {
    quote: "Silence is the greatest medicine for the disturbed mind.",
    source: "Ayurvedic Teaching",
    topic: "silence",
  },
];

// Notification types
export type NotificationType = 'morning_ritual' | 'streak_reminder' | 'daily_wisdom' | 'daily_insight' | 'evening_reflection';

// Daily insight headlines for notifications
const DAILY_INSIGHTS = [
  "Why Your Tongue Reveals Your Gut Health",
  "The 6 AM Secret: Why Brahmins Wake Before Dawn",
  "Ghee vs Butter: What Ayurveda Actually Says",
  "The Eye Color Your Dosha Creates",
  "Why Cold Water Kills Your Digestion",
  "The Afternoon Slump is a Dosha Problem",
  "Your Nails Are Mineral Detectives",
  "The Spice That Fixes 80% of Digestive Issues",
  "Sleep Position Based on Your Dosha",
  "Why Your Skin Breaks Out at the Same Time Monthly",
  "The Oil That Matches Your Dosha",
  "Why Eating Fruit After Meals Causes Bloating",
  "The Hidden Meaning of Food Cravings",
  "Morning Tongue Scraping: Why Copper Works Best",
  "The Pulse Point That Reveals Stress Levels",
  "Why Leftovers Lose Their Prana",
  "The Breathing Technique That Cools Pitta in 2 Minutes",
  "Why You Should Never Suppress These 13 Urges",
  "The Season Your Dosha Gets Worst",
  "Hair Fall? Check Your Pitta First",
  "The 3 Types of Hunger Ayurveda Describes",
  "Why 10 PM is the Most Important Bedtime",
  "The Eye Exercise That Reduces Screen Strain",
  "Bloating After Every Meal? Your Agni is Weak",
  "The Herb That Builds Brain Power",
  "Why Mixing Milk and Fruit is Ayurvedic Crime",
  "The Walking Meditation for Kapha Types",
  "Your Face Shape Reveals Your Constitution",
  "The Golden Milk Recipe That Actually Works",
  "Why Anxiety Peaks in the Evening",
];

// Storage keys
const STORAGE_KEYS = {
  notificationSettings: '@nayaved_notification_settings',
  lastWisdomIndex: '@nayaved_last_wisdom_index',
  scheduledNotifications: '@nayaved_scheduled_notifications',
};

// Notification identifiers for cancellation
const NOTIFICATION_IDS = {
  morningRitual: 'morning-ritual-daily',
  dailyWisdom: 'daily-wisdom',
  dailyInsight: 'daily-insight',
  streakReminder: 'streak-reminder',
  eveningReflection: 'evening-reflection',
};

// Default notification settings
export interface NotificationSettings {
  enabled: boolean;
  morningRitualTime: { hour: number; minute: number }; // Default: 7:00 AM
  eveningReflectionTime: { hour: number; minute: number }; // Default: 9:00 PM
  dailyWisdomEnabled: boolean;
  dailyInsightEnabled: boolean; // Daily article teaser
  streakRemindersEnabled: boolean;
}

const DEFAULT_SETTINGS: NotificationSettings = {
  enabled: true,
  morningRitualTime: { hour: 7, minute: 0 },
  eveningReflectionTime: { hour: 21, minute: 0 },
  dailyWisdomEnabled: true,
  dailyInsightEnabled: true, // Show daily article teaser at 12 PM
  streakRemindersEnabled: true,
};

// Notification content templates
const NOTIFICATION_TEMPLATES = {
  morning_ritual: [
    {
      title: "☀️ Good Morning, Seeker",
      body: "Time for your daily body weather check. What does your body reveal today?",
    },
    {
      title: "🌅 Rise with the Sun",
      body: "Start your day with mindful observation. Your tongue, eyes, and skin tell a story.",
    },
    {
      title: "🧘 Morning Ritual Awaits",
      body: "A few minutes of self-observation can transform your entire day.",
    },
    {
      title: "✨ New Day, New Insights",
      body: "Check your body weather and maintain your wellness streak!",
    },
  ],
  streak_reminder: [
    {
      title: "🔥 Don't Break Your Streak!",
      body: "You haven't done your daily scan yet. Your streak is waiting!",
    },
    {
      title: "⏰ Streak Alert",
      body: "Complete your body weather check before midnight to keep your streak alive!",
    },
  ],
  evening_reflection: [
    {
      title: "🌙 Evening Reflection",
      body: "How did your body feel today? Track your Ojas before bed.",
    },
    {
      title: "🌟 Day's End Wisdom",
      body: "Reflect on your wellness journey today. Every observation counts.",
    },
  ],
};

/**
 * Get today's wisdom quote
 */
export function getTodaysWisdom(): typeof DAILY_WISDOM_QUOTES[0] {
  const today = new Date();
  const dayOfYear = Math.floor(
    (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000
  );
  const index = dayOfYear % DAILY_WISDOM_QUOTES.length;
  return DAILY_WISDOM_QUOTES[index];
}

/**
 * Get today's insight headline
 */
export function getTodaysInsight(): string {
  const today = new Date();
  const dayOfYear = Math.floor(
    (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000
  );
  return DAILY_INSIGHTS[dayOfYear % DAILY_INSIGHTS.length];
}

/**
 * Get a random notification template for a given type
 */
function getNotificationTemplate(type: NotificationType): { title: string; body: string } {
  if (type === 'daily_wisdom') {
    const wisdom = getTodaysWisdom();
    return {
      title: "📜 Daily Wisdom",
      body: `"${wisdom.quote}" - ${wisdom.source}`,
    };
  }

  if (type === 'daily_insight') {
    const insight = getTodaysInsight();
    return {
      title: "📖 Today's Insight",
      body: `${insight} - Tap to learn more`,
    };
  }

  const templates = NOTIFICATION_TEMPLATES[type] || NOTIFICATION_TEMPLATES.morning_ritual;
  const randomIndex = Math.floor(Math.random() * templates.length);
  return templates[randomIndex];
}

/**
 * Load notification settings from storage
 */
export async function getNotificationSettings(): Promise<NotificationSettings> {
  try {
    const stored = await AsyncStorage.getItem(STORAGE_KEYS.notificationSettings);
    if (stored) {
      return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) };
    }
    return DEFAULT_SETTINGS;
  } catch {
    return DEFAULT_SETTINGS;
  }
}

/**
 * Save notification settings
 */
export async function saveNotificationSettings(settings: Partial<NotificationSettings>): Promise<void> {
  try {
    const current = await getNotificationSettings();
    const updated = { ...current, ...settings };
    await AsyncStorage.setItem(STORAGE_KEYS.notificationSettings, JSON.stringify(updated));
  } catch (error) {
    console.error('Failed to save notification settings:', error);
  }
}

/**
 * Check if notifications are supported
 */
export async function areNotificationsSupported(): Promise<boolean> {
  return Device.isDevice && (Platform.OS === 'ios' || Platform.OS === 'android');
}

/**
 * Request notification permissions
 */
export async function requestNotificationPermissions(): Promise<boolean> {
  try {
    if (!Device.isDevice) {
      console.log('Notifications require a physical device');
      return false;
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      console.log('Notification permissions not granted');
      return false;
    }

    // Required for Android
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'NayaVed Reminders',
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#E34234',
      });
    }

    return true;
  } catch (error) {
    console.error('Error requesting notification permissions:', error);
    return false;
  }
}

/**
 * Schedule morning ritual notification
 */
export async function scheduleMorningRitualNotification(): Promise<void> {
  const settings = await getNotificationSettings();
  if (!settings.enabled) return;

  try {
    // Cancel existing morning ritual notification
    await Notifications.cancelScheduledNotificationAsync(NOTIFICATION_IDS.morningRitual);

    const template = getNotificationTemplate('morning_ritual');

    await Notifications.scheduleNotificationAsync({
      identifier: NOTIFICATION_IDS.morningRitual,
      content: {
        title: template.title,
        body: template.body,
        data: { type: 'morning_ritual', screen: 'Home' },
        sound: true,
      },
      trigger: {
        type: SchedulableTriggerInputTypes.DAILY,
        hour: settings.morningRitualTime.hour,
        minute: settings.morningRitualTime.minute,
      },
    });

    console.log('Morning ritual notification scheduled for', settings.morningRitualTime);
  } catch (error) {
    console.error('Failed to schedule morning ritual notification:', error);
  }
}

/**
 * Schedule daily wisdom notification
 */
export async function scheduleDailyWisdomNotification(): Promise<void> {
  const settings = await getNotificationSettings();
  if (!settings.enabled || !settings.dailyWisdomEnabled) return;

  try {
    // Cancel existing wisdom notification
    await Notifications.cancelScheduledNotificationAsync(NOTIFICATION_IDS.dailyWisdom);

    const template = getNotificationTemplate('daily_wisdom');

    // Schedule 30 minutes after morning ritual
    const wisdomHour = settings.morningRitualTime.minute >= 30
      ? settings.morningRitualTime.hour + 1
      : settings.morningRitualTime.hour;
    const wisdomMinute = (settings.morningRitualTime.minute + 30) % 60;

    await Notifications.scheduleNotificationAsync({
      identifier: NOTIFICATION_IDS.dailyWisdom,
      content: {
        title: template.title,
        body: template.body,
        data: { type: 'daily_wisdom' },
        sound: true,
      },
      trigger: {
        type: SchedulableTriggerInputTypes.DAILY,
        hour: wisdomHour,
        minute: wisdomMinute,
      },
    });

    console.log('Daily wisdom notification scheduled for', { hour: wisdomHour, minute: wisdomMinute });
  } catch (error) {
    console.error('Failed to schedule daily wisdom notification:', error);
  }
}

/**
 * Schedule daily insight notification (article teaser)
 */
export async function scheduleDailyInsightNotification(): Promise<void> {
  const settings = await getNotificationSettings();
  if (!settings.enabled || !settings.dailyInsightEnabled) return;

  try {
    // Cancel existing insight notification
    await Notifications.cancelScheduledNotificationAsync(NOTIFICATION_IDS.dailyInsight);

    const template = getNotificationTemplate('daily_insight');

    // Schedule for 12 PM (noon) - good time for a content teaser
    await Notifications.scheduleNotificationAsync({
      identifier: NOTIFICATION_IDS.dailyInsight,
      content: {
        title: template.title,
        body: template.body,
        data: { type: 'daily_insight', screen: 'Home' },
        sound: true,
      },
      trigger: {
        type: SchedulableTriggerInputTypes.DAILY,
        hour: 12,
        minute: 0,
      },
    });

    console.log('Daily insight notification scheduled for 12:00 PM');
  } catch (error) {
    console.error('Failed to schedule daily insight notification:', error);
  }
}

/**
 * Schedule streak reminder notification
 */
export async function scheduleStreakReminderNotification(): Promise<void> {
  const settings = await getNotificationSettings();
  if (!settings.enabled || !settings.streakRemindersEnabled) return;

  try {
    // Cancel existing streak reminder
    await Notifications.cancelScheduledNotificationAsync(NOTIFICATION_IDS.streakReminder);

    const template = getNotificationTemplate('streak_reminder');

    // Schedule for evening (9 PM by default)
    await Notifications.scheduleNotificationAsync({
      identifier: NOTIFICATION_IDS.streakReminder,
      content: {
        title: template.title,
        body: template.body,
        data: { type: 'streak_reminder', screen: 'Home' },
        sound: true,
      },
      trigger: {
        type: SchedulableTriggerInputTypes.DAILY,
        hour: settings.eveningReflectionTime.hour,
        minute: settings.eveningReflectionTime.minute,
      },
    });

    console.log('Streak reminder notification scheduled for', settings.eveningReflectionTime);
  } catch (error) {
    console.error('Failed to schedule streak reminder notification:', error);
  }
}

/**
 * Cancel all scheduled notifications
 */
export async function cancelAllNotifications(): Promise<void> {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
    console.log('All notifications cancelled');
  } catch (error) {
    console.error('Failed to cancel notifications:', error);
  }
}

/**
 * Cancel specific notification by identifier
 */
export async function cancelNotification(identifier: string): Promise<void> {
  try {
    await Notifications.cancelScheduledNotificationAsync(identifier);
    console.log(`Notification ${identifier} cancelled`);
  } catch (error) {
    console.error(`Failed to cancel notification ${identifier}:`, error);
  }
}

/**
 * Get all scheduled notifications (for debugging)
 */
export async function getScheduledNotifications(): Promise<Notifications.NotificationRequest[]> {
  try {
    return await Notifications.getAllScheduledNotificationsAsync();
  } catch (error) {
    console.error('Failed to get scheduled notifications:', error);
    return [];
  }
}

/**
 * Initialize notifications on app startup
 */
export async function initializeNotifications(): Promise<void> {
  try {
    const supported = await areNotificationsSupported();
    if (!supported) {
      console.log('Notifications not supported on this platform/device');
      return;
    }

    const settings = await getNotificationSettings();
    if (!settings.enabled) {
      console.log('Notifications disabled by user');
      return;
    }

    const hasPermission = await requestNotificationPermissions();
    if (!hasPermission) {
      console.log('Notification permissions denied');
      return;
    }

    // Cancel all existing and reschedule
    await cancelAllNotifications();

    // Schedule daily notifications
    await scheduleMorningRitualNotification();
    await scheduleDailyWisdomNotification();
    await scheduleDailyInsightNotification();
    await scheduleStreakReminderNotification();

    console.log('Notifications initialized successfully');
  } catch (error) {
    console.error('Failed to initialize notifications:', error);
  }
}

/**
 * Set up notification response listener
 * Call this in your app's root component
 */
export function setupNotificationResponseListener(
  onNotificationPress: (type: NotificationType, data: any) => void
): () => void {
  const subscription = Notifications.addNotificationResponseReceivedListener((response) => {
    const data = response.notification.request.content.data;
    const type = data?.type as NotificationType;
    onNotificationPress(type, data);
  });

  return () => subscription.remove();
}

/**
 * Get all daily wisdom quotes (for settings preview)
 */
export function getAllWisdomQuotes() {
  return DAILY_WISDOM_QUOTES;
}
