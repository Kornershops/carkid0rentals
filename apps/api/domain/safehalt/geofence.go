package safehalt

import "math"

type Point struct {
	Lat float64
	Lng float64
}

type Geofence struct {
	Center Point
	Radius float64
}

func HaversineDistance(p1, p2 Point) float64 {
	const earthRadius = 6371.0

	lat1 := p1.Lat * math.Pi / 180
	lat2 := p2.Lat * math.Pi / 180
	deltaLat := (p2.Lat - p1.Lat) * math.Pi / 180
	deltaLng := (p2.Lng - p1.Lng) * math.Pi / 180

	a := math.Sin(deltaLat/2)*math.Sin(deltaLat/2) +
		math.Cos(lat1)*math.Cos(lat2)*
			math.Sin(deltaLng/2)*math.Sin(deltaLng/2)
	c := 2 * math.Atan2(math.Sqrt(a), math.Sqrt(1-a))

	return earthRadius * c
}

func (g *Geofence) DistanceFromBoundary(point Point) float64 {
	distanceFromCenter := HaversineDistance(g.Center, point)
	return g.Radius - distanceFromCenter
}

func (g *Geofence) IsInside(point Point) bool {
	return g.DistanceFromBoundary(point) >= 0
}

func (g *Geofence) IsNearBoundary(point Point, thresholdKm float64) bool {
	distance := g.DistanceFromBoundary(point)
	return distance >= 0 && distance <= thresholdKm
}
