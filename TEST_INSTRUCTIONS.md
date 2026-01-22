# Testing Ayuved App

## Current Status
- ✅ Project created and configured
- ✅ All dependencies installed
- ✅ TypeScript compilation successful
- ✅ Metro bundler running on http://localhost:8081
- ✅ iOS Simulator launched (iPhone 17 Pro)

## If You Can't See the App

### Option 1: Reload in Simulator
1. Find the iOS Simulator window on your screen
2. In the terminal, press `r` or `R` to reload
3. Wait 10-20 seconds for JavaScript bundle to load

### Option 2: Restart Everything
```bash
# Kill the current process (Ctrl+C in terminal)
# Then restart:
cd /Users/shiviagarwal/Desktop/ClaudeCode/claude-skills-pack/ayurveda-mobile
npm run ios
```

### Option 3: Use Expo Go on Physical iPhone
1. Install "Expo Go" app from App Store on your iPhone
2. Ensure iPhone and Mac are on same WiFi
3. Run: `npm start`
4. Scan QR code with Camera app
5. Tap notification to open in Expo Go

## Expected Result
You should see the Ayuved app with:
- Bottom tab navigation (Home, Assessment, Plan, Blog)
- Home screen showing 10 quick fixes with modern life issues
- Each card has icon, title, remedy, and WHY explanation

## If You See Errors

### Common Issues:

**1. "Unable to resolve module" errors:**
```bash
rm -rf node_modules
npm install
npm start
```

**2. "Metro bundler failed":**
```bash
rm -rf .expo
rm -rf node_modules
npm install
npm start
```

**3. White/blank screen:**
- Wait 30 seconds (first load is slow)
- Press `r` in terminal to reload
- Check terminal for red error messages

## Manual Testing Checklist

Once app loads:
- [ ] Home screen displays with 10 quick fix cards
- [ ] Tap on a card (should show details - not yet implemented)
- [ ] Tap "Assessment" tab - see dosha quiz
- [ ] Answer quiz questions
- [ ] Select symptoms (optional)
- [ ] See results with dosha percentages
- [ ] Tap "Plan" tab - see daily schedule
- [ ] Tap "Blog" tab - see articles
- [ ] Filter by category
- [ ] Tap article to read

## Current Location
Project: `/Users/shiviagarwal/Desktop/ClaudeCode/claude-skills-pack/ayurveda-mobile`
Running on: http://localhost:8081
Simulator: iPhone 17 Pro

## Next Steps After Testing
1. Fix any UI/UX issues found
2. Add detailed screens for quick fixes
3. Link WHY explanations to manuscripts
4. Add loading states
5. Prepare App Store assets
