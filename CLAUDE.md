# Claude Code Context Memory
**Project:** NayaVed AI Mobile App
**Last Updated:** 2026-01-23
**Status:** MVP Complete - App Store Submission In Progress

---

## PROJECT OVERVIEW

### Purpose
A React Native/Expo mobile app that brings Ayurvedic diagnostics to users through AI-powered analysis. The app allows users to:
- Discover their dosha (Vata/Pitta/Kapha) through assessment
- Get AI-powered analysis of tongue, eyes, skin, nails, and pulse
- Track their Ojas (vital energy) through daily habits
- Receive personalized daily routines based on their constitution
- Chat with an AI Ayurvedic consultant
- Purchase Ayurvedic products via affiliate links

### Tech Stack
- **Framework:** React Native with Expo
- **Language:** TypeScript
- **Navigation:** React Navigation (bottom tabs + stack)
- **State:** React Context + AsyncStorage
- **Backend:** Express.js API server
- **AI:** Claude API (via backend proxy)
- **Payments:** RevenueCat (In-App Purchases)
- **Monetization:** Amazon Associates (Affiliate links)
- **Styling:** React Native StyleSheet with custom theme

---

## CURRENT STATE (What's Working)

### Core Features
1. **Dosha Assessment Quiz** - Complete questionnaire to determine Prakriti
2. **AI Diagnostic Screens:**
   - Tongue Analysis (Jihva Pariksha) - AI-powered
   - Eye Analysis (Netra Pariksha) - AI-powered
   - Skin/Facial Analysis (Twak Pariksha) - AI-powered
   - Nail Analysis (Nakha Pariksha) - AI-powered
   - Pulse Analysis (Nadi Pariksha) - Simulated/educational
3. **Ojas Tracker** - Daily habit tracking with facial glow scoring
4. **My Plan** - Personalized daily routines based on dosha
5. **AI Consultation** - Chat interface with Ayurvedic AI assistant
6. **Home Remedies** - Searchable remedy database
7. **Ayurvedic Pharmacy** - Product recommendations with affiliate links
8. **Settings** - Developer mode, subscription status, paywall
9. **Paywall Screen** - RevenueCat integration for premium subscriptions

### Backend API
- Running on port 4000
- Endpoints for all diagnostic analyses
- Usage tracking (free tier: 2 scans, 10 chats)
- Developer code activation for unlimited access
- Claude API integration with robust JSON response cleaning
- Safe JSON parsing with detailed error logging

---

## RECENT UPDATES (2026-01-23)

### Amazon Affiliate Integration
- Updated all 13 products in `products.ts` with Amazon affiliate links
- Affiliate tag: `nayaved-20`
- Products include herbs, oils, powders, and teas for all doshas
- OneLink ready for international users (US, India, UK, etc.)

### Improved Error Handling
- All analysis screens (Tongue, Skin, Eye, Nail) now gracefully fall back to educational mode
- Only shows alert for usage limit errors (prompts upgrade)
- Silently handles network/parsing errors without disturbing user
- Added null checks throughout to prevent crashes from missing data

### Backend JSON Parsing Improvements
- Enhanced `cleanJsonResponse()` to handle various Claude response formats
- Added `safeJsonParse()` with detailed error logging
- Data normalization ensures arrays and numbers are correct types
- Prevents JSON parsing crashes from malformed responses

### Code Documentation
- Added comprehensive comments to all major files
- Backend endpoints documented
- RevenueCat setup instructions added
- Affiliate setup guide included

---

## PENDING ITEMS / TODO

### Immediate (Before App Store Submission)
1. **Test affiliate links on mobile** - Verify Amazon links open correctly with tag
2. **Test tongue/skin/eye/nail analysis** - Verify AI results display properly
3. **Complete RevenueCat setup:**
   - Add products in RevenueCat dashboard
   - Create "premium" entitlement
   - Create "default" offering with monthly/yearly packages
4. **Build app:** `eas build --platform ios`
5. **Submit to App Store**

### Amazon Affiliate Setup (For Global Revenue)
1. Sign up for Amazon Associates in key markets:
   - Amazon.com (US) - Primary ✅ (tag: nayaved-20)
   - Amazon.in (India) - Sign up needed
   - Amazon.co.uk (UK) - Sign up needed
2. Enable OneLink in Associates Central → Tools → OneLink
3. Link international accounts for auto-redirect

### RevenueCat Configuration
- **iOS API Key:** `appdf7562d03f` ✅
- **Android API Key:** Not yet created
- **Products to create:**
  - `nayaved_premium_monthly` ($4.99/month)
  - `nayaved_premium_yearly` ($39.99/year)
- **Entitlement:** `premium`
- **Offering:** `default`

### High Priority
1. **Persist developer mode** - Currently resets when backend restarts (need database)
2. **Deploy backend to Vercel** - Update aiService.ts with production URL
3. **App Store screenshots** - Create for all device sizes
4. **Privacy policy & Terms** - Required for App Store

### Medium Priority
1. **Database integration** - Replace in-memory storage with Firebase/Supabase
2. **Push notifications** - Daily routine reminders
3. **Offline mode** - Cache results for offline viewing

### Low Priority
1. **Dark mode** - Theme switching
2. **Multi-language** - Hindi, Sanskrit translations
3. **Social sharing** - Share dosha results
4. **Apple Watch** - Pulse analysis integration

---

## PROJECT STRUCTURE

