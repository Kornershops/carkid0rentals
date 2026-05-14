import { test, expect } from '@playwright/test'

test.describe('Support Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Login first
    await page.goto('/login')
    await page.fill('[name="phone"]', '+2348012345678')
    await page.click('button:has-text("Send OTP")')
    await page.fill('[name="otp"]', '123456')
    await page.click('button:has-text("Verify")')
  })

  test('create support ticket', async ({ page }) => {
    await page.goto('/support')
    
    await page.click('button:has-text("Create Ticket")')
    
    // Fill ticket form
    await page.fill('[name="subject"]', 'Payment not processed')
    await page.selectOption('[name="category"]', 'payment_issue')
    await page.selectOption('[name="priority"]', 'high')
    await page.fill('[name="description"]', 'I made a payment but my booking was not confirmed. Transaction ID: TXN123456')
    
    // Attach screenshot
    await page.setInputFiles('[name="attachments"]', 'test-files/screenshot.png')
    
    await page.click('button:has-text("Submit Ticket")')
    
    // Verify success
    await expect(page.locator('text=Ticket created successfully')).toBeVisible()
    await expect(page.locator('text=TKT-')).toBeVisible()
    await expect(page.locator('text=We will respond within 2 hours')).toBeVisible()
  })

  test('view ticket list and filter', async ({ page }) => {
    await page.goto('/support/tickets')
    
    // Verify tickets are displayed
    await expect(page.locator('.ticket-card').first()).toBeVisible()
    
    // Filter by status
    await page.selectOption('[name="statusFilter"]', 'open')
    await expect(page.locator('text=Open')).toBeVisible()
    
    // Filter by category
    await page.selectOption('[name="categoryFilter"]', 'payment_issue')
    await expect(page.locator('text=Payment')).toBeVisible()
    
    // Search tickets
    await page.fill('[placeholder*="Search"]', 'payment')
    await expect(page.locator('text=payment').first()).toBeVisible()
  })

  test('reply to ticket', async ({ page }) => {
    await page.goto('/support/tickets')
    
    // Click on first ticket
    await page.click('.ticket-card:first-child')
    
    // Verify ticket details
    await expect(page.locator('h1')).toContainText('TKT-')
    await expect(page.locator('.ticket-status')).toBeVisible()
    
    // Add reply
    await page.fill('[name="message"]', 'I have attached the transaction receipt')
    await page.setInputFiles('[name="attachment"]', 'test-files/receipt.pdf')
    await page.click('button:has-text("Send Reply")')
    
    // Verify reply added
    await expect(page.locator('text=I have attached the transaction receipt')).toBeVisible()
    await expect(page.locator('text=receipt.pdf')).toBeVisible()
  })

  test('search knowledge base', async ({ page }) => {
    await page.goto('/support/knowledge-base')
    
    // Search for articles
    await page.fill('[placeholder*="Search"]', 'cancel booking')
    await page.press('[placeholder*="Search"]', 'Enter')
    
    // Verify search results
    await expect(page.locator('.article-card').first()).toBeVisible()
    await expect(page.locator('text=How to cancel')).toBeVisible()
    
    // Click on article
    await page.click('.article-card:first-child')
    
    // Verify article content
    await expect(page.locator('article')).toBeVisible()
    await expect(page.locator('text=Was this helpful?')).toBeVisible()
    
    // Mark as helpful
    await page.click('button:has-text("Yes")')
    await expect(page.locator('text=Thank you for your feedback')).toBeVisible()
  })

  test('browse knowledge base by category', async ({ page }) => {
    await page.goto('/support/knowledge-base')
    
    // Click on category
    await page.click('text=Booking Issues')
    
    // Verify category articles
    await expect(page.locator('h1:has-text("Booking Issues")')).toBeVisible()
    await expect(page.locator('.article-card')).toHaveCount(5, { timeout: 5000 })
    
    // Filter by subcategory
    await page.click('text=Cancellations')
    await expect(page.locator('.article-card')).toHaveCount(3, { timeout: 5000 })
  })

  test('start live chat session', async ({ page }) => {
    await page.goto('/support')
    
    // Click live chat button
    await page.click('button:has-text("Live Chat")')
    
    // Verify chat widget opens
    await expect(page.locator('.chat-widget')).toBeVisible()
    await expect(page.locator('text=Chat with support')).toBeVisible()
    
    // Send message
    await page.fill('[name="chatMessage"]', 'I need help with my booking')
    await page.click('button[aria-label="Send message"]')
    
    // Verify message sent
    await expect(page.locator('text=I need help with my booking')).toBeVisible()
    
    // Wait for agent response
    await expect(page.locator('.agent-message').first()).toBeVisible({ timeout: 10000 })
  })

  test('rate support interaction', async ({ page }) => {
    await page.goto('/support/tickets')
    
    // Click on resolved ticket
    await page.click('.ticket-card:has-text("Resolved"):first-child')
    
    // Rate the support
    await page.click('button:has-text("Rate Support")')
    
    // Select rating
    await page.click('[data-rating="5"]')
    
    // Add feedback
    await page.fill('[name="feedback"]', 'Excellent support! Issue resolved quickly.')
    await page.click('button:has-text("Submit Rating")')
    
    // Verify success
    await expect(page.locator('text=Thank you for your feedback')).toBeVisible()
  })

  test('escalate ticket', async ({ page }) => {
    await page.goto('/support/tickets')
    
    // Click on ticket
    await page.click('.ticket-card:first-child')
    
    // Escalate ticket
    await page.click('button:has-text("Escalate")')
    
    // Confirm escalation
    await expect(page.locator('[role="dialog"]:has-text("Escalate Ticket")')).toBeVisible()
    await page.fill('[name="reason"]', 'Issue not resolved after 48 hours')
    await page.click('button:has-text("Confirm Escalation")')
    
    // Verify escalation
    await expect(page.locator('text=Ticket escalated')).toBeVisible()
    await expect(page.locator('.priority-badge:has-text("Urgent")')).toBeVisible()
  })

  test('close resolved ticket', async ({ page }) => {
    await page.goto('/support/tickets')
    
    // Click on resolved ticket
    await page.click('.ticket-card:has-text("Resolved"):first-child')
    
    // Close ticket
    await page.click('button:has-text("Close Ticket")')
    
    // Confirm closure
    await expect(page.locator('[role="dialog"]:has-text("Close Ticket")')).toBeVisible()
    await page.check('[name="issueResolved"]')
    await page.click('button:has-text("Confirm")')
    
    // Verify closure
    await expect(page.locator('text=Ticket closed')).toBeVisible()
    await expect(page.locator('.status-badge:has-text("Closed")')).toBeVisible()
  })

  test('view FAQ and expand answers', async ({ page }) => {
    await page.goto('/support/faq')
    
    // Verify FAQs are displayed
    await expect(page.locator('.faq-item').first()).toBeVisible()
    
    // Click to expand FAQ
    await page.click('.faq-item:first-child')
    
    // Verify answer is visible
    await expect(page.locator('.faq-answer').first()).toBeVisible()
    
    // Search FAQs
    await page.fill('[placeholder*="Search FAQs"]', 'refund')
    await expect(page.locator('text=refund').first()).toBeVisible()
  })

  test('contact support via email', async ({ page }) => {
    await page.goto('/support/contact')
    
    // Fill contact form
    await page.fill('[name="name"]', 'John Doe')
    await page.fill('[name="email"]', 'john@example.com')
    await page.fill('[name="subject"]', 'General Inquiry')
    await page.fill('[name="message"]', 'I would like to know more about your corporate plans')
    
    await page.click('button:has-text("Send Message")')
    
    // Verify success
    await expect(page.locator('text=Message sent successfully')).toBeVisible()
    await expect(page.locator('text=We will respond within 24 hours')).toBeVisible()
  })
})
