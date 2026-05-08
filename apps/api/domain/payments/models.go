package payments

import "time"

type PaymentStatus string

const (
	PaymentPending PaymentStatus = "pending"
	PaymentSuccess PaymentStatus = "success"
	PaymentFailed  PaymentStatus = "failed"
)

type Payment struct {
	ID          string        `json:"id" gorm:"primaryKey;type:uuid;default:gen_random_uuid()"`
	BookingID   string        `json:"bookingId" gorm:"index"`
	UserID      string        `json:"userId"`
	Amount      int           `json:"amount"` // in smallest currency unit (kobo, cents)
	Currency    string        `json:"currency"`
	Reference   string        `json:"reference" gorm:"uniqueIndex"`
	PaystackRef string        `json:"paystackRef"`
	Status      PaymentStatus `json:"status" gorm:"default:pending"`
	CreatedAt   time.Time     `json:"createdAt"`
	UpdatedAt   time.Time     `json:"updatedAt"`
}

type InitPaymentRequest struct {
	BookingID string `json:"bookingId"`
}

type PaystackInitResponse struct {
	AuthorizationURL string `json:"authorizationUrl"`
	Reference        string `json:"reference"`
	AccessCode       string `json:"accessCode"`
}
