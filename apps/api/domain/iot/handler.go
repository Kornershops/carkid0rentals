package iot

import (
	"time"

	"github.com/carkid0/rentals/api/config"
	"github.com/carkid0/rentals/api/middleware"
	"github.com/gofiber/fiber/v3"
)

type IoTCommand struct {
	ID        string    `json:"id" gorm:"primaryKey;type:uuid;default:gen_random_uuid()"`
	VehicleID string    `json:"vehicleId" gorm:"index"`
	Command   string    `json:"command"`
	Status    string    `json:"status" gorm:"default:pending"`
	CreatedAt time.Time `json:"createdAt"`
}

func SetupRoutes(router fiber.Router) {
	iot := router.Group("/iot", middleware.Protected())
	iot.Post("/command", SendCommand)
	iot.Get("/status/:vehicleId", GetVehicleStatus)
}

func SendCommand(c fiber.Ctx) error {
	var req struct {
		VehicleID string `json:"vehicleId"`
		Command   string `json:"command"`
	}

	if err := c.Bind().JSON(&req); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Invalid request"})
	}

	if config.DB == nil {
		return c.Status(503).JSON(fiber.Map{"error": "Database unavailable"})
	}

	command := IoTCommand{
		VehicleID: req.VehicleID,
		Command:   req.Command,
		Status:    "pending",
	}

	config.DB.Create(&command)

	return c.JSON(fiber.Map{
		"commandId": command.ID,
		"status":    "sent",
		"message":   "Command queued for execution",
	})
}

func GetVehicleStatus(c fiber.Ctx) error {
	vehicleID := c.Params("vehicleId")

	return c.JSON(fiber.Map{
		"vehicleId": vehicleID,
		"status":    "active",
		"location": fiber.Map{
			"lat": 6.5244,
			"lng": 3.3792,
		},
		"battery":     85,
		"locked":      true,
		"lastUpdated": time.Now(),
	})
}
