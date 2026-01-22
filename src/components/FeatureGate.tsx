import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import PaywallScreen from '../screens/PaywallScreen';
import { ManuscriptColors, ManuscriptFonts } from './ManuscriptConstants';

interface FeatureGateProps {
  isAllowed: boolean;
  featureName: string;
  usageInfo?: string; // e.g., "1/1 scans used today"
  children: React.ReactNode;
}

export default function FeatureGate({
  isAllowed,
  featureName,
  usageInfo,
  children,
}: FeatureGateProps) {
  const [showPaywall, setShowPaywall] = useState(false);

  if (isAllowed) {
    return <>{children}</>;
  }

  return (
    <View style={styles.container}>
      <View style={styles.lockContainer}>
        <Ionicons name="lock-closed" size={64} color={ManuscriptColors.vermillion} />
        <Text style={styles.title}>Premium Feature</Text>
        <Text style={styles.message}>
          {featureName} requires a Premium subscription
        </Text>
        {usageInfo && (
          <Text style={styles.usageInfo}>{usageInfo}</Text>
        )}
        <TouchableOpacity
          style={styles.upgradeButton}
          onPress={() => setShowPaywall(true)}
        >
          <Text style={styles.upgradeButtonText}>Upgrade to Premium</Text>
        </TouchableOpacity>
      </View>

      <PaywallScreen
        visible={showPaywall}
        onClose={() => setShowPaywall(false)}
        feature={featureName}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: ManuscriptColors.parchment,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  lockContainer: {
    alignItems: 'center',
    backgroundColor: ManuscriptColors.oldPaper,
    padding: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: ManuscriptColors.copperBrown,
    maxWidth: 400,
  },
  title: {
    fontSize: ManuscriptFonts.headingSize,
    fontFamily: ManuscriptFonts.heading,
    fontWeight: 'bold',
    color: ManuscriptColors.inkBlack,
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  message: {
    fontSize: ManuscriptFonts.bodySize,
    fontFamily: ManuscriptFonts.body,
    color: ManuscriptColors.fadedInk,
    textAlign: 'center',
    marginBottom: 8,
    lineHeight: 22,
  },
  usageInfo: {
    fontSize: ManuscriptFonts.captionSize,
    fontFamily: ManuscriptFonts.body,
    color: ManuscriptColors.vermillion,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  upgradeButton: {
    backgroundColor: ManuscriptColors.vermillion,
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: ManuscriptColors.goldLeaf,
  },
  upgradeButtonText: {
    color: '#FFFFFF',
    fontSize: ManuscriptFonts.bodySize,
    fontFamily: ManuscriptFonts.body,
    fontWeight: 'bold',
  },
});
