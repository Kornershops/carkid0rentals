package safehalt

import (
	"fmt"
	"time"
)

func FormatDuration(d time.Duration) string {
	if d < 0 {
		return "00:00:00"
	}

	hours := int(d.Hours())
	minutes := int(d.Minutes()) % 60
	seconds := int(d.Seconds()) % 60

	if hours > 0 {
		return fmt.Sprintf("%02d:%02d:%02d", hours, minutes, seconds)
	}
	return fmt.Sprintf("%02d:%02d", minutes, seconds)
}

func FormatTimeRemaining(endTime time.Time) string {
	remaining := time.Until(endTime)
	if remaining < 0 {
		return "Expired"
	}

	days := int(remaining.Hours() / 24)
	hours := int(remaining.Hours()) % 24
	minutes := int(remaining.Minutes()) % 60

	if days > 0 {
		return fmt.Sprintf("%dd %dh %dm", days, hours, minutes)
	}
	if hours > 0 {
		return fmt.Sprintf("%dh %dm", hours, minutes)
	}
	return fmt.Sprintf("%dm", minutes)
}

func GetRentalDurationCategory(duration time.Duration) string {
	hours := duration.Hours()
	if hours < 1 {
		return "SHORT"
	}
	if hours < 24 {
		return "MEDIUM"
	}
	return "LONG"
}

func CalculateGracePeriod(duration time.Duration) time.Duration {
	if duration < time.Hour {
		return 5 * time.Minute
	}
	if duration < 24*time.Hour {
		return 15 * time.Minute
	}
	return 30 * time.Minute
}
