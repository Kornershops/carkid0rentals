package main

import (
	"log"
	"os"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

type Reward struct {
	ID             uint   `gorm:"primaryKey"`
	Name           string `gorm:"not null"`
	Description    string
	PointsRequired int    `gorm:"not null"`
	Type           string `gorm:"not null"`
	Value          string
	Active         bool `gorm:"default:true"`
}

func main() {
	dsn := os.Getenv("DATABASE_URL")
	if dsn == "" {
		dsn = "host=localhost user=admin password=password dbname=carkid0_rentals port=5432 sslmode=disable"
	}

	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}

	rewards := []Reward{
		{Name: "5% Discount Coupon", Description: "Get 5% off your next booking", PointsRequired: 300, Type: "discount", Value: "5%", Active: true},
		{Name: "10% Discount Coupon", Description: "Get 10% off your next booking", PointsRequired: 500, Type: "discount", Value: "10%", Active: true},
		{Name: "15% Discount Coupon", Description: "Get 15% off your next booking", PointsRequired: 1000, Type: "discount", Value: "15%", Active: true},
		{Name: "20% Discount Coupon", Description: "Get 20% off your next booking", PointsRequired: 2000, Type: "discount", Value: "20%", Active: true},
		{Name: "25% Discount Coupon", Description: "Get 25% off your next booking", PointsRequired: 3000, Type: "discount", Value: "25%", Active: true},
		{Name: "Free Day Rental", Description: "Get 1 day free rental on any vehicle", PointsRequired: 5000, Type: "voucher", Value: "1_day", Active: true},
		{Name: "Free Weekend Rental", Description: "Get 2 days free rental on any vehicle", PointsRequired: 8000, Type: "voucher", Value: "2_days", Active: true},
		{Name: "Free Week Rental", Description: "Get 7 days free rental on any vehicle", PointsRequired: 20000, Type: "voucher", Value: "7_days", Active: true},
		{Name: "Free Vehicle Upgrade", Description: "Upgrade to next tier vehicle for free", PointsRequired: 3000, Type: "voucher", Value: "upgrade", Active: true},
		{Name: "Free Premium Upgrade", Description: "Upgrade to premium tier vehicle", PointsRequired: 5000, Type: "voucher", Value: "premium_upgrade", Active: true},
		{Name: "Priority Support", Description: "Get priority customer support for 30 days", PointsRequired: 1500, Type: "service", Value: "priority_30d", Active: true},
		{Name: "Airport Pickup", Description: "Free airport pickup service", PointsRequired: 2500, Type: "service", Value: "airport_pickup", Active: true},
		{Name: "Airport Drop-off", Description: "Free airport drop-off service", PointsRequired: 2500, Type: "service", Value: "airport_dropoff", Active: true},
		{Name: "Concierge Service", Description: "Personal concierge for your trip", PointsRequired: 4000, Type: "service", Value: "concierge", Active: true},
		{Name: "Free Fuel Fill-up", Description: "Get a full tank on pickup", PointsRequired: 1000, Type: "service", Value: "fuel_fillup", Active: true},
		{Name: "Hotel Discount", Description: "20% off partner hotels", PointsRequired: 1000, Type: "partner", Value: "hotel_20", Active: true},
		{Name: "Restaurant Voucher", Description: "$50 restaurant voucher", PointsRequired: 1500, Type: "partner", Value: "restaurant_50", Active: true},
		{Name: "Spa Treatment", Description: "Free spa treatment at partner locations", PointsRequired: 3000, Type: "partner", Value: "spa", Active: true},
		{Name: "Golf Course Access", Description: "Free round of golf at partner courses", PointsRequired: 2500, Type: "partner", Value: "golf", Active: true},
		{Name: "Event Tickets", Description: "Complimentary event tickets", PointsRequired: 4000, Type: "partner", Value: "events", Active: true},
		{Name: "Extended Rental Period", Description: "Get 2 extra hours on any rental", PointsRequired: 800, Type: "perk", Value: "2_hours", Active: true},
		{Name: "Late Return Grace", Description: "No late fees for 24 hours", PointsRequired: 1200, Type: "perk", Value: "late_grace", Active: true},
		{Name: "Mileage Bonus", Description: "Extra 200 miles included", PointsRequired: 1500, Type: "perk", Value: "200_miles", Active: true},
		{Name: "Insurance Upgrade", Description: "Premium insurance at no cost", PointsRequired: 2000, Type: "perk", Value: "insurance", Active: true},
		{Name: "VIP Treatment", Description: "Red carpet service for your rental", PointsRequired: 6000, Type: "perk", Value: "vip", Active: true},
	}

	for _, reward := range rewards {
		if err := db.Create(&reward).Error; err != nil {
			log.Printf("Error creating reward %s: %v", reward.Name, err)
		} else {
			log.Printf("✓ Created: %s (%d points)", reward.Name, reward.PointsRequired)
		}
	}

	log.Println("\n✅ Rewards catalog seeded successfully! (25 rewards)")
}
