package telemetry

import "time"

func CalculateHeartbeatInterval(rentalDuration time.Duration) time.Duration {
	hours := rentalDuration.Hours()
	
	if hours < 1 {
		return 5 * time.Second
	}
	if hours < 24 {
		return 30 * time.Second
	}
	return 60 * time.Second
}

func GetHeartbeatCategory(interval time.Duration) string {
	switch interval {
	case 5 * time.Second:
		return "HIGH_FREQUENCY"
	case 30 * time.Second:
		return "MEDIUM_FREQUENCY"
	case 60 * time.Second:
		return "LOW_FREQUENCY"
	default:
		return "CUSTOM"
	}
}

func ShouldAdjustHeartbeat(currentInterval time.Duration, timeRemaining time.Duration) (bool, time.Duration) {
	newInterval := CalculateHeartbeatInterval(timeRemaining)
	if newInterval != currentInterval {
		return true, newInterval
	}
	return false, currentInterval
}
