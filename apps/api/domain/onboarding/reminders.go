package onboarding

import (
	"fmt"
	"time"

	"github.com/carkid0/rentals/api/config"
)

type EmailReminder struct {
	ID         string    `json:"id" gorm:"primaryKey;type:uuid;default:gen_random_uuid()"`
	UserID     string    `json:"userId" gorm:"index"`
	Email      string    `json:"email"`
	ReminderType string  `json:"reminderType"` // 24h, 3d, 7d
	SentAt     time.Time `json:"sentAt"`
	CreatedAt  time.Time `json:"createdAt"`
}

// SendOnboardingReminders checks for incomplete onboarding and sends reminders
func SendOnboardingReminders() {
	// Find users with incomplete onboarding
	var incompleteProgress []OnboardingProgress
	config.DB.Where("is_complete = ? AND abandoned_at IS NULL", false).Find(&incompleteProgress)

	for _, progress := range incompleteProgress {
		timeSinceCreation := time.Since(progress.CreatedAt)

		// Send 24-hour reminder
		if timeSinceCreation >= 24*time.Hour && timeSinceCreation < 25*time.Hour {
			if !hasReminderBeenSent(progress.UserID, "24h") {
				sendReminderEmail(progress, "24h")
			}
		}

		// Send 3-day reminder
		if timeSinceCreation >= 3*24*time.Hour && timeSinceCreation < 3*24*time.Hour+1*time.Hour {
			if !hasReminderBeenSent(progress.UserID, "3d") {
				sendReminderEmail(progress, "3d")
			}
		}

		// Send 7-day reminder (final)
		if timeSinceCreation >= 7*24*time.Hour && timeSinceCreation < 7*24*time.Hour+1*time.Hour {
			if !hasReminderBeenSent(progress.UserID, "7d") {
				sendReminderEmail(progress, "7d")
			}
		}
	}
}

func hasReminderBeenSent(userID string, reminderType string) bool {
	var count int64
	config.DB.Model(&EmailReminder{}).
		Where("user_id = ? AND reminder_type = ?", userID, reminderType).
		Count(&count)
	return count > 0
}

func sendReminderEmail(progress OnboardingProgress, reminderType string) {
	// Get user email
	var user struct {
		Email string
	}
	config.DB.Table("users").Select("email").Where("id = ?", progress.UserID).Scan(&user)

	if user.Email == "" {
		return
	}

	// Email content based on reminder type
	subject := ""

	switch reminderType {
	case "24h":
		subject = "Complete Your CarKid0 Rentals Registration"
		fmt.Printf(`
			Hi there!
			
			We noticed you started registering as a %s on CarKid0 Rentals but haven't finished yet.
			
			You're %d%% complete! It only takes a few more minutes to finish.
			
			Continue where you left off: https://carkid0rentals.com/onboarding
			
			Best regards,
			CarKid0 Rentals Team
		`, progress.UserRole, progress.CompletionPercentage)

	case "3d":
		subject = "Don't Miss Out - Complete Your Registration"
		fmt.Printf(`
			Hi there!
			
			Your CarKid0 Rentals registration is still incomplete (%d%% done).
			
			Complete your registration to start %s.
			
			Continue now: https://carkid0rentals.com/onboarding
			
			Need help? Reply to this email.
			
			Best regards,
			CarKid0 Rentals Team
		`, progress.CompletionPercentage, getRoleAction(progress.UserRole))

	case "7d":
		subject = "Last Chance - Complete Your Registration"
		fmt.Printf(`
			Hi there!
			
			This is your final reminder to complete your CarKid0 Rentals registration.
			
			Your progress will expire soon. Don't lose your %d%% progress!
			
			Complete now: https://carkid0rentals.com/onboarding
			
			Best regards,
			CarKid0 Rentals Team
		`, progress.CompletionPercentage)
	}

	// Send email (integrate with your email service)
	// For now, just log
	fmt.Printf("Sending %s reminder to %s: %s\n", reminderType, user.Email, subject)

	// TODO: Integrate with email service (SendGrid, AWS SES, etc.)

	// Record reminder sent
	reminder := EmailReminder{
		UserID:       progress.UserID,
		Email:        user.Email,
		ReminderType: reminderType,
		SentAt:       time.Now(),
	}
	config.DB.Create(&reminder)
}

func getRoleAction(role string) string {
	actions := map[string]string{
		"customer": "renting vehicles",
		"driver":   "earning with gig work",
		"lister":   "listing your vehicles",
		"hauler":   "transporting cargo",
		"company":  "managing your fleet",
	}
	return actions[role]
}

// StartReminderScheduler starts a background job to send reminders
func StartReminderScheduler() {
	ticker := time.NewTicker(1 * time.Hour)
	go func() {
		for range ticker.C {
			SendOnboardingReminders()
		}
	}()
}
