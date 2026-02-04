# Claude Code Context Memory
**Project:** NayaVed AI Mobile App
**Last Updated:** 2026-02-04
**Status:** MVP Complete - FREE APP (Subscriptions Disabled)

---

## ⚠️ IMPORTANT REMINDERS

### Before App Store Submission
**ALWAYS bump the build number before building for App Store submission!**
1. Edit `app.json` → `expo.ios.buildNumber` (increment by 1)
2. Commit the change
3. Then run `eas build --platform ios --profile production`
4. Then run `eas submit --platform ios --latest`

Apple rejects duplicate build numbers. Current build number: **14**

---

## PROJECT OVERVIEW

### Purpose
A React Native/Expo mobile app that brings Ayurvedic diagnostics to users through AI-powered analysis. The app allows users to:
- Discover their dosha (Vata/Pitta/Kapha) through assessment
- Get AI-powered analysis of tongue, eyes, skin, nails, and pulse
- Track their Ojas (vital energy) through daily habits + scan contributions
- Receive personalized daily routines based on their constitution
- Chat with an AI Ayurvedic consultant
- Purchase Ayurvedic products via affiliate links (US, India, Canada)
- Share Ojas score as a screenshot image

### Tech Stack
- **Framework:** React Native with Expo (SDK 54)
- **Language:** TypeScript
- **Navigation:** React Navigation (bottom tabs + stack)
- **State:** React Context + AsyncStorage
- **Backend:** Express.js API server
- **AI:** Claude API (via backend proxy)
- **Payments:** RevenueCat (In-App Purchases)
- **Monetization:** Amazon Associates (Affiliate links - US, India, Canada)
- **Styling:** React Native StyleSheet with custom manuscript theme
- **Sharing:** react-native-view-shot + expo-sharing (screenshot sharing)
- **E2E Testing:** Detox (iOS/Android) + Playwright (Web)

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
3. **Ojas Tracker** - Daily habit tracking + scan contributions from all 5 scans + screenshot sharing
4. **My Plan** - Personalized daily routines with 5 visible tabs (Morning, Midday, Evening, Diet, Herbs)
5. **AI Consultation** - Chat interface with Ayurvedic AI assistant (Ask Vaidya)
6. **Home Remedies** - Searchable remedy database (Quick Fixes)
7. **Wellness Shop** - Product recommendations with regional affiliate links (tab: "Wellness")
8. **Blog / Learn** - Ayurvedic blog posts, DailyInsight component pulls from blog data
9. **Settings** - Developer mode, subscription status, paywall, notifications, data management
10. **Paywall Screen** - RevenueCat integration for premium subscriptions
11. **Daily Ritual / Streak System** - StreakBanner on Home, daily scan tracking, milestones
12. **Push Notifications** - Morning ritual, daily wisdom, streak reminders

### Bottom Tab Navigation (7 tabs)
1. **Home** (Quick Start) - HomeStackNavigator
2. **Consult** (Ask Vaidya) - ConsultationScreen
3. **Ojas** (Ojas Glow) - OjasTrackerScreen
4. **Plan** (My Plan) - PlanScreen
5. **Pharmacy** (Wellness) - PharmacyScreen
6. **Blog** (Learn) - BlogStackNavigator
7. **Settings** - SettingsScreen

### Backend API
- Running on port 4000
- Endpoints for all diagnostic analyses
- Usage tracking (free tier: 2 scans, 10 chats)
- Developer code activation for unlimited access
- Claude API integration with robust JSON response cleaning
- Safe JSON parsing with detailed error logging

---

## RECENT UPDATES (2026-01-28)

### Ojas Screenshot Sharing
- Installed `react-native-view-shot` and `expo-sharing`
- Share button captures header + avatar + score breakdown as PNG image
- Includes "NayaVed - Track Your Vitality" branding in captured image
- Share button positioned outside ViewShot so it doesn't appear in screenshot

### Ojas Score from All 5 Scans
- Each scan type (tongue, eye, skin, nail, pulse) contributes 3-5 pts to Ojas score
- Created `saveScanOjasContribution()` and `calculateScanOjasContribution()` in dailyRitualService.ts
- All 5 scan screens updated to save Ojas contributions after analysis
- OjasTrackerScreen shows per-scan breakdown with colored icons

