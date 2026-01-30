/**
 * StreakBanner Component
 *
 * Displays the user's scan streak and daily check-in status
 * Vertical card design matching original diagnostics style
 */

import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons, MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import { ManuscriptColors, ManuscriptFonts } from './ManuscriptConstants';
import {
  getStreakData,
  getScanHistory,
  StreakData,
} from '../services/dailyRitualService';

// Check-in sequence - vibrant bright colors
const CHECKIN_SEQUENCE = [
  {
    type: 'tongue',
    label: 'Tongue',
    title: 'Tongue Scan',
    subtitle: 'Jihva Pariksha - Daily tongue check',
    screen: 'TongueDiagnosis',
    icon: 'account-voice',
    bgColor: '#4CD964', // Vibrant green
    borderColor: '#2ECC71',
  },
  {
    type: 'eye',
    label: 'Eyes',
    title: 'Eye Scan',
    subtitle: 'Netra Pariksha - Check eye health',
    screen: 'EyeAnalysis',
    icon: 'eye-outline',
    iconFamily: 'Ionicons',
    bgColor: '#5AC8FA', // Vibrant sky blue
    borderColor: '#007AFF',
  },
  {
    type: 'skin',
    label: 'Skin',
    title: 'Facial Scan',
    subtitle: 'Twak Pariksha - Check skin health',
    screen: 'SkinAnalysis',
    icon: 'face-woman-shimmer',
    bgColor: '#FFCC00', // Vibrant golden yellow
    borderColor: '#FF9500',
  },
  {
    type: 'nail',
    label: 'Nails',
    title: 'Nail Scan',
    subtitle: 'Nakha Pariksha - Mineral health',
    screen: 'NailAnalysis',
    icon: 'hand-back-right-outline',
    bgColor: '#AF52DE', // Vibrant purple
    borderColor: '#8B44AC',
  },
  {
    type: 'pulse',
    label: 'Pulse',
    title: 'Pulse Check',
    subtitle: 'Nadi Pariksha - Heart patterns',
    screen: 'PulseAnalysis',
    icon: 'heart-pulse',
    bgColor: '#FF6B9D', // Vibrant pink
    borderColor: '#E91E8C',
  },
];

interface StreakBannerProps {
  onStartRitual?: (screen: string) => void;
  compact?: boolean;
}

