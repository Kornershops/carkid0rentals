package main

import (
	"fmt"
	"log"
	"time"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

type KnowledgeBaseArticle struct {
	ID          string    `gorm:"primaryKey"`
	Title       string    `gorm:"not null"`
	Content     string    `gorm:"type:text;not null"`
	Category    string    `gorm:"not null"`
	Views       int       `gorm:"default:0"`
	HelpfulCount int      `gorm:"default:0"`
	CreatedAt   time.Time
	UpdatedAt   time.Time
}

func main() {
	// Database connection
	dsn := "host=localhost user=admin password=password dbname=carkid0_rentals port=5432 sslmode=disable"
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}

	// Auto-migrate
	db.AutoMigrate(&KnowledgeBaseArticle{})

	// Sample articles
	articles := []KnowledgeBaseArticle{
		// Booking Category
		{
			ID:       "kb-001",
			Title:    "How to Book a Vehicle",
			Content:  "<h2>Booking a Vehicle</h2><p>Follow these simple steps to book your vehicle:</p><ol><li>Browse available vehicles</li><li>Select your preferred vehicle</li><li>Choose pickup and return dates</li><li>Complete payment</li><li>Receive confirmation</li></ol><p>You'll receive an email and SMS confirmation with your booking details.</p>",
			Category: "booking",
			Views:    245,
			HelpfulCount: 189,
		},
		{
			ID:       "kb-002",
			Title:    "How to Modify a Booking",
			Content:  "<h2>Modifying Your Booking</h2><p>You can modify your booking up to 24 hours before pickup:</p><ol><li>Go to 'My Bookings'</li><li>Select the booking to modify</li><li>Click 'Modify Booking'</li><li>Update dates or vehicle</li><li>Confirm changes</li></ol><p>Note: Price may change based on new dates or vehicle selection.</p>",
			Category: "booking",
			Views:    178,
			HelpfulCount: 142,
		},
		{
			ID:       "kb-003",
			Title:    "Cancellation Policy",
			Content:  "<h2>Cancellation Policy</h2><p>Our cancellation policy is as follows:</p><ul><li><strong>24 hours before:</strong> 100% refund</li><li><strong>48 hours before:</strong> 75% refund</li><li><strong>72 hours before:</strong> 50% refund</li><li><strong>After 72 hours:</strong> No refund</li></ul><p>Refunds are processed within 5-7 business days.</p>",
			Category: "booking",
			Views:    312,
			HelpfulCount: 267,
		},

		// Payment Category
		{
			ID:       "kb-004",
			Title:    "Accepted Payment Methods",
			Content:  "<h2>Payment Methods</h2><p>We accept the following payment methods:</p><ul><li>Credit/Debit Cards (Visa, Mastercard, Verve)</li><li>Bank Transfer</li><li>Mobile Money</li><li>Paystack, Flutterwave, Stripe</li></ul><p>All payments are secured with industry-standard encryption.</p>",
			Category: "payment",
			Views:    423,
			HelpfulCount: 356,
		},
		{
			ID:       "kb-005",
			Title:    "Split Payment Guide",
			Content:  "<h2>Split Payment</h2><p>Share the cost with friends:</p><ol><li>Select 'Split Payment' at checkout</li><li>Add 2-4 participants</li><li>Choose equal or custom split</li><li>Send invitations</li><li>Each person pays their share</li></ol><p>Booking is confirmed once all payments are received.</p>",
			Category: "payment",
			Views:    198,
			HelpfulCount: 156,
		},
		{
			ID:       "kb-006",
			Title:    "Installment Payment Plans",
			Content:  "<h2>Pay in Installments</h2><p>Available for bookings over ₦50,000:</p><ul><li><strong>3 months:</strong> 5% interest</li><li><strong>6 months:</strong> 8% interest</li><li><strong>12 months:</strong> 12% interest</li></ul><p>First payment due at booking, remaining payments monthly.</p>",
			Category: "payment",
			Views:    267,
			HelpfulCount: 201,
		},
		{
			ID:       "kb-007",
			Title:    "How to Request a Refund",
			Content:  "<h2>Refund Process</h2><p>To request a refund:</p><ol><li>Go to 'My Bookings'</li><li>Select the booking</li><li>Click 'Request Refund'</li><li>Select reason</li><li>Submit request</li></ol><p>Refunds are processed within 5-7 business days according to our cancellation policy.</p>",
			Category: "payment",
			Views:    289,
			HelpfulCount: 234,
		},

		// Vehicle Category
		{
			ID:       "kb-008",
			Title:    "Vehicle Categories Explained",
			Content:  "<h2>Vehicle Categories</h2><p>We offer 4 vehicle tiers:</p><ul><li><strong>Exotic:</strong> Luxury vehicles (Mercedes, BMW, Audi)</li><li><strong>Premium:</strong> High-end sedans and SUVs</li><li><strong>Eco-Gig:</strong> Fuel-efficient economy cars</li><li><strong>Heavy-Haul:</strong> Trucks and cargo vehicles</li></ul><p>Each category has different pricing and features.</p>",
			Category: "vehicle",
			Views:    534,
			HelpfulCount: 445,
		},
		{
			ID:       "kb-009",
			Title:    "Vehicle Inspection Checklist",
			Content:  "<h2>Pre-Rental Inspection</h2><p>Before driving off, check:</p><ul><li>Exterior damage (take photos)</li><li>Interior condition</li><li>Fuel level</li><li>Tire condition</li><li>Lights and signals</li><li>Emergency equipment</li></ul><p>Report any issues immediately to avoid liability.</p>",
			Category: "vehicle",
			Views:    412,
			HelpfulCount: 378,
		},
		{
			ID:       "kb-010",
			Title:    "What to Do in Case of Breakdown",
			Content:  "<h2>Vehicle Breakdown</h2><p>If your vehicle breaks down:</p><ol><li>Move to a safe location</li><li>Call our 24/7 support: +234-XXX-XXX-XXXX</li><li>Provide your booking ID and location</li><li>Wait for roadside assistance</li><li>Do not attempt repairs yourself</li></ol><p>Roadside assistance is included in all bookings.</p>",
			Category: "vehicle",
			Views:    156,
			HelpfulCount: 134,
		},

		// Account Category
		{
			ID:       "kb-011",
			Title:    "Creating Your Account",
			Content:  "<h2>Account Setup</h2><p>Create your account in 3 steps:</p><ol><li>Enter your phone number</li><li>Verify OTP code</li><li>Complete KYC verification</li></ol><p>KYC requires: Valid ID, Selfie, Proof of address</p><p>Verification takes 24-48 hours.</p>",
			Category: "account",
			Views:    678,
			HelpfulCount: 589,
		},
		{
			ID:       "kb-012",
			Title:    "Updating Your Profile",
			Content:  "<h2>Profile Management</h2><p>Update your profile information:</p><ul><li>Go to 'My Account'</li><li>Click 'Edit Profile'</li><li>Update details</li><li>Save changes</li></ul><p>You can update: Name, Email, Phone, Address, Payment methods</p>",
			Category: "account",
			Views:    234,
			HelpfulCount: 198,
		},
		{
			ID:       "kb-013",
			Title:    "Account Security Best Practices",
			Content:  "<h2>Secure Your Account</h2><p>Protect your account:</p><ul><li>Use a strong password</li><li>Enable two-factor authentication</li><li>Don't share your login details</li><li>Log out on shared devices</li><li>Review account activity regularly</li></ul><p>Report suspicious activity immediately.</p>",
			Category: "account",
			Views:    345,
			HelpfulCount: 289,
		},

		// Technical Category
		{
			ID:       "kb-014",
			Title:    "Mobile App Features",
			Content:  "<h2>Mobile App</h2><p>Our mobile app offers:</p><ul><li>Quick booking</li><li>Real-time vehicle tracking</li><li>Push notifications</li><li>Digital key access</li><li>In-app support chat</li><li>Offline mode</li></ul><p>Download from App Store or Google Play.</p>",
			Category: "technical",
			Views:    456,
			HelpfulCount: 389,
		},
		{
			ID:       "kb-015",
			Title:    "Troubleshooting Login Issues",
			Content:  "<h2>Login Problems</h2><p>Can't log in? Try these steps:</p><ol><li>Check your internet connection</li><li>Clear browser cache</li><li>Try a different browser</li><li>Reset your password</li><li>Contact support if issue persists</li></ol><p>For OTP issues, wait 60 seconds before requesting a new code.</p>",
			Category: "technical",
			Views:    289,
			HelpfulCount: 234,
		},
	}

	// Insert articles
	for _, article := range articles {
		result := db.Create(&article)
		if result.Error != nil {
			log.Printf("Error creating article %s: %v", article.ID, result.Error)
		} else {
			fmt.Printf("✅ Created article: %s\n", article.Title)
		}
	}

	fmt.Println("\n🎉 Successfully seeded", len(articles), "knowledge base articles!")
}
