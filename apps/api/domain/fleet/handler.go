package fleet

import (
	"github.com/gofiber/fiber/v3"
)

// Mock data to serve the frontend before DB is fully seeded
var mockFleet = []Vehicle{
	{ID: "v-001", Brand: "Toyota", Model: "Corolla Hybrid", Tier: "eco-gig", Status: "available"},
	{ID: "v-003", Brand: "Mercedes", Model: "G63 AMG", Tier: "elite", Status: "rented"},
	{ID: "v-005", Brand: "Mercedes", Model: "Actros", Tier: "heavy-haul", Status: "available"},
}

// SetupRoutes registers the fleet endpoints
func SetupRoutes(router fiber.Router) {
	fleet := router.Group("/fleet")
	fleet.Get("/", GetFleet)
	fleet.Get("/:id", GetVehicle)
	fleet.Get("/:id/detail", GetFleetDetail)
}

// GetFleet returns all vehicles
func GetFleet(c fiber.Ctx) error {
	tier := c.Query("tier")
	
	if tier != "" && tier != "all" {
		var filtered []Vehicle
		for _, v := range mockFleet {
			if v.Tier == tier {
				filtered = append(filtered, v)
			}
		}
		return c.JSON(filtered)
	}

	return c.JSON(mockFleet)
}

// GetVehicle returns a single vehicle
func GetVehicle(c fiber.Ctx) error {
	id := c.Params("id")
	for _, v := range mockFleet {
		if v.ID == id {
			return c.JSON(v)
		}
	}
	return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Vehicle not found"})
}

// GetFleetDetail returns detailed vehicle information
func GetFleetDetail(c fiber.Ctx) error {
	id := c.Params("id")
	for _, v := range mockFleet {
		if v.ID == id {
			return c.JSON(fiber.Map{
				"vehicle":       v,
				"totalBookings": 45,
				"revenue":       125000,
				"utilization":   78,
				"maintenance":   []string{"Oil change - 2024-01-15"},
			})
		}
	}
	return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Vehicle not found"})
}
