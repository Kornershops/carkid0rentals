import { test, expect } from '@playwright/test';

test.describe('Onboarding Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should complete driver onboarding successfully', async ({ page }) => {
    // Navigate to driver onboarding
    await page.click('text=Become a Driver');
    await expect(page).toHaveURL(/.*onboarding\/driver/);

    // Step 1: Personal Information
    await page.fill('[name="fullName"]', 'John Doe');
    await page.fill('[name="phone"]', '08012345678');
    await page.fill('[name="email"]', 'john@example.com');
    await page.fill('[name="address"]', '123 Main St, Lagos');
    await page.click('button:has-text("Next")');

    // Step 2: License Information
    await page.fill('[name="licenseNumber"]', 'LAG123456');
    await page.fill('[name="expiryDate"]', '2025-12-31');
    await page.setInputFiles('[name="licenseUpload"]', 'test-files/license.jpg');
    await page.click('button:has-text("Next")');

    // Step 3: Vehicle Preferences
    await page.check('[name="vehicleType"][value="sedan"]');
    await page.check('[name="vehicleType"][value="suv"]');
    await page.click('button:has-text("Submit")');

    // Verify success
    await expect(page.locator('text=Onboarding Complete')).toBeVisible();
    await expect(page.locator('text=Welcome, John')).toBeVisible();
  });

  test('should complete lister onboarding successfully', async ({ page }) => {
    // Navigate to lister onboarding
    await page.click('text=List Your Vehicle');
    await expect(page).toHaveURL(/.*onboarding\/lister/);

    // Step 1: Business Information
    await page.fill('[name="businessName"]', 'Test Fleet Co');
    await page.check('[name="businessType"][value="company"]');
    await page.fill('[name="taxId"]', 'TAX123456');
    await page.click('button:has-text("Continue")');

    // Step 2: Bank Information
    await page.fill('[name="accountNumber"]', '1234567890');
    await page.selectOption('[name="bankName"]', 'GTBank');
    await page.click('button:has-text("Verify Account")');
    await expect(page.locator('text=Account Verified')).toBeVisible();
    await page.click('button:has-text("Continue")');

    // Step 3: Documents
    await page.setInputFiles('[name="businessRegistration"]', 'test-files/registration.pdf');
    await page.check('[name="termsAccepted"]');
    await page.click('button:has-text("Submit Application")');

    // Verify success
    await expect(page.locator('text=Application Submitted')).toBeVisible();
  });

  test('should complete KYC verification', async ({ page }) => {
    await page.goto('/onboarding/kyc');

    // Fill personal information
    await page.fill('[name="firstName"]', 'John');
    await page.fill('[name="lastName"]', 'Doe');
    await page.fill('[name="dateOfBirth"]', '1990-01-01');
    await page.selectOption('[name="idType"]', 'passport');
    await page.fill('[name="idNumber"]', 'A12345678');

    // Upload documents
    await page.setInputFiles('[name="idDocument"]', 'test-files/passport.jpg');
    await page.setInputFiles('[name="selfie"]', 'test-files/selfie.jpg');

    // Submit
    await page.click('button:has-text("Submit Verification")');

    // Verify submission
    await expect(page.locator('text=Verification Submitted')).toBeVisible();
    await expect(page.locator('text=Pending Review')).toBeVisible();
  });

  test('should handle validation errors in onboarding', async ({ page }) => {
    await page.goto('/onboarding/driver');

    // Try to proceed without filling required fields
    await page.click('button:has-text("Next")');

    // Verify error messages
    await expect(page.locator('text=Full name is required')).toBeVisible();
    await expect(page.locator('text=Phone number is required')).toBeVisible();
  });

  test('should allow navigation back to previous steps', async ({ page }) => {
    await page.goto('/onboarding/driver');

    // Fill step 1 and proceed
    await page.fill('[name="fullName"]', 'John Doe');
    await page.fill('[name="phone"]', '08012345678');
    await page.click('button:has-text("Next")');

    // Go back
    await page.click('button:has-text("Back")');

    // Verify data is preserved
    await expect(page.locator('[name="fullName"]')).toHaveValue('John Doe');
  });

  test('should show progress indicator', async ({ page }) => {
    await page.goto('/onboarding/driver');

    // Verify progress bar
    await expect(page.locator('[role="progressbar"]')).toBeVisible();
    await expect(page.locator('text=33%')).toBeVisible();

    // Proceed to next step
    await page.fill('[name="fullName"]', 'John Doe');
    await page.click('button:has-text("Next")');

    // Verify progress updated
    await expect(page.locator('text=67%')).toBeVisible();
  });

  test('should complete background check authorization', async ({ page }) => {
    await page.goto('/onboarding/background-check');

    // Read consent details
    await expect(page.locator('text=Criminal Record Check')).toBeVisible();
    await expect(page.locator('text=Driving History')).toBeVisible();

    // Accept consent
    await page.check('[name="consentAccepted"]');
    await page.click('button:has-text("Authorize")');

    // Verify submission
    await expect(page.locator('text=Background Check Initiated')).toBeVisible();
  });

  test('should handle role selection', async ({ page }) => {
    await page.goto('/onboarding/role-selection');

    // Verify all roles are displayed
    await expect(page.locator('text=Customer')).toBeVisible();
    await expect(page.locator('text=Driver')).toBeVisible();
    await expect(page.locator('text=Lister')).toBeVisible();
    await expect(page.locator('text=Company')).toBeVisible();

    // Select driver role
    await page.click('button:has-text("Driver")');
    await expect(page.locator('button:has-text("Driver")').locator('..')).toHaveClass(/selected/);

    // Continue
    await page.click('button:has-text("Continue")');
    await expect(page).toHaveURL(/.*onboarding\/driver/);
  });
});
