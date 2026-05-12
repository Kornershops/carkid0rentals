package cache

import (
	"context"
	"log"
	"time"

	"gorm.io/gorm"
)

type Warmer struct {
	cache    *CacheManager
	strategy *Strategy
	db       *gorm.DB
}

func NewWarmer(cache *CacheManager, db *gorm.DB) *Warmer {
	return &Warmer{
		cache:    cache,
		strategy: NewStrategy(cache),
		db:       db,
	}
}

func (w *Warmer) WarmAll(ctx context.Context) error {
	log.Println("Starting cache warming...")

	if err := w.WarmActiveRentals(ctx); err != nil {
		log.Printf("Failed to warm active rentals: %v", err)
	}

	if err := w.WarmAvailableVehicles(ctx); err != nil {
		log.Printf("Failed to warm available vehicles: %v", err)
	}

	if err := w.WarmPopularListings(ctx); err != nil {
		log.Printf("Failed to warm popular listings: %v", err)
	}

	log.Println("Cache warming completed")
	return nil
}

func (w *Warmer) WarmActiveRentals(ctx context.Context) error {
	var rentals []interface{}
	if err := w.db.WithContext(ctx).
		Where("is_active = ? AND end_time > ?", true, time.Now()).
		Find(&rentals).Error; err != nil {
		return err
	}

	return w.strategy.CacheActiveRentals(ctx, rentals)
}

func (w *Warmer) WarmAvailableVehicles(ctx context.Context) error {
	tiers := []string{"", "eco-gig", "elite", "heavy-haul"}

	for _, tier := range tiers {
		var vehicles []interface{}
		query := w.db.WithContext(ctx).Where("status = ?", "available")
		if tier != "" {
			query = query.Where("tier = ?", tier)
		}

		if err := query.Find(&vehicles).Error; err != nil {
			return err
		}

		if err := w.strategy.CacheAvailableVehicles(ctx, tier, vehicles); err != nil {
			return err
		}
	}

	return nil
}

func (w *Warmer) WarmPopularListings(ctx context.Context) error {
	var listings []struct {
		ID string
	}

	if err := w.db.WithContext(ctx).
		Table("listings").
		Select("id").
		Where("status = ?", "active").
		Order("created_at DESC").
		Limit(50).
		Find(&listings).Error; err != nil {
		return err
	}

	for _, listing := range listings {
		var fullListing interface{}
		if err := w.db.WithContext(ctx).
			Where("id = ?", listing.ID).
			First(&fullListing).Error; err != nil {
			continue
		}

		w.strategy.CacheListing(ctx, listing.ID, fullListing)
	}

	return nil
}

func (w *Warmer) ScheduleWarming(interval time.Duration) {
	ticker := time.NewTicker(interval)
	go func() {
		for range ticker.C {
			ctx := context.Background()
			if err := w.WarmAll(ctx); err != nil {
				log.Printf("Scheduled cache warming failed: %v", err)
			}
		}
	}()
}

func (w *Warmer) WarmUserData(ctx context.Context, userID string) error {
	var user interface{}
	if err := w.db.WithContext(ctx).
		Where("id = ?", userID).
		First(&user).Error; err != nil {
		return err
	}

	if err := w.strategy.CacheUser(ctx, userID, user); err != nil {
		return err
	}

	var bookings []interface{}
	if err := w.db.WithContext(ctx).
		Where("user_id = ?", userID).
		Order("created_at DESC").
		Limit(10).
		Find(&bookings).Error; err != nil {
		return err
	}

	return w.strategy.CacheUserBookings(ctx, userID, bookings)
}
