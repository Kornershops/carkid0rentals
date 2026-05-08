package auth

import "time"

type KYCStatus string

const (
	KYCPending  KYCStatus = "pending"
	KYCApproved KYCStatus = "approved"
	KYCRejected KYCStatus = "rejected"
)

type User struct {
	ID        string    `json:"id" gorm:"primaryKey;type:uuid;default:gen_random_uuid()"`
	Phone     string    `json:"phone" gorm:"uniqueIndex"`
	Email     string    `json:"email" gorm:"uniqueIndex"`
	FullName  string    `json:"fullName"`
	Role      string    `json:"role" gorm:"default:customer"` // customer, driver, logistics, admin
	KYCStatus KYCStatus `json:"kycStatus" gorm:"default:pending"`
	Country   string    `json:"country"`
	City      string    `json:"city"`
	CreatedAt time.Time `json:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt"`
}

type LoginRequest struct {
	Phone string `json:"phone"`
	Email string `json:"email"`
}

type VerifyOTPRequest struct {
	Phone string `json:"phone"`
	Email string `json:"email"`
	OTP   string `json:"otp"`
}

type KYCSubmission struct {
	FullName    string `json:"fullName"`
	DateOfBirth string `json:"dateOfBirth"`
	Address     string `json:"address"`
	IDType      string `json:"idType"`
	IDFrontURL  string `json:"idFrontUrl"`
	LicenseURL  string `json:"licenseUrl"`
}

type AuthResponse struct {
	Token string `json:"token"`
	User  User   `json:"user"`
}
