/**
 * NayaVed AI - E2E Tests (Detox)
 *
 * Uses disabled synchronization because the app has continuous
 * animations (ActivityIndicator, etc.) that prevent Detox from
 * detecting an idle state. All waits are explicit via waitFor().
 */

/** Helper: wait for login screen or home screen, bypass login if needed */
async function ensureHomeScreen() {
  // First check if we're on the login screen by looking for Google sign-in button
  try {
    await waitFor(element(by.text('Continue with Google')))
      .toBeVisible()
      .withTimeout(8000);
    // Scroll down to find "Continue as Guest"
    await waitFor(element(by.text('Continue as Guest')))
      .toBeVisible()
      .whileElement(by.type('RCTScrollView'))
      .scroll(200, 'down');
    await element(by.text('Continue as Guest')).tap();
  } catch {
    // Already past login, or different UI state
  }
  // Wait for home screen - look for "Welcome!" which is always visible at top
  await waitFor(element(by.text('Welcome!')))
    .toBeVisible()
    .withTimeout(12000);
}

/** Helper: scroll down on the main scroll view */
async function scrollDownMain(pixels = 300) {
  try {
    await element(by.type('RCTScrollView')).atIndex(0).scroll(pixels, 'down');
  } catch {
    // Scroll might fail if there's nothing to scroll
  }
}

