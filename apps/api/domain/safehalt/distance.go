package safehalt

import "math"

func CalculateDistanceToBoundary(vehicleLat, vehicleLng, centerLat, centerLng, radiusKm float64) float64 {
	vehicle := Point{Lat: vehicleLat, Lng: vehicleLng}
	center := Point{Lat: centerLat, Lng: centerLng}
	geofence := Geofence{Center: center, Radius: radiusKm}
	return geofence.DistanceFromBoundary(vehicle)
}

func IsVehicleOutOfBounds(vehicleLat, vehicleLng, centerLat, centerLng, radiusKm float64) bool {
	distance := CalculateDistanceToBoundary(vehicleLat, vehicleLng, centerLat, centerLng, radiusKm)
	return distance < 0
}

func GetDistanceMetrics(vehicleLat, vehicleLng, centerLat, centerLng, radiusKm float64) map[string]float64 {
	vehicle := Point{Lat: vehicleLat, Lng: vehicleLng}
	center := Point{Lat: centerLat, Lng: centerLng}
	
	distanceFromCenter := HaversineDistance(vehicle, center)
	distanceFromBoundary := radiusKm - distanceFromCenter
	
	return map[string]float64{
		"distanceFromCenter":   distanceFromCenter,
		"distanceFromBoundary": distanceFromBoundary,
		"boundaryRadius":       radiusKm,
		"percentageUsed":       math.Min(100, (distanceFromCenter/radiusKm)*100),
	}
}
