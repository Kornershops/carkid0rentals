package drivers

import "time"

type Driver struct {
	ID            string    `json:"id" gorm:"primaryKey;type:uuid;default:gen_random_uuid()"`
	UserID        string    `json:"userId" gorm:"uniqueIndex"`
	LicenseNumber string    `json:"licenseNumber"`
	LicenseExpiry time.Time `json:"licenseExpiry"`
	Experience    int       `json:"experience"`
	VehicleType   string    `json:"vehicleType"`
	Status        string    `json:"status" gorm:"default:pending"`
	CreatedAt     time.Time `json:"createdAt"`
	UpdatedAt     time.Time `json:"updatedAt"`
}

type Document struct {
	ID        string    `json:"id" gorm:"primaryKey;type:uuid;default:gen_random_uuid()"`
	DriverID  string    `json:"driverId" gorm:"index"`
	Type      string    `json:"type"`
	URL       string    `json:"url"`
	Status    string    `json:"status" gorm:"default:pending"`
	CreatedAt time.Time `json:"createdAt"`
}
