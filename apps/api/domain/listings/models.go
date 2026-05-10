package listings

import "time"

type Listing struct {
	ID           string    `json:"id" gorm:"primaryKey;type:uuid;default:gen_random_uuid()"`
	Title        string    `json:"title"`
	Brand        string    `json:"brand"`
	Model        string    `json:"model"`
	Year         int       `json:"year"`
	Category     string    `json:"category"` // exotic, premium, eco-gig, heavy-haul
	PricePerDay  int       `json:"pricePerDay"`
	Images       []string  `json:"images" gorm:"serializer:json"`
	Location     string    `json:"location"`
	Country      string    `json:"country"`
	Availability string    `json:"availability" gorm:"default:available"`
	Status       string    `json:"status" gorm:"default:pending"` // pending, approved, rejected
	Features     []string  `json:"features" gorm:"serializer:json"`
	IsEV         bool      `json:"isEV"`
	ListerID     string    `json:"listerId"`
	ListerRole   string    `json:"listerRole"` // admin, lister
	ListerName   string    `json:"listerName"`
	CreatedAt    time.Time `json:"createdAt"`
	UpdatedAt    time.Time `json:"updatedAt"`
}

type ListingFilter struct {
	Category string `query:"category"`
	Source   string `query:"source"` // all, admin, lister
	Country  string `query:"country"`
	City     string `query:"city"`
	Page     int    `query:"page"`
	Limit    int    `query:"limit"`
}
