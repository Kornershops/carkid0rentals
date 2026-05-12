package safehalt

import (
	"context"
	"log"
	"time"
)

type Engine struct {
	stateMachines map[string]*StateMachine
	detectors     map[string]*ViolationDetector
	shadowMode    bool
}

func NewEngine(shadowMode bool) *Engine {
	return &Engine{
		stateMachines: make(map[string]*StateMachine),
		detectors:     make(map[string]*ViolationDetector),
		shadowMode:    shadowMode,
	}
}

func (e *Engine) RegisterRental(vehicleID string, centerLat, centerLng, radiusKm float64, startTime, endTime time.Time) {
	e.stateMachines[vehicleID] = NewStateMachine()
	e.detectors[vehicleID] = NewViolationDetector(centerLat, centerLng, radiusKm, startTime, endTime)
	log.Printf("[Safe-Halt] Registered rental for vehicle %s", vehicleID)
}

func (e *Engine) ProcessTelemetry(ctx context.Context, vehicleID string, lat, lng, speed float64) {
	sm, ok := e.stateMachines[vehicleID]
	if !ok {
		return
	}

	detector, ok := e.detectors[vehicleID]
	if !ok {
		return
	}

	result := detector.CheckViolation(lat, lng)
	
	if !result.HasViolation {
		if sm.CurrentState != StateNormal {
			sm.Reset()
			log.Printf("[Safe-Halt] %s returned to normal", vehicleID)
		}
		return
	}

	violationDuration := sm.GetViolationDuration()
	distanceFromBoundary := result.DistanceFromBoundary
	if distanceFromBoundary < 0 {
		distanceFromBoundary = -distanceFromBoundary
	}

	nextState := sm.GetNextState(result.ViolationType, distanceFromBoundary, speed, violationDuration)
	
	if nextState != sm.CurrentState {
		sm.Transition(nextState, result.ViolationType)
		command := GetCommandForState(nextState)
		e.executeCommand(vehicleID, command, nextState)
	}
}

func (e *Engine) executeCommand(vehicleID string, command Command, state ViolationState) {
	if e.shadowMode {
		log.Printf("[SHADOW] Would execute %s for %s (State: %s)", command, vehicleID, state)
		return
	}
	log.Printf("[EXECUTE] Sending %s to %s (State: %s)", command, vehicleID, state)
}

func (e *Engine) GetVehicleState(vehicleID string) (ViolationState, ViolationType) {
	sm, ok := e.stateMachines[vehicleID]
	if !ok {
		return StateNormal, ViolationNone
	}
	return sm.CurrentState, sm.ViolationType
}

func (e *Engine) UnregisterRental(vehicleID string) {
	delete(e.stateMachines, vehicleID)
	delete(e.detectors, vehicleID)
	log.Printf("[Safe-Halt] Unregistered rental for vehicle %s", vehicleID)
}
