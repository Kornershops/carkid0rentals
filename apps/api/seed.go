package main

import (
	"log"
	"time"

	"github.com/carkid0/rentals/api/config"
	"github.com/carkid0/rentals/api/domain/auth"
	"github.com/carkid0/rentals/api/domain/listings"
)

func main() {
	// Connect to database
	config.ConnectDB()
	if config.DB == nil {
		log.Fatal("Database connection failed")
	}

	// Auto-migrate
	config.DB.AutoMigrate(&auth.User{}, &listings.Listing{})

	// Seed admin user
	adminUser := auth.User{
		Phone:     "+234 800 000 0001",
		Email:     "admin@carkid0.com",
		FullName:  "CarKid0 Admin",
		Role:      "admin",
		KYCStatus: auth.KYCApproved,
		Country:   "Nigeria",
		City:      "Lagos",
		CreatedAt: time.Now(),
	}
	config.DB.FirstOrCreate(&adminUser, auth.User{Phone: adminUser.Phone})
	log.Println("✅ Admin user created")

	// Seed sample listings
	sampleListings := []listings.Listing{
		{
			Title:       "Mercedes-Benz GLE Coupe AMG",
			Brand:       "Mercedes-Benz",
			Model:       "GLE Coupe",
			Year:        2023,
			Category:    "exotic",
			PricePerDay: 450,
			Images:      []string{"/fleet/cars/mercedes-gle-coupe/exterior-front.png"},
			Location:    "Lagos",
			Country:     "Nigeria",
			Features:    []string{"AMG Performance", "Airmatic Suspension", "MBUX"},
			ListerID:    adminUser.ID,
			ListerRole:  "admin",
			ListerName:  "CarKid0 Official",
			Status:      "approved",
		},
		{
			Title:       "Wuling Bingo EV (Blue)",
			Brand:       "Wuling",
			Model:       "Bingo EV",
			Year:        2024,
			Category:    "eco-gig",
			PricePerDay: 35,
			Images:      []string{"/fleet/cars/wuling-bingo-ev-blue/exterior-front.png"},
			Location:    "Lagos",
			Country:     "Nigeria",
			Features:    []string{"Zero Emissions", "Fast Charging", "Smart Connect"},
			ListerID:    adminUser.ID,
			ListerRole:  "admin",
			ListerName:  "CarKid0 Official",
			Status:      "approved",
			IsEV:        true,
		},
		{
			Title:       "Jet Mover EV (White)",
			Brand:       "Jet Motor",
			Model:       "Mover EV",
			Year:        2023,
			Category:    "heavy-haul",
			PricePerDay: 180,
			Images:      []string{"/fleet/cars/jet-mover-ev-white/exterior-front.png"},
			Location:    "Lagos",
			Country:     "Nigeria",
			Features:    []string{"Zero Emission Logistics", "High Payload", "Fleet Tracking"},
			ListerID:    adminUser.ID,
			ListerRole:  "admin",
			ListerName:  "CarKid0 Official",
			Status:      "approved",
			IsEV:        true,
		},
	}

	for _, listing := range sampleListings {
		config.DB.FirstOrCreate(&listing, listings.Listing{Title: listing.Title})
		log.Printf("✅ Listing created: %s\n", listing.Title)
	}

	log.Println("🎉 Database seeded successfully!")
}
