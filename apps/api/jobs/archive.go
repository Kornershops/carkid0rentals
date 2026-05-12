package jobs

import (
	"context"
	"log"
	"time"

	"gorm.io/gorm"
)

type ArchiveJob struct {
	db *gorm.DB
}

func NewArchiveJob(db *gorm.DB) *ArchiveJob {
	return &ArchiveJob{db: db}
}

func (j *ArchiveJob) Name() string {
	return "ArchiveJob"
}

func (j *ArchiveJob) Schedule() time.Duration {
	return 24 * time.Hour
}

func (j *ArchiveJob) Run(ctx context.Context) error {
	log.Println("[ArchiveJob] Starting archival process...")

	if err := j.archiveTelemetry(ctx); err != nil {
		log.Printf("[ArchiveJob] Failed to archive telemetry: %v", err)
	}

	if err := j.archiveCompletedBookings(ctx); err != nil {
		log.Printf("[ArchiveJob] Failed to archive bookings: %v", err)
	}

	if err := j.archiveStateTransitions(ctx); err != nil {
		log.Printf("[ArchiveJob] Failed to archive state transitions: %v", err)
	}

	log.Println("[ArchiveJob] Archival completed")
	return nil
}

func (j *ArchiveJob) archiveTelemetry(ctx context.Context) error {
	cutoff := time.Now().Add(-30 * 24 * time.Hour)

	var records []map[string]interface{}
	err := j.db.WithContext(ctx).
		Table("telemetry_logs").
		Where("timestamp < ?", cutoff).
		Limit(10000).
		Find(&records).Error

	if err != nil {
		return err
	}

	if len(records) == 0 {
		return nil
	}

	if err := j.db.WithContext(ctx).
		Table("telemetry_logs_archive").
		Create(&records).Error; err != nil {
		return err
	}

	result := j.db.WithContext(ctx).
		Table("telemetry_logs").
		Where("timestamp < ?", cutoff).
		Limit(10000).
		Delete(nil)

	log.Printf("[ArchiveJob] Archived %d telemetry records", result.RowsAffected)
	return nil
}

func (j *ArchiveJob) archiveCompletedBookings(ctx context.Context) error {
	cutoff := time.Now().Add(-180 * 24 * time.Hour)

	var bookings []map[string]interface{}
	err := j.db.WithContext(ctx).
		Table("bookings").
		Where("status = ? AND updated_at < ?", "completed", cutoff).
		Limit(1000).
		Find(&bookings).Error

	if err != nil {
		return err
	}

	if len(bookings) == 0 {
		return nil
	}

	if err := j.db.WithContext(ctx).
		Table("bookings_archive").
		Create(&bookings).Error; err != nil {
		return err
	}

	result := j.db.WithContext(ctx).
		Table("bookings").
		Where("status = ? AND updated_at < ?", "completed", cutoff).
		Limit(1000).
		Delete(nil)

	log.Printf("[ArchiveJob] Archived %d completed bookings", result.RowsAffected)
	return nil
}

func (j *ArchiveJob) archiveStateTransitions(ctx context.Context) error {
	cutoff := time.Now().Add(-90 * 24 * time.Hour)

	var transitions []map[string]interface{}
	err := j.db.WithContext(ctx).
		Table("state_transitions").
		Where("timestamp < ?", cutoff).
		Limit(10000).
		Find(&transitions).Error

	if err != nil {
		return err
	}

	if len(transitions) == 0 {
		return nil
	}

	if err := j.db.WithContext(ctx).
		Table("state_transitions_archive").
		Create(&transitions).Error; err != nil {
		return err
	}

	result := j.db.WithContext(ctx).
		Table("state_transitions").
		Where("timestamp < ?", cutoff).
		Limit(10000).
		Delete(nil)

	log.Printf("[ArchiveJob] Archived %d state transitions", result.RowsAffected)
	return nil
}