```
ayurveda-mobile/
├── App.tsx                    # Main app entry with navigation
├── app.json                   # Expo configuration
├── package.json               # Dependencies
├── CLAUDE.md                  # This context file
├── src/
│   ├── components/           # Reusable UI components
│   │   ├── ManuscriptConstants.ts  # Theme colors/fonts
│   │   ├── ProductCard.tsx   # Affiliate product display
│   │   └── ...
│   ├── context/
│   │   ├── SubscriptionContext.tsx  # User tier management
│   │   └── AuthContext.tsx   # Authentication state
│   ├── data/
│   │   ├── dailyRoutines.ts   # Dosha-specific routines
│   │   ├── homeRemedies.ts    # Remedy database
│   │   ├── products.ts        # Affiliate products (Amazon)
│   │   └── doshaQuestions.ts  # Assessment questions
│   ├── screens/
│   │   ├── HomeScreen.tsx     # Main dashboard
│   │   ├── PlanScreen.tsx     # My Plan tab
│   │   ├── ConsultScreen.tsx  # AI chat
│   │   ├── RemediesScreen.tsx # Home remedies
│   │   ├── PharmacyScreen.tsx # Product recommendations
│   │   ├── SettingsScreen.tsx # Settings & developer mode
│   │   ├── PaywallScreen.tsx  # Premium upgrade screen
│   │   ├── LoginScreen.tsx    # Authentication
│   │   ├── TongueDiagnosisScreen.tsx
│   │   ├── EyeAnalysisScreen.tsx
│   │   ├── SkinAnalysisScreen.tsx
│   │   ├── NailAnalysisScreen.tsx
│   │   ├── PulseAnalysisScreen.tsx
│   │   ├── DoshaAssessmentScreen.tsx
│   │   └── OjasTrackerScreen.tsx
│   └── services/
│       ├── aiService.ts       # Backend API calls
│       └── purchaseService.ts # RevenueCat integration
├── backend/
│   ├── index.js              # Express server (documented)
│   ├── package.json
│   ├── .env                  # API keys (not committed)
│   ├── .env.example
│   └── vercel.json           # Deployment config
└── assets/                   # App icons, images
```

---

## CONFIGURATION

### Backend Environment (.env)
```
CLAUDE_API_KEY=your-api-key
DEVELOPER_CODES=AYUVED_DEV_2024,SHIVI_ACCESS
FREE_SCAN_LIMIT=2
FREE_CHAT_LIMIT=10
PORT=4000
```

### Running the App
```bash
# Terminal 1: Start backend
cd backend && npm run dev

# Terminal 2: Start Expo
npx expo start
```

### Developer Access
Enter code `AYUVED_DEV_2024` or `SHIVI_ACCESS` in Settings to unlock unlimited scans.

---

## API ENDPOINTS

### Backend Routes
```
GET  /                          # Health check
GET  /api/user/status           # User status & usage
POST /api/developer/activate    # Activate dev mode
POST /api/analyze/tongue        # Tongue analysis (Jihva Pariksha)
POST /api/analyze/eyes          # Eye analysis (Netra Pariksha)
POST /api/analyze/skin          # Skin analysis (Twak Pariksha)
POST /api/analyze/nails         # Nail analysis (Nakha Pariksha)
POST /api/chat/consultation     # AI chat
```

### Request Headers
```
x-user-id: string  # Unique user identifier
Content-Type: application/json
```

---

## TESTING CHECKLIST

### AI Analysis (Test on Mobile)
- [ ] Tongue analysis returns AI results and displays correctly
- [ ] Eye analysis returns AI results and displays correctly
- [ ] Skin analysis returns AI results and displays correctly
- [ ] Nail analysis returns AI results and displays correctly
- [ ] Fallback to educational mode works when backend unavailable

### Affiliate Links (Test on Mobile)
- [ ] Pharmacy screen loads all products
- [ ] "Buy Now" opens Amazon with correct affiliate tag (nayaved-20)
- [ ] Products display correct prices and descriptions

### Subscriptions
- [ ] Paywall screen displays correctly
- [ ] "Coming Soon" shows when RevenueCat not configured
- [ ] Restore purchases button works

### Core Features
- [ ] Dosha assessment completes and saves
- [ ] Ojas tracker saves daily scores
- [ ] My Plan shows all completed analyses
- [ ] AI consultation responds correctly
- [ ] Developer mode activates with codes
- [ ] Usage limits work for free tier

---

## DEPLOYMENT

### Backend (Vercel)
```bash
cd backend
vercel --prod
# Update API_BASE_URL in src/services/aiService.ts with production URL
```

### Mobile App
```bash
# Build for iOS
eas build --platform ios

# Build for Android
eas build --platform android

# Submit to App Store
eas submit --platform ios
```

---

## BRANDING

### Colors
- **Copper Brown:** #B87333 (Used for "AI" in logo)
- **Vermillion:** #E34234 (CTAs, highlights)
- **Palm Leaf:** #F5E6D3 (Background)
- **Parchment:** #FFF8E7 (Cards)

### Dosha Colors
- **Vata:** #60A5FA (Blue - Air)
- **Pitta:** #EF4444 (Red - Fire)
- **Kapha:** #10B981 (Green - Earth)

---

## RESOURCES

- **RevenueCat Dashboard:** https://app.revenuecat.com
- **Amazon Associates:** https://affiliate-program.amazon.com
- **App Store Connect:** https://appstoreconnect.apple.com
- **Claude API Docs:** https://docs.anthropic.com
- **Expo Docs:** https://docs.expo.dev

---

**Session Notes (2026-01-23):**
Added Amazon affiliate integration with tag `nayaved-20`. Improved error handling across all analysis screens - now gracefully falls back to educational mode. Enhanced backend JSON parsing to handle various Claude response formats. Added comprehensive code comments. Ready for mobile testing of affiliate links and AI analysis before App Store submission.
