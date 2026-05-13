package loyalty

import (
	"crypto/rand"
	"encoding/hex"
	"errors"
	"fmt"
	"time"

	"gorm.io/gorm"
)

type Service struct {
	db *gorm.DB
}

func NewService(db *gorm.DB) *Service {
	return &Service{db: db}
}

// GetOrCreateLoyaltyPoints gets or creates loyalty points for user
func (s *Service) GetOrCreateLoyaltyPoints(userID uint) (*LoyaltyPoints, error) {
	var lp LoyaltyPoints
	err := s.db.Where("user_id = ?", userID).First(&lp).Error
	if err == gorm.ErrRecordNotFound {
		lp = LoyaltyPoints{
			UserID:         userID,
			Points:         0,
			Tier:           "bronze",
			LifetimePoints: 0,
		}
		if err := s.db.Create(&lp).Error; err != nil {
			return nil, err
		}
	} else if err != nil {
		return nil, err
	}
	return &lp, nil
}

// AwardPoints awards points to user and updates tier
func (s *Service) AwardPoints(userID uint, points int, action, reference, description string) error {
	lp, err := s.GetOrCreateLoyaltyPoints(userID)
	if err != nil {
		return err
	}

	// Create transaction
	tx := PointTransaction{
		UserID:      userID,
		Points:      points,
		Type:        "earned",
		Reference:   reference,
		Description: description,
	}
	if err := s.db.Create(&tx).Error; err != nil {
		return err
	}

	// Update points
	lp.Points += points
	lp.LifetimePoints += points
	lp.Tier = GetTierByPoints(lp.LifetimePoints)
	lp.UpdatedAt = time.Now()

	return s.db.Save(lp).Error
}

// RedeemPoints redeems points for a reward
func (s *Service) RedeemPoints(userID uint, rewardID uint) (string, error) {
	lp, err := s.GetOrCreateLoyaltyPoints(userID)
	if err != nil {
		return "", err
	}

	var reward Reward
	if err := s.db.First(&reward, rewardID).Error; err != nil {
		return "", errors.New("reward not found")
	}

	if !reward.Active {
		return "", errors.New("reward not available")
	}

	if lp.Points < reward.PointsRequired {
		return "", errors.New("insufficient points")
	}

	// Deduct points
	lp.Points -= reward.PointsRequired
	lp.UpdatedAt = time.Now()
	if err := s.db.Save(lp).Error; err != nil {
		return "", err
	}

	// Create transaction
	tx := PointTransaction{
		UserID:      userID,
		Points:      -reward.PointsRequired,
		Type:        "redeemed",
		Reference:   fmt.Sprintf("reward_%d", rewardID),
		Description: fmt.Sprintf("Redeemed: %s", reward.Name),
	}
	if err := s.db.Create(&tx).Error; err != nil {
		return "", err
	}

	// Generate reward code
	code := generateRewardCode()
	return code, nil
}

// GetPointsHistory gets user's points transaction history
func (s *Service) GetPointsHistory(userID uint, limit int) ([]PointTransaction, error) {
	var transactions []PointTransaction
	query := s.db.Where("user_id = ?", userID).Order("created_at DESC")
	if limit > 0 {
		query = query.Limit(limit)
	}
	err := query.Find(&transactions).Error
	return transactions, err
}

// GetActiveRewards gets all active rewards
func (s *Service) GetActiveRewards() ([]Reward, error) {
	var rewards []Reward
	err := s.db.Where("active = ?", true).Order("points_required ASC").Find(&rewards).Error
	return rewards, err
}

// GenerateReferralCode generates unique referral code for user
func (s *Service) GenerateReferralCode(userID uint) (*Referral, error) {
	// Check if user already has active code
	var existing Referral
	err := s.db.Where("referrer_id = ? AND status = ?", userID, "pending").First(&existing).Error
	if err == nil {
		return &existing, nil
	}

	code := generateReferralCode()
	referral := Referral{
		ReferrerID: userID,
		Code:       code,
		Status:     "pending",
	}
	if err := s.db.Create(&referral).Error; err != nil {
		return nil, err
	}
	return &referral, nil
}

// ApplyReferralCode applies referral code during signup
func (s *Service) ApplyReferralCode(code string, refereeID uint) error {
	var referral Referral
	if err := s.db.Where("code = ?", code).First(&referral).Error; err != nil {
		return errors.New("invalid referral code")
	}

	if referral.Status != "pending" {
		return errors.New("referral code already used")
	}

	// Update referral
	referral.RefereeID = &refereeID
	referral.Status = "signed_up"
	if err := s.db.Save(&referral).Error; err != nil {
		return err
	}

	// Award signup bonus to referrer
	return s.AwardPoints(referral.ReferrerID, 500, "referral_signup", code, "Friend signed up with your code")
}

// CompleteReferralBooking completes referral when referee makes first booking
func (s *Service) CompleteReferralBooking(refereeID uint) error {
	var referral Referral
	if err := s.db.Where("referee_id = ? AND status = ?", refereeID, "signed_up").First(&referral).Error; err != nil {
		return nil // No referral found, skip
	}

	// Update referral
	now := time.Now()
	referral.Status = "completed"
	referral.CompletedAt = &now
	referral.RewardPoints = 1500 // 1000 for referrer + 500 for referee
	if err := s.db.Save(&referral).Error; err != nil {
		return err
	}

	// Award booking bonus to referrer
	if err := s.AwardPoints(referral.ReferrerID, 1000, "referral_booking", referral.Code, "Friend completed first booking"); err != nil {
		return err
	}

	// Award bonus to referee
	return s.AwardPoints(refereeID, 500, "referral_bonus", referral.Code, "Welcome bonus for using referral code")
}

// GetReferralStats gets referral statistics for user
func (s *Service) GetReferralStats(userID uint) (map[string]interface{}, error) {
	var total, signedUp, completed int64
	s.db.Model(&Referral{}).Where("referrer_id = ?", userID).Count(&total)
	s.db.Model(&Referral{}).Where("referrer_id = ? AND status = ?", userID, "signed_up").Count(&signedUp)
	s.db.Model(&Referral{}).Where("referrer_id = ? AND status = ?", userID, "completed").Count(&completed)

	var totalPoints int
	s.db.Model(&Referral{}).Where("referrer_id = ?", userID).Select("COALESCE(SUM(reward_points), 0)").Scan(&totalPoints)

	return map[string]interface{}{
		"total_referrals":     total,
		"signed_up":           signedUp,
		"completed":           completed,
		"total_points_earned": totalPoints,
	}, nil
}

// Helper functions
func generateReferralCode() string {
	b := make([]byte, 4)
	rand.Read(b)
	return "REF" + hex.EncodeToString(b)[:8]
}

func generateRewardCode() string {
	b := make([]byte, 6)
	rand.Read(b)
	return "RWD" + hex.EncodeToString(b)[:10]
}