### Amazon Canada Support ✅
- Added `UserRegion` type: `'US' | 'IN' | 'CA' | 'other'`
- Region detection via locale regionCode + timezone fallback (Canadian cities)
- Canada uses search-based Amazon links (ASINs differ across stores)
- Amazon affiliate tags:
  - **US:** `nayaved-20` (amazon.com)
  - **India:** `nayaved-21` (amazon.in)
  - **Canada:** `nayaved0c-20` (amazon.ca)
- `ProductCard.tsx` updated: `isUserInIndia()` → `getUserRegion()` returning `UserRegion`

### Wellness Tab (Previously Missing)
- `PharmacyScreen` was imported but not rendered in bottom tabs
- Added `<Tab.Screen name="Pharmacy" component={PharmacyScreen} options={{ title: 'Wellness' }} />`

### Plan Screen Tabs Fix
- Changed from horizontal ScrollView (hid Diet & Herbs) to flex-wrap layout
- All 5 tabs (Morning, Midday, Evening, Diet, Herbs) now visible without scrolling
- Reduced icon/text size for compact fit

### DailyInsight from Blogs
- DailyInsight component now pulls from `blogs.ts` instead of hardcoded DAILY_INSIGHTS
- Navigates to specific blog via nested navigation: `navigate('Blog', { screen: 'BlogMain', params: { blogId } })`
- BlogScreen accepts `blogId` param and auto-opens the blog on focus

### Daily Scans Visibility
- StreakBanner filters to only show incomplete scans for today
- Shows "All Complete" banner when all scans done
- Added "Reset Today's Scans" in Settings > Data Management

### Settings - Data Management
- New section in SettingsScreen with "Reset Today's Scans" button
- Clears today's scan history from AsyncStorage
- Allows re-testing daily scan flow

---

## PREVIOUS UPDATES (2026-01-27)

### Daily Ritual / Streak System
- Created `src/services/dailyRitualService.ts` for streak tracking
- Created `src/components/StreakBanner.tsx` for displaying daily ritual status
- Integrated streak tracking into HomeScreen
- All 6 diagnostic screens now save to dailyRitualService
- Features: Body Weather, Streak counter, Milestones (3/7/14/30 days), Daily Wisdom quotes

### Legal, Notifications, Curiosity Gap, Amazon India
- Privacy Policy & Terms links in Settings
- Push notifications with expo-notifications (morning ritual, wisdom, streak)
- Curiosity Gap paywall: free users see metrics, premium gets full protocols
- Amazon India support with region detection

---

## PENDING ITEMS / TODO

### Completed ✅
- [x] Test affiliate links on mobile (US, India, Canada)
- [x] Test tongue/skin/eye/nail analysis manually
- [x] Build deployable (2026-01-27)
- [x] Amazon affiliate integration (US + India + Canada)
- [x] Privacy Policy & Terms
- [x] Curiosity Gap paywall
- [x] Push notifications
- [x] Daily Ritual / Streak system
- [x] Social sharing for Ojas (screenshot)
- [x] Ojas contributions from all 5 scans
- [x] DailyInsight from blogs
- [x] Plan screen tabs visible (flex-wrap)
- [x] Wellness/Pharmacy tab in navigation
- [x] Canada region detection + Amazon links
- [x] Data management (reset scans) in Settings
- [x] Native PPG frame processor (Swift + config plugins)
- [x] Login spinner fix (only active button shows spinner)
- [x] User data isolation (separate storage per user)
- [x] Google OAuth configuration
- [x] TypeScript error fixes (FeatureGate, OjasTracker, notifications)
- [x] App icon resized to 1024x1024
- [x] Git commit & push to GitHub (2026-01-30)
- [x] TestFlight build & testing (2026-01-31)
- [x] Backend deployed to Vercel
- [x] Amazon India Associates signup
- [x] App Store screenshots (8 screenshots in app-store-listing/)
- [x] App Store metadata (description, keywords, privacy labels)

### IMMEDIATE NEXT STEPS (Do These Now)
1. **Complete RevenueCat setup** (manual - dashboard)
2. **Submit to App Store** - `eas submit --platform ios`

### App Store Assets Ready ✅
- 8 screenshots in `app-store-listing/` folder
- Full App Store listing text in `app-store-listing/APP_STORE_LISTING.md`
- Screenshot captions in `app-store-listing/SCREENSHOT_CAPTIONS.md`
- Submission checklist in `app-store-listing/SUBMISSION_CHECKLIST.md`

