package safehalt

import "time"

type RentalSession struct {
	StartTime time.Time
	EndTime   time.Time
	Duration  time.Duration
}

func NewRentalSession(startTime, endTime time.Time) *RentalSession {
	return &RentalSession{
		StartTime: startTime,
		EndTime:   endTime,
		Duration:  endTime.Sub(startTime),
	}
}

func (rs *RentalSession) IsExpired() bool {
	return time.Now().After(rs.EndTime)
}

func (rs *RentalSession) TimeRemaining() time.Duration {
	remaining := time.Until(rs.EndTime)
	if remaining < 0 {
		return 0
	}
	return remaining
}

func (rs *RentalSession) TimeElapsed() time.Duration {
	return time.Since(rs.StartTime)
}

func (rs *RentalSession) PercentageComplete() float64 {
	if rs.Duration == 0 {
		return 100
	}
	elapsed := rs.TimeElapsed()
	return (float64(elapsed) / float64(rs.Duration)) * 100
}

func (rs *RentalSession) IsNearExpiry(thresholdMinutes int) bool {
	remaining := rs.TimeRemaining()
	return remaining > 0 && remaining <= time.Duration(thresholdMinutes)*time.Minute
}

func (rs *RentalSession) GetExpiryStatus() string {
	if rs.IsExpired() {
		return "EXPIRED"
	}
	if rs.IsNearExpiry(30) {
		return "EXPIRING_SOON"
	}
	return "ACTIVE"
}
