package config

import (
	"time"

	"gorm.io/gorm"
)

type QueryOptimizer struct {
	db *gorm.DB
}

func NewQueryOptimizer(db *gorm.DB) *QueryOptimizer {
	return &QueryOptimizer{db: db}
}

func (q *QueryOptimizer) GetActiveRentals() *gorm.DB {
	return q.db.Where("is_active = ? AND end_time > ?", true, time.Now()).
		Order("end_time ASC")
}

func (q *QueryOptimizer) GetRentalsByVehicle(vehicleID string) *gorm.DB {
	return q.db.Where("vehicle_id = ?", vehicleID).
		Order("created_at DESC")
}

func (q *QueryOptimizer) GetRecentTelemetry(vehicleID string, limit int) *gorm.DB {
	return q.db.Where("vehicle_id = ?", vehicleID).
		Order("timestamp DESC").
		Limit(limit)
}

func (q *QueryOptimizer) GetStateTransitionsBySession(sessionID string) *gorm.DB {
	return q.db.Where("session_id = ?", sessionID).
		Order("timestamp ASC")
}

func (q *QueryOptimizer) GetBookingsByStatus(status string) *gorm.DB {
	return q.db.Where("status = ?", status).
		Order("created_at DESC")
}

func (q *QueryOptimizer) GetBookingsByDateRange(start, end time.Time) *gorm.DB {
	return q.db.Where("start_date >= ? AND end_date <= ?", start, end).
		Order("start_date ASC")
}

func (q *QueryOptimizer) GetAvailableVehicles(tier string) *gorm.DB {
	query := q.db.Where("status = ?", "available")
	if tier != "" {
		query = query.Where("tier = ?", tier)
	}
	return query.Order("price_per_day ASC")
}

func (q *QueryOptimizer) GetUserBookings(userID string, limit int) *gorm.DB {
	return q.db.Where("user_id = ?", userID).
		Order("created_at DESC").
		Limit(limit)
}

func (q *QueryOptimizer) GetUnreadMessages(userID string) *gorm.DB {
	return q.db.Where("receiver_id = ? AND is_read = ?", userID, false).
		Order("created_at DESC")
}

func (q *QueryOptimizer) GetCriticalViolations() *gorm.DB {
	return q.db.Where("to_state IN ?", []string{"LIMP_MODE_2", "IMMOBILIZED"}).
		Where("timestamp > ?", time.Now().Add(-24*time.Hour)).
		Order("timestamp DESC")
}

func ConfigureConnectionPool(db *gorm.DB) error {
	sqlDB, err := db.DB()
	if err != nil {
		return err
	}

	sqlDB.SetMaxIdleConns(10)
	sqlDB.SetMaxOpenConns(100)
	sqlDB.SetConnMaxLifetime(time.Hour)

	return nil
}
