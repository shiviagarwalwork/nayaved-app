import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Platform,
} from 'react-native';
import { MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import { ManuscriptColors } from '../components/ManuscriptConstants';
import {
  getAvailablePackages,
  purchasePackage,
  restorePurchases,
  isRevenueCatConfigured,
  AvailablePackage,
} from '../services/purchaseService';
import { useSubscription } from '../context/SubscriptionContext';

interface PaywallScreenProps {
  onClose: () => void;
  onSuccess?: () => void;
}

export default function PaywallScreen({ onClose, onSuccess }: PaywallScreenProps) {
  const [packages, setPackages] = useState<AvailablePackage[]>([]);
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  const { refreshStatus } = useSubscription();

  const isConfigured = isRevenueCatConfigured();

  useEffect(() => {
    loadPackages();
  }, []);

  const loadPackages = async () => {
    setIsLoading(true);
    const availablePackages = await getAvailablePackages();
    setPackages(availablePackages);
    if (availablePackages.length > 0) {
      const yearly = availablePackages.find((p) => p.identifier.includes('yearly'));
      setSelectedPackage(yearly?.identifier || availablePackages[0].identifier);
    }
    setIsLoading(false);
  };

  const handlePurchase = async () => {
    if (!isConfigured) {
      Alert.alert(
        'Coming Soon',
        'In-app purchases will be available when the app launches on the App Store. For now, contact us for early access!',
        [{ text: 'OK' }]
      );
      return;
    }

    const pkg = packages.find((p) => p.identifier === selectedPackage);
    if (!pkg || !pkg.package) return;

    setIsPurchasing(true);
    const result = await purchasePackage(pkg.package);
    setIsPurchasing(false);

    if (result.success) {
      await refreshStatus();
      Alert.alert('Success!', 'Welcome to NayaVed Premium!', [
        { text: 'Continue', onPress: onSuccess || onClose },
      ]);
    } else if (!result.cancelled) {
      Alert.alert('Purchase Failed', result.error || 'Please try again.');
    }
  };

  const handleRestore = async () => {
    if (!isConfigured) {
      Alert.alert('Not Available', 'Restore purchases will be available after app launch.');
      return;
    }

    setIsRestoring(true);
    const result = await restorePurchases();
    setIsRestoring(false);

    if (result.success) {
      await refreshStatus();
      Alert.alert('Restored!', 'Your subscription has been restored.', [
        { text: 'Continue', onPress: onSuccess || onClose },
      ]);
    } else {
      Alert.alert('No Subscription Found', 'No active subscription was found.');
    }
  };

  const features = [
    { icon: 'camera', text: 'Unlimited AI diagnostic scans' },
    { icon: 'message-circle', text: 'Unlimited AI consultations' },
    { icon: 'zap', text: 'Priority AI processing' },
    { icon: 'clock', text: 'Extended analysis history' },
    { icon: 'heart', text: 'Support ancient wisdom preservation' },
  ];

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Feather name="x" size={24} color={ManuscriptColors.inkBlack} />
          </TouchableOpacity>
          <View style={styles.crownContainer}>
            <MaterialCommunityIcons name="crown" size={48} color="#FFD700" />
          </View>
          <Text style={styles.title}>Upgrade to Premium</Text>
          <Text style={styles.subtitle}>
            Unlock the full power of 5,000 years of Ayurvedic wisdom
          </Text>
        </View>

        <View style={styles.featuresContainer}>
          {features.map((feature, index) => (
            <View key={index} style={styles.featureRow}>
              <View style={styles.featureIconContainer}>
                <Feather name={feature.icon as any} size={20} color={ManuscriptColors.vermillion} />
              </View>
              <Text style={styles.featureText}>{feature.text}</Text>
            </View>
          ))}
        </View>

        {isLoading ? (
          <ActivityIndicator size="large" color={ManuscriptColors.vermillion} style={styles.loader} />
        ) : (
          <View style={styles.packagesContainer}>
            {packages.map((pkg) => (
              <TouchableOpacity
                key={pkg.identifier}
                style={[
                  styles.packageCard,
                  selectedPackage === pkg.identifier && styles.packageCardSelected,
                ]}
                onPress={() => setSelectedPackage(pkg.identifier)}
              >
                {pkg.identifier.includes('yearly') && (
                  <View style={styles.bestValueBadge}>
                    <Text style={styles.bestValueText}>BEST VALUE</Text>
                  </View>
                )}
                <View style={styles.packageContent}>
                  <View style={styles.radioOuter}>
                    {selectedPackage === pkg.identifier && <View style={styles.radioInner} />}
                  </View>
                  <View style={styles.packageInfo}>
                    <Text style={styles.packageTitle}>{pkg.title}</Text>
                    <Text style={styles.packageDescription}>{pkg.description}</Text>
                  </View>
                  <Text style={styles.packagePrice}>{pkg.priceString}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <TouchableOpacity
          style={[styles.purchaseButton, isPurchasing && styles.purchaseButtonDisabled]}
          onPress={handlePurchase}
          disabled={isPurchasing || !selectedPackage}
        >
          {isPurchasing ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.purchaseButtonText}>
              {isConfigured ? 'Subscribe Now' : 'Coming Soon'}
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity style={styles.restoreButton} onPress={handleRestore} disabled={isRestoring}>
          {isRestoring ? (
            <ActivityIndicator size="small" color={ManuscriptColors.copperBrown} />
          ) : (
            <Text style={styles.restoreText}>Restore Purchases</Text>
          )}
        </TouchableOpacity>

        <Text style={styles.legalText}>
          Payment will be charged to your {Platform.OS === 'ios' ? 'Apple ID' : 'Google Play'} account. 
          Subscription automatically renews unless cancelled at least 24 hours before the end of the current period.
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: ManuscriptColors.palmLeaf },
  content: { padding: 20, paddingBottom: 40 },
  header: { alignItems: 'center', marginBottom: 24 },
  closeButton: { position: 'absolute', top: 0, right: 0, padding: 8, zIndex: 10 },
  crownContainer: {
    width: 80, height: 80, borderRadius: 40, backgroundColor: '#FFF8E1',
    justifyContent: 'center', alignItems: 'center', marginBottom: 16,
    borderWidth: 3, borderColor: '#FFD700',
  },
  title: {
    fontSize: 28, fontWeight: 'bold', color: ManuscriptColors.inkBlack, marginBottom: 8,
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
  },
  subtitle: { fontSize: 16, color: ManuscriptColors.inkBrown, textAlign: 'center', lineHeight: 22 },
  featuresContainer: {
    backgroundColor: ManuscriptColors.parchment, borderRadius: 16, padding: 20, marginBottom: 24,
    borderWidth: 1, borderColor: ManuscriptColors.goldLeaf,
  },
  featureRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 14 },
  featureIconContainer: {
    width: 36, height: 36, borderRadius: 18, backgroundColor: ManuscriptColors.oldPaper,
    justifyContent: 'center', alignItems: 'center', marginRight: 14,
  },
  featureText: { fontSize: 15, color: ManuscriptColors.inkBlack, flex: 1 },
  loader: { marginVertical: 40 },
  packagesContainer: { marginBottom: 20 },
  packageCard: {
    backgroundColor: ManuscriptColors.parchment, borderRadius: 12, padding: 16, marginBottom: 12,
    borderWidth: 2, borderColor: ManuscriptColors.copperBrown,
  },
  packageCardSelected: { borderColor: ManuscriptColors.vermillion, backgroundColor: '#FFF8E7' },
  bestValueBadge: {
    position: 'absolute', top: -10, right: 16, backgroundColor: ManuscriptColors.vermillion,
    paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10,
  },
  bestValueText: { color: '#FFFFFF', fontSize: 10, fontWeight: 'bold' },
  packageContent: { flexDirection: 'row', alignItems: 'center' },
  radioOuter: {
    width: 24, height: 24, borderRadius: 12, borderWidth: 2, borderColor: ManuscriptColors.copperBrown,
    justifyContent: 'center', alignItems: 'center', marginRight: 14,
  },
  radioInner: { width: 12, height: 12, borderRadius: 6, backgroundColor: ManuscriptColors.vermillion },
  packageInfo: { flex: 1 },
  packageTitle: { fontSize: 16, fontWeight: '600', color: ManuscriptColors.inkBlack },
  packageDescription: { fontSize: 13, color: ManuscriptColors.fadedInk, marginTop: 2 },
  packagePrice: { fontSize: 18, fontWeight: 'bold', color: ManuscriptColors.vermillion },
  purchaseButton: {
    backgroundColor: ManuscriptColors.vermillion, borderRadius: 12, padding: 18,
    alignItems: 'center', marginBottom: 16,
  },
  purchaseButtonDisabled: { opacity: 0.7 },
  purchaseButtonText: { color: '#FFFFFF', fontSize: 18, fontWeight: 'bold' },
  restoreButton: { alignItems: 'center', padding: 12, marginBottom: 20 },
  restoreText: { color: ManuscriptColors.copperBrown, fontSize: 15, fontWeight: '500' },
  legalText: { fontSize: 11, color: ManuscriptColors.fadedInk, textAlign: 'center', lineHeight: 16 },
});
