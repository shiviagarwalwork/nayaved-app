/**
 * ============================================================
 * NayaVed Backend - Persistent Storage Module
 * ============================================================
 *
 * Simple file-based persistence for user data.
 *
 * IMPORTANT: This uses local file storage which works for:
 * - Local development
 * - Single-instance deployments
 *
 * For production with Vercel or multi-instance deployments,
 * consider using:
 * - Vercel KV (Redis): https://vercel.com/docs/storage/vercel-kv
 * - Supabase: https://supabase.com
 * - Firebase: https://firebase.google.com
 * - MongoDB Atlas: https://mongodb.com/atlas
 *
 * The /tmp directory on Vercel is writable but NOT persistent
 * across deployments or cold starts. Data will be lost on redeploy.
 */

const fs = require('fs');
const path = require('path');

// Use /tmp for Vercel compatibility, local data dir for development
const DATA_DIR = process.env.NODE_ENV === 'production'
  ? '/tmp/nayaved-data'
  : path.join(__dirname, 'data');

const STORAGE_FILE = path.join(DATA_DIR, 'storage.json');

// Default storage structure
const defaultStorage = {
  userUsage: {},      // { [userId]: { scanCount, chatCount, lastReset, createdAt } }
  premiumUsers: [],   // Array of premium user IDs
  developerUsers: [], // Array of developer user IDs
  lastUpdated: null,
};

// In-memory cache of storage
let storageCache = null;

/**
 * Ensure data directory exists
 */
const ensureDataDir = () => {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
};

/**
 * Load storage from file
 */
const loadStorage = () => {
  if (storageCache) return storageCache;

  ensureDataDir();

  try {
    if (fs.existsSync(STORAGE_FILE)) {
      const data = fs.readFileSync(STORAGE_FILE, 'utf8');
      storageCache = JSON.parse(data);
      console.log(`Storage loaded: ${Object.keys(storageCache.userUsage).length} users, ${storageCache.developerUsers.length} developers, ${storageCache.premiumUsers.length} premium`);
    } else {
      storageCache = { ...defaultStorage };
      saveStorage();
      console.log('Storage initialized with defaults');
    }
  } catch (error) {
    console.error('Error loading storage, using defaults:', error.message);
    storageCache = { ...defaultStorage };
  }

  return storageCache;
};

/**
 * Save storage to file
 */
const saveStorage = () => {
  ensureDataDir();

  try {
    storageCache.lastUpdated = new Date().toISOString();
    fs.writeFileSync(STORAGE_FILE, JSON.stringify(storageCache, null, 2));
  } catch (error) {
    console.error('Error saving storage:', error.message);
  }
};

/**
 * Get or create user usage record
 */
const getUserUsage = (userId) => {
  const storage = loadStorage();

  if (!storage.userUsage[userId]) {
    storage.userUsage[userId] = {
      scanCount: 0,
      chatCount: 0,
      lastReset: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };
    saveStorage();
  }

  return storage.userUsage[userId];
};

/**
 * Increment user usage
 */
const incrementUsage = (userId, actionType) => {
  const usage = getUserUsage(userId);

  if (actionType === 'scan') {
    usage.scanCount++;
  } else if (actionType === 'chat') {
    usage.chatCount++;
  }

  saveStorage();
};

/**
 * Check if user is a developer
 */
const isDeveloperUser = (userId) => {
  const storage = loadStorage();
  return storage.developerUsers.includes(userId);
};

/**
 * Add developer user
 */
const addDeveloperUser = (userId) => {
  const storage = loadStorage();

  if (!storage.developerUsers.includes(userId)) {
    storage.developerUsers.push(userId);
    saveStorage();
    console.log(`Developer added: ${userId}`);
  }
};

/**
 * Check if user is premium
 */
const isPremiumUser = (userId) => {
  const storage = loadStorage();
  return storage.premiumUsers.includes(userId);
};

/**
 * Add premium user
 */
const addPremiumUser = (userId) => {
  const storage = loadStorage();

  if (!storage.premiumUsers.includes(userId)) {
    storage.premiumUsers.push(userId);
    saveStorage();
    console.log(`Premium user added: ${userId}`);
  }
};

/**
 * Remove premium user (for subscription cancellation)
 */
const removePremiumUser = (userId) => {
  const storage = loadStorage();
  const index = storage.premiumUsers.indexOf(userId);

  if (index > -1) {
    storage.premiumUsers.splice(index, 1);
    saveStorage();
    console.log(`Premium user removed: ${userId}`);
  }
};

/**
 * Get storage stats
 */
const getStats = () => {
  const storage = loadStorage();
  return {
    totalUsers: Object.keys(storage.userUsage).length,
    developerUsers: storage.developerUsers.length,
    premiumUsers: storage.premiumUsers.length,
    lastUpdated: storage.lastUpdated,
  };
};

module.exports = {
  getUserUsage,
  incrementUsage,
  isDeveloperUser,
  addDeveloperUser,
  isPremiumUser,
  addPremiumUser,
  removePremiumUser,
  getStats,
};
