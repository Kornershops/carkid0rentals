package main

import (
	"fmt"
	"log"
	"time"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

type FAQ struct {
	ID        string    `gorm:"primaryKey"`
	Question  string    `gorm:"not null"`
	Answer    string    `gorm:"type:text;not null"`
	Category  string    `gorm:"not null"`
	Views     int       `gorm:"default:0"`
	CreatedAt time.Time
	UpdatedAt time.Time
}

func main() {
	// Database connection
	dsn := "host=localhost user=admin password=password dbname=carkid0_rentals port=5432 sslmode=disable"
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}

	// Auto-migrate
	db.AutoMigrate(&FAQ{})

	// Sample FAQs
	faqs := []FAQ{
		// Booking FAQs
		{
			ID:       "faq-001",
			Question: "What is the minimum rental period?",
			Answer:   "The minimum rental period is 24 hours. You can book for as long as you need, with daily, weekly, and monthly rates available.",
			Category: "booking",
			Views:    567,
		},
		{
			ID:       "faq-002",
			Question: "Can I extend my booking?",
			Answer:   "Yes! You can extend your booking through the app or by contacting support. Extensions are subject to vehicle availability and must be requested at least 4 hours before your original return time.",
			Category: "booking",
			Views:    423,
		},
		{
			ID:       "faq-003",
			Question: "What happens if I return the vehicle late?",
			Answer:   "Late returns incur a fee of ₦500 per hour for the first 2 hours, then ₦1,000 per hour thereafter. If you're more than 4 hours late without notification, additional penalties may apply.",
			Category: "booking",
			Views:    389,
		},
		{
			ID:       "faq-004",
			Question: "Can I book a vehicle for someone else?",
			Answer:   "Yes, but the driver must be registered on our platform and meet all requirements (valid license, KYC verification). You can add them as an additional driver during booking.",
			Category: "booking",
			Views:    234,
		},
		{
			ID:       "faq-005",
			Question: "Do you offer airport pickup/delivery?",
			Answer:   "Yes! We offer airport pickup and delivery for an additional fee of ₦5,000-₦10,000 depending on the airport. Select this option during booking.",
			Category: "booking",
			Views:    456,
		},

		// Payment FAQs
		{
			ID:       "faq-006",
			Question: "When will I be charged?",
			Answer:   "Your payment is processed immediately upon booking confirmation. For installment plans, the first payment is due at booking, with subsequent payments on the agreed schedule.",
			Category: "payment",
			Views:    678,
		},
		{
			ID:       "faq-007",
			Question: "Is there a security deposit?",
			Answer:   "Yes, a refundable security deposit of ₦20,000-₦100,000 (depending on vehicle category) is required. It's refunded within 5-7 business days after vehicle return, subject to inspection.",
			Category: "payment",
			Views:    789,
		},
		{
			ID:       "faq-008",
			Question: "What payment methods do you accept?",
			Answer:   "We accept credit/debit cards (Visa, Mastercard, Verve), bank transfers, and mobile money through Paystack, Flutterwave, and Stripe.",
			Category: "payment",
			Views:    534,
		},
		{
			ID:       "faq-009",
			Question: "Can I get a receipt for my booking?",
			Answer:   "Yes! A digital receipt is automatically sent to your email after payment. You can also download receipts from your booking history in the app.",
			Category: "payment",
			Views:    345,
		},
		{
			ID:       "faq-010",
			Question: "Are there any hidden fees?",
			Answer:   "No hidden fees! All costs are clearly displayed before booking: rental rate, insurance, taxes, and any optional add-ons. What you see is what you pay.",
			Category: "payment",
			Views:    612,
		},

		// Vehicle FAQs
		{
			ID:       "faq-011",
			Question: "What's included in the rental?",
			Answer:   "All rentals include: comprehensive insurance, 24/7 roadside assistance, basic maintenance, and 200km daily mileage allowance. Additional mileage is ₦50/km.",
			Category: "vehicle",
			Views:    890,
		},
		{
			ID:       "faq-012",
			Question: "Can I drive outside the state?",
			Answer:   "Yes, interstate travel is allowed. Please notify us in advance and ensure you have the required documentation. Additional insurance may apply for certain states.",
			Category: "vehicle",
			Views:    456,
		},
		{
			ID:       "faq-013",
			Question: "What if the vehicle is damaged?",
			Answer:   "Report any damage immediately. Our comprehensive insurance covers most damages (excess applies). You're responsible for damages caused by negligence or policy violations.",
			Category: "vehicle",
			Views:    567,
		},
		{
			ID:       "faq-014",
			Question: "Are pets allowed in the vehicle?",
			Answer:   "Pets are allowed in Eco-Gig and Heavy-Haul categories with prior approval and a ₦5,000 cleaning fee. Pets must be in carriers. Not allowed in Exotic/Premium vehicles.",
			Category: "vehicle",
			Views:    123,
		},
		{
			ID:       "faq-015",
			Question: "What fuel policy do you have?",
			Answer:   "Vehicles are provided with a full tank and must be returned with a full tank. If not, a refueling fee of ₦200/liter plus ₦5,000 service charge applies.",
			Category: "vehicle",
			Views:    678,
		},

		// Account FAQs
		{
			ID:       "faq-016",
			Question: "What documents do I need to rent?",
			Answer:   "You need: Valid driver's license (minimum 2 years), government-issued ID (passport/national ID), proof of address, and a selfie for verification.",
			Category: "account",
			Views:    923,
		},
		{
			ID:       "faq-017",
			Question: "How long does KYC verification take?",
			Answer:   "KYC verification typically takes 24-48 hours. You'll receive an email and SMS notification once approved. Urgent verifications can be expedited for a fee.",
			Category: "account",
			Views:    567,
		},
		{
			ID:       "faq-018",
			Question: "Can I have multiple drivers on one booking?",
			Answer:   "Yes! You can add up to 3 additional drivers per booking. Each driver must be registered, verified, and meet all requirements. Additional driver fee: ₦2,000 per driver.",
			Category: "account",
			Views:    345,
		},
		{
			ID:       "faq-019",
			Question: "How do I delete my account?",
			Answer:   "To delete your account, go to Settings → Account → Delete Account. Note: This action is permanent and cannot be undone. All data will be deleted within 30 days.",
			Category: "account",
			Views:    89,
		},
		{
			ID:       "faq-020",
			Question: "What is the loyalty program?",
			Answer:   "Earn points on every booking! Points can be redeemed for discounts, free upgrades, and exclusive perks. 4 tiers: Bronze, Silver, Gold, Platinum with increasing benefits.",
			Category: "account",
			Views:    456,
		},

		// General FAQs
		{
			ID:       "faq-021",
			Question: "What are your operating hours?",
			Answer:   "Our platform is available 24/7 for bookings. Customer support is available 9am-9pm daily. Emergency roadside assistance is available 24/7.",
			Category: "general",
			Views:    678,
		},
		{
			ID:       "faq-022",
			Question: "Do you offer corporate accounts?",
			Answer:   "Yes! We offer corporate accounts with volume discounts, dedicated account managers, and flexible billing. Contact sales@carkid0rentals.com for details.",
			Category: "general",
			Views:    234,
		},
		{
			ID:       "faq-023",
			Question: "What insurance coverage is included?",
			Answer:   "All rentals include comprehensive insurance covering: collision damage, theft, third-party liability (up to ₦5M), and personal accident cover (up to ₦1M).",
			Category: "general",
			Views:    789,
		},
		{
			ID:       "faq-024",
			Question: "Can I smoke in the vehicle?",
			Answer:   "No, all our vehicles are non-smoking. Smoking in the vehicle will result in a ₦20,000 deep cleaning fee and may affect your security deposit.",
			Category: "general",
			Views:    156,
		},
		{
			ID:       "faq-025",
			Question: "What happens in case of an accident?",
			Answer:   "In case of an accident: 1) Ensure everyone's safety, 2) Call emergency services if needed, 3) Contact us immediately, 4) Don't admit fault, 5) Take photos, 6) Get police report.",
			Category: "general",
			Views:    345,
		},
		{
			ID:       "faq-026",
			Question: "Do you have a mobile app?",
			Answer:   "Yes! Download our app from the App Store (iOS) or Google Play (Android). The app offers faster booking, digital keys, real-time tracking, and exclusive app-only deals.",
			Category: "general",
			Views:    567,
		},
		{
			ID:       "faq-027",
			Question: "What is your cancellation policy?",
			Answer:   "Free cancellation up to 24 hours before pickup (100% refund). 48 hours: 75% refund. 72 hours: 50% refund. Less than 72 hours: No refund. Refunds processed in 5-7 days.",
			Category: "general",
			Views:    890,
		},
		{
			ID:       "faq-028",
			Question: "Can I modify my booking after confirmation?",
			Answer:   "Yes, you can modify dates, vehicle, or pickup location up to 24 hours before pickup. Changes may affect pricing. Modifications are free if made more than 48 hours in advance.",
			Category: "general",
			Views:    456,
		},
		{
			ID:       "faq-029",
			Question: "Do you offer long-term rentals?",
			Answer:   "Yes! We offer discounted rates for weekly (7+ days) and monthly (30+ days) rentals. Contact us for custom long-term rental packages with flexible terms.",
			Category: "general",
			Views:    378,
		},
		{
			ID:       "faq-030",
			Question: "How do I contact customer support?",
			Answer:   "Contact us via: In-app chat (fastest), Email: support@carkid0rentals.com, Phone: +234-XXX-XXX-XXXX (9am-9pm), Emergency: +234-XXX-XXX-XXXX (24/7).",
			Category: "general",
			Views:    612,
		},
	}

	// Insert FAQs
	for _, faq := range faqs {
		result := db.Create(&faq)
		if result.Error != nil {
			log.Printf("Error creating FAQ %s: %v", faq.ID, faq.Error)
		} else {
			fmt.Printf("✅ Created FAQ: %s\n", faq.Question)
		}
	}

	fmt.Println("\n🎉 Successfully seeded", len(faqs), "FAQs!")
	fmt.Println("\nFAQs by category:")
	fmt.Println("- Booking: 5 FAQs")
	fmt.Println("- Payment: 5 FAQs")
	fmt.Println("- Vehicle: 5 FAQs")
	fmt.Println("- Account: 5 FAQs")
	fmt.Println("- General: 10 FAQs")
}
