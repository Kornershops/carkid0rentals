package onboarding

import (
	"time"

	"github.com/gofiber/fiber/v3"
	"github.com/carkid0/rentals/api/config"
)

type OnboardingProgress struct {
	ID                   string     `json:"id" gorm:"primaryKey;type:uuid;default:gen_random_uuid()"`
	UserID               string     `json:"userId" gorm:"index"`
	SessionID            string     `json:"sessionId"`
	UserRole             string     `json:"userRole"`
	RoleSubType          string     `json:"roleSubType"`
	CurrentStage         string     `json:"currentStage"`
	CompletionPercentage int        `json:"completionPercentage"`
	IsComplete           bool       `json:"isComplete" gorm:"default:false"`
	AbandonedAt          *time.Time `json:"abandonedAt"`
	CreatedAt            time.Time  `json:"createdAt"`
	UpdatedAt            time.Time  `json:"updatedAt"`
	ExpiresAt            time.Time  `json:"expiresAt"`
}

func SaveProgress(c fiber.Ctx) error {
	userID := c.Locals("userID").(string)

	var req OnboardingProgress
	if err := c.Bind().JSON(&req); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Invalid request"})
	}

	var existing OnboardingProgress
	result := config.DB.Where("user_id = ?", userID).First(&existing)

	if result.Error != nil {
		req.UserID = userID
		config.DB.Create(&req)
		return c.Status(201).JSON(req)
	}

	existing.SessionID = req.SessionID
	existing.UserRole = req.UserRole
	existing.RoleSubType = req.RoleSubType
	existing.CurrentStage = req.CurrentStage
	existing.CompletionPercentage = req.CompletionPercentage
	existing.IsComplete = req.IsComplete
	existing.AbandonedAt = req.AbandonedAt
	existing.UpdatedAt = time.Now()
	existing.ExpiresAt = req.ExpiresAt

	config.DB.Save(&existing)

	return c.JSON(existing)
}

func GetProgress(c fiber.Ctx) error {
	userID := c.Locals("userID").(string)

	var progress OnboardingProgress
	if err := config.DB.Where("user_id = ?", userID).First(&progress).Error; err != nil {
		return c.Status(404).JSON(fiber.Map{"error": "No progress found"})
	}

	if time.Now().After(progress.ExpiresAt) {
		config.DB.Delete(&progress)
		return c.Status(404).JSON(fiber.Map{"error": "Progress expired"})
	}

	return c.JSON(progress)
}

func DeleteProgress(c fiber.Ctx) error {
	userID := c.Locals("userID").(string)
	config.DB.Where("user_id = ?", userID).Delete(&OnboardingProgress{})
	return c.JSON(fiber.Map{"message": "Progress deleted"})
}

func GetAnalytics(c fiber.Ctx) error {
	role := c.Locals("role").(string)
	if role != "admin" {
		return c.Status(403).JSON(fiber.Map{"error": "Unauthorized"})
	}

	var totalInProgress int64
	config.DB.Model(&OnboardingProgress{}).Where("is_complete = ?", false).Count(&totalInProgress)

	var totalCompleted int64
	config.DB.Model(&OnboardingProgress{}).Where("is_complete = ?", true).Count(&totalCompleted)

	var totalAbandoned int64
	config.DB.Model(&OnboardingProgress{}).Where("abandoned_at IS NOT NULL").Count(&totalAbandoned)

	var avgCompletion float64
	config.DB.Model(&OnboardingProgress{}).
		Where("is_complete = ?", false).
		Select("AVG(completion_percentage)").
		Scan(&avgCompletion)

	var roleBreakdown []struct {
		UserRole string `json:"userRole"`
		Count    int64  `json:"count"`
	}
	config.DB.Model(&OnboardingProgress{}).
		Select("user_role, COUNT(*) as count").
		Group("user_role").
		Scan(&roleBreakdown)

	var stageBreakdown []struct {
		CurrentStage string `json:"currentStage"`
		Count        int64  `json:"count"`
	}
	config.DB.Model(&OnboardingProgress{}).
		Where("is_complete = ?", false).
		Select("current_stage, COUNT(*) as count").
		Group("current_stage").
		Scan(&stageBreakdown)

	return c.JSON(fiber.Map{
		"totalInProgress": totalInProgress,
		"totalCompleted":  totalCompleted,
		"totalAbandoned":  totalAbandoned,
		"avgCompletion":   avgCompletion,
		"roleBreakdown":   roleBreakdown,
		"stageBreakdown":  stageBreakdown,
	})
}
