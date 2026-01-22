# How to Test Ayuved App

## ✅ Easiest Way: Test on Your iPhone

### Step 1: Install Expo Go
1. Open **App Store** on your iPhone
2. Search for "**Expo Go**"
3. Install the app (it's free)

### Step 2: Start the Dev Server
```bash
cd /Users/shiviagarwal/Desktop/ClaudeCode/claude-skills-pack/ayurveda-mobile
npm start
```

### Step 3: Scan QR Code
1. The terminal will show a **QR code**
2. Open **Camera** app on your iPhone
3. Point camera at the QR code on your screen
4. Tap the notification that appears
5. App will open in Expo Go!

**Requirements:**
- iPhone and Mac must be on **same WiFi network**
- Expo Go app installed on iPhone

---

## Alternative: Fix Simulator Connection

If you prefer using the simulator:

### Option 1: Open Expo Go App Manually
1. Open **Simulator** app (should already be running with iPhone 17 Pro)
2. Open **Expo Go** app in simulator
3. Type in: `exp://10.0.0.218:8081`
4. Tap "Connect"

### Option 2: Fresh Start
```bash
# In terminal (Ctrl+C if app is running)
cd /Users/shiviagarwal/Desktop/ClaudeCode/claude-skills-pack/ayurveda-mobile
rm -rf node_modules/.cache
rm -rf .expo
npm start
# In another terminal:
npm run ios
```

---

## What You Should See

### Home Screen (Tab 1)
- **10 Quick Fix Cards:**
  1. 📱 Too much screen time
  2. 😰 Stressed & anxious
  3. 🔥 Burnt out & exhausted
  4. 😴 Can't sleep well
  5. 🤢 Digestion issues
  6. 🤯 Can't concentrate
  7. 😩 Weight gain & sluggish
  8. 😤 Irritable & angry
  9. 🛋️ Procrastination & laziness
  10. 🌀 Racing thoughts

- **Each card shows:**
  - Icon + Title + Category
  - ✓ Remedy (what to do)
  - WHY box (Charaka Samhita explanation in yellow box)

### Assessment Screen (Tab 2)
- Dosha quiz questions
- Select symptoms (optional)
- See results with percentages

### Plan Screen (Tab 3)
- Daily schedule by time
- Personalized recommendations

### Blog Screen (Tab 4)
- Articles about Ayurveda
- Filter by category
- Read full articles

---

## Troubleshooting

### "Cannot connect to Metro bundler"
- Make sure `npm start` is running
- Check WiFi connection (same network)
- Try restarting the dev server

### "Network request failed"
- Check firewall isn't blocking port 8081
- Disable VPN if using one
- Make sure computer and phone on same network

### App shows error screen
- Shake device (Cmd+Ctrl+Z in simulator)
- Tap "Reload"
- Check terminal for error messages

---

## Current Status
✅ All code complete and compiled
✅ Dependencies fixed
✅ 4 screens built (Home, Assessment, Plan, Blog)
✅ Ready to test!

**Recommended:** Use iPhone with Expo Go for fastest testing!
