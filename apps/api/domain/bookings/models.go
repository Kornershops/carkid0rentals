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
	CreatedAt     time.Time     `json:"createdAt"`
	UpdatedAt     time.Time     `json:"updatedAt"`
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
