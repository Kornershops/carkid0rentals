package cache

import (
	"context"
	"encoding/json"
	"fmt"
	"time"

	"github.com/redis/go-redis/v9"
)

type CacheManager struct {
	client *redis.Client
}

func NewCacheManager(addr, password string, db int) *CacheManager {
	client := redis.NewClient(&redis.Options{
		Addr:     addr,
		Password: password,
		DB:       db,
	})

	return &CacheManager{client: client}
}

func (c *CacheManager) Set(ctx context.Context, key string, value interface{}, ttl time.Duration) error {
	data, err := json.Marshal(value)
	if err != nil {
		return err
	}
	return c.client.Set(ctx, key, data, ttl).Err()
}

func (c *CacheManager) Get(ctx context.Context, key string, dest interface{}) error {
	data, err := c.client.Get(ctx, key).Result()
	if err != nil {
		return err
	}
	return json.Unmarshal([]byte(data), dest)
}

func (c *CacheManager) Delete(ctx context.Context, keys ...string) error {
	return c.client.Del(ctx, keys...).Err()
}

func (c *CacheManager) Exists(ctx context.Context, key string) bool {
	result, _ := c.client.Exists(ctx, key).Result()
	return result > 0
}

func (c *CacheManager) Invalidate(ctx context.Context, pattern string) error {
	iter := c.client.Scan(ctx, 0, pattern, 0).Iterator()
	var keys []string
	for iter.Next(ctx) {
		keys = append(keys, iter.Val())
	}
	if err := iter.Err(); err != nil {
		return err
	}
	if len(keys) > 0 {
		return c.client.Del(ctx, keys...).Err()
	}
	return nil
}

func (c *CacheManager) GetOrSet(ctx context.Context, key string, ttl time.Duration, fn func() (interface{}, error), dest interface{}) error {
	if err := c.Get(ctx, key, dest); err == nil {
		return nil
	}

	value, err := fn()
	if err != nil {
		return err
	}

	if err := c.Set(ctx, key, value, ttl); err != nil {
		return err
	}

	data, err := json.Marshal(value)
	if err != nil {
		return err
	}
	return json.Unmarshal(data, dest)
}

func (c *CacheManager) SetHash(ctx context.Context, key string, field string, value interface{}, ttl time.Duration) error {
	data, err := json.Marshal(value)
	if err != nil {
		return err
	}
	if err := c.client.HSet(ctx, key, field, data).Err(); err != nil {
		return err
	}
	return c.client.Expire(ctx, key, ttl).Err()
}

func (c *CacheManager) GetHash(ctx context.Context, key string, field string, dest interface{}) error {
	data, err := c.client.HGet(ctx, key, field).Result()
	if err != nil {
		return err
	}
	return json.Unmarshal([]byte(data), dest)
}

func (c *CacheManager) Increment(ctx context.Context, key string, ttl time.Duration) (int64, error) {
	val, err := c.client.Incr(ctx, key).Result()
	if err != nil {
		return 0, err
	}
	c.client.Expire(ctx, key, ttl)
	return val, nil
}

func (c *CacheManager) Close() error {
	return c.client.Close()
}

func (c *CacheManager) Ping(ctx context.Context) error {
	return c.client.Ping(ctx).Err()
}

func UserCacheKey(userID string) string {
	return fmt.Sprintf("user:%s", userID)
}

func ListingCacheKey(listingID string) string {
	return fmt.Sprintf("listing:%s", listingID)
}

func VehicleCacheKey(vehicleID string) string {
	return fmt.Sprintf("vehicle:%s", vehicleID)
}

func BookingCacheKey(bookingID string) string {
	return fmt.Sprintf("booking:%s", bookingID)
}

func RentalSessionCacheKey(sessionID string) string {
	return fmt.Sprintf("rental_session:%s", sessionID)
}

func ActiveRentalsCacheKey() string {
	return "active_rentals"
}

func AvailableVehiclesCacheKey(tier string) string {
	if tier == "" {
		return "available_vehicles:all"
	}
	return fmt.Sprintf("available_vehicles:%s", tier)
}

func UserBookingsCacheKey(userID string) string {
	return fmt.Sprintf("user_bookings:%s", userID)
}
