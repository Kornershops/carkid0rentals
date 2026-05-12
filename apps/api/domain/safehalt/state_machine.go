package safehalt

import "time"

type ViolationState string

const (
	StateNormal      ViolationState = "NORMAL"
	StateWarning     ViolationState = "WARNING"
	StateLimp1       ViolationState = "LIMP_MODE_1"
	StateLimp2       ViolationState = "LIMP_MODE_2"
	StateImmobilized ViolationState = "IMMOBILIZED"
)

type ViolationType string

const (
	ViolationGeofence ViolationType = "GEOFENCE"
	ViolationTime     ViolationType = "TIME_EXPIRED"
	ViolationBoth     ViolationType = "BOTH"
	ViolationNone     ViolationType = "NONE"
)

type StateMachine struct {
	CurrentState    ViolationState
	ViolationType   ViolationType
	WarningStarted  *time.Time
	Limp1Started    *time.Time
	Limp2Started    *time.Time
	LastTransition  time.Time
}

func NewStateMachine() *StateMachine {
	return &StateMachine{
		CurrentState:   StateNormal,
		ViolationType:  ViolationNone,
		LastTransition: time.Now(),
	}
}

func (sm *StateMachine) GetNextState(violation ViolationType, distanceKm float64, speedKmh float64, violationDuration time.Duration) ViolationState {
	if violation == ViolationNone {
		return StateNormal
	}

	switch sm.CurrentState {
	case StateNormal:
		if violation != ViolationNone {
			return StateWarning
		}
	case StateWarning:
		if violationDuration >= 5*time.Minute || distanceKm > 0.5 {
			return StateLimp1
		}
	case StateLimp1:
		if violationDuration >= 10*time.Minute || distanceKm > 1.0 {
			return StateLimp2
		}
	case StateLimp2:
		if speedKmh < 5.0 {
			return StateImmobilized
		}
	}

	return sm.CurrentState
}

func (sm *StateMachine) Transition(newState ViolationState, violationType ViolationType) {
	now := time.Now()
	sm.CurrentState = newState
	sm.ViolationType = violationType
	sm.LastTransition = now

	switch newState {
	case StateWarning:
		if sm.WarningStarted == nil {
			sm.WarningStarted = &now
		}
	case StateLimp1:
		if sm.Limp1Started == nil {
			sm.Limp1Started = &now
		}
	case StateLimp2:
		if sm.Limp2Started == nil {
			sm.Limp2Started = &now
		}
	case StateNormal:
		sm.WarningStarted = nil
		sm.Limp1Started = nil
		sm.Limp2Started = nil
	}
}

func (sm *StateMachine) GetViolationDuration() time.Duration {
	if sm.WarningStarted == nil {
		return 0
	}
	return time.Since(*sm.WarningStarted)
}

func (sm *StateMachine) Reset() {
	sm.CurrentState = StateNormal
	sm.ViolationType = ViolationNone
	sm.WarningStarted = nil
	sm.Limp1Started = nil
	sm.Limp2Started = nil
	sm.LastTransition = time.Now()
}
