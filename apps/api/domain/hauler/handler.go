package hauler

import (
	"github.com/carkid0/rentals/api/config"
	"github.com/carkid0/rentals/api/domain/bookings"
	"github.com/carkid0/rentals/api/domain/listings"
	"github.com/carkid0/rentals/api/middleware"
	"github.com/gofiber/fiber/v3"
)

func SetupRoutes(router fiber.Router) {
	hauler := router.Group("/hauler", middleware.Protected())
	hauler.Get("/dashboard", GetHaulerDashboard)
	hauler.Get("/vehicles", GetAvailableVehicles)
	hauler.Post("/book", CreateHaulerBooking)
}

func GetHaulerDashboard(c fiber.Ctx) error {
	userID := c.Locals("userID").(string)

	if config.DB == nil {
		return c.Status(503).JSON(fiber.Map{"error": "Database unavailable"})
	}

	var activeJobs int64
	config.DB.Model(&bookings.Booking{}).
		Where("user_id = ? AND status IN ?", userID, []string{"confirmed", "active"}).
		Count(&activeJobs)

	var totalEarnings int
	config.DB.Model(&bookings.Booking{}).
		Select("COALESCE(SUM(total), 0)").
		Where("user_id = ? AND status = ?", userID, "paid").
		Scan(&totalEarnings)

	return c.JSON(fiber.Map{
		"activeJobs":     activeJobs,
		"totalEarnings":  totalEarnings,
		"availableLoads": 12,
		"rating":         4.8,
	})
}

func GetAvailableVehicles(c fiber.Ctx) error {
	if config.DB == nil {
		return c.JSON([]listings.Listing{})
	}

	var vehicles []listings.Listing
	config.DB.Where("category = ? AND availability = ?", "heavy-haul", "available").Find(&vehicles)

	return c.JSON(vehicles)
}

func CreateHaulerBooking(c fiber.Ctx) error {
	userID := c.Locals("userID").(string)

	var req bookings.CreateBookingRequest
	if err := c.Bind().JSON(&req); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Invalid request"})
	}

	if config.DB == nil {
		return c.Status(503).JSON(fiber.Map{"error": "Database unavailable"})
	}

	var listing listings.Listing
	if err := config.DB.First(&listing, "id = ?", req.ListingID).Error; err != nil {
		return c.Status(404).JSON(fiber.Map{"error": "Vehicle not found"})
	}

	booking := bookings.Booking{
		UserID:       userID,
		ListingID:    req.ListingID,
		ListingTitle: listing.Title,
		Status:       bookings.StatusConfirmed,
		FullName:     req.FullName,
		Email:        req.Email,
		Phone:        req.Phone,
	}

	config.DB.Create(&booking)

	return c.Status(201).JSON(booking)
}
