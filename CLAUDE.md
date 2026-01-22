# Claude Code Context Memory
**Project:** AyuVed Mobile App
**Last Updated:** 2026-01-20
**Status:** MVP Complete - Ready for Testing

---

## PROJECT OVERVIEW

### Purpose
A React Native/Expo mobile app that brings Ayurvedic diagnostics to users through AI-powered analysis. The app allows users to:
- Discover their dosha (Vata/Pitta/Kapha) through assessment
- Get AI-powered analysis of tongue, eyes, skin, nails, and pulse
- Track their Ojas (vital energy) through daily habits
- Receive personalized daily routines based on their constitution
- Chat with an AI Ayurvedic consultant

### Tech Stack
- **Framework:** React Native with Expo
- **Language:** TypeScript
- **Navigation:** React Navigation (bottom tabs + stack)
- **State:** React Context + AsyncStorage
- **Backend:** Express.js API server
- **AI:** Claude API (via backend proxy)
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
7. **Settings** - Developer mode, subscription status

### Backend API
- Running on port 4000
- Endpoints for all diagnostic analyses
- Usage tracking (free tier: 2 scans, 10 chats)
- Developer code activation for unlimited access
- Claude API integration with JSON response cleaning

### Recent Fixes (2026-01-20)
- Fixed storage key mismatch for skin analysis (`skinAnalysis` instead of `@ayuved_skin_analysis`)
- Added `await` to save functions to ensure data persists
- Fixed JSON parsing to handle Claude's markdown code blocks
- Removed "Add your Claude API key" messages (now uses backend)
- Added tongue and nail analysis to My Plan section
- Fixed icon for tongue analysis in Plan screen
- Removed "Excessive sexual activity" from Ojas depleters
- Added App Transport Security exception for iOS HTTP connections
- Updated expo-file-system to new File API

---

## PROJECT STRUCTURE

```
ayurveda-mobile/
├── App.tsx                    # Main app entry with navigation
├── app.json                   # Expo configuration
├── package.json               # Dependencies
├── src/
│   ├── components/           # Reusable UI components
│   │   ├── ManuscriptConstants.ts  # Theme colors/fonts
│   │   └── ...
│   ├── context/
│   │   └── SubscriptionContext.tsx  # User tier management
│   ├── data/
│   │   ├── dailyRoutines.ts   # Dosha-specific routines
│   │   ├── homeRemedies.ts    # Remedy database
│   │   └── doshaQuestions.ts  # Assessment questions
│   ├── screens/
│   │   ├── HomeScreen.tsx     # Main dashboard
│   │   ├── PlanScreen.tsx     # My Plan tab
│   │   ├── ConsultScreen.tsx  # AI chat
│   │   ├── RemediesScreen.tsx # Home remedies
│   │   ├── SettingsScreen.tsx # Settings & developer mode
│   │   ├── TongueDiagnosisScreen.tsx
│   │   ├── EyeAnalysisScreen.tsx
│   │   ├── SkinAnalysisScreen.tsx
│   │   ├── NailAnalysisScreen.tsx
│   │   ├── PulseAnalysisScreen.tsx
│   │   ├── DoshaAssessmentScreen.tsx
│   │   └── OjasTrackerScreen.tsx
│   └── services/
│       └── aiService.ts       # Backend API calls
├── backend/
│   ├── index.js              # Express server
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

## REMAINING WORK / TODO

### High Priority
1. **Persist developer mode** - Currently resets when backend restarts (need database)
2. **Test all AI analyses** - Verify Claude returns correct dosha assessments
3. **App Store preparation:**
   - Add proper app icons
   - Create screenshots
   - Write app description
   - Privacy policy
   - Terms of service

### Medium Priority
1. **Database integration** - Replace in-memory storage with Firebase/Supabase
2. **User authentication** - Sign up/login for data persistence
3. **Push notifications** - Daily routine reminders
4. **Offline mode** - Cache results for offline viewing
5. **Premium subscription** - In-app purchases (RevenueCat)

### Low Priority
1. **Dark mode** - Theme switching
2. **Multi-language** - Hindi, Sanskrit translations
3. **Social sharing** - Share dosha results
4. **Apple Watch** - Pulse analysis integration
5. **Widgets** - Daily tip widgets

### Known Issues
1. Backend uses in-memory storage - data lost on restart
2. Physical device testing requires computer's IP address in aiService.ts
3. iOS requires ATS exception for HTTP during development

---

## DESIGN SYSTEM

### Colors (ManuscriptConstants.ts)
```typescript
palmLeaf: '#F5E6D3'      // Background
parchment: '#FFF8E7'     // Cards
inkBlack: '#2C1810'      // Primary text
inkBrown: '#5D4037'      // Secondary text
copperBrown: '#B87333'   // Accents
vermillion: '#E34234'    // CTAs
oldPaper: '#E8D4B8'      // Subtle backgrounds
```

### Dosha Colors
- Vata: #60A5FA (Blue - Air)
- Pitta: #EF4444 (Red - Fire)
- Kapha: #10B981 (Green - Earth)

---

## API ENDPOINTS

### Backend Routes
```
GET  /                          # Health check
GET  /api/status                # User status & usage
POST /api/activate-developer    # Activate dev mode
POST /api/analyze/tongue        # Tongue analysis
POST /api/analyze/eyes          # Eye analysis
POST /api/analyze/skin          # Skin/facial analysis
POST /api/analyze/nails         # Nail analysis
POST /api/chat/consultation     # AI chat
```

### Request Headers
```
x-user-id: string  # Unique user identifier
```

---

## TESTING CHECKLIST

- [ ] Dosha assessment completes and saves
- [ ] Tongue analysis returns AI results
- [ ] Eye analysis returns AI results
- [ ] Skin analysis returns AI results and saves to Plan
- [ ] Nail analysis returns AI results and saves to Plan
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
```

### Mobile App
```bash
# Build for iOS
eas build --platform ios

# Build for Android
eas build --platform android
```

---

## CONTACTS & RESOURCES

- **Claude API Docs:** https://docs.anthropic.com
- **Expo Docs:** https://docs.expo.dev
- **React Navigation:** https://reactnavigation.org

---

**Session Notes (2026-01-20):**
Major debugging session fixing skin analysis saving, JSON parsing from Claude, and updating website to showcase mobile app. App is functionally complete for MVP testing.
