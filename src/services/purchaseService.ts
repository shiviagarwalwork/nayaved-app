/**
 * ============================================================
 * RevenueCat Purchase Service for NayaVed AI
 * ============================================================
 *
 * Handles in-app purchases and subscription management using RevenueCat SDK.
 * RevenueCat abstracts away the complexity of Apple/Google payment APIs.
 *
 * SETUP INSTRUCTIONS:
 * 1. Create account at https://www.revenuecat.com
 * 2. Create a new project named "NayaVed"
 * 3. Add iOS app with bundle ID: com.nayaved.app
 * 4. Add Android app with package: com.nayaved.app
 * 5. Upload P8 API key from App Store Connect
 * 6. Create products in App Store Connect:
 *    - nayaved_premium_monthly ($4.99/month)
 *    - nayaved_premium_yearly ($39.99/year)
 * 7. In RevenueCat:
 *    - Add products under Products tab
 *    - Create "premium" entitlement
 *    - Create "default" offering with both packages
 *
 * KEY CONCEPTS:
 * - Products: Individual purchasable items (monthly, yearly)
 * - Entitlements: Features unlocked by purchase ("premium")
 * - Offerings: Groups of products shown to users
 * - Packages: Products within an offering (monthly, annual)
 *
 * @author NayaVed Team
 */

import Purchases, {
  PurchasesPackage,
  CustomerInfo,
  PurchasesError,
} from 'react-native-purchases';
import { Platform } from 'react-native';

// ============================================================
// REVENUECAT CONFIGURATION
// ============================================================

// API Keys from RevenueCat Dashboard → Project Settings → API Keys
const REVENUECAT_API_KEY_IOS = 'appdf7562d03f';  // Your iOS public API key
const REVENUECAT_API_KEY_ANDROID = 'YOUR_REVENUECAT_ANDROID_API_KEY';  // Add Android key when ready

// Product identifiers - must match App Store Connect / Google Play Console
export const PRODUCT_IDS = {
  PREMIUM_MONTHLY: 'nayaved_premium_monthly',    // $4.99/month subscription
  PREMIUM_YEARLY: 'nayaved_premium_yearly',      // $39.99/year (saves 33%)
};

// Entitlement ID - created in RevenueCat Dashboard → Entitlements
// This unlocks premium features when active
export const ENTITLEMENT_ID = 'premium';

// ============================================
// INITIALIZATION
// ============================================

let isConfigured = false;

export const initializePurchases = async (userId?: string): Promise<boolean> => {
  try {
    // Check if already configured
    if (isConfigured) {
      return true;
    }

    // Skip if using placeholder keys
    const apiKey = Platform.OS === 'ios' ? REVENUECAT_API_KEY_IOS : REVENUECAT_API_KEY_ANDROID;
    if (apiKey.startsWith('YOUR_')) {
      console.log('RevenueCat: Using placeholder API key - purchases disabled');
      return false;
    }

    // Configure RevenueCat
    Purchases.configure({
      apiKey,
      appUserID: userId || null,
    });

    isConfigured = true;
    console.log('RevenueCat: Initialized successfully');
    return true;
  } catch (error) {
    console.error('RevenueCat: Failed to initialize', error);
    return false;
  }
};

// ============================================
// USER MANAGEMENT
// ============================================

export const loginUser = async (userId: string): Promise<CustomerInfo | null> => {
  try {
    if (!isConfigured) return null;
    const { customerInfo } = await Purchases.logIn(userId);
    return customerInfo;
  } catch (error) {
    console.error('RevenueCat: Login failed', error);
    return null;
  }
};

export const logoutUser = async (): Promise<void> => {
  try {
    if (!isConfigured) return;
    await Purchases.logOut();
  } catch (error) {
    console.error('RevenueCat: Logout failed', error);
  }
};

// ============================================
// SUBSCRIPTION STATUS
// ============================================

export const getCustomerInfo = async (): Promise<CustomerInfo | null> => {
  try {
    if (!isConfigured) return null;
    return await Purchases.getCustomerInfo();
  } catch (error) {
    console.error('RevenueCat: Failed to get customer info', error);
    return null;
  }
};

export const isPremiumUser = async (): Promise<boolean> => {
  try {
    if (!isConfigured) return false;
    const customerInfo = await Purchases.getCustomerInfo();
    return customerInfo.entitlements.active[ENTITLEMENT_ID] !== undefined;
  } catch (error) {
    console.error('RevenueCat: Failed to check premium status', error);
    return false;
  }
};

// ============================================
// AVAILABLE PACKAGES
// ============================================

export interface AvailablePackage {
  identifier: string;
  title: string;
  description: string;
  priceString: string;
  price: number;
  currencyCode: string;
  package: PurchasesPackage;
}

