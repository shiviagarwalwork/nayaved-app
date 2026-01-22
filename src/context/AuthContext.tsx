// Authentication Context for Google and Apple Sign-In
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as AppleAuthentication from 'expo-apple-authentication';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { Platform } from 'react-native';

WebBrowser.maybeCompleteAuthSession();

// User interface
export interface User {
  id: string;
  email: string | null;
  name: string | null;
  provider: 'google' | 'apple' | 'guest';
  photoUrl?: string | null;
  createdAt: string;
}

// Auth context interface
interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithApple: () => Promise<void>;
  continueAsGuest: () => Promise<void>;
  signOut: () => Promise<void>;
  error: string | null;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Storage keys
const USER_STORAGE_KEY = '@nayaved_user';
const USER_DATA_PREFIX = '@nayaved_data_';

interface AuthProviderProps {
  children: ReactNode;
  googleClientId?: string;
  googleIosClientId?: string;
}

export function AuthProvider({
  children,
  googleClientId,
  googleIosClientId
}: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Google Sign-In configuration
  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: googleClientId,
    iosClientId: googleIosClientId,
  });

  // Load user from storage on mount
  useEffect(() => {
    loadStoredUser();
  }, []);

  // Handle Google Sign-In response
  useEffect(() => {
    if (response?.type === 'success') {
      handleGoogleSuccess(response.authentication?.accessToken);
    } else if (response?.type === 'error') {
      setError('Google sign-in failed. Please try again.');
    }
  }, [response]);

  const loadStoredUser = async () => {
    try {
      const storedUser = await AsyncStorage.getItem(USER_STORAGE_KEY);
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (e) {
      console.error('Error loading user:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const saveUser = async (userData: User) => {
    try {
      await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));
      setUser(userData);
    } catch (e) {
      console.error('Error saving user:', e);
    }
  };

  // Migrate guest data to authenticated user
  const migrateGuestData = async (newUserId: string) => {
    try {
      // Get all keys
      const allKeys = await AsyncStorage.getAllKeys();

      // Keys to migrate (user-specific data)
      const keysToMigrate = [
        'doshaResult',
        'userSymptoms',
        'ojasData',
        'pulseAnalysis',
        'skinAnalysis',
        'eyeAnalysis',
        'nailAnalysis',
        'tongueAnalysis',
      ];

      for (const key of keysToMigrate) {
        const data = await AsyncStorage.getItem(key);
        if (data) {
          // Save with user-specific prefix
          await AsyncStorage.setItem(`${USER_DATA_PREFIX}${newUserId}_${key}`, data);
        }
      }
    } catch (e) {
      console.error('Error migrating data:', e);
    }
  };

  // Load user-specific data
  const loadUserData = async (userId: string) => {
    try {
      const keysToLoad = [
        'doshaResult',
        'userSymptoms',
        'ojasData',
        'pulseAnalysis',
        'skinAnalysis',
        'eyeAnalysis',
        'nailAnalysis',
        'tongueAnalysis',
      ];

      for (const key of keysToLoad) {
        const userData = await AsyncStorage.getItem(`${USER_DATA_PREFIX}${userId}_${key}`);
        if (userData) {
          // Restore to main key for app to use
          await AsyncStorage.setItem(key, userData);
        }
      }
    } catch (e) {
      console.error('Error loading user data:', e);
    }
  };

  // Google Sign-In
  const handleGoogleSuccess = async (accessToken?: string | null) => {
    if (!accessToken) {
      setError('Failed to get Google access token');
      return;
    }

    try {
      setIsLoading(true);

      // Fetch user info from Google
      const userInfoResponse = await fetch(
        'https://www.googleapis.com/userinfo/v2/me',
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      const userInfo = await userInfoResponse.json();

      const googleUser: User = {
        id: `google_${userInfo.id}`,
        email: userInfo.email,
        name: userInfo.name,
        provider: 'google',
        photoUrl: userInfo.picture,
        createdAt: new Date().toISOString(),
      };

      // If coming from guest, migrate data
      if (user?.provider === 'guest') {
        await migrateGuestData(googleUser.id);
      }

      // Load any existing data for this user
      await loadUserData(googleUser.id);

      await saveUser(googleUser);
      setError(null);
    } catch (e) {
      console.error('Google sign-in error:', e);
      setError('Failed to complete Google sign-in');
    } finally {
      setIsLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    try {
      setError(null);
      if (!request) {
        setError('Google Sign-In is not configured');
        return;
      }
      await promptAsync();
    } catch (e) {
      console.error('Google sign-in error:', e);
      setError('Failed to start Google sign-in');
    }
  };

  // Apple Sign-In
  const signInWithApple = async () => {
    try {
      setError(null);
      setIsLoading(true);

      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });

      const appleUser: User = {
        id: `apple_${credential.user}`,
        email: credential.email,
        name: credential.fullName
          ? `${credential.fullName.givenName || ''} ${credential.fullName.familyName || ''}`.trim()
          : null,
        provider: 'apple',
        createdAt: new Date().toISOString(),
      };

      // If coming from guest, migrate data
      if (user?.provider === 'guest') {
        await migrateGuestData(appleUser.id);
      }

      // Load any existing data for this user
      await loadUserData(appleUser.id);

      await saveUser(appleUser);
      setError(null);
    } catch (e: any) {
      if (e.code === 'ERR_CANCELED') {
        // User cancelled, not an error
        return;
      }
      console.error('Apple sign-in error:', e);
      setError('Failed to complete Apple sign-in');
    } finally {
      setIsLoading(false);
    }
  };

  // Continue as Guest
  const continueAsGuest = async () => {
    try {
      setIsLoading(true);

      const guestUser: User = {
        id: `guest_${Date.now()}`,
        email: null,
        name: 'Guest',
        provider: 'guest',
        createdAt: new Date().toISOString(),
      };

      await saveUser(guestUser);
      setError(null);
    } catch (e) {
      console.error('Guest login error:', e);
      setError('Failed to continue as guest');
    } finally {
      setIsLoading(false);
    }
  };

  // Sign Out
  const signOut = async () => {
    try {
      setIsLoading(true);

      // Save current user's data before signing out
      if (user && user.provider !== 'guest') {
        const keysToSave = [
          'doshaResult',
          'userSymptoms',
          'ojasData',
          'pulseAnalysis',
          'skinAnalysis',
          'eyeAnalysis',
          'nailAnalysis',
          'tongueAnalysis',
        ];

        for (const key of keysToSave) {
          const data = await AsyncStorage.getItem(key);
          if (data) {
            await AsyncStorage.setItem(`${USER_DATA_PREFIX}${user.id}_${key}`, data);
          }
        }
      }

      // Clear current session data
      await AsyncStorage.removeItem(USER_STORAGE_KEY);

      // Clear session-specific keys (but keep user-prefixed data)
      const sessionKeys = [
        'doshaResult',
        'userSymptoms',
        'ojasData',
        'pulseAnalysis',
        'skinAnalysis',
        'eyeAnalysis',
        'nailAnalysis',
        'tongueAnalysis',
      ];

      for (const key of sessionKeys) {
        await AsyncStorage.removeItem(key);
      }

      setUser(null);
      setError(null);
    } catch (e) {
      console.error('Sign out error:', e);
      setError('Failed to sign out');
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => setError(null);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        signInWithGoogle,
        signInWithApple,
        continueAsGuest,
        signOut,
        error,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Check if Apple Sign-In is available (iOS 13+)
export const isAppleSignInAvailable = async (): Promise<boolean> => {
  if (Platform.OS !== 'ios') return false;
  return await AppleAuthentication.isAvailableAsync();
};
