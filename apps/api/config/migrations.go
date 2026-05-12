package config

import (
	"log"

	"github.com/carkid0/rentals/api/domain/auth"
	"github.com/carkid0/rentals/api/domain/bookings"
	"github.com/carkid0/rentals/api/domain/drivers"
	"github.com/carkid0/rentals/api/domain/fleet"
	"github.com/carkid0/rentals/api/domain/lister"
	"github.com/carkid0/rentals/api/domain/listings"
	"github.com/carkid0/rentals/api/domain/messages"
	"github.com/carkid0/rentals/api/domain/payments"
	"github.com/carkid0/rentals/api/domain/safehalt"
	"gorm.io/gorm"
)

func RunMigrations(db *gorm.DB) error {
	log.Println("Running database migrations...")

	models := []interface{}{
		&auth.User{},
		&bookings.Booking{},
		&drivers.Driver{},
		&fleet.Vehicle{},
		&lister.Lister{},
		&listings.Listing{},
		&messages.Message{},
		&payments.Payment{},
		&safehalt.RentalSession{},
		&safehalt.TelemetryLog{},
		&safehalt.StateTransition{},
	}

	for _, model := range models {
		if err := db.AutoMigrate(model); err != nil {
			log.Printf("Migration failed for %T: %v", model, err)
			return err
		}
		log.Printf("✓ Migrated: %T", model)
	}

	if err := CreateIndexes(db); err != nil {
		return err
	}

	if err := OptimizeQueries(db); err != nil {
		return err
	}

	log.Println("All migrations completed successfully")
	return nil
}
