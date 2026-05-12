package jobs

import (
	"context"
	"log"
	"time"

	"gorm.io/gorm"
)

type NotificationJob struct {
	db *gorm.DB
}

func NewNotificationJob(db *gorm.DB) *NotificationJob {
	return &NotificationJob{db: db}
}

func (j *NotificationJob) Name() string {
	return "NotificationJob"
}

func (j *NotificationJob) Schedule() time.Duration {
	return 5 * time.Minute
}

func (j *NotificationJob) Run(ctx context.Context) error {
	if err := j.sendExpiryNotifications(ctx); err != nil {
		log.Printf("[NotificationJob] Failed to send expiry notifications: %v", err)
	}

	if err := j.sendViolationAlerts(ctx); err != nil {
		log.Printf("[NotificationJob] Failed to send violation alerts: %v", err)
	}

	return nil
}

type RentalNotification struct {
	SessionID  string
	UserID     string
	VehicleID  string
	EndTime    time.Time
	TimeLeft   time.Duration
	UserPhone  string
	UserEmail  string
}

func (j *NotificationJob) sendExpiryNotifications(ctx context.Context) error {
	now := time.Now()
	threshold := now.Add(30 * time.Minute)

	var sessions []RentalNotification
	err := j.db.WithContext(ctx).
		Table("rental_sessions").
		Select("rental_sessions.id as session_id, rental_sessions.user_id, rental_sessions.vehicle_id, rental_sessions.end_time, users.phone as user_phone, users.email as user_email").
		Joins("JOIN users ON users.id = rental_sessions.user_id").
		Where("rental_sessions.is_active = ? AND rental_sessions.end_time BETWEEN ? AND ?", true, now, threshold).
		Scan(&sessions).Error

	if err != nil {
		return err
	}

	for _, session := range sessions {
		session.TimeLeft = time.Until(session.EndTime)
		j.sendNotification(ctx, session)
	}

	log.Printf("[NotificationJob] Sent %d expiry notifications", len(sessions))
	return nil
}

func (j *NotificationJob) sendViolationAlerts(ctx context.Context) error {
	cutoff := time.Now().Add(-5 * time.Minute)

	var violations []struct {
		VehicleID string
		UserID    string
		State     string
		UserPhone string
	}

	err := j.db.WithContext(ctx).
		Table("state_transitions").
		Select("state_transitions.vehicle_id, rental_sessions.user_id, state_transitions.to_state as state, users.phone as user_phone").
		Joins("JOIN rental_sessions ON rental_sessions.vehicle_id = state_transitions.vehicle_id").
		Joins("JOIN users ON users.id = rental_sessions.user_id").
		Where("state_transitions.to_state IN ? AND state_transitions.timestamp > ?", []string{"WARNING", "LIMP_MODE_1", "LIMP_MODE_2"}, cutoff).
		Where("rental_sessions.is_active = ?", true).
		Scan(&violations).Error

	if err != nil {
		return err
	}

	for _, v := range violations {
		log.Printf("[NotificationJob] Alert: Vehicle %s in state %s for user %s", v.VehicleID, v.State, v.UserID)
	}

	log.Printf("[NotificationJob] Sent %d violation alerts", len(violations))
	return nil
}

func (j *NotificationJob) sendNotification(ctx context.Context, notification RentalNotification) {
	minutes := int(notification.TimeLeft.Minutes())
	log.Printf("[NotificationJob] Sending notification to %s: Rental expires in %d minutes", notification.UserID, minutes)
}
