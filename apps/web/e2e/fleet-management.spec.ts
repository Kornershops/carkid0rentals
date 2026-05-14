import { test, expect } from '@playwright/test';

test.describe('Fleet Management Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Login as company/lister
    await page.goto('/login');
    await page.fill('[name="phone"]', '08012345678');
    await page.click('button:has-text("Send OTP")');
    await page.fill('[name="otp"]', '123456');
    await page.click('button:has-text("Verify")');
    await expect(page).toHaveURL('/dashboard');
  });

  test('should display fleet overview', async ({ page }) => {
    await page.goto('/fleet');

    // Verify fleet statistics
    await expect(page.locator('text=Total Vehicles')).toBeVisible();
    await expect(page.locator('text=15 Vehicles')).toBeVisible();
    await expect(page.locator('text=12 Active')).toBeVisible();
    await expect(page.locator('text=3 Maintenance')).toBeVisible();
  });

  test('should add new vehicle to fleet', async ({ page }) => {
    await page.goto('/fleet');
    await page.click('button:has-text("Add Vehicle")');

    // Fill vehicle details
    await page.fill('[name="make"]', 'Tesla');
    await page.fill('[name="model"]', 'Model 3');
    await page.fill('[name="year"]', '2024');
    await page.fill('[name="plateNumber"]', 'LAG-123-XY');
    await page.fill('[name="dailyRate"]', '12500');

    // Upload images
    await page.setInputFiles('[name="vehicleImages"]', [
      'test-files/car1.jpg',
      'test-files/car2.jpg'
    ]);

    // Select features
    await page.check('[name="features"][value="gps"]');
    await page.check('[name="features"][value="bluetooth"]');

    // Submit
    await page.click('button:has-text("Add Vehicle")');

    // Verify success
    await expect(page.locator('text=Vehicle Added Successfully')).toBeVisible();
    await expect(page.locator('text=Tesla Model 3')).toBeVisible();
  });

  test('should edit vehicle details', async ({ page }) => {
    await page.goto('/fleet');

    // Click edit on first vehicle
    await page.click('[data-testid="edit-vehicle-1"]');

    // Update daily rate
    await page.fill('[name="dailyRate"]', '15000');

    // Save changes
    await page.click('button:has-text("Save Changes")');

    // Verify update
    await expect(page.locator('text=Vehicle Updated')).toBeVisible();
    await expect(page.locator('text=₦15,000')).toBeVisible();
  });

  test('should mark vehicle as unavailable', async ({ page }) => {
    await page.goto('/fleet');

    // Click on vehicle
    await page.click('text=Tesla Model 3');

    // Toggle availability
    await page.click('button:has-text("Mark as Unavailable")');
    await page.fill('[name="reason"]', 'Scheduled maintenance');
    await page.click('button:has-text("Confirm")');

    // Verify status change
    await expect(page.locator('text=Unavailable')).toBeVisible();
    await expect(page.locator('text=Scheduled maintenance')).toBeVisible();
  });

  test('should view vehicle analytics', async ({ page }) => {
    await page.goto('/fleet/analytics');

    // Verify analytics dashboard
    await expect(page.locator('text=Revenue')).toBeVisible();
    await expect(page.locator('text=₦450,000')).toBeVisible();
    await expect(page.locator('text=Utilization Rate')).toBeVisible();
    await expect(page.locator('text=78%')).toBeVisible();

    // View chart
    await expect(page.locator('[data-testid="revenue-chart"]')).toBeVisible();
  });

  test('should filter fleet by status', async ({ page }) => {
    await page.goto('/fleet');

    // Filter by active vehicles
    await page.selectOption('[name="statusFilter"]', 'active');

    // Verify only active vehicles shown
    await expect(page.locator('text=Active').first()).toBeVisible();
    await expect(page.locator('text=Maintenance')).not.toBeVisible();
  });

  test('should search fleet', async ({ page }) => {
    await page.goto('/fleet');

    // Search for vehicle
    await page.fill('[placeholder="Search vehicles"]', 'Tesla');

    // Verify search results
    await expect(page.locator('text=Tesla Model 3')).toBeVisible();
    await expect(page.locator('text=BMW X5')).not.toBeVisible();
  });

  test('should view vehicle booking history', async ({ page }) => {
    await page.goto('/fleet');
    await page.click('text=Tesla Model 3');
    await page.click('text=Booking History');

    // Verify bookings
    await expect(page.locator('text=15 Total Bookings')).toBeVisible();
    await expect(page.locator('text=Booking #BK123')).toBeVisible();
    await expect(page.locator('text=₦50,000')).toBeVisible();
  });

  test('should schedule vehicle maintenance', async ({ page }) => {
    await page.goto('/fleet');
    await page.click('text=Tesla Model 3');
    await page.click('button:has-text("Schedule Maintenance")');

    // Fill maintenance details
    await page.selectOption('[name="maintenanceType"]', 'service');
    await page.fill('[name="scheduledDate"]', '2024-03-01');
    await page.fill('[name="notes"]', 'Regular service check');

    // Submit
    await page.click('button:has-text("Schedule")');

    // Verify
    await expect(page.locator('text=Maintenance Scheduled')).toBeVisible();
  });

  test('should export fleet report', async ({ page }) => {
    await page.goto('/fleet/analytics');

    // Click export button
    await page.click('button:has-text("Export Report")');

    // Select date range
    await page.fill('[name="startDate"]', '2024-01-01');
    await page.fill('[name="endDate"]', '2024-01-31');

    // Download
    const downloadPromise = page.waitForEvent('download');
    await page.click('button:has-text("Download PDF")');
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toContain('fleet-report');
  });

  test('should delete vehicle from fleet', async ({ page }) => {
    await page.goto('/fleet');
    await page.click('[data-testid="delete-vehicle-1"]');

    // Confirm deletion
    await page.fill('[name="confirmText"]', 'DELETE');
    await page.click('button:has-text("Confirm Delete")');

    // Verify deletion
    await expect(page.locator('text=Vehicle Deleted')).toBeVisible();
  });
});
