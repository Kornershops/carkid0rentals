package logistics

import (
	"time"

	"github.com/carkid0/rentals/api/config"
	"github.com/carkid0/rentals/api/middleware"
	"github.com/gofiber/fiber/v3"
)

type Delivery struct {
	ID          string    `json:"id" gorm:"primaryKey;type:uuid;default:gen_random_uuid()"`
	UserID      string    `json:"userId" gorm:"index"`
	VehicleID   string    `json:"vehicleId"`
	Origin      string    `json:"origin"`
	Destination string    `json:"destination"`
	Status      string    `json:"status" gorm:"default:pending"`
	Distance    float64   `json:"distance"`
	Price       int       `json:"price"`
	CreatedAt   time.Time `json:"createdAt"`
}

func SetupRoutes(router fiber.Router) {
	logistics := router.Group("/logistics", middleware.Protected())
	logistics.Get("/deliveries", GetDeliveries)
	logistics.Post("/deliveries", CreateDelivery)
}

func GetDeliveries(c fiber.Ctx) error {
	userID := c.Locals("userID").(string)

	if config.DB == nil {
		return c.JSON([]Delivery{})
	}

	var deliveries []Delivery
	config.DB.Where("user_id = ?", userID).Order("created_at DESC").Find(&deliveries)

	return c.JSON(deliveries)
}

func CreateDelivery(c fiber.Ctx) error {
	userID := c.Locals("userID").(string)

	var req struct {
		VehicleID   string  `json:"vehicleId"`
		Origin      string  `json:"origin"`
		Destination string  `json:"destination"`
		Distance    float64 `json:"distance"`
	}

	if err := c.Bind().JSON(&req); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Invalid request"})
	}

	if config.DB == nil {
		return c.Status(503).JSON(fiber.Map{"error": "Database unavailable"})
	}

	price := int(req.Distance * 500)

	delivery := Delivery{
		UserID:      userID,
		VehicleID:   req.VehicleID,
		Origin:      req.Origin,
		Destination: req.Destination,
		Distance:    req.Distance,
		Price:       price,
		Status:      "pending",
	}

	config.DB.Create(&delivery)

	return c.Status(201).JSON(delivery)
}
