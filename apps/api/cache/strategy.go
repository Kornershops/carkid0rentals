package cache

import (
	"context"
	"time"
)

const (
	TTLShort  = 5 * time.Minute
	TTLMedium = 30 * time.Minute
	TTLLong   = 2 * time.Hour
	TTLDay    = 24 * time.Hour
)

type Strategy struct {
	cache *CacheManager
}

func NewStrategy(cache *CacheManager) *Strategy {
	return &Strategy{cache: cache}
}

func (s *Strategy) CacheUser(ctx context.Context, userID string, user interface{}) error {
	return s.cache.Set(ctx, UserCacheKey(userID), user, TTLMedium)
}

func (s *Strategy) GetCachedUser(ctx context.Context, userID string, dest interface{}) error {
	return s.cache.Get(ctx, UserCacheKey(userID), dest)
}

func (s *Strategy) InvalidateUser(ctx context.Context, userID string) error {
	return s.cache.Delete(ctx, UserCacheKey(userID))
}

func (s *Strategy) CacheListing(ctx context.Context, listingID string, listing interface{}) error {
	return s.cache.Set(ctx, ListingCacheKey(listingID), listing, TTLLong)
}

func (s *Strategy) GetCachedListing(ctx context.Context, listingID string, dest interface{}) error {
	return s.cache.Get(ctx, ListingCacheKey(listingID), dest)
}

func (s *Strategy) InvalidateListing(ctx context.Context, listingID string) error {
	return s.cache.Delete(ctx, ListingCacheKey(listingID))
}

func (s *Strategy) CacheVehicleLocation(ctx context.Context, vehicleID string, location interface{}) error {
	return s.cache.Set(ctx, VehicleCacheKey(vehicleID), location, TTLShort)
}

func (s *Strategy) GetCachedVehicleLocation(ctx context.Context, vehicleID string, dest interface{}) error {
	return s.cache.Get(ctx, VehicleCacheKey(vehicleID), dest)
}

func (s *Strategy) CacheActiveRentals(ctx context.Context, rentals interface{}) error {
	return s.cache.Set(ctx, ActiveRentalsCacheKey(), rentals, TTLShort)
}

func (s *Strategy) GetCachedActiveRentals(ctx context.Context, dest interface{}) error {
	return s.cache.Get(ctx, ActiveRentalsCacheKey(), dest)
}

func (s *Strategy) InvalidateActiveRentals(ctx context.Context) error {
	return s.cache.Delete(ctx, ActiveRentalsCacheKey())
}

func (s *Strategy) CacheAvailableVehicles(ctx context.Context, tier string, vehicles interface{}) error {
	return s.cache.Set(ctx, AvailableVehiclesCacheKey(tier), vehicles, TTLMedium)
}

func (s *Strategy) GetCachedAvailableVehicles(ctx context.Context, tier string, dest interface{}) error {
	return s.cache.Get(ctx, AvailableVehiclesCacheKey(tier), dest)
}

func (s *Strategy) InvalidateAvailableVehicles(ctx context.Context) error {
	return s.cache.Invalidate(ctx, "available_vehicles:*")
}

func (s *Strategy) CacheBooking(ctx context.Context, bookingID string, booking interface{}) error {
	return s.cache.Set(ctx, BookingCacheKey(bookingID), booking, TTLMedium)
}

func (s *Strategy) GetCachedBooking(ctx context.Context, bookingID string, dest interface{}) error {
	return s.cache.Get(ctx, BookingCacheKey(bookingID), dest)
}

func (s *Strategy) InvalidateBooking(ctx context.Context, bookingID string) error {
	return s.cache.Delete(ctx, BookingCacheKey(bookingID))
}

func (s *Strategy) CacheUserBookings(ctx context.Context, userID string, bookings interface{}) error {
	return s.cache.Set(ctx, UserBookingsCacheKey(userID), bookings, TTLMedium)
}

func (s *Strategy) GetCachedUserBookings(ctx context.Context, userID string, dest interface{}) error {
	return s.cache.Get(ctx, UserBookingsCacheKey(userID), dest)
}

func (s *Strategy) InvalidateUserBookings(ctx context.Context, userID string) error {
	return s.cache.Delete(ctx, UserBookingsCacheKey(userID))
}

func (s *Strategy) CacheRentalSession(ctx context.Context, sessionID string, session interface{}) error {
	return s.cache.Set(ctx, RentalSessionCacheKey(sessionID), session, TTLShort)
}

func (s *Strategy) GetCachedRentalSession(ctx context.Context, sessionID string, dest interface{}) error {
	return s.cache.Get(ctx, RentalSessionCacheKey(sessionID), dest)
}

func (s *Strategy) InvalidateRentalSession(ctx context.Context, sessionID string) error {
	return s.cache.Delete(ctx, RentalSessionCacheKey(sessionID))
}

func (s *Strategy) GetOrFetch(ctx context.Context, key string, ttl time.Duration, fetchFn func() (interface{}, error), dest interface{}) error {
	return s.cache.GetOrSet(ctx, key, ttl, fetchFn, dest)
}

func (s *Strategy) InvalidateAll(ctx context.Context, patterns ...string) error {
	for _, pattern := range patterns {
		if err := s.cache.Invalidate(ctx, pattern); err != nil {
			return err
		}
	}
	return nil
}
