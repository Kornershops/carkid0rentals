package telemetry

import (
	"log"
	"math"
	"time"
)

// SafeHaltEngine simulates the continuous monitoring of vehicle coordinates
// against their allowed PostGIS geofence boundaries.
type SafeHaltEngine struct {
	IsShadowMode bool
}

// Coordinate represents a mock GPS ping
type Coordinate struct {
	Lat   float64
	Lng   float64
	Speed float64
}

func NewSafeHaltEngine(shadowMode bool) *SafeHaltEngine {
	return &SafeHaltEngine{IsShadowMode: shadowMode}
}

// MonitorVehicle starts a mock goroutine simulating EMQX MQTT subscription
func (e *SafeHaltEngine) MonitorVehicle(vehicleID string) {
	log.Printf("[Safe-Halt] Starting telemetry monitor for %s", vehicleID)

	go func() {
		// Simulating incoming MQTT coordinate pings every 5 seconds
		ticker := time.NewTicker(5 * time.Second)
		defer ticker.Stop()

		for {
			select {
			case <-ticker.C:
				// In a real app, this data comes from MQTT payload
				mockPing := Coordinate{Lat: 6.52, Lng: 3.37, Speed: 4.5} 
				
				// Calculate distance to boundary (Mock PostGIS call)
				distanceToBoundaryKm := e.calculateDistanceToGeofence(mockPing)

				e.evaluateKillswitchRules(vehicleID, mockPing, distanceToBoundaryKm)
			}
		}
	}()
}

func (e *SafeHaltEngine) calculateDistanceToGeofence(coord Coordinate) float64 {
	// MOCK: Returns distance in kilometers to the geofence boundary.
	// In production, this uses `ST_DistanceSphere` in PostGIS.
	return math.Abs(coord.Lat - 6.6) // Fake calculation
}

func (e *SafeHaltEngine) evaluateKillswitchRules(vehicleID string, coord Coordinate, distanceKm float64) {
	if distanceKm > 1.0 {
		// Vehicle is safely inside boundary
		return
	}

	if distanceKm <= 1.0 && distanceKm > 0 {
		log.Printf("[WARN] %s approaching boundary. Triggering cabin buzzer.", vehicleID)
		e.sendCommand(vehicleID, "TRIGGER_BUZZER")
		return
	}

	if distanceKm <= 0 {
		log.Printf("[CRITICAL] %s crossed boundary.", vehicleID)
		e.sendCommand(vehicleID, "ENGAGE_LIMP_MODE") // Cap speed to 40km/h via CAN-bus

		if coord.Speed < 5.0 {
			log.Printf("[KILL] %s speed < 5km/h out of bounds. Executing engine cut.", vehicleID)
			e.sendCommand(vehicleID, "CUT_STARTER_RELAY")
		}
	}
}

func (e *SafeHaltEngine) sendCommand(vehicleID string, command string) {
	if e.IsShadowMode {
		log.Printf("[SHADOW PILOT] Blocked real execution of %s for %s. Logged to DB instead.", command, vehicleID)
		// DB.Save(&ShadowLog{Command: command, Vehicle: vehicleID})
		return
	}

	log.Printf("=> [MQTT PUBLISH] Sent %s to vehicle %s via Wialon API", command, vehicleID)
}
