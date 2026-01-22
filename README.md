# Ayuved Mobile App

**Ancient Ayurveda wisdom for modern digital life**

Your personal health guide based on 5,000 years of Charaka Samhita teachings.

## 🎯 App Vision

Ayuved is an agent-like health companion that:
- Guides users from basic health issues with manuscript-backed reasoning
- Suggests personalized diet and daily plans
- Sends reminders for daily routines
- Explains WHY behind every recommendation (from Charaka Samhita, not generic internet)
- Ultra user-friendly for short attention spans
- Covers all modern life topics for quick engagement

## 📱 Features (MVP)

### 1. Home - Quick Fixes
- 10 modern life issues with instant solutions
- Each includes:
  - Problem (e.g., "Too much screen time", "Burnt out")
  - Remedy (practical action)
  - WHY explanation (from manuscripts)
  - Category tag

### 2. Dosha Assessment
- Interactive quiz to determine Vata/Pitta/Kapha constitution
- Optional symptom selection
- Visual results with percentages
- Personalized recommendations

### 3. My Plan
- Daily schedule based on dosha
- Time-based activities (6 AM - 10 PM)
- Morning/Midday/Afternoon/Evening sections
- Shows selected symptoms

### 4. Learn (Blog)
- Educational articles from web app
- Category filters
- Full article reading
- Manuscript-based content

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Expo CLI
- iOS Simulator (for testing) or physical iPhone
- Apple Developer Account (for App Store submission)

### Installation

```bash
cd ayurveda-mobile
npm install
npm start
```

### Run on iOS Simulator
```bash
npm run ios
```

### Run on Physical Device
1. Install Expo Go app on your iPhone
2. Scan QR code from terminal
3. App loads on device

## 📦 Tech Stack

- **Framework:** React Native with Expo
- **Navigation:** React Navigation (Bottom Tabs)
- **Storage:** AsyncStorage
- **UI:** Native components with custom styling
- **Icons:** Ionicons (via Expo)

## 🎨 Design System

### Colors
- Background: `#F5F1E8` (parchment)
- Primary: `#9EBF88` (olive green)
- Accent: `#DAA520` (gold)
- Text: `#3E2723` (dark brown)

### Typography
- Titles: Bold, 24-28px
- Body: Regular, 14-16px
- Categories: Uppercase, 11-12px

## 📁 Project Structure

```
src/
├── navigation/
│   └── AppNavigator.tsx      # Tab navigation setup
├── screens/
│   ├── HomeScreen.tsx         # Quick fixes
│   ├── AssessmentScreen.tsx   # Dosha quiz
│   ├── PlanScreen.tsx         # Daily plan
│   └── BlogScreen.tsx         # Learning content
├── data/
│   ├── blogs.ts              # Blog content
│   ├── symptoms.ts           # Quiz questions
│   └── ...                   # More data files
├── types/
│   └── index.ts              # TypeScript types
└── components/               # Reusable components (future)
```

## 🔜 Next Steps

### Phase 1: Testing & Polish
- [ ] Test on iOS simulator
- [ ] Fix any UI/UX issues
- [ ] Add loading states
- [ ] Error handling

### Phase 2: Enhanced Features
- [ ] Push notifications for daily reminders
- [ ] Detailed explanation screens for each quick fix
- [ ] Progress tracking
- [ ] Bookmark favorite content
- [ ] Share functionality

### Phase 3: Agent-Like Intelligence
- [ ] Smart daily plan generation based on dosha + symptoms
- [ ] Contextual reminders ("It's 6 AM - time for Brahma Muhurta!")
- [ ] Explanation modals linking to specific manuscript verses
- [ ] Seasonal adjustments (Ritucharya)

### Phase 4: App Store Submission
- [ ] Create app icon (1024x1024)
- [ ] Create screenshots (6.5", 5.5", 12.9")
- [ ] Write App Store description
- [ ] Privacy policy
- [ ] Terms of service
- [ ] Submit via Expo EAS Build
- [ ] Apple review process

## 📱 App Store Info

**Name:** Ayuved

**Bundle ID:** com.ayuved.app

**Category:** Health & Fitness

**Age Rating:** 4+

**Description:**
Ancient Ayurveda wisdom for modern digital life. Your personal health guide based on 5,000 years of Charaka Samhita teachings. Get personalized diet plans, daily routines, and understand WHY each practice works for YOUR unique body type (dosha).

**Keywords:** ayurveda, dosha, wellness, health, meditation, diet, yoga, holistic, natural health, personalized wellness

## 🔧 Development Commands

```bash
# Start development server
npm start

# Run on iOS
npm run ios

# Run on Android
npm run android

# Run on web
npm run web

# Build for production (requires EAS account)
eas build --platform ios
```

## 📄 License

Proprietary - All rights reserved

## 👤 Author

Built with Claude Code for modern Ayurveda education

 Valid Invite Codes (you can share these with people you want to give access):
  - ANCIENT2024
  - AYURVEDA
  - WELLNESS
  - OJAS
  - VEDA
  - PRAKRITI
  - DOSHA
  - SHAKTI
