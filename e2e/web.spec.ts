import { test, expect } from '@playwright/test';

/**
 * NayaVed AI - Web E2E Tests (Playwright)
 * Tests the web version of the app via Expo Web
 */

test.describe('NayaVed Web App', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the Expo web app
    await page.goto('http://localhost:8081');
    // Wait for the app to load
    await page.waitForLoadState('networkidle');
  });

  test('should load the app', async ({ page }) => {
    // Check that the page loaded
    await expect(page).toHaveTitle(/NayaVed|Expo/);
  });

  test('should display home screen content', async ({ page }) => {
    // Wait for React Native Web to render
    await page.waitForTimeout(3000);

    // Look for app content
    const body = await page.textContent('body');
    expect(body).toBeTruthy();
  });

  test('should have navigation elements', async ({ page }) => {
    await page.waitForTimeout(3000);

    // Check for common navigation text
    const pageContent = await page.content();
    const hasNavigation =
      pageContent.includes('Home') ||
      pageContent.includes('Plan') ||
      pageContent.includes('Settings') ||
      pageContent.includes('NayaVed');

    expect(hasNavigation).toBe(true);
  });

  test('should be responsive', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(1000);

    const mobileContent = await page.content();
    expect(mobileContent.length).toBeGreaterThan(100);

    // Test tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.waitForTimeout(1000);

    const tabletContent = await page.content();
    expect(tabletContent.length).toBeGreaterThan(100);
  });

  test('should not have console errors on load', async ({ page }) => {
    const errors: string[] = [];

    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    await page.goto('http://localhost:8081');
    await page.waitForTimeout(3000);

    // Filter out known non-critical errors
    const criticalErrors = errors.filter(
      (e) => !e.includes('favicon') && !e.includes('manifest')
    );

    expect(criticalErrors.length).toBe(0);
  });
});
