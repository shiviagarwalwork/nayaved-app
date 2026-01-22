import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppNavigator from './src/navigation/AppNavigator';
import LoginScreen from './src/screens/LoginScreen';
import { SubscriptionProvider } from './src/context/SubscriptionContext';
import { AuthProvider } from './src/context/AuthContext';

// Google OAuth Client IDs - Replace with your own from Google Cloud Console
// For testing, you can leave these empty and Google Sign-In will show a configuration message
const GOOGLE_CLIENT_ID = ''; // Web client ID
const GOOGLE_IOS_CLIENT_ID = ''; // iOS client ID

function AppContent() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    checkLoginStatus();
  }, []);

  const checkLoginStatus = async () => {
    try {
      const loggedIn = await AsyncStorage.getItem('userLoggedIn');
      const user = await AsyncStorage.getItem('@ayuved_user');
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

export default function App() {
  return (
    <AuthProvider
      googleClientId={GOOGLE_CLIENT_ID}
      googleIosClientId={GOOGLE_IOS_CLIENT_ID}
    >
      <AppContent />
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#D4C5A9',
  },
});
