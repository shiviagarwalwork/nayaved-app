/**
 * ============================================================
 * Notification Settings Component
 * ============================================================
 *
 * Allows users to configure push notification preferences:
 * - Enable/disable notifications
 * - Set morning ritual reminder time
 * - Enable/disable daily wisdom quotes
 * - Enable/disable streak reminders
 *
 * @author NayaVed Team
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Switch,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import {
  NotificationSettings as NotificationSettingsType,
  getNotificationSettings,
  saveNotificationSettings,
  initializeNotifications,
  cancelAllNotifications,
  getTodaysWisdom,
} from '../services/notificationService';
import { ManuscriptColors } from './ManuscriptConstants';

export default function NotificationSettings() {
  const [settings, setSettings] = useState<NotificationSettingsType | null>(null);
  const [loading, setLoading] = useState(true);
  const [todaysWisdom, setTodaysWisdom] = useState(getTodaysWisdom());

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const loaded = await getNotificationSettings();
      setSettings(loaded);
    } catch (error) {
      console.error('Failed to load notification settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateSetting = async (key: keyof NotificationSettingsType, value: any) => {
    if (!settings) return;

    const updated = { ...settings, [key]: value };
    setSettings(updated);
    await saveNotificationSettings({ [key]: value });

    // Reinitialize notifications if main toggle changed
    if (key === 'enabled') {
      if (value) {
        await initializeNotifications();
        Alert.alert(
          'Notifications Enabled',
          'You will receive daily ritual reminders and wisdom quotes.',
          [{ text: 'OK' }]
        );
      } else {
        await cancelAllNotifications();
      }
    }
  };

  const formatTime = (hour: number, minute: number) => {
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    const displayMinute = minute.toString().padStart(2, '0');
    return `${displayHour}:${displayMinute} ${period}`;
  };

  if (loading || !settings) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading notification settings...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <MaterialCommunityIcons name="bell-ring" size={24} color={ManuscriptColors.vermillion} />
        <Text style={styles.headerTitle}>Notification Settings</Text>
      </View>

      {/* Main Toggle */}
      <View style={styles.settingRow}>
        <View style={styles.settingInfo}>
          <Ionicons name="notifications" size={22} color={ManuscriptColors.inkBrown} />
          <View style={styles.settingTextContainer}>
            <Text style={styles.settingLabel}>Enable Notifications</Text>
            <Text style={styles.settingDescription}>
              Receive daily reminders for your wellness ritual
            </Text>
          </View>
        </View>
        <Switch
          value={settings.enabled}
          onValueChange={(value) => updateSetting('enabled', value)}
          trackColor={{ false: '#D7CCC8', true: ManuscriptColors.vermillion }}
          thumbColor={settings.enabled ? '#FFFFFF' : '#F5F5F5'}
        />
      </View>

      {settings.enabled && (
        <>
          {/* Morning Ritual Time - Fixed at 7:00 AM */}
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Ionicons name="sunny" size={22} color="#FFA726" />
              <View style={styles.settingTextContainer}>
                <Text style={styles.settingLabel}>Morning Ritual Reminder</Text>
                <Text style={styles.settingDescription}>
                  Daily at {formatTime(settings.morningRitualTime.hour, settings.morningRitualTime.minute)}
                </Text>
              </View>
            </View>
          </View>

          {/* Daily Wisdom */}
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <MaterialCommunityIcons name="script-text" size={22} color={ManuscriptColors.goldLeaf} />
              <View style={styles.settingTextContainer}>
                <Text style={styles.settingLabel}>Daily Wisdom Quotes</Text>
                <Text style={styles.settingDescription}>
                  Receive Charaka Samhita wisdom each morning
                </Text>
              </View>
            </View>
            <Switch
              value={settings.dailyWisdomEnabled}
              onValueChange={(value) => updateSetting('dailyWisdomEnabled', value)}
              trackColor={{ false: '#D7CCC8', true: ManuscriptColors.goldLeaf }}
              thumbColor={settings.dailyWisdomEnabled ? '#FFFFFF' : '#F5F5F5'}
            />
          </View>

          {/* Daily Insight */}
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <MaterialCommunityIcons name="book-open-page-variant" size={22} color={ManuscriptColors.vermillion} />
              <View style={styles.settingTextContainer}>
                <Text style={styles.settingLabel}>Daily Article Teaser</Text>
                <Text style={styles.settingDescription}>
                  Get a new Ayurvedic insight at noon
                </Text>
              </View>
            </View>
            <Switch
              value={settings.dailyInsightEnabled}
              onValueChange={(value) => updateSetting('dailyInsightEnabled', value)}
              trackColor={{ false: '#D7CCC8', true: ManuscriptColors.vermillion }}
              thumbColor={settings.dailyInsightEnabled ? '#FFFFFF' : '#F5F5F5'}
            />
          </View>

          {/* Streak Reminders */}
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <MaterialCommunityIcons name="fire" size={22} color="#EF4444" />
              <View style={styles.settingTextContainer}>
                <Text style={styles.settingLabel}>Streak Reminders</Text>
                <Text style={styles.settingDescription}>
                  Get reminded if you haven't scanned today
                </Text>
              </View>
            </View>
            <Switch
              value={settings.streakRemindersEnabled}
              onValueChange={(value) => updateSetting('streakRemindersEnabled', value)}
              trackColor={{ false: '#D7CCC8', true: '#EF4444' }}
              thumbColor={settings.streakRemindersEnabled ? '#FFFFFF' : '#F5F5F5'}
            />
          </View>

        </>
      )}

      {/* Setup Instructions */}
      <View style={styles.setupNote}>
        <Ionicons name="information-circle" size={18} color={ManuscriptColors.fadedInk} />
        <Text style={styles.setupNoteText}>
          Notifications require device permissions. Make sure to allow notifications when prompted.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: ManuscriptColors.parchment,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: ManuscriptColors.goldLeaf,
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
  },
  loadingText: {
    color: ManuscriptColors.fadedInk,
    fontStyle: 'italic',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: ManuscriptColors.inkBlack,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  settingTextContainer: {
    flex: 1,
  },
  settingLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: ManuscriptColors.inkBlack,
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 12,
    color: ManuscriptColors.fadedInk,
  },
  timeButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(227, 66, 52, 0.1)',
  },
  wisdomPreview: {
    backgroundColor: ManuscriptColors.oldPaper,
    padding: 16,
    borderRadius: 8,
    marginTop: 16,
    borderLeftWidth: 3,
    borderLeftColor: ManuscriptColors.goldLeaf,
  },
  wisdomPreviewLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: ManuscriptColors.goldLeaf,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  wisdomQuote: {
    fontSize: 14,
    color: ManuscriptColors.inkBrown,
    fontStyle: 'italic',
    lineHeight: 22,
    marginBottom: 8,
  },
  wisdomSource: {
    fontSize: 12,
    color: ManuscriptColors.fadedInk,
    textAlign: 'right',
  },
  setupNote: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 16,
    padding: 12,
    backgroundColor: 'rgba(0,0,0,0.03)',
    borderRadius: 8,
    gap: 8,
  },
  setupNoteText: {
    flex: 1,
    fontSize: 12,
    color: ManuscriptColors.fadedInk,
    lineHeight: 18,
  },
});
