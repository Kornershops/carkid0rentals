package loyalty

import (
	"time"
)

// LoyaltyPoints represents user's loyalty points and tier
type LoyaltyPoints struct {
	ID             uint      `json:"id" gorm:"primaryKey"`
	UserID         uint      `json:"user_id" gorm:"not null;index"`
	Points         int       `json:"points" gorm:"default:0"`
	Tier           string    `json:"tier" gorm:"default:'bronze'"` // bronze, silver, gold, platinum
	LifetimePoints int       `json:"lifetime_points" gorm:"default:0"`
	CreatedAt      time.Time `json:"created_at"`
	UpdatedAt      time.Time `json:"updated_at"`
}

// PointTransaction represents a points earning/spending transaction
type PointTransaction struct {
	ID          uint      `json:"id" gorm:"primaryKey"`
	UserID      uint      `json:"user_id" gorm:"not null;index"`
	Points      int       `json:"points" gorm:"not null"`
	Type        string    `json:"type" gorm:"not null"` // earned, redeemed, expired
	Reference   string    `json:"reference"`            // booking_id, referral_id, etc.
	Description string    `json:"description"`
	CreatedAt   time.Time `json:"created_at"`
}

// Reward represents a redeemable reward in the catalog
type Reward struct {
	ID             uint      `json:"id" gorm:"primaryKey"`
	Name           string    `json:"name" gorm:"not null"`
	Description    string    `json:"description"`
	PointsRequired int       `json:"points_required" gorm:"not null"`
	Type           string    `json:"type" gorm:"not null"` // discount, voucher, service
	Value          string    `json:"value"`                // 10%, 1_day, etc.
	Active         bool      `json:"active" gorm:"default:true"`
	CreatedAt      time.Time `json:"created_at"`
	UpdatedAt      time.Time `json:"updated_at"`
}

// Referral represents a referral relationship
type Referral struct {
	ID           uint       `json:"id" gorm:"primaryKey"`
	ReferrerID   uint       `json:"referrer_id" gorm:"not null;index"`
	RefereeID    *uint      `json:"referee_id" gorm:"index"`
	Code         string     `json:"code" gorm:"unique;not null"`
	Status       string     `json:"status" gorm:"default:'pending'"` // pending, signed_up, completed
	RewardPoints int        `json:"reward_points" gorm:"default:0"`
	CreatedAt    time.Time  `json:"created_at"`
	CompletedAt  *time.Time `json:"completed_at"`
}

// TierConfig defines tier thresholds and benefits
type TierConfig struct {
	Name         string
	MinPoints    int
	MaxPoints    int
	DiscountRate float64
	Benefits     []string
}

var TierConfigs = []TierConfig{
	{
		Name:         "bronze",
		MinPoints:    0,
		MaxPoints:    5000,
		DiscountRate: 0.05,
		Benefits:     []string{"Basic support", "Points earning"},
	},
	{
		Name:         "silver",
		MinPoints:    5001,
		MaxPoints:    15000,
		DiscountRate: 0.10,
		Benefits:     []string{"Priority support", "10% discount", "Birthday bonus"},
	},
	{
		Name:         "gold",
		MinPoints:    15001,
		MaxPoints:    30000,
		DiscountRate: 0.15,
		Benefits:     []string{"Free upgrades", "15% discount", "Priority booking"},
	},
	{
		Name:         "platinum",
		MinPoints:    30001,
		MaxPoints:    999999,
		DiscountRate: 0.20,
		Benefits:     []string{"Concierge service", "20% discount", "VIP treatment"},
	},
}

// PointsRule defines how points are earned
type PointsRule struct {
	Action      string
	Points      int
	Description string
}

var PointsRules = []PointsRule{
	{"booking_completed", 100, "Complete a booking"},
	{"review_submitted", 50, "Submit a review"},
	{"referral_signup", 500, "Friend signs up with your code"},
	{"referral_booking", 1000, "Friend completes first booking"},
	{"birthday_bonus", 200, "Birthday bonus (annual)"},
	{"profile_complete", 100, "Complete your profile (one-time)"},
	{"first_booking", 200, "First booking bonus (one-time)"},
}

// GetTierByPoints returns the tier name based on points
func GetTierByPoints(points int) string {
	for _, tier := range TierConfigs {
		if points >= tier.MinPoints && points <= tier.MaxPoints {
			return tier.Name
		}
	}
	return "bronze"
}

// GetNextTier returns the next tier and points needed
func GetNextTier(currentPoints int) (string, int) {
	currentTier := GetTierByPoints(currentPoints)
	for i, tier := range TierConfigs {
		if tier.Name == currentTier && i < len(TierConfigs)-1 {
			nextTier := TierConfigs[i+1]
			pointsNeeded := nextTier.MinPoints - currentPoints
			return nextTier.Name, pointsNeeded
		}
	}
	return "platinum", 0 // Already at max tier
}