export default function StreakBanner({ onStartRitual, compact = false }: StreakBannerProps) {
  const [streakData, setStreakData] = useState<StreakData | null>(null);
  const [todayScans, setTodayScans] = useState<string[]>([]);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const loadData = async () => {
    const [streak, history] = await Promise.all([
      getStreakData(),
      getScanHistory(undefined, 20),
    ]);

    setStreakData(streak);

    const today = new Date().toISOString().split('T')[0];
    const todayTypes = history
      .filter(s => s.date === today)
      .map(s => s.type);
    setTodayScans([...new Set(todayTypes)]);
  };

  const getNextCheckin = () => {
    for (const step of CHECKIN_SEQUENCE) {
      if (!todayScans.includes(step.type)) {
        return step;
      }
    }
    return null;
  };

  const nextCheckin = getNextCheckin();
  const completedCount = CHECKIN_SEQUENCE.filter(s => todayScans.includes(s.type)).length;
  const totalSteps = CHECKIN_SEQUENCE.length;
  const allComplete = completedCount === totalSteps;

  if (!streakData) return null;

  if (compact) {
    return (
      <View style={styles.compactContainer}>
        <Ionicons name="flame" size={18} color={streakData.currentStreak > 0 ? '#FF6B35' : '#9E9E9E'} />
        <Text style={styles.compactStreakText}>{streakData.currentStreak}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.title}>Daily Check-in</Text>
          <Text style={styles.subtitle}>
            {allComplete ? 'All done for today!' : `${completedCount}/${totalSteps} scans complete`}
          </Text>
        </View>
        <View style={styles.streakBadge}>
          <Ionicons name="flame" size={20} color="#FF6B35" />
          <Text style={styles.streakNumber}>{streakData.currentStreak}</Text>
        </View>
      </View>

      {/* Vertical Scan Cards - Only show incomplete scans */}
      {CHECKIN_SEQUENCE
        .filter((step) => !todayScans.includes(step.type))
        .map((step) => (
          <TouchableOpacity
            key={step.type}
            style={[
              styles.card,
              { backgroundColor: step.bgColor, borderColor: step.borderColor },
            ]}
            onPress={() => onStartRitual?.(step.screen)}
            activeOpacity={0.85}
          >
            <View style={styles.cardHeader}>
              <View style={styles.cardIconContainer}>
                {step.iconFamily === 'Ionicons' ? (
                  <Ionicons name={step.icon as any} size={40} color="#000000" />
                ) : (
                  <MaterialCommunityIcons name={step.icon as any} size={40} color="#000000" />
                )}
              </View>
              <View style={styles.cardTextContainer}>
                <Text style={styles.cardTitle}>{step.title}</Text>
                <Text style={styles.cardSubtitle}>{step.subtitle}</Text>
              </View>
            </View>
            <View style={styles.cardCTA}>
              <Text style={styles.cardCTAText}>Start Scan</Text>
              <Feather
                name="arrow-right"
                size={16}
                color="#000000"
                style={{ marginLeft: 6 }}
              />
            </View>
          </TouchableOpacity>
        ))}

      {/* All Complete Banner - Shows when all scans are done */}
      {allComplete && (
        <View style={styles.completeBanner}>
          <MaterialCommunityIcons name="trophy-award" size={28} color={ManuscriptColors.goldLeaf} />
          <Text style={styles.completeText}>All scans complete for today!</Text>
        </View>
      )}

      {/* Partial progress - show completed count when some are done but not all */}
      {!allComplete && completedCount > 0 && (
        <View style={styles.progressNote}>
          <Ionicons name="checkmark-circle" size={18} color="#10B981" />
          <Text style={styles.progressNoteText}>
            {completedCount} scan{completedCount > 1 ? 's' : ''} completed today
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  compactContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  compactStreakText: {
    fontSize: 14,
    fontWeight: '600',
    color: ManuscriptColors.inkBlack,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerLeft: {
    flex: 1,
  },
  title: {
    fontSize: ManuscriptFonts.headingSize,
    fontWeight: 'bold',
    fontFamily: ManuscriptFonts.heading,
    color: ManuscriptColors.inkBlack,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: ManuscriptFonts.captionSize,
    color: ManuscriptColors.fadedInk,
    fontStyle: 'italic',
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: ManuscriptColors.parchment,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: ManuscriptColors.goldLeaf,
    gap: 6,
  },
  streakNumber: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FF6B35',
  },
  // Bright colorful card style (like Ojas tracker)
  card: {
    borderRadius: 8,
    padding: 20,
    marginBottom: 12,
    borderWidth: 3,
    shadowColor: ManuscriptColors.scrollShadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  cardCompleted: {
    opacity: 0.8,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  cardTextContainer: {
    flex: 1,
  },
  cardTitle: {
    fontSize: ManuscriptFonts.subheadingSize,
    fontWeight: 'bold',
    fontFamily: ManuscriptFonts.heading,
    color: '#000000',
    marginBottom: 6,
  },
  cardSubtitle: {
    fontSize: ManuscriptFonts.captionSize,
    fontFamily: ManuscriptFonts.body,
    color: '#000000',
    lineHeight: 18,
  },
  cardCTA: {
    backgroundColor: ManuscriptColors.parchment,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardCTAText: {
    color: ManuscriptColors.copperBrown,
    fontWeight: 'bold',
    fontFamily: ManuscriptFonts.body,
    fontSize: ManuscriptFonts.captionSize,
  },
  cardCTACompleted: {
    backgroundColor: '#ECFDF5',
    borderWidth: 2,
    borderColor: '#10B981',
  },
  cardCTATextCompleted: {
    color: '#059669',
  },
  completeBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: ManuscriptColors.parchment,
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: ManuscriptColors.goldLeaf,
    gap: 12,
    marginTop: 12,
  },
  completeText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },
  progressNote: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    gap: 8,
  },
  progressNoteText: {
    fontSize: 14,
    color: '#10B981',
    fontWeight: '500',
  },
});
