package payments

import (
	"time"

	"gorm.io/gorm"
)

type PaymentStatus string
type PaymentProvider string
type RefundStatus string

const (
	PaymentPending PaymentStatus = "pending"
	PaymentSuccess PaymentStatus = "success"
	PaymentFailed  PaymentStatus = "failed"
	PaymentRefunded PaymentStatus = "refunded"
)

const (
	ProviderPaystack    PaymentProvider = "paystack"
	ProviderFlutterwave PaymentProvider = "flutterwave"
	ProviderStripe      PaymentProvider = "stripe"
)

const (
	RefundPending   RefundStatus = "pending"
	RefundProcessing RefundStatus = "processing"
	RefundCompleted RefundStatus = "completed"
	RefundFailed    RefundStatus = "failed"
)

// Payment represents a payment transaction
type Payment struct {
	ID          string          `json:"id" gorm:"primaryKey;type:uuid;default:gen_random_uuid()"`
	BookingID   string          `json:"bookingId" gorm:"index"`
	UserID      string          `json:"userId" gorm:"index"`
	Amount      int             `json:"amount"` // in smallest currency unit
	Currency    string          `json:"currency"`
	Reference   string          `json:"reference" gorm:"uniqueIndex"`
	Provider    PaymentProvider `json:"provider" gorm:"default:paystack"`
	ProviderRef string          `json:"providerRef"`
	Status      PaymentStatus   `json:"status" gorm:"default:pending"`
	MethodID    *uint           `json:"methodId,omitempty"` // Saved payment method used
	CreatedAt   time.Time       `json:"createdAt"`
	UpdatedAt   time.Time       `json:"updatedAt"`
	DeletedAt   gorm.DeletedAt  `gorm:"index" json:"-"`
}

// PaymentMethod represents a saved payment method
type PaymentMethod struct {
	ID              uint            `gorm:"primarykey" json:"id"`
	UserID          uint            `gorm:"not null;index" json:"user_id"`
	Provider        PaymentProvider `gorm:"not null" json:"provider"`
	Type            string          `gorm:"not null" json:"type"` // card, bank_account
	Last4           string          `json:"last4"`
	Brand           string          `json:"brand"` // visa, mastercard, etc.
	ExpiryMonth     int             `json:"expiry_month,omitempty"`
	ExpiryYear      int             `json:"expiry_year,omitempty"`
	AuthCode        string          `gorm:"not null" json:"-"` // Provider authorization code (encrypted)
	CustomerCode    string          `json:"-"`                 // Provider customer code
	IsDefault       bool            `gorm:"default:false" json:"is_default"`
	Active          bool            `gorm:"default:true" json:"active"`
	CreatedAt       time.Time       `json:"created_at"`
	UpdatedAt       time.Time       `json:"updated_at"`
	DeletedAt       gorm.DeletedAt  `gorm:"index" json:"-"`
}

// PaymentPlan represents an installment payment plan
type PaymentPlan struct {
	ID            uint           `gorm:"primarykey" json:"id"`
	BookingID     string         `gorm:"not null;index" json:"booking_id"`
	UserID        uint           `gorm:"not null;index" json:"user_id"`
	TotalAmount   int            `gorm:"not null" json:"total_amount"`
	Currency      string         `gorm:"not null" json:"currency"`
	Installments  int            `gorm:"not null" json:"installments"` // 3, 6, 12
	AmountPerPlan int            `gorm:"not null" json:"amount_per_plan"`
	PaidCount     int            `gorm:"default:0" json:"paid_count"`
	Status        string         `gorm:"default:active" json:"status"` // active, completed, defaulted
	NextDueDate   time.Time      `json:"next_due_date"`
	CreatedAt     time.Time      `json:"created_at"`
	UpdatedAt     time.Time      `json:"updated_at"`
	DeletedAt     gorm.DeletedAt `gorm:"index" json:"-"`
}

// Refund represents a payment refund
type Refund struct {
	ID          uint           `gorm:"primarykey" json:"id"`
	PaymentID   string         `gorm:"not null;index" json:"payment_id"`
	UserID      uint           `gorm:"not null;index" json:"user_id"`
	Amount      int            `gorm:"not null" json:"amount"`
	Currency    string         `gorm:"not null" json:"currency"`
	Reason      string         `gorm:"type:text" json:"reason"`
	Status      RefundStatus   `gorm:"default:pending" json:"status"`
	ProviderRef string         `json:"provider_ref,omitempty"`
	ProcessedAt *time.Time     `json:"processed_at,omitempty"`
	CreatedAt   time.Time      `json:"created_at"`
	UpdatedAt   time.Time      `json:"updated_at"`
	DeletedAt   gorm.DeletedAt `gorm:"index" json:"-"`
}

