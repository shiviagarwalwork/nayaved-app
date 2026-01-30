/**
 * ============================================================
 * NayaVed Backend API
 * ============================================================
 *
 * This Express.js server handles:
 * - Claude AI API calls for Ayurvedic diagnostic analysis
 * - User usage tracking (free tier limits)
 * - Developer mode activation
 * - Premium subscription verification (RevenueCat integration ready)
 *
 * Endpoints:
 * - GET  /                     - Health check
 * - GET  /api/user/status      - Get user subscription & usage status
 * - POST /api/developer/activate - Activate developer mode with code
 * - POST /api/analyze/tongue   - AI tongue diagnosis (Jihva Pariksha)
 * - POST /api/analyze/skin     - AI skin analysis (Twak Pariksha)
 * - POST /api/analyze/eyes     - AI eye analysis (Netra Pariksha)
 * - POST /api/analyze/nails    - AI nail analysis (Nakha Pariksha)
 * - POST /api/chat/consultation - AI Ayurvedic chat consultation
 *
 * @author NayaVed Team
 * @version 1.0.0
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { v4: uuidv4 } = require('uuid');

const app = express();

// ============================================================
// SECURITY MIDDLEWARE
// ============================================================

// Helmet for security headers (XSS protection, etc.)
app.use(helmet());

// CORS configuration - restrict origins in production
const corsOptions = {
  origin: process.env.NODE_ENV === 'production'
    ? ['https://nayaved.app', 'https://www.nayaved.app', 'exp://'] // Add your actual domains
    : true, // Allow all origins in development
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'x-user-id'],
  maxAge: 86400, // 24 hours
};
app.use(cors(corsOptions));

// Rate limiting - prevent abuse
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per 15 minutes
  message: { error: 'Too many requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

const aiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // 10 AI requests per minute
  message: { error: 'Too many AI requests, please slow down.' },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(generalLimiter);

app.use(express.json({ limit: '10mb' })); // Increased limit for base64 encoded images

// ============================================================
// CONFIGURATION
// ============================================================

const CLAUDE_API_URL = 'https://api.anthropic.com/v1/messages';
const CLAUDE_API_KEY = process.env.CLAUDE_API_KEY;
const DEVELOPER_CODES = (process.env.DEVELOPER_CODES || 'AYUVED_DEV_2024').split(',');
const FREE_SCAN_LIMIT = parseInt(process.env.FREE_SCAN_LIMIT || '2');  // Free users get 2 AI scans
const FREE_CHAT_LIMIT = parseInt(process.env.FREE_CHAT_LIMIT || '10'); // Free users get 10 chat messages

// ============================================================
// PERSISTENT STORAGE
// Uses file-based storage (see storage.js for production options)
// ============================================================

const storage = require('./storage');

// ============================================================
// JSON PARSING HELPERS
// Claude sometimes returns JSON wrapped in markdown code blocks
// ============================================================

/**
 * Cleans Claude's response by removing markdown code blocks
 * and extracting pure JSON content
 *
 * @param {string} response - Raw response from Claude API
 * @returns {string} - Cleaned JSON string ready for parsing
 */
const cleanJsonResponse = (response) => {
  let cleaned = response.trim();

  // Remove markdown code block markers (```json, ```JSON, or just ```)
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.slice(7);
  } else if (cleaned.startsWith('```JSON')) {
    cleaned = cleaned.slice(7);
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.slice(3);
  }

  if (cleaned.endsWith('```')) {
    cleaned = cleaned.slice(0, -3);
  }

  cleaned = cleaned.trim();

  // If Claude added extra text before/after JSON, extract just the JSON object
  const jsonStart = cleaned.indexOf('{');
  const jsonEnd = cleaned.lastIndexOf('}');

  if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
    cleaned = cleaned.substring(jsonStart, jsonEnd + 1);
  }

  return cleaned;
};

/**
 * Safely parses JSON with detailed error logging for debugging
 *
 * @param {string} response - Raw response from Claude API
 * @param {string} endpoint - API endpoint name for logging
 * @returns {object} - Parsed JSON object
 * @throws {Error} - If JSON parsing fails
 */
const safeJsonParse = (response, endpoint) => {
  const cleaned = cleanJsonResponse(response);
  try {
    return JSON.parse(cleaned);
  } catch (parseError) {
    console.error(`JSON parse error at ${endpoint}:`);
    console.error('Original response (first 500 chars):', response.substring(0, 500));
    console.error('Cleaned response (first 500 chars):', cleaned.substring(0, 500));
    console.error('Parse error:', parseError.message);
    throw new Error(`Failed to parse AI response: ${parseError.message}`);
  }
};

