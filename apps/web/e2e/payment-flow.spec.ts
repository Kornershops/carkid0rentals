import { test, expect } from '@playwright/test'

test.describe('Payment Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Login first
    await page.goto('/login')
    await page.fill('[name="phone"]', '+2348012345678')
    await page.click('button:has-text("Send OTP")')
    await page.fill('[name="otp"]', '123456')
    await page.click('button:has-text("Verify")')
  })

  test('add payment method', async ({ page }) => {
    await page.goto('/dashboard/payments')
    
    await page.click('button:has-text("Add Payment Method")')
    
    // Fill card details
    await page.fill('[name="cardNumber"]', '4532 0151 1283 0366')
    await page.fill('[name="cardName"]', 'John Doe')
    await page.fill('[name="expiryDate"]', '12/25')
    await page.fill('[name="cvv"]', '123')
    
    await page.click('button:has-text("Add Card")')
    
    await expect(page.locator('text=Card added successfully')).toBeVisible()
    await expect(page.locator('text=****0366')).toBeVisible()
  })

  test('split payment creation', async ({ page }) => {
    await page.goto('/dashboard/bookings')
    
    // Select a booking
    await page.click('.booking-card:first-child')
    
    // Click split payment
    await page.click('button:has-text("Split Payment")')
    
    // Add participants
    await page.click('button:has-text("Add Participant")')
    await page.fill('[name="participant1Email"]', 'friend@example.com')
    await page.fill('[name="participant1Amount"]', '50000')
    
    await page.click('button:has-text("Add Participant")')
    await page.fill('[name="participant2Email"]', 'colleague@example.com')
    await page.fill('[name="participant2Amount"]', '50000')
    
    // Create split
    await page.click('button:has-text("Create Split Payment")')
    
    await expect(page.locator('text=Split payment created')).toBeVisible()
    await expect(page.locator('text=Invitations sent')).toBeVisible()
  })

  test('installment plan selection', async ({ page }) => {
    await page.goto('/dashboard/bookings')
    
    // Select a booking
    await page.click('.booking-card:first-child')
    
    // Click installment option
    await page.click('button:has-text("Pay in Installments")')
    
    // Select 6-month plan
    await page.click('[data-plan="6-months"]')
    
    // Review installment details
    await expect(page.locator('text=6 monthly payments')).toBeVisible()
    await expect(page.locator('text=8% interest')).toBeVisible()
    
    // Confirm installment plan
    await page.click('button:has-text("Confirm Plan")')
    
    await expect(page.locator('text=Installment plan activated')).toBeVisible()
  })

  test('refund request', async ({ page }) => {
    await page.goto('/dashboard/bookings')
    
    // Select a cancelled booking
    await page.click('.booking-card:has-text("Cancelled"):first-child')
    
    // Request refund
    await page.click('button:has-text("Request Refund")')
    
    // Fill refund form
    await page.selectOption('[name="reason"]', 'service_issue')
    await page.fill('[name="description"]', 'Vehicle was not as described')
    
    // Upload supporting document
    await page.setInputFiles('[name="document"]', 'test-files/receipt.pdf')
    
    await page.click('button:has-text("Submit Request")')
    
    await expect(page.locator('text=Refund request submitted')).toBeVisible()
    await expect(page.locator('text=Review within 3-5 business days')).toBeVisible()
  })

  test('payment history and export', async ({ page }) => {
    await page.goto('/dashboard/payments/history')
    
    // Verify payments are displayed
    await expect(page.locator('.payment-row').first()).toBeVisible()
    
    // Filter by status
    await page.selectOption('[name="statusFilter"]', 'completed')
    await expect(page.locator('text=Completed')).toBeVisible()
    
    // Search payments
    await page.fill('[placeholder*="Search"]', 'Toyota')
    await expect(page.locator('text=Toyota')).toBeVisible()
    
    // Export to CSV
    await page.click('button:has-text("Export CSV")')
    
    // Verify download started
    const download = await page.waitForEvent('download')
    expect(download.suggestedFilename()).toContain('payments')
  })

  test('saved card management', async ({ page }) => {
    await page.goto('/dashboard/payments')
    
    // View saved cards
    await expect(page.locator('.saved-card').first()).toBeVisible()
    
    // Set default card
    await page.click('.saved-card:first-child button:has-text("Set Default")')
    await expect(page.locator('text=Default card updated')).toBeVisible()
    
    // Remove card
    await page.click('.saved-card:last-child button:has-text("Remove")')
    await page.click('button:has-text("Confirm")')
    await expect(page.locator('text=Card removed')).toBeVisible()
  })

  test('payment with multiple providers fallback', async ({ page }) => {
    await page.goto('/dashboard/bookings')
    
    // Select a booking and pay
    await page.click('.booking-card:first-child button:has-text("Pay Now")')
    
    // Primary provider (Paystack) fails
    await page.fill('[name="cardNumber"]', '4000000000000002') // Declined card
    await page.fill('[name="cardName"]', 'John Doe')
    await page.fill('[name="expiryDate"]', '12/25')
    await page.fill('[name="cvv"]', '123')
    await page.click('button:has-text("Pay")')
    
    // Should show fallback option
    await expect(page.locator('text=Try alternative payment method')).toBeVisible()
    await page.click('button:has-text("Use Flutterwave")')
    
    // Retry with valid card
    await page.fill('[name="cardNumber"]', '4532015112830366')
    await page.click('button:has-text("Pay")')
    
    await expect(page.locator('text=Payment successful')).toBeVisible()
  })
})
