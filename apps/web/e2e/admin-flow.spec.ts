import { test, expect } from '@playwright/test';

test.describe('Admin Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Login as admin
    await page.goto('/login');
    await page.fill('[name="phone"]', '08099999999');
    await page.click('button:has-text("Send OTP")');
    await page.fill('[name="otp"]', '123456');
    await page.click('button:has-text("Verify")');
    await expect(page).toHaveURL('/admin/dashboard');
  });

  test('should display admin dashboard', async ({ page }) => {
    // Verify dashboard metrics
    await expect(page.locator('text=Total Users')).toBeVisible();
    await expect(page.locator('text=1,234')).toBeVisible();
    await expect(page.locator('text=Active Bookings')).toBeVisible();
    await expect(page.locator('text=Revenue')).toBeVisible();
    await expect(page.locator('text=₦2,500,000')).toBeVisible();
  });

  test('should manage users', async ({ page }) => {
    await page.goto('/admin/users');

    // Verify user list
    await expect(page.locator('text=john@example.com')).toBeVisible();
    
    // Search for user
    await page.fill('[placeholder="Search users"]', 'john');
    await expect(page.locator('text=john@example.com')).toBeVisible();

    // View user details
    await page.click('text=john@example.com');
    await expect(page.locator('text=User Details')).toBeVisible();
  });

  test('should suspend user account', async ({ page }) => {
    await page.goto('/admin/users');
    await page.click('text=john@example.com');

    // Suspend account
    await page.click('button:has-text("Suspend Account")');
    await page.fill('[name="reason"]', 'Policy violation');
    await page.click('button:has-text("Confirm Suspension")');

    // Verify suspension
    await expect(page.locator('text=Account Suspended')).toBeVisible();
    await expect(page.locator('text=Suspended').first()).toBeVisible();
  });

  test('should approve KYC verification', async ({ page }) => {
    await page.goto('/admin/verifications');

    // View pending verifications
    await expect(page.locator('text=Pending Verifications')).toBeVisible();
    await page.click('[data-testid="verification-1"]');

    // Review documents
    await expect(page.locator('img[alt="ID Document"]')).toBeVisible();
    await expect(page.locator('img[alt="Selfie"]')).toBeVisible();

    // Approve
    await page.click('button:has-text("Approve")');
    await expect(page.locator('text=Verification Approved')).toBeVisible();
  });

  test('should reject KYC verification', async ({ page }) => {
    await page.goto('/admin/verifications');
    await page.click('[data-testid="verification-1"]');

    // Reject with reason
    await page.click('button:has-text("Reject")');
    await page.fill('[name="rejectionReason"]', 'Document not clear');
    await page.click('button:has-text("Confirm Rejection")');

    // Verify rejection
    await expect(page.locator('text=Verification Rejected')).toBeVisible();
  });

  test('should view system analytics', async ({ page }) => {
    await page.goto('/admin/analytics');

    // Verify analytics charts
    await expect(page.locator('[data-testid="revenue-chart"]')).toBeVisible();
    await expect(page.locator('[data-testid="bookings-chart"]')).toBeVisible();
    await expect(page.locator('[data-testid="users-chart"]')).toBeVisible();

    // Filter by date range
    await page.fill('[name="startDate"]', '2024-01-01');
    await page.fill('[name="endDate"]', '2024-01-31');
    await page.click('button:has-text("Apply Filter")');

    // Verify filtered data
    await expect(page.locator('text=January 2024')).toBeVisible();
  });

  test('should manage system settings', async ({ page }) => {
    await page.goto('/admin/settings');

    // Update commission rate
    await page.fill('[name="commissionRate"]', '15');

    // Update booking settings
    await page.fill('[name="minBookingHours"]', '4');
    await page.fill('[name="maxBookingDays"]', '30');

    // Save settings
    await page.click('button:has-text("Save Settings")');

    // Verify update
    await expect(page.locator('text=Settings Updated')).toBeVisible();
  });

  test('should view audit logs', async ({ page }) => {
    await page.goto('/admin/audit-logs');

    // Verify logs are displayed
    await expect(page.locator('text=User Login')).toBeVisible();
    await expect(page.locator('text=Booking Created')).toBeVisible();
    await expect(page.locator('text=Payment Processed')).toBeVisible();

    // Filter logs
    await page.selectOption('[name="actionType"]', 'payment');
    await expect(page.locator('text=Payment Processed')).toBeVisible();
    await expect(page.locator('text=User Login')).not.toBeVisible();
  });

  test('should handle support tickets', async ({ page }) => {
    await page.goto('/admin/support');

    // View open tickets
    await expect(page.locator('text=Open Tickets')).toBeVisible();
    await page.click('[data-testid="ticket-1"]');

    // Respond to ticket
    await page.fill('[name="response"]', 'We are looking into this issue.');
    await page.click('button:has-text("Send Response")');

    // Close ticket
    await page.click('button:has-text("Close Ticket")');
    await expect(page.locator('text=Ticket Closed')).toBeVisible();
  });

  test('should export system reports', async ({ page }) => {
    await page.goto('/admin/reports');

    // Select report type
    await page.selectOption('[name="reportType"]', 'revenue');

    // Set date range
    await page.fill('[name="startDate"]', '2024-01-01');
    await page.fill('[name="endDate"]', '2024-01-31');

    // Download report
    const downloadPromise = page.waitForEvent('download');
    await page.click('button:has-text("Download Report")');
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toContain('revenue-report');
  });

  test('should manage promotions', async ({ page }) => {
    await page.goto('/admin/promotions');

    // Create new promotion
    await page.click('button:has-text("Create Promotion")');
    await page.fill('[name="code"]', 'SUMMER2024');
    await page.fill('[name="discount"]', '20');
    await page.fill('[name="validUntil"]', '2024-08-31');
    await page.click('button:has-text("Create")');

    // Verify creation
    await expect(page.locator('text=Promotion Created')).toBeVisible();
    await expect(page.locator('text=SUMMER2024')).toBeVisible();
  });
});
