package main

import (
	"log"

	"github.com/carkid0/rentals/api/config"
	"github.com/carkid0/rentals/api/domain/auth"
	"github.com/carkid0/rentals/api/domain/bookings"
	"github.com/carkid0/rentals/api/domain/company"
	"github.com/carkid0/rentals/api/domain/drivers"
	"github.com/carkid0/rentals/api/domain/fleet"
	"github.com/carkid0/rentals/api/domain/hauler"
	"github.com/carkid0/rentals/api/domain/iot"
	"github.com/carkid0/rentals/api/domain/lister"
	"github.com/carkid0/rentals/api/domain/listings"
	"github.com/carkid0/rentals/api/domain/logistics"
	"github.com/carkid0/rentals/api/domain/loyalty"
	"github.com/carkid0/rentals/api/domain/messages"
	"github.com/carkid0/rentals/api/domain/notifications"
	"github.com/carkid0/rentals/api/domain/onboarding"
	"github.com/carkid0/rentals/api/domain/payments"
	"github.com/carkid0/rentals/api/domain/support"
	"github.com/carkid0/rentals/api/domain/telemetry"

	"github.com/gofiber/fiber/v3"
	"github.com/gofiber/fiber/v3/middleware/cors"
)

func main() {
	config.ConnectDB()

	// Auto-migrate models
	if config.DB != nil {
		config.DB.AutoMigrate(
			&auth.User{},
			&listings.Listing{},
			&bookings.Booking{},
			&payments.Payment{},
			&drivers.Driver{},
			&drivers.Document{},
			&lister.Lister{},
			&messages.Conversation{},
			&messages.Message{},
			&notifications.Notification{},
			&notifications.NotificationPreference{},
			&notifications.DeviceToken{},
			&onboarding.OnboardingProgress{},
			&onboarding.EmailReminder{},
			&iot.IoTCommand{},
			&logistics.Delivery{},
			// Enhanced payment models
			&payments.PaymentMethod{},
			&payments.PaymentPlan{},
			&payments.Refund{},
			&payments.SplitPayment{},
			&payments.SplitPaymentParticipant{},
			// Support models
			&support.Ticket{},
			&support.TicketMessage{},
			&support.CannedResponse{},
			&support.KnowledgeBaseArticle{},
			&support.FAQ{},
			&support.LiveChatSession{},
			&support.LiveChatMessage{},
			// Loyalty models
			&loyalty.LoyaltyPoints{},
			&loyalty.PointTransaction{},
			&loyalty.Reward{},
			&loyalty.Referral{},
			// Enhanced booking models
			&bookings.PriceAlert{},
			&bookings.BookingModification{},
			&bookings.BookingCancellation{},
			&bookings.InsurancePolicy{},
		)
		log.Println("Database migrations complete")
	}

	app := fiber.New(fiber.Config{
		AppName: "CarKid0 Rentals API",
	})

	// CORS for frontend
	app.Use(cors.New(cors.Config{
		AllowOrigins: []string{"http://localhost:4200", "https://*.netlify.app"},
		AllowHeaders: []string{"Origin", "Content-Type", "Accept", "Authorization"},
		AllowMethods: []string{"GET", "POST", "PATCH", "DELETE", "OPTIONS"},
	}))

	// Health
	app.Get("/health", func(c fiber.Ctx) error {
		return c.JSON(fiber.Map{"status": "operational", "version": "2.0.0"})
	})

	// Mount domains
	api := app.Group("/api/v1")
	auth.SetupRoutes(api)
	listings.SetupRoutes(api)
	bookings.SetupRoutes(api)
	payments.SetupRoutes(api)
	
	// Enhanced payments
	paymentService := payments.NewService(config.DB)
	paymentHandler := payments.NewHandler(paymentService)
	paymentHandler.RegisterEnhancedRoutes(app)
	
	fleet.SetupRoutes(api)
	lister.SetupRoutes(api)
	drivers.SetupRoutes(api)
	messages.SetupRoutes(api)
	
	// Notifications
	notificationService := notifications.NewService(config.DB)
	notificationHandler := notifications.NewHandler(notificationService)
	notificationHandler.RegisterRoutes(app)
	
	// Support
	supportService := support.NewService(config.DB)
	supportHandler := support.NewHandler(supportService)
	supportHandler.RegisterRoutes(app)
	
	// Loyalty
	loyaltyService := loyalty.NewService(config.DB)
	loyaltyHandler := loyalty.NewHandler(loyaltyService)
	loyaltyHandler.RegisterRoutes(api, auth.JWTMiddleware)
	
	// Enhanced bookings
	enhancedBookingService := bookings.NewEnhancedService(config.DB)
	enhancedBookingHandler := bookings.NewEnhancedHandler(enhancedBookingService)
	enhancedBookingHandler.RegisterEnhancedRoutes(app, auth.JWTMiddleware)
	
	onboarding.SetupRoutes(api)
	company.SetupRoutes(api)
	iot.SetupRoutes(api)
	logistics.SetupRoutes(api)
	hauler.SetupRoutes(api)

	// IoT Safe-Halt (shadow mode)
	engine := telemetry.NewSafeHaltEngine(true)
	engine.MonitorVehicle("v-003")

	// Start onboarding reminder scheduler
	onboarding.StartReminderScheduler()

	log.Println("Starting CarKid0 Backend on :9090...")
	log.Fatal(app.Listen(":9090"))
}
