package notifications

import (
	"time"

	"gorm.io/gorm"
)

// Notification represents a notification sent to a user
type Notification struct {
	ID        uint           `gorm:"primarykey" json:"id"`
	UserID    uint           `gorm:"not null;index" json:"user_id"`
	Type      string         `gorm:"not null;index" json:"type"` // booking_confirmed, payment_received, etc.
	Title     string         `gorm:"not null" json:"title"`
	Body      string         `gorm:"not null" json:"body"`
	Data      string         `gorm:"type:jsonb" json:"data"` // Additional metadata
	Read      bool           `gorm:"default:false" json:"read"`
	ReadAt    *time.Time     `json:"read_at,omitempty"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"-"`
}

// NotificationPreference stores user notification preferences
type NotificationPreference struct {
	ID        uint           `gorm:"primarykey" json:"id"`
	UserID    uint           `gorm:"uniqueIndex;not null" json:"user_id"`
	Push      bool           `gorm:"default:true" json:"push"`
	Email     bool           `gorm:"default:true" json:"email"`
	SMS       bool           `gorm:"default:false" json:"sms"`
	InApp     bool           `gorm:"default:true" json:"in_app"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"-"`
}

// DeviceToken stores FCM tokens for push notifications
type DeviceToken struct {
	ID        uint           `gorm:"primarykey" json:"id"`
	UserID    uint           `gorm:"not null;index" json:"user_id"`
	Token     string         `gorm:"not null;uniqueIndex" json:"token"`
	Platform  string         `gorm:"not null" json:"platform"` // ios, android, web
	Active    bool           `gorm:"default:true" json:"active"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"-"`
}

// NotificationType constants
const (
	NotificationTypeBookingConfirmed  = "booking_confirmed"
	NotificationTypePaymentReceived   = "payment_received"
	NotificationTypeVehicleReady      = "vehicle_ready"
	NotificationTypeRentalStarted     = "rental_started"
	NotificationTypeRentalEnded       = "rental_ended"
	NotificationTypeSafeHaltViolation = "safehalt_violation"
	NotificationTypeMessageReceived   = "message_received"
	NotificationTypeReviewRequest     = "review_request"
	NotificationTypePromotional       = "promotional"
)

// Platform constants
const (
	PlatformIOS     = "ios"
	PlatformAndroid = "android"
	PlatformWeb     = "web"
)

// CreateNotificationRequest represents the request to create a notification
type CreateNotificationRequest struct {
	UserID uint   `json:"user_id" validate:"required"`
	Type   string `json:"type" validate:"required"`
	Title  string `json:"title" validate:"required"`
	Body   string `json:"body" validate:"required"`
	Data   string `json:"data,omitempty"`
}

// RegisterDeviceRequest represents the request to register a device token
type RegisterDeviceRequest struct {
	Token    string `json:"token" validate:"required"`
	Platform string `json:"platform" validate:"required,oneof=ios android web"`
}

// UpdatePreferencesRequest represents the request to update notification preferences
type UpdatePreferencesRequest struct {
	Push  *bool `json:"push,omitempty"`
	Email *bool `json:"email,omitempty"`
	SMS   *bool `json:"sms,omitempty"`
	InApp *bool `json:"in_app,omitempty"`
}

// NotificationResponse represents the API response for notifications
type NotificationResponse struct {
	ID        uint      `json:"id"`
	Type      string    `json:"type"`
	Title     string    `json:"title"`
	Body      string    `json:"body"`
	Data      string    `json:"data,omitempty"`
	Read      bool      `json:"read"`
	ReadAt    *time.Time `json:"read_at,omitempty"`
	CreatedAt time.Time `json:"created_at"`
}

// TableName overrides the table name
func (Notification) TableName() string {
	return "notifications"
}

func (NotificationPreference) TableName() string {
	return "notification_preferences"
}

func (DeviceToken) TableName() string {
	return "device_tokens"
}
