import { test, expect } from '@playwright/test';

test.describe('Notifications Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Login first
    await page.goto('/login');
    await page.fill('[name="phone"]', '08012345678');
    await page.click('button:has-text("Send OTP")');
    await page.fill('[name="otp"]', '123456');
    await page.click('button:has-text("Verify")');
    await expect(page).toHaveURL('/dashboard');
  });

  test('should display notification bell with badge', async ({ page }) => {
    // Verify notification bell is visible
    await expect(page.locator('[data-testid="notification-bell"]')).toBeVisible();
    
    // Verify unread count badge
    await expect(page.locator('[data-testid="notification-badge"]')).toHaveText('3');
  });

  test('should open notification dropdown', async ({ page }) => {
    // Click notification bell
    await page.click('[data-testid="notification-bell"]');

    // Verify dropdown is visible
    await expect(page.locator('[data-testid="notification-dropdown"]')).toBeVisible();
    
    // Verify notifications are displayed
    await expect(page.locator('text=Booking Confirmed')).toBeVisible();
    await expect(page.locator('text=Payment Received')).toBeVisible();
  });

  test('should mark notification as read', async ({ page }) => {
    await page.click('[data-testid="notification-bell"]');
    
    // Click on a notification
    await page.click('text=Booking Confirmed');

    // Verify notification is marked as read
    await expect(page.locator('[data-testid="notification-badge"]')).toHaveText('2');
  });

  test('should mark all notifications as read', async ({ page }) => {
    await page.click('[data-testid="notification-bell"]');
    
    // Click mark all as read
    await page.click('button:has-text("Mark All as Read")');

    // Verify badge is cleared
    await expect(page.locator('[data-testid="notification-badge"]')).not.toBeVisible();
  });

  test('should navigate to notification center', async ({ page }) => {
    await page.click('[data-testid="notification-bell"]');
    await page.click('text=View All Notifications');

    // Verify navigation
    await expect(page).toHaveURL('/notifications');
    await expect(page.locator('h1:has-text("Notifications")')).toBeVisible();
  });

  test('should filter notifications by type', async ({ page }) => {
    await page.goto('/notifications');

    // Filter by booking notifications
    await page.click('button:has-text("Bookings")');

    // Verify only booking notifications are shown
    await expect(page.locator('text=Booking Confirmed')).toBeVisible();
    await expect(page.locator('text=Payment Received')).not.toBeVisible();
  });

  test('should update notification preferences', async ({ page }) => {
    await page.goto('/notifications/preferences');

    // Toggle email notifications
    await page.click('[name="emailNotifications"]');
    
    // Toggle push notifications
    await page.click('[name="pushNotifications"]');

    // Set quiet hours
    await page.fill('[name="quietHoursStart"]', '22:00');
    await page.fill('[name="quietHoursEnd"]', '08:00');

    // Save preferences
    await page.click('button:has-text("Save Preferences")');

    // Verify success message
    await expect(page.locator('text=Preferences Updated')).toBeVisible();
  });

  test('should delete notification', async ({ page }) => {
    await page.goto('/notifications');

    // Click delete button on first notification
    await page.click('[data-testid="delete-notification-1"]');

    // Confirm deletion
    await page.click('button:has-text("Confirm")');

    // Verify notification is removed
    await expect(page.locator('[data-testid="notification-1"]')).not.toBeVisible();
  });

  test('should handle notification sound toggle', async ({ page }) => {
    await page.goto('/notifications/preferences');

    // Toggle notification sound
    const soundToggle = page.locator('[name="notificationSound"]');
    await soundToggle.click();

    // Verify toggle state
    await expect(soundToggle).toBeChecked();

    // Save and verify
    await page.click('button:has-text("Save Preferences")');
    await expect(page.locator('text=Preferences Updated')).toBeVisible();
  });
});