// SplitPayment represents a split payment between multiple users
type SplitPayment struct {
	ID            uint           `gorm:"primarykey" json:"id"`
	BookingID     string         `gorm:"not null;index" json:"booking_id"`
	InitiatorID   uint           `gorm:"not null" json:"initiator_id"`
	TotalAmount   int            `gorm:"not null" json:"total_amount"`
	Currency      string         `gorm:"not null" json:"currency"`
	Participants  int            `gorm:"not null" json:"participants"`
	AmountPerUser int            `gorm:"not null" json:"amount_per_user"`
	PaidCount     int            `gorm:"default:0" json:"paid_count"`
	Status        string         `gorm:"default:pending" json:"status"` // pending, partial, completed
	CreatedAt     time.Time      `json:"created_at"`
	UpdatedAt     time.Time      `json:"updated_at"`
	DeletedAt     gorm.DeletedAt `gorm:"index" json:"-"`
}

// SplitPaymentParticipant represents a participant in a split payment
type SplitPaymentParticipant struct {
	ID             uint           `gorm:"primarykey" json:"id"`
	SplitPaymentID uint           `gorm:"not null;index" json:"split_payment_id"`
	UserID         uint           `gorm:"not null;index" json:"user_id"`
	Email          string         `gorm:"not null" json:"email"`
	Amount         int            `gorm:"not null" json:"amount"`
	Paid           bool           `gorm:"default:false" json:"paid"`
	PaymentID      *string        `json:"payment_id,omitempty"`
	PaidAt         *time.Time     `json:"paid_at,omitempty"`
	CreatedAt      time.Time      `json:"created_at"`
	UpdatedAt      time.Time      `json:"updated_at"`
	DeletedAt      gorm.DeletedAt `gorm:"index" json:"-"`
}

// Request/Response DTOs

type InitPaymentRequest struct {
	BookingID string           `json:"bookingId" validate:"required"`
	Provider  *PaymentProvider `json:"provider,omitempty"`
	MethodID  *uint            `json:"methodId,omitempty"` // Use saved method
}

type SavePaymentMethodRequest struct {
	Provider     PaymentProvider `json:"provider" validate:"required"`
	AuthCode     string          `json:"authCode" validate:"required"`
	CustomerCode string          `json:"customerCode,omitempty"`
	Last4        string          `json:"last4" validate:"required"`
	Brand        string          `json:"brand" validate:"required"`
	ExpiryMonth  int             `json:"expiryMonth,omitempty"`
	ExpiryYear   int             `json:"expiryYear,omitempty"`
	IsDefault    bool            `json:"isDefault"`
}

type CreateSplitPaymentRequest struct {
	BookingID    string   `json:"bookingId" validate:"required"`
	Participants []string `json:"participants" validate:"required,min=2"` // Email addresses
}

type CreateInstallmentRequest struct {
	BookingID    string `json:"bookingId" validate:"required"`
	Installments int    `json:"installments" validate:"required,oneof=3 6 12"`
}

type RefundRequest struct {
	PaymentID string `json:"paymentId" validate:"required"`
	Amount    *int   `json:"amount,omitempty"` // Partial refund, nil = full refund
	Reason    string `json:"reason" validate:"required"`
}

type PaystackInitResponse struct {
	AuthorizationURL string `json:"authorizationUrl"`
	Reference        string `json:"reference"`
	AccessCode       string `json:"accessCode"`
}

type PaymentMethodResponse struct {
	ID          uint            `json:"id"`
	Provider    PaymentProvider `json:"provider"`
	Type        string          `json:"type"`
	Last4       string          `json:"last4"`
	Brand       string          `json:"brand"`
	ExpiryMonth int             `json:"expiry_month,omitempty"`
	ExpiryYear  int             `json:"expiry_year,omitempty"`
	IsDefault   bool            `json:"is_default"`
	CreatedAt   time.Time       `json:"created_at"`
}

type PaymentHistoryResponse struct {
	Payments []Payment `json:"payments"`
	Total    int64     `json:"total"`
	Limit    int       `json:"limit"`
	Offset   int       `json:"offset"`
}

// TableName overrides
func (Payment) TableName() string {
	return "payments"
}

func (PaymentMethod) TableName() string {
	return "payment_methods"
}

func (PaymentPlan) TableName() string {
	return "payment_plans"
}

func (Refund) TableName() string {
	return "refunds"
}

func (SplitPayment) TableName() string {
	return "split_payments"
}

func (SplitPaymentParticipant) TableName() string {
	return "split_payment_participants"
}
