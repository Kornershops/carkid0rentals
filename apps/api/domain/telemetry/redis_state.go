package telemetry

import (
	"context"
	"encoding/json"
	"fmt"
	"time"
)

type VehicleState struct {
	VehicleID        string    `json:"vehicleId"`
	BookingID        string    `json:"bookingId"`
	CurrentLat       float64   `json:"currentLat"`
	CurrentLng       float64   `json:"currentLng"`
	Speed            float64   `json:"speed"`
	State            string    `json:"state"`
	ViolationType    string    `json:"violationType"`
	LastPing         time.Time `json:"lastPing"`
	HeartbeatInterval int      `json:"heartbeatInterval"`
	GeofenceCenterLat float64  `json:"geofenceCenterLat"`
	GeofenceCenterLng float64  `json:"geofenceCenterLng"`
	GeofenceRadius    float64  `json:"geofenceRadius"`
	RentalEndTime     time.Time `json:"rentalEndTime"`
}

type RedisClient interface {
	Set(ctx context.Context, key string, value interface{}, expiration time.Duration) error
	Get(ctx context.Context, key string) (string, error)
	Del(ctx context.Context, keys ...string) error
}

type RedisStateManager struct {
	client RedisClient
	ttl    time.Duration
}

func NewRedisStateManager(client RedisClient) *RedisStateManager {
	return &RedisStateManager{
		client: client,
		ttl:    24 * time.Hour,
	}
}

func (r *RedisStateManager) SaveState(ctx context.Context, state *VehicleState) error {
	key := fmt.Sprintf("vehicle:state:%s", state.VehicleID)
	data, err := json.Marshal(state)
	if err != nil {
		return err
	}
	return r.client.Set(ctx, key, data, r.ttl)
}

func (r *RedisStateManager) GetState(ctx context.Context, vehicleID string) (*VehicleState, error) {
	key := fmt.Sprintf("vehicle:state:%s", vehicleID)
	data, err := r.client.Get(ctx, key)
	if err != nil {
		return nil, err
	}
	
	var state VehicleState
	if err := json.Unmarshal([]byte(data), &state); err != nil {
		return nil, err
	}
	return &state, nil
}

func (r *RedisStateManager) DeleteState(ctx context.Context, vehicleID string) error {
	key := fmt.Sprintf("vehicle:state:%s", vehicleID)
	return r.client.Del(ctx, key)
}

func (r *RedisStateManager) UpdateLocation(ctx context.Context, vehicleID string, lat, lng, speed float64) error {
	state, err := r.GetState(ctx, vehicleID)
	if err != nil {
		return err
	}
	
	state.CurrentLat = lat
	state.CurrentLng = lng
	state.Speed = speed
	state.LastPing = time.Now()
	
	return r.SaveState(ctx, state)
}