describe('NayaVed App', () => {
  beforeAll(async () => {
    await device.launchApp({ newInstance: true });
    // Disable Detox synchronization — app has continuous animations
    await device.disableSynchronization();
    await ensureHomeScreen();
  });

  afterAll(async () => {
    await device.enableSynchronization();
  });

  describe('Home Screen', () => {
    beforeEach(async () => {
      await device.reloadReactNative();
      await ensureHomeScreen();
    });

    it('should show Welcome section', async () => {
      await expect(element(by.text('Welcome!'))).toBeVisible();
    });

    it('should show Ojas card', async () => {
      await expect(element(by.text('Ojas'))).toBeVisible();
    });

    it('should show Dosha card', async () => {
      await expect(element(by.text('Dosha'))).toBeVisible();
    });
  });

  describe('Tab Navigation', () => {
    beforeEach(async () => {
      await device.reloadReactNative();
      await ensureHomeScreen();
    });

    it('should navigate to Ask Vaidya tab', async () => {
      await element(by.text('Ask Vaidya')).tap();
      await waitFor(element(by.text('Try asking about:')))
        .toBeVisible()
        .withTimeout(5000);
    });

    it('should navigate to Ojas Glow tab', async () => {
      await element(by.text('Ojas Glow')).tap();
      await waitFor(element(by.text('Ojas Glow Tracker')))
        .toBeVisible()
        .withTimeout(5000);
    });

    it('should navigate to My Plan tab', async () => {
      await element(by.text('My Plan')).tap();
      // Check for either personalized plan or empty state
      try {
        await waitFor(element(by.text('No Personalized Plan Yet')))
          .toBeVisible()
          .withTimeout(5000);
      } catch {
        await waitFor(element(by.text('Morning')))
          .toBeVisible()
          .withTimeout(3000);
      }
    });

    it('should navigate to Wellness tab', async () => {
      await element(by.text('Wellness')).tap();
      await waitFor(element(by.text('Ayurvedic Pharmacy')))
        .toBeVisible()
        .withTimeout(5000);
    });

    it('should navigate to Learn tab', async () => {
      await element(by.text('Learn')).tap();
      await waitFor(element(by.text('Learn Ayurveda')))
        .toBeVisible()
        .withTimeout(5000);
    });

    it('should navigate to Settings tab', async () => {
      await element(by.text('Settings')).tap();
      // Section titles are uppercase due to CSS textTransform
      await waitFor(element(by.text('SUBSCRIPTION')))
        .toBeVisible()
        .withTimeout(5000);
    });

    it('should navigate back to Home tab', async () => {
      await element(by.text('Settings')).tap();
      await waitFor(element(by.text('SUBSCRIPTION')))
        .toBeVisible()
        .withTimeout(3000);
      await element(by.text('Quick Start')).tap();
      await waitFor(element(by.text('Welcome!')))
        .toBeVisible()
        .withTimeout(5000);
    });
  });

  describe('Ojas Tracker', () => {
    beforeEach(async () => {
      await device.reloadReactNative();
      await ensureHomeScreen();
      await element(by.text('Ojas Glow')).tap();
      await waitFor(element(by.text('Ojas Glow Tracker')))
        .toBeVisible()
        .withTimeout(5000);
    });

    it('should show Ojas Glow Tracker title', async () => {
      await expect(element(by.text('Ojas Glow Tracker'))).toBeVisible();
    });

    it('should show score breakdown section', async () => {
      await expect(element(by.text('Ojas Score Breakdown'))).toBeVisible();
    });

    it('should show share button', async () => {
      // Share button is below ViewShot, scroll explicitly
      await scrollDownMain(500);
      await waitFor(element(by.text('Share Your Glow')))
        .toBeVisible()
        .withTimeout(5000);
    });

    it('should show habits section', async () => {
      // Habits section is far down the screen
      await scrollDownMain(400);
      await scrollDownMain(400);
      await waitFor(element(by.text("Today's Ojas-Building Habits")))
        .toBeVisible()
        .withTimeout(5000);
    });
  });

  describe('My Plan', () => {
    beforeEach(async () => {
      await device.reloadReactNative();
      await ensureHomeScreen();
      await element(by.text('My Plan')).tap();
    });

    it('should show plan content or empty state', async () => {
      // Either shows 5 tab buttons (with data) or empty state message
      try {
        await waitFor(element(by.text('No Personalized Plan Yet')))
          .toBeVisible()
          .withTimeout(5000);
        // Empty state is valid - test passes
      } catch {
        // Has data - check for tabs
        await waitFor(element(by.text('Morning')))
          .toBeVisible()
          .withTimeout(3000);
        await expect(element(by.text('Midday'))).toBeVisible();
        await expect(element(by.text('Evening'))).toBeVisible();
        await expect(element(by.text('Diet'))).toBeVisible();
        await expect(element(by.text('Herbs'))).toBeVisible();
      }
    });
  });

  describe('Wellness / Pharmacy', () => {
    beforeEach(async () => {
      await device.reloadReactNative();
      await ensureHomeScreen();
      await element(by.text('Wellness')).tap();
    });

    it('should show Ayurvedic Pharmacy title', async () => {
      await waitFor(element(by.text('Ayurvedic Pharmacy')))
        .toBeVisible()
        .withTimeout(5000);
    });

    it('should show product category tabs', async () => {
      await waitFor(element(by.text('All')))
        .toBeVisible()
        .withTimeout(5000);
    });
  });

  describe('Learn / Blog', () => {
    beforeEach(async () => {
      await device.reloadReactNative();
      await ensureHomeScreen();
      await element(by.text('Learn')).tap();
    });

    it('should show Learn Ayurveda title', async () => {
      await waitFor(element(by.text('Learn Ayurveda')))
        .toBeVisible()
        .withTimeout(5000);
    });

    it('should show Interactive Body Map', async () => {
      await waitFor(element(by.text('Interactive Body Map')))
        .toBeVisible()
        .withTimeout(3000);
    });

    it('should show category filters', async () => {
      await waitFor(element(by.text('All')))
        .toBeVisible()
        .withTimeout(3000);
    });
  });

  describe('Settings', () => {
    beforeEach(async () => {
      await device.reloadReactNative();
      await ensureHomeScreen();
      await element(by.text('Settings')).tap();
    });

    it('should show Subscription section', async () => {
      // Section titles are uppercase due to CSS textTransform
      await waitFor(element(by.text('SUBSCRIPTION')))
        .toBeVisible()
        .withTimeout(5000);
    });

    it('should show AI Service Status', async () => {
      // AI Service Status is below fold, scroll explicitly
      await scrollDownMain(400);
      await waitFor(element(by.text('AI SERVICE STATUS')))
        .toBeVisible()
        .withTimeout(5000);
    });

    it('should show Data Management section', async () => {
      await scrollDownMain(600);
      await waitFor(element(by.text('DATA MANAGEMENT')))
        .toBeVisible()
        .withTimeout(5000);
    });

    it('should show Legal section', async () => {
      await scrollDownMain(800);
      await waitFor(element(by.text('LEGAL')))
        .toBeVisible()
        .withTimeout(5000);
    });
  });

  describe('AI Consultation', () => {
    beforeEach(async () => {
      await device.reloadReactNative();
      await ensureHomeScreen();
      await element(by.text('Ask Vaidya')).tap();
    });

    it('should show suggestion prompts', async () => {
      await waitFor(element(by.text('Try asking about:')))
        .toBeVisible()
        .withTimeout(5000);
    });

    it('should show suggested queries', async () => {
      await waitFor(element(by.text("I can't sleep at night")))
        .toBeVisible()
        .withTimeout(3000);
    });
  });
});
