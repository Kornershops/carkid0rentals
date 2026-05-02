package fleet

import (
	"time"
)

// Vehicle represents the core asset model.
// In a real implementation, we would import a PostGIS Go library for the CurrentLoc field.
type Vehicle struct {
	ID              string    `json:"id" gorm:"primaryKey"`
	Brand           string    `json:"brand"`
	Model           string    `json:"model"`
	Year            int       `json:"year"`
	Tier            string    `json:"tier"` // eco-gig, elite, heavy-haul
	PricePerDay     int       `json:"pricePerDay"`
	Status          string    `json:"status"` // available, rented, maintenance
	EngineHours     float64   `json:"engineHours"` // Used for Heavy Haul
	EstDailyRevenue int       `json:"estDailyRevenue"` // Used for Eco-Gig
	CreatedAt       time.Time `json:"createdAt"`
	UpdatedAt       time.Time `json:"updatedAt"`

	// Mocking PostGIS spatial column for distance calculations
	CurrentLat float64 `json:"currentLat"`
	CurrentLng float64 `json:"currentLng"`
}
