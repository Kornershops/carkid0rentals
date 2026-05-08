package bookings

import (
	"math"
	"time"

	"github.com/carkid0/rentals/api/config"
	"github.com/carkid0/rentals/api/domain/listings"
	"github.com/carkid0/rentals/api/middleware"
	"github.com/gofiber/fiber/v3"
)

func SetupRoutes(router fiber.Router) {
	b := router.Group("/bookings", middleware.Protected())
	b.Post("/", CreateBooking)
	b.Get("/", GetMyBookings)
	b.Get("/:id", GetBooking)
	b.Patch("/:id/status", UpdateStatus)
}

func CreateBooking(c fiber.Ctx) error {
	userID := c.Locals("userID").(string)

	var req CreateBookingRequest
	if err := c.Bind().JSON(&req); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Invalid request"})
	}

	if config.DB == nil {
		return c.Status(503).JSON(fiber.Map{"error": "Database unavailable"})
	}

	// Fetch listing
	var listing listings.Listing
	if err := config.DB.First(&listing, "id = ?", req.ListingID).Error; err != nil {
		return c.Status(404).JSON(fiber.Map{"error": "Listing not found"})
	}

	startDate, _ := time.Parse("2006-01-02", req.StartDate)
	endDate, _ := time.Parse("2006-01-02", req.EndDate)
	days := int(math.Ceil(endDate.Sub(startDate).Hours() / 24))

	if days <= 0 {
		return c.Status(400).JSON(fiber.Map{"error": "Invalid date range"})
	}

	subtotal := listing.PricePerDay * days
	serviceFee := int(math.Round(float64(subtotal) * 0.1))

	currency := "USD"
	switch listing.Country {
	case "Nigeria":
		currency = "NGN"
	case "Kenya":
		currency = "KES"
	case "South Africa":
		currency = "ZAR"
	case "Ghana":
		currency = "GHS"
	}

	// Admin listings auto-confirm, lister listings stay pending
	status := StatusPending
	if listing.ListerRole == "admin" {
		status = StatusConfirmed
	}

	booking := Booking{
		UserID:       userID,
		ListingID:    req.ListingID,
		ListingTitle: listing.Title,
		ListerRole:   listing.ListerRole,
		StartDate:    startDate,
		EndDate:      endDate,
		Days:         days,
		PricePerDay:  listing.PricePerDay,
		Subtotal:     subtotal,
		ServiceFee:   serviceFee,
		Total:        subtotal + serviceFee,
		Currency:     currency,
		Status:       status,
		FullName:     req.FullName,
		Email:        req.Email,
		Phone:        req.Phone,
		Message:      req.Message,
	}

	if err := config.DB.Create(&booking).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to create booking"})
	}

	return c.Status(201).JSON(booking)
}

func GetMyBookings(c fiber.Ctx) error {
	userID := c.Locals("userID").(string)

	if config.DB == nil {
		return c.JSON([]Booking{})
	}

	var bookings []Booking
	config.DB.Where("user_id = ?", userID).Order("created_at DESC").Find(&bookings)
	return c.JSON(bookings)
}

func GetBooking(c fiber.Ctx) error {
	userID := c.Locals("userID").(string)
	id := c.Params("id")

	if config.DB == nil {
		return c.Status(404).JSON(fiber.Map{"error": "Not found"})
	}

	var booking Booking
	if err := config.DB.First(&booking, "id = ? AND user_id = ?", id, userID).Error; err != nil {
		return c.Status(404).JSON(fiber.Map{"error": "Booking not found"})
	}
	return c.JSON(booking)
}

func UpdateStatus(c fiber.Ctx) error {
	id := c.Params("id")

	var body struct {
		Status BookingStatus `json:"status"`
	}
	if err := c.Bind().JSON(&body); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Invalid request"})
	}

	if config.DB == nil {
		return c.Status(503).JSON(fiber.Map{"error": "Database unavailable"})
	}

	result := config.DB.Model(&Booking{}).Where("id = ?", id).Update("status", body.Status)
	if result.RowsAffected == 0 {
		return c.Status(404).JSON(fiber.Map{"error": "Booking not found"})
	}

	return c.JSON(fiber.Map{"status": body.Status})
}
