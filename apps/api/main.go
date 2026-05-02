package main

import (
	"log"
	"github.com/carkid0/rentals/api/config"
	"github.com/carkid0/rentals/api/domain/fleet"
	"github.com/carkid0/rentals/api/domain/telemetry"

	"github.com/gofiber/fiber/v3"
)

func main() {
	// 1. Initialize Configuration & DB
	config.ConnectDB()

	// 2. Initialize the Fiber App
	app := fiber.New()

	// 3. Setup Routes
	app.Get("/health", func(c fiber.Ctx) error {
		return c.JSON(fiber.Map{"status": "API Operational", "version": "1.0.0"})
	})

	// Mount Fleet Domain
	fleet.SetupRoutes(app)

	// 4. Initialize the IoT Safe-Halt Engine
	// Running in "Shadow Mode" (true) for the initial 7-day stress test.
	engine := telemetry.NewSafeHaltEngine(true)
	
	// Mock starting the telemetry monitor for an active vehicle
	engine.MonitorVehicle("v-003")

	// 5. Start Server
	log.Println("Starting CarKid0 Backend on port 8080...")
	log.Fatal(app.Listen(":8080"))
}