### High Priority - Before App Store Release
1. ~~**Deploy backend to Vercel**~~ - ✅ Done - Live at `https://backend-nu-gold-17.vercel.app`
2. ~~**App Store screenshots**~~ - ✅ Done - 8 screenshots in `app-store-listing/`
3. ~~**App Store metadata**~~ - ✅ Done - Description, keywords, privacy labels in `APP_STORE_LISTING.md`
4. **Complete RevenueCat setup** (manual - dashboard):
   - Create products: `nayaved_premium_monthly` ($4.99), `nayaved_premium_yearly` ($39.99)
   - Create entitlement: `premium`
   - Create offering: `default`
   - Link App Store Connect app
5. **Submit to App Store** - `eas submit --platform ios`

### Medium Priority
1. ~~**Amazon Associates signup**~~ - ✅ Done - US, Canada, India accounts active
2. ~~**Persist developer mode**~~ - ✅ Done - File-based storage added (see backend/storage.js)
3. ~~**Set up Sentry**~~ - ✅ Done - Configured in App.tsx, source map upload disabled for now
4. ~~**Update Detox E2E tests**~~ - ✅ Done - 21/26 tests passing
5. **Android build & submission** - `eas build --platform android` + Google Play Console

### Low Priority
1. **Database integration** - Replace in-memory storage with Firebase/Supabase
2. **Dark mode** - Theme switching
3. **Apple Watch** - Pulse analysis integration
4. **Offline mode** - Cache results for offline viewing

---

## POST-LAUNCH TECHNICAL DEBT (2026-01-31 Audit)

Issues identified during pre-launch audit. None are critical, but should be addressed post-launch.

### Security Improvements (Medium Priority)
1. **Add `Sentry.captureException()` in catch blocks** - Currently only console.log, errors not explicitly sent to Sentry
2. **Wrap JSON.parse in try-catch** - 5 locations risk crash on corrupted AsyncStorage:
   - `HomeScreen.tsx` (lines 391-398)
   - `OjasTrackerScreen.tsx` (lines 134, 150)
   - `dailyRitualService.ts` (lines 114, 194, 224, 326, 349)
   - `AuthContext.tsx` (line 94)
3. **Enable Sentry source maps** - Currently disabled in `eas.json`, stack traces are minified
4. **Add Error Boundary component** - Catch React component crashes gracefully
5. **Validate Google OAuth response** - Check `response.ok` before parsing JSON in `AuthContext.tsx`

### Backend Improvements (Medium Priority)
1. **Persistent database** - Replace `/tmp` file storage with Vercel KV, Supabase, or Firebase
   - Current `/tmp` storage resets on Vercel cold starts
   - Usage tracking and developer codes may reset unexpectedly
2. **Verify RevenueCat webhook secret** - Ensure `REVENUECAT_WEBHOOK_SECRET` is set in Vercel env vars
3. **Add input validation** - Validate image base64 format and size before sending to Claude API
4. **Add message length validation** - Limit chat messages to prevent abuse

### Code Quality (Low Priority)
1. **Remove `as any` type casts** - ~20 instances, mostly icon names
2. **Fix duplicate ChatMessage interface** - `types/index.ts` vs `aiService.ts` have different definitions
3. **Add array bounds checking** - `ConsultationScreen.tsx` line 285 accesses `results[0]` without length check
4. **Reduce console logging** - Remove debug logs from production backend

### Android (Before Play Store)
1. **Add RevenueCat Android API key** - Currently placeholder `YOUR_REVENUECAT_ANDROID_API_KEY`
2. **Test on Android devices** - Verify all features work on Android

---

## PRODUCTION DEPLOYMENT GUIDE

### Step-by-Step to Production

```
1. Deploy backend to Vercel
   └── cd backend && vercel --prod
   └── Update API_BASE_URL in src/services/aiService.ts
   └── Rebuild app after URL change

2. Set up RevenueCat products in dashboard
   └── Create monthly/yearly products
   └── Test with sandbox account

3. Build production iOS
   └── eas build --platform ios

4. Submit to TestFlight
   └── eas submit --platform ios
   └── Test with 3-5 beta testers (24-48hr Apple review)

5. Submit for App Store Review
   └── Upload screenshots (6.7", 6.5", 5.5")
   └── Fill out app metadata, privacy labels
   └── Submit (typically 1-3 day review)

6. Build + Submit Android
   └── eas build --platform android
   └── eas submit --platform android
   └── Google review (1-7 days)

7. Post-launch
   └── Monitor crash reports (Sentry recommended)
   └── Verify affiliate commissions flowing
   └── Update website with store links
```

