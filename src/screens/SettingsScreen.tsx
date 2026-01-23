import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Linking,
  Modal,
} from 'react-native';
import PaywallScreen from './PaywallScreen';
import { MaterialCommunityIcons, Feather, Ionicons } from '@expo/vector-icons';
import { ManuscriptColors } from '../components/ManuscriptConstants';
import { useAuth } from '../context/AuthContext';
import { useSubscription } from '../context/SubscriptionContext';
import { isApiConfigured } from '../services/aiService';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SettingsScreen() {
  const { user, signOut } = useAuth();
  const {
    tier,
    isLoading: subLoading,
    isPremium,
    isDeveloper,
    scansUsed,
    scansLimit,
    scansRemaining,
    chatsUsed,
    chatsLimit,
    chatsRemaining,
    hasUnlimitedScans,
    refreshStatus,
    activateDevMode,
  } = useSubscription();

  const [devCode, setDevCode] = useState('');
  const [isActivating, setIsActivating] = useState(false);
  const [backendConnected, setBackendConnected] = useState(false);
  const [isCheckingBackend, setIsCheckingBackend] = useState(true);
  const [showPaywall, setShowPaywall] = useState(false);

  useEffect(() => {
    checkBackendConnection();
  }, []);

  const checkBackendConnection = async () => {
    setIsCheckingBackend(true);
    const connected = await isApiConfigured();
    setBackendConnected(connected);
    setIsCheckingBackend(false);
  };

  const handleActivateDevMode = async () => {
    if (!devCode.trim()) {
      Alert.alert('Error', 'Please enter a developer code');
      return;
    }

    setIsActivating(true);
    try {
      const success = await activateDevMode(devCode.trim());
      if (success) {
        Alert.alert('Success', 'Developer access activated! You now have unlimited access to all features.');
        setDevCode('');
      } else {
        Alert.alert('Error', 'Invalid developer code. Please check and try again.');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to activate developer mode. Please try again.');
    } finally {
      setIsActivating(false);
    }
  };

  const handleSignOut = async () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            await signOut();
            await AsyncStorage.removeItem('userLoggedIn');
          },
        },
      ]
    );
  };

  const handleUpgrade = () => {
    setShowPaywall(true);
  };

  const getTierBadgeColor = () => {
    if (isDeveloper) return '#9C27B0';
    if (isPremium) return '#FFD700';
    return '#9E9E9E';
  };

  const getTierName = () => {
    if (isDeveloper) return 'Developer';
    if (isPremium) return 'Premium';
    return 'Free';
  };

  return (
    <>
    <Modal
      visible={showPaywall}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={() => setShowPaywall(false)}
    >
      <PaywallScreen
        onClose={() => setShowPaywall(false)}
        onSuccess={() => setShowPaywall(false)}
      />
    </Modal>
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Settings</Text>

      {/* Subscription Status */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Subscription</Text>
        <View style={styles.card}>
          <View style={styles.tierRow}>
            <View style={[styles.tierBadge, { backgroundColor: getTierBadgeColor() }]}>
              <MaterialCommunityIcons
                name={isDeveloper ? 'code-braces' : isPremium ? 'crown' : 'account'}
                size={20}
                color="#FFFFFF"
              />
              <Text style={styles.tierBadgeText}>{getTierName()}</Text>
            </View>
            {!isPremium && !isDeveloper && (
              <TouchableOpacity style={styles.upgradeButton} onPress={handleUpgrade}>
                <Text style={styles.upgradeButtonText}>Upgrade</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Usage Stats */}
          <View style={styles.usageContainer}>
            <View style={styles.usageRow}>
              <View style={styles.usageItem}>
                <Feather name="camera" size={18} color={ManuscriptColors.vermillion} />
                <Text style={styles.usageLabel}>AI Scans</Text>
                <Text style={styles.usageValue}>
                  {hasUnlimitedScans ? (
                    <Text style={styles.unlimited}>Unlimited</Text>
                  ) : (
                    `${scansUsed} / ${scansLimit}`
                  )}
                </Text>
                {!hasUnlimitedScans && typeof scansRemaining === 'number' && (
                  <Text style={styles.usageRemaining}>{scansRemaining} remaining</Text>
                )}
              </View>
              <View style={styles.usageDivider} />
              <View style={styles.usageItem}>
                <Feather name="message-circle" size={18} color={ManuscriptColors.indigo} />
                <Text style={styles.usageLabel}>Chat Messages</Text>
                <Text style={styles.usageValue}>
                  {hasUnlimitedScans ? (
                    <Text style={styles.unlimited}>Unlimited</Text>
                  ) : (
                    `${chatsUsed} / ${chatsLimit}`
                  )}
                </Text>
                {!hasUnlimitedScans && typeof chatsRemaining === 'number' && (
                  <Text style={styles.usageRemaining}>{chatsRemaining} remaining</Text>
                )}
              </View>
            </View>
          </View>

          {/* Refresh Button */}
          <TouchableOpacity style={styles.refreshButton} onPress={refreshStatus} disabled={subLoading}>
            {subLoading ? (
              <ActivityIndicator size="small" color={ManuscriptColors.vermillion} />
            ) : (
              <>
                <Feather name="refresh-cw" size={16} color={ManuscriptColors.vermillion} />
                <Text style={styles.refreshButtonText}>Refresh Status</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        {/* Premium Features Info */}
        {!isPremium && !isDeveloper && (
          <View style={styles.premiumInfoCard}>
            <MaterialCommunityIcons name="crown" size={24} color="#FFD700" />
            <View style={styles.premiumInfoText}>
              <Text style={styles.premiumInfoTitle}>Upgrade to Premium</Text>
              <Text style={styles.premiumInfoDescription}>
                Get unlimited AI scans, unlimited chat consultations, and priority support!
              </Text>
            </View>
          </View>
        )}
      </View>

      {/* Developer Access */}
      {!isDeveloper && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Developer Access</Text>
          <View style={styles.card}>
            <View style={styles.devInfoRow}>
              <MaterialCommunityIcons name="code-braces" size={24} color="#9C27B0" />
              <View style={styles.devInfoText}>
                <Text style={styles.devTitle}>Have a Developer Code?</Text>
                <Text style={styles.devDescription}>
                  Enter your code below for unlimited access to all features.
                </Text>
              </View>
            </View>

            <View style={styles.devInputContainer}>
              <TextInput
                style={styles.devInput}
                placeholder="Enter developer code"
                placeholderTextColor={ManuscriptColors.fadedInk}
                value={devCode}
                onChangeText={setDevCode}
                autoCapitalize="characters"
                autoCorrect={false}
              />
              <TouchableOpacity
                style={[styles.activateButton, !devCode.trim() && styles.activateButtonDisabled]}
                onPress={handleActivateDevMode}
                disabled={!devCode.trim() || isActivating}
              >
                {isActivating ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Text style={styles.activateButtonText}>Activate</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      {/* Backend Status */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>AI Service Status</Text>
        <View style={styles.card}>
          <View style={styles.statusRow}>
            <View style={[styles.statusDot, { backgroundColor: backendConnected ? '#4CAF50' : '#F44336' }]} />
            <Text style={styles.statusText}>
              {isCheckingBackend
                ? 'Checking connection...'
                : backendConnected
                ? 'AI service connected'
                : 'AI service unavailable'}
            </Text>
            <TouchableOpacity onPress={checkBackendConnection} disabled={isCheckingBackend}>
              <Feather name="refresh-cw" size={18} color={ManuscriptColors.fadedInk} />
            </TouchableOpacity>
          </View>
          {!backendConnected && !isCheckingBackend && (
            <Text style={styles.statusNote}>
              AI features require an internet connection. Demo mode is available offline.
            </Text>
          )}
        </View>
      </View>

      {/* User Profile Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>
        <View style={styles.card}>
          <View style={styles.profileRow}>
            <View style={styles.avatar}>
              {user?.photoUrl ? (
                <Ionicons name="person" size={24} color={ManuscriptColors.parchment} />
              ) : (
                <MaterialCommunityIcons
                  name={user?.provider === 'google' ? 'google' : user?.provider === 'apple' ? 'apple' : 'account'}
                  size={24}
                  color={ManuscriptColors.parchment}
                />
              )}
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{user?.name || 'Guest User'}</Text>
              <Text style={styles.profileEmail}>{user?.email || 'No email'}</Text>
              <View style={styles.providerBadge}>
                <Text style={styles.providerText}>
                  {user?.provider === 'google' ? 'Google Account' :
                   user?.provider === 'apple' ? 'Apple Account' :
                   'Guest'}
                </Text>
              </View>
            </View>
          </View>
          <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
            <Feather name="log-out" size={18} color="#C62828" />
            <Text style={styles.signOutText}>Sign Out</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* App Info */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        <View style={styles.card}>
          <View style={styles.aboutRow}>
            <Text style={styles.aboutLabel}>App Version</Text>
            <Text style={styles.aboutValue}>1.0.0</Text>
          </View>
          <View style={styles.aboutRow}>
            <Text style={styles.aboutLabel}>Build</Text>
            <Text style={styles.aboutValue}>2026.01</Text>
          </View>
        </View>
      </View>

      <View style={styles.bottomPadding} />
    </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: ManuscriptColors.palmLeaf,
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: ManuscriptColors.inkBlack,
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: ManuscriptColors.fadedInk,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 12,
    marginLeft: 4,
  },
  card: {
    backgroundColor: ManuscriptColors.parchment,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: ManuscriptColors.copperBrown,
  },
  tierRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  tierBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 8,
  },
  tierBadgeText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  upgradeButton: {
    backgroundColor: '#FFD700',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  upgradeButtonText: {
    color: '#3E2723',
    fontSize: 14,
    fontWeight: 'bold',
  },
  usageContainer: {
    backgroundColor: ManuscriptColors.oldPaper,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  usageRow: {
    flexDirection: 'row',
  },
  usageItem: {
    flex: 1,
    alignItems: 'center',
  },
  usageDivider: {
    width: 1,
    backgroundColor: ManuscriptColors.copperBrown,
    marginHorizontal: 16,
  },
  usageLabel: {
    fontSize: 12,
    color: ManuscriptColors.fadedInk,
    marginTop: 8,
  },
  usageValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: ManuscriptColors.inkBlack,
    marginTop: 4,
  },
  unlimited: {
    color: '#4CAF50',
    fontSize: 16,
  },
  usageRemaining: {
    fontSize: 11,
    color: ManuscriptColors.fadedInk,
    marginTop: 2,
  },
  refreshButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 10,
  },
  refreshButtonText: {
    color: ManuscriptColors.vermillion,
    fontSize: 14,
    fontWeight: '500',
  },
  premiumInfoCard: {
    flexDirection: 'row',
    backgroundColor: '#FFF8E1',
    borderRadius: 12,
    padding: 14,
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#FFD700',
    alignItems: 'flex-start',
  },
  premiumInfoText: {
    marginLeft: 12,
    flex: 1,
  },
  premiumInfoTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#3E2723',
    marginBottom: 4,
  },
  premiumInfoDescription: {
    fontSize: 13,
    color: ManuscriptColors.inkBrown,
    lineHeight: 18,
  },
  devInfoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  devInfoText: {
    marginLeft: 12,
    flex: 1,
  },
  devTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: ManuscriptColors.inkBlack,
  },
  devDescription: {
    fontSize: 13,
    color: ManuscriptColors.fadedInk,
    marginTop: 4,
  },
  devInputContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  devInput: {
    flex: 1,
    backgroundColor: ManuscriptColors.oldPaper,
    borderRadius: 12,
    padding: 14,
    fontSize: 15,
    color: ManuscriptColors.inkBlack,
    borderWidth: 1,
    borderColor: ManuscriptColors.copperBrown,
    fontFamily: 'monospace',
    textTransform: 'uppercase',
  },
  activateButton: {
    backgroundColor: '#9C27B0',
    paddingHorizontal: 20,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activateButtonDisabled: {
    backgroundColor: '#CE93D8',
  },
  activateButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  statusText: {
    flex: 1,
    fontSize: 14,
    color: ManuscriptColors.inkBrown,
  },
  statusNote: {
    fontSize: 12,
    color: ManuscriptColors.fadedInk,
    marginTop: 8,
    fontStyle: 'italic',
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: ManuscriptColors.indigo,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: ManuscriptColors.inkBlack,
  },
  profileEmail: {
    fontSize: 14,
    color: ManuscriptColors.fadedInk,
    marginTop: 2,
  },
  providerBadge: {
    backgroundColor: ManuscriptColors.oldPaper,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 8,
    alignSelf: 'flex-start',
  },
  providerText: {
    fontSize: 12,
    color: ManuscriptColors.inkBrown,
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: ManuscriptColors.copperBrown,
  },
  signOutText: {
    fontSize: 16,
    color: '#C62828',
    fontWeight: '600',
  },
  aboutRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: ManuscriptColors.copperBrown,
  },
  aboutLabel: {
    fontSize: 15,
    color: ManuscriptColors.inkBrown,
  },
  aboutValue: {
    fontSize: 15,
    color: ManuscriptColors.fadedInk,
  },
  bottomPadding: {
    height: 40,
  },
});
