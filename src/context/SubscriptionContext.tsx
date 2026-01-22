import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getUserStatus, activateDeveloperMode, UserStatus } from '../services/aiService';

export type SubscriptionTier = 'free' | 'premium' | 'developer';

interface SubscriptionContextType {
  tier: SubscriptionTier;
  isLoading: boolean;
  isPremium: boolean;
  isDeveloper: boolean;

  // Usage tracking
  scansUsed: number;
  scansLimit: number | 'unlimited';
  scansRemaining: number | 'unlimited';
  chatsUsed: number;
  chatsLimit: number | 'unlimited';
  chatsRemaining: number | 'unlimited';

  // Feature flags
  hasUnlimitedScans: boolean;
  hasUnlimitedChats: boolean;

  // Actions
  refreshStatus: () => Promise<void>;
  activateDevMode: (code: string) => Promise<boolean>;
  upgradeToPremium: () => Promise<void>;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export function SubscriptionProvider({ children }: { children: ReactNode }) {
  const [tier, setTier] = useState<SubscriptionTier>('free');
  const [isLoading, setIsLoading] = useState(true);
  const [userStatus, setUserStatus] = useState<UserStatus | null>(null);

  // Load subscription status on mount
  useEffect(() => {
    refreshStatus();
  }, []);

  const refreshStatus = async () => {
    try {
      setIsLoading(true);
      const status = await getUserStatus();
      setUserStatus(status);
      setTier(status.tier);
    } catch (error) {
      console.error('Error loading subscription status:', error);
      // Default to free tier on error
      setTier('free');
    } finally {
      setIsLoading(false);
    }
  };

  const activateDevMode = async (code: string): Promise<boolean> => {
    const success = await activateDeveloperMode(code);
    if (success) {
      await refreshStatus();
    }
    return success;
  };

  const upgradeToPremium = async () => {
    // This would integrate with Apple/Google IAP
    // For now, store locally
    setTier('premium');
    await AsyncStorage.setItem('subscriptionTier', 'premium');
    await refreshStatus();
  };

  const isPremium = tier === 'premium';
  const isDeveloper = tier === 'developer';

  // Usage stats
  const scansUsed = userStatus?.usage.scans.used ?? 0;
  const scansLimit = userStatus?.usage.scans.limit ?? 2;
  const scansRemaining = userStatus?.usage.scans.remaining ?? 2;
  const chatsUsed = userStatus?.usage.chats.used ?? 0;
  const chatsLimit = userStatus?.usage.chats.limit ?? 10;
  const chatsRemaining = userStatus?.usage.chats.remaining ?? 10;

  // Feature flags
  const hasUnlimitedScans = userStatus?.features.unlimitedScans ?? false;
  const hasUnlimitedChats = userStatus?.features.unlimitedChats ?? false;

  return (
    <SubscriptionContext.Provider
      value={{
        tier,
        isLoading,
        isPremium,
        isDeveloper,
        scansUsed,
        scansLimit,
        scansRemaining,
        chatsUsed,
        chatsLimit,
        chatsRemaining,
        hasUnlimitedScans,
        hasUnlimitedChats,
        refreshStatus,
        activateDevMode,
        upgradeToPremium,
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscription() {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
}
