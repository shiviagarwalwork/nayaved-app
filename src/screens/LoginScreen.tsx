import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Image,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import * as AppleAuthentication from 'expo-apple-authentication';
import { ManuscriptColors } from '../components/ManuscriptConstants';
import { useAuth, isAppleSignInAvailable } from '../context/AuthContext';

// Valid invite codes - you can add/remove codes here
const VALID_CODES = [
  'ANCIENT2024',
  'AYURVEDA',
  'WELLNESS',
  'OJAS',
  'VEDA',
  'PRAKRITI',
  'DOSHA',
  'SHAKTI',
];

interface LoginScreenProps {
  onLoginSuccess: () => void;
}

export default function LoginScreen({ onLoginSuccess }: LoginScreenProps) {
  const {
    signInWithGoogle,
    signInWithApple,
    continueAsGuest,
    isLoading: authLoading,
    error: authError,
    clearError,
    isAuthenticated,
  } = useAuth();

  const [showInviteCode, setShowInviteCode] = useState(false);
  const [name, setName] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [appleSignInAvailable, setAppleSignInAvailable] = useState(false);

  useEffect(() => {
    checkAppleSignIn();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      onLoginSuccess();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (authError) {
      setError(authError);
    }
  }, [authError]);

  const checkAppleSignIn = async () => {
    const available = await isAppleSignInAvailable();
    setAppleSignInAvailable(available);
  };

  const handleGoogleSignIn = async () => {
    clearError();
    setError('');
    await signInWithGoogle();
  };

  const handleAppleSignIn = async () => {
    clearError();
    setError('');
    await signInWithApple();
  };

  const handleGuestLogin = async () => {
    clearError();
    setError('');
    await continueAsGuest();
  };

  const handleInviteCodeLogin = async () => {
    setError('');

    if (!name.trim()) {
      setError('Please enter your name');
      return;
    }

    if (!inviteCode.trim()) {
      setError('Please enter your invite code');
      return;
    }

    const codeUpper = inviteCode.trim().toUpperCase();

    if (!VALID_CODES.includes(codeUpper)) {
      setError('Invalid invite code. Contact the person who invited you.');
      return;
    }

    setLoading(true);

    try {
      // Store user data
      await AsyncStorage.setItem('userLoggedIn', 'true');
      await AsyncStorage.setItem('userName', name.trim());
      await AsyncStorage.setItem('inviteCode', codeUpper);
      await AsyncStorage.setItem('loginDate', new Date().toISOString());

      // Small delay for effect
      setTimeout(() => {
        setLoading(false);
        onLoginSuccess();
      }, 800);
    } catch (err) {
      setLoading(false);
      setError('Something went wrong. Please try again.');
    }
  };

  const isProcessing = loading || authLoading;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Decorative top */}
        <View style={styles.decorativeTop}>
          <Text style={styles.decorativeText}>॰ ॰ ॰</Text>
        </View>

        {/* Logo/Icon */}
        <View style={styles.logoContainer}>
          <View style={styles.logoCircle}>
            <Image
              source={require('../../assets/icon.png')}
              style={styles.logoImage}
              resizeMode="contain"
            />
          </View>
        </View>

        {/* Title */}
        <Text style={styles.title}>
          NayaVed <Text style={styles.titleAI}>AI</Text>
        </Text>
        <Text style={styles.subtitle}>Ancient Wisdom for Modern Life</Text>

        {/* Exclusive message */}
        <View style={styles.exclusiveCard}>
          <MaterialCommunityIcons name="shield-check" size={20} color={ManuscriptColors.copperBrown} />
          <Text style={styles.exclusiveText}>
            Sign in to save your dosha profile, diagnostic results, and personalized recommendations across devices.
          </Text>
        </View>

        {!showInviteCode ? (
          <>
            {/* Social Login Buttons */}
            <View style={styles.socialButtons}>
              {/* Google Sign-In */}
              <TouchableOpacity
                style={[styles.socialButton, styles.googleButton]}
                onPress={handleGoogleSignIn}
                disabled={isProcessing}
                activeOpacity={0.8}
              >
                {isProcessing ? (
                  <ActivityIndicator color="#EA4335" />
                ) : (
                  <>
                    <Ionicons name="logo-google" size={22} color="#EA4335" />
                    <Text style={styles.socialButtonText}>Continue with Google</Text>
                  </>
                )}
              </TouchableOpacity>

              {/* Apple Sign-In (iOS only) */}
              {appleSignInAvailable && (
                <TouchableOpacity
                  style={[styles.socialButton, styles.appleButton]}
                  onPress={handleAppleSignIn}
                  disabled={isProcessing}
                  activeOpacity={0.8}
                >
                  {isProcessing ? (
                    <ActivityIndicator color="#000000" />
                  ) : (
                    <>
                      <Ionicons name="logo-apple" size={24} color="#000000" />
                      <Text style={[styles.socialButtonText, styles.appleButtonText]}>
                        Continue with Apple
                      </Text>
                    </>
                  )}
                </TouchableOpacity>
              )}
            </View>

            {/* Divider */}
            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Guest and Invite Code options */}
            <TouchableOpacity
              style={styles.guestButton}
              onPress={handleGuestLogin}
              disabled={isProcessing}
              activeOpacity={0.8}
            >
              <MaterialCommunityIcons name="account-outline" size={22} color={ManuscriptColors.inkBrown} />
              <Text style={styles.guestButtonText}>Continue as Guest</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.inviteCodeLink}
              onPress={() => setShowInviteCode(true)}
              disabled={isProcessing}
            >
              <MaterialCommunityIcons name="key-variant" size={16} color={ManuscriptColors.copperBrown} />
              <Text style={styles.inviteCodeLinkText}>Have an invite code?</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            {/* Invite Code Form */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Your Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your name"
                placeholderTextColor="#A0927B"
                value={name}
                onChangeText={(text) => {
                  setName(text);
                  setError('');
                }}
                autoCapitalize="words"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Invite Code</Text>
              <TextInput
                style={[styles.input, styles.codeInput]}
                placeholder="Enter your secret code"
                placeholderTextColor="#A0927B"
                value={inviteCode}
                onChangeText={(text) => {
                  setInviteCode(text.toUpperCase());
                  setError('');
                }}
                autoCapitalize="characters"
                autoCorrect={false}
              />
            </View>

            {/* Enter button */}
            <TouchableOpacity
              style={[styles.enterButton, isProcessing && styles.enterButtonDisabled]}
              onPress={handleInviteCodeLogin}
              disabled={isProcessing}
              activeOpacity={0.8}
            >
              {isProcessing ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <>
                  <Text style={styles.enterButtonText}>Begin Your Journey</Text>
                  <MaterialCommunityIcons name="arrow-right" size={20} color="#FFFFFF" />
                </>
              )}
            </TouchableOpacity>

            {/* Back to social login */}
            <TouchableOpacity
              style={styles.backLink}
              onPress={() => {
                setShowInviteCode(false);
                setError('');
              }}
            >
              <MaterialCommunityIcons name="arrow-left" size={16} color={ManuscriptColors.copperBrown} />
              <Text style={styles.backLinkText}>Back to sign in options</Text>
            </TouchableOpacity>
          </>
        )}

        {/* Error message */}
        {error ? (
          <View style={styles.errorContainer}>
            <MaterialCommunityIcons name="alert-circle" size={16} color="#C62828" />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        {/* Footer note */}
        <Text style={styles.footerNote}>
          By continuing, you agree to our Terms of Service{'\n'}and Privacy Policy.
        </Text>

        {/* Decorative bottom */}
        <View style={styles.decorativeBottom}>
          <Text style={styles.decorativeSymbol}>ॐ</Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: ManuscriptColors.palmLeaf,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
    justifyContent: 'center',
  },
  decorativeTop: {
    alignItems: 'center',
    marginBottom: 8,
  },
  decorativeText: {
    fontSize: 24,
    color: ManuscriptColors.copperBrown,
    letterSpacing: 8,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  logoCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: ManuscriptColors.goldLeaf,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  logoImage: {
    width: 90,
    height: 90,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: ManuscriptColors.inkBlack,
    textAlign: 'center',
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
  },
  titleAI: {
    color: '#B87333',
    fontSize: 36,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 16,
    color: ManuscriptColors.copperBrown,
    textAlign: 'center',
    fontStyle: 'italic',
    marginBottom: 24,
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
  },
  exclusiveCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: ManuscriptColors.goldLeaf,
    gap: 12,
  },
  exclusiveText: {
    flex: 1,
    fontSize: 14,
    color: ManuscriptColors.inkBrown,
    lineHeight: 20,
  },
  socialButtons: {
    gap: 12,
    marginBottom: 20,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  googleButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DADCE0',
  },
  appleButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#000000',
  },
  socialButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3C4043',
  },
  appleButtonText: {
    color: '#000000',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: ManuscriptColors.copperBrown,
    opacity: 0.3,
  },
  dividerText: {
    marginHorizontal: 16,
    fontSize: 14,
    color: ManuscriptColors.fadedInk,
  },
  guestButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 10,
    backgroundColor: ManuscriptColors.parchment,
    borderWidth: 2,
    borderColor: ManuscriptColors.copperBrown,
    marginBottom: 16,
  },
  guestButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: ManuscriptColors.inkBrown,
  },
  inviteCodeLink: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
  },
  inviteCodeLinkText: {
    fontSize: 14,
    color: ManuscriptColors.copperBrown,
    textDecorationLine: 'underline',
  },
  backLink: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
  },
  backLinkText: {
    fontSize: 14,
    color: ManuscriptColors.copperBrown,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: ManuscriptColors.inkBlack,
    marginBottom: 8,
    marginLeft: 4,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: ManuscriptColors.inkBlack,
    borderWidth: 2,
    borderColor: '#D7CCC8',
  },
  codeInput: {
    letterSpacing: 2,
    fontWeight: '600',
    textAlign: 'center',
    fontSize: 18,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 16,
    paddingHorizontal: 4,
  },
  errorText: {
    color: '#C62828',
    fontSize: 14,
    flex: 1,
  },
  enterButton: {
    backgroundColor: ManuscriptColors.vermillion,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 18,
    borderRadius: 12,
    gap: 8,
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  enterButtonDisabled: {
    opacity: 0.7,
  },
  enterButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  footerNote: {
    fontSize: 12,
    color: ManuscriptColors.fadedInk,
    textAlign: 'center',
    marginTop: 24,
    lineHeight: 18,
  },
  decorativeBottom: {
    alignItems: 'center',
    marginTop: 24,
  },
  decorativeSymbol: {
    fontSize: 36,
    color: ManuscriptColors.goldLeaf,
  },
});
