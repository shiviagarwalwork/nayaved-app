/**
 * ============================================================
 * Premium Lock Component
 * ============================================================
 *
 * Displays a locked state for premium content with an upgrade CTA.
 * Used to implement the "Curiosity Gap" - showing observations free
 * but locking detailed protocols/recommendations behind premium.
 *
 * USAGE:
 * - Wrap premium content sections (recommendations, protocols)
 * - Shows blurred preview with upgrade button for free users
 * - Shows full content for premium/developer users
 *
 * @author NayaVed Team
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useSubscription } from '../context/SubscriptionContext';
import { ManuscriptColors } from './ManuscriptConstants';

interface PremiumLockProps {
  /** Title shown in the locked state */
  title?: string;
  /** Description of what's locked */
  description?: string;
  /** Number of items locked (e.g., "5 recommendations") */
  itemCount?: number;
  /** Type of locked content for display */
  contentType?: 'recommendations' | 'protocols' | 'interpretation' | 'analysis';
  /** Children to render when unlocked */
  children: React.ReactNode;
  /** Optional custom locked state preview */
  previewContent?: React.ReactNode;
}

export default function PremiumLock({
  title,
  description,
  itemCount,
  contentType = 'recommendations',
  children,
  previewContent,
}: PremiumLockProps) {
  const navigation = useNavigation<any>();
  const { isPremium, isDeveloper } = useSubscription();

  // Premium and developer users see full content
  if (isPremium || isDeveloper) {
    return <>{children}</>;
  }

  // Free users see locked state
  const getContentLabel = () => {
    switch (contentType) {
      case 'recommendations':
        return itemCount ? `${itemCount} personalized recommendations` : 'Personalized recommendations';
      case 'protocols':
        return itemCount ? `${itemCount} Ayurvedic protocols` : 'Ayurvedic protocols';
      case 'interpretation':
        return 'Detailed Ayurvedic interpretation';
      case 'analysis':
        return 'In-depth analysis';
      default:
        return 'Premium content';
    }
  };

  const getIcon = () => {
    switch (contentType) {
      case 'recommendations':
        return 'checkmark-circle-outline';
      case 'protocols':
        return 'leaf-outline';
      case 'interpretation':
        return 'book-outline';
      case 'analysis':
        return 'analytics-outline';
      default:
        return 'lock-closed-outline';
    }
  };

  return (
    <View style={styles.lockedContainer}>
      {/* Preview content (blurred/faded) */}
      {previewContent && (
        <View style={styles.previewContainer}>
          {previewContent}
          <View style={styles.blurOverlay} />
        </View>
      )}

      {/* Locked state card */}
      <View style={styles.lockedCard}>
        <View style={styles.lockIconContainer}>
          <MaterialCommunityIcons
            name="lock-outline"
            size={32}
            color={ManuscriptColors.goldLeaf}
          />
        </View>

        <Text style={styles.lockedTitle}>
          {title || 'Unlock Full Analysis'}
        </Text>

        <View style={styles.contentPreview}>
          <Ionicons
            name={getIcon() as any}
            size={18}
            color={ManuscriptColors.fadedInk}
          />
          <Text style={styles.contentLabel}>{getContentLabel()}</Text>
        </View>

        {description && (
          <Text style={styles.lockedDescription}>{description}</Text>
        )}

        <View style={styles.benefitsRow}>
          <View style={styles.benefitItem}>
            <Ionicons name="infinite" size={16} color={ManuscriptColors.vermillion} />
            <Text style={styles.benefitText}>Unlimited scans</Text>
          </View>
          <View style={styles.benefitItem}>
            <Ionicons name="chatbubbles-outline" size={16} color={ManuscriptColors.vermillion} />
            <Text style={styles.benefitText}>AI chat</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.upgradeButton}
          onPress={() => navigation.navigate('Paywall')}
        >
          <MaterialCommunityIcons name="crown" size={18} color="#FFFFFF" />
          <Text style={styles.upgradeButtonText}>Unlock Premium</Text>
        </TouchableOpacity>

        <Text style={styles.pricingHint}>
          Start your wellness journey today
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  lockedContainer: {
    marginBottom: 12,
  },
  previewContainer: {
    position: 'relative',
    overflow: 'hidden',
    borderRadius: 12,
    maxHeight: 100,
  },
  blurOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 248, 231, 0.85)',
  },
  lockedCard: {
    backgroundColor: ManuscriptColors.oldPaper,
    padding: 20,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: ManuscriptColors.goldLeaf,
    borderStyle: 'dashed',
    alignItems: 'center',
  },
  lockIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(218, 165, 32, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  lockedTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: ManuscriptColors.inkBlack,
    marginBottom: 8,
    textAlign: 'center',
  },
  contentPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 6,
  },
  contentLabel: {
    fontSize: 14,
    color: ManuscriptColors.fadedInk,
    fontStyle: 'italic',
  },
  lockedDescription: {
    fontSize: 13,
    color: ManuscriptColors.inkBrown,
    textAlign: 'center',
    marginBottom: 12,
    lineHeight: 19,
  },
  benefitsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    marginBottom: 16,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  benefitText: {
    fontSize: 12,
    color: ManuscriptColors.inkBrown,
  },
  upgradeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: ManuscriptColors.vermillion,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    gap: 8,
    width: '100%',
  },
  upgradeButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  pricingHint: {
    fontSize: 11,
    color: ManuscriptColors.fadedInk,
    marginTop: 8,
    fontStyle: 'italic',
  },
});
