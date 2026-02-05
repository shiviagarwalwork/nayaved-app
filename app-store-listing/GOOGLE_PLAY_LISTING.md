# NayaVed AI - Google Play Store Listing

Copy each section below into Google Play Console.

---

## APP NAME (30 characters max)

```
NayaVed AI
```

---

## SHORT DESCRIPTION (80 characters max)

```
AI-powered Ayurvedic wellness companion. Discover your dosha. Track vitality.
```

---

## FULL DESCRIPTION (4000 characters max)

```
Discover your unique mind-body constitution with NayaVed — the first AI-powered Ayurvedic wellness companion that brings 5,000 years of ancient wisdom to your fingertips.

KNOW YOUR DOSHA
Take our comprehensive assessment to discover your Prakriti (natural constitution) — whether you're Vata, Pitta, Kapha, or a unique combination. Understanding your dosha is the first step to personalized wellness.

AI-POWERED DIAGNOSTICS
Experience traditional Ayurvedic examination methods enhanced by modern AI:

• Tongue Analysis (Jihva Pariksha) — Photograph your tongue to reveal digestive health, toxin levels, and organ imbalances
• Eye Analysis (Netra Pariksha) — Scan your eyes to detect dosha imbalances and overall vitality
• Skin Analysis (Twak Pariksha) — Analyze your skin for hydration, dosha signs, and personalized skincare tips
• Nail Analysis (Nakha Pariksha) — Examine nail health for nutritional deficiencies and circulation insights
• Pulse Analysis (Nadi Pariksha) — Digital pulse reading inspired by ancient diagnostic techniques

TRACK YOUR OJAS (VITALITY)
Ojas is your vital essence — the reserve of immunity, strength, and radiance. Track daily habits that build or deplete your Ojas:
• Quality sleep & early rising
• Meditation & pranayama
• Warm, nourishing foods
• Stress management
• Screen-free evenings

Share your Ojas Glow score with friends and inspire others on their wellness journey.

PERSONALIZED DAILY ROUTINES
Receive customized Dinacharya (daily routines) based on your dosha:
• Morning rituals for energized starts
• Midday practices for sustained focus
• Evening wind-down routines
• Dosha-balancing diet recommendations
• Herbal supplement guidance

ASK VAIDYA - AI CONSULTATION
Chat with our AI Ayurvedic consultant anytime. Ask about:
• Symptoms and natural remedies
• Diet and lifestyle adjustments
• Herbal recommendations
• Seasonal wellness tips

QUICK HOME REMEDIES
Access a curated database of traditional Ayurvedic remedies for common concerns — from digestive issues to stress relief, all backed by classical texts like Charaka Samhita.

LEARN AYURVEDA
Explore educational content drawn from ancient manuscripts:
• Charaka Samhita
• Sushruta Samhita
• Ashtanga Hridayam

WELLNESS SHOP
Discover carefully selected Ayurvedic products — herbs, supplements, and wellness essentials to support your journey.

---

"The pulse reveals the state of all three doshas and the seven dhatus."
— Charaka Samhita

---

Download NayaVed today and begin your personalized Ayurvedic wellness journey.

Note: NayaVed is for educational and wellness purposes only. It is not intended to diagnose, treat, cure, or prevent any disease. Always consult a qualified healthcare provider for medical concerns.
```

---

## CATEGORIES

- **Category:** Health & Fitness
- **Tags:** Ayurveda, Wellness, Health, Dosha, Meditation, Yoga, Holistic

---

## CONTACT DETAILS

```
Email: support@nayaved.com
Website: https://nayaved.com
Privacy Policy: https://nayaved.com/privacy
```

---

## CONTENT RATING (IARC Questionnaire Answers)

| Question | Answer |
|----------|--------|
| Does the app share user's current location? | No |
| Does the app allow users to interact or exchange content? | No |
| Does the app contain any sexual content? | No |
| Does the app contain violence? | No |
| Does the app contain references to tobacco, alcohol, or drugs? | No |
| Does the app contain crude humor? | No |
| Does the app allow users to make purchases? | No |
| Does the app contain gambling? | No |
| Does the app allow unrestricted internet access? | No |

**Expected Rating:** Rated for All (Everyone)

---

## DATA SAFETY FORM

### Data Collection

