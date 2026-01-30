import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Sentry from '@sentry/react-native';
import AppNavigator from './src/navigation/AppNavigator';
import LoginScreen from './src/screens/LoginScreen';
import { SubscriptionProvider } from './src/context/SubscriptionContext';
import { AuthProvider } from './src/context/AuthContext';

// Initialize Sentry for crash & error monitoring
// DSN is configured for the NayaVed project on sentry.io
Sentry.init({
  dsn: 'https://341f020c4f73187c878b6d19eb704194@o4510789843288064.ingest.us.sentry.io/4510789847678976',
  enabled: !__DEV__, // Only enable in production builds
  tracesSampleRate: 0.2, // 20% of transactions for performance monitoring
  debug: false,
  // Attach user info to errors for better debugging
  beforeSend(event) {
    // Remove any sensitive data before sending
    if (event.request?.headers) {
      delete event.request.headers['x-user-id'];
    }
    return event;
  },
  // Capture unhandled promise rejections
  enableNative: true,
  enableAutoSessionTracking: true,
  sessionTrackingIntervalMillis: 30000,
});

// Google OAuth Client IDs - Replace with your own from Google Cloud Console
// To set up Google Sign-In:
// 1. Go to https://console.cloud.google.com/
// 2. Create a project or select existing one
// 3. Go to APIs & Services > Credentials
// 4. Create OAuth 2.0 Client IDs:
//    - Web application (for GOOGLE_CLIENT_ID)
//    - iOS application (for GOOGLE_IOS_CLIENT_ID) with bundle ID: com.nayaved.app
// 5. Add the client IDs below
// For now, Google Sign-In is disabled until configured
const GOOGLE_CLIENT_ID = 'gufesder6uj92bf3nmcjbs4oeme2dql8.apps.googleusercontent.com'; // Web client ID
const GOOGLE_IOS_CLIENT_ID = 'gibun4qn4idqq0onf0acf9fm38iuundu.apps.googleusercontent.com'; // iOS client ID

function AppContent() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    checkLoginStatus();
  }, []);

  const checkLoginStatus = async () => {
    try {
      const loggedIn = await AsyncStorage.getItem('userLoggedIn');
      const user = await AsyncStorage.getItem('@nayaved_user');
      // Consider logged in if either old method or new auth method is used
      setIsLoggedIn(loggedIn === 'true' || !!user);
    } catch (error) {
      setIsLoggedIn(false);
    }
  };

  const handleLoginSuccess = async () => {
    await AsyncStorage.setItem('userLoggedIn', 'true');
    setIsLoggedIn(true);
  };

  // Show loading while checking login status
  if (isLoggedIn === null) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#9EBF88" />
      </View>
    );
  }

  // Show login screen if not logged in
  if (!isLoggedIn) {
    return <LoginScreen onLoginSuccess={handleLoginSuccess} />;
  }

  // Show main app if logged in
  return (
    <SubscriptionProvider>
      <AppNavigator />
    </SubscriptionProvider>
  );
}

function App() {
  return (
    <AuthProvider
      googleClientId={GOOGLE_CLIENT_ID}
      googleIosClientId={GOOGLE_IOS_CLIENT_ID}
    >
      <AppContent />
    </AuthProvider>
  );
}

export default Sentry.wrap(App);

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#D4C5A9',
  },
});
