package jobs

import (
	"context"
	"log"
	"time"

	"gorm.io/gorm"
)

type ReportJob struct {
	db *gorm.DB
}

func NewReportJob(db *gorm.DB) *ReportJob {
	return &ReportJob{db: db}
}

func (j *ReportJob) Name() string {
	return "ReportJob"
}

func (j *ReportJob) Schedule() time.Duration {
	return 24 * time.Hour
}

func (j *ReportJob) Run(ctx context.Context) error {
	log.Println("[ReportJob] Generating daily reports...")

	report := j.generateDailyReport(ctx)
	
	if err := j.saveReport(ctx, report); err != nil {
		return err
	}

	log.Printf("[ReportJob] Report generated: %d bookings, %d active rentals, %d violations",
		report.TotalBookings, report.ActiveRentals, report.Violations)
	
	return nil
}

type DailyReport struct {
	Date           time.Time
	TotalBookings  int64
	ActiveRentals  int64
	CompletedTrips int64
	Revenue        float64
	Violations     int64
	NewUsers       int64
	ActiveVehicles int64
}

func (j *ReportJob) generateDailyReport(ctx context.Context) *DailyReport {
	report := &DailyReport{
		Date: time.Now(),
	}

	today := time.Now().Truncate(24 * time.Hour)

	j.db.WithContext(ctx).
		Table("bookings").
		Where("created_at >= ?", today).
		Count(&report.TotalBookings)

	j.db.WithContext(ctx).
		Table("rental_sessions").
		Where("is_active = ?", true).
		Count(&report.ActiveRentals)

	j.db.WithContext(ctx).
		Table("bookings").
		Where("status = ? AND updated_at >= ?", "completed", today).
		Count(&report.CompletedTrips)

	var revenue struct {
		Total float64
	}
	j.db.WithContext(ctx).
		Table("bookings").
		Select("COALESCE(SUM(total), 0) as total").
		Where("status = ? AND updated_at >= ?", "completed", today).
		Scan(&revenue)
	report.Revenue = revenue.Total

	j.db.WithContext(ctx).
		Table("state_transitions").
		Where("to_state IN ? AND timestamp >= ?", []string{"LIMP_MODE_1", "LIMP_MODE_2", "IMMOBILIZED"}, today).
		Count(&report.Violations)

	j.db.WithContext(ctx).
		Table("users").
		Where("created_at >= ?", today).
		Count(&report.NewUsers)

	j.db.WithContext(ctx).
		Table("vehicles").
		Where("status = ?", "available").
		Count(&report.ActiveVehicles)

	return report
}

func (j *ReportJob) saveReport(ctx context.Context, report *DailyReport) error {
	return j.db.WithContext(ctx).
		Table("daily_reports").
		Create(report).Error
}
