import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ManuscriptCard from '../components/ManuscriptCard';
import { ManuscriptColors, ManuscriptFonts, BorderPatterns } from '../components/ManuscriptConstants';
import { useSubscription } from '../context/SubscriptionContext';

interface PaywallScreenProps {
  visible: boolean;
  onClose: () => void;
  feature?: string; // e.g., "Pulse Analysis", "Tongue Diagnosis"
}

export default function PaywallScreen({ visible, onClose, feature }: PaywallScreenProps) {
  const { upgradeToPremium } = useSubscription();
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'annual'>('annual');

  const plans = {
    monthly: {
      price: '$9.99',
      period: 'month',
      savings: null,
    },
    annual: {
      price: '$79.99',
      period: 'year',
      savings: 'Save 33%',
      perMonth: '$6.67/mo',
    },
  };

  const premiumFeatures = [
    {
      icon: 'infinite',
      title: 'Unlimited Scans',
      description: 'Pulse, tongue, skin, eye & nail analysis - as many as you need',
    },
    {
      icon: 'body',
      title: 'Full Body Map Access',
      description: 'Interactive 4-component Ayurvedic anatomy visualization',
    },
    {
      icon: 'sparkles',
      title: 'Advanced Ojas Tracking',
      description: 'Detailed trends, insights & personalized recommendations',
    },
    {
      icon: 'calendar',
      title: 'Personalized Plans',
      description: 'Daily & weekly routines tailored to your dosha',
    },
    {
      icon: 'medical',
      title: 'Herb Recommendations',
      description: 'Specific supplements with affiliate pharmacy discounts',
    },
    {
      icon: 'document-text',
      title: 'Export Reports',
      description: 'Download health reports as PDF to share with practitioners',
    },
    {
      icon: 'book',
      title: 'Premium Content',
      description: 'Exclusive articles, recipes & Ayurvedic wisdom',
    },
    {
      icon: 'person',
      title: 'Practitioner Booking',
      description: 'Connect with verified Ayurvedic practitioners',
    },
  ];

  const handleSubscribe = async () => {
    // In production, this would trigger actual in-app purchase
    // For now, we'll just upgrade the tier
    await upgradeToPremium();
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {/* Close button */}
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Ionicons name="close" size={28} color={ManuscriptColors.inkBlack} />
        </TouchableOpacity>

        <ScrollView contentContainerStyle={styles.content}>
          {/* Header */}
          <Text style={styles.title}>Unlock Full Access</Text>
          {feature && (
            <Text style={styles.subtitle}>
              {feature} requires a Premium subscription
            </Text>
          )}

          <Text style={styles.decorativeText}>{BorderPatterns.lotus}</Text>

          {/* Free vs Premium Comparison */}
          <ManuscriptCard ornament="om" style={{ marginBottom: 20 }}>
            <View style={styles.comparisonRow}>
              <Text style={styles.comparisonLabel}>Free Tier</Text>
              <Text style={styles.comparisonLabel}>Premium</Text>
            </View>

            <View style={styles.comparisonRow}>
              <Text style={styles.comparisonValue}>1 scan/day</Text>
              <Text style={[styles.comparisonValue, styles.premiumValue]}>Unlimited ∞</Text>
            </View>

            <View style={styles.comparisonRow}>
              <Text style={styles.comparisonValue}>Basic features</Text>
              <Text style={[styles.comparisonValue, styles.premiumValue]}>All features</Text>
            </View>

            <View style={styles.comparisonRow}>
              <Text style={styles.comparisonValue}>Limited plans</Text>
              <Text style={[styles.comparisonValue, styles.premiumValue]}>Personalized</Text>
            </View>
          </ManuscriptCard>

          {/* Plan Selection */}
          <Text style={styles.sectionTitle}>Choose Your Plan</Text>

          <TouchableOpacity
            style={[
              styles.planCard,
              selectedPlan === 'annual' && styles.planCardSelected,
            ]}
            onPress={() => setSelectedPlan('annual')}
          >
            {plans.annual.savings && (
              <View style={styles.savingsBadge}>
                <Text style={styles.savingsText}>{plans.annual.savings}</Text>
              </View>
            )}
            <View style={styles.planHeader}>
              <Text style={styles.planTitle}>Annual</Text>
              <View>
                <Text style={styles.planPrice}>{plans.annual.price}</Text>
                <Text style={styles.planPeriod}>{plans.annual.perMonth}</Text>
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.planCard,
              selectedPlan === 'monthly' && styles.planCardSelected,
            ]}
            onPress={() => setSelectedPlan('monthly')}
          >
            <View style={styles.planHeader}>
              <Text style={styles.planTitle}>Monthly</Text>
              <View>
                <Text style={styles.planPrice}>{plans.monthly.price}</Text>
                <Text style={styles.planPeriod}>per {plans.monthly.period}</Text>
              </View>
            </View>
          </TouchableOpacity>

          {/* Features List */}
          <Text style={styles.sectionTitle}>Premium Features</Text>

          {premiumFeatures.map((feature, index) => (
            <View key={index} style={styles.featureRow}>
              <Ionicons name={feature.icon as any} size={24} color={ManuscriptColors.vermillion} />
              <View style={styles.featureText}>
                <Text style={styles.featureTitle}>{feature.title}</Text>
                <Text style={styles.featureDescription}>{feature.description}</Text>
              </View>
            </View>
          ))}

          {/* Subscribe Button */}
          <TouchableOpacity style={styles.subscribeButton} onPress={handleSubscribe}>
            <Text style={styles.subscribeButtonText}>
              Start 7-Day Free Trial
            </Text>
            <Text style={styles.subscribeButtonSubtext}>
              Then {plans[selectedPlan].price}/{plans[selectedPlan].period} • Cancel Anytime
            </Text>
          </TouchableOpacity>

          {/* Legal Text */}
          <Text style={styles.legalText}>
            Payment will be charged to your App Store account. Subscription automatically renews unless
            auto-renew is turned off at least 24 hours before the end of the current period.
          </Text>
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: ManuscriptColors.parchment,
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 10,
    padding: 8,
  },
  content: {
    padding: 20,
    paddingTop: 80,
    paddingBottom: 40,
  },
  title: {
    fontSize: ManuscriptFonts.titleSize,
    fontFamily: ManuscriptFonts.heading,
    fontWeight: 'bold',
    color: ManuscriptColors.inkBlack,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: ManuscriptFonts.bodySize,
    fontFamily: ManuscriptFonts.body,
    color: ManuscriptColors.fadedInk,
    textAlign: 'center',
    marginBottom: 16,
  },
  decorativeText: {
    fontSize: 32,
    textAlign: 'center',
    color: ManuscriptColors.turmeric,
    marginBottom: 20,
  },
  comparisonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: ManuscriptColors.goldLeaf,
  },
  comparisonLabel: {
    fontSize: ManuscriptFonts.bodySize,
    fontFamily: ManuscriptFonts.heading,
    fontWeight: 'bold',
    color: ManuscriptColors.inkBlack,
    flex: 1,
    textAlign: 'center',
  },
  comparisonValue: {
    fontSize: ManuscriptFonts.captionSize,
    fontFamily: ManuscriptFonts.body,
    color: ManuscriptColors.fadedInk,
    flex: 1,
    textAlign: 'center',
  },
  premiumValue: {
    color: ManuscriptColors.vermillion,
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: ManuscriptFonts.headingSize,
    fontFamily: ManuscriptFonts.heading,
    fontWeight: 'bold',
    color: ManuscriptColors.inkBlack,
    marginTop: 24,
    marginBottom: 16,
    textAlign: 'center',
  },
  planCard: {
    backgroundColor: ManuscriptColors.oldPaper,
    borderRadius: 12,
    padding: 20,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: ManuscriptColors.copperBrown,
    position: 'relative',
  },
  planCardSelected: {
    borderColor: ManuscriptColors.vermillion,
    borderWidth: 3,
    backgroundColor: ManuscriptColors.parchment,
  },
  savingsBadge: {
    position: 'absolute',
    top: -10,
    right: 20,
    backgroundColor: ManuscriptColors.vermillion,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  savingsText: {
    color: '#FFFFFF',
    fontSize: ManuscriptFonts.smallSize,
    fontFamily: ManuscriptFonts.body,
    fontWeight: 'bold',
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  planTitle: {
    fontSize: ManuscriptFonts.subheadingSize,
    fontFamily: ManuscriptFonts.heading,
    fontWeight: 'bold',
    color: ManuscriptColors.inkBlack,
  },
  planPrice: {
    fontSize: ManuscriptFonts.headingSize,
    fontFamily: ManuscriptFonts.heading,
    fontWeight: 'bold',
    color: ManuscriptColors.vermillion,
    textAlign: 'right',
  },
  planPeriod: {
    fontSize: ManuscriptFonts.captionSize,
    fontFamily: ManuscriptFonts.body,
    color: ManuscriptColors.fadedInk,
    textAlign: 'right',
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  featureText: {
    flex: 1,
    marginLeft: 12,
  },
  featureTitle: {
    fontSize: ManuscriptFonts.bodySize,
    fontFamily: ManuscriptFonts.body,
    fontWeight: 'bold',
    color: ManuscriptColors.inkBlack,
    marginBottom: 2,
  },
  featureDescription: {
    fontSize: ManuscriptFonts.captionSize,
    fontFamily: ManuscriptFonts.body,
    color: ManuscriptColors.fadedInk,
    lineHeight: 18,
  },
  subscribeButton: {
    backgroundColor: ManuscriptColors.vermillion,
    paddingVertical: 18,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginTop: 24,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: ManuscriptColors.goldLeaf,
    shadowColor: ManuscriptColors.scrollShadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  subscribeButtonText: {
    color: '#FFFFFF',
    fontSize: ManuscriptFonts.subheadingSize,
    fontFamily: ManuscriptFonts.heading,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  subscribeButtonSubtext: {
    color: '#FFFFFF',
    fontSize: ManuscriptFonts.captionSize,
    fontFamily: ManuscriptFonts.body,
    textAlign: 'center',
    marginTop: 4,
    opacity: 0.9,
  },
  legalText: {
    fontSize: ManuscriptFonts.smallSize,
    fontFamily: ManuscriptFonts.body,
    color: ManuscriptColors.fadedInk,
    textAlign: 'center',
    lineHeight: 16,
  },
});
