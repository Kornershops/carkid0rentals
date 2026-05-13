package bookings

import "time"

type BookingStatus string

const (
	StatusPending   BookingStatus = "pending"
	StatusConfirmed BookingStatus = "confirmed"
	StatusPaid      BookingStatus = "paid"
	StatusActive    BookingStatus = "active"
	StatusCompleted BookingStatus = "completed"
	StatusCancelled BookingStatus = "cancelled"
)

type Booking struct {
	ID            string        `json:"id" gorm:"primaryKey;type:uuid;default:gen_random_uuid()"`
	UserID        string        `json:"userId" gorm:"index"`
	ListingID     string        `json:"listingId"`
	ListingTitle  string        `json:"listingTitle"`
	ListerRole    string        `json:"listerRole"`
	StartDate     time.Time     `json:"startDate"`
	EndDate       time.Time     `json:"endDate"`
	Days          int           `json:"days"`
	PricePerDay   int           `json:"pricePerDay"`
	Subtotal      int           `json:"subtotal"`
	ServiceFee    int           `json:"serviceFee"`
	Total         int           `json:"total"`
	Currency      string        `json:"currency"`
	Status        BookingStatus `json:"status" gorm:"default:pending"`
	PaymentRef    string        `json:"paymentRef"`
	FullName      string        `json:"fullName"`
	Email         string        `json:"email"`
	Phone         string        `json:"phone"`
	Message       string        `json:"message"`
	InstantBook   bool          `json:"instantBook" gorm:"default:false"`
	InsuranceType string        `json:"insuranceType"`
	InsuranceFee  int           `json:"insuranceFee" gorm:"default:0"`
	CreatedAt     time.Time     `json:"createdAt"`
	UpdatedAt     time.Time     `json:"updatedAt"`
}

// PriceAlert represents a user's price alert for a vehicle
type PriceAlert struct {
	ID          uint      `json:"id" gorm:"primaryKey"`
	UserID      string    `json:"userId" gorm:"index"`
	ListingID   string    `json:"listingId" gorm:"index"`
	TargetPrice int       `json:"targetPrice"`
	Active      bool      `json:"active" gorm:"default:true"`
	Triggered   bool      `json:"triggered" gorm:"default:false"`
	CreatedAt   time.Time `json:"createdAt"`
	UpdatedAt   time.Time `json:"updatedAt"`
}

// BookingModification represents a change to an existing booking
type BookingModification struct {
	ID            uint      `json:"id" gorm:"primaryKey"`
	BookingID     string    `json:"bookingId" gorm:"index"`
	OldStartDate  time.Time `json:"oldStartDate"`
	OldEndDate    time.Time `json:"oldEndDate"`
	NewStartDate  time.Time `json:"newStartDate"`
	NewEndDate    time.Time `json:"newEndDate"`
	PriceDiff     int       `json:"priceDiff"`
	Status        string    `json:"status" gorm:"default:pending"` // pending, approved, rejected
	Reason        string    `json:"reason"`
	CreatedAt     time.Time `json:"createdAt"`
}

// BookingCancellation represents a cancelled booking
type BookingCancellation struct {
	ID           uint      `json:"id" gorm:"primaryKey"`
	BookingID    string    `json:"bookingId" gorm:"index"`
	Reason       string    `json:"reason"`
	RefundAmount int       `json:"refundAmount"`
	RefundStatus string    `json:"refundStatus" gorm:"default:pending"` // pending, processed, completed
	CancelledBy  string    `json:"cancelledBy"` // user, lister, admin
	CreatedAt    time.Time `json:"createdAt"`
}

// InsurancePolicy represents insurance options
type InsurancePolicy struct {
	ID          uint      `json:"id" gorm:"primaryKey"`
	BookingID   string    `json:"bookingId" gorm:"index"`
	Type        string    `json:"type"` // basic, premium, full
	Premium     int       `json:"premium"`
	Coverage    int       `json:"coverage"`
	Deductible  int       `json:"deductible"`
	Active      bool      `json:"active" gorm:"default:true"`
	CreatedAt   time.Time `json:"createdAt"`
}

type CreateBookingRequest struct {
	ListingID string `json:"listingId"`
	StartDate string `json:"startDate"`
	EndDate   string `json:"endDate"`
	FullName  string `json:"fullName"`
	Email     string `json:"email"`
	Phone     string `json:"phone"`
	Message   string `json:"message"`
}
