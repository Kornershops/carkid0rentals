package lister

import (
	"time"

	"github.com/carkid0/rentals/api/config"
	"github.com/carkid0/rentals/api/domain/bookings"
	"github.com/carkid0/rentals/api/domain/listings"
	"github.com/carkid0/rentals/api/middleware"
	"github.com/gofiber/fiber/v3"
)

func SetupRoutes(router fiber.Router) {
	lister := router.Group("/lister", middleware.Protected())
	lister.Get("/dashboard", GetListerDashboard)
	lister.Get("/bookings", GetListerBookings)
	lister.Post("/register", RegisterLister)
}

func GetListerDashboard(c fiber.Ctx) error {
	userID := c.Locals("userID").(string)

	if config.DB == nil {
		return c.Status(503).JSON(fiber.Map{"error": "Database unavailable"})
	}

	var listingsCount int64
	config.DB.Model(&listings.Listing{}).Where("lister_id = ?", userID).Count(&listingsCount)

	var activeBookingsCount int64
	config.DB.Model(&bookings.Booking{}).
		Joins("JOIN listings ON bookings.listing_id = listings.id").
		Where("listings.lister_id = ? AND bookings.status IN ?", userID, []string{"confirmed", "paid", "active"}).
		Count(&activeBookingsCount)

	var monthlyRevenue int
	config.DB.Model(&bookings.Booking{}).
		Select("COALESCE(SUM(total), 0)").
		Joins("JOIN listings ON bookings.listing_id = listings.id").
		Where("listings.lister_id = ? AND bookings.status = ? AND bookings.created_at >= ?",
			userID, "paid", time.Now().AddDate(0, -1, 0)).
		Scan(&monthlyRevenue)

	var totalDays int
	config.DB.Model(&bookings.Booking{}).
		Select("COALESCE(SUM(days), 0)").
		Joins("JOIN listings ON bookings.listing_id = listings.id").
		Where("listings.lister_id = ? AND bookings.created_at >= ?",
			userID, time.Now().AddDate(0, -1, 0)).
		Scan(&totalDays)

	utilizationRate := 0
	if listingsCount > 0 {
		utilizationRate = (totalDays * 100) / (int(listingsCount) * 30)
	}

	return c.JSON(fiber.Map{
		"monthlyRevenue":  monthlyRevenue,
		"activeBookings":  activeBookingsCount,
		"fleetSize":       listingsCount,
		"utilizationRate": utilizationRate,
	})
}

func GetListerBookings(c fiber.Ctx) error {
	userID := c.Locals("userID").(string)
	statusFilter := c.Query("status", "all")

	if config.DB == nil {
		return c.JSON([]bookings.Booking{})
	}

	query := config.DB.Model(&bookings.Booking{}).
		Joins("JOIN listings ON bookings.listing_id = listings.id").
		Where("listings.lister_id = ?", userID)

	if statusFilter != "all" {
		query = query.Where("bookings.status = ?", statusFilter)
	}

	var results []bookings.Booking
	query.Order("bookings.created_at DESC").Find(&results)

	return c.JSON(results)
}

func RegisterLister(c fiber.Ctx) error {
	userID := c.Locals("userID").(string)

	var req struct {
		BusinessName string `json:"businessName"`
		BusinessType string `json:"businessType"`
		TaxID        string `json:"taxId"`
	}

	if err := c.Bind().JSON(&req); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Invalid request"})
	}

	if config.DB == nil {
		return c.Status(503).JSON(fiber.Map{"error": "Database unavailable"})
	}

	lister := Lister{
		UserID:       userID,
		BusinessName: req.BusinessName,
		BusinessType: req.BusinessType,
		TaxID:        req.TaxID,
		Status:       "pending",
	}

	config.DB.Create(&lister)

	// Update user role to lister
	config.DB.Exec("UPDATE users SET role = ? WHERE id = ?", "lister", userID)

	return c.Status(201).JSON(lister)
}
