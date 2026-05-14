import { test, expect } from '@playwright/test'

test.describe('Booking Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('complete booking flow from search to confirmation', async ({ page }) => {
    // Step 1: Search for vehicles
    await page.fill('[placeholder*="location"]', 'Lagos')
    await page.fill('[name="startDate"]', '2024-12-25')
    await page.fill('[name="endDate"]', '2024-12-30')
    await page.click('button:has-text("Search")')

    // Step 2: Select a vehicle
    await expect(page.locator('.vehicle-card').first()).toBeVisible()
    await page.click('.vehicle-card:first-child button:has-text("Book")')

    // Step 3: Login/Auth (if not authenticated)
    const loginModal = page.locator('[role="dialog"]:has-text("Login")')
    if (await loginModal.isVisible()) {
      await page.fill('[name="phone"]', '+2348012345678')
      await page.click('button:has-text("Send OTP")')
      
      // Wait for OTP input
      await expect(page.locator('[name="otp"]')).toBeVisible()
      await page.fill('[name="otp"]', '123456')
      await page.click('button:has-text("Verify")')
    }

    // Step 4: Fill booking details
    await expect(page.locator('h1:has-text("Booking Details")')).toBeVisible()
    await page.fill('[name="pickupLocation"]', 'Ikeja City Mall')
    await page.fill('[name="dropoffLocation"]', 'Lekki Phase 1')
    await page.check('[name="insurance"]')

    // Step 5: Review and confirm
    await page.click('button:has-text("Continue to Payment")')
    await expect(page.locator('h2:has-text("Review Booking")')).toBeVisible()
    
    // Verify booking summary
    await expect(page.locator('text=Lagos')).toBeVisible()
    await expect(page.locator('text=Dec 25')).toBeVisible()
    await expect(page.locator('text=Dec 30')).toBeVisible()

    // Step 6: Payment
    await page.click('button:has-text("Pay Now")')
    
    // Fill payment details
    await page.fill('[name="cardNumber"]', '4532015112830366')
    await page.fill('[name="cardName"]', 'John Doe')
    await page.fill('[name="expiryDate"]', '12/25')
    await page.fill('[name="cvv"]', '123')
    await page.click('button:has-text("Complete Payment")')

    // Step 7: Confirmation
    await expect(page.locator('h1:has-text("Booking Confirmed")')).toBeVisible({ timeout: 10000 })
    await expect(page.locator('text=Booking ID')).toBeVisible()
    
    // Verify confirmation email message
    await expect(page.locator('text=confirmation email')).toBeVisible()
  })

  test('instant book flow', async ({ page }) => {
    await page.goto('/listings')
    
    // Find instant book vehicle
    const instantBookCard = page.locator('.vehicle-card:has-text("Instant Book")').first()
    await instantBookCard.click()

    // Click instant book button
    await page.click('button:has-text("Instant Book")')
    
    // Should skip review and go straight to payment
    await expect(page.locator('h2:has-text("Payment")')).toBeVisible()
  })

  test('booking with flexible dates', async ({ page }) => {
    await page.goto('/listings')
    
    // Open flexible dates calendar
    await page.click('button:has-text("Flexible Dates")')
    
    // Select date range
    await page.click('[data-date="2024-12-25"]')
    await page.click('[data-date="2024-12-30"]')
    
    // View price comparison
    await expect(page.locator('text=Best Price')).toBeVisible()
    await expect(page.locator('text=Save')).toBeVisible()
    
    await page.click('button:has-text("Book These Dates")')
    
    // Continue with booking
    await expect(page.locator('h1:has-text("Booking Details")')).toBeVisible()
  })

  test('booking cancellation flow', async ({ page }) => {
    // Navigate to bookings
    await page.goto('/dashboard/bookings')
    
    // Select a booking
    await page.click('.booking-card:first-child')
    
    // Click cancel button
    await page.click('button:has-text("Cancel Booking")')
    
    // Confirm cancellation
    await expect(page.locator('[role="dialog"]:has-text("Cancel Booking")')).toBeVisible()
    await page.selectOption('[name="reason"]', 'change_of_plans')
    await page.fill('[name="details"]', 'Need to reschedule')
    await page.click('button:has-text("Confirm Cancellation")')
    
    // Verify cancellation success
    await expect(page.locator('text=Booking cancelled successfully')).toBeVisible()
    await expect(page.locator('text=Refund will be processed')).toBeVisible()
  })

  test('modify booking flow', async ({ page }) => {
    await page.goto('/dashboard/bookings')
    
    // Select a booking
    await page.click('.booking-card:first-child')
    
    // Click modify button
    await page.click('button:has-text("Modify Booking")')
    
    // Change dates
    await page.fill('[name="newStartDate"]', '2024-12-26')
    await page.fill('[name="newEndDate"]', '2024-12-31')
    
    // Review changes
    await page.click('button:has-text("Review Changes")')
    
    // Verify price difference
    await expect(page.locator('text=Additional Cost')).toBeVisible()
    
    // Confirm modification
    await page.click('button:has-text("Confirm Changes")')
    
    await expect(page.locator('text=Booking updated successfully')).toBeVisible()
  })

  test('price alert setup', async ({ page }) => {
    await page.goto('/listings')
    
    // Click on a vehicle
    await page.click('.vehicle-card:first-child')
    
    // Set price alert
    await page.click('button:has-text("Set Price Alert")')
    
    await page.fill('[name="targetPrice"]', '45000')
    await page.fill('[name="email"]', 'user@example.com')
    await page.click('button:has-text("Create Alert")')
    
    await expect(page.locator('text=Price alert created')).toBeVisible()
  })
})
