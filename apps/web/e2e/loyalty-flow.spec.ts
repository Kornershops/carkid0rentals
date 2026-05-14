import { test, expect } from '@playwright/test';

test.describe('Loyalty Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Login first
    await page.goto('/login');
    await page.fill('[name="phone"]', '08012345678');
    await page.click('button:has-text("Send OTP")');
    await page.fill('[name="otp"]', '123456');
    await page.click('button:has-text("Verify")');
    await expect(page).toHaveURL('/dashboard');
  });

  test('should display points balance', async ({ page }) => {
    await page.goto('/loyalty');

    // Verify points balance is displayed
    await expect(page.locator('text=1,250 Points')).toBeVisible();
    await expect(page.locator('text=Silver Tier')).toBeVisible();
  });

  test('should view points history', async ({ page }) => {
    await page.goto('/loyalty/points');

    // Verify points transactions
    await expect(page.locator('text=Booking Completed')).toBeVisible();
    await expect(page.locator('text=+100 points')).toBeVisible();
    await expect(page.locator('text=Referral Bonus')).toBeVisible();
    await expect(page.locator('text=+50 points')).toBeVisible();
  });

  test('should filter points history', async ({ page }) => {
    await page.goto('/loyalty/points');

    // Filter by earned points
    await page.selectOption('[name="filter"]', 'earned');

    // Verify only earned points are shown
    await expect(page.locator('text=+100 points')).toBeVisible();
    await expect(page.locator('text=-50 points')).not.toBeVisible();
  });

  test('should browse rewards catalog', async ({ page }) => {
    await page.goto('/loyalty/rewards');

    // Verify rewards are displayed
    await expect(page.locator('text=Free Day Rental')).toBeVisible();
    await expect(page.locator('text=500 points')).toBeVisible();
    await expect(page.locator('text=10% Discount')).toBeVisible();
  });

  test('should redeem reward', async ({ page }) => {
    await page.goto('/loyalty/rewards');

    // Click redeem on a reward
    await page.click('button:has-text("Redeem"):first');

    // Confirm redemption
    await page.click('button:has-text("Confirm Redemption")');

    // Verify success
    await expect(page.locator('text=Reward Redeemed')).toBeVisible();
    await expect(page.locator('text=750 Points')).toBeVisible(); // Updated balance
  });

  test('should generate referral code', async ({ page }) => {
    await page.goto('/loyalty/referrals');

    // Verify referral code is displayed
    await expect(page.locator('[data-testid="referral-code"]')).toBeVisible();
    
    // Copy referral code
    await page.click('button:has-text("Copy Code")');
    await expect(page.locator('text=Code Copied')).toBeVisible();
  });

  test('should share referral link', async ({ page }) => {
    await page.goto('/loyalty/referrals');

    // Click share button
    await page.click('button:has-text("Share Link")');

    // Verify share options
    await expect(page.locator('text=WhatsApp')).toBeVisible();
    await expect(page.locator('text=Email')).toBeVisible();
    await expect(page.locator('text=Copy Link')).toBeVisible();
  });

  test('should view referral stats', async ({ page }) => {
    await page.goto('/loyalty/referrals');

    // Verify referral statistics
    await expect(page.locator('text=5 Referrals')).toBeVisible();
    await expect(page.locator('text=3 Active')).toBeVisible();
    await expect(page.locator('text=250 Points Earned')).toBeVisible();
  });

  test('should view tier progress', async ({ page }) => {
    await page.goto('/loyalty');

    // Verify tier progress bar
    await expect(page.locator('[role="progressbar"]')).toBeVisible();
    await expect(page.locator('text=750 points to Gold')).toBeVisible();

    // View tier benefits
    await page.click('button:has-text("View Benefits")');
    await expect(page.locator('text=Priority Support')).toBeVisible();
    await expect(page.locator('text=Exclusive Discounts')).toBeVisible();
  });

  test('should export points history', async ({ page }) => {
    await page.goto('/loyalty/points');

    // Click export button
    await page.click('button:has-text("Export")');

    // Verify download initiated
    const downloadPromise = page.waitForEvent('download');
    await page.click('button:has-text("Download CSV")');
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toContain('points-history');
  });
});