### Manual Efforts Required

| Task | Where | Notes |
|------|-------|-------|
| RevenueCat products | RevenueCat dashboard | Create monthly/yearly, entitlement, offering |
| Amazon CA signup | associates.amazon.ca | Tag `nayaved0c-20` already in code |
| ~~Amazon IN signup~~ | ~~affiliate-program.amazon.in~~ | ✅ Done - Tag `nayaved-21` |
| ~~App Store listing~~ | ~~App Store Connect~~ | ✅ Done - See `app-store-listing/` folder |
| Google Play listing | Google Play Console | Store listing, data safety, content rating |
| ~~Backend deploy~~ | ~~Vercel~~ | ✅ Done - `backend-nu-gold-17.vercel.app` |
| Sentry setup | sentry.io | Create project, get DSN |
| TestFlight testers | App Store Connect | Add beta tester emails |

### Testing Guide

**iOS Testing:**
- Expo Go: Quick iteration, some native module limitations
- Dev Build: `eas build --profile development --platform ios` (full native support)
- TestFlight: `eas build && eas submit --platform ios` (pre-production, up to 10K testers)

**Android Testing:**
- Expo Go on Android device: Install from Play Store, scan QR
- Android Emulator: Install Android Studio, create virtual device, press `a` in Expo
- Dev Build: `eas build --profile development --platform android`
- Internal Testing: Upload to Google Play Console Internal Testing track

### Monitoring (Recommended: Sentry)
- Install: `npx expo install @sentry/react-native`
- Captures: crashes, JS errors, API failures, performance
- Free tier: 5,000 errors/month
- Shows device info, OS version, stack traces with source maps

---

## AMAZON AFFILIATE CONFIGURATION

### Tags by Region
| Region | Domain | Tag | Status |
|--------|--------|-----|--------|
| US | amazon.com | `nayaved-20` | ✅ Active |
| India | amazon.in | `nayaved-21` | ✅ Active |
| Canada | amazon.ca | `nayaved0c-20` | ✅ Active |
| UK | amazon.co.uk | Not yet | Need signup |

### How Region Detection Works
File: `src/components/ProductCard.tsx` → `getUserRegion()`
1. Checks `Localization.getLocales()[0].regionCode` (IN, CA, US)
2. Checks `languageTag` suffix (-IN, -CA)
3. Falls back to timezone detection (Kolkata, Toronto, Vancouver, etc.)
4. Default: US

### Link Strategy
- **US**: Direct ASIN link (`amazon.com/dp/ASIN?tag=nayaved-20`)
- **India**: India-specific ASIN link (`affiliateLinkIN` field)
- **Canada/Other**: Search-based link (`amazon.ca/s?k=Brand+Product&tag=nayaved0c-20`) — ASINs differ across stores

---

## RevenueCat Configuration
- **iOS API Key:** `appdf7562d03f` ✅
- **Android API Key:** Not yet created
- **Products to create:**
  - `nayaved_premium_monthly` ($4.99/month)
  - `nayaved_premium_yearly` ($39.99/year)
- **Entitlement:** `premium`
- **Offering:** `default`

---

## PROJECT STRUCTURE

