package safehalt

import "time"

type ViolationResult struct {
	HasViolation      bool
	ViolationType     ViolationType
	DistanceFromBoundary float64
	TimeRemaining     time.Duration
	IsExpired         bool
	IsOutOfBounds     bool
	Severity          string
}

type ViolationDetector struct {
	geofence *Geofence
	session  *RentalSession
}

func NewViolationDetector(centerLat, centerLng, radiusKm float64, startTime, endTime time.Time) *ViolationDetector {
	return &ViolationDetector{
		geofence: &Geofence{
			Center: Point{Lat: centerLat, Lng: centerLng},
			Radius: radiusKm,
		},
		session: NewRentalSession(startTime, endTime),
	}
}

func (vd *ViolationDetector) CheckViolation(vehicleLat, vehicleLng float64) *ViolationResult {
	vehiclePoint := Point{Lat: vehicleLat, Lng: vehicleLng}
	
	distanceFromBoundary := vd.geofence.DistanceFromBoundary(vehiclePoint)
	isOutOfBounds := distanceFromBoundary < 0
	isExpired := vd.session.IsExpired()
	timeRemaining := vd.session.TimeRemaining()
	
	result := &ViolationResult{
		DistanceFromBoundary: distanceFromBoundary,
		TimeRemaining:        timeRemaining,
		IsExpired:            isExpired,
		IsOutOfBounds:        isOutOfBounds,
	}
	
	if isOutOfBounds && isExpired {
		result.HasViolation = true
		result.ViolationType = ViolationBoth
		result.Severity = "CRITICAL"
	} else if isOutOfBounds {
		result.HasViolation = true
		result.ViolationType = ViolationGeofence
		result.Severity = "HIGH"
	} else if isExpired {
		result.HasViolation = true
		result.ViolationType = ViolationTime
		result.Severity = "MEDIUM"
	} else {
		result.HasViolation = false
		result.ViolationType = ViolationNone
		result.Severity = "NONE"
	}
	
	return result
}

func (vd *ViolationDetector) GetProximityWarning(vehicleLat, vehicleLng float64) string {
	vehiclePoint := Point{Lat: vehicleLat, Lng: vehicleLng}
	distance := vd.geofence.DistanceFromBoundary(vehiclePoint)
	
	if distance < 0 {
		return "OUT_OF_BOUNDS"
	}
	if distance < 0.5 {
		return "CRITICAL_PROXIMITY"
	}
	if distance < 1.0 {
		return "WARNING_PROXIMITY"
	}
	return "SAFE"
}

func (vd *ViolationDetector) ShouldTriggerAlert(vehicleLat, vehicleLng float64) bool {
	result := vd.CheckViolation(vehicleLat, vehicleLng)
	return result.HasViolation || vd.session.IsNearExpiry(15)
}