// Helper: Check if user can perform action
const canPerformAction = (userId, actionType) => {
  // Developers have unlimited access
  if (storage.isDeveloperUser(userId)) {
    return { allowed: true, reason: 'developer' };
  }

  // Premium users have unlimited access
  if (storage.isPremiumUser(userId)) {
    return { allowed: true, reason: 'premium' };
  }

  const usage = storage.getUserUsage(userId);

  if (actionType === 'scan') {
    if (usage.scanCount >= FREE_SCAN_LIMIT) {
      return {
        allowed: false,
        reason: 'limit_reached',
        message: `You've used all ${FREE_SCAN_LIMIT} free scans. Upgrade to Premium for unlimited scans!`,
        used: usage.scanCount,
        limit: FREE_SCAN_LIMIT,
      };
    }
    return { allowed: true, reason: 'free_tier', remaining: FREE_SCAN_LIMIT - usage.scanCount };
  }

  if (actionType === 'chat') {
    if (usage.chatCount >= FREE_CHAT_LIMIT) {
      return {
        allowed: false,
        reason: 'limit_reached',
        message: `You've used all ${FREE_CHAT_LIMIT} free chat messages. Upgrade to Premium for unlimited consultations!`,
        used: usage.chatCount,
        limit: FREE_CHAT_LIMIT,
      };
    }
    return { allowed: true, reason: 'free_tier', remaining: FREE_CHAT_LIMIT - usage.chatCount };
  }

  return { allowed: false, reason: 'unknown_action' };
};

// Helper: Increment usage (uses persistent storage)
const incrementUsage = (userId, actionType) => {
  storage.incrementUsage(userId, actionType);
};

// Helper: Call Claude API
const callClaudeAPI = async (messages, systemPrompt, maxTokens = 1024) => {
  if (!CLAUDE_API_KEY) {
    throw new Error('Server configuration error: API key not set');
  }

  const response = await fetch(CLAUDE_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': CLAUDE_API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: maxTokens,
      system: systemPrompt,
      messages: messages,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `API error: ${response.status}`);
  }

  const data = await response.json();
  return data.content[0].text;
};

// ============================================
// ROUTES
// ============================================

// Health check
app.get('/', (req, res) => {
  res.json({
    status: 'ok',
    service: 'NayaVed API',
    version: '1.0.0',
    storage: storage.getStats(),
  });
});

// Get user status (usage, subscription tier)
app.get('/api/user/status', (req, res) => {
  const userId = req.headers['x-user-id'];
  if (!userId) {
    return res.status(400).json({ error: 'User ID required' });
  }

  const usage = storage.getUserUsage(userId);
  const isDeveloper = storage.isDeveloperUser(userId);
  const isPremium = storage.isPremiumUser(userId);

  res.json({
    userId,
    tier: isDeveloper ? 'developer' : isPremium ? 'premium' : 'free',
    usage: {
      scans: {
        used: usage.scanCount,
        limit: isDeveloper || isPremium ? 'unlimited' : FREE_SCAN_LIMIT,
        remaining: isDeveloper || isPremium ? 'unlimited' : Math.max(0, FREE_SCAN_LIMIT - usage.scanCount),
      },
      chats: {
        used: usage.chatCount,
        limit: isDeveloper || isPremium ? 'unlimited' : FREE_CHAT_LIMIT,
        remaining: isDeveloper || isPremium ? 'unlimited' : Math.max(0, FREE_CHAT_LIMIT - usage.chatCount),
      },
    },
    features: {
      unlimitedScans: isDeveloper || isPremium,
      unlimitedChats: isDeveloper || isPremium,
      prioritySupport: isPremium,
    },
  });
});

// Activate developer access
app.post('/api/developer/activate', (req, res) => {
  const userId = req.headers['x-user-id'];
  const { code } = req.body;

  if (!userId) {
    return res.status(400).json({ error: 'User ID required' });
  }

  if (!code) {
    return res.status(400).json({ error: 'Developer code required' });
  }

  if (DEVELOPER_CODES.includes(code.trim())) {
    storage.addDeveloperUser(userId);
    res.json({
      success: true,
      message: 'Developer access activated! You now have unlimited access to all features.',
      tier: 'developer',
    });
  } else {
    res.status(401).json({ error: 'Invalid developer code' });
  }
});