```
nayaved-app/
├── App.tsx                    # Main app entry with navigation
├── app.json                   # Expo configuration
├── package.json               # Dependencies
├── CLAUDE.md                  # This context file
├── .detoxrc.js               # Detox E2E test configuration
├── e2e/
│   ├── jest.config.js        # Detox jest config
│   ├── starter.test.js       # Native E2E tests (needs update)
│   └── web.spec.ts           # Playwright web tests
├── src/
│   ├── components/
│   │   ├── ManuscriptConstants.ts  # Theme colors/fonts
│   │   ├── ProductCard.tsx   # Affiliate product display (region detection: US/IN/CA)
│   │   ├── PremiumLock.tsx   # Curiosity Gap paywall component
│   │   ├── StreakBanner.tsx  # Daily ritual streak display + scan cards
│   │   ├── DailyInsight.tsx  # Blog-based daily insight with navigation
│   │   ├── NotificationSettings.tsx # Notification preferences UI
│   │   └── ManuscriptCard.tsx
│   ├── context/
│   │   ├── SubscriptionContext.tsx  # User tier management
│   │   └── AuthContext.tsx   # Authentication state
│   ├── data/
│   │   ├── dailyRoutines.ts   # Dosha-specific routines (morning/midday/evening/diet/herbs)
│   │   ├── homeRemedies.ts    # Remedy database
│   │   ├── products.ts        # Affiliate products (UserRegion type, getAffiliateLink, getDisplayPrice)
│   │   ├── blogs.ts           # Blog posts for Learn tab + DailyInsight
│   │   └── doshaQuestions.ts  # Assessment questions
│   ├── screens/
│   │   ├── HomeScreen.tsx     # Main dashboard (Ojas+Dosha cards, StreakBanner, DailyInsight, QuickFixes)
│   │   ├── PlanScreen.tsx     # My Plan tab (5 flex-wrap tabs)
│   │   ├── ConsultationScreen.tsx  # AI chat (Ask Vaidya)
│   │   ├── PharmacyScreen.tsx # Product recommendations (Wellness tab)
│   │   ├── BlogScreen.tsx     # Learn tab (accepts blogId param)
│   │   ├── BodyMapScreen.tsx  # Body Map (inside Blog stack)
│   │   ├── SettingsScreen.tsx # Settings + Data Management (reset scans)
│   │   ├── PaywallScreen.tsx  # Premium upgrade screen
│   │   ├── OjasTrackerScreen.tsx  # Ojas tracking + ViewShot screenshot sharing
│   │   ├── AssessmentScreen.tsx   # Dosha quiz
│   │   ├── QuickFixDetailScreen.tsx # Remedy details
│   │   ├── TongueDiagnosisScreen.tsx  # + Ojas contribution
│   │   ├── EyeAnalysisScreen.tsx      # + Ojas contribution
│   │   ├── SkinAnalysisScreen.tsx     # + Ojas contribution
│   │   ├── NailAnalysisScreen.tsx     # + Ojas contribution
│   │   └── PulseAnalysisScreen.tsx    # + Ojas contribution
│   ├── navigation/
│   │   └── AppNavigator.tsx   # Bottom tabs + HomeStack + BlogStack
│   └── services/
│       ├── aiService.ts       # Backend API calls
│       ├── dailyRitualService.ts # Streak tracking, daily wisdom, scan Ojas contributions
│       ├── notificationService.ts # Push notifications & wisdom quotes
│       └── purchaseService.ts # RevenueCat integration
├── backend/
│   ├── index.js              # Express server
│   ├── package.json
│   ├── .env                  # API keys (not committed)
│   ├── .env.example
│   └── vercel.json           # Deployment config
├── ios/                      # Native iOS build (from expo prebuild)
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

---

## TESTING CHECKLIST

### AI Analysis ✅ (Manually Tested)
- [x] Tongue analysis returns AI results and displays correctly
- [x] Eye analysis returns AI results and displays correctly
- [x] Skin analysis returns AI results and displays correctly
- [x] Nail analysis returns AI results and displays correctly
- [x] Fallback to educational mode works when backend unavailable

### Affiliate Links ✅ (Manually Tested)
- [x] Wellness tab loads all products
- [x] US: "Buy Now" opens amazon.com with tag nayaved-20
- [x] Canada: "Buy Now" opens amazon.ca search with tag nayaved0c-20
- [x] India: "Buy Now" opens amazon.in with tag nayaved-21

### Core Features
- [x] Dosha assessment completes and saves
- [x] Ojas tracker saves daily scores + scan contributions
- [x] My Plan shows all 5 tabs (Morning, Midday, Evening, Diet, Herbs)
- [x] AI consultation responds correctly
- [x] Developer mode activates with codes
- [ ] RevenueCat purchase flow (needs dashboard setup)
- [ ] Push notifications on physical device (needs dev build)

### New Features (2026-01-28)
- [x] Ojas screenshot sharing works
- [x] Wellness tab visible in bottom navigation
- [x] DailyInsight navigates to blog
- [x] Reset Today's Scans in Settings works
- [x] StreakBanner shows only incomplete scans

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
- **Amazon Associates US:** https://affiliate-program.amazon.com
- **Amazon Associates CA:** https://associates.amazon.ca
- **Amazon Associates IN:** https://affiliate-program.amazon.in
- **App Store Connect:** https://appstoreconnect.apple.com
- **Google Play Console:** https://play.google.com/console
- **Claude API Docs:** https://docs.anthropic.com
- **Expo Docs:** https://docs.expo.dev
- **Sentry (monitoring):** https://sentry.io
- **EAS Build:** https://docs.expo.dev/build/introduction/

---

## SESSION HISTORY

**Session 2026-02-02:**
- **App Made Free for Launch:**
  - Modified `SubscriptionContext.tsx` to set `isPremium = true` for all users
  - All content now accessible without subscription
  - PaywallScreen and RevenueCat code retained for future activation
  - PremiumLock components automatically show content (no upgrade prompts)

- **Improved Dosha Assessment:**
  - Expanded from 8 to 16 comprehensive questions
  - Based on AYUSH/CCRAS guidelines and Prakriti200 research
  - Covers 3 domains: Physical (6), Physiological (6), Psychological (4)
  - More inclusive options that cover all body types
  - Updated `src/data/symptoms.ts` with new questions

- **Monetization Strategy Document:**
  - Created `MONETIZATION_STRATEGY.md` with future revenue ideas
  - Affiliate marketing expansion (Kerala Ayurveda, Banyan Botanicals, etc.)
  - Practitioner marketplace concept
  - Corporate B2B wellness programs
  - Physical product line ideas
  - Revenue projections for Years 1-3

- **Production Audit Completed:**
  - Security review: No critical issues
  - Mock/placeholder check: All production URLs verified
  - Backend: Deployed to Vercel at `backend-nu-gold-17.vercel.app`
  - Sentry: Working (user confirmed receiving errors)

- **Post-Launch Technical Debt documented in CLAUDE.md**

**Session 2026-01-30:**
- **Native PPG Frame Processor Implementation:**
  - Created `plugins/withBrightnessFrameProcessor.js` - config plugin to add native files to Xcode
  - Created `plugins/withBridgingHeader.js` - config plugin for bridging header
  - Created `plugins/native-templates/BrightnessFrameProcessor.swift` - native Swift plugin for real camera brightness
  - Created `plugins/native-templates/BrightnessFrameProcessor.m` - Objective-C bridge for VisionCamera
  - Handles BGRA and YUV pixel formats, detects finger covering camera
  - Added `react-native-worklets-core` dependency for frame processor support

- **Login & Authentication Fixes:**
  - Fixed spinner showing on both Google and Apple login buttons (added `activeButton` state tracking)
  - Fixed user data isolation - each user now has their own AsyncStorage with user-specific key prefixes
  - Configured Google OAuth with client IDs (iOS: `gibun4qn4idqq0onf0acf9fm38iuundu.apps.googleusercontent.com`)
  - Updated AuthContext with `saveCurrentSessionData`, `clearCommonDataKeys` functions

- **TypeScript & Build Fixes:**
  - Fixed FeatureGate.tsx - wrapped PaywallScreen in Modal component
  - Fixed OjasTrackerScreen.tsx - array filter type error with proper type guard
  - Fixed notificationService.ts - trigger types and handler props
  - Fixed app icon to 1024x1024 square format (was 527x475)

- **Git Commit & Push:**
  - Committed all changes (300 files) with comprehensive message
  - Pushed to GitHub: https://github.com/shiviagarwalwork/nayaved-app.git
  - Commit hash: `97cbeb8`

**Session 2026-01-28:**
- Added Ojas screenshot sharing (react-native-view-shot + expo-sharing)
- Added Ojas contributions from all 5 scan types (3-5 pts each)
- Fixed Wellness/Pharmacy tab missing from bottom navigation
- Fixed Plan screen tabs: horizontal scroll → flex-wrap (Diet & Herbs now visible)
- Updated DailyInsight to pull from blogs.ts with navigation to specific blog
- Added Amazon Canada support: region detection, search-based links, tag `nayaved0c-20`
- Changed ProductCard from boolean `isUserInIndia` to `getUserRegion()` returning `UserRegion`
- Added "Reset Today's Scans" in Settings > Data Management
- StreakBanner now filters to show only incomplete scans
- Completed production readiness assessment

**Session 2026-01-27:**
- Implemented Daily Ritual / Streak system
- Created dailyRitualService.ts and StreakBanner.tsx
- Added Privacy Policy & Terms links
- Added Amazon India affiliate support (tag: nayaved-21)
- Implemented Curiosity Gap paywall (PremiumLock.tsx)
- Push notifications with expo-notifications

**Session 2026-01-23:**
- Amazon US affiliate integration (tag: nayaved-20)
- Improved error handling across all analysis screens
- Enhanced backend JSON parsing
- Added comprehensive code comments
