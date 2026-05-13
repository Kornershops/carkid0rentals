package bookings

import (
	"time"

	"github.com/gofiber/fiber/v3"
)

type EnhancedHandler struct {
	service *EnhancedService
}

func NewEnhancedHandler(service *EnhancedService) *EnhancedHandler {
	return &EnhancedHandler{service: service}
}

// InstantBook handles instant booking requests
func (h *EnhancedHandler) InstantBook(c fiber.Ctx) error {
	userID := c.Locals("userID").(string)

	var req struct {
		ListingID     string `json:"listingId"`
		StartDate     string `json:"startDate"`
		EndDate       string `json:"endDate"`
		InsuranceType string `json:"insuranceType"`
	}

	if err := c.Bind().JSON(&req); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "invalid request"})
	}

	startDate, _ := time.Parse("2006-01-02", req.StartDate)
	endDate, _ := time.Parse("2006-01-02", req.EndDate)

	booking, err := h.service.InstantBook(userID, req.ListingID, startDate, endDate, req.InsuranceType)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": err.Error()})
	}

	return c.Status(201).JSON(fiber.Map{
		"success": true,
		"booking": booking,
		"message": "Booking confirmed instantly!",
	})
}

// ModifyBooking handles booking modification requests
func (h *EnhancedHandler) ModifyBooking(c fiber.Ctx) error {
	bookingID := c.Params("id")

	var req struct {
		NewStartDate string `json:"newStartDate"`
		NewEndDate   string `json:"newEndDate"`
		Reason       string `json:"reason"`
	}

	if err := c.Bind().JSON(&req); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "invalid request"})
	}

	newStartDate, _ := time.Parse("2006-01-02", req.NewStartDate)
	newEndDate, _ := time.Parse("2006-01-02", req.NewEndDate)

	modification, err := h.service.ModifyBooking(bookingID, newStartDate, newEndDate, req.Reason)
	if err != nil {
		return c.Status(400).JSON(fiber.Map{"error": err.Error()})
	}

	return c.JSON(fiber.Map{
		"success":      true,
		"modification": modification,
		"message":      "Booking modified successfully",
	})
}

// CancelBooking handles booking cancellation
func (h *EnhancedHandler) CancelBooking(c fiber.Ctx) error {
	bookingID := c.Params("id")
	userID := c.Locals("userID").(string)

	var req struct {
		Reason string `json:"reason"`
	}

	if err := c.Bind().JSON(&req); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "invalid request"})
	}

	cancellation, err := h.service.CancelBooking(bookingID, req.Reason, userID)
	if err != nil {
		return c.Status(400).JSON(fiber.Map{"error": err.Error()})
	}

	return c.JSON(fiber.Map{
		"success":       true,
		"cancellation":  cancellation,
		"refundAmount":  cancellation.RefundAmount,
		"message":       "Booking cancelled successfully",
	})
}

// ExtendBooking handles booking extension
func (h *EnhancedHandler) ExtendBooking(c fiber.Ctx) error {
	bookingID := c.Params("id")

	var req struct {
		NewEndDate string `json:"newEndDate"`
	}

	if err := c.Bind().JSON(&req); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "invalid request"})
	}

	newEndDate, _ := time.Parse("2006-01-02", req.NewEndDate)

	if err := h.service.ExtendBooking(bookingID, newEndDate); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": err.Error()})
	}

	return c.JSON(fiber.Map{
		"success": true,
		"message": "Booking extended successfully",
	})
}

// CreatePriceAlert creates a price alert
func (h *EnhancedHandler) CreatePriceAlert(c fiber.Ctx) error {
	userID := c.Locals("userID").(string)

	var req struct {
		ListingID   string `json:"listingId"`
		TargetPrice int    `json:"targetPrice"`
	}

	if err := c.Bind().JSON(&req); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "invalid request"})
	}

	alert, err := h.service.CreatePriceAlert(userID, req.ListingID, req.TargetPrice)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": err.Error()})
	}

	return c.Status(201).JSON(fiber.Map{
		"success": true,
		"alert":   alert,
		"message": "Price alert created. We'll notify you when the price drops!",
	})
}

// GetPriceAlerts gets user's price alerts
func (h *EnhancedHandler) GetPriceAlerts(c fiber.Ctx) error {
	userID := c.Locals("userID").(string)

	alerts, err := h.service.GetPriceAlerts(userID)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": err.Error()})
	}

	return c.JSON(fiber.Map{
		"alerts": alerts,
		"total":  len(alerts),
	})
}

// GetFlexibleDates gets available dates within ±3 days
func (h *EnhancedHandler) GetFlexibleDates(c fiber.Ctx) error {
	listingID := c.Query("listingId")
	targetDate := c.Query("date")

	date, err := time.Parse("2006-01-02", targetDate)
	if err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "invalid date format"})
	}

	dates, err := h.service.GetFlexibleDates(listingID, date)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": err.Error()})
	}

	return c.JSON(fiber.Map{
		"dates": dates,
		"total": len(dates),
	})
}

// GetInsuranceOptions gets available insurance options
func (h *EnhancedHandler) GetInsuranceOptions(c fiber.Ctx) error {
	days := c.QueryInt("days", 1)

	options := h.service.GetInsuranceOptions(days)

	return c.JSON(fiber.Map{
		"options": options,
		"total":   len(options),
	})
}

// GetBookingModifications gets modification history
func (h *EnhancedHandler) GetBookingModifications(c fiber.Ctx) error {
	bookingID := c.Params("id")

	mods, err := h.service.GetBookingModifications(bookingID)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": err.Error()})
	}

	return c.JSON(fiber.Map{
		"modifications": mods,
		"total":         len(mods),
	})
}

// RegisterEnhancedRoutes registers enhanced booking routes
func (h *EnhancedHandler) RegisterEnhancedRoutes(app fiber.Router, authMiddleware fiber.Handler) {
	bookings := app.Group("/api/v1/bookings", authMiddleware)

	bookings.Post("/instant", h.InstantBook)
	bookings.Patch("/:id/modify", h.ModifyBooking)
	bookings.Post("/:id/cancel", h.CancelBooking)
	bookings.Post("/:id/extend", h.ExtendBooking)
	bookings.Get("/:id/modifications", h.GetBookingModifications)

	bookings.Post("/price-alerts", h.CreatePriceAlert)
	bookings.Get("/price-alerts", h.GetPriceAlerts)
	bookings.Get("/flexible-dates", h.GetFlexibleDates)
	bookings.Get("/insurance-options", h.GetInsuranceOptions)
}