// Activate premium subscription
// Note: In production, this should verify receipts with RevenueCat webhook
// or directly with Apple/Google. This endpoint is called by RevenueCat webhooks.
app.post('/api/subscription/activate', (req, res) => {
  const userId = req.headers['x-user-id'];
  const { receiptData, platform, revenueCatUserId } = req.body;

  if (!userId && !revenueCatUserId) {
    return res.status(400).json({ error: 'User ID required' });
  }

  const targetUserId = userId || revenueCatUserId;

  // Verify this is a legitimate RevenueCat webhook or has valid receipt
  // In production, you should:
  // 1. Verify the webhook signature from RevenueCat
  // 2. Or verify receipt directly with Apple/Google APIs
  const webhookSecret = process.env.REVENUECAT_WEBHOOK_SECRET;
  const authHeader = req.headers['authorization'];

  if (webhookSecret && authHeader !== `Bearer ${webhookSecret}`) {
    console.log('Subscription activation rejected: invalid authorization');
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // If webhook is properly authenticated, activate premium
  storage.addPremiumUser(targetUserId);
  console.log(`Premium activated for user: ${targetUserId}`);

  res.json({
    success: true,
    message: 'Premium subscription activated!',
    tier: 'premium',
  });
});

// ============================================
// VISION ANALYSIS ENDPOINTS
// ============================================

// Tongue Analysis
app.post('/api/analyze/tongue', aiLimiter, async (req, res) => {
  console.log('Tongue analysis request received');
  const userId = req.headers['x-user-id'];
  const { imageBase64 } = req.body;

  console.log('User ID:', userId);
  console.log('Image data length:', imageBase64?.length || 0);

  if (!userId) {
    return res.status(400).json({ error: 'User ID required' });
  }

  if (!imageBase64) {
    return res.status(400).json({ error: 'Image data required' });
  }

  // Check usage limits
  const canProceed = canPerformAction(userId, 'scan');
  if (!canProceed.allowed) {
    return res.status(403).json({
      error: 'usage_limit',
      ...canProceed,
    });
  }

  try {
    const systemPrompt = `You are an expert Ayurvedic practitioner specializing in Jihva Pariksha (tongue diagnosis). Analyze the tongue image and provide detailed insights based on classical Ayurvedic texts like Charaka Samhita.

Return your analysis in this exact JSON format:
{
  "coating": {
    "color": "white/yellow/brown/gray/none",
    "thickness": "thin/moderate/thick/none",
    "description": "detailed description of coating"
  },
  "tongueColor": "pale pink/bright red/dark red/purple/pale",
  "shape": "normal/swollen/thin/pointed/scalloped edges",
  "moisture": "dry/normal/wet/excessive",
  "cracks": ["list of crack patterns observed"],
  "doshaIndication": {
    "dominant": "Vata/Pitta/Kapha",
    "vataScore": 0-100,
    "pittaScore": 0-100,
    "kaphaScore": 0-100
  },
  "healthIndicators": ["list of health observations"],
  "recommendations": ["list of Ayurvedic recommendations"],
  "ayurvedicInterpretation": "detailed Ayurvedic interpretation paragraph"
}

Ayurvedic tongue indicators:
- Vata: dry, cracked, thin, trembling, pale/brownish coating
- Pitta: red, pointed, yellow coating, inflammation
- Kapha: swollen, thick white coating, pale, scalloped edges

Only return valid JSON, no markdown or explanation.`;

    const messages = [
      {
        role: 'user',
        content: [
          {
            type: 'image',
            source: {
              type: 'base64',
              media_type: 'image/jpeg',
              data: imageBase64,
            },
          },
          {
            type: 'text',
            text: 'Please analyze this tongue image using Ayurvedic Jihva Pariksha principles. Provide your analysis in the specified JSON format.',
          },
        ],
      },
    ];

    const response = await callClaudeAPI(messages, systemPrompt, 1500);
    console.log('Claude tongue response received, length:', response.length);

    const analysis = safeJsonParse(response, '/api/analyze/tongue');

    // Ensure cracks is an array
    if (!Array.isArray(analysis.cracks)) {
      analysis.cracks = analysis.cracks ? [analysis.cracks] : [];
    }

    // Ensure healthIndicators is an array
    if (!Array.isArray(analysis.healthIndicators)) {
      analysis.healthIndicators = analysis.healthIndicators ? [analysis.healthIndicators] : [];
    }

    // Ensure recommendations is an array
    if (!Array.isArray(analysis.recommendations)) {
      analysis.recommendations = analysis.recommendations ? [analysis.recommendations] : [];
    }

    // Ensure dosha scores are numbers
    if (analysis.doshaIndication) {
      analysis.doshaIndication.vataScore = Number(analysis.doshaIndication.vataScore) || 0;
      analysis.doshaIndication.pittaScore = Number(analysis.doshaIndication.pittaScore) || 0;
      analysis.doshaIndication.kaphaScore = Number(analysis.doshaIndication.kaphaScore) || 0;
    }

    console.log('Tongue analysis parsed successfully:', analysis.doshaIndication?.dominant);

    // Increment usage only on success
    incrementUsage(userId, 'scan');

    res.json({
      success: true,
      analysis,
      usage: canProceed.reason === 'free_tier' ? {
        remaining: canProceed.remaining - 1,
        limit: FREE_SCAN_LIMIT,
      } : null,
    });
  } catch (error) {
    console.error('Tongue analysis error:', error.message);
    res.status(500).json({ error: error.message || 'Analysis failed' });
  }
});

// Skin Analysis
app.post('/api/analyze/skin', aiLimiter, async (req, res) => {
  console.log('Skin/Facial analysis request received');
  const userId = req.headers['x-user-id'];
  const { imageBase64 } = req.body;

  console.log('User ID:', userId);
  console.log('Image data length:', imageBase64?.length || 0);

  if (!userId) {
    return res.status(400).json({ error: 'User ID required' });
  }

  if (!imageBase64) {
    return res.status(400).json({ error: 'Image data required' });
  }

  const canProceed = canPerformAction(userId, 'scan');
  console.log('Can proceed:', canProceed);
  if (!canProceed.allowed) {
    return res.status(403).json({ error: 'usage_limit', ...canProceed });
  }

  try {
    console.log('Starting Claude API call for skin analysis...');
    const systemPrompt = `You are an expert Ayurvedic practitioner specializing in Twak Pariksha (skin diagnosis). Analyze the facial image for skin health indicators based on Ayurvedic principles.

Return your analysis in this exact JSON format:
{
  "luminosity": 0-100,
  "texture": 0-100,
  "toneEvenness": 0-100,
  "moisture": 0-100,
  "inflammation": 0-100,
  "doshaIndication": {
    "dominant": "Vata/Pitta/Kapha",
    "characteristics": ["list of observed dosha characteristics"]
  },
  "skinType": "dry/oily/combination/sensitive/normal",
  "ojasContribution": 0-30,
  "concerns": ["list of skin concerns observed"],
  "recommendations": ["list of Ayurvedic skincare recommendations"],
  "ayurvedicInterpretation": "detailed interpretation paragraph"
}

Only return valid JSON, no markdown or explanation.`;

    const messages = [
      {
        role: 'user',
        content: [
          { type: 'image', source: { type: 'base64', media_type: 'image/jpeg', data: imageBase64 } },
          { type: 'text', text: 'Analyze this facial image for skin health using Ayurvedic Twak Pariksha principles.' },
        ],
      },
    ];

    const response = await callClaudeAPI(messages, systemPrompt, 1500);
    console.log('Claude API response received for skin analysis, length:', response.length);
    const analysis = safeJsonParse(response, '/api/analyze/skin');

    // Ensure arrays
    if (!Array.isArray(analysis.concerns)) {
      analysis.concerns = analysis.concerns ? [analysis.concerns] : [];
    }
    if (!Array.isArray(analysis.recommendations)) {
      analysis.recommendations = analysis.recommendations ? [analysis.recommendations] : [];
    }
    if (analysis.doshaIndication && !Array.isArray(analysis.doshaIndication.characteristics)) {
      analysis.doshaIndication.characteristics = analysis.doshaIndication.characteristics ? [analysis.doshaIndication.characteristics] : [];
    }

    console.log('Skin analysis result - Type:', analysis.skinType, '| Dosha:', analysis.doshaIndication?.dominant, '| Luminosity:', analysis.luminosity);

    incrementUsage(userId, 'scan');

    res.json({
      success: true,
      analysis,
      usage: canProceed.reason === 'free_tier' ? { remaining: canProceed.remaining - 1, limit: FREE_SCAN_LIMIT } : null,
    });
  } catch (error) {
    console.error('Skin analysis error:', error.message);
    res.status(500).json({ error: error.message || 'Analysis failed' });
  }
});

// Eye Analysis
app.post('/api/analyze/eyes', aiLimiter, async (req, res) => {
  console.log('Eye analysis request received');
  const userId = req.headers['x-user-id'];
  const { imageBase64 } = req.body;

  console.log('User ID:', userId);
  console.log('Image data length:', imageBase64?.length || 0);

  if (!userId) {
    console.log('Error: No user ID');
    return res.status(400).json({ error: 'User ID required' });
  }

  if (!imageBase64) {
    console.log('Error: No image data');
    return res.status(400).json({ error: 'Image data required' });
  }

  const canProceed = canPerformAction(userId, 'scan');
  console.log('Can proceed:', canProceed);
  if (!canProceed.allowed) {
    return res.status(403).json({ error: 'usage_limit', ...canProceed });
  }

  try {
    const systemPrompt = `You are an expert Ayurvedic practitioner specializing in Netra Pariksha (eye diagnosis). Analyze the eye image for health indicators.

Return your analysis in this exact JSON format:
{
  "clarity": 0-100,
  "scleraWhiteness": 0-100,
  "moisture": 0-100,
  "redness": 0-100,
  "brightness": 0-100,
  "doshaIndication": {
    "dominant": "Vata/Pitta/Kapha",
    "characteristics": ["list of observed characteristics"]
  },
  "healthIndicators": {
    "liverHealth": "assessment based on sclera color",
    "eyeStrain": "assessment of eye strain indicators",
    "overallVitality": "Ojas assessment from eye brightness"
  },
  "concerns": ["list of eye health concerns"],
  "recommendations": ["list of Ayurvedic eye care recommendations"],
  "ayurvedicInterpretation": "detailed interpretation paragraph"
}

Only return valid JSON, no markdown or explanation.`;

    const messages = [
      {
        role: 'user',
        content: [
          { type: 'image', source: { type: 'base64', media_type: 'image/jpeg', data: imageBase64 } },
          { type: 'text', text: 'Analyze this eye image using Ayurvedic Netra Pariksha principles.' },
        ],
      },
    ];

    const response = await callClaudeAPI(messages, systemPrompt, 1500);
    console.log('Claude eye response received, length:', response.length);
    const analysis = safeJsonParse(response, '/api/analyze/eyes');

    // Ensure arrays
    if (!Array.isArray(analysis.concerns)) {
      analysis.concerns = analysis.concerns ? [analysis.concerns] : [];
    }
    if (!Array.isArray(analysis.recommendations)) {
      analysis.recommendations = analysis.recommendations ? [analysis.recommendations] : [];
    }
    if (analysis.doshaIndication && !Array.isArray(analysis.doshaIndication.characteristics)) {
      analysis.doshaIndication.characteristics = analysis.doshaIndication.characteristics ? [analysis.doshaIndication.characteristics] : [];
    }

    console.log('Eye analysis parsed successfully:', analysis.doshaIndication?.dominant);

    incrementUsage(userId, 'scan');

    res.json({
      success: true,
      analysis,
      usage: canProceed.reason === 'free_tier' ? { remaining: canProceed.remaining - 1, limit: FREE_SCAN_LIMIT } : null,
    });
  } catch (error) {
    console.error('Eye analysis error:', error.message);
    res.status(500).json({ error: error.message || 'Analysis failed' });
  }
});

// Log all incoming requests
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Nail Analysis
app.post('/api/analyze/nails', aiLimiter, async (req, res) => {
  const userId = req.headers['x-user-id'];
  const { imageBase64 } = req.body;

  if (!userId) {
    return res.status(400).json({ error: 'User ID required' });
  }

  if (!imageBase64) {
    return res.status(400).json({ error: 'Image data required' });
  }

  const canProceed = canPerformAction(userId, 'scan');
  if (!canProceed.allowed) {
    return res.status(403).json({ error: 'usage_limit', ...canProceed });
  }

  try {
    const systemPrompt = `You are an expert Ayurvedic practitioner specializing in Nakha Pariksha (nail diagnosis). Analyze the nail image for health indicators.

Return your analysis in this exact JSON format:
{
  "color": 0-100,
  "texture": 0-100,
  "strength": 0-100,
  "lunulaVisibility": 0-100,
  "surfaceClarity": 0-100,
  "doshaIndication": {
    "dominant": "Vata/Pitta/Kapha",
    "characteristics": ["list of observed characteristics"]
  },
  "nutrientIndicators": {
    "iron": "assessment (pale nails indicate deficiency)",
    "bVitamins": "assessment (ridges indicate deficiency)",
    "calcium": "assessment (brittle nails)",
    "zinc": "assessment (white spots)"
  },
  "concerns": ["list of nail health concerns"],
  "recommendations": ["list of Ayurvedic and nutritional recommendations"],
  "ayurvedicInterpretation": "detailed interpretation paragraph"
}

Only return valid JSON, no markdown or explanation.`;

    const messages = [
      {
        role: 'user',
        content: [
          { type: 'image', source: { type: 'base64', media_type: 'image/jpeg', data: imageBase64 } },
          { type: 'text', text: 'Analyze this nail image using Ayurvedic Nakha Pariksha principles.' },
        ],
      },
    ];

    const response = await callClaudeAPI(messages, systemPrompt, 1500);
    console.log('Claude nail response received, length:', response.length);
    const analysis = safeJsonParse(response, '/api/analyze/nails');

    // Ensure arrays
    if (!Array.isArray(analysis.concerns)) {
      analysis.concerns = analysis.concerns ? [analysis.concerns] : [];
    }
    if (!Array.isArray(analysis.recommendations)) {
      analysis.recommendations = analysis.recommendations ? [analysis.recommendations] : [];
    }
    if (analysis.doshaIndication && !Array.isArray(analysis.doshaIndication.characteristics)) {
      analysis.doshaIndication.characteristics = analysis.doshaIndication.characteristics ? [analysis.doshaIndication.characteristics] : [];
    }

    console.log('Nail analysis parsed successfully:', analysis.doshaIndication?.dominant);

    incrementUsage(userId, 'scan');

    res.json({
      success: true,
      analysis,
      usage: canProceed.reason === 'free_tier' ? { remaining: canProceed.remaining - 1, limit: FREE_SCAN_LIMIT } : null,
    });
  } catch (error) {
    console.error('Nail analysis error:', error.message);
    res.status(500).json({ error: error.message || 'Analysis failed' });
  }
});

// ============================================
// CHAT CONSULTATION ENDPOINT
// ============================================

app.post('/api/chat/consultation', aiLimiter, async (req, res) => {
  const userId = req.headers['x-user-id'];
  const { message, conversationHistory, userDosha } = req.body;

  if (!userId) {
    return res.status(400).json({ error: 'User ID required' });
  }

  if (!message) {
    return res.status(400).json({ error: 'Message required' });
  }

  const canProceed = canPerformAction(userId, 'chat');
  if (!canProceed.allowed) {
    return res.status(403).json({ error: 'usage_limit', ...canProceed });
  }

  try {
    const doshaContext = userDosha
      ? `The user's dominant dosha is ${userDosha}. Consider this when providing recommendations.`
      : '';

    const systemPrompt = `You are a knowledgeable and compassionate Ayurvedic practitioner (Vaidya) providing health consultations based on ancient Ayurvedic wisdom from texts like Charaka Samhita, Sushruta Samhita, and Ashtanga Hridaya.

${doshaContext}

Guidelines:
1. Provide advice rooted in authentic Ayurvedic principles
2. Reference classical texts when appropriate
3. Consider the three doshas (Vata, Pitta, Kapha) in your recommendations
4. Suggest dietary changes, lifestyle modifications, herbs, and daily routines (Dinacharya)
5. Be warm, supportive, and use simple language
6. Always remind users that your advice is educational and not a substitute for medical care
7. If the condition seems serious, recommend consulting a healthcare professional
8. Use Ayurvedic terms but explain them in simple English

Format your responses with clear structure using **bold** for headings and bullet points for lists.`;

    const messages = [
      ...(conversationHistory || []).map(msg => ({
        role: msg.role,
        content: msg.content,
      })),
      { role: 'user', content: message },
    ];

    const response = await callClaudeAPI(messages, systemPrompt, 1024);

    incrementUsage(userId, 'chat');

    res.json({
      success: true,
      response,
      usage: canProceed.reason === 'free_tier' ? { remaining: canProceed.remaining - 1, limit: FREE_CHAT_LIMIT } : null,
    });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ error: error.message || 'Chat failed' });
  }
});

// ============================================
// START SERVER
// ============================================

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`NayaVed API running on port ${PORT}`);
  console.log(`Free scan limit: ${FREE_SCAN_LIMIT}`);
  console.log(`Free chat limit: ${FREE_CHAT_LIMIT}`);
  console.log(`Developer codes configured: ${DEVELOPER_CODES.length}`);
});
