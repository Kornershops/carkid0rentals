package jobs

import (
	"context"
	"log"
	"time"

	"gorm.io/gorm"
)

type HealthCheckJob struct {
	db *gorm.DB
}

func NewHealthCheckJob(db *gorm.DB) *HealthCheckJob {
	return &HealthCheckJob{db: db}
}

func (j *HealthCheckJob) Name() string {
	return "HealthCheckJob"
}

func (j *HealthCheckJob) Schedule() time.Duration {
	return 1 * time.Minute
}

func (j *HealthCheckJob) Run(ctx context.Context) error {
	health := j.checkSystemHealth(ctx)
	
	if !health.Healthy {
		log.Printf("[HealthCheckJob] ALERT: System unhealthy - %s", health.Issues)
	}

	return nil
}

type SystemHealth struct {
	Healthy            bool
	DatabaseConnected  bool
	ActiveRentals      int64
	StuckSessions      int64
	CriticalViolations int64
	Issues             string
}

func (j *HealthCheckJob) checkSystemHealth(ctx context.Context) *SystemHealth {
	health := &SystemHealth{
		Healthy:           true,
		DatabaseConnected: true,
	}

	if err := j.db.WithContext(ctx).Exec("SELECT 1").Error; err != nil {
		health.Healthy = false
		health.DatabaseConnected = false
		health.Issues = "Database connection failed"
		return health
	}

	j.db.WithContext(ctx).
		Table("rental_sessions").
		Where("is_active = ?", true).
		Count(&health.ActiveRentals)

	cutoff := time.Now().Add(-2 * time.Hour)
	j.db.WithContext(ctx).
		Table("rental_sessions").
		Where("is_active = ? AND end_time < ?", true, cutoff).
		Count(&health.StuckSessions)

	if health.StuckSessions > 0 {
		health.Healthy = false
		health.Issues = "Stuck rental sessions detected"
		log.Printf("[HealthCheckJob] WARNING: %d stuck sessions", health.StuckSessions)
	}

	recentCutoff := time.Now().Add(-5 * time.Minute)
	j.db.WithContext(ctx).
		Table("state_transitions").
		Where("to_state = ? AND timestamp > ?", "IMMOBILIZED", recentCutoff).
		Count(&health.CriticalViolations)

	if health.CriticalViolations > 5 {
		health.Healthy = false
		health.Issues = "High number of critical violations"
		log.Printf("[HealthCheckJob] WARNING: %d critical violations in last 5 minutes", health.CriticalViolations)
	}

	return health
}
