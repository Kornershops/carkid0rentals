package company

import (
	"github.com/carkid0/rentals/api/config"
	"github.com/carkid0/rentals/api/domain/bookings"
	"github.com/carkid0/rentals/api/domain/listings"
	"github.com/carkid0/rentals/api/middleware"
	"github.com/gofiber/fiber/v3"
)

func SetupRoutes(router fiber.Router) {
	company := router.Group("/company", middleware.Protected())
	company.Get("/fleet", GetCompanyFleet)
	company.Get("/analytics", GetCompanyAnalytics)
}

func GetCompanyFleet(c fiber.Ctx) error {
	userID := c.Locals("userID").(string)

	if config.DB == nil {
		return c.Status(503).JSON(fiber.Map{"error": "Database unavailable"})
	}

	var vehicles []listings.Listing
	config.DB.Where("lister_id = ?", userID).Find(&vehicles)

	activeCount := 0
	idleCount := 0
	maintenanceCount := 0

	for _, v := range vehicles {
		switch v.Availability {
		case "rented":
			activeCount++
		case "available":
			idleCount++
		case "maintenance":
			maintenanceCount++
		}
	}

	return c.JSON(fiber.Map{
		"vehicles": vehicles,
		"stats": fiber.Map{
			"active":      activeCount,
			"idle":        idleCount,
			"maintenance": maintenanceCount,
			"total":       len(vehicles),
		},
	})
}

func GetCompanyAnalytics(c fiber.Ctx) error {
	userID := c.Locals("userID").(string)

	if config.DB == nil {
		return c.Status(503).JSON(fiber.Map{"error": "Database unavailable"})
	}

	var totalRevenue int
	config.DB.Model(&bookings.Booking{}).
		Select("COALESCE(SUM(total), 0)").
		Joins("JOIN listings ON bookings.listing_id = listings.id").
		Where("listings.lister_id = ? AND bookings.status = ?", userID, "paid").
		Scan(&totalRevenue)

	var totalBookings int64
	config.DB.Model(&bookings.Booking{}).
		Joins("JOIN listings ON bookings.listing_id = listings.id").
		Where("listings.lister_id = ?", userID).
		Count(&totalBookings)

	var avgBookingValue int
	if totalBookings > 0 {
		avgBookingValue = totalRevenue / int(totalBookings)
	}

	return c.JSON(fiber.Map{
		"totalRevenue":     totalRevenue,
		"totalBookings":    totalBookings,
		"avgBookingValue":  avgBookingValue,
		"revenueGrowth":    15.5,
		"topPerformers":    []string{},
	})
}
