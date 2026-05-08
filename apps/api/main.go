package main

import (
	"log"

	"github.com/carkid0/rentals/api/config"
	"github.com/carkid0/rentals/api/domain/auth"
	"github.com/carkid0/rentals/api/domain/bookings"
	"github.com/carkid0/rentals/api/domain/fleet"
	"github.com/carkid0/rentals/api/domain/listings"
	"github.com/carkid0/rentals/api/domain/payments"
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
		)
		log.Println("Database migrations complete")
	}

	app := fiber.New(fiber.Config{
		AppName: "CarKid0 Rentals API",
	})

	// CORS for frontend
	app.Use(cors.New(cors.Config{
		AllowOrigins: []string{"http://localhost:3000", "https://*.netlify.app"},
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
	fleet.SetupRoutes(api)

	// IoT Safe-Halt (shadow mode)
	engine := telemetry.NewSafeHaltEngine(true)
	engine.MonitorVehicle("v-003")

	log.Println("Starting CarKid0 Backend on :8080...")
	log.Fatal(app.Listen(":8080"))
}
