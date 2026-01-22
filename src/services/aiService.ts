// AI Service for NayaVed AI App
// Connects to backend API for Claude AI integration

import AsyncStorage from '@react-native-async-storage/async-storage';
import { File } from 'expo-file-system';

// Backend API URL - Change this when deploying
// For local development: http://localhost:4000
// For production: Deployed on Vercel
// For physical device testing, use your computer's IP address
// For simulator, localhost works fine
const API_BASE_URL = __DEV__
  ? 'http://10.0.0.218:4000'  // Your computer's local IP for development
  : 'https://backend-8j5meijqw-shiviagarwalwork-6100s-projects.vercel.app'; // Production API on Vercel

// Storage keys
const USER_ID_KEY = '@nayaved_user_id';
const DEV_MODE_KEY = '@nayaved_dev_mode';

// ============================================
// USER MANAGEMENT
// ============================================

// Get or create user ID
export const getUserId = async (): Promise<string> => {
  let userId = await AsyncStorage.getItem(USER_ID_KEY);
  if (!userId) {
    // Generate a unique ID for the user
    userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    await AsyncStorage.setItem(USER_ID_KEY, userId);
  }
  return userId;
};

// ============================================
// API HELPER
// ============================================

const apiCall = async (endpoint: string, body?: any) => {
  const userId = await getUserId();

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: body ? 'POST' : 'GET',
    headers: {
      'Content-Type': 'application/json',
      'x-user-id': userId,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await response.json();

  if (!response.ok) {
    // Check if it's a usage limit error
    if (data.error === 'usage_limit') {
      const error: any = new Error(data.message || 'Usage limit reached');
      error.code = 'USAGE_LIMIT';
      error.data = data;
      throw error;
    }
    throw new Error(data.error || `API error: ${response.status}`);
  }

  return data;
};

// Convert image URI to base64
const imageToBase64 = async (imageUri: string): Promise<string> => {
  const file = new File(imageUri);
  const base64 = await file.base64();
  return base64;
};

// ============================================
// USER STATUS & SUBSCRIPTION
// ============================================

export interface UserStatus {
  userId: string;
  tier: 'free' | 'premium' | 'developer';
  usage: {
    scans: { used: number; limit: number | 'unlimited'; remaining: number | 'unlimited' };
    chats: { used: number; limit: number | 'unlimited'; remaining: number | 'unlimited' };
  };
  features: {
    unlimitedScans: boolean;
    unlimitedChats: boolean;
    prioritySupport: boolean;
  };
}

export const getUserStatus = async (): Promise<UserStatus> => {
  try {
    const data = await apiCall('/api/user/status');
    return data;
  } catch (error) {
    // Return default free tier status on error
    const userId = await getUserId();
    return {
      userId,
      tier: 'free',
      usage: {
        scans: { used: 0, limit: 2, remaining: 2 },
        chats: { used: 0, limit: 10, remaining: 10 },
      },
      features: {
        unlimitedScans: false,
        unlimitedChats: false,
        prioritySupport: false,
      },
    };
  }
};

export const activateDeveloperMode = async (code: string): Promise<boolean> => {
  try {
    const data = await apiCall('/api/developer/activate', { code });
    if (data.success) {
      await AsyncStorage.setItem(DEV_MODE_KEY, 'true');
      return true;
    }
    return false;
  } catch (error) {
    return false;
  }
};

export const isDeveloperMode = async (): Promise<boolean> => {
  const devMode = await AsyncStorage.getItem(DEV_MODE_KEY);
  return devMode === 'true';
};

// ============================================
// TONGUE ANALYSIS
// ============================================

export interface TongueAnalysisResult {
  coating: {
    color: string;
    thickness: string;
    description: string;
  };
  tongueColor: string;
  shape: string;
  moisture: string;
  cracks: string[];
  doshaIndication: {
    dominant: 'Vata' | 'Pitta' | 'Kapha';
    vataScore: number;
    pittaScore: number;
    kaphaScore: number;
  };
  healthIndicators: string[];
  recommendations: string[];
  ayurvedicInterpretation: string;
}

export const analyzeTongue = async (imageUri: string): Promise<TongueAnalysisResult> => {
  const imageBase64 = await imageToBase64(imageUri);
  const data = await apiCall('/api/analyze/tongue', { imageBase64 });
  return data.analysis;
};

// ============================================
// SKIN ANALYSIS
// ============================================

export interface SkinAnalysisResult {
  luminosity: number;
  texture: number;
  toneEvenness: number;
  moisture: number;
  inflammation: number;
  doshaIndication: {
    dominant: 'Vata' | 'Pitta' | 'Kapha';
    characteristics: string[];
  };
  skinType: string;
  ojasContribution: number;
  concerns: string[];
  recommendations: string[];
  ayurvedicInterpretation: string;
}

export const analyzeSkin = async (imageUri: string): Promise<SkinAnalysisResult> => {
  const imageBase64 = await imageToBase64(imageUri);
  const data = await apiCall('/api/analyze/skin', { imageBase64 });
  return data.analysis;
};

// ============================================
// EYE ANALYSIS
// ============================================

export interface EyeAnalysisResult {
  clarity: number;
  scleraWhiteness: number;
  moisture: number;
  redness: number;
  brightness: number;
  doshaIndication: {
    dominant: 'Vata' | 'Pitta' | 'Kapha';
    characteristics: string[];
  };
  healthIndicators: {
    liverHealth: string;
    eyeStrain: string;
    overallVitality: string;
  };
  concerns: string[];
  recommendations: string[];
  ayurvedicInterpretation: string;
}

export const analyzeEyes = async (imageUri: string): Promise<EyeAnalysisResult> => {
  const imageBase64 = await imageToBase64(imageUri);
  const data = await apiCall('/api/analyze/eyes', { imageBase64 });
  return data.analysis;
};

// ============================================
// NAIL ANALYSIS
// ============================================

export interface NailAnalysisResult {
  color: number;
  texture: number;
  strength: number;
  lunulaVisibility: number;
  surfaceClarity: number;
  doshaIndication: {
    dominant: 'Vata' | 'Pitta' | 'Kapha';
    characteristics: string[];
  };
  nutrientIndicators: {
    iron: string;
    bVitamins: string;
    calcium: string;
    zinc: string;
  };
  concerns: string[];
  recommendations: string[];
  ayurvedicInterpretation: string;
}

export const analyzeNails = async (imageUri: string): Promise<NailAnalysisResult> => {
  const imageBase64 = await imageToBase64(imageUri);
  const data = await apiCall('/api/analyze/nails', { imageBase64 });
  return data.analysis;
};

// ============================================
// CHAT CONSULTATION
// ============================================

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export const getAyurvedicConsultation = async (
  userMessage: string,
  conversationHistory: ChatMessage[],
  userDosha?: string
): Promise<string> => {
  const data = await apiCall('/api/chat/consultation', {
    message: userMessage,
    conversationHistory,
    userDosha,
  });
  return data.response;
};

// ============================================
// UTILITY - Check if backend is available
// ============================================

export const isApiConfigured = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}/`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    const data = await response.json();
    return data.status === 'ok';
  } catch (error) {
    console.log('Backend not available:', error);
    return false;
  }
};

// Legacy functions for backward compatibility
export const getApiKey = async (): Promise<string | null> => {
  // No longer used - backend handles API key
  return null;
};

export const setApiKey = async (key: string): Promise<void> => {
  // No longer used - backend handles API key
};

export const testApiConnection = async (): Promise<boolean> => {
  return await isApiConfigured();
};