| Data Type | Collected | Shared | Purpose |
|-----------|-----------|--------|---------|
| **Personal Info - Name** | Yes | No | App functionality (login) |
| **Personal Info - Email** | Yes | No | App functionality (login) |
| **Health Info** | Yes | No | App functionality (wellness tracking) |
| **Photos** | Yes | No | App functionality (diagnostic scans) |
| **App Activity - App interactions** | Yes | No | Analytics |
| **App Info & Performance - Crash logs** | Yes | No | App functionality (Sentry) |
| **App Info & Performance - Performance diagnostics** | Yes | No | App functionality (Sentry) |

### Security Practices

| Question | Answer |
|----------|--------|
| Is data encrypted in transit? | Yes (HTTPS) |
| Can users request data deletion? | Yes |
| Does the app follow Google's Families Policy? | N/A (not a kids app) |

### Data Deletion

```
Users can delete their account and all associated data by:
1. Going to Settings > Account > Sign Out
2. Contacting support@nayaved.com to request full data deletion
All data is stored locally on device and can be cleared by uninstalling the app.
```

---

## PRICING & DISTRIBUTION

| Field | Value |
|-------|-------|
| Price | Free |
| In-app purchases | No |
| Contains ads | No |
| Countries | All |

---

## STORE LISTING ASSETS REQUIRED

### Screenshots (Required)
- **Phone:** Minimum 2, maximum 8 (16:9 aspect ratio)
  - Sizes: 1080x1920 to 1440x2560 recommended
- **Tablet (7"):** Optional
- **Tablet (10"):** Optional

### Feature Graphic (Required)
- **Size:** 1024 x 500 px
- **Format:** PNG or JPG

**Prompt for Gemini to create Feature Graphic:**
```
A wide banner (1024x500) for Google Play Store. Shows the NayaVed AI app concept: ancient Ayurvedic manuscript scrolls blending into a modern smartphone interface. Left side has warm golden parchment with Sanskrit patterns and lotus motifs. Right side transitions into a clean, modern phone screen showing health data. Center text: "NayaVed AI" in elegant serif font, subtitle: "Ancient Wisdom, Modern Wellness". Colors: copper brown (#B87333), cream (#F5E6D3), vermillion accents (#E34234), gold (#DAA520). Professional, premium wellness aesthetic.
```

### App Icon
- **Size:** 512 x 512 px
- Already configured via `assets/icon.png`

---

## RELEASE NOTES (Version 1.0)

```
Welcome to NayaVed AI!

• AI-powered tongue, eye, skin, nail & pulse analysis
• Personalized dosha assessment
• Ojas vitality tracker with social sharing
• Daily routines customized to your constitution
• AI Ayurvedic consultation chat (Ask Vaidya)
• Home remedies database
• Curated wellness shop
• Push notification reminders for daily rituals
```

---

## ANDROID-SPECIFIC SCREENSHOTS

Resize existing screenshots for Android:

```bash
cd /Users/shiviagarwal/Desktop/ClaudeCode/nayaved-app/app-store-listing
mkdir -p resized_android
for f in screenshot_*.png; do
  cp "$f" "resized_android/$f"
  sips -z 2560 1440 "resized_android/$f" > /dev/null 2>&1
done
```

Or use existing screenshots - Google Play is more flexible with sizes than Apple.

---

## TESTING TRACK STRATEGY

| Track | Purpose | Testers | Review |
|-------|---------|---------|--------|
| Internal Testing | First test | Up to 100 | No review |
| Closed Testing | Beta | Invite only | No review |
| Open Testing | Public beta | Anyone | Brief review |
| Production | Live release | Everyone | Full review (1-7 days) |

**Recommended:** Internal Testing → Production (skip closed/open for faster launch)

---

## SUBMISSION CHECKLIST

### Before Submitting
- [ ] Google Play Developer account verified
- [ ] Service account JSON key created
- [ ] AAB/APK built via EAS
- [ ] App tested on Android device
- [ ] Store listing complete (name, descriptions, screenshots)
- [ ] Feature graphic uploaded (1024x500)
- [ ] Content rating questionnaire completed
- [ ] Data safety form completed
- [ ] Privacy policy URL added
- [ ] Pricing set to Free

### Submission Commands
```bash
# Build production AAB
eas build --platform android --profile production

# Submit to Google Play
eas submit --platform android --latest
```

### After Submission
- [ ] Monitor review status (1-7 days)
- [ ] If rejected, read feedback and fix
- [ ] Verify app appears on Play Store
- [ ] Test download on real device
- [ ] Monitor crash reports (Sentry)
