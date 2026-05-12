package safehalt

import (
	"github.com/gofiber/fiber/v3"
	"time"
)

type Handler struct {
	engine *Engine
}

func NewHandler(shadowMode bool) *Handler {
	return &Handler{
		engine: NewEngine(shadowMode),
	}
}

type RegisterRentalRequest struct {
	VehicleID   string    `json:"vehicleId"`
	CenterLat   float64   `json:"centerLat"`
	CenterLng   float64   `json:"centerLng"`
	RadiusKm    float64   `json:"radiusKm"`
	StartTime   time.Time `json:"startTime"`
	EndTime     time.Time `json:"endTime"`
}

type TelemetryRequest struct {
	VehicleID string  `json:"vehicleId"`
	Lat       float64 `json:"lat"`
	Lng       float64 `json:"lng"`
	Speed     float64 `json:"speed"`
}

func (h *Handler) RegisterRental(c fiber.Ctx) error {
	var req RegisterRentalRequest
	if err := c.Bind().JSON(&req); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Invalid request"})
	}

	h.engine.RegisterRental(req.VehicleID, req.CenterLat, req.CenterLng, req.RadiusKm, req.StartTime, req.EndTime)
	
	return c.JSON(fiber.Map{
		"success": true,
		"message": "Rental registered for Safe-Halt monitoring",
	})
}

func (h *Handler) ProcessTelemetry(c fiber.Ctx) error {
	var req TelemetryRequest
	if err := c.Bind().JSON(&req); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Invalid request"})
	}

	h.engine.ProcessTelemetry(c.Context(), req.VehicleID, req.Lat, req.Lng, req.Speed)
	
	state, violationType := h.engine.GetVehicleState(req.VehicleID)
	
	return c.JSON(fiber.Map{
		"vehicleId":      req.VehicleID,
		"state":          state,
		"violationType":  violationType,
		"command":        GetCommandForState(state),
		"speedLimit":     GetSpeedLimitForState(state),
		"description":    GetStateDescription(state),
	})
}

func (h *Handler) GetVehicleStatus(c fiber.Ctx) error {
	vehicleID := c.Params("vehicleId")
	
	state, violationType := h.engine.GetVehicleState(vehicleID)
	
	return c.JSON(fiber.Map{
		"vehicleId":     vehicleID,
		"state":         state,
		"violationType": violationType,
		"description":   GetStateDescription(state),
	})
}

func (h *Handler) UnregisterRental(c fiber.Ctx) error {
	vehicleID := c.Params("vehicleId")
	h.engine.UnregisterRental(vehicleID)
	
	return c.JSON(fiber.Map{
		"success": true,
		"message": "Rental unregistered",
	})
}
