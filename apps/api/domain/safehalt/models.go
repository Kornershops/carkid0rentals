package safehalt

import "time"

type RentalSession struct {
	ID                string    `json:"id" gorm:"primaryKey;type:uuid;default:gen_random_uuid()"`
	BookingID         string    `json:"bookingId" gorm:"index"`
	VehicleID         string    `json:"vehicleId" gorm:"index"`
	UserID            string    `json:"userId" gorm:"index"`
	GeofenceCenterLat float64   `json:"geofenceCenterLat"`
	GeofenceCenterLng float64   `json:"geofenceCenterLng"`
	GeofenceRadius    float64   `json:"geofenceRadius"`
	StartTime         time.Time `json:"startTime"`
	EndTime           time.Time `json:"endTime"`
	CurrentState      string    `json:"currentState" gorm:"default:NORMAL"`
	ViolationType     string    `json:"violationType"`
	HeartbeatInterval int       `json:"heartbeatInterval"`
	IsActive          bool      `json:"isActive" gorm:"default:true;index"`
	CreatedAt         time.Time `json:"createdAt"`
	UpdatedAt         time.Time `json:"updatedAt"`
}

type TelemetryLog struct {
	ID        string    `json:"id" gorm:"primaryKey;type:uuid;default:gen_random_uuid()"`
	VehicleID string    `json:"vehicleId" gorm:"index"`
	SessionID string    `json:"sessionId" gorm:"index"`
	Lat       float64   `json:"lat"`
	Lng       float64   `json:"lng"`
	Speed     float64   `json:"speed"`
	State     string    `json:"state"`
	Distance  float64   `json:"distance"`
	Timestamp time.Time `json:"timestamp" gorm:"index"`
}

type StateTransition struct {
	ID            string    `json:"id" gorm:"primaryKey;type:uuid;default:gen_random_uuid()"`
	VehicleID     string    `json:"vehicleId" gorm:"index"`
	SessionID     string    `json:"sessionId" gorm:"index"`
	FromState     string    `json:"fromState"`
	ToState       string    `json:"toState"`
	ViolationType string    `json:"violationType"`
	Command       string    `json:"command"`
	Executed      bool      `json:"executed"`
	ShadowMode    bool      `json:"shadowMode"`
	Timestamp     time.Time `json:"timestamp" gorm:"index"`
}
