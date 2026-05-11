package lister

import "time"

type Lister struct {
	ID           string    `json:"id" gorm:"primaryKey;type:uuid;default:gen_random_uuid()"`
	UserID       string    `json:"userId" gorm:"uniqueIndex"`
	BusinessName string    `json:"businessName"`
	BusinessType string    `json:"businessType"`
	TaxID        string    `json:"taxId"`
	Status       string    `json:"status" gorm:"default:pending"`
	CreatedAt    time.Time `json:"createdAt"`
	UpdatedAt    time.Time `json:"updatedAt"`
}