export const getAvailablePackages = async (): Promise<AvailablePackage[]> => {
  try {
    if (!isConfigured) {
      // Return mock packages when not configured
      return [
        {
          identifier: PRODUCT_IDS.PREMIUM_MONTHLY,
          title: 'Premium Monthly',
          description: 'Unlimited AI scans & consultations',
          priceString: '$4.99',
          price: 4.99,
          currencyCode: 'USD',
          package: null as any,
        },
        {
          identifier: PRODUCT_IDS.PREMIUM_YEARLY,
          title: 'Premium Yearly',
          description: 'Save 33% - Best value!',
          priceString: '$39.99',
          price: 39.99,
          currencyCode: 'USD',
          package: null as any,
        },
      ];
    }

    const offerings = await Purchases.getOfferings();

    if (!offerings.current || !offerings.current.availablePackages.length) {
      console.log('RevenueCat: No offerings available');
      return [];
    }

    return offerings.current.availablePackages.map((pkg) => ({
      identifier: pkg.identifier,
      title: pkg.product.title,
      description: pkg.product.description,
      priceString: pkg.product.priceString,
      price: pkg.product.price,
      currencyCode: pkg.product.currencyCode,
      package: pkg,
    }));
  } catch (error) {
    console.error('RevenueCat: Failed to get packages', error);
    return [];
  }
};

// ============================================
// PURCHASE FLOW
// ============================================

export interface PurchaseResult {
  success: boolean;
  customerInfo?: CustomerInfo;
  error?: string;
  cancelled?: boolean;
}

export const purchasePackage = async (pkg: PurchasesPackage): Promise<PurchaseResult> => {
  try {
    if (!isConfigured) {
      return {
        success: false,
        error: 'Purchases not configured. Please set up RevenueCat API keys.',
      };
    }

    const { customerInfo } = await Purchases.purchasePackage(pkg);

    // Check if premium entitlement is now active
    const isPremium = customerInfo.entitlements.active[ENTITLEMENT_ID] !== undefined;

    return {
      success: isPremium,
      customerInfo,
      error: isPremium ? undefined : 'Purchase completed but entitlement not active',
    };
  } catch (error) {
    const purchaseError = error as PurchasesError;

    // User cancelled
    if (purchaseError.userCancelled) {
      return {
        success: false,
        cancelled: true,
      };
    }

    console.error('RevenueCat: Purchase failed', error);
    return {
      success: false,
      error: purchaseError.message || 'Purchase failed. Please try again.',
    };
  }
};

export const purchaseByProductId = async (productId: string): Promise<PurchaseResult> => {
  try {
    const packages = await getAvailablePackages();
    const pkg = packages.find((p) => p.identifier === productId);

    if (!pkg || !pkg.package) {
      return {
        success: false,
        error: 'Product not found',
      };
    }

    return await purchasePackage(pkg.package);
  } catch (error) {
    return {
      success: false,
      error: 'Failed to find product',
    };
  }
};

// ============================================
// RESTORE PURCHASES
// ============================================

export const restorePurchases = async (): Promise<PurchaseResult> => {
  try {
    if (!isConfigured) {
      return {
        success: false,
        error: 'Purchases not configured',
      };
    }

    const customerInfo = await Purchases.restorePurchases();
    const isPremium = customerInfo.entitlements.active[ENTITLEMENT_ID] !== undefined;

    return {
      success: isPremium,
      customerInfo,
      error: isPremium ? undefined : 'No active subscription found',
    };
  } catch (error) {
    console.error('RevenueCat: Restore failed', error);
    return {
      success: false,
      error: 'Failed to restore purchases. Please try again.',
    };
  }
};

// ============================================
// HELPERS
// ============================================

export const isRevenueCatConfigured = (): boolean => {
  const apiKey = Platform.OS === 'ios' ? REVENUECAT_API_KEY_IOS : REVENUECAT_API_KEY_ANDROID;
  return !apiKey.startsWith('YOUR_');
};

export const getSubscriptionStatus = async (): Promise<{
  isActive: boolean;
  expirationDate?: string;
  productId?: string;
  willRenew?: boolean;
}> => {
  try {
    if (!isConfigured) {
      return { isActive: false };
    }

    const customerInfo = await Purchases.getCustomerInfo();
    const entitlement = customerInfo.entitlements.active[ENTITLEMENT_ID];

    if (!entitlement) {
      return { isActive: false };
    }

    return {
      isActive: true,
      expirationDate: entitlement.expirationDate || undefined,
      productId: entitlement.productIdentifier,
      willRenew: entitlement.willRenew,
    };
  } catch (error) {
    return { isActive: false };
  }
};
