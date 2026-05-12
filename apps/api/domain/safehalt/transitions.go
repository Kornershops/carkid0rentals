package safehalt

type Command string

const (
	CommandNone            Command = "NONE"
	CommandTriggerBuzzer   Command = "TRIGGER_BUZZER"
	CommandEngageLimp1     Command = "ENGAGE_LIMP_MODE_1"
	CommandEngageLimp2     Command = "ENGAGE_LIMP_MODE_2"
	CommandCutStarterRelay Command = "CUT_STARTER_RELAY"
)

func GetCommandForState(state ViolationState) Command {
	switch state {
	case StateWarning:
		return CommandTriggerBuzzer
	case StateLimp1:
		return CommandEngageLimp1
	case StateLimp2:
		return CommandEngageLimp2
	case StateImmobilized:
		return CommandCutStarterRelay
	default:
		return CommandNone
	}
}

func GetSpeedLimitForState(state ViolationState) float64 {
	switch state {
	case StateLimp1:
		return 40.0
	case StateLimp2:
		return 15.0
	case StateImmobilized:
		return 0.0
	default:
		return 999.0
	}
}

func GetStateDescription(state ViolationState) string {
	switch state {
	case StateNormal:
		return "Vehicle operating normally"
	case StateWarning:
		return "Boundary warning - buzzer active"
	case StateLimp1:
		return "Limp Mode 1 - Speed limited to 40 km/h"
	case StateLimp2:
		return "Limp Mode 2 - Speed limited to 15 km/h"
	case StateImmobilized:
		return "Vehicle immobilized - Starter relay cut"
	default:
		return "Unknown state"
	}
}
