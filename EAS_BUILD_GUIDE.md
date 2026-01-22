# EAS Build Setup Guide for AyuVed

This guide walks you through setting up EAS Build to deploy AyuVed to the App Store.

## Prerequisites

1. **Apple Developer Account** ($99/year)
   - Sign up at: https://developer.apple.com/programs/
   - Takes 24-48 hours for approval

2. **Expo Account**
   - Sign up at: https://expo.dev/signup
   - Free tier works for builds

3. **EAS CLI Installed**
   ```bash
   npm install -g eas-cli
   ```

---

## Step 1: Login to EAS

```bash
eas login
```

Enter your Expo account credentials.

---

## Step 2: Configure Your Project

The project is already configured. Verify with:

```bash
eas build:configure
```

This will verify your `eas.json` and `app.json` are set up correctly.

---

## Step 3: Update eas.json with Your Credentials

Edit `eas.json` and replace the placeholder values:

```json
"submit": {
  "production": {
    "ios": {
      "appleId": "your-apple-id@email.com",      // Your Apple ID email
      "ascAppId": "1234567890",                   // App Store Connect App ID
      "appleTeamId": "XXXXXXXXXX"                 // Your Apple Team ID
    }
  }
}
```

### Finding Your Apple Team ID
1. Go to https://developer.apple.com/account
2. Look for "Membership Details"
3. Your Team ID is a 10-character alphanumeric string

### Finding App Store Connect App ID
1. Create your app in App Store Connect first (Step 5)
2. The App ID will be shown in the App Information section

---

## Step 4: Create App Store Connect Record

Before building, create your app record:

1. Go to https://appstoreconnect.apple.com
2. Click "My Apps" → "+" → "New App"
3. Fill in:
   - Platform: iOS
   - Name: AyuVed - Ayurvedic Wellness
   - Primary Language: English (U.S.)
   - Bundle ID: com.ayuved.app
   - SKU: ayuved-ios-001
   - User Access: Full Access

---

## Step 5: Build for iOS

### Development Build (for testing on simulator)
```bash
eas build --platform ios --profile development
```

### Preview Build (for TestFlight internal testing)
```bash
eas build --platform ios --profile preview
```

### Production Build (for App Store submission)
```bash
eas build --platform ios --profile production
```

The first build will prompt you to:
1. Generate new iOS credentials (recommended)
2. EAS will handle provisioning profiles and certificates automatically

---

## Step 6: Submit to App Store

After a successful production build:

```bash
eas submit --platform ios --latest
```

Or submit a specific build:
```bash
eas submit --platform ios --id BUILD_ID
```

---

## Step 7: TestFlight Setup

Before full release, test via TestFlight:

1. In App Store Connect, go to your app → TestFlight
2. Add internal testers (your team)
3. After EAS submit, the build appears in TestFlight
4. Click "Manage" next to the build
5. Add compliance information (uses encryption: No for standard HTTPS)
6. Start testing

---

## Build Profiles Explained

### `development`
- For local development with Expo Dev Client
- Runs on iOS Simulator
- Quick iteration cycle

### `preview`
- For internal testing
- Can be installed on registered devices
- Good for stakeholder demos

### `production`
- For App Store submission
- Optimized and signed for distribution
- Auto-increments build number

---

## Common Issues & Solutions

### "No matching provisioning profiles found"
```bash
eas credentials
```
Then select iOS → Build Credentials → Set up a new one

### "Bundle ID is not registered"
1. Go to Apple Developer → Certificates, IDs & Profiles → Identifiers
2. Click "+" to register new App ID
3. Enter: com.ayuved.app

### "The app has changed its encryption"
Add to `app.json` under `ios`:
```json
"config": {
  "usesNonExemptEncryption": false
}
```

### Build takes too long
- Free tier: ~30-45 minutes
- Priority Plan: ~15 minutes
- Consider EAS Build subscription for faster builds

---

## Environment Variables

For production API URL, set environment variable:

```bash
eas secret:create --scope project --name API_URL --value "https://your-api.vercel.app"
```

Then reference in app:
```javascript
const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:4000';
```

---

## Updating the App

### Minor Update (bug fixes)
1. Update version in `app.json`:
   ```json
   "version": "1.0.1"
   ```
2. Build: `eas build --platform ios --profile production`
3. Submit: `eas submit --platform ios --latest`

### Major Update (new features)
1. Update version in `app.json`:
   ```json
   "version": "1.1.0"
   ```
2. Update What's New text in App Store Connect
3. Build and submit

---

## Useful Commands

```bash
# Check build status
eas build:list

# View specific build
eas build:view BUILD_ID

# Cancel a build
eas build:cancel BUILD_ID

# View credentials
eas credentials

# Clear credentials (if issues)
eas credentials --platform ios
# Then select "Remove" options
```

---

## Cost Overview

| Service | Cost |
|---------|------|
| Apple Developer Program | $99/year |
| Expo/EAS (Free tier) | $0 (30 builds/month) |
| EAS Build (Production tier) | $99/month (unlimited, priority) |

For initial launch, free tiers are sufficient.

---

## Next Steps After Setup

1. ✅ Configure eas.json with credentials
2. ✅ Create App Store Connect record
3. ✅ Run first production build
4. ✅ Submit to TestFlight
5. ✅ Test on physical devices
6. ✅ Complete App Store listing
7. ✅ Submit for App Review
8. ✅ Launch! 🎉

---

*Guide created: January 21, 2026*
