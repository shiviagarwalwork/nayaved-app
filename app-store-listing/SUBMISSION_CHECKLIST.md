# App Store Submission Checklist

## Before Submitting

### Build
- [ ] Production build completed on EAS
- [ ] Build submitted to App Store Connect: `npx eas-cli submit --platform ios`
- [ ] Build appears in App Store Connect (wait 10-30 min after submit)

### App Store Connect Setup
- [ ] App created in App Store Connect
- [ ] Bundle ID matches: Check `app.json` → `expo.ios.bundleIdentifier`
- [ ] App name set
- [ ] Primary language selected

### App Information
- [ ] App Name (30 chars): `Nayaved AI`
- [ ] Subtitle (30 chars): `Ancient Wisdom, Modern Wellness`
- [ ] Category: Health & Fitness
- [ ] Secondary Category: Lifestyle
- [ ] Content Rights: Confirm you own/licensed all content

### Pricing & Availability
- [ ] Price: Free (with in-app purchases)
- [ ] Availability: All countries (or select specific)
- [ ] Pre-order: No (unless desired)

### Screenshots (Required Sizes)
- [ ] 6.7" Display (iPhone 15 Pro Max) - 1290 x 2796 px
- [ ] 6.5" Display (iPhone 11 Pro Max) - 1284 x 2778 px
- [ ] 5.5" Display (iPhone 8 Plus) - 1242 x 2208 px
- [ ] Minimum 3 screenshots, maximum 10

### App Preview Video (Optional)
- [ ] 15-30 seconds
- [ ] No hands/fingers in video
- [ ] Same sizes as screenshots

### Description & Keywords
- [ ] Description pasted (from APP_STORE_LISTING.md)
- [ ] Keywords added (100 chars max)
- [ ] What's New text added
- [ ] Promotional Text (optional, 170 chars)

### URLs
- [ ] Privacy Policy URL: `https://nayaved.com/privacy`
- [ ] Support URL: `https://nayaved.com`
- [ ] Marketing URL: `https://nayaved.com`

### App Review Information
- [ ] Contact First Name
- [ ] Contact Last Name
- [ ] Contact Phone
- [ ] Contact Email
- [ ] Demo Account (if login required): Not needed for Nayaved
- [ ] Notes for reviewer (optional)

### Age Rating
- [ ] Complete age rating questionnaire
- [ ] Expected rating: 4+

### App Privacy
- [ ] Privacy Policy URL added
- [ ] Data collection questionnaire completed
- [ ] Data types declared (see APP_STORE_LISTING.md)

### In-App Purchases (if applicable)
- [ ] Products created in App Store Connect
- [ ] Products linked to RevenueCat
- [ ] Screenshots for IAP review

### Build Selection
- [ ] Select your uploaded build
- [ ] Version number correct
- [ ] Build number correct

---

## Submission

- [ ] All required fields filled (green checkmarks)
- [ ] Click "Add for Review"
- [ ] Confirm submission

---

## After Submission

### Review Timeline
- First submission: 1-3 days (sometimes longer)
- Updates: Usually 24-48 hours

### If Rejected
1. Read rejection reason carefully
2. Fix the issue
3. Reply to reviewer OR submit new build
4. Resubmit for review

### Common Rejection Reasons
- Crashes or bugs
- Broken links
- Missing privacy policy
- Misleading screenshots
- Incomplete features
- Login issues (provide demo account)

---

## Post-Approval

- [ ] App goes live automatically (or manual release)
- [ ] Verify app appears in App Store
- [ ] Test download on real device
- [ ] Monitor reviews and ratings
- [ ] Respond to user reviews
- [ ] Plan first update based on feedback
