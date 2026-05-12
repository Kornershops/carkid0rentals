package config

import (
	"log"

	"gorm.io/gorm"
)

func CreateIndexes(db *gorm.DB) error {
	log.Println("Creating database indexes...")

	indexes := []struct {
		table   string
		name    string
		columns []string
	}{
		// RentalSession indexes
		{"rental_sessions", "idx_rental_sessions_vehicle_active", []string{"vehicle_id", "is_active"}},
		{"rental_sessions", "idx_rental_sessions_end_time", []string{"end_time"}},
		{"rental_sessions", "idx_rental_sessions_booking", []string{"booking_id"}},
		{"rental_sessions", "idx_rental_sessions_user", []string{"user_id"}},
		{"rental_sessions", "idx_rental_sessions_state", []string{"current_state"}},

		// TelemetryLog indexes
		{"telemetry_logs", "idx_telemetry_vehicle_time", []string{"vehicle_id", "timestamp"}},
		{"telemetry_logs", "idx_telemetry_session", []string{"session_id"}},
		{"telemetry_logs", "idx_telemetry_timestamp", []string{"timestamp"}},

		// StateTransition indexes
		{"state_transitions", "idx_state_vehicle_time", []string{"vehicle_id", "timestamp"}},
		{"state_transitions", "idx_state_session", []string{"session_id"}},
		{"state_transitions", "idx_state_to_state", []string{"to_state"}},
		{"state_transitions", "idx_state_executed", []string{"executed"}},

		// Bookings indexes
		{"bookings", "idx_bookings_status", []string{"status"}},
		{"bookings", "idx_bookings_dates", []string{"start_date", "end_date"}},
		{"bookings", "idx_bookings_user", []string{"user_id"}},
		{"bookings", "idx_bookings_listing", []string{"listing_id"}},
		{"bookings", "idx_bookings_created", []string{"created_at"}},

		// Users indexes
		{"users", "idx_users_phone", []string{"phone"}},
		{"users", "idx_users_email", []string{"email"}},
		{"users", "idx_users_role", []string{"role"}},
		{"users", "idx_users_kyc_status", []string{"kyc_status"}},

		// Vehicles indexes
		{"vehicles", "idx_vehicles_status", []string{"status"}},
		{"vehicles", "idx_vehicles_tier", []string{"tier"}},
		{"vehicles", "idx_vehicles_location", []string{"current_lat", "current_lng"}},

		// Listings indexes
		{"listings", "idx_listings_status", []string{"status"}},
		{"listings", "idx_listings_category", []string{"category"}},
		{"listings", "idx_listings_price", []string{"price_per_day"}},
		{"listings", "idx_listings_created", []string{"created_at"}},

		// Messages indexes
		{"messages", "idx_messages_sender", []string{"sender_id"}},
		{"messages", "idx_messages_receiver", []string{"receiver_id"}},
		{"messages", "idx_messages_read", []string{"is_read"}},
		{"messages", "idx_messages_created", []string{"created_at"}},
	}

	for _, idx := range indexes {
		sql := "CREATE INDEX IF NOT EXISTS " + idx.name + " ON " + idx.table + " ("
		for i, col := range idx.columns {
			if i > 0 {
				sql += ", "
			}
			sql += col
		}
		sql += ")"

		if err := db.Exec(sql).Error; err != nil {
			log.Printf("Failed to create index %s: %v", idx.name, err)
			continue
		}
		log.Printf("✓ Created index: %s", idx.name)
	}

	log.Println("Database indexes created successfully")
	return nil
}

func OptimizeQueries(db *gorm.DB) error {
	log.Println("Running query optimizations...")

	optimizations := []string{
		"ANALYZE rental_sessions",
		"ANALYZE telemetry_logs",
		"ANALYZE state_transitions",
		"ANALYZE bookings",
		"ANALYZE users",
		"ANALYZE vehicles",
		"ANALYZE listings",
		"ANALYZE messages",
	}

	for _, sql := range optimizations {
		if err := db.Exec(sql).Error; err != nil {
			log.Printf("Failed to run: %s - %v", sql, err)
			continue
		}
		log.Printf("✓ Optimized: %s", sql)
	}

	log.Println("Query optimizations complete")
	return nil
}
