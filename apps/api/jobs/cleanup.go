package jobs

import (
	"context"
	"log"
	"time"

	"gorm.io/gorm"
)

type CleanupJob struct {
	db *gorm.DB
}

func NewCleanupJob(db *gorm.DB) *CleanupJob {
	return &CleanupJob{db: db}
}

func (j *CleanupJob) Name() string {
	return "CleanupJob"
}

func (j *CleanupJob) Schedule() time.Duration {
	return 1 * time.Hour
}

func (j *CleanupJob) Run(ctx context.Context) error {
	log.Println("[CleanupJob] Starting cleanup...")

	if err := j.cleanupExpiredSessions(ctx); err != nil {
		log.Printf("[CleanupJob] Failed to cleanup sessions: %v", err)
	}

	if err := j.cleanupOldTelemetry(ctx); err != nil {
		log.Printf("[CleanupJob] Failed to cleanup telemetry: %v", err)
	}

	if err := j.cleanupOldStateTransitions(ctx); err != nil {
		log.Printf("[CleanupJob] Failed to cleanup state transitions: %v", err)
	}

	if err := j.cleanupCancelledBookings(ctx); err != nil {
		log.Printf("[CleanupJob] Failed to cleanup bookings: %v", err)
	}

	log.Println("[CleanupJob] Cleanup completed")
	return nil
}

func (j *CleanupJob) cleanupExpiredSessions(ctx context.Context) error {
	cutoff := time.Now().Add(-24 * time.Hour)
	
	result := j.db.WithContext(ctx).
		Table("rental_sessions").
		Where("is_active = ? AND end_time < ?", false, cutoff).
		Update("is_active", false)

	log.Printf("[CleanupJob] Deactivated %d expired sessions", result.RowsAffected)
	return result.Error
}

func (j *CleanupJob) cleanupOldTelemetry(ctx context.Context) error {
	cutoff := time.Now().Add(-7 * 24 * time.Hour)
	
	result := j.db.WithContext(ctx).
		Table("telemetry_logs").
		Where("timestamp < ?", cutoff).
		Delete(nil)

	log.Printf("[CleanupJob] Deleted %d old telemetry records", result.RowsAffected)
	return result.Error
}

func (j *CleanupJob) cleanupOldStateTransitions(ctx context.Context) error {
	cutoff := time.Now().Add(-30 * 24 * time.Hour)
	
	result := j.db.WithContext(ctx).
		Table("state_transitions").
		Where("timestamp < ?", cutoff).
		Delete(nil)

	log.Printf("[CleanupJob] Deleted %d old state transitions", result.RowsAffected)
	return result.Error
}

func (j *CleanupJob) cleanupCancelledBookings(ctx context.Context) error {
	cutoff := time.Now().Add(-90 * 24 * time.Hour)
	
	result := j.db.WithContext(ctx).
		Table("bookings").
		Where("status = ? AND updated_at < ?", "cancelled", cutoff).
		Delete(nil)

	log.Printf("[CleanupJob] Deleted %d old cancelled bookings", result.RowsAffected)
	return result.Error
}
